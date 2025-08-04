### helpers

这是一个工具库项目。

## 安装和使用

### Node.js 环境

```bash
npm install nice-helpers
```

```javascript
import { deepClone, getObjVal, nRequest } from 'nice-helpers'

// 使用工具函数
const cloned = deepClone(originalObject)
const value = getObjVal(obj, 'path.to.value')
const request = nRequest()
```

### 浏览器环境

在浏览器中使用时，可以通过 CDN 或本地文件引入：

```html
<!-- 如果需要使用 nRequest 函数，必须先引入 axios -->
<script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>

<!-- 引入 nice-helpers -->
<script src="https://cdn.jsdelivr.net/npm/nice-helpers@latest/dist/index.js"></script>

<script>
  // 使用全局对象 niceHelpers
  const cloned = niceHelpers.deepClone(originalObject)
  const value = niceHelpers.getObjVal(obj, 'path.to.value')
  const request = niceHelpers.nRequest() // 需要先引入 axios
</script>
```

**重要提示**：
- 如果使用 `dist/index.js` 或 `dist/index.min.js` 中的 `nRequest` 函数，必须先引入 `axios` 作为依赖
- 其他工具函数（如 `deepClone`、`getObjVal` 等）可以独立使用，无需额外依赖

## 文档

项目的文档使用 VitePress 构建，位于 `docs` 目录下。可以通过以下命令启动文档开发服务器：

```bash
npm run docs:dev
```

构建文档网站：

```bash
npm run docs:build
```

预览构建后的文档网站：

```bash
npm run docs:preview
```

## 新增工具函数

运行以下命令可以在 `src` 目录下新增一个工具函数文件，并在 `test/src/cases` 目录下生成对应的测试文件：

```bash
npm run add <functionName>
```

例如：

```bash
npm run add myNewFunction
```

这将会：
1. 在 `src` 目录下创建 `myNewFunction.ts` 文件。
2. 在 `src/index.ts` 中添加导出语句。
3. 在 `test/src/cases` 目录下创建 `myNewFunction.ts` 测试文件，并包含基本的导入语句。

## 删除工具函数

运行以下命令可以删除指定的工具函数文件及其测试文件：

```bash
npm run del <functionName>
```

例如：

```bash
npm run del myNewFunction
```

这将会：
1. 删除 `src` 目录下的 `myNewFunction.ts` 文件。
2. 从 `src/index.ts` 中移除导出语句。
3. 删除 `test/src/cases` 目录下的 `myNewFunction.ts` 测试文件。

## 可用函数

### 基础工具函数（无依赖）

- `deepClone(obj)` - 深度克隆对象
- `getObjVal(obj, path, defaultValue)` - 安全获取对象属性值，支持数组索引
- `urlParams` - URL 参数处理工具
- `runMicroTask(callback)` - 在微任务中执行回调
- `is` - 类型判断工具集

### 网络请求函数（需要 axios 依赖）

- `nRequest()` - 创建配置好的 axios 实例

**依赖说明**：
- 在 Node.js 环境中，`axios` 会作为 `peerDependencies` 自动处理
- 在浏览器环境中，使用 `nRequest` 函数时必须先手动引入 `axios`