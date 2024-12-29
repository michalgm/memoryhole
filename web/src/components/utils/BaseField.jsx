import { useMemo } from 'react'

import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Grid2,
  InputAdornment,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material'
import { DatePicker, DateTimePicker } from '@mui/x-date-pickers'
import { capitalize, merge } from 'lodash-es'
import {
  CheckboxElement,
  Controller,
  RadioButtonGroup,
  SwitchElement,
  TextFieldElement,
  ToggleButtonGroupElement,
} from 'react-hook-form-mui'
import {
  DatePickerElement,
  DateTimePickerElement,
} from 'react-hook-form-mui/date-pickers'

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

const transformOptions = (options) => {
  if (!options) return null
  return options.map((option) => {
    if (typeof option === 'string') {
      return { id: option, label: formatLabel(option) }
    }
    return option
  })
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
  endAdornment,
  startAdornment,
  textFieldProps: defaultTextFieldProps,
  ...props
}) => {
  // const { setValue, getValues } = useFormContext()

  props.label = props.label === '' ? null : props.label || formatLabel(name)

  if (!isRHF) {
    props.onChange = onChange
    props.value = value
  }

  const textFieldProps = useMemo(() => {
    const textFieldProps = {
      name,
      helperText,
      variant: 'outlined',
      fullWidth: fullWidth,
      size: 'small',
      color,
      tabIndex: tabIndex || undefined,
      ...defaultTextFieldProps,
    }
    if (endAdornment) {
      textFieldProps.InputProps = merge(textFieldProps.InputProps || {}, {
        endAdornment: (
          <InputAdornment position="end">{endAdornment}</InputAdornment>
        ),
      })
    }
    if (startAdornment) {
      textFieldProps.InputProps = merge(textFieldProps.InputProps || {}, {
        startAdornment: (
          <InputAdornment position="start">{startAdornment}</InputAdornment>
        ),
      })
    }
    return textFieldProps
  }, [
    color,
    defaultTextFieldProps,
    fullWidth,
    helperText,
    name,
    tabIndex,
    endAdornment,
    startAdornment,
  ])

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
    const options = transformOptions(defaultOptions)

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
    const options = transformOptions(defaultOptions)
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
      <Grid2 container spacing={2}>
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
              <Grid2 key={option} size={6}>
                <FormControlLabel
                  control={<Component name={`${name}_${option}`} />}
                  label={option}
                />
              </Grid2>
            ))}
          </FormGroup>
          <FormHelperText>{helperText}</FormHelperText>
        </FormControl>
      </Grid2>
    )
  }

  const renderCheckbox = () => {
    const Component = isRHF ? CheckboxElement : Checkbox
    return (
      <Component
        name={`${name}`}
        label={props.label}
        labelProps={{ color, sx: { userSelect: 'none' } }}
        onChange={onChange}
        color={color}
        helperText={helperText}
        required={props.required}
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

  const renderSwitch = () => {
    const Component = isRHF ? SwitchElement : Switch
    const switchInput = (
      <Component
        name={name}
        checked={value}
        onChange={onChange}
        color={color}
        {...props}
      />
    )
    if (isRHF) {
      return switchInput
    }
    return (
      <FormControlLabel
        control={switchInput}
        label={props.label}
        disabled={props.disabled}
        required={props.required}
        labelPlacement={props.labelPlacement}
      />
    )
  }

  const renderToggleButton = () => {
    const options = transformOptions(defaultOptions)
    if (isRHF) {
      return (
        <ToggleButtonGroupElement
          name={name}
          value={value}
          onChange={onChange}
          options={options}
          {...props}
        />
      )
    }
    return (
      <ToggleButtonGroup
        name={name}
        value={value}
        onChange={onChange}
        {...props}
      >
        {options.map((option) => (
          <ToggleButton key={option.id} value={option.id}>
            {option.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    )
  }

  switch (field_type) {
    case 'checkbox':
      return renderCheckbox()
    case 'checkbox_group':
      return renderCheckboxGroup()
    case 'radio':
      return renderRadio()
    case 'switch':
      return renderSwitch()
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
    case 'togglebutton':
      return renderToggleButton()
    case 'textarea':
    default:
      return renderTextField()
  }
}
