
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = resolve(__filename, '..')

export const projectRoot = resolve(__dirname, '../..')
export const srcRoot = resolve(projectRoot, 'src')
export const buildRoot = resolve(projectRoot, 'build')
