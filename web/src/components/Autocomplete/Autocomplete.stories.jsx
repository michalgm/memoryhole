import { SnackBarProvider } from '../utils/SnackBar'

import Autocomplete from './Autocomplete'
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
}

// Basic static options example
export const WithStaticOptions = {
  args: {
    name: 'demo-autocomplete',
    label: 'Select an option',
    options: [
      { id: 1, label: 'Option 1' },
      { id: 2, label: 'Option 2' },
      { id: 3, label: 'Option 3' },
    ],
    storeFullObject: false,
  },
}

// With custom rendering
export const WithCustomRendering = {
  args: {
    ...WithStaticOptions.args,
    renderOption: (props, option) => (
      <li {...props} key={option.id}>
        {option.label} - Custom Render
      </li>
    ),
  },
}
