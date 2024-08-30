

import { srcRoot } from "../utils/path.js"
import fs from "fs"
import path from "path"

const params = process.argv.slice(2)
const len = params.length
if (!len) throw new Error('缺少参数')
if (params.length > 1) throw new Error('存在多个参数')

async function getAllExistFiles (filePath, resultArray = []) {
  try {
    const stats = await fs.promises.stat(filePath)
    const isDir = stats.isDirectory()
    if (isDir) {
      const files = await fs.promises.readdir(filePath)
      for (let file of files) {
        const fileChild = filePath + path.sep + file
        const stats = await fs.promises.stat(fileChild)
        if (stats.isFile()) {
          resultArray.push(path.basename(fileChild).split('.').shift())
        } else {
          await getAllExistFiles(fileChild, resultArray)
        }
      }
    } else {
      resultArray.push(path.basename(filePath).split('.').shift())
    }
    return resultArray
  } catch (err) {
    console.log('getAllExistMethods err', err)
  }
}

async function addFile () {
  const hasExistMethods = await getAllExistFiles(srcRoot)
  console.log('🚀', hasExistMethods)
  let newFile = params[0].split('.').shift()
  if (hasExistMethods.includes(newFile)) throw new Error('文件已存在')
  const array = params[0].split('.')
  if (!['js', 'ts'].includes(array[array.length-1])) {
    array.push('ts')
    newFile = array.join('.')
  }
  const newFilePath = srcRoot + path.sep + newFile
  await fs.promises.writeFile(newFilePath, '')
  await fs.promises.writeFile(srcRoot+path.sep+'index.ts', `\nexport * from './${newFile}'`, {
    encoding: 'utf-8',
    flag: 'a'
  })
}

addFile()
