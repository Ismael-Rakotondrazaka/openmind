// @ts-check
import prettierConfig from 'eslint-config-prettier';
import perfectionist from 'eslint-plugin-perfectionist';

import withNuxt from './.nuxt/eslint.config.mjs';

const ignores = [
  'node_modules/**',
  '.next/**',
  'out/**',
  'build/**',
  'scripts/**',
  'tests/**',
  '.output/**',
  '.nuxt/**',
  '.data/**',
  'old/**',
  'shared/types/database.ts',
  'prisma/generated/**',
  'docs/**',
  '**/*.md',
];

export default withNuxt([
  {
    ignores,
  },
  {
    rules: {
      'vue/html-self-closing': 'off',
    },
  },
  perfectionist.configs['recommended-alphabetical'],
  prettierConfig,
]);
