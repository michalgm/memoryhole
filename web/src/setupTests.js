// Also mock the .jsx extension in case some imports use it
jest.mock('src/lib/useOptionSets.jsx', () => require('src/lib/useOptionSets'))
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  expect,
  jest,
} from '@jest/globals'

import { waitFor } from '@cedarjs/testing/web'

import './test/setup/browserMocks'

jest.mock('src/components/utils/SnackBar', () =>
  jest.requireActual('src/components/utils/SnackBarProvider.mock')
)
expect.extend({
  toContainText(received, text) {
    const containsText = (element, searchText) => {
      if (typeof element === 'string') {
        return element.includes(searchText)
      }
      if (element.props && element.props.children) {
        if (Array.isArray(element.props.children)) {
          return element.props.children.some((child) =>
            containsText(child, searchText)
          )
        }
        return containsText(element.props.children, searchText)
      }
      return false
    }

    return {
      pass: containsText(received, text),
      message: () => `expected ${received} to contain text "${text}"`,
    }
  },
})

jest.mock('src/components/utils/BaseField', () => {
  const ActualBaseField = jest.requireActual('src/components/utils/BaseField')
  return {
    ...ActualBaseField,
    BaseField: (props) => {
      if (props.field_type === 'richtext' && props.editable === false) {
        return (
          <div
            className="tiptap"
            dangerouslySetInnerHTML={{ __html: props.id }}
          />
        )
      }
      const modifiedProps = {
        ...props,
        field_type:
          props.field_type === 'richtext' ? 'text-area' : props.field_type,
      }

      return <ActualBaseField.BaseField {...modifiedProps} />
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

jest.mock('@cedarjs/router', () => {
  const actual = { ...jest.requireActual('@cedarjs/router') }
  const navigateSpy = jest.spyOn(actual, 'navigate')
  return {
    ...actual,
    // ...jest.requireActual('@cedarjs/router'),
    navigate: navigateSpy,
    useRoutePath: jest.fn(() => '/mock-route-path'),
    useRouteName: jest.fn((path) => `${path}-route-name`),
  }
})

jest.mock('src/lib/useSiteSettings', () => {
  const actual = { ...jest.requireActual('src/lib/useSiteSettings') }
  return {
    ...actual,
    useSiteSettings: jest.fn(() => ({
      settings: { timeZone: 'America/Los_Angeles' },
      loading: false,
    })),
  }
})

jest.mock('src/lib/useOptionSets', () => {
  const actual = { ...jest.requireActual('src/lib/useOptionSets') }
  // Provide default test data for all real optionSets
  return {
    ...actual,
    useOptionSets: jest.fn(() => ({
      optionSets: {
        states: [
          {
            label: 'California',
            id: 'California',
          },
          {
            label: 'New York',
            id: 'New York',
          },
        ],
        arrest_release_type: [
          {
            label: 'Unknown/In Custody',
            id: 'Unknown/In Custody',
          },
        ],
        cities: [
          {
            label: 'Oakland',
            id: 'Oakland',
          },
          {
            label: 'San Francisco',
            id: 'San Francisco',
          },
        ],
        jurisdictions: [
          {
            label: 'San Francisco',
            id: 'San Francisco',
          },
          {
            label: 'Alameda',
            id: 'Alameda',
          },
        ],
        arrest_custody_status: [
          {
            label: 'Unknown/Unconfirmed',
            id: 'Unknown/Unconfirmed',
          },
          {
            label: 'In Custody',
            id: 'In Custody',
          },
        ],
        jail_population: [
          {
            label: 'Female',
            id: 'Female',
          },
        ],
        arrest_case_status: [
          {
            label: 'Pre-Arraignment',
            id: 'Pre-Arraignment',
          },
        ],
        arrest_disposition: [
          {
            label: 'Dismissed',
            id: 'Dismissed',
          },
        ],
        log_type: [
          {
            label: 'Shift Summary',
            id: 'Shift Summary',
          },
          {
            label: 'Email',
            id: 'Email',
          },
        ],
      },
      loading: false,
      error: null,
      refetch: jest.fn(),
    })),
  }
})

export { customRender as render } from './test/utils/testUtils'
