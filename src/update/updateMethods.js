const fs = require("fs");
const path = require("path");
const utils = require("./utils");
const {
  PROJ_DIR,
  CACHE_DIR,
  CACHE_UPDATE_PATH,
  PROJ_PACKAGE_JSON
} = require("./variables");

/**
 * 处理package.json里的依赖
 * @param {Object} update update.json对象
 */
async function resolveDepenendencies(update) {
  try {
    delete require.cache[PROJ_PACKAGE_JSON]; //删除require的缓存
    let packageJson = require(PROJ_PACKAGE_JSON);

    if (update.dependencies) {
      Object.assign(packageJson.dependencies, update.dependencies);
    }
    if (update.dependenciesToRemove) {
      for (let key of update.dependenciesToRemove) {
        delete packageJson.dependencies[key];
      }
    }

    if (update.devDependencies) {
      Object.assign(packageJson.devDependencies, update.devDependencies);
    }

    if (update.devDependenciesToRemove) {
      for (let key of update.devDependenciesToRemove) {
        delete packageJson.devDependencies[key];
      }
    }

    fs.writeFileSync(PROJ_PACKAGE_JSON, JSON.stringify(packageJson));
  } catch (e) {
    console.error(e);
    throw new Error("处理package.json失败");
  }
}

module.exports = {
  resolveDepenendencies
};
