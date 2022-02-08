/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/en/configuration.html
 */
// eslint-disable-next-line
// @ts-ignore
// eslint-disable-next-line  @typescript-eslint/no-var-requires
const paths = require("./tsconfig.json").compilerOptions.paths;
const aliases = {};

for (let key in paths) {
  if (paths.hasOwnProperty(key)) {
    const aliasKey = key.replace("/*", "");
    const aliasValue = String(paths[key]).replace("/*", "");
    aliases[`^${aliasKey}(.*)$`] = `<rootDir>/${aliasValue}$1`;
  }
}

module.exports = {
  // projects: [

  displayName: "node",
  clearMocks: true,
  restoreMocks: true,
  resetMocks: true,
  testEnvironment: "node",
  //  setupFiles: ["dotenv/config"],
  // coverageThreshold: {
  //   global: {
  //     branches: 60,
  //     functions: 60,
  //     lines: 60,
  //     statements: 60,
  //   },
  // },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(ts?)$",
  //  testMatch: ['**/api/*.test.ts?(x)'],
  globals: {
    "ts-jest": {
      diagnostics: false,
    },
  },
  preset: "ts-jest",
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "js", "json", "node"],
  moduleNameMapper: aliases,

  // ],
};
