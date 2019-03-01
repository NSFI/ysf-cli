const path = require("path");
const fsExtra = require("fs-extra");

describe("UpdateMethod", () => {

  process.chdir(__dirname)
  it("should execute custom script correctly", async () => {
    const variables = require('../../../src/update/variables');
    variables.PROJECT_DIR = path.resolve("./");
    variables.CACHE_DIR = path.resolve('./')

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
