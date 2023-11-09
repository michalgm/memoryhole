import { useState } from 'react'

import { Add, Edit, ExpandMore, FilterList } from '@mui/icons-material'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2/Grid2'
import dayjs from 'dayjs'

import HotlineLogsForm from './HotlineLogsForm'

const Log = ({ log, setEditItem }) => {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />} sx={{ mb: 0 }}>
        <Grid2 container spacing={0} sx={{ alignItems: 'center' }} xs={12}>
          <Typography variant="h6" sx={{ width: '40%', flexShrink: 0 }}>
            {dayjs(log.start_time).format('MM/DD/YY, LT')}
            &nbsp;&mdash;&nbsp;
            {dayjs(log.end_time).format('MM/DD/YY, LT')}
          </Typography>
          <Typography variant="subtitle1" sx={{ color: 'GrayText' }}>
            Created by {log?.created_by?.name}
          </Typography>
        </Grid2>
      </AccordionSummary>
      <AccordionDetails>
        <Divider />
        <Typography
          variant="body1"
          component="div"
          sx={{ whiteSpace: 'break-spaces', position: 'relative', pt: 2 }}
        >
          <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
            <Tooltip title="Edit Log">
              <IconButton onClick={() => setEditItem(log.id)}>
                <Edit color="secondary" />
              </IconButton>
            </Tooltip>
          </Box>
          {log.notes}
        </Typography>
      </AccordionDetails>
    </Accordion>
  )
}

const HotlineLogs = ({ hotlineLogs = [], refetch }) => {
  const [editItem, setEditItem] = useState(false)
  const [filter, setFilter] = useState({ notes: '', needs_followup: false })

  const onCreate = (success) => {
    setEditItem('')
    success && refetch()
  }
  const notes_regex = new RegExp(filter.notes, 'i')

  const filteredLogs = hotlineLogs.filter((log) => {
    return log.notes.match(notes_regex)
  })
  return (
    <Grid2 container spacing={4}>
      <Grid2 xs={12}>
        <Grid2 container spacing={0} sx={{ justifyContent: 'space-between' }}>
          <TextField
            sx={{ backgroundColor: 'white', width: 400 }}
            size="small"
            placeholder="Filter Notes"
            value={filter.notes}
            onChange={({ target: { value } }) =>
              setFilter({ ...filter, notes: value })
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FilterList />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setEditItem('new')}
            startIcon={<Add />}
          >
            Add Log
          </Button>
        </Grid2>
        {editItem === 'new' && <HotlineLogsForm callback={onCreate} />}
      </Grid2>
      {filteredLogs.map((log) => {
        return (
          <Grid2 key={log.id} xs={12}>
            {log.id === editItem ? (
              <HotlineLogsForm callback={onCreate} log={log} />
            ) : (
              <Log log={log} setEditItem={setEditItem} />
            )}
          </Grid2>
        )
      })}
    </Grid2>
  )
}

export default HotlineLogs
