const path = require("path");
const fsExtra = require("fs-extra");

describe("Update-updateHook", () => {
  beforeAll(() => {
    jest.mock("../../../src/update/variables", function() {
      const path = require("path");
      return {
        PROJ_DIR: path.resolve("./"), //根目录
        CACHE_DIR: path.resolve("test", "cases", "updateHook")
      };
    });
  });
  it("should resolve execute hook script correctly", async () => {
    //  prepare
    const updateMethod = require("../../../src/update/updateMethods");

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

    //  verifie
    expect(beforeResult).toBe(beforeUpdateResult);
    expect(afterResult).toBe(afterUpdateResult);
  });
  afterAll(() => {
    jest.resetAllMocks();
  });
});
