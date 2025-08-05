
import { defineConfig } from 'rollup'
import nodeResolve from '@rollup/plugin-node-resolve'
import babel, { getBabelOutputPlugin } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import esBuild from 'rollup-plugin-esbuild'
import path from 'path'
import terser from '@rollup/plugin-terser';
import { projectRoot } from '../utils/path.mjs'
import { input, modulesInput } from '../utils/getInput.mjs'
import addPolyfillImports from '../utils/plugins/add-polyfill-imports.mjs'

const distRoot = path.resolve(projectRoot, 'dist')

const moduleBabelConfig = [
  getBabelOutputPlugin({
    presets: ['@babel/preset-env'],
    plugins: [
      ['@babel/plugin-transform-runtime', {
        absoluteRuntime: false,
        corejs: 3,
        helpers: true,
        regenerator: true
      }]
    ]
  })
]
const bundleBabelConfig = [
  babel({
    babelHelpers: 'bundled',
    presets: [
      ['@babel/preset-env', {
        targets: {
          browsers: ['> 1%', 'last 2 versions', 'ie >= 11']
        },
        // modules: 'false',
        useBuiltIns: 'entry',
        corejs: 3
      }]
    ]
  }),
  addPolyfillImports({
    imports: [
      'core-js/stable',
      'regenerator-runtime/runtime'
    ],
    include: ['src/index.ts'],
    position: 'top',
    skipIfExists: true
  })
]

// https://www.rollupjs.com/configuration-options/#input
export default defineConfig(
  [
    ...buildConfig({
      input: modulesInput,
      output: {
        dir: `${distRoot}/es`,
        format: 'esm',
        entryFileNames: '[name].js',
        exports: 'named'
      },
      plugins: [
        ...moduleBabelConfig
      ],
      external: [/@babel\/runtime/, 'axios'],
      cleanDist: true
    }),
    ...buildConfig({
      input: modulesInput,
      output: {
        dir: `${distRoot}/lib`,
        format: 'commonjs',
        entryFileNames: '[name].js',
        exports: 'named'
      },
      plugins: [
        ...moduleBabelConfig
      ],
      external: [/@babel\/runtime/, 'axios']
    }),
    ...buildConfig({
      input,
      output: {
        file: `${distRoot}/index.js`,
        format: 'umd',
        name: 'niceHelpers',
        exports: 'named',
        globals: {
          'axios': 'axios'
        }
      },
      plugins: [
        ...bundleBabelConfig
      ],
      external: ['axios']
    }),
    ...buildConfig({
      input,
      output: {
        file: `${distRoot}/index.min.js`,
        format: 'iife',
        name: 'niceHelpers',
        exports: 'named',
        globals: {
          'axios': 'axios'
        }
      },
      plugins: [
        ...bundleBabelConfig
      ],
      minify: true,
      isBrowser: true,
      external: ['axios']
    })
])

function buildConfig (options) {
  const { minify = false, cleanDist = false, isBrowser = false, ...config } = options
  const nodeResolveConfig = {
    extensions: ['.ts', '.js']
  }
  if (isBrowser)
    nodeResolveConfig.browser = true
  const rollupConfig = {
    input: config.input,
    output: config.output,
    plugins: [
      nodeResolve(nodeResolveConfig),
      commonjs(),
      json(),
      minify && terser(),
      ...(config.plugins || []),
      esBuild({
        loaders: {
          '.ts': 'ts'
        }
      }),
    ]
  }

  if (config.external) {
    rollupConfig.external = config.external
  }
  return [rollupConfig]
}
