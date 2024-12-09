module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
  },

  plugins: ["@typescript-eslint"],

  ignorePatterns: [
    "node_modules/",
    "dist/",
    "build/",
    "test/",
    "vite.config.ts",
    ".eslintrc.js",
    "babel.config.js",
  ],

  overrides: [
    {
      files: ["src/**/*.{ts,tsx}"],
      rules: {
        "@typescript-eslint/no-floating-promises": "error",
        "@typescript-eslint/await-thenable": "error",
        "@typescript-eslint/no-misused-promises": "error",
        "require-await": "error",
      },
    },
  ],

  root: true,
};
