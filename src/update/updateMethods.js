const fs = require("fs");
const path = require("path");
const fsExtra = require("fs-extra");
const execPromise = require("../../util/execPromise");

const glob = require("glob");
const shell = require("shelljs");
let variables = require("./variables");

const ROOT_PATH = /^\//;
const filterRoot = path => {
  if (ROOT_PATH.test(path)) {
    throw new Error("不允许指定根路径 -> " + path);
  }
  return path;
};
/**
 * 处理package.json里的依赖
 * @param {Object} update update.json对象
 */
async function resolveDepenendencies(origin, update) {
  try {
    if (update.dependencies) {
      if (!origin.dependencies) origin.dependencies = {};
      let dependencies = origin.dependencies;
      Object.assign(dependencies, update.dependencies);
      origin.dependencies = JSON.parse(
        JSON.stringify(dependencies, Object.keys(dependencies).sort())
      );
    }
    if (update.dependenciesToRemove) {
      for (let key of update.dependenciesToRemove) {
        delete origin.dependencies[key];
      }
    }

    if (update.devDependencies) {
      if (!origin.devDependencies) origin.devDependencies = {};
      let devDependencies = origin.devDependencies;
      Object.assign(devDependencies, update.dependencies);
      origin.devDependencies = JSON.parse(
        JSON.stringify(devDependencies, Object.keys(devDependencies).sort())
      );
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
  const { CACHE_DIR } = variables;
  if (!config || !config.hooks || !config.hooks.beforeUpdate) {
    return;
  }

  let script = config.hooks.beforeUpdate;
  if (script) {
    filterRoot(script);
    script = path.resolve(CACHE_DIR, script);
    return await executeScript(script);
  }
}
async function execAfterUpdate(config) {
  const { CACHE_DIR } = variables;
  if (!config || !config.hooks || !config.hooks.afterUpdate) {
    return;
  }

  let script = config.hooks.afterUpdate;
  if (script) {
    filterRoot(script);
    script = path.resolve(CACHE_DIR, script);
    return await executeScript(script);
  }
}

const INTERPRETER_BY_EXT = {
  ".js": "node",
  ".sh": "bash",
  ".py": "python"
};

async function executeScript(script, argv = []) {
  const { CACHE_DIR, PROJECT_DIR, CLI_DIR } = variables;
  let ext = path.extname(script);

  let interpreter = INTERPRETER_BY_EXT[ext];
  if (!interpreter) {
    throw new Error("仅支持  .js|.sh|.py 类型的脚本 ！");
  }

  let cliArgv = argv
    .map(arg => '"' + arg.replace(/(["$`])/gm, "\\$1") + '"')
    .join(" ");

  return await execPromise(`${interpreter} ${script} ${cliArgv}`, {
    cwd: CACHE_DIR,
    env: { PROJECT_DIR, CACHE_DIR, CLI_DIR }
  });
}

async function override(config) {
  const { CACHE_DIR, PROJECT_DIR } = variables;
  if (config.override) {
    let fileList = config.override;

    shell.pushd("-q", CACHE_DIR);
    for (let file of fileList) {
      filterRoot(file);
      let matches = glob.sync(file, { cwd: CACHE_DIR, nodir: true });
      for (let filename of matches) {
        fs.statSync(path.resolve(CACHE_DIR, filename));
        shell.mkdir("-p", path.dirname(path.resolve(PROJECT_DIR, filename)));
        shell.cp(
          path.resolve(CACHE_DIR, filename),
          path.resolve(PROJECT_DIR, filename)
        );
      }
    }
    shell.popd("-q", "+0");
  }
}

async function rename(config) {
  const { PROJECT_DIR } = variables;
  if (config.rename) {
    let map = config.rename;
    let sources = Object.keys(map);
    for (let source of sources) {
      filterRoot(source);

      let dest = map[source];
      filterRoot(dest);

      shell.mkdir("-p", path.dirname(path.resolve(PROJECT_DIR, dest)));
      await shell.mv(
        path.resolve(PROJECT_DIR, source),
        path.resolve(PROJECT_DIR, dest)
      );
    }
  }
}
async function deleteFiles(config) {
  const { PROJECT_DIR } = variables;
  if (config.delete) {
    let fileList = config.delete;
    shell.pushd(PROJECT_DIR);
    shell.rm("-rf", fileList);
    shell.popd();
  }
}
async function execUserScript(config) {
  const { CACHE_DIR, PROJECT_DIR } = variables;
  if (config.script) {
    let scriptPair = config.script;

    /**
     * {
     * * "folderA/ * * /*.js": "a.js",
     * * "folderB/**": "a.js",
     * }
     scriptPair是这样的结构，有可能多个glob pattern使用同一个脚本，这里将这个map结构反转一下
     */

    let scriptAndFiles = new Map();
    let filesGlobArr = Object.keys(scriptPair);
    for (let filesPattern of filesGlobArr) {
      filterRoot(filesPattern);
      let script = scriptPair[filesPattern];

      filterRoot(script);
      // 转换为绝对路径
      script = path.resolve(CACHE_DIR, script);

      let files = [];
      if (scriptAndFiles.has(script)) {
        files = scriptAndFiles.get(script);
      }

      let selectedFiles = glob
        .sync(filesPattern, {
          cwd: PROJECT_DIR,
          nodir: true
        })
        .map(file => path.resolve(PROJECT_DIR, file)); //// 转换为绝对路径

      files = files.concat(selectedFiles);

      // files去重
      files = [...new Set(files)];

      scriptAndFiles.set(script, files);
    }

    // 结构反转之后，执行每个script ,并把files传给它

    let pool = [];

    for (let [script, files] of scriptAndFiles.entries()) {
      pool.push(executeScript(script, files));
    }

    return await Promise.all(pool);
  }
}

module.exports = {
  resolveDepenendencies,
  execBeforeUpdate,
  execAfterUpdate,
  override,
  rename,
  delete: deleteFiles,
  execUserScript
};
