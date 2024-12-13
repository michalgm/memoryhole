export const asyncDebounce = (fn, wait) => {
  let pending = null
  return (...args) => {
    if (!pending) {
      pending = new Promise((resolve) => {
        setTimeout(async () => {
          const result = await fn(...args)
          pending = null
          resolve(result)
        }, wait)
      })
    }
    return pending
  }
}
