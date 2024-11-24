import { ExpandMore } from '@mui/icons-material'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { Box, Stack } from '@mui/system'
import { useFormContext } from 'react-hook-form'

const FormSection = ({ title, sectionActions = [], children }) => {
  const context = useFormContext()
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
          <Stack
            spacing={2}
            direction="row"
            justifyContent="space-between"
            width="100%"
            sx={{ pr: 2 }}
          >
            <Typography variant="h3">{title}</Typography>
            {sectionActions.map((action) => (
              <Box key={action.label}>
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
              </Box>
            ))}
          </Stack>
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
