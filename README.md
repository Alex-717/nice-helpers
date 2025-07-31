### helpers

这是一个工具库项目。

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