const fs = require("fs");

process.argv.splice(0, 2);
console.log("===========BEGIN==============");

try {
  let files = process.argv;

  let firstLetter = "";
  if (files && files.length) {
    firstLetter = files
      .map(file => fs.readFileSync(file))
      .map(buffer => buffer.toString())
      .map(str =>
        str.replace(
          /import ([{}]?\s*\w+\s*[-{}]?)+ from\s+(["']?\w+["']?)+/gm,
          "const $1 = require($2)"
        )
      )
      .map(str => str.replace(/export default /gm, "module.exports = "))
      .join("\n");

    console.log(firstLetter);
  } else {
    console.log("No Files to process Files ");
  }
} catch (e) {
  console.log(e.message);
  console.log("No Files");
}

console.log("===========END==============");
