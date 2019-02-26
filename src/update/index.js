const fs = require("fs");
const path = require("path");
const shell = require("shelljs");

const updateRunner = require("./updateRunner");
const execPromise = require("../../util/execPromise");
const utils = require("./utils");
const {
  CLI_DIR,
  PROJ_DIR,
  CACHE_DIR,
  PROJ_BOIL_PATH: PROJ_BOIL
} = require("./variables");

const runInCache = { cwd: CACHE_DIR };
const runInCli = { cwd: CLI_DIR };
const runInProject = { cwd: PROJ_DIR };

module.exports = async function main(updateToVersion) {
  const IS_BARE_PROJECT = fs.existsSync(PROJ_BOIL);
  let currentVersion = IS_BARE_PROJECT ? require(PROJ_BOIL).version : null;

  await updateBoilerplate();

  let tags = await getTags();

  console.log(tags);
  let pIndex = tags.indexOf(currentVersion);
  let tIndex = tags.indexOf(updateToVersion);
  console.log(currentVersion, updateToVersion);
  console.log(pIndex, tIndex);

  for (let i = pIndex; i <= tIndex; i++) {
    let version = tags[i];
    await updateRunner(version);
  }
};

/**
 * 更新模板的tags,如果不存在就clone下来
 */
async function updateBoilerplate() {
  if (fs.existsSync(CACHE_DIR)) {
    // 更新代码
    await execPromise(
      "git reset --hard -q && git checkout master && git pull origin master ",
      runInCache
    );

    let tags = await getTags();
    await Promise.all(
      tags.map(tag => execPromise(`git tag -d ${tag}`, runInCache))
    );

    let result = await execPromise("git fetch --tags", runInCache);

    console.log(result);
  } else {
    let stdout = await execPromise(
      `git clone https://github.com/eynol/updater-demo.git ./.cache`,
      runInCli
    );

    console.log(stdout);
  }
}

/**
 * 获得脚手架的tags
 */
async function getTags() {
  const output = await execPromise("git tag", runInCache);

  console.log(output);
  if (!output) {
    throw "脚手架无tags";
  }

  // 对标签进行验证并排序
  let tags = output.trim().split("\n");
  let validVersion = /^\d+\.\d+\.\d+$/;
  let validTags = tags.filter(t => validVersion.test(t));
  return utils.sortGitTags(validTags);
}
