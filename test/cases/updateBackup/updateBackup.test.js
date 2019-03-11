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
  });
  it("should backup files", async () => {
    const variables = require("../../../src/update/variables");
    variables.PROJECT_DIR = path.resolve("./testOutput");
    variables.CACHE_DIR = path.resolve("./");

    //  prepare
    const updateMethod = require("../../../src/update/updateMethods");

    const updateConfig = await fsExtra.readJSON(
      path.resolve(__dirname, "./u/update.json")
    );

    //  execute
    await updateMethod.backup(updateConfig);

    //  verify
    let expectedFiles = await glob.sync("testOutput/**", {
      cwd: __dirname,
    });

    expect(expectedFiles).toHaveLength(11);
    expect(expectedFiles).toMatchSnapshot();
  });
  afterAll(() => {
    jest.resetAllMocks();
  });
});
