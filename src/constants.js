let repoTester = /^--repo=(.+)/
let arg = process.argv.find(str => repoTester.test(str))
let boilerplateRepo = "https://github.com/NSFI/react-ant-design-boilerplate";

if (arg) {
  boilerplateRepo = repoTester.exec(arg)[1];
}

module.exports = {
  boilerplateRepo,
  cacheFolder: '.cache',
};
