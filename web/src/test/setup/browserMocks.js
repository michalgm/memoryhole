import { jest } from '@jest/globals'
window.getComputedStyle = () => ({ getPropertyValue: () => undefined })
window.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: query === '(pointer: fine)',
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// function getBoundingClientRect() {
//   const rec = {
//     x: 0,
//     y: 0,
//     bottom: 0,
//     height: 0,
//     left: 0,
//     right: 0,
//     top: 0,
//     width: 0,
//   }
//   return {
//     ...rec,
//     toJSON: () => rec,
//   }
// }

// class FakeDOMRectList extends Array {
//   item(index) {
//     return this[index] || null
//   }
// }

// document.elementFromPoint = () => null

// HTMLElement.prototype.getBoundingClientRect = getBoundingClientRect
// HTMLElement.prototype.getClientRects = () => new FakeDOMRectList()

// Range.prototype.getBoundingClientRect = getBoundingClientRect
// Range.prototype.getClientRects = () => new FakeDOMRectList()
