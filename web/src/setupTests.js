import { afterAll, afterEach, beforeAll, beforeEach, jest } from '@jest/globals'

import { waitFor } from '@redwoodjs/testing/web'

import './test/setup/browserMocks'

jest.mock('src/components/utils/SnackBar', () =>
  jest.requireActual('src/components/utils/SnackBarProvider.mock')
)
jest.mock('src/components/utils/RichTextInput', () => {
  return {
    __esModule: true,
    default: (props) => {
      if (props.readonly) {
        return (
          <div data-testid="mocked-rich-text" className="tiptap">
            {props.content}
          </div>
        )
      }
      return (
        <div data-testid="mocked-rich-text">
          <label htmlFor={props.name}>{props.label}</label>
          <input
            type="text"
            name={props.name}
            id={props.name}
            defaultValue={props.content}
          />
          <div
            className="tiptap"
            dangerouslySetInnerHTML={{ __html: props.content }}
          />
        </div>
      )
    },
  }
})

beforeAll(() => {
  window.scrollTo = jest.fn()
})

beforeEach(() => {
  window.scrollTo.mockClear()
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

jest.mock('@redwoodjs/router', () => {
  const actual = { ...jest.requireActual('@redwoodjs/router') }
  const navigateSpy = jest.spyOn(actual, 'navigate')
  return {
    ...actual,
    // ...jest.requireActual('@redwoodjs/router'),
    navigate: navigateSpy,
    useRoutePath: jest.fn(() => '/mock-route-path'),
    useRouteName: jest.fn((path) => `${path}-route-name`),
  }
})

export { customRender as render } from './test/utils/testUtils'
