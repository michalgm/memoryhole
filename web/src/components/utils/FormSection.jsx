import { ExpandMore } from '@mui/icons-material'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Tooltip,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { Box, Stack } from '@mui/system'
import { useFormContext } from 'react-hook-form-mui'

const FormSection = ({ title, sectionActions = [], children }) => {
  const context = useFormContext()
  return (
    <Grid xs={12} spacing={2} key={title}>
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
          <Grid xs={12} container spacing={2} sx={{ m: 0 }}>
            {children}
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Grid>
  )
}

export default FormSection
