const path = require("path");
const { cacheFolder, boilerplateRepo } = require('../constants');

const CLI_DIR = path.resolve(__dirname, "../../");
const CACHE_DIR = path.resolve(CLI_DIR, cacheFolder);
const PROJECT_DIR = process.cwd();


const processVariables = {
  CLI_DIR,
  //
  get cacheFolder() { return this._cacheFolder },
  _cacheFolder: cacheFolder,
  set cacheFolder(value) {
    this.CACHE_DIR = this._cacheDir.replace(this._cacheFolder, value);
    return this._cacheFolder = value
  },
  //
  boilerplateRepo,
  //
  get CACHE_DIR() { return this._cacheDir; },
  _cacheDir: CACHE_DIR,
  set CACHE_DIR(value) {
    this.UPDATE_CONFIG_PATH = path.resolve(value, './u/update.json')
    return this._cacheDir = value
  },
  UPDATE_CONFIG_PATH: '',
  //
  //
  get PROJECT_DIR() { return this._projectDir; },
  _projectDir: PROJECT_DIR,
  set PROJECT_DIR(value) {
    this.PROJECT_PACKAGE_PATH = path.resolve(value, 'package.json');
    this.PROJECT_BOIL_PATH = path.resolve(value, ".boilerplate.json");
    return this._projectDir = value;
  },
  PROJECT_PACKAGE_PATH: '',
  PROJECT_BOIL_PATH: '',


};

processVariables.CACHE_DIR = CACHE_DIR;
processVariables.PROJECT_DIR = PROJECT_DIR;


module.exports = processVariables;
