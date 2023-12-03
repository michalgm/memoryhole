import {
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { capitalize } from 'lodash'
import {
  AutocompleteElement,
  CheckboxElement,
  DatePickerElement,
  DateTimePickerElement,
  RadioButtonGroup,
  TextFieldElement,
  useFormContext,
} from 'react-hook-form-mui'

export const formatLabel = (label) => {
  const index = label.lastIndexOf('.')
  return label
    .slice(index + 1)
    .replace(/_/g, ' ')
    .replace(/\w+/g, capitalize)
    .replace(/\b(bipoc|id\/pfn)\b/gi, (s) => s.toUpperCase())
}

export const Field = ({
  name,
  field_type = 'text',
  tabIndex,
  fullWidth = true,
  helperText = '',
  ...props
}) => {
  const { setValue } = useFormContext()

  props.label = props.label || formatLabel(name)

  const textFieldProps = {
    name,
    helperText,
    variant: 'outlined',
    fullWidth: fullWidth,
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
    const options = ['', ...(props.options || [])].map((opt) =>
      opt.label ? opt : { id: opt, label: opt }
    )

    delete props.options
    const autocompleteProps = {
      ...textFieldProps,
      isOptionEqualToValue: (option = {}, value) =>
        option.id === value || option.id === value?.id,
      onChange: (e, value) => setValue(name, value?.id || null),
      ...props,
    }
    delete autocompleteProps.inputProps
    delete autocompleteProps.helperText
    return (
      <AutocompleteElement
        name={name}
        options={options}
        label={props.label}
        matchId
        textFieldProps={textFieldProps}
        autocompleteProps={autocompleteProps}
        {...props}
      />
    )
  }
  const renderTextField = () => {
    const textFieldOptions =
      field_type === 'textarea'
        ? { multiline: true, minRows: props.minRows || 3 }
        : {}
    return (
      <TextFieldElement {...textFieldProps} {...textFieldOptions} {...props} />
    )
  }

  const renderRadio = () => {
    const options = props.options.map((opt) =>
      opt.label ? opt : { id: opt, label: formatLabel(opt) }
    )
    return (
      <RadioButtonGroup
        name={name}
        {...props}
        options={options}
        labelProps={{
          className: 'radio-label',
        }}
      ></RadioButtonGroup>
    )
  }

  const renderCheckboxGroup = () => {
    return (
      <Grid container spacing={2}>
        <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
          <FormLabel component="legend">{props.label}</FormLabel>
          <FormGroup>
            {props.options.map((option) => (
              <Grid xs={6} key={option}>
                <FormControlLabel
                  control={<CheckboxElement name={`${name}_${option}`} />}
                  label={option}
                />
              </Grid>
            ))}
          </FormGroup>
          <FormHelperText>{helperText}</FormHelperText>
        </FormControl>
      </Grid>
    )
  }

  const renderCheckbox = () => {
    return (
      <CheckboxElement
        name={`${name}`}
        sx={{ p: 0, pr: 1, pl: 1 }}
        label={props.label}
      />
    )
    // return <FormGroup>
    //   <FormControlLabel
    //     control={
    //     }
    //     label={props.label}
    //   />
    // </FormGroup>
  }

  switch (field_type) {
    case 'checkbox':
      return renderCheckbox()

    case 'checkbox_group':
      return renderCheckboxGroup()
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
