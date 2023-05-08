module.exports = {
  root: true,
  env: {
    es6: true,
    browser: true,
    node: true,
  },
  globals: {},
  extends: ["eslint:recommended", "prettier"],
  ignorePatterns: ["dist/**/*.*"],
  overrides: [
    {
      files: ["test/specs/*.js"],
      env: {
        jasmine: true,
        node: true,
      },
    },
    {
      files: ["./*rc.js"],
      env: {
        node: true,
      },
    },
  ],
};
