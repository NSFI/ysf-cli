const util = require("./utils");

describe("Utils", () => {
  it("should sort version tags correct", () => {
    const origin = ["3.10.34", "0.0.1", "3.9.24", "0.0.3", "0.1.4", "3.1.4"];
    const exptected = ["0.0.1", "0.0.3", "0.1.4", "3.1.4", "3.9.24", "3.10.34"];

    const result = util.sortGitTags(origin);

    expect(result).toEqual(exptected);
  });
});
