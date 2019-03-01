let appName = process.argv[3];
let appDirectory = process.cwd();
const fsExtra = require('fs-extra');

const { chalkError, chalkInfo } = require('../util/chalkConfig');

function generate(templates) {
  return new Promise((resolve, reject) => {
    if (!appName) {
      reject('正确命令例子：ysf generate mypage');
    }
    appName = appName.replace(/\w/g, function (word) { return word.toLowerCase() });
    let promises = [];
    Object.keys(templates).forEach((fileName, i) => {
      promises[i] = new Promise(res => {
        const filePath = `${appDirectory}/${replaceFileName(fileName, appName)}`;
        const content = replaceContent(templates[fileName], appName);
        console.log(chalkInfo(`正在创建页面，页面位置：${filePath} ...`));
        fsExtra.outputFile(filePath, content, function (err) {
          if (err) {
            reject(err);
          }
          res();
        });
      });
    });
    console.log(chalkInfo('页面创建完成'));
    Promise.all(promises).then(() => { resolve() });
  })
    .catch((err) => {
      console.log(chalkError(err));
    });
}

function replaceFileName(str, app) {
  return str
    .replace(/App/g, upcaseFirstChar(app))
    .replace(/app/g, app);
}
function replaceContent(str, app) {
  return str
    .replace(/@{App}/g, upcaseFirstChar(app))
    .replace(/@{app}/g, app);
}
function upcaseFirstChar(name) {
  if (!name || typeof name != 'string') {
    return '';
  }
  return name.replace(/^\w/, function (a) {
    return a.toUpperCase();
  });
}

module.exports = generate;
