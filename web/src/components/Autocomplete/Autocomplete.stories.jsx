import dayjs from 'dayjs'

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

// Dynamic query example
export const WithDynamicQuery = {
  args: {
    name: 'dynamic-autocomplete',
    label: 'Search users',
    query: {
      model: 'user',
      searchField: 'name',
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
      take: 10,
    },
  },
}

// Dynamic query example
export const WithArrestsQuery = {
  args: {
    name: 'dynamic-autocomplete-arrests',
    label: 'Search arrests',
    query: {
      model: 'arrest',
      orderBy: {
        update_at: 'desc',
      },
      take: 10,
    },
    getOptionLabel: (option) => option.arrestee.search_display_field || '',
    onChange: (e, value) => {
      console.log('value', value)
    },
    renderOption: (
      props,
      { id, arrestee: { search_display_field }, date, arrest_city }
    ) => {
      const subtitle = `${date ? dayjs(date).format('L') : ''}${
        date && arrest_city ? ' - ' : ''
      }${arrest_city ? arrest_city : ''}`
      return (
        <li {...props} key={id}>
          <div>
            {' '}
            {search_display_field} ({subtitle})
          </div>
        </li>
      )
    },
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
