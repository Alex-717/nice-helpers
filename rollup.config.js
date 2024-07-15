
import { defineConfig } from 'rollup'
import nodeResolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import esBuild from 'rollup-plugin-esbuild'

export default defineConfig( {
  input: './src/index.ts',
  output: {
    file: './dist/index.js',
    format: 'esm',
    exports: 'named'
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**'
    }),
    esBuild()
  ]
})