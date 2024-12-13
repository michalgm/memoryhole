import { afterAll, afterEach, beforeAll, beforeEach, jest } from '@jest/globals'
import { waitFor } from '@testing-library/react'
import { setupServer } from 'msw/node'

window.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

const server = setupServer()

beforeAll(() => server.listen())
afterAll(() => server.close())
beforeEach(() => server.resetHandlers())

beforeEach(() => {
  jest.clearAllMocks()
})

afterEach(async () => {
  await waitFor(() => {
    // Wait for any pending state updates or async operations
  })
})

afterAll(async () => {
  await waitFor(() => {
    // Wait for any pending state updates or async operations
  })
})
