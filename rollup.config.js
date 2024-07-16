
import { defineConfig } from 'rollup'
import nodeResolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import esBuild from 'rollup-plugin-esbuild'
import del from 'rollup-plugin-delete'
import { dts } from 'rollup-plugin-dts'
// https://www.rollupjs.com/configuration-options/#input
export default defineConfig(
  [
    {
    input: './src/index.ts',
    output: {
      file: './dist/index.js',
      format: 'esm',
      exports: 'named'
    },
    plugins: [
      del({
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
      esBuild({
        loaders: {
          '.ts': 'ts'
        }
      })
    ]
  },
  {
    input:'./src/index.ts',
    plugins: [
      dts()
    ],
    output: {
        format: 'esm',
        file: 'dist/index.d.ts',
    },
  }
])