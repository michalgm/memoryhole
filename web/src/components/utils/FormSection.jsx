import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material"

import { ExpandMore } from '@mui/icons-material'
import Grid from "@mui/material/Unstable_Grid2/Grid2"

const FormSection = ({ title, children }) => {
  return (
    <Grid
      xs={12}
      spacing={2}
      key={title}
    >
      <Accordion xs={12} defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">
            {title}
          </Typography>
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
