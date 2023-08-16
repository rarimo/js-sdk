const { ESLint } = require("eslint");
const path = require("path");
const baseConfig = require("../.eslintrc.js");

module.exports = async function lint(dirpath) {
  try {
    // 1. Create an instance with the `fix` option.
    const eslint = new ESLint({
      baseConfig,
      fix: true,
      cache: true,
      overrideConfig: {
        parserOptions: {
            ...baseConfig.parserOptions,
            project: [`${dirpath}/tsconfig.json`],
        }
      }
    });

    // 2. Lint files. This doesn't modify target files.
    const results = await eslint.lintFiles([`${dirpath}/src/**/*.{ts,tsx}`]);

    // 3. Modify the files with the fixed code.
    await ESLint.outputFixes(results);

    // 4. Format the results.
    const formatter = await eslint.loadFormatter("stylish");
    const resultText = formatter.format(results);

    // 5. Output it.
    console.log(resultText);
  } catch (error) {
    process.exitCode = 1;
    console.error(error);
  }
}
