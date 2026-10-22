import { vi } from 'vitest'
window.getComputedStyle = () => ({ getPropertyValue: () => undefined })
// A class rather than vi.fn(): Vitest 4 mocks with arrow implementations can't be called with `new`
window.ResizeObserver = class ResizeObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: query === '(pointer: fine)',
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
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
