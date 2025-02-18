// @ts-check
import { defineConfig } from 'eslint-config-hyoban'

import recursiveSort from './plugins/eslint-recursive-sort.js'

export default defineConfig(
  {
    formatting: false,
    lessOpinionated: true,
    ignores: ['dist/**'],
    preferESM: false,
  },
  {
    settings: {
      tailwindcss: {
        whitelist: ['center'],
      },
    },
    rules: {
      'unicorn/prefer-math-trunc': 'off',
      'unicorn/expiring-todo-comments': 0,
      '@eslint-react/no-clone-element': 0,
      '@eslint-react/hooks-extra/no-direct-set-state-in-use-effect': 0,
      // NOTE: Disable this temporarily
      'react-compiler/react-compiler': 0,
      'no-restricted-syntax': 0,
      'package-json/valid-name': 0,
      'no-restricted-globals': [
        'error',
        {
          name: 'location',
          message:
            "Since you don't use the same router instance in electron and browser, you can't use the global location to get the route info. \n\n" +
            'You can use `useLocaltion` or `getReadonlyRoute` to get the route info.',
        },
      ],
    },
  },
  {
    files: ['**/*.tsx'],
    rules: {
      '@stylistic/jsx-self-closing-comp': 'error',
    },
  },
  {
    files: ['locales/**/*.json'],
    plugins: {
      'recursive-sort': recursiveSort,
    },
    rules: {
      'recursive-sort/recursive-sort': 'error',
    },
  },
  {
    files: ['package.json'],
    rules: {
      'package-json/valid-name': 0,
    },
  },
)
