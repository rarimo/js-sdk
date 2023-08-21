module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    jest: true,
  },
  ignorePatterns: [
    'dist',
    'assets',
    'node_modules',
    'vite.config.ts',
    'abis',
    'types/contracts',
    '.wasm',
    '.zkey',
    'circuits'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json', './packages/*/tsconfig.json'],
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
    'plugin:import/typescript',
  ],
  plugins: ['@typescript-eslint', 'prettier', 'simple-import-sort'],
  overrides: [
    {
      files: ['**/*.tsx'],
      extends: [
        'plugin:import/recommended',
        'plugin:jsx-a11y/recommended',
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'plugin:react-hooks/recommended',
      ],
      rules: {
        'react/display-name': 'off',
        'import/namespace': 'off',
      },
      settings: {
        'import/parsers': {
          '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
        'import/resolver': {
          typescript: {
            project: 'packages/*/tsconfig.json',
          },
          node: {
            paths: ['src'],
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
          },
        },
        react: {
          version: 'detect',
        },
      },
    },
  ],
  rules: {
    'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    'arrow-parens': 0,
    'no-debugger': 1,
    'no-warning-comments': [
      1,
      {
        terms: ['hardcoded'],
        location: 'anywhere',
      },
    ],
    'no-console': [
      1,
      {
        allow: ['warn', 'error'],
      },
    ],
    'no-return-await': 0,
    'object-curly-spacing': ['error', 'always'],
    'no-var': 'error',
    'comma-dangle': [1, 'always-multiline'],
    'linebreak-style': ['error', 'unix'],
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
  },
}
