import { afterAll, beforeAll, beforeEach } from '@jest/globals'
import { setupServer } from 'msw/node'

const server = setupServer()

export const setupTestServer = () => {
  beforeAll(() => server.listen())
  afterAll(() => server.close())
  beforeEach(() => server.resetHandlers())

  return server
}
