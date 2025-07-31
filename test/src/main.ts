import './style.css'

// 根据URL参数动态加载测试用例
const url = new URL(window.location.href)
const testCase = url.pathname.substring(1) || 'deepClone'


;(async () => {
  await import(
    /* @vite-ignore */
    `./cases/${testCase}`
  )
})();