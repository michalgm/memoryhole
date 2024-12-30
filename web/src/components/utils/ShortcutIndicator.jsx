import { Box } from '@mui/system'

const ShortcutIndicator = ({ combo }) => {
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
      <Box
        sx={{
          backgroundColor: 'grey.200',
          color: 'black',
          px: 0.8,
          py: 0.2,
          borderRadius: '4px',
          fontFamily: 'monospace',
          mx: 0.5,
        }}
      >
        {combo.toUpperCase()}
      </Box>
    </Box>
  )
}

export default ShortcutIndicator
