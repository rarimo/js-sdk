// module.exports = {
//   extends: [
//     '../../.eslintrc.js',
//     'plugin:import/recommended',
//     'plugin:jsx-a11y/recommended',
//     'plugin:react/recommended',
//     'plugin:react/jsx-runtime',
//     'plugin:react-hooks/recommended',
//   ],
//   ignorePatterns: ['dist'],
//   overrides: [
//     {
//       files: ['**/*.ts?(x)'],
//       parser: '@typescript-eslint/parser',
//       extends: [
//         'plugin:@typescript-eslint/recommended',
//         'plugin:import/typescript',
//       ],
//     },
//   ],
//   plugins: ['simple-import-sort'],
//   parserOptions: {
//     tsconfigRootDir: '.',
//     ecmaVersion: 'latest',
//     sourceType: 'module',
//     ecmaFeatures: {
//       jsx: true,
//     },
//   },
//   settings: {
//     'import/parsers': {
//       '@typescript-eslint/parser': ['.ts', '.tsx'],
//     },
//     'import/resolver': {
//       typescript: {
//         project: 'packages/*/tsconfig.json',
//       },
//       node: {
//         paths: ['src'],
//         extensions: ['.js', '.jsx', '.ts', '.tsx'],
//       },
//     },
//     react: {
//       version: 'detect',
//     },
//   },
//   rules: {
//     'simple-import-sort/imports': 'error',
//     'simple-import-sort/exports': 'error',
//     'react/display-name': 'off',
//     'import/namespace': 'off',
//     '@typescript-eslint/no-non-null-assertion': 0,
//   },
// }
