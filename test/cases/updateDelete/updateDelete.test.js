const path = require("path");
const fsExtra = require("fs-extra");
const shell = require("shelljs");

describe("UpdateMethod", () => {
  beforeAll(() => {
    // 重建测试环境

    process.chdir(__dirname); // jest.mock path resolve
    shell.rm("-rf", "./testOutput");
    shell.cp("-R", "./reset", "./testOutput");
  });
  it("should delete files correctly", async () => {
    //  prepare
    const variables = require("../../../src/update/variables");
    variables.PROJECT_DIR = path.resolve("./testOutput");
    variables.CACHE_DIR = path.resolve("./");

    const updateMethod = require("../../../src/update/updateMethods");

    const updateConfig = await fsExtra.readJSON(
      path.resolve(__dirname, "./u/update.json")
    );

    //  execute
    await updateMethod.delete(updateConfig);

    //  verify
    let expectedFiles = await fsExtra.readdir(path.resolve("./testOutput"));

    expect(expectedFiles.length).toBe(1);
    expect(expectedFiles[0]).toBe("notDeleteThis");
  });
  afterAll(() => {
    jest.resetAllMocks();
  });
});
