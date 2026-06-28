// import ArrestChooser from './ArrestChooser'
import { BaseField } from 'src/components/utils/BaseField'
import { generateMockData } from 'src/test/mocks/generateMockData'
import { withRHF } from 'src/test/utils/decorators'

const mockData = generateMockData('anArrest', 'ArrestFields', 6)

mockGraphQLQuery('lookupArrestNames', () => {
  return {
    searchArrests: mockData,
  }
})

export default {
  title: 'Components/Autocomplete/ArrestChooser',
  component: BaseField,
  tags: ['autodocs'],
  args: {
    field_type: 'arrest_chooser',
    name: 'arrest',
    label: 'Select Arrest',
    placeholder: 'Select an arrest',
    helperText: '',
    error: false,
    loading: false,
    multiple: false,
  },
}

export const Default = {
  args: {
    multiple: true,
  },
}

export const WithValue = {
  args: {
    ...Default.args,
    value: [mockData[1], mockData[3]],
  },
}

export const WithHelperText = {
  args: {
    ...Default.args,
    helperText: 'Choose an arrest to associate',
  },
}

export const WithError = {
  args: {
    ...Default.args,
    error: true,
    helperText: 'Arrest selection required',
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
  decorators: [withRHF({ arrest: [mockData[0], mockData[3]] })],
}
