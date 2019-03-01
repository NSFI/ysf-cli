#!/usr/bin/env node

const program = require('commander');
const shell = require('shelljs');
const fs = require('fs');
const { chalkError, chalkInfo } = require('../util/chalkConfig');
program
  .version('1.0.0')
  .description('云商服react & ant design模板工程的cli');
program
  .on('--help', printHelp)
  .command('new <project>')
  .description('Creates a new application')
  .action(function (project) {
    const newProject = require('../src/new');

    if (project) {
      newProject(project)
    } else {
      console.log(chalkError('正确命令例子：ysf new myproject'));
    }
  });
program
  .command('generate <app>')
  .alias('g')
  .description('Generates new code (short-cut alias: "g")')
  .action(function (app) {
    if (app) {
      const generate = require('../src/generate');
      const templates = require('../templates');

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
  .description('将当前项目使用的模板更新至指定版本')
  .option("--dev", "开发模式，将会设置当前目录下的缓存文件夹作为 CACHE_DIR ")
  .option("-l, --list", "list tags")
  .option("-n, --noCache", "without cache")
  .action(function (version, { list, noCache, dev }) {
    const update = require('../src/update');

    if (version || list || dev) {
      update(version, { list, noCache, dev });
    } else {
      console.log(chalkError('正确命令例子：ysf update [version] 或 ysf update list'));
    }
  })
program
  .option("--debug", "debug mode")
  .option("--repo <repo>", "custom repo")
  .option("-v, --verbose", "print all cli output")
  .parse(process.argv);

function printHelp() {
  console.log();
  console.log(chalkInfo('  All commands can be run with -h (or --help) for more information.'));
}
