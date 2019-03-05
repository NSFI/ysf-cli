const fs = require("fs");
const fsExtra = require("fs-extra");
const execPromise = require("../../util/execPromise");
const variables = require("./variables");
const ora = require("ora");
const methods = require("./updateMethods");
const verbose = require("../../util/verbose");
exports.exec = async function(options, version) {
  const indicator = ora();
  try {
    indicator.start("开始执行更新");
    if (!options.dev) {
      indicator.text = "检出到版本：" + version;

      await checkoutVersion(version);
    }
    indicator.start("读取配置文件");
    let config = await readUpdateConfig();
    if (config === null) {
      //跳过更新步骤
      indicator.succeed("无配置文件，跳过");
      return;
    }

    //before hook
    if (config.hooks) {
      indicator.text = "Before update ...";
      await methods.execBeforeUpdate(config);
    }

    indicator.text = "更新 package.json ...";
    // 1. 先处理package.json里的依赖
    const { PROJECT_PACKAGE_PATH } = variables;
    await processJSONFile(
      PROJECT_PACKAGE_PATH,
      async packageJSON =>
        await methods.resolveDepenendencies(packageJSON, config)
    );

    //替换文件，
    indicator.text = "Override ...";
    await methods.override(config);

    //删除文件
    indicator.text = "Delete ...";
    await methods.delete(config);

    //重命名/move 文件
    indicator.text = "Rename ...";
    await methods.rename(config);

    // 执行用户自定义脚本
    indicator.text = "Script ...";
    verbose("Scripts outputs:");
    let outputs = await methods.execUserScript(config);
    verbose(outputs.join("\n--------[STDOUT BOUNDARY]---------\n"));

    //after hook
    if (config.hooks) {
      indicator.text = "After update ...";
      await methods.execAfterUpdate(config);
    }

    // update boilerplate.json
    await processJSONFile(
      variables.PROJECT_BOIL_PATH,
      async json => (json.version = version)
    );

    indicator.succeed("更新成功～");
  } catch (e) {
    indicator.fail("执行失败:" + e.message);
    throw e;
  }
};

/**
 * 切换git到对应的tag
 * @param {String} version git tag版本号
 */
async function checkoutVersion(version) {
  if (!version || typeof version !== "string" || version.length < 1) {
    throw new Error("脚手架的版本号不正确");
  }

  await execPromise(`git checkout ${version}`, { cwd: variables.CACHE_DIR });
}

async function readUpdateConfig() {
  const { UPDATE_CONFIG_PATH } = variables;
  if (fs.existsSync(UPDATE_CONFIG_PATH)) {
    return await fsExtra.readJSON(UPDATE_CONFIG_PATH);
  } else {
    // update 文件不存在，返回null
    return null;
  }
}
/**
 * 修改JSON格式的小工具
 * @param {String} fullPath  文件路径
 * @param {Function} modifier  修改函数
 */
async function processJSONFile(fullPath, modifier) {
  let packageJSON;
  try {
    packageJSON = await fsExtra.readJSON(fullPath);
  } catch (e) {
    verbose("读取" + fullPath + "文件失败");
    verbose(e);
    packageJSON = {};
  }
  await modifier(packageJSON);
  //保存更改文件
  await fsExtra.writeJSON(fullPath, packageJSON, { spaces: 2 });
}
