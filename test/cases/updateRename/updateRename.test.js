const path = require("path");
const fsExtra = require("fs-extra");
const shell = require("shelljs");
const glob = require("glob");
describe("UpdateMethod", () => {
  beforeAll(() => {
    // 重建测试环境

    process.chdir(__dirname); // jest.mock path resolve
    shell.rm("-rf", "./testOutput");
    shell.cp("-R", "./reset", "./testOutput");

    jest.mock("../../../src/update/variables", () => {
      const path = require("path");
      return {
        PROJ_DIR: path.resolve("./testOutput"), //根目录
        CACHE_DIR: path.resolve("./")
      };
    });
  });
  it("should rename files", async () => {
    //  prepare
    const updateMethod = require("../../../src/update/updateMethods");

    const updateConfig = await fsExtra.readJSON(
      path.resolve(__dirname, "./u/update.json")
    );

    //  execute
    await updateMethod.rename(updateConfig);

    //  verify
    let expectedFiles = await glob.sync("testOutput/**", {
      cwd: __dirname,
      nodir: true
    });

    expect(expectedFiles).toHaveLength(5);
    expect(expectedFiles).toMatchSnapshot();
  });
  afterAll(() => {
    jest.resetAllMocks();
  });
});
