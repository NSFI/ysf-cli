const fs = require("fs");
const path = require("path");
process.argv.splice(0, 2);
console.log("===========BEGIN==============");

try {
  let files = process.argv;

  if (files && files.length) {
    let content = files
      .map(file => fs.readFileSync(path.resolve(file)))
      .map(buffer => buffer.toString())
      .join("\n");

    console.log(content);
  } else {
    console.log("No Files to process Files ");
  }
} catch (e) {
  console.log(e.message);
  console.log("No Files");
}

console.log("===========END==============");
