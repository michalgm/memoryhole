import UserChooser from './UserChooser'

export default {
  title: 'Components/Autocomplete/UserChooser',
  component: UserChooser,
  tags: ['autodocs'],
}

export const Default = {
  args: {
    name: 'user',
    label: 'Select User',
    placeholder: 'Select a user',
  },
}

export const WithValue = {
  args: {
    ...Default.args,
    value: {
      id: 1,
      name: 'Jane Smith',
    },
  },
}

export const WithError = {
  args: {
    ...Default.args,
    error: true,
    helperText: 'User selection required',
  },
}
