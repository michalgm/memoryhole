import { ExpandMore } from '@mui/icons-material'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Grid2,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import { useFormContext } from 'react-hook-form-mui'

const FormSection = ({ title, sectionActions = [], children }) => {
  const context = useFormContext()
  return (
    <Grid2 spacing={2} key={title} size={12}>
      <Accordion xs={12} defaultExpanded disableGutters>
        <AccordionSummary
          sx={{
            position: 'sticky',
            top: 46,
            bgcolor: (theme) =>
              theme.palette.mode === 'light' ? 'primary.light' : 'grey.800',
            color: (theme) =>
              theme.palette?.contrast ? 'contrast.main' : 'primary.main',
            '&.Mui-expanded': {
              marginBottom: 1,
            },
            zIndex: 9,
          }}
          expandIcon={<ExpandMore sx={{ color: 'contrast.main' }} />}
        >
          <Stack
            spacing={2}
            direction="row"
            justifyContent="space-between"
            width="100%"
            sx={{ pr: 2 }}
          >
            <Typography variant="h5">{title}</Typography>
            {sectionActions.map((action) => (
              <Box key={action.label}>
                <Tooltip title={action.tooltip}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      action.onClick(e, context)
                    }}
                    sx={{ my: -10 }}
                  >
                    {action.label}
                  </Button>
                </Tooltip>
              </Box>
            ))}
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Grid2 container spacing={2} sx={{ m: 0 }} size={12}>
            {children}
          </Grid2>
        </AccordionDetails>
      </Accordion>
    </Grid2>
  )
}

export default FormSection
