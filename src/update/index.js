const fs = require("fs");
const fsExtra = require("fs-extra");
const path = require("path");
const shell = require("shelljs");
const program = require("commander");
const ora = require("ora");

const updateRunner = require("./updateRunner");
const execPromise = require("../../util/execPromise");
const utils = require("./utils");
const verbose = require("../../util/verbose");
const {
  chalkProcessing,
  chalkInfo,
  chalkWarning,
  logError
} = require("../../util/chalkConfig");

const variables = require("./variables");

module.exports = async function main(updateToVersion, options) {
  try {
    const { list, dev } = options;
    const { PROJECT_BOIL_PATH } = variables;
    const VALID_PROJECT = fs.existsSync(PROJECT_BOIL_PATH);
    const projectBoil =
      VALID_PROJECT && fsExtra.readJSONSync(PROJECT_BOIL_PATH);

    if (projectBoil) {
      // 一些变量的覆盖
      if (projectBoil.boilerplateRepo) {
        variables.boilerplateRepo = projectBoil.boilerplateRepo;
      }
    }

    verbose("udpate with option:" + JSON.stringify(options));
    if (dev) {
      // 更新缓存文件夹目录，
      if (projectBoil && projectBoil.cacheFolder) {
        variables.cacheFolder = projectBoil.cacheFolder;
      }

      // 更新到当前目录
      variables.CACHE_DIR = path.resolve(process.cwd(), variables.cacheFolder);

      //如果是开发模式，直接执行那个目录的更新设置
      await updateRunner.exec(options, updateToVersion);
      return;
    }

    let currentVersion = VALID_PROJECT && projectBoil.version;


    await updateBoilerplate(projectBoil, options);

    let tags = await getTags();

    if (list || program.debug) {
      if (tags && tags.length) {
        console.log("有以下标签：");
        console.log(chalkInfo(tags.join("  ")));
      } else {
        console.log("无标签");
      }
    }
    if (!updateToVersion) {
      verbose(chalkWarning("!   未声明目标版本"));
      return;
    }
    let pIndex = tags.indexOf(currentVersion);
    let tIndex = tags.indexOf(updateToVersion);

    // 项目是标准的模版工程
    if (VALID_PROJECT) {
      // 项目的当前版本没有找到
      if (pIndex == -1) {
        console.log(chalkWarning("当前项目的版本号未找到！"));
        console.log("Exit(1)");
        process.exit(1);
      } else if (tIndex == -1) {
        console.log(chalkWarning("目标版本未找到！"));
        console.log("Exit(1)");
        process.exit(1);
      } else {
        // 跳过执行当前版本，如果是bare项目，就执行第一个update
        ++pIndex;
        for (let i = pIndex; i <= tIndex; i++) {
          let version = tags[i];
          await updateRunner.exec(options, version);
          currentVersion = version;
        }
      }
    } else {
      //非标准模版项目，只执行第一个更新，
      await updateRunner.exec(options, tags[0]);
      console.log("项目升级至标准模版，请参照初次升级指南修改项目配置");
    }
  } catch (e) {
    logError(e);
  }
};

/**
 * 更新模板的tags,如果不存在就clone下来
 */
async function updateBoilerplate(projectBoil = {}, options) {
  const indicator = ora("更新模版");
  try {
    const { CACHE_DIR, CLI_DIR, cacheFolder, boilerplateRepo } = variables;
    const { noCache } = options;

    indicator.start();
    //如果配置文件改变了
    let cacheExist = fs.existsSync(CACHE_DIR);
    let updateIsOk = true;

    if (cacheExist) {
      verbose("Check boilerplateRepo's uri");
      let remoteV = await execPromise("git remote -v", { cwd: CACHE_DIR });
      if (remoteV.search(boilerplateRepo) == -1) {
        updateIsOk = false;
      }
    }

    if (cacheExist && (noCache || !updateIsOk)) {
      shell.rm("-rf", CACHE_DIR);
      verbose("rm -rf " + CACHE_DIR);
    }

    if (cacheExist && updateIsOk) {
      // 更新模板的代码
      indicator.text = "更新本地缓存";
      verbose(chalkProcessing("Pull latest boilerplate"));
      verbose(
        await execPromise(
          "git reset --hard -q && git checkout master && git pull origin master ",
          { cwd: CACHE_DIR }
        )
      );

      try {
        let tags = await getTags(options);
        verbose(chalkProcessing("Delete old tags"));
        verbose(
          await execPromise(`git tag -d ${tags.join(" ")}`, { cwd: CACHE_DIR })
        );
      } catch (e) {
        //可能在执行过程中中断，导致无tags
      }

      verbose(chalkProcessing("Fetch refresh tags"));
      verbose(await execPromise("git fetch --tags", { cwd: CACHE_DIR }));
    } else {
      indicator.text = "克隆模板到本地";
      verbose("clone boiletplate to " + CACHE_DIR);
      verbose(
        await execPromise(`git clone ${boilerplateRepo} ./${cacheFolder}`, {
          cwd: CLI_DIR
        })
      );
    }
    indicator.succeed("更新模板成功～");
  } catch (e) {
    indicator.fail("更新失败：" + e.message);
    throw e;
  }
}

/**
 * 获得脚手架的tags
 */
async function getTags() {
  const { CACHE_DIR } = variables;
  const output = await execPromise("git tag", { cwd: CACHE_DIR });
  verbose("Git tag:");
  verbose(output);
  if (!output) {
    throw new Error("脚手架无tags");
  }

  // 对标签进行验证并排序
  let tags = output.trim().split("\n");
  let validVersion = /^\d+\.\d+\.\d+$/;
  let validTags = tags.filter(t => validVersion.test(t));
  return utils.sortGitTags(validTags);
}
