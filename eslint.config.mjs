// @ts-check
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import withNuxt from "./.nuxt/eslint.config.mjs";
// import tseslint from "typescript-eslint";

// Your custom configs here
export default withNuxt([
  {
    // plugins: {
    //   typescriptEslint,
    // },
    files: [
      "./",
      "./configs/**/*.ts",
      "./di/**/*.ts",
      "./repositories/**/*.ts",
      "./schemas/**/*.ts",
      "./services/**/*.ts",
      "./utils/**/*.ts",
    ],
    ignores: [
      // # ignore generate imports
      "auto-imports.d.ts",
      "components.d.ts",
      "nuxt.d.ts",
      // # nuxt and other artefacts
      ".nuxt",
      ".output",
      "node_modules",
      "dist",
      "public",
      "presets",
      // prisma generated
      "prisma/generated",
    ],
    rules: {
      "no-console": "error",
      semi: ["error", "always"],
      quotes: ["error", "double"],
      "semi-style": ["error", "last"],
      "semi-spacing": [
        "error",
        {
          before: false,
          after: true,
        },
      ],
      "comma-dangle": [
        "error",
        {
          arrays: "only-multiline",
          objects: "only-multiline",
          imports: "only-multiline",
          exports: "only-multiline",
          functions: "only-multiline",
        },
      ],
      indent: ["error", 2],
      "no-unused-vars": [
        "error",
        {
          vars: "all",
          args: "after-used",
          ignoreRestSiblings: false,
        },
      ],
      curly: ["error", "multi-line"],
      "vue/v-on-event-hyphenation": [
        "error",
        "always",
        {
          autofix: true,
        },
      ],
      "import/no-named-as-default-member": "off",
    },
  },
  eslintConfigPrettier,
  eslintPluginPrettierRecommended,
  // @ts-ignore
  // ...tseslint.configs.recommended,
]);
