const program = require("commander");

module.exports = (...d) => {
  if (program.verbose) {
    console.log(...d);
  }
};
