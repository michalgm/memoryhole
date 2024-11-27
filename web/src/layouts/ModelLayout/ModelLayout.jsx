import { Add } from '@mui/icons-material'
import { Box, Button } from '@mui/material'
import { Stack } from '@mui/system'

import { navigate, routes, useLocation, useParams } from '@redwoodjs/router'

import Breadcrumbs from 'src/components/Breadcrumbs/Breadcrumbs'

const ModelLayout = ({ title, titleTo, buttonLabel, buttonTo, children }) => {
  const { id } = useParams()
  const { pathname } = useLocation()
  const isNew = pathname.endsWith('/new')

  return (
    <Stack spacing={2} direction="column">
      <Box
        sx={{
          mb: 2,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Breadcrumbs
          title={title}
          titleTo={titleTo}
          buttonLabel={buttonLabel}
        />

        {buttonLabel && buttonTo && !id && !isNew && (
          <Button
            onClick={() => navigate(routes[buttonTo]())}
            variant="contained"
            color="secondary"
            startIcon={<Add />}
          >
            {buttonLabel}
          </Button>
        )}
      </Box>
      <Box>{children}</Box>
    </Stack>
  )
}

export default ModelLayout
