import { renderToStaticMarkup } from 'react-dom/server'

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

export const convertSvgToDataUrl = (Icon, color = 'white') => {
  return `url('data:image/svg+xml,${renderToStaticMarkup(
    <Icon style={{ fill: color }} />
  ).replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ')}')`
}
