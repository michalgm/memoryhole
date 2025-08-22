import { Add } from '@mui/icons-material'
import { Box, Button, Stack, Tooltip } from '@mui/material'

import { navigate, routes, useLocation, useParams } from '@redwoodjs/router'

import Breadcrumbs from 'src/components/Breadcrumbs/Breadcrumbs'
import ShortcutIndicator from 'src/components/utils/ShortcutIndicator'

const ModelLayout = ({
  title,
  titleTo,
  buttonLabel,
  buttonTo,
  children,
  buttonParams = {},
}) => {
  const { id } = useParams()
  const { pathname } = useLocation()
  const isNew = pathname.endsWith('/new')

  return (
    <Stack
      spacing={2}
      direction="column"
      useFlexGap
      sx={{
        pt: 3,
      }}
    >
      <Box
        sx={{
          mx: -1,
          px: 1,
          position: 'sticky',
          top: 0,
          display: 'flex',
          justifyContent: 'space-between',
          zIndex: 10,
          backgroundColor: 'var(--mui-palette-background-body)',
          py: 1,
        }}
      >
        <Breadcrumbs
          title={title}
          titleTo={titleTo}
          buttonLabel={buttonLabel}
        />
        <div id="modal_layout_header_actions"></div>
        {buttonLabel && buttonTo && !id && !isNew && (
          <Tooltip
            title={
              buttonLabel === 'New Arrest' ? (
                <>
                  (<ShortcutIndicator combo="alt+a" /> to quickly create a new
                  arrest)
                </>
              ) : (
                ''
              )
            }
          >
            <Button
              onClick={() => navigate(routes[buttonTo](buttonParams))}
              variant="contained"
              color="secondary"
              startIcon={<Add />}
              size="medium"
            >
              {buttonLabel}
            </Button>
          </Tooltip>
        )}
      </Box>
      <Box>{children}</Box>
    </Stack>
  )
}

export default ModelLayout
