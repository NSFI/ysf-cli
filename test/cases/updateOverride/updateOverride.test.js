const path = require("path");
const fsExtra = require("fs-extra");
const shell = require("shelljs");

describe("Update-updateHook", () => {
  beforeAll(() => {
    // 重建测试环境

    process.chdir(__dirname); // jest.mock path resolve
    shell.mkdir("-p", "./testOutput/");

    fsExtra.writeFileSync(
      path.resolve("./testOutput/broadcast.md"),
      "thisIsOldFile"
    );
    jest.mock("../../../src/update/variables", () => {
      const path = require("path");
      return {
        PROJ_DIR: path.resolve("./testOutput"), //根目录
        CACHE_DIR: path.resolve("./")
      };
    });
  });
  it("should resolve execute hook script correctly", async () => {
    //  prepare
    const updateMethod = require("../../../src/update/updateMethods");

    const updateConfig = await fsExtra.readJSON(
      path.resolve(__dirname, "./u/update.json")
    );

    //  execute
    await updateMethod.override(updateConfig);

    //  verify
    let expectedFiles = await fsExtra.readdir(path.resolve("./expected"));
    for (let file of expectedFiles) {
      const [output, expected] = await Promise.all([
        fsExtra.readFile(path.resolve("./testOutput", file)),
        fsExtra.readFile(path.resolve("./expected", file))
      ]);
      expect(output.toString()).toBe(expected.toString());
    }
  });
  afterAll(() => {
    jest.resetAllMocks();
  });
});
