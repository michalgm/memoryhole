import { NavigateNext } from '@mui/icons-material'
import { Box, Breadcrumbs as MUIBreadcrumbs, Typography } from '@mui/material'

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

  const crumbs = []
  if (pathname.startsWith('/admin')) {
    crumbs.push(<Link to={routes.admin()}>Admin</Link>)
  }

  if (titleTo) {
    crumbs.push(<Link to={routes[titleTo]()}>{title}</Link>)
  }
  if (endCrumb) {
    crumbs.push(endCrumb)
  }
  return (
    <>
      <Metadata title={metaTitle} />
      <Box>
        <MUIBreadcrumbs separator={<NavigateNext fontSize="small" />}>
          {crumbs.map((crumb, i) => (
            <Typography
              variant="h5"
              fontWeight={i === crumbs.length - 1 ? 800 : 'inherit'}
              key={i}
            >
              {crumb}
            </Typography>
          ))}
        </MUIBreadcrumbs>
      </Box>
    </>
  )
}

export default Breadcrumbs
