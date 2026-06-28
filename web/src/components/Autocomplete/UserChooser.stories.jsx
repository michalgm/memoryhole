import { generateMockData } from 'src/test/mocks/generateMockData'
import { withRHF } from 'src/test/utils/decorators'

import UserChooser from './UserChooser'

const mockData = generateMockData('aUser', 'UserFields', 6)

mockGraphQLQuery('searchUsers', () => {
  return {
    searchUsers: mockData,
  }
})

export default {
  title: 'Components/Autocomplete/UserChooser',
  component: UserChooser,
  tags: ['autodocs'],
  args: {
    name: 'user',
    label: 'Select User',
    placeholder: 'Select a user',
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
    helperText: 'Choose a user to associate',
  },
}

export const WithError = {
  args: {
    ...Default.args,
    error: true,
    helperText: 'User selection required',
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
  decorators: [withRHF({ user: mockData[0] })],
}
