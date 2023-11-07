import { startCase } from 'lodash'
import {
  AutocompleteElement,
  DatePickerElement,
  DateTimePickerElement,
  RadioButtonGroup,
  TextFieldElement,
  useFormContext,
} from 'react-hook-form-mui'

export const formatLabel = (label) => {
  const index = label.lastIndexOf('.')
  return startCase(label.slice(index + 1))
}

export const Field = ({ name, field_type = 'text', tabIndex, ...props }) => {
  const { setValue } = useFormContext()

  props.label = props.label || formatLabel(name)

  const textFieldProps = {
    name,
    variant: 'outlined',
    fullWidth: true,
    size: 'small',
    inputProps: {
      tabIndex,
    },
  }

  const renderDatePicker = () => {
    const Component =
      field_type === 'date-time' ? DateTimePickerElement : DatePickerElement
    return (
      <Component
        {...props}
        name={name}
        inputProps={textFieldProps}
        timeSteps={{ minutes: 1 }}
      />
    )
  }

  const renderAutocomplete = () => {
    const options = ['', ...props.options].map((opt) =>
      opt.label ? opt : { id: opt, label: opt }
    )
    const autocompleteProps = {
      ...textFieldProps,
      isOptionEqualToValue: (option = {}, value) =>
        option.id === value || option.id === value?.id,
      onChange: (e, value) => setValue(name, value?.id || null),
    }
    delete autocompleteProps.inputProps
    return (
      <AutocompleteElement
        name={name}
        options={options}
        label={props.label}
        matchId
        textFieldProps={textFieldProps}
        autocompleteProps={autocompleteProps}
      />
    )
  }
  const renderTextField = () => {
    const textFieldOptions =
      field_type === 'textarea' ? { multiline: true, minRows: 3 } : {}
    return (
      <TextFieldElement {...props} {...textFieldProps} {...textFieldOptions} />
    )
  }

  const renderRadio = () => {
    return <RadioButtonGroup {...props} {...textFieldProps} />
  }

  switch (field_type) {
    case 'radio':
      return renderRadio()
    case 'date-time':
    case 'date':
      return renderDatePicker()
    case 'select':
      return renderAutocomplete()
    case 'textarea':
    default:
      return renderTextField()
  }
}
