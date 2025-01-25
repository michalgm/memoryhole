import { Flag, Gavel, People, Person } from '@mui/icons-material'
import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material'

const StyleShowcase = ({ size, color = 'primary' }) => {
  return (
    <>
      <Stack
        spacing={3}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <Stack spacing={2}>
          <h3>X-Small Variants</h3>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button size={size} variant="contained" color={color}>
              Contained
            </Button>
            <Button size={size} variant="outlined" color={color}>
              Outlined
            </Button>
            <Button size={size} variant="text" color={color}>
              Text
            </Button>
            <IconButton size={size} color={color}>
              <Flag />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button
              size={size}
              variant="contained"
              color={color}
              startIcon={<Flag />}
              endIcon={<Person />}
            >
              Contained
            </Button>
            <Button
              size={size}
              variant="outlined"
              color={color}
              startIcon={<Flag />}
              endIcon={<Person />}
            >
              Outlined
            </Button>
            <Button
              size={size}
              variant="text"
              color={color}
              startIcon={<Flag />}
              endIcon={<Person />}
            >
              Text
            </Button>
            <IconButton size={size} color={color}>
              <Flag />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField label="X-Small" size={size} color={color} />
            <TextField
              label="X-Small Select"
              size={size}
              select
              value={'One'}
              color={color}
            >
              {['One', 'Two'].map((v) => (
                <MenuItem key={v} value={v}>
                  {v}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="X-Small Filled"
              size={size}
              variant="filled"
              color={color}
            />
            <TextField
              label="X-Small Standard"
              size={size}
              variant="standard"
              color={color}
            />
          </Box>
          <h3>Toggle Button Groups</h3>
          <ToggleButtonGroup size={size} value={'action'} color={color}>
            <ToggleButton value="action">
              <Flag />
            </ToggleButton>
            <ToggleButton value="arrest">
              <Person />
            </ToggleButton>
            <ToggleButton value="user">
              <People />
            </ToggleButton>
            <ToggleButton value="showFilters">
              <Gavel />
            </ToggleButton>
            <ToggleButton value="action">Hello</ToggleButton>
          </ToggleButtonGroup>
          <h3>Button Groups</h3>
          <Stack direction="row" spacing={2}>
            <ButtonGroup size={size} value={'action'} color={color}>
              <Button value="action">
                <Flag />
              </Button>
              <Button value="arrest">
                <Person />
              </Button>
              <Button value="user">
                <People />
              </Button>
              <Button value="showFilters">
                <Gavel />
              </Button>
              <Button value="showFilters">Hello</Button>
            </ButtonGroup>
            <ButtonGroup
              size={size}
              value={'action'}
              color={color}
              variant={'contained'}
            >
              <Button value="action">
                <Flag />
              </Button>
              <Button value="arrest">
                <Person />
              </Button>
              <Button value="user">
                <People />
              </Button>
              <Button value="showFilters">
                <Gavel />
              </Button>
              <Button value="showFilters">Hello</Button>
            </ButtonGroup>
            <ButtonGroup
              size={size}
              value={'action'}
              color={color}
              variant={'text'}
            >
              <Button value="action">
                <Flag />
              </Button>
              <Button value="arrest">
                <Person />
              </Button>
              <Button value="user">
                <People />
              </Button>
              <Button value="showFilters">
                <Gavel />
              </Button>
              <Button value="showFilters">Hello</Button>
            </ButtonGroup>
          </Stack>
        </Stack>
      </Stack>
    </>
  )
}

export default StyleShowcase
