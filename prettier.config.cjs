/** @type {import('prettier').Config} */
module.exports = {
  endOfLine: "lf",
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "es5",
  importOrder: [
    // React imports first
    "^(react/(.*)$)|^(react$)",

    "",
    // Packages from node_modules (third-party libraries)
    "<THIRD_PARTY_MODULES>",

    "",
    // Aliased imports (matches any alias starting with @)
    "^@/(.*)$",

    "",
    // Absolute imports from internal project folders (if any)
    "^src/(.*)$",

    "",
    // Style imports
    "^.+\\.s?css$",

    "",
    // Relative imports (e.g., ./ and ../)
    "^[./]",
  ],
  plugins: ["@ianvs/prettier-plugin-sort-imports"],
};
