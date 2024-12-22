import { AccessTime, Person } from '@mui/icons-material'
import {
  Box,
  Grid2,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import { startCase } from 'lodash-es'

import IconText from 'src/components/utils/IconText'
import LoadingButton from 'src/components/utils/LoadingButton'

const ModInfo = React.forwardRef(
  ({ stats, formData, withBy, ...props }, ref) => {
    return (
      <Stack
        spacing={3}
        direction={withBy ? 'column' : 'row'}
        alignItems="center"
        justifyContent="flex-start"
        {...props}
        ref={ref}
      >
        {['created', 'updated']
          .filter((k) => stats?.[k])
          .map((time) => {
            return (
              <Typography
                key={time}
                variant="body2"
                lineHeight={1.3}
                sx={{ display: 'block', flexGrow: 1 }}
                component={'div'}
              >
                <Stack direction="row" gap={1} alignItems="flex-start">
                  <b>{startCase(time)}</b>
                  <Box>
                    <IconText icon={AccessTime}>
                      {stats[time].format('L LT')}
                    </IconText>
                    {formData[`${time}_by`] && (
                      <IconText icon={Person}>
                        {formData[`${time}_by`]?.name}
                      </IconText>
                    )}
                  </Box>
                </Stack>
              </Typography>
            )
          })}
      </Stack>
    )
  }
)

const Footer = ({
  children,
  id,
  formData,
  smallLayout,
  stats,
  deleteMutation,
  disabled,
  confirmDelete,
  loadingUpdate,
  loadingCreate,
  loadingDelete,
  label,
}) => {
  return (
    <Box
      elevation={9}
      sx={{
        position: 'sticky',
        bottom: 0,
        zIndex: 10,
        pb: 2,
      }}
    >
      <Paper
        id="footer"
        elevation={4}
        sx={(theme) => ({
          backgroundColor: 'primary.main',
          color: 'contrast.main',
          p: 2,
          zIndex: 12,
          position: 'relative',
          ...theme.applyStyles('dark', {
            backgroundColor: 'Background.paper',
          }),
        })}
      >
        <Stack
          direction={'row'}
          maxWidth={'lg'}
          alignItems="center"
          // sx={{ margin: 'auto', width: 'inherit', height: 5 }}
          spacing={2}
        >
          {id &&
            formData?.created_at &&
            (smallLayout ? (
              <Tooltip
                title={<ModInfo stats={stats} formData={formData} withBy />}
              >
                <IconButton color="inherit">
                  <AccessTime />
                </IconButton>
              </Tooltip>
            ) : (
              <ModInfo stats={stats} formData={formData} />
            ))}
          <Grid2
            sx={{
              textAlign: 'right',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
            }}
            size="grow"
          >
            {id && deleteMutation && (
              <LoadingButton
                sx={{ whiteSpace: 'nowrap' }}
                variant="outlined"
                color="inherit"
                size="medium"
                onClick={confirmDelete}
                disabled={disabled}
                loading={loadingDelete}
              >
                Delete {label}
              </LoadingButton>
            )}
            <LoadingButton
              sx={{ whiteSpace: 'nowrap' }}
              type="submit"
              variant="contained"
              color="secondary"
              size="medium"
              disabled={disabled}
              loading={loadingUpdate || loadingCreate}
            >
              Save {label}
            </LoadingButton>
          </Grid2>
          {children}
        </Stack>
      </Paper>
      <Box
        sx={{
          position: 'absolute',
          backgroundColor: 'var(--mui-palette-background-body)',
          mx: -1,
          zIndex: 0,
          height: 'calc(100% - 12px)',
          width: 'calc(100%  + 16px)',
          top: 12,
        }}
      />
    </Box>
  )
}

export default Footer
