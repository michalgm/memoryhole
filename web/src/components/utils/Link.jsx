import { Link as MUILink } from '@mui/material'

import { Link as RouterLink } from '@cedarjs/router'

const Link = ({ to, ...rest }) => {
  if (!to && rest.href) {
    to = rest.href
  }
  if (to?.startsWith('#') || rest.target) {
    return <MUILink href={to} underline="hover" {...rest} />
  }
  return <MUILink component={RouterLink} to={to} underline="hover" {...rest} />
}

export default Link
