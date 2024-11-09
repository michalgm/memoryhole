import {
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  ListItemText,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { capitalize } from 'lodash'
import {
  CheckboxElement,
  DatePickerElement,
  DateTimePickerElement,
  RadioButtonGroup,
  TextFieldElement,
  useFormContext,
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

export const Field = ({
  name,
  field_type = 'text',
  tabIndex,
  fullWidth = true,
  helperText = '',
  options: defaultOptions,
  ...props
}) => {
  const { setValue, getValues } = useFormContext()

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
        {...props}
      />
    )
  }

  const renderRichTextField = () => {
    const textFieldOptions = {
      multiline: true,
      minRows: props.minRows || 3,
      content: getValues(name),
      onChange: (value) => setValue(name, value),
    }
    return (
      <RichTextInput {...textFieldProps} {...textFieldOptions} {...props} />
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

  const renderActionChooser = () => {
    return (
      <Autocomplete
        name={name}
        label={props.label}
        helperText={helperText}
        query={{
          model: 'action',
          select: { id: true, name: true, start_date: true },
          orderBy: {
            start_date: 'desc',
          },
          searchField: 'name',
        }}
        storeFullObject
        textFieldProps={textFieldProps}
        autocompleteProps={{
          getOptionLabel: (option) => {
            const date = dayjs(option.start_date).format('L LT')
            return `${option.name} (${date})`
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
                  <Typography variant="body2" color="textSecondary">
                    {dayjs(option.start_date).format('L LT')}
                  </Typography>
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
    return (
      <Grid container spacing={2}>
        <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
          <FormLabel component="legend">{props.label}</FormLabel>
          <FormGroup>
            {defaultOptions.map((option) => (
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
      <FormGroup>
        <CheckboxElement
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
