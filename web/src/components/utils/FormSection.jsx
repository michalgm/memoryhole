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

import LoadingButton from 'src/components/utils/LoadingButton'
import Show from 'src/components/utils/Show'

const FormSection = ({
  title,
  sectionActions = [],
  children,
  small = false,
  sticky = true,
  disableCollapse = false,
  buttons = [],
}) => {
  const context = useFormContext()
  return (
    <Accordion key={title} size={12} defaultExpanded disableGutters>
      <AccordionSummary
        sx={(theme) => ({
          pointerEvents: disableCollapse ? 'none' : null,
          position: sticky ? 'sticky' : undefined,
          top: sticky ? 46 : undefined,
          minHeight: small ? 0 : undefined,
          backgroundColor: 'primary.light',
          color: 'contrast.main',
          '&.Mui-expanded': {
            marginBottom: 1,
          },
          zIndex: 9,
          ...theme.applyStyles('dark', {
            backgroundColor: 'grey.800', // remove the box shadow in dark mode
          }),
          '.MuiAccordionSummary-content': {
            margin: 0,
          },
        })}
        expandIcon={
          disableCollapse ? null : (
            <ExpandMore sx={{ color: 'contrast.main' }} />
          )
        }
      >
        <Stack
          spacing={2}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
          sx={{ pr: 2 }}
        >
          <Typography variant={small ? 'body1' : 'h5'} component="h3">
            {title}
          </Typography>
          <Stack direction="row" spacing={1}>
            {sectionActions.map((action) => (
              <Box key={action.label}>
                <Tooltip title={action.tooltip}>
                  <Button
                    component="div"
                    variant="contained"
                    size="small"
                    startIcon={action.icon ? <action.icon /> : null}
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
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Grid2 container spacing={2} sx={{ m: 0 }} size={12}>
          {children}
          <Show when={buttons.length > 0}>
            <Grid2 container justifyContent={'flex-end'} size={12}>
              {buttons.map(({ children, tooltip, ...props }, index) => (
                <Box key={index}>
                  <Tooltip title={tooltip}>
                    <span>
                      <LoadingButton
                        variant="contained"
                        color="secondary"
                        size="small"
                        {...props}
                      >
                        {children}
                      </LoadingButton>
                    </span>
                  </Tooltip>
                </Box>
              ))}
            </Grid2>
          </Show>
        </Grid2>
      </AccordionDetails>
    </Accordion>
  )
}

export default FormSection
