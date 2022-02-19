module.exports = {
  env: {
    browser: true,
    es2021: true,
    "jest/globals": true,
  },
  parser: "@typescript-eslint/parser",
  plugins: [
    "@typescript-eslint",
    "jest",
    "unused-imports",
    "simple-import-sort",
  ],
  extends: [
    "prettier",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  rules: {
    "@typescript-eslint/no-unused-vars": "off",
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "warn",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],

    "no-console": "warn",
    "max-len": [
      "error",
      {
        code: 150,
        ignoreComments: true,
      },
    ],
    "import/prefer-default-export": "off",
    "simple-import-sort/imports": "error",
    "import/no-extraneous-dependencies": [
      "off",
      { devDependencies: ["**/*.test.js"] },
    ],
    "import/no-unresolved": "off", // https://github.com/typescript-eslint/typescript-eslint/issues/1624
    "import/extensions": ["warn", "never", { json: "off" }], // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/extensions.md
  },
};
