import { Link as MUILink } from '@mui/material'

import { Link as RouterLink } from '@redwoodjs/router'

const Link = ({ to, ...rest }) => {
  return <MUILink component={RouterLink} to={to} underline="hover" {...rest} />
}

export default Link
