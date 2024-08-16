/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
  preset: "ts-jest",
  rootDir: "./",
  testMatch: ["**/test/**/*.spec.ts"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
};
