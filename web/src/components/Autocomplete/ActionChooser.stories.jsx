import { generateMockData } from 'src/test/mocks/generateMockData'
import { withRHF } from 'src/test/utils/decorators'

import ActionChooser from './ActionChooser'

const mockData = generateMockData('anAction', 'ActionFields', 6)

mockGraphQLQuery('searchActions', () => {
  return {
    searchActions: mockData,
  }
})

export default {
  title: 'Components/Autocomplete/ActionChooser',
  component: ActionChooser,
  tags: ['autodocs'],
  args: {
    name: 'action',
    label: 'Select Action',
    placeholder: 'Select an action',
    helperText: '',
    error: false,
    loading: false,
    multiple: false,
  },
}

export const Default = {}

export const WithValue = {
  args: {
    ...Default.args,
    value: mockData[1],
  },
}

export const WithHelperText = {
  args: {
    ...Default.args,
    helperText: 'Choose an action to associate',
  },
}

export const WithError = {
  args: {
    ...Default.args,
    error: true,
    helperText: 'Action selection required',
  },
}

export const Loading = {
  args: {
    ...Default.args,
    loading: true,
  },
}

export const AsFormField = {
  args: {
    ...Default.args,
    isRHF: true,
  },
  decorators: [withRHF({ action: mockData[0] })],
}
