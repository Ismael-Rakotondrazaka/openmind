// @ts-check
import perfectionist from 'eslint-plugin-perfectionist';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

import withNuxt from './.nuxt/eslint.config.mjs';

const ignores = [
  'node_modules/**',
  '.next/**',
  'out/**',
  'build/**',
  'next-env.d.ts',
  'shared/types/database.ts',
  'scripts',
  'core/**',
  'tests',
  'apify',
];

export default withNuxt([
  {
    ignores,
    rules: {
      'vue/html-self-closing': 'off',
    },
  },
  {
    ...eslintPluginPrettierRecommended,
    ignores,
    rules: {
      'prettier/prettier': [
        'error',
        {
          arrowParens: 'avoid',
          bracketSameLine: false,
          bracketSpacing: true,
          endOfLine: 'lf',
          jsxSingleQuote: true,
          plugins: ['prettier-plugin-tailwindcss'],
          printWidth: 80,
          proseWrap: 'preserve',
          quoteProps: 'as-needed',
          semi: true,
          singleQuote: true,
          tabWidth: 2,
          trailingComma: 'es5',
          useTabs: false,
        },
      ],
    },
  },
  {
    ...perfectionist.configs['recommended-alphabetical'],
    ignores,
  },
]);
