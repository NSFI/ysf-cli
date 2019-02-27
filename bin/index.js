#!/usr/bin/env node

const program = require('commander');
const shell = require('shelljs');
const fs = require('fs');
const templates = require('../templates');
const generate = require('../src/generate');
const update = require('../src/update');
const { chalkError, chalkInfo } = require('../util/chalkConfig');
const ora = require('ora');
const spinner = ora('文件下载中...请不要关闭命令行窗口');

program
  .version('1.0.0')
  .description('云商服react & ant design模板工程的cli');
program
  .on('--help', printHelp)
  .command('new <project>')
  .description('Creates a new application')
  .action(function(project) {
    if (project) {
      let pwd = process.pwd();
      console.log(chalkInfo(`正在拉取模板代码，下载位置：${pwd}/${project}/ ...`));
      spinner.start();
      shell.exec(`git clone https://github.com/NSFI/react-ant-design-boilerplate ./${project}`)
      shell.rm('-rf', [`${project}/.git`,`${project}/u`]);

      spinner.succeed('模板工程建立完成');

    } else {
      console.log(chalkError('正确命令例子：ysf new myproject'));
    }
  });
program
  .command('generate <app>')
  .alias('g')
  .description('Generates new code (short-cut alias: "g")')
  .action(function(app) {
    if (app) {
      // 检查pwd当前是否有source
      fs.stat('./source', (err, stats) => {
        if (err || !stats.isDirectory()) {
          console.log(chalkError('当前目录下没有source目录，如果还没有创建项目请，使用：ysf generate mypage创建'));
        } else {
          generate(templates);
        }
      })
    } else {
      console.log(chalkError('正确命令例子：ysf generate mypage'));
    }
  });
program
  .command('update [version]')
  .alias('u')
  .description('Update application boilerplate version')
  .option("-l, --list", "list tags")
  .option("-n, --noCache", "without cache")
  .action(function (version, { list,  noCache }) {
    if (version || list) {
      update(version, { list, noCache });
    } else {
      console.log(chalkError('正确命令例子：ysf update [version] 或 ysf update list'));
    }
  })
program.option("--debug", "debug mode")
  .option("-v, --verbose", "print all cli output")
  .parse(process.argv);

function printHelp() {
  console.log();
  console.log(chalkInfo('  All commands can be run with -h (or --help) for more information.'));
}
