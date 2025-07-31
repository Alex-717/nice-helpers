# 工具库测试项目

这是一个用于测试 `nice-helpers` 工具库的 Vite 项目。

## 启动项目

```bash
npm install
npm run dev
```

## 测试工具函数

项目启动后可以通过URL访问不同的测试用例：
- `http://localhost:5174/deepClone`：测试deepClone函数
- `http://localhost:5174/runMicroTask`：测试runMicroTask函数

测试用例文件位于 `src/cases` 目录下，每个测试用例都有独立的文件。

## 开发流程

本项目通过Vite别名配置，将`nice-helpers`映射到根目录`src`下的`index.ts`，从而实现在测试项目中直接使用`import xxx from 'nice-helpers'`的方式导入工具函数。

添加新的测试用例只需在`src/cases`目录下创建新的测试文件，并确保文件中有默认导出即可。