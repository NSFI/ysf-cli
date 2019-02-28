const path = require("path");
const fsExtra = require("fs-extra");

describe("UpdateMethod", () => {
  it("should resolve dependencies correctly", async () => {
    process.chdir(__dirname);
    const updateMethod = require("../../../src/update/updateMethods");
    const [origin, updateConfig, expected] = await Promise.all([
      fsExtra.readJSON(path.resolve("./package.json")),
      fsExtra.readJSON(path.resolve("./u/update.json")),
      fsExtra.readJSON(path.resolve("./expected/package.json"))
    ]);

    await updateMethod.resolveDepenendencies(origin, updateConfig);

    expect(origin).toEqual(expected);
  });
});
