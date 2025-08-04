// plugins/add-polyfill-imports.js
import MagicString from 'magic-string';
import path from 'path';

export default function addPolyfillImports(options = {}) {
  const {
    imports = [],
    include = ['**/index.ts', '**/index.js'],
    exclude = [],
    position = 'top',
    skipIfExists = true
  } = options;

  if (imports.length === 0) {
    throw new Error('addPolyfillImports: imports array cannot be empty');
  }

  const createFilter = (include, exclude) => {
    const includePatterns = [].concat(include || []).map(pattern => {
      // 将glob模式转换为正则表达式
      let regexPattern = pattern
        .replace(/\\/g, '/')  // 统一使用正斜杠
        .replace(/\*\*/g, '.*')  // ** 匹配任意深度的目录
        .replace(/\*/g, '[^/]*');  // * 匹配单层目录中的任意字符
      
      // 确保模式匹配路径的结尾
      if (!regexPattern.endsWith('$')) {
        regexPattern += '$';
      }
      
      return new RegExp(regexPattern);
    });

    const excludePatterns = [].concat(exclude || []).map(pattern => {
      let regexPattern = pattern
        .replace(/\\/g, '/')
        .replace(/\*\*/g, '.*')
        .replace(/\*/g, '[^/]*');
      
      if (!regexPattern.endsWith('$')) {
        regexPattern += '$';
      }
      
      return new RegExp(regexPattern);
    });

    return (id) => {
      // 标准化路径，统一使用正斜杠
      const normalizedId = id.replace(/\\/g, '/');
      
      const isIncluded = includePatterns.some(pattern => {
        const match = pattern.test(normalizedId);
        return match;
      });
      
      const isExcluded = excludePatterns.some(pattern => pattern.test(normalizedId));
      
      return isIncluded && !isExcluded;
    };
  };

  const filter = createFilter(include, exclude);

  return {
    name: 'add-polyfill-imports',
    transform(code, id) {
      // console.log('ddd111', id)
      if (!filter(id)) {
        return null;
      }
      console.log('filter src/index.ts', id)

      let importsToAdd = [...imports];

      if (skipIfExists) {
        importsToAdd = imports.filter(imp => {
          const escapedImport = imp.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const importRegex = new RegExp(`import\\s+[^;]*['"\`]${escapedImport}['"\`]`);
          return !importRegex.test(code);
        });
      }

      if (importsToAdd.length === 0) {
        return null;
      }

      const magicString = new MagicString(code);
      const importStatements = importsToAdd
        .map(imp => `import '${imp}';`)
        .join('\n');

      if (position === 'top') {
        magicString.prepend(`${importStatements}\n\n`);
      } else if (position === 'after-imports') {
        const importRegex = /import\s+.*?from\s+['"][^'"]*['"];?\s*/g;
        let lastImportEnd = 0;
        let match;

        while ((match = importRegex.exec(code)) !== null) {
          lastImportEnd = match.index + match[0].length;
        }

        if (lastImportEnd > 0) {
          magicString.appendLeft(lastImportEnd, `${importStatements}\n`);
        } else {
          magicString.prepend(`${importStatements}\n\n`);
        }
      } else {
        magicString.append(`\n${importStatements}`);
      }

      return {
        code: magicString.toString(),
        map: magicString.generateMap({
          source: id,
          includeContent: true
        })
      };
    }
  };
}
