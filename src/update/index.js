const fs = require("fs");
const fsExtra = require("fs-extra");
const path = require("path");
const shell = require("shelljs");
const program = require("commander");
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
const {
  CLI_DIR,
  PROJ_DIR,
  CACHE_DIR,
  PROJ_BOIL_PATH: PROJ_BOIL
} = require("./variables");

const runInCache = { cwd: CACHE_DIR };
const runInCli = { cwd: CLI_DIR };
const runInProject = { cwd: PROJ_DIR };

module.exports = async function main(updateToVersion, options) {
  try {
    const VALID_PROJECT = fs.existsSync(PROJ_BOIL);
    const projMeta = VALID_PROJECT && fsExtra.readJSONSync(PROJ_BOIL);
    let currentVersion = VALID_PROJECT && projMeta.version;

    verbose("udpate with option:" + JSON.stringify(options));

    await updateBoilerplate(projMeta, options);

    const { list } = options;
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

    if (tIndex == -1) {
      console.log(chalkWarning("目标版本未找到！"));
      console.log("Exit(1)");
      process.exit(1);
    }

    if (pIndex == -1 && VALID_PROJECT) {
      console.log(chalkWarning("当前项目的版本号未找到！"));
      console.log("Exit(1)");
      process.exit(1);
    }

    // 跳过执行当前版本，如果是bare项目，就执行第一个update
    ++pIndex;
    for (let i = pIndex; i <= tIndex; i++) {
      let version = tags[i];
      await updateRunner.exec(version);
    }
  } catch (e) {
    logError(e);
  }
};

/**
 * 更新模板的tags,如果不存在就clone下来
 */
async function updateBoilerplate(projMeta = {}, options) {
  const { boilerplateRepo } = projMeta;
  const { noCache } = options;
  if (noCache) {
    shell.rm("-rf", CACHE_DIR);
    verbose("rm -rf " + CACHE_DIR);
  }

  if (fs.existsSync(CACHE_DIR)) {
    // 更新模板的代码
    verbose(chalkProcessing("Pull latest boilterplate"));
    verbose(
      await execPromise(
        "git reset --hard -q && git checkout master && git pull origin master ",
        runInCache
      )
    );

    try {
      let tags = await getTags(options);
      verbose(chalkProcessing("Delete old tags"));
      verbose(await execPromise(`git tag -d ${tags.join(" ")}`, runInCache));
    } catch (e) {
      //可能在执行过程中中断，导致无tags
    }

    verbose(chalkProcessing("Fetch refresh tags"));
    verbose(await execPromise("git fetch --tags", runInCache));
  } else {
    verbose("clone boiletplate to " + CACHE_DIR);
    verbose(
      await execPromise(
        `git clone https://github.com/eynol/updater-demo.git ./.cache`,
        runInCli
      )
    );
  }
}

/**
 * 获得脚手架的tags
 */
async function getTags() {
  const output = await execPromise("git tag", runInCache);
  verbose("Git tag:");
  verbose(output);
  if (!output) {
    throw "脚手架无tags";
  }

  // 对标签进行验证并排序
  let tags = output.trim().split("\n");
  let validVersion = /^\d+\.\d+\.\d+$/;
  let validTags = tags.filter(t => validVersion.test(t));
  return utils.sortGitTags(validTags);
}
