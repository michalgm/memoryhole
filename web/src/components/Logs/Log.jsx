import { useEffect, useRef, useState } from 'react'

import {
  ExpandMore as ExpandMoreIcon,
  Flag,
  Person,
  Warning,
} from '@mui/icons-material'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Typography,
} from '@mui/material'
import { Box, Stack } from '@mui/system'
import dayjs from 'dayjs'

import { navigate, routes } from '@redwoodjs/router'

import RichTextInput from '../utils/RichTextInput'

import LogsForm from './LogsForm'

// const ExpandMore = styled((props) => {
//   const { expand, children } = props
//   return <span>{children}</span>
// })(({ theme }) => ({
//   marginLeft: 'auto',
//   transition: theme.transitions.create('transform', {
//     duration: theme.transitions.duration.shortest,
//   }),
//   variants: [
//     {
//       props: ({ expand }) => !expand,
//       style: {
//         transform: 'rotate(0deg)',
//       },
//     },
//     {
//       props: ({ expand }) => !!expand,
//       style: {
//         transform: 'rotate(180deg)',
//       },
//     },
//   ],
// }))

const Log = ({ log: item, setEditItem, editItem, onCreate }) => {
  const [expanded, setExpanded] = useState(false)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const maxHeight = 200
  const contentRef = useRef(null)

  useEffect(() => {
    if (contentRef.current) {
      setIsOverflowing(contentRef.current.scrollHeight > maxHeight)
    }
  }, [item.notes])

  return (
    <Card key={item.id}>
      <CardHeader
        title={
          <Stack direction={'row'} justifyContent="space-between">
            <span>{dayjs(item.created_at).format('MM/DD/YY - LT')}</span>
            <span>{item.type}</span>
          </Stack>
        }
        subheader={
          <Stack
            direction={'row'}
            justifyContent="space-between"
            alignItems={'center'}
          >
            <span>{item.created_by?.name}</span>
            {item.needs_followup && (
              <span>
                <Typography color="warning.main">
                  <Warning fontSize="inherit" /> Needs Followup
                </Typography>
              </span>
            )}
          </Stack>
        }
      />
      <Divider flexItem />
      <CardContent sx={{ pt: 0, pb: 0 }}>
        {editItem === item.id ? (
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
                      label={item.action.name}
                      onClick={() => {
                        navigate(routes.action({ id: item.action.id }))
                      }}
                    />{' '}
                  </Stack>
                </Stack>
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
            >
              Edit Log
            </Button>
          </span>
        </Stack>
      </CardActions>
    </Card>
  )
}

export default Log
