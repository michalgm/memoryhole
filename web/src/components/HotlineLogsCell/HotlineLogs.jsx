import { useState } from 'react'

import { Add, Edit, FilterList } from '@mui/icons-material'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid2,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material'
import dayjs from 'dayjs'

import RichTextInput from '../utils/RichTextInput'

import HotlineLogsForm from './HotlineLogsForm'

const Log = ({ log, setEditItem }) => {
  return (
    <Card>
      <CardHeader
        title={
          <>
            {dayjs(log.start_time).format('MM/DD/YY LT')}
            <>&nbsp;&mdash;&nbsp;</>
            {dayjs(log.end_time).format('MM/DD/YY LT')}
          </>
        }
        subheader={`Created by ${log?.created_by?.name}`} // | Updated by ${log?.created_by?.name}`}
      ></CardHeader>
      <CardContent>
        {/* <Divider /> */}
        <Stack direction={'row'}>
          <Box xs={11} overflow={'hidden'}>
            <RichTextInput
              sx={{ width: '100%' }}
              content={log.notes}
              editable={false}
            />
          </Box>
        </Stack>
      </CardContent>
      <CardActions sx={{ justifyContent: 'end' }}>
        <Tooltip title="Edit Log">
          <Button
            onClick={() => setEditItem(log.id)}
            variant="contained"
            color="secondary"
            startIcon={<Edit />}
          >
            Edit Log
          </Button>
        </Tooltip>
      </CardActions>
    </Card>
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
      </Grid2>
      {editItem === 'new' && (
        <Grid2>
          <HotlineLogsForm callback={onCreate} />
        </Grid2>
      )}
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
