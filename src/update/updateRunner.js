const fs = require("fs");
const path = require("path");
const utils = require("./utils");
const execPromise = require("../../util/execPromise");
const {
  PROJ_DIR,
  CACHE_DIR,
  CACHE_UPDATE_PATH,
  PROJ_PACKAGE_JSON
} = require("./variables");

const methods = require("./updateMethods");

exports.update = async function(version) {
  if (process.env.debug) {
    await checkoutVersion(version);
  }

  let config = await readUpdateConfig();
  if (config === null) {
    //跳过更新步骤
    return;
  }

  // 1. 先处理package.json里的依赖
  await methods.resolveDepenendencies(config);
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
  if (fs.existsSync(CACHE_UPDATE_PATH)) {
    delete require.cache[CACHE_UPDATE_PATH]; //删除require的依赖
    return require(CACHE_UPDATE_PATH);
  } else {
    // update 文件不存在，返回null
    return null;
  }
}
