import { srcRoot, projectRoot } from "../utils/path.js"
import fs from "fs"
import path from "path"

const params = process.argv.slice(2)
const len = params.length
if (!len) throw new Error('缺少参数')
if (params.length > 1) throw new Error('存在多个参数')

/**
 * 删除指定的工具函数文件
 * 会同时删除 src 目录下的文件和 test/src/cases 目录下的测试文件
 */
async function delFile () {
  let delFileName = params[0]
  const ext = path.extname(delFileName)
  if (ext !== '.ts') delFileName += '.ts'
  
  // 删除 src 目录下的文件
  const srcFilePath = path.resolve(srcRoot, delFileName)
  if (fs.existsSync(srcFilePath)) {
    await fs.promises.unlink(srcFilePath)
    console.log(`已删除 ${srcFilePath}`)
  } else {
    console.log(`文件 ${srcFilePath} 不存在`)
  }
  
  // 从 index.ts 中移除导出语句
  const indexFilePath = path.resolve(srcRoot, 'index.ts')
  if (fs.existsSync(indexFilePath)) {
    const indexContent = await fs.promises.readFile(indexFilePath, 'utf-8')
    const exportLine = `export * from './${path.basename(delFileName, '.ts')}'`
    const newIndexContent = indexContent.replace(`\n${exportLine}`, '')
    await fs.promises.writeFile(indexFilePath, newIndexContent)
    console.log(`已从 ${indexFilePath} 中移除导出语句`)
  }
  
  // 删除 test/src/cases 目录下的测试文件
  const testCasesRoot = path.resolve(projectRoot, 'test/src/cases')
  const testFilePath = path.resolve(testCasesRoot, delFileName)
  if (fs.existsSync(testFilePath)) {
    await fs.promises.unlink(testFilePath)
    console.log(`已删除 ${testFilePath}`)
  } else {
    console.log(`测试文件 ${testFilePath} 不存在`)
  }
}

delFile()