const plugin = require('node-stdlib-browser/helpers/esbuild/plugin')
const stdLibBrowser = require('node-stdlib-browser')

const esbuild = require('esbuild')

;(async () => {
  await esbuild.build({
    entryPoints: ['lib/esm/browser.js'],
    bundle: true,
    minify: true,
    sourcemap: 'external',
    outfile: 'lib/index.js',
    inject: [require.resolve('node-stdlib-browser/helpers/esbuild/shim')],
    define: {
      global: 'global',
      process: 'process',
      Buffer: 'Buffer',
    },
    plugins: [plugin(stdLibBrowser)],
  })
})()

