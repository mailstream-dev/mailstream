/* eslint-disable */
export default {
  displayName: "nx-plugin-ecr",
  preset: "../../../jest.preset.js",
  transform: {
    "^.+\\.[tj]s$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.spec.json" }],
  },
  moduleFileExtensions: ["ts", "js", "html"],
  coverageDirectory: "../../../coverage/src/package/nx-plugin-ecr",
};
