import ActionChooser from './ActionChooser'

export default {
  title: 'Components/Autocomplete/ActionChooser',
  component: ActionChooser,
  tags: ['autodocs'],
}

export const Default = {
  args: {
    name: 'action',
    label: 'Select Action',
  },
}

export const WithValue = {
  args: {
    ...Default.args,
    value: {
      id: 1,
      name: 'Climate March',
      start_date: '2023-12-01T10:00:00Z',
      city: 'Portland',
      jurisdiction: 'Multnomah County',
    },
  },
}

export const WithHelperText = {
  args: {
    ...Default.args,
    helperText: 'Choose an action to associate',
  },
}

export const AsFormField = {
  args: {
    ...Default.args,
    isRHF: true,
  },
}
