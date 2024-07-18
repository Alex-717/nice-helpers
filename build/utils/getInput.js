
import { globSync } from 'glob'
import path from 'path'
import { srcRoot, projectRoot } from './path.js'

export const input = path.resolve(srcRoot, 'index.ts')

// fromEntries将键值对列表转换为一个对象
// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries
export const modulesInput = Object.fromEntries(
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