import { blueGrey, pink } from '@mui/material/colors'
import { experimental_extendTheme as extendTheme } from '@mui/material/styles'
import { alpha } from '@mui/system'

const xSmallFontSize = '0.7rem'
const xSmallPadding = '2px 3px'
const xSmallMinHeight = '28px'
const xSmallGroupPadding = '6px'
const xSmallInputFontSize = '0.9rem'

const xSmallButtonStyles = {
  padding: xSmallPadding,
  fontSize: xSmallFontSize,
  lineHeight: 1.5,
  minHeight: xSmallMinHeight,
  minWidth: '56px',
  '& .MuiButton-startIcon, & .MuiButton-endIcon': {
    margin: 0,
  },
  '& svg': {
    fontSize: '1.2rem',
  },
}

const xSmallGroupButtonStyles = {
  ...xSmallButtonStyles,
  padding: xSmallGroupPadding,
  minWidth: 0,
}

const xSmallInputStyles = {
  '& .MuiInput-root.MuiInput-underline': {
    marginTop: 0,
  },
  '& .MuiInputBase-input': {
    fontSize: xSmallInputFontSize,
    padding: '6px 8px',
  },
  '& .MuiInputBase-input.MuiSelect-select': {
    height: '1.2rem',
  },
  '& .MuiInputBase-adornedStart': { paddingLeft: '8px' },
  '& .MuiInputBase-inputAdornedStart': { paddingLeft: 0 },
  '& .MuiInputBase-adornedEnd': { paddingRight: '8px' },
  '& .MuiInputBase-inputAdornedEnd': { paddingRight: 0 },
  '& svg': {
    fontSize: '1.2rem',
  },
  '& .MuiInputLabel-root': {
    fontSize: xSmallInputFontSize,
    transform: 'translate(10px, 7px) scale(1)',
    '&.MuiInputLabel-shrink': {
      transform: 'translate(13px, -9px) scale(0.75)',
    },
  },
}

const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: blueGrey[700],
        },
        secondary: {
          main: pink[800],
        },
        contrast: {
          main: '#fff',
          light: alpha('#fff', 0.5),
          dark: alpha('#fff', 0.9),
          contrastText: '#111',
        },
        background: {
          body: '#f3f3f3',
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: blueGrey[400],
        },
        secondary: {
          main: pink[800],
        },
        contrast: {
          main: '#fff',
          light: alpha('#fff', 0.5),
          dark: alpha('#fff', 0.9),
          contrastText: '#111',
        },
        background: {
          body: 'inherit',
        },
      },
    },
  },
  typography: {
    h1: { fontSize: '2.5rem' },
    h2: { fontSize: '2.2rem' },
    h3: { fontSize: '1.9rem' },
    h4: { fontSize: '1.6rem' },
    h5: { fontSize: '1.4rem' },
    h6: { fontSize: '1.2rem' },
  },
  custom: {
    scrollAreaHeight: 'calc(100vh - 283px)',
  },
  components: {
    MuiButton: {
      defaultProps: {
        size: 'small',
      },
      variants: [
        {
          props: { size: 'x-small' },
          style: xSmallButtonStyles,
        },
      ],
    },
    MuiIconButton: {
      defaultProps: {
        size: 'small',
      },
      variants: [
        {
          props: { size: 'x-small' },
          style: xSmallGroupButtonStyles,
        },
      ],
    },
    MuiButtonGroup: {
      variants: [
        {
          props: { size: 'x-small' },
          style: {
            '& .MuiButton-root': xSmallGroupButtonStyles,
          },
        },
      ],
    },
    MuiToggleButtonGroup: {
      variants: [
        {
          props: { size: 'x-small' },
          style: {
            '& .MuiToggleButton-root': xSmallGroupButtonStyles,
          },
        },
      ],
    },
    MuiToggleButton: {
      variants: [
        {
          props: { size: 'x-small' },
          style: xSmallButtonStyles,
        },
      ],
    },

    MuiFormControl: {
      variants: [
        {
          props: { size: 'x-small' },
          style: xSmallInputStyles,
        },
      ],
      styleOverrides: {
        root: {
          '& .MuiFormLabel-colorSuccess': {
            color: 'var(--mui-palette-success-main)', // Success color for default state
          },
          '&:has(.MuiCheckbox-colorSuccess).MuiFormControl-root': {
            width: '100%',
            outline: '1px solid var(--mui-palette-success-main)',
            borderRadius: '2px',
            backgroundColor:
              'rgba(var(--mui-palette-success-lightChannel) / 0.1) !important',
          },
          '& .MuiCheckbox-colorSuccess': {
            color: 'var(--mui-palette-success-main)', // Success color for default state
          },
          '& .MuiInputBase-colorSuccess': {
            '&': {
              backgroundColor:
                'rgba(var(--mui-palette-success-lightChannel) / 0.1) !important',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--mui-palette-success-main)', // Success color for default state
            },
          },
        },
      },
    },
  },
})

export default theme
