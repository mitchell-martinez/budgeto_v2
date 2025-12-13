import { defineConfig } from 'eslint/config';

import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-plugin-prettier';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import sonarjsPlugin from 'eslint-plugin-sonarjs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default defineConfig([
  js.configs.recommended,

  // Global ignores (ensure generated router types are skipped)
  {
    ignores: ['.react-router/**', '**/.react-router/**', 'dist/**'],
  },

  // Compatibility with classic "extends"
  ...compat.extends(
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ),

  {
    ignores: ['dist/**'],

    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
      globals: {
        __dirname: 'readonly',
        require: 'readonly',
        module: 'readonly',
        cy: 'writable',
      },
    },

    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },

    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      '@typescript-eslint': tsPlugin,
      prettier: prettierPlugin,
      'simple-import-sort': simpleImportSort,
      sonarjs: sonarjsPlugin,
    },

    rules: {
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
        },
      ],
      curly: ['error', 'all'],
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/display-name': 'off',
      'no-prototype-builtins': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { args: 'after-used', ignoreRestSiblings: true },
      ],
      '@typescript-eslint/no-var-requires': 'off',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^\\u0000'], // side-effect imports
            ['^eslint/config$'], // prioritize eslint config before other packages
            [''], // general packages
            ['^@(components|models|helpers|utils)/.*$'], // aliases
            ['^\\.'], // relative imports
          ],
        },
      ],
    },
  },

  // Override: JS files
  {
    files: ['*.js'],
    languageOptions: {
      parserOptions: {
        project: null,
      },
    },
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },

  // Override: TS/TSX files
  {
    files: ['*.ts', '*.tsx'],
    rules: {
      'react/prop-types': 'off',
    },
  },

  // Override: sonarjs rules (excluding tests/stories)
  {
    files: ['**/*.{js,ts,tsx}'],
    ignores: [
      '**/__tests__/**/*',
      '**/*.stories.*',
      '.react-router/**',
      '**/.react-router/**',
    ],
    plugins: {
      sonarjs: sonarjsPlugin,
    },
    rules: {
      'sonarjs/no-nested-template-literals': 'warn',
      'sonarjs/cognitive-complexity': ['warn', 17],
    },
  },

]);
