import { Stack } from '@mui/system'

const IconText = ({ icon: Icon, children }) => (
  <Stack direction="row" gap={1} alignItems="center">
    <Icon sx={{ fontSize: 'inherit' }} />
    <span>{children}</span>
  </Stack>
)
export default IconText
