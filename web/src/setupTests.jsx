import '@testing-library/jest-dom/vitest'
import { afterAll, afterEach, beforeAll, beforeEach, expect, vi } from 'vitest'

import { waitFor } from '@cedarjs/testing/web'

import './test/setup/browserMocks'

// beforeAll(() => {
//   vi.spyOn(console, 'warn').mockImplementation(() => {})
// })

vi.mock(
  'src/components/utils/SnackBar',
  () => import('src/components/utils/SnackBarProvider.mock')
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

vi.mock('src/components/utils/BaseField', async (importOriginal) => {
  const ActualBaseField = { ...(await importOriginal()) }
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
  window.scrollTo = vi.fn()
})

beforeEach(() => {
  window.scrollTo.mockClear()
  vi.clearAllMocks()
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

// Vitest evaluates this factory more than once per test file (src files and test
// files end up with separate instances of Cedar's MockRouter mock), so keep a
// single navigate spy on globalThis or assertions see a different spy than components call
vi.mock('@cedarjs/router', async (importOriginal) => {
  const actual = { ...(await importOriginal()) }
  const navigateSpy = (globalThis.__navigateSpy ??= vi.fn(actual.navigate))
  return {
    ...actual,
    navigate: navigateSpy,
    useRoutePath: vi.fn(() => '/mock-route-path'),
    useRouteName: vi.fn((path) => `${path}-route-name`),
  }
})

vi.mock('src/lib/useSiteSettings', async (importOriginal) => {
  const actual = { ...(await importOriginal()) }
  return {
    ...actual,
    useSiteSettings: vi.fn(() => ({
      settings: { timeZone: 'America/Los_Angeles' },
      loading: false,
    })),
  }
})

vi.mock('src/lib/useOptionSets', async (importOriginal) => {
  const actual = { ...(await importOriginal()) }
  // Provide default test data for all real optionSets
  return {
    ...actual,
    useOptionSets: vi.fn(() => ({
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
      refetch: vi.fn(),
    })),
  }
})
