const fs = require("fs");
const fsExtra = require("fs-extra");
const execPromise = require("../../util/execPromise");
const variables = require("./variables");

const methods = require("./updateMethods");

exports.exec = async function (options, version) {
  if (!options.dev) {
    await checkoutVersion(version);
  }

  let config = await readUpdateConfig();
  if (config === null) {
    //跳过更新步骤
    return;
  }

  //before hook
  if (config.hooks) {
    await methods.execBeforeUpdate(config);
  }

  // 1. 先处理package.json里的依赖
  const { PROJECT_PACKAGE_PATH } = variables;
  let packageJSON = await fsExtra.readJSON(PROJECT_PACKAGE_PATH);
  await methods.resolveDepenendencies(packageJSON, config);
  //保存更改文件
  await fsExtra.writeJSON(PROJECT_PACKAGE_PATH, packageJSON, { spaces: 2 });

  //替换文件，
  await methods.override(config);

  //删除文件
  await methods.delete(config);

  //重命名/move 文件
  await methods.rename(config);

  // 执行用户自定义脚本
  await methods.execUserScript(config);

  //after hook
  if (config.hooks) {
    await methods.execAfterUpdate(config);
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
