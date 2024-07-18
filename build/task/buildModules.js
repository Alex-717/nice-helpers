
import { defineConfig } from 'rollup'
import nodeResolve from '@rollup/plugin-node-resolve'
import { getBabelOutputPlugin } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import esBuild, { minify as Minify } from 'rollup-plugin-esbuild'
import del from 'rollup-plugin-delete'
import { dts } from 'rollup-plugin-dts'
import { globSync } from 'glob'
import path from 'path'
import terser from '@rollup/plugin-terser';
import { srcRoot, projectRoot } from '../utils/path.js'

const distRoot = path.resolve(projectRoot, 'dist')
const input = path.resolve(srcRoot, 'index.ts')

// fromEntries将键值对列表转换为一个对象
// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries
const modulesInput = Object.fromEntries(
  globSync(`${srcRoot}/**/*.ts`).map(file => {
    
    // 这里将删除 `src/` 以及每个文件的扩展名。
    // 因此，例如 src/nested/foo.js 会变成 nested/foo
    const key = path.relative(
      'src',
      file.slice(0, file.length - path.extname(file).length)
    )

    // 这里可以将相对路径扩展为绝对路径，例如
    // src/nested/foo 会变成 /project/src/nested/foo.js
    const val = path.resolve(projectRoot, file)
    return [key, val]
  })
)

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
      plugins: [
        ...bundleBabelConfig
      ],
      minify: true
    }),
    ...buildType({
      input: modulesInput,
      output: {
        dir: `${distRoot}/es`,
        format: 'esm',
        entryFileNames: '[name].d.ts',
      }
    }),
    ...buildType({
      input: modulesInput,
      output: {
        dir: `${distRoot}/lib`,
        format: 'commonjs',
        entryFileNames: '[name].d.ts',
      }
    }),
])

function buildConfig (options) {
  const { minify = false, cleanDist = false, ...config } = options
  const rollupConfig = {
    input: config.input,
    output: config.output,
    plugins: [
      cleanDist && del({
        targets: 'dist/*'
      }),
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

function buildType ({ input, output }) {
  const rollupConfig = {
    input,
    output,
    plugins: [
      dts()
    ]
  }
  return [rollupConfig]
}