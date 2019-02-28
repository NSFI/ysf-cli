const path = require("path");
const fsExtra = require("fs-extra");

describe("UpdateMethod", () => {
  beforeAll(() => {
    process.chdir(__dirname);
    jest.mock("../../../src/update/variables", () => {
      const path = require("path");
      return {
        PROJ_DIR: path.resolve("./"), //根目录
        CACHE_DIR: path.resolve("./")
      };
    });
  });

  it("should execute custom script correctly", async () => {
    //  prepare
    const updateMethod = require("../../../src/update/updateMethods");

    const updateConfig = await fsExtra.readJSON(
      path.resolve(__dirname, "./u/update.json")
    );


    //  execute
    let output = await updateMethod.execUserScript(updateConfig);


    //  verify
    expect(output).toMatchSnapshot();
  });
  afterAll(() => {
    jest.resetAllMocks();
  });
});
