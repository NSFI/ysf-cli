#!/usr/bin/env node

const Git = require('nodegit');
const program = require('commander');
const shell = require('shelljs');
const fs = require('fs');
const templates = require('../templates');
const generate = require('../src/generate');
const { chalkError, chalkInfo } = require('../util/chalkConfig');
const ora = require('ora');

const spinner = ora('文件下载中...请不要关闭命令行窗口');

program
  .version('1.0.0')
  .description('云商服react & ant design模板工程的cli');
program
  .on('--help', printHelp)
  .command('new <project>')
  .action(function(project) {
    if (project) {
      let pwd = shell.pwd();
      console.log(chalkInfo(`正在拉取模板代码，下载位置：${pwd}/${project}/ ...`));
      spinner.start();
      Git.Clone('https://github.com/NSFI/react-ant-design-boilerplate', './' + project)
        .then(function(repo) {
            spinner.stop();
            shell.rm('-rf', `${project}.git`);
            console.log(chalkInfo('模板工程建立完成'));
        });
    } else {
      console.log(chalkError('正确命令例子：ysf new myproject'));
    }
  });
program
  .command('generate <app>')
  .alias('g')
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
  })
program.parse(process.argv);

function printHelp() {
  console.log(chalkInfo('  Commands:'));
  console.log();
  console.log(chalkInfo('    new            Creates a new application'));
  console.log(chalkInfo('    generate       Generates new code (short-cut alias: "g")'));
  console.log();
  console.log(chalkInfo('  All commands can be run with -h (or --help) for more information.'));
}