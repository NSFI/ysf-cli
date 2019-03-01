const path = require("path");
const fsExtra = require("fs-extra");

describe("UpdateMethod", () => {
  process.chdir(__dirname)
  it("should resolve execute hook script correctly", async () => {
    //  prepare
    const updateMethod = require("../../../src/update/updateMethods");
    const variables = require('../../../src/update/variables');
    variables.PROJECT_DIR = path.resolve("../../../");
    variables.CACHE_DIR = path.resolve('./')

    const updateConfig = await fsExtra.readJSON(
      path.resolve(__dirname, "./u/update.json")
    );

    const beforeUpdateResult = `beforeUpdate
${path.resolve(__dirname)}
${path.resolve(__dirname, "../../../")}
${path.resolve(__dirname)}`;

    const afterUpdateResult = "AfterUpdate\n[]";
    //  execute
    let beforeResult = await updateMethod.execBeforeUpdate(updateConfig);
    let afterResult = await updateMethod.execAfterUpdate(updateConfig);

    //  verify
    expect(beforeResult).toBe(beforeUpdateResult);
    expect(afterResult).toBe(afterUpdateResult);
  });
  afterAll(() => {
    jest.resetAllMocks();
  });
});
