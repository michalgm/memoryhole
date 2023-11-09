import { useState } from 'react'

import { Add, Edit, ExpandMore, Search, Warning } from '@mui/icons-material'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Card,
  CardContent,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2/Grid2'

import dayjs from '../../../../api/src/lib/day'

import ArresteeLogsForm from './ArresteeLogsForm'

// import CreateArresteeLog from "./CreateArresteeLog";
const LogContainer = ({ children }) => {
  return (
    <Grid xs={12} sx={{ p: 2 }}>
      <Card raised>
        <CardContent>{children}</CardContent>
      </Card>
    </Grid>
  )
}

const ArresteeLogs = ({ logs, arrestee_id, refetch }) => {
  const [editItem, setEditItem] = useState(false)
  const [filter, setFilter] = useState({ notes: '', needs_followup: false })
  const onCreate = (success) => {
    setEditItem('')
    success && refetch()
  }
  const notes_regex = new RegExp(filter.notes, 'i')
  const filteredLogs = logs.filter((log) => {
    return (
      log.notes.match(notes_regex) &&
      (filter.needs_followup ? log.needs_followup : true)
    )
  })
  return (
    <>
      <Grid xs={12} sx={{ p: 2 }}>
        <Grid container sx={{ pb: 2, justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ textAlign: 'center' }}>
            Logs
          </Typography>
          <Button
            startIcon={<Add />}
            onClick={() => setEditItem('new')}
            variant="contained"
          >
            Add Log
          </Button>
        </Grid>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="caption">
              <Search fontSize="inherit" /> Filter Logs
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid xs={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Filter Notes"
                  value={filter.notes}
                  onChange={({ target: { value } }) =>
                    setFilter({ ...filter, notes: value })
                  }
                />
              </Grid>
              <Grid xs={6}>
                <FormGroup>
                  <FormControlLabel
                    label="Needs Followup"
                    control={
                      <Checkbox
                        checked={filter.needs_followup === true}
                        onChange={() =>
                          setFilter({
                            ...filter,
                            needs_followup: !filter.needs_followup,
                          })
                        }
                      />
                    }
                  />
                </FormGroup>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Grid>
      {editItem === 'new' && (
        <LogContainer>
          <ArresteeLogsForm arrestee_id={arrestee_id} callback={onCreate} />
        </LogContainer>
      )}
      {filteredLogs.map((item) => (
        <LogContainer key={item.id}>
          {editItem === item.id ? (
            <ArresteeLogsForm
              arrestee_id={arrestee_id}
              callback={onCreate}
              log={{
                id: item.id,
                notes: item.notes,
                type: item.type,
                needs_followup: item.needs_followup,
              }}
            />
          ) : (
            <>
              <Grid container justifyContent="space-between">
                <Typography variant="overline">
                  {dayjs(item.created_at).format('MM/DD/YY - LT')}
                </Typography>
                <Tooltip title="Edit Log">
                  <IconButton onClick={() => setEditItem(item.id)}>
                      <Edit sx={{ fontSize: 16 }} color="secondary" />{' '}
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid container justifyContent="space-between">
                <Typography variant="overline" color="text.secondary">
                  {item.created_by.name}
                </Typography>
                <Typography variant="overline" color="text.secondary">
                  {item.type}
                </Typography>
              </Grid>
              {item.needs_followup && (
                <Grid container justifyContent="space-between">
                  <Typography variant="overline" color="error">
                    <Warning fontSize="inherit" /> Needs Followup
                  </Typography>
                </Grid>
              )}
              <Divider sx={{ mb: 1 }} />
              <Typography sx={{ whiteSpace: 'break-spaces' }} variant="body2">
                {item.notes}
              </Typography>
            </>
          )}
        </LogContainer>
      ))}
    </>
  )
}

export default ArresteeLogs
