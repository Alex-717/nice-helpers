

import { srcRoot, projectRoot } from "../utils/path.js"
import fs from "fs"
import path from "path"

const params = process.argv.slice(2)
const len = params.length
if (!len) throw new Error('缺少参数')
if (params.length > 1) throw new Error('存在多个参数')

async function getAllExistFiles (filePath, resultArray = []) {
  try {
    const stats = await fs.promises.stat(filePath)
    if (stats.isDirectory()) {
      const files = await fs.promises.readdir(filePath)
      for (let file of files) {
        const fileChild = path.resolve(filePath, file)
        await getAllExistFiles(fileChild, resultArray)
      }
    } else {
      resultArray.push(path.basename(filePath, path.extname(filePath)))
    }
    return resultArray
  } catch (err) {
    console.log('getAllExistMethods err', err)
  }
}

async function getAllExistTestFiles (filePath, resultArray = []) {
  try {
    const stats = await fs.promises.stat(filePath)
    if (stats.isDirectory()) {
      const files = await fs.promises.readdir(filePath)
      for (let file of files) {
        const fileChild = path.resolve(filePath, file)
        await getAllExistTestFiles(fileChild, resultArray)
      }
    } else {
      resultArray.push(path.basename(filePath, path.extname(filePath)))
    }
    return resultArray
  } catch (err) {
    console.log('getAllExistTestFiles err', err)
  }
}

/**
 * 仅支持在src新增ts文件，不支持新增目录
 */
async function addFile () {
  const hasExistMethods = await getAllExistFiles(srcRoot)
  console.log('🚀', hasExistMethods)
  let addFileName = params[0]
  const ext = path.extname(addFileName)
  if (ext !== '.ts') addFileName += '.ts'
  const name = addFileName.split('.')[0]
  if (hasExistMethods.includes(path.basename(addFileName, '.ts'))) throw new Error('文件已存在')
  await fs.promises.writeFile(path.resolve(srcRoot, addFileName), `export function ${name} () {}`)
  await fs.promises.writeFile(path.resolve(srcRoot, 'index.ts'), `\nexport * from './${path.basename(addFileName, '.ts')}'`, { flag: 'a' }) // append 追加

  // 在test/src/cases下生成文件
  const testCasesRoot = path.resolve(projectRoot, 'test/src/cases')
  const hasExistTestMethods = await getAllExistTestFiles(testCasesRoot)
  if (!hasExistTestMethods.includes(path.basename(addFileName, '.ts'))) {
    const testFileContent = `// @ts-ignore
import { ${path.basename(addFileName, '.ts')} } from 'nice-helpers'

// TODO: 添加测试代码
console.log('${path.basename(addFileName, '.ts')} 测试')
`
    await fs.promises.writeFile(path.resolve(testCasesRoot, addFileName), testFileContent)
  }
}

addFile()