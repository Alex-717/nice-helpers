export function runMicroTask (task: (...args: any[]) => any) {
  if (globalThis.process && typeof globalThis.process.nextTick === 'function') {
    process.nextTick(task)
  } else if (typeof globalThis.MutationObserver === 'function') {
    const span = document.createElement('span')
    const ob = new MutationObserver(task)
    ob.observe(span, { childList: true })
    span.innerText = '10086'
  } else {
    setTimeout(task, 0)
  }
}