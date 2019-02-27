const fs = require("fs");
const fsExtra = require("fs-extra");
const path = require("path");
const utils = require("./utils");
const execPromise = require("../../util/execPromise");
const {
  PROJ_DIR,
  CACHE_DIR,
  UPDATE_CONFIG_PATH,
  PROJ_PACKAGE_JSON
} = require("./variables");

const methods = require("./updateMethods");

exports.exec = async function(version, { debug } = {}) {
  if (debug) {
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
  let packageJSON = await fsExtra.readJSON(PROJ_PACKAGE_JSON);
  await methods.resolveDepenendencies(packageJSON, config);
  //保存更改文件
  await fsExtra.writeJSON(PROJ_PACKAGE_JSON, packageJSON, { spaces: 2 });

  //移动文件，
  await methods.override(config);

  //删除文件
  await methods.delete(config);

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

  await execPromise(`git checkout ${version}`, { cwd: CACHE_DIR });
}

async function readUpdateConfig() {
  if (fs.existsSync(UPDATE_CONFIG_PATH)) {
    return await fsExtra.readJSON(UPDATE_CONFIG_PATH);
  } else {
    // update 文件不存在，返回null
    return null;
  }
}

async function customScript(globFilesPattern, jsToExecute) {
  let result = execPromise(
    `node ${jsToExecute} ${globFilesPattern.join(" ")}`,
    {
      cwd: PROJ_DIR,
      env: { PROJ_DIR, CACHE_DIR }
    }
  );

  console.log(result);
}
