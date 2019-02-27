const path = require("path");

const CLI_DIR = path.resolve(__dirname, "../../");

const CACHE_DIR = path.resolve(CLI_DIR, ".cache");
const UPDATE_CONFIG_PATH = path.resolve(CACHE_DIR, "./u/update.json");

const PROJ_DIR = process.cwd();
const PROJ_PACKAGE_JSON = path.resolve(PROJ_DIR, "package.json");
const PROJ_BOIL_PATH = path.resolve(PROJ_DIR, ".boilerplate.json");

module.exports = {
  CLI_DIR,
  CACHE_DIR,
  UPDATE_CONFIG_PATH,
  PROJ_DIR,
  PROJ_BOIL_PATH,
  PROJ_PACKAGE_JSON
};
Object.freeze(module.exports);
