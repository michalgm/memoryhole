import { Field } from 'src/components/utils/Field'
import { withRHF } from 'src/test/utils/decorators'

import { SnackBarProvider } from '../utils/SnackBar'

import Autocomplete from './Autocomplete'

const options = [
  { id: 1, label: 'Option 1' },
  { id: 2, label: 'Option 2' },
  { id: 3, label: 'Option 3' },
]

export default {
  title: 'Components/Autocomplete',
  component: Autocomplete,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <SnackBarProvider>
        <Story />
      </SnackBarProvider>
    ),
  ],
  args: {
    name: 'demo-autocomplete',
    label: 'Select an option',
    helpertext: 'This is a helper text for the autocomplete',
    placeholder: 'Start typing to search...',
    storeFullObject: false,
    options,
    loading: false,
    error: false,
    isRHF: true,
  },
}

// Basic static options example
export const WithStaticOptions = {
  render: (args) => <Field {...args} />,
  args: {
    field_type: 'autocomplete',
    value: 3,
  },
  decorators: [withRHF({ 'demo-autocomplete': options[0].id, beep: 'boop' })],
}

export const WithStoreFullObject = {
  args: {
    storeFullObject: true,
  },
  decorators: [withRHF()],
}

// With custom rendering
export const WithCustomRendering = {
  decorators: [withRHF()],

  args: {
    ...WithStaticOptions.args,
    renderOption: (props, option) => (
      <li {...props} key={option.id}>
        {option.label} - Custom Render
      </li>
    ),
  },
}
