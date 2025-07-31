# 快速开始

## 安装

使用 npm 安装：

```bash
npm install nice-helpers
```

使用 yarn 安装：

```bash
yarn add nice-helpers
```

使用 pnpm 安装：

```bash
pnpm add nice-helpers
```

## 使用

### 全量引入

```javascript
import * as helpers from 'nice-helpers'

console.log(helpers.is.string('hello')) // true
```

### 按需引入

```javascript
import { is, deepClone } from 'nice-helpers'

console.log(is.string('hello')) // true

const obj = { a: 1, b: { c: 2 } }
const clonedObj = deepClone(obj)
```

### 单独引入

```javascript
import is from 'nice-helpers/is'
import deepClone from 'nice-helpers/deepClone'

console.log(is.string('hello')) // true
const clonedObj = deepClone(obj)
```

## 在浏览器中使用

```html
<script src="https://cdn.jsdelivr.net/npm/nice-helpers/dist/index.js"></script>
<script>
  console.log(niceHelpers.is.string('hello')) // true
</script>
```