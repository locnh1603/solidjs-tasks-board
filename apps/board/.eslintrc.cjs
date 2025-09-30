module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['solid', '@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:solid/typescript',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  rules: {
    // Customize rules as needed
  },
};