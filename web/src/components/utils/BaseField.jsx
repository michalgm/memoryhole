import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  TextField,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { DatePicker, DateTimePicker } from '@mui/x-date-pickers'
import { capitalize } from 'lodash-es'
import { Controller } from 'react-hook-form'
import {
  CheckboxElement,
  DatePickerElement,
  DateTimePickerElement,
  RadioButtonGroup,
  TextFieldElement,
} from 'react-hook-form-mui'

import ActionChooser from '../Autocomplete/ActionChooser'
import ArrestChooser from '../Autocomplete/ArrestChooser'
import Autocomplete from '../Autocomplete/Autocomplete'
import UserChooser from '../Autocomplete/UserChooser'

import RichTextInput from './RichTextInput'

export const formatLabel = (label) => {
  const index = label.lastIndexOf('.')
  return label
    .slice(index + 1)
    .replace(/_/g, ' ')
    .replace(/\w+/g, (word) => {
      return ['and'].includes(word) ? word : capitalize(word)
    })
    .replace(/\b(bipoc|id\/pfn)\b/gi, (s) => s.toUpperCase())
}

export const BaseField = ({
  name,
  field_type = 'text',
  tabIndex,
  fullWidth = true,
  helperText = '',
  options: defaultOptions,
  value,
  onChange,
  isRHF,
  control,
  color,
  textFieldProps: defaultTextFieldProps,
  ...props
}) => {
  // const { setValue, getValues } = useFormContext()

  props.label = props.label || formatLabel(name)

  if (!isRHF) {
    props.onChange = onChange
    props.value = value
  }

  const textFieldProps = {
    name,
    helperText,
    variant: 'outlined',
    fullWidth: fullWidth,
    size: 'small',
    color,
    ...defaultTextFieldProps,
  }
  if (tabIndex) {
    textFieldProps.inputProps = {
      tabIndex,
    }
  }

  const renderDatePicker = () => {
    const Component = isRHF
      ? field_type === 'date-time'
        ? DateTimePickerElement
        : DatePickerElement
      : field_type === 'date-time'
        ? DateTimePicker
        : DatePicker
    const disabled = Boolean(props.disabled)
    delete props.disabled
    return (
      <Component
        {...props}
        label={props.label}
        name={name}
        onChange={onChange}
        inputProps={textFieldProps}
        timeSteps={{ minutes: 1 }}
        slotProps={{
          field: { clearable: true },
        }}
        {...(disabled ? { disabled } : {})}
      />
    )
  }

  const renderAutocomplete = (extraProps = {}) => {
    const options = defaultOptions
      ? [...(defaultOptions || [])].map((opt) =>
          opt.label ? opt : { id: opt, label: opt }
        )
      : null

    return (
      <Autocomplete
        name={name}
        options={options}
        label={props.label}
        matchId={!props.storeFullObject}
        textFieldProps={textFieldProps}
        isRHF={isRHF}
        onChange={onChange}
        value={value}
        {...props}
        {...extraProps}
      />
    )
  }

  const renderChooser = () => {
    const components = {
      action_chooser: ActionChooser,
      arrest_chooser: ArrestChooser,
      user_chooser: UserChooser,
    }
    const Component = components[field_type] || Autocomplete
    return (
      <Component
        name={name}
        helperText={helperText}
        isRHF={isRHF}
        onChange={onChange}
        value={value}
        textFieldProps={textFieldProps}
        {...props}
      />
    )
  }

  const renderRichTextField = () => {
    const textFieldOptions = {
      ...textFieldProps,
      multiline: true,
      minRows: props.minRows || 3,
      content: value,
      onChange,
      ...props,
    }
    if (isRHF) {
      return (
        <Controller
          key={name}
          name={name}
          control={control}
          rules={{
            required: props.required && 'This field is required',
          }}
          render={({ field, formState }) => (
            <RichTextInput
              {...textFieldOptions}
              content={field.value}
              onChange={field.onChange}
              error={formState.errors[name]}
            />
          )}
        />
      )
    }
    return <RichTextInput {...textFieldOptions} />
  }

  const renderTextField = () => {
    const Component = isRHF ? TextFieldElement : TextField

    const textFieldOptions =
      field_type === 'textarea'
        ? { multiline: true, minRows: props.minRows || 3 }
        : {}
    return (
      <Component
        {...textFieldProps}
        {...textFieldOptions}
        {...props}
        onChange={onChange}
      />
    )
  }

  const renderRadio = () => {
    const options = defaultOptions.map((opt) =>
      opt.label ? opt : { id: opt, label: formatLabel(opt) }
    )
    return (
      <RadioButtonGroup
        name={name}
        {...props}
        onChange={onChange}
        options={options}
        labelProps={{
          className: 'radio-label',
        }}
      ></RadioButtonGroup>
    )
  }

  const renderCheckboxGroup = () => {
    const Component = isRHF ? CheckboxElement : Checkbox
    return (
      <Grid container spacing={2}>
        <FormControl
          sx={{ m: 3 }}
          component="fieldset"
          variant="standard"
          onChange={onChange}
          color={color}
        >
          <FormLabel component="legend">{props.label}</FormLabel>
          <FormGroup>
            {defaultOptions.map((option) => (
              <Grid xs={6} key={option}>
                <FormControlLabel
                  control={<Component name={`${name}_${option}`} />}
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
    const Component = isRHF ? CheckboxElement : Checkbox
    return (
      <FormGroup {...props}>
        <Component
          name={`${name}`}
          sx={{ p: 0, pr: 1, pl: 1 }}
          label={props.label}
          onChange={onChange}
          color={color}
        />
        <FormHelperText>{helperText}</FormHelperText>
      </FormGroup>
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
    case 'richtext':
      return renderRichTextField()
    case 'autocomplete':
      return renderAutocomplete()
    case 'action_chooser':
    case 'arrest_chooser':
    case 'user_chooser':
      return renderChooser()
    case 'textarea':
    default:
      return renderTextField()
  }
}
