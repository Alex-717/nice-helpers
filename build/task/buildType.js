
import { defineConfig } from 'rollup'
import { dts } from 'rollup-plugin-dts'
import path from 'path'
import { projectRoot } from '../utils/path.js'
import { modulesInput } from '../utils/getInput.js'

const distRoot = path.resolve(projectRoot, 'dist')

// https://www.rollupjs.com/configuration-options/#input
export default defineConfig(
  [
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