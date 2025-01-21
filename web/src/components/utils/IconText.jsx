import { Stack } from '@mui/material'

const IconText = ({ icon: Icon, size = 'inherit', children }) => (
  <Stack direction="row" gap={1} alignItems="center">
    <Icon fontSize={size} />
    {children && <span>{children}</span>}
  </Stack>
)
export default IconText
