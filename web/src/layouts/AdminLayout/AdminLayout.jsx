import { Add, NavigateNext } from '@mui/icons-material'
import { Breadcrumbs, Button } from '@mui/material'

import { navigate, routes, useParams, useLocation } from '@redwoodjs/router'

import Link from 'src/components/utils/Link'
const AdminLayout = ({ title, titleTo, buttonLabel, buttonTo, children }) => {
  const { id } = useParams()
  const { pathname } = useLocation()

  return (
    <div className="admin-view">
      <header className="rw-header">
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
        {/* <Button
          onClick={() => navigate(routes[buttonTo]())}
          variant="contained"
          color="secondary"
          startIcon={<Add />}
        >
          {buttonLabel}
        </Button> */}
        {/* <Link to={routes[buttonTo]()} className="rw-button rw-button-green">
          <div className="rw-button-icon">+</div> {buttonLabel}
        </Link> */}
      </header>
      <main className="rw-main">{children}</main>
    </div>
  )
}

export default AdminLayout
