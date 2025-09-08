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
import Show from 'src/components/utils/Show'

export const ModInfo = React.forwardRef(
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
                      {stats[time].tz().format('L LT')}
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

const FooterButton = ({
  children,
  disabled,
  loading,
  onClick,
  tooltip = '',
  variant = 'contained',
  color = 'secondary',
  ...props
}) => (
  <Tooltip title={tooltip} placement="top">
    <Box>
      <LoadingButton
        variant={variant}
        color={color}
        size="medium"
        disabled={disabled}
        loading={loading}
        onClick={onClick}
        {...props}
      >
        {children}
      </LoadingButton>
    </Box>
  </Tooltip>
)

const Footer = ({
  children,
  id,
  smallLayout,
  deleteMutation,
  disabled,
  label,
  deleteOptions,
  allowSave = true,
  disableStats = false,
  disableDelete = false,
  disableSave = false,
  preButtons = [],
  postButtons = [],
  formManagerContext,
}) => {
  const {
    stats,
    formData,
    confirmDelete,
    loading: { loadingUpdate, loadingCreate, loadingDelete },
  } = formManagerContext

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
          <Show unless={disableStats}>
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
          </Show>
          <Grid2
            sx={{
              textAlign: 'right',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
            }}
            size="grow"
          >
            {preButtons.map((propsMethod, index) => (
              <FooterButton key={index} {...propsMethod()} />
            ))}
            <Show when={(id && deleteMutation && !disableDelete) || false}>
              <FooterButton
                disabled={disabled}
                loading={loadingDelete}
                onClick={() => confirmDelete(deleteOptions)}
                variant="outlined"
                color="inherit"
              >
                Delete {label}
              </FooterButton>
            </Show>
            <Show when={!disableSave}>
              <FooterButton
                disabled={disabled || !allowSave}
                loading={loadingUpdate || loadingCreate}
                tooltip={
                  !allowSave &&
                  !loadingUpdate &&
                  !loadingCreate &&
                  'There are no changes to be saved'
                }
                type="submit"
              >
                Save {label}
              </FooterButton>
            </Show>
            {postButtons.map((propsMethod, index) => (
              <FooterButton
                key={index}
                {...propsMethod({
                  id,
                  disabled,
                  allowSave,
                  loadingUpdate,
                  loadingCreate,
                  loadingDelete,
                  formData,
                  smallLayout,
                  stats,
                  deleteMutation,
                  confirmDelete,
                  deleteOptions,
                  ...formManagerContext,
                })}
              />
            ))}
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
