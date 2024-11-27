import { Link as MUILink } from '@mui/material'

import { Link as RouterLink } from '@redwoodjs/router'

const Link = ({ to, ...rest }) => {
  if (!to && rest.href) {
    to = rest.href
  }
  if (to?.startsWith('#')) {
    return <MUILink href={to} underline="hover" {...rest} />
  }
  return <MUILink component={RouterLink} to={to} underline="hover" {...rest} />
}

export default Link
