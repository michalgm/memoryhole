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
    <Grid2 container spacing={2} key={title} size={12}>
      <Accordion size={12} defaultExpanded disableGutters>
        <AccordionSummary
          sx={(theme) => ({
            position: 'sticky',
            top: 46,
            backgroundColor: 'primary.light',
            color: 'contrast.main',
            '&.Mui-expanded': {
              marginBottom: 1,
            },
            zIndex: 9,
            ...theme.applyStyles('dark', {
              backgroundColor: 'grey.800', // remove the box shadow in dark mode
            }),
          })}
          expandIcon={<ExpandMore sx={{ color: 'contrast.main' }} />}
        >
          <Stack
            spacing={2}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
            sx={{ pr: 2 }}
          >
            <Typography variant="h5">{title}</Typography>
            {sectionActions.map((action) => (
              <Box key={action.label}>
                <Tooltip title={action.tooltip}>
                  <Button
                    component="div"
                    variant="contained"
                    size="small"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      action.onClick(e, context)
                    }}
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
