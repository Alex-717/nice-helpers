
import { defineConfig } from 'rollup'
import nodeResolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import esBuild from 'rollup-plugin-esbuild'
import del from 'rollup-plugin-delete'
import { dts } from 'rollup-plugin-dts'
import { globSync } from 'glob'
import path from 'path'
import terser from '@rollup/plugin-terser';

import { srcRoot, projectRoot } from '../utils/path.js'

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
console.log('🥰🥰🥰---input:', modulesInput)

// process.exit(1)

const distRoot = path.resolve(projectRoot, 'dist')

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
      cleanDist: true
    }),
    ...buildConfig({
      input: modulesInput,
      output: {
        dir: `${distRoot}/lib`,
        format: 'commonjs',
        entryFileNames: '[name].js',
        exports: 'named'
      } 
    }),
    ...buildConfig({
      input,
      output: {
        file: `${distRoot}/index.js`,
        format: 'umd',
        name: 'niceHelpers',
        exports: 'named',
      } 
    }),
    ...buildConfig({
      input,
      output: {
        file: `${distRoot}/index.min.js`,
        format: 'iife',
        name: 'niceHelpers',
        exports: 'named',
      },
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
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**'
      }),
      minify && terser(),
      esBuild({
        loaders: {
          '.ts': 'ts'
        }
      }),
      ...(config.plugins || [])
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
    plugins: [
      dts()
    ],
    output
  }
  return [rollupConfig]
}