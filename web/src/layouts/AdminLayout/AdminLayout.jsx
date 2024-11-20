import { Add, NavigateNext } from '@mui/icons-material'
import { Breadcrumbs, Button } from '@mui/material'
import { Box } from '@mui/system'

import { navigate, routes, useParams, useLocation } from '@redwoodjs/router'

import Link from 'src/components/utils/Link'
const AdminLayout = ({ title, titleTo, buttonLabel, buttonTo, children }) => {
  const { id } = useParams()
  const { pathname } = useLocation()

  return (
    <div className="admin-view">
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Breadcrumbs separator={<NavigateNext fontSize="small" />}>
          <Link to={routes.admin()} className="rw-link">
            Admin
          </Link>
          {titleTo && (
            <Link to={routes[titleTo]()} className="rw-link">
              {title}
            </Link>
          )}
        </Breadcrumbs>
        {buttonLabel && buttonTo && !id && !pathname.endsWith('/new') && (
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
      <main>
        <Box sx={{}}>{children}</Box>
      </main>
    </div>
  )
}

export default AdminLayout
