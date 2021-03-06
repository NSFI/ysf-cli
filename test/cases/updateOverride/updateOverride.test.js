const path = require("path");
const fsExtra = require("fs-extra");
const shell = require("shelljs");

describe("UpdateMethod", () => {
  beforeAll(() => {
    // 重建测试环境

    process.chdir(__dirname); // jest.mock path resolve
    shell.rm("-rf", "./testOutput/");
    shell.mkdir("-p", "./testOutput/");

    // 创建一个已经存在的文件，看是否会被覆盖
    fsExtra.writeFileSync(
      path.resolve("./testOutput/broadcast.md"),
      "thisIsOldFile"
    );
  });
  it("should override files correctly", async () => {
    //  prepare
    const updateMethod = require("../../../src/update/updateMethods");
    const variables = require("../../../src/update/variables");
    variables.PROJECT_DIR = path.resolve("./testOutput");
    variables.CACHE_DIR = path.resolve("./");

    const updateConfig = await fsExtra.readJSON(
      path.resolve(__dirname, "./u/update.json")
    );

    //  execute
    await updateMethod.override(updateConfig);

    //  verify
    let expectedFiles = await fsExtra.readdir(path.resolve("./expected"));
    while (expectedFiles.length) {
      let file = expectedFiles.shift();

      if (fsExtra.statSync(file).isDirectory()) {
        let newSubfolderFiles = await fsExtra.readdir(
          path.resolve("./expected", file)
        );
        expectedFiles = expectedFiles.concat(
          newSubfolderFiles.map(str => file + "/" + str)
        );
      } else {
        const [output, expected] = await Promise.all([
          fsExtra.readFile(path.resolve("./testOutput", file)),
          fsExtra.readFile(path.resolve("./expected", file))
        ]);
        expect(output.toString()).toBe(expected.toString());
      }
    }
  });
  afterAll(() => {
    jest.resetAllMocks();
  });
});
