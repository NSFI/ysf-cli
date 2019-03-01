const ora = require("ora");
const shell = require("shelljs");
const path = require("path");
const fsExtra = require("fs-extra");

const { chalkInfo, chalkWarning } = require("../util/chalkConfig");
const { boilerplateRepo } = require("./constants");
const execPromise = require("../util/execPromise");
const verbose = require("../util/verbose");

exports = module.exports = async function newProject(project) {
  console.log(chalkWarning("文件下载中...请不要关闭命令行窗口"));
  const spinner = ora("文件下载中...请不要关闭命令行窗口");
  let pwd = process.cwd();

  spinner.start();
  spinner.text = chalkInfo(
    `正在拉取模板代码，下载位置：${pwd}/${project}/ ...`
  );

  try {
    verbose(
      await execPromise(`git clone ${boilerplateRepo} ./${project} --depth 1`, {
        cwd: pwd
      })
    );

    let newDropsBuffer = await fsExtra.readFile(
      path.resolve(pwd, project, "boilerplate-new")
    );

    // 读取文件，过滤出要删除的文件或文件夹
    let files = filterFiles(newDropsBuffer.toString());
    if (files.length) {
      spinner.text = "正在删除不必要的文件";
      await Promise.all(
        files.map(file => fsExtra.remove(path.resolve(pwd, project, file)))
      );
    }
    spinner.succeed("模板工程建立完成");
  } catch (e) {
    spinner.fail("模板工程创建失败");
    throw e;
  }
};

exports.filterFiles = filterFiles;
function filterFiles(content = "") {
  return content
    .trim()
    .split("\n")
    .map(str => str.trim())
    .map(oneLine => {
      let commentIndex = oneLine.search("#");
      if (commentIndex === -1) {
        return oneLine.trim();
      } else {
        return oneLine.substring(0, commentIndex).trim();
      }
    })
    .filter(str => str.length > 0);
}
