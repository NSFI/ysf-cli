let appName = process.argv[3];
let appDirectory = process.cwd();
const fsExtra = require('fs-extra');
const path = require('path');
const { chalkError, chalkInfo, chalkWarning } = require('../util/chalkConfig');

function generate(templates) {
  return new Promise((resolve, reject) => {
    if (!appName) {
      reject('正确命令例子：ysf generate mypage');
    }
    let promises = [];
    Object.keys(templates).forEach((fileName, i) => {
      promises[i] = new Promise(res => {
        const filePath = path.resolve(appDirectory, replaceFileName(fileName, appName));
        const content = replaceFileName(templates[fileName], appName);
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
    console.log(chalkWarning(`请在appRoutes.js文件中添加 ‘/${appName}’ 的路由`));
    Promise.all(promises).then(() => { resolve() });
  })
    .catch((err) => {
      console.log(chalkError(err));
    });
}

function replaceFileName(str, app) {
  return str
    .replace(/{{PageName}}/g, app);
}

module.exports = generate;
