let repoTester = /^--repo=(.+)/
let arg = process.argv.find(str => repoTester.test(str))
let boilerplateRepo = "https://github.com/NSFI/react-ppfish-boilerplate";
let repoOverride = false;

if (arg) {
  boilerplateRepo = repoTester.exec(arg)[1];
  repoOverride = true;
}

module.exports = {
  repoOverride,
  boilerplateRepo,
  cacheFolder: '.cache',
};
