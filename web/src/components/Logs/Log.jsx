import { useEffect, useRef, useState } from 'react'

import {
  Edit,
  ExpandMore as ExpandMoreIcon,
  Flag,
  Person,
  Warning,
} from '@mui/icons-material'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Stack,
  Typography,
} from '@mui/material'
import dayjs from 'dayjs'

import { navigate, routes } from '@redwoodjs/router'

import LogsForm from 'src/components/Logs/LogsForm'
import RichTextInput from 'src/components/utils/RichTextInput'
import Show from 'src/components/utils/Show'

const Log = ({ log: item, setEditItem, editItem, onCreate }) => {
  const [expanded, setExpanded] = useState(false)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const maxHeight = 200
  const contentRef = useRef(null)
  const editLog = editItem && editItem === item?.id
  useEffect(() => {
    if (contentRef.current) {
      setIsOverflowing(contentRef.current.scrollHeight > maxHeight)
    }
  }, [item.notes])

  const isSummary = item.type === 'Shift Summary'
  const coordinators = item?.shift?.coordinators?.map((i) => i.name)?.join(', ')
  return (
    <Card
      key={item.id}
      elevation={2}
      sx={{
        borderLeft: isSummary
          ? '5px solid var(--mui-palette-primary-light)'
          : '',
      }}
    >
      <CardHeader
        title={
          <Stack direction={'row'} justifyContent="space-between">
            <span>{dayjs(item.created_at).format('MM/DD/YY - LT')}</span>
            <span>{item.type}</span>
          </Stack>
        }
        subheader={
          <Stack direction={'column'} spacing={1}>
            <Stack
              direction={'row'}
              spacing={1}
              justifyContent="space-between"
              alignItems={'stretch'}
            >
              <Box sx={{ flexBasis: '50%' }}>{item.created_by?.name}</Box>
              <Show when={isSummary}>
                <Box sx={{ flexBasis: '50%', textAlign: 'right' }}>
                  {[
                    item.shift?.start_time
                      ? dayjs(item.shift.start_time).format('MM/DD/YY, LT')
                      : '',
                    item.shift?.end_time
                      ? dayjs(item.shift.end_time).format('MM/DD/YY, LT')
                      : '',
                  ].join(' - ')}
                </Box>
              </Show>
              <Show when={!isSummary && item.needs_followup}>
                <span>
                  <Typography color="warning.main">
                    <Warning fontSize="inherit" /> Needs Followup
                  </Typography>
                </span>
              </Show>
            </Stack>
            <Show when={isSummary}>
              <Stack
                direction="row"
                spacing={1}
                justifyContent="space-between"
                alignItems={'stretch'}
              >
                <Box sx={{ flexBasis: '50%' }}>
                  {coordinators && `Coordinators: ${coordinators}`}
                </Box>
                <Box sx={{ flexBasis: '50%', textAlign: 'right' }}>
                  {item?.shift?.operators &&
                    `Operators: ${item.shift.operators}`}
                </Box>
              </Stack>
            </Show>
          </Stack>
        }
        sx={{ pb: 0 }}
      />
      <Divider flexItem sx={{ my: 1 }} />
      <CardContent sx={{ pt: 0, pb: 0 }}>
        {editLog ? (
          <LogsForm callback={onCreate} log={item} />
        ) : (
          <Stack spacing={1}>
            <Box
              ref={contentRef}
              sx={{
                maxHeight: expanded ? 'none' : maxHeight,
                overflow: 'hidden',
                position: 'relative',
                maskImage:
                  expanded || !isOverflowing
                    ? 'none'
                    : `linear-gradient(to bottom, white 0px, white ${maxHeight - 50}px, transparent 100%)`,
              }}
            >
              <RichTextInput editable={false} content={item.notes} />
            </Box>
            {expanded && (
              <>
                <Divider sx={{ mx: '-16px !important' }} />
                {item.action && (
                  <Stack
                    direction={'row'}
                    // justifyContent="space-between"
                    spacing={2}
                    sx={{ pb: 2 }}
                  >
                    <Typography sx={{ fontWeight: 'bold' }}>Action</Typography>
                    <Stack
                      direction={'row'}
                      spacing={1}
                      useFlexGap
                      justifyContent={'flex-start'}
                    >
                      <Chip
                        size="small"
                        variant="outlined"
                        icon={<Flag />}
                        label={item?.action?.name}
                        onClick={() => {
                          navigate(routes.action({ id: item.action.id }))
                        }}
                      />{' '}
                    </Stack>
                  </Stack>
                )}
                {item.arrests.length > 0 && (
                  <Stack
                    direction={'row'}
                    justifyContent="space-between"
                    spacing={2}
                    sx={{ pb: 2 }}
                  >
                    <>
                      <Typography sx={{ fontWeight: 'bold' }}>
                        Arrests
                      </Typography>
                      <Stack
                        direction={'row'}
                        spacing={1}
                        useFlexGap
                        sx={{ flexWrap: 'wrap', flexGrow: 1 }}
                        justifyContent={'flex-start'}
                      >
                        {item.arrests.map((arrest) => (
                          <Chip
                            size="small"
                            key={arrest.id}
                            variant="outlined"
                            icon={<Person />}
                            label={arrest.arrestee.search_display_field}
                            onClick={() => {
                              navigate(routes.arrest({ id: arrest.id }))
                            }}
                          />
                        ))}
                      </Stack>
                    </>
                  </Stack>
                )}
              </>
            )}
          </Stack>
        )}
      </CardContent>
      <Show unless={editLog}>
        <CardActions sx={{ px: 2 }}>
          <Stack
            direction={'row'}
            justifyContent="space-between"
            spacing={2}
            sx={{ width: '100%' }}
          >
            <span>
              <Button
                variant="text"
                onClick={() => setExpanded(!expanded)}
                startIcon={
                  <ExpandMoreIcon
                    sx={{
                      transition: '200ms',
                      transform: `rotate(${expanded ? 180 : 0}deg)`,
                    }}
                  />
                }
              >
                {expanded ? 'Show less' : 'Show more'}
              </Button>
            </span>
            <span>
              <Button
                variant="outlined"
                size="small"
                color="secondary"
                onClick={() => setEditItem(item.id)}
                startIcon={<Edit />}
              >
                Edit Log
              </Button>
            </span>
          </Stack>
        </CardActions>
      </Show>
    </Card>
  )
}

export default Log
