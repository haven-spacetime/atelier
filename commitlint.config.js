const config = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "test", "refactor", "chore", "docs", "style", "perf", "ci"],
    ],
    "header-max-length": [2, "always", 72],
  },
};

export default config;
