import { Link as MUILink } from '@mui/material'
import { Link as RouterLink } from '@redwoodjs/router'

const Link = ({ to, ...rest }) => {
  return <MUILink component={RouterLink} to={to} {...rest} />
}

export default Link
