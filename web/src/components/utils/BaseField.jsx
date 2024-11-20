import {
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  ListItemText,
  Typography,
  TextField,
  Checkbox,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { DatePicker, DateTimePicker } from '@mui/x-date-pickers'
import { capitalize } from 'lodash-es'
import {
  CheckboxElement,
  DatePickerElement,
  DateTimePickerElement,
  RadioButtonGroup,
  TextFieldElement,
} from 'react-hook-form-mui'

import dayjs from '../../../../api/src/lib/day'
import Autocomplete from '../Autocomplete/Autocomplete'

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

    return (
      <Component
        {...props}
        name={name}
        inputProps={textFieldProps}
        timeSteps={{ minutes: 1 }}
        slotProps={{
          field: { clearable: true },
        }}
      />
    )
  }

  const renderAutocomplete = () => {
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
      />
    )
  }

  const renderRichTextField = () => {
    const textFieldOptions = {
      multiline: true,
      minRows: props.minRows || 3,
      content: value,
      onChange,
    }
    return (
      <RichTextInput {...textFieldProps} {...textFieldOptions} {...props} />
    )
  }

  const renderTextField = () => {
    const Component = isRHF ? TextFieldElement : TextField

    const textFieldOptions =
      field_type === 'textarea'
        ? { multiline: true, minRows: props.minRows || 3 }
        : {}
    return <Component {...textFieldProps} {...textFieldOptions} {...props} />
  }

  const renderActionChooser = () => {
    return (
      <Autocomplete
        name={name}
        label={props.label}
        helperText={helperText}
        query={{
          model: 'action',
          orderBy: {
            start_date: 'desc',
          },
          searchField: 'name',
        }}
        isRHF={isRHF}
        onChange={onChange}
        value={value}
        storeFullObject
        textFieldProps={textFieldProps}
        autocompleteProps={{
          getOptionLabel: (option) => {
            return option.name
            // const date = dayjs(option.start_date).format('L LT')
            // return `${option.name} (${date})`
          },

          renderOption: ({ key, ...props }, option) => (
            <li key={key} {...props}>
              <ListItemText
                primary={
                  <Typography variant="body1" component="span">
                    {option.name}
                  </Typography>
                }
                secondary={
                  option.start_date && (
                    <Typography variant="body2" color="textSecondary">
                      {dayjs(option.start_date).format('L LT')}
                    </Typography>
                  )
                }
              />
            </li>
          ),
        }}
        {...props}
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
        <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
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
      <FormGroup>
        <Component
          name={`${name}`}
          sx={{ p: 0, pr: 1, pl: 1 }}
          label={props.label}
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
    case 'action_chooser':
      return renderActionChooser()
    case 'textarea':
    default:
      return renderTextField()
  }
}
