import { NavigateNext } from '@mui/icons-material'
import { Breadcrumbs as MUIBreadcrumbs, Typography } from '@mui/material'
import { Box } from '@mui/system'

import { routes, useLocation, useParams } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import Link from 'src/components/utils/Link'
import { useApp } from 'src/lib/AppContext'

const Breadcrumbs = ({ title, titleTo, buttonLabel }) => {
  const { id } = useParams()
  const { pathname } = useLocation()

  const isNew = pathname.endsWith('/new')
  const { pageTitle, currentAction } = useApp()
  let endCrumb = ''
  const isAdmin = pathname.startsWith('/admin')

  if (id) {
    endCrumb = pageTitle
  } else if (isNew && buttonLabel) {
    endCrumb = buttonLabel
  }

  const metaTitle = [
    endCrumb,
    title,
    isAdmin ? 'Admin' : '',
    currentAction?.id !== -1 && currentAction?.name ? currentAction.name : '',
  ]
    .filter((t) => t)
    .join(' | ')

  return (
    <>
      <Metadata title={metaTitle} />
      <Box>
        <MUIBreadcrumbs separator={<NavigateNext fontSize="small" />}>
          {pathname.startsWith('/admin') && (
            <Link to={routes.admin()}>Admin</Link>
          )}
          {titleTo && <Link to={routes[titleTo]()}>{title}</Link>}
          {endCrumb && (
            <Typography
              sx={{
                fontWeight: 'bold',
                color: 'primary.main',
              }}
            >
              {endCrumb}
            </Typography>
          )}
        </MUIBreadcrumbs>
      </Box>
    </>
  )
}

export default Breadcrumbs
