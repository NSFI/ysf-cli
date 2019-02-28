const fs = require("fs");

process.argv.splice(0, 2);
console.log("===========BEGIN==============");
console.log("firstLetter");
try {
  let files = process.argv;

  let firstLetter = "";
  if (files && files.length) {
    firstLetter = files
      .map(file => fs.readFileSync(file))
      .map(buffer => buffer.toString())
      .map(str => str.split("\n"))
      .map(strArr => strArr.map(str => str.slice(0, 1)))
      .map(strArr => strArr.join(""))
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
