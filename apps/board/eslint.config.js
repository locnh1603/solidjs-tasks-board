import solid from 'eslint-plugin-solid';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier';

export default [
  // Global ignores
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/build/**',
      '**/.turbo/**',
      '**/coverage/**',
      '**/*.config.js',
      '**/*.config.cjs',
      '**/*.config.mjs',
      '**/vite.config.ts',
      '**/playwright.config.ts',
    ],
  },
  // Main configuration for TypeScript/JavaScript files
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        fetch: 'readonly',
        Promise: 'readonly',
        RequestInit: 'readonly',
        Response: 'readonly',
      },
    },
    plugins: {
      solid,
      '@typescript-eslint': tseslint,
      prettier: eslintPluginPrettier,
    },
    rules: {
      // Spread recommended configs
      ...solid.configs.typescript.rules,
      ...tseslint.configs.recommended.rules,
      ...prettier.rules,

      // ============================================
      // TypeScript Best Practices (Production-Ready)
      // ============================================
      '@typescript-eslint/explicit-function-return-type': 'off', // Allow inference for better DX
      '@typescript-eslint/explicit-module-boundary-types': 'off', // SolidJS components don't need explicit return types
      '@typescript-eslint/no-explicit-any': 'error', // Prevent any usage
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-inferrable-types': 'warn', // Allow explicit types for documentation
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'], // Prefer interfaces
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ], // Optimize bundle size
      '@typescript-eslint/no-non-null-assertion': 'warn', // Warn on ! usage
      '@typescript-eslint/no-unnecessary-condition': 'off', // Can be too strict with SolidJS reactivity
      '@typescript-eslint/strict-boolean-expressions': 'off', // Too strict for SolidJS
      '@typescript-eslint/no-floating-promises': 'error', // Catch unhandled promises
      '@typescript-eslint/await-thenable': 'error', // Prevent await on non-promises
      '@typescript-eslint/no-misused-promises': 'error', // Prevent promise misuse
      '@typescript-eslint/prefer-optional-chain': 'error', // Use ?. syntax
      '@typescript-eslint/prefer-nullish-coalescing': 'error', // Use ?? syntax
      '@typescript-eslint/no-unnecessary-type-assertion': 'error', // Remove redundant type assertions
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-expect-error': 'allow-with-description',
          'ts-ignore': 'allow-with-description',
          'ts-nocheck': 'allow-with-description',
          minimumDescriptionLength: 10,
        },
      ], // Require descriptions for suppressions
      '@typescript-eslint/no-empty-function': ['error', { allow: ['arrowFunctions'] }],
      '@typescript-eslint/no-shadow': 'error', // Prevent variable shadowing
      '@typescript-eslint/prefer-as-const': 'error', // Use as const
      '@typescript-eslint/prefer-enum-initializers': 'warn', // Explicit enum values
      '@typescript-eslint/prefer-readonly': 'warn', // Suggest readonly when possible
      '@typescript-eslint/prefer-string-starts-ends-with': 'error', // Use startsWith/endsWith
      '@typescript-eslint/no-unsafe-assignment': 'off', // Too strict for most codebases
      '@typescript-eslint/no-unsafe-member-access': 'off', // Too strict for most codebases
      '@typescript-eslint/no-unsafe-call': 'off', // Too strict for most codebases
      '@typescript-eslint/no-unsafe-return': 'off', // Too strict for most codebases

      // ============================================
      // SolidJS Best Practices (Production-Ready)
      // ============================================
      'solid/components-return-once': 'error', // Ensure single return point
      'solid/event-handlers': 'error', // Enforce correct event handler format
      'solid/imports': 'error', // Enforce correct imports
      'solid/jsx-no-duplicate-props': 'error', // No duplicate props
      'solid/jsx-no-script-url': 'error', // Security: no javascript: URLs
      'solid/jsx-no-undef': 'error', // No undefined components
      'solid/jsx-uses-vars': 'error', // Prevent false unused var warnings
      'solid/no-destructure': 'error', // Don't destructure props (breaks reactivity)
      'solid/no-innerhtml': ['error', { allowStatic: true }], // Prevent XSS
      'solid/no-react-deps': 'error', // Don't use React-style deps arrays
      'solid/no-react-specific-props': 'error', // No className, htmlFor, etc.
      'solid/no-unknown-namespaces': 'error', // Only valid JSX namespaces
      'solid/prefer-for': 'error', // Use <For> instead of .map()
      'solid/prefer-show': 'warn', // Use <Show> for conditional rendering
      'solid/reactivity': 'error', // Catch common reactivity mistakes
      'solid/self-closing-comp': 'error', // Self-close components without children
      'solid/style-prop': 'error', // Enforce style prop format

      // ============================================
      // JavaScript/General Best Practices
      // ============================================
      // Code Quality
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }], // Allow certain console methods
      'no-debugger': 'error', // No debugger in production
      'no-alert': 'error', // No alert() calls
      'no-var': 'error', // Use let/const
      'prefer-const': 'error', // Use const when possible
      'prefer-template': 'error', // Use template literals
      'no-duplicate-imports': 'error', // Combine imports
      'sort-imports': ['error', { ignoreDeclarationSort: true }], // Sort import members
      
      // Equality & Comparisons
      eqeqeq: ['error', 'always', { null: 'ignore' }], // Use === except for null checks
      yoda: 'error', // No Yoda conditions
      'no-implicit-coercion': ['error', { allow: ['!!'] }], // Allow !! for boolean conversion
      
      // Error Handling
      'no-throw-literal': 'error', // Throw Error objects
      'no-useless-catch': 'error', // Don't catch and rethrow
      'prefer-promise-reject-errors': 'error', // Reject with Error objects
      
      // Functions
      'no-empty-function': 'off', // Handled by TS rule
      'no-shadow': 'off', // Handled by TS rule
      'no-unused-expressions': 'error', // No unused expressions
      'no-useless-constructor': 'off', // Handled by TS
      'prefer-arrow-callback': ['error', { allowNamedFunctions: true }],
      'arrow-body-style': ['error', 'as-needed'], // Concise arrow functions
      'no-param-reassign': ['error', { props: true }], // Don't mutate parameters
      
      // Objects & Arrays
      'object-shorthand': ['error', 'always'], // Use shorthand syntax
      'prefer-destructuring': ['error', { object: true, array: false }], // Destructure objects
      'prefer-spread': 'error', // Use spread instead of .apply()
      'prefer-rest-params': 'error', // Use rest parameters
      'no-multi-assign': 'error', // No chained assignments
      'dot-notation': 'error', // Use dot notation when possible
      
      // Control Flow
      curly: ['error', 'all'], // Always use braces
      'no-else-return': ['error', { allowElseIf: false }], // No else after return
      'no-lonely-if': 'error', // Use else if instead of nested if
      'no-unneeded-ternary': 'error', // Simplify ternaries
      'no-nested-ternary': 'warn', // Avoid nested ternaries
      
      // Security & Safety
      'no-eval': 'error', // No eval()
      'no-implied-eval': 'error', // No setTimeout with string
      'no-new-func': 'error', // No new Function()
      'no-new-wrappers': 'error', // No new String/Number/Boolean
      'no-proto': 'error', // No __proto__
      'no-script-url': 'error', // No javascript: URLs
      
      // Async/Await
      'no-async-promise-executor': 'error', // No async in Promise constructor
      'no-await-in-loop': 'warn', // Warn about await in loops
      'no-return-await': 'off', // Disabled in favor of TS rule
      'require-await': 'error', // Async functions must use await
      
      // Prettier Integration
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
          semi: true,
          singleQuote: true,
          tabWidth: 2,
          trailingComma: 'es5',
          printWidth: 100,
          arrowParens: 'always',
        },
      ],
    },
  },
  // Relaxed rules for test files
  {
    files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}', '**/tests/**'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      'no-console': 'off',
    },
  },
  // Relaxed rules for configuration files
  {
    files: ['**/*.config.{ts,js,mjs}', '**/scripts/**'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
];