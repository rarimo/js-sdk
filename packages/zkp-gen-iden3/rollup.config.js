import commonJS from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import json from '@rollup/plugin-json'
import terser from '@rollup/plugin-terser'
import alias from '@rollup/plugin-alias'
import nodePolyfills from 'rollup-plugin-polyfill-node'

const packageDirName = __dirname.split('/').pop()

export default {
  input: `${__dirname}/src/index.ts`,
  output: {
    sourcemap: true,
    file: `${__dirname}/dist/esm/index.js`,
    name: `${packageDirName}`,
    format: 'esm',
  },
  external: [
    '@syntect/wasm',
    'buffer',
    'Buffer',
    // '@iden3/js-crypto',
    // '@iden3/js-iden3-core',
    // '@iden3/js-jwz',
    // '@iden3/js-merkletree',
    // '@rarimo/identity-gen-iden3',
  ],
  plugins: [
    commonJS(),
    resolve({
      browser: true,
      preferBuiltins: false,
    }),
    nodePolyfills(),
    alias({
      entries: [
        {find: 'ethers', replacement: '../../node_modules/ethers/dist/ethers.esm.js'},

        {find: 'util', replacement: '../../node_modules/util/util.js'},
        {find: 'ejc', replacement: '../../node_modules/ejs/ejs.min.js'},
        {find: 'snarkjs', replacement: '../../node_modules/snarkjs/build/snarkjs.min.js'},
        { find: "@iden3/js-iden3-core", replacement: "../../node_modules/@iden3/js-iden3-core/dist/esm_esbuild/index.js" },
        { find: "@iden3/js-jwz", replacement: "../../node_modules/@iden3/js-jwz/dist/esm_esbuild/index.js" },
        { find: "@iden3/js-crypto", replacement: "../../node_modules/@iden3/js-crypto/dist/esm_esbuild/index.js" },
        { find: "@iden3/js-jsonld-merklization", replacement: "../../node_modules/@iden3/js-jsonld-merklization/dist/esm_esbuild/index.js" }
      ],
    }),
    babel({
      babelHelpers: 'bundled',
      exclude: [`${__dirname}/src/tests`, `${__dirname}/src/*.test.ts`],
    }),
    typescript({
      tsconfig: `${__dirname}/tsconfig.json`,
    }),
    json(),
    terser(),
  ],
}
