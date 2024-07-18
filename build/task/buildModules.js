
import { defineConfig } from 'rollup'
import nodeResolve from '@rollup/plugin-node-resolve'
import { getBabelOutputPlugin } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import esBuild, { minify as Minify } from 'rollup-plugin-esbuild'
import path from 'path'
import terser from '@rollup/plugin-terser';
import { projectRoot } from '../utils/path.js'
import { input, modulesInput } from '../utils/getInput.js'

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
  getBabelOutputPlugin({
    allowAllFormats: true,
    presets: [
      ['@babel/preset-env', { 
        modules: 'umd'
      }]
    ]
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
      external: [/@babel\/runtime/],
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
      external: [/@babel\/runtime/]
    }),
    // TODO: umd和iife，babel处理了语法，但是没有polyfill
    ...buildConfig({
      input,
      output: {
        file: `${distRoot}/index.js`,
        format: 'umd',
        name: 'niceHelpers',
        exports: 'named'
      },
      plugins: [
        ...bundleBabelConfig
      ]
    }),
    ...buildConfig({
      input,
      output: {
        file: `${distRoot}/index.min.js`,
        format: 'iife',
        name: 'niceHelpers',
        exports: 'named'
      },
      // plugins: [
      //   ...bundleBabelConfig
      // ],
      minify: true
    })
])

function buildConfig (options) {
  const { minify = false, cleanDist = false, ...config } = options
  const rollupConfig = {
    input: config.input,
    output: config.output,
    plugins: [
      nodeResolve(
        {
          extensions: ['.ts', '.js']
        }
      ),
      commonjs(),
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
