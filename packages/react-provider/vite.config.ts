import react from '@vitejs/plugin-react'
import * as fs from 'fs'
import * as path from 'path'
import { defineConfig, loadEnv } from 'vite'
import dts from 'vite-plugin-dts'
import tsconfigPaths from 'vite-tsconfig-paths'

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = (relative: string) => path.resolve(appDirectory, relative)
const root = path.resolve(__dirname, resolveApp('src'))

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const isProduction = env.VITE_APP_ENVIRONMENT === 'production'

  return {
    ...(!isProduction && {
      server: { port: 3333 },
    }),
    ...(isProduction && {
      build: {
        lib: {
          entry: path.resolve(__dirname, `${root}/index.ts`),
          formats: ['cjs', 'es'],
          fileName: format => `react-provider.${format}.js`,
        },
        rollupOptions: {
          // make sure to externalize deps that shouldn't be bundled
          // into your library
          external: ['react'],
          // output: {
          //   // Provide global variables to use in the UMD build
          //   // for externalized deps
          //   globals: {},
          // },
        },
        sourcemap: true,
      },
    }),
    publicDir: 'static',
    plugins: [
      react(),
      tsconfigPaths(),
      dts(),
      {
        name: 'inject',
        transformIndexHtml() {
          return isProduction
            ? []
            : [
                {
                  tag: 'script',
                  attrs: {
                    type: 'module',
                    src: 'https://unpkg.com/web3@latest/dist/web3.min.js',
                    // defer: true,
                  },
                  injectTo: 'head',
                },
              ]
        },
      },
    ],
    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
      dedupe: ['react'],
      alias: {
        '@': `${root}/`,
      },
    },
  }
})
