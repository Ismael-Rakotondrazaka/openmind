module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Enforce a maximum line length for the commit message
    "body-max-line-length": [2, "always", 100],

    // Specify the case for the scope (e.g., lowercase)
    "scope-case": [2, "always", "lower-case"],

    // Specify the case for the subject (e.g., sentence case)
    "subject-case": [2, "always", "sentence-case"],

    // Ensure the commit message subject ends with a period
    "subject-full-stop": [2, "always", "."],
  },
};
