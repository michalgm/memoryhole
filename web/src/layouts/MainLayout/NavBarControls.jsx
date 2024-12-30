import { ChevronLeft, ChevronRight, Flag } from '@mui/icons-material'
import { Box, Button, InputAdornment, Tooltip } from '@mui/material'
import { alpha } from '@mui/material/styles'

import { BaseField } from 'src/components/utils/BaseField'
import QuickSearch from 'src/components/utils/QuickSearch'
import ShortcutIndicator from 'src/components/utils/ShortcutIndicator'
import { defaultAction } from 'src/lib/AppContext'

const textFieldProps = {
  variant: 'standard',
  InputProps: {
    sx: {
      color: 'contrast.main',
      '& .MuiButtonBase-root': {
        color: 'inherit',
        '.MuiSvgIcon-root': {
          color: 'inherit',
        },
      },
    },

    disableUnderline: true,
    startAdornment: (
      <InputAdornment
        sx={{
          color: 'inherit',
        }}
        position="start"
      >
        <Flag color="blue" />
      </InputAdornment>
    ),
  },
  sx: {
    borderRadius: 1,
    backgroundColor: (theme) => alpha(theme.palette.common.white, 0.2), //'primary.light',
    // input: { color: 'contrast.main' }, // Text color for readability
    '& .MuiSvgIcon-root, & .MuiCircularProgress-root ': {
      color: 'text.primary !important',
    },
    '& .MuiInputBase-input': {
      border: 'none',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#ccc', // Default border
        border: 'none',
      },
      '&:hover fieldset': {
        borderColor: 'text.primary', // Border color on hover
        border: 'none',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'text.primary', // Border color when focused
        border: 'none',
      },
    },
  },
}

const transformOptions = (options) => [defaultAction, ...options]

const NavBarControls = ({
  currentAction,
  setCurrentAction,
  logsOpen,
  setLogsOpen,
}) => (
  <>
    <Box sx={{ flexGrow: 7, maxWidth: '250px', ml: 'auto !important' }}>
      <QuickSearch />
    </Box>

    <Box sx={{ flexGrow: 5, maxWidth: '200px' }}>
      <BaseField
        name="action"
        color="inherit"
        field_type="action_chooser"
        label="Action"
        value={currentAction}
        onChange={setCurrentAction}
        disableClearable
        autoHighlight
        autoComplete
        placeholder="Type to search"
        transformOptions={transformOptions}
        textFieldProps={textFieldProps}
      />
    </Box>
    <Tooltip
      title={
        <p>
          Toggle Logs Panel
          <br />
          <ShortcutIndicator combo="Alt+L" />
          to quickly create a new log)
        </p>
      }
    >
      <Button
        onClick={() => setLogsOpen(!logsOpen)}
        variant="outlined"
        color="inherit"
        // color="secondary"
        sx={{
          color: 'var(--mui-palette-contrast-main)',
        }}
        startIcon={logsOpen ? <ChevronRight /> : <ChevronLeft />}
        size="small"
      >
        Logs
      </Button>
    </Tooltip>
  </>
)

export default NavBarControls
