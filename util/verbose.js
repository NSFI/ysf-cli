const program = require("commander");
const readline = require("readline");
exports = module.exports = (...d) => {
  if (program.verbose) {
    module.exports.clearLine();
    console.log(...d);
  }
};

exports.clearLine = () => {
  readline.clearLine(process.stdout, 0);
  readline.cursorTo(process.stdout, 0);
};
