// import ArrestChooser from './ArrestChooser'
import { BaseField } from 'src/components/utils/BaseField'
export default {
  title: 'Components/Autocomplete/ArrestChooser',
  component: BaseField,
  tags: ['autodocs'],
}

export const Default = {
  args: {
    field_type: 'arrest_chooser',
    name: 'arrest',
    label: 'Select Arrest',
    multiple: true,
  },
}

export const WithValue = {
  args: {
    ...Default.args,
    value: {
      id: 1,
      arrestee: {
        id: 2,
        search_display_field: 'John Doe - Case #123',
      },
      date: Date.now(),
      arrest_city: 'New York',
    },
  },
}

export const Loading = {
  args: {
    ...Default.args,
    loading: true,
  },
}
