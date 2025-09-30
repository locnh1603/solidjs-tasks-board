import { defineFlatConfig } from 'eslint';
import solid from 'eslint-plugin-solid';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier';

export default defineFlatConfig([
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
      },
    },
    plugins: {
      solid,
      '@typescript-eslint': tseslint,
      prettier: eslintPluginPrettier,
    },
    rules: {
      ...solid.configs.typescript.rules,
      ...tseslint.configs.recommended.rules,
      // TypeScript strictness
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-inferrable-types': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/strict-boolean-expressions': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      // SolidJS best practices
      'solid/components-return-once': 'error',
      'solid/no-react-specific-props': 'error',
      'solid/no-unknown-namespaces': 'error',
      'solid/prefer-for': 'warn',
      'solid/no-innerhtml': 'error',
      // General JS/TS
      eqeqeq: ['error', 'always'],
      curly: 'error',
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-alert': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-template': 'error',
      'no-duplicate-imports': 'error',
      'no-return-await': 'error',
      'no-useless-catch': 'error',
      'no-empty-function': 'error',
      'no-shadow': 'error',
      'no-implicit-coercion': 'error',
      'no-multi-assign': 'error',
      'no-new-wrappers': 'error',
      'no-proto': 'error',
      'no-throw-literal': 'error',
      'no-unneeded-ternary': 'error',
      'no-unused-expressions': 'error',
      'no-useless-constructor': 'error',
      'object-shorthand': ['error', 'always'],
      'prefer-arrow-callback': 'error',
      'prefer-spread': 'error',
      'prefer-rest-params': 'error',
      yoda: 'error',
      // Prettier integration
      'prettier/prettier': 'error',
    },
    settings: {},
    ignores: ['dist', 'node_modules'],
    extends: [prettier],
  },
]);