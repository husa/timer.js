module.exports = {
  root: true,
  env: {
    es6: true,
  },
  globals: {},
  extends: ["eslint:recommended", "prettier"],
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
