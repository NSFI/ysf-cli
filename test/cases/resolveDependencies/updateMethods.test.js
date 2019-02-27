const path = require("path");
const fsExtra = require("fs-extra");

describe("Update-UpdateMethod", () => {
  it("should resolve dependencies correctly", async () => {
    const updateMethod = require("../../../src/update/updateMethods");

    const [origin, updateConfig, expected] = await Promise.all([
      fsExtra.readJSON(path.resolve(__dirname, "./package.json")),
      fsExtra.readJSON(path.resolve(__dirname, "./u/update.json")),
      fsExtra.readJSON(path.resolve(__dirname, "./expected/package.json"))
    ]);

    await updateMethod.resolveDepenendencies(origin, updateConfig);

    expect(origin).toEqual(expected);
  });
});
