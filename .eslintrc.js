module.exports = {
  "env": {
    "commonjs": true,
    "es6": true,
    "node": true,
    "jest": true,
  },
  "extends": "eslint:recommended",
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "parserOptions": {
    "ecmaVersion": 2018
  },
  "rules": {
    "no-console": [0],
    "no-unused-vars": [1]
  }
};
