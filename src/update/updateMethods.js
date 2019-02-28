const fs = require("fs");
const path = require("path");
const utils = require("./utils");
const fsExtra = require("fs-extra");
const execPromise = require("../../util/execPromise");

const glob = require("glob");
const shell = require("shelljs");
const {
  PROJ_DIR,
  CACHE_DIR,
  UPDATE_CONFIG_PATH,
  PROJ_PACKAGE_JSON
} = require("./variables");

/**
 * 处理package.json里的依赖
 * @param {Object} update update.json对象
 */
async function resolveDepenendencies(origin, update) {
  try {
    if (update.dependencies) {
      Object.assign(origin.dependencies, update.dependencies);
    }
    if (update.dependenciesToRemove) {
      for (let key of update.dependenciesToRemove) {
        delete origin.dependencies[key];
      }
    }

    if (update.devDependencies) {
      Object.assign(origin.devDependencies, update.devDependencies);
    }

    if (update.devDependenciesToRemove) {
      for (let key of update.devDependenciesToRemove) {
        delete origin.devDependencies[key];
      }
    }
  } catch (e) {
    console.error(e);
    throw new Error("处理package.json失败");
  }
}

async function execBeforeUpdate(config) {
  if (!config || !config.hooks || !config.hooks.beforeUpdate) {
    return;
  }

  let script = config.hooks.beforeUpdate;
  if (script) {
    script = path.resolve(CACHE_DIR, script);
    return await executeScript(script);
  }
}
async function execAfterUpdate(config) {
  if (!config || !config.hooks || !config.hooks.afterUpdate) {
    return;
  }

  let script = config.hooks.afterUpdate;
  if (script) {
    script = path.resolve(CACHE_DIR, script);
    return await executeScript(script);
  }
}

async function executeScript(script, argv) {
  return await execPromise(
    `node ${script} ${argv ? JSON.stringify(argv) : ""}`,
    {
      cwd: CACHE_DIR,
      env: { PROJECT_DIR: PROJ_DIR, CACHE_DIR: CACHE_DIR }
    }
  );
}

async function override(config) {
  if (config.override) {
    let fileList = config.override;

    shell.cd(CACHE_DIR);
    for (let file of fileList) {
      let matches = glob.sync(file, { cwd: CACHE_DIR, nodir: true });
      for (let filename of matches) {
        fs.statSync(path.resolve(CACHE_DIR, filename));
        shell.mkdir("-p", path.dirname(path.resolve(PROJ_DIR, filename)));
        shell.cp(
          path.resolve(CACHE_DIR, filename),
          path.resolve(PROJ_DIR, filename)
        );
      }
    }
  }
}

async function rename(config) {
  if (config.rename) {
    let map = config.rename;
    let sources = Object.keys(map);
    for (let source of sources) {
      let dest = map[source];
      shell.mkdir("-p", path.dirname(path.resolve(PROJ_DIR, dest)));
      await shell.mv(
        path.resolve(PROJ_DIR, source),
        path.resolve(PROJ_DIR, dest)
      );
    }
  }
}
async function deleteFiles(config) {
  if (config.delete) {
    let fileList = config.delete;
    shell.pushd(PROJ_DIR);
    shell.rm("-rf", fileList);
    shell.popd();
  }
}
module.exports = {
  resolveDepenendencies,
  execBeforeUpdate,
  execAfterUpdate,
  override,
  rename,
  delete: deleteFiles
};
