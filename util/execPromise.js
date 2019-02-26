const { exec } = require('child_process');

module.exports = function execPromise(command, option = {}) {
  return new Promise(function(resolve, reject) {
    exec(command, option, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(stdout.trim());
    });
  });
};
