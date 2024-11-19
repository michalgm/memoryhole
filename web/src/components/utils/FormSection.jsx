import { ExpandMore } from '@mui/icons-material'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2/Grid2'

const FormSection = ({ title, children }) => {
  return (
    <Grid xs={12} spacing={2} key={title}>
      <Accordion xs={12} defaultExpanded disableGutters>
        <AccordionSummary
          sx={{
            bgcolor: 'primary.light',
            color: 'primary.contrastText',
            '&.Mui-expanded': {
              marginBottom: 1,
            },
            // borderTopColor: 'primary.light',
            // borderTopWidth: 6,
            // borderTopStyle: 'solid',
          }}
          expandIcon={<ExpandMore sx={{ color: 'primary.contrastText' }} />}
        >
          <Typography variant="h3">{title}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid xs={12} container spacing={2}>
            {children}
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Grid>
  )
}

export default FormSection
