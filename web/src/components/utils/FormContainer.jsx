import { AccessTime, Person } from '@mui/icons-material'
import { Box, IconButton, Tooltip, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { Stack } from '@mui/system'
import { get, startCase } from 'lodash-es'

import Loading from 'src/components/Loading/Loading'
import IconText from 'src/components/utils/IconText'
import { useContainerWidth } from 'src/lib/AppContext'
import { fieldSchema } from 'src/lib/FieldSchemas'

import { BaseForm } from './BaseForm'
import { Field } from './Field'
import Footer from './Footer'
import FormSection from './FormSection'
import LoadingButton from './LoadingButton'

function fieldsToColumns(fields, columnCount = 2) {
  const { fullSpan, nonFullSpan } = fields.reduce(
    (acc, [name, props = {}], index) => {
      const res = [name, props, index]
      if (props.span === 12) {
        acc.fullSpan.push(res)
      } else {
        acc.nonFullSpan.push(res)
      }
      return acc
    },
    { nonFullSpan: [], fullSpan: [] }
  )

  const columns = []
  const itemsPerColumn = Math.ceil(nonFullSpan.length / columnCount)

  for (let i = 0; i < columnCount; i++) {
    columns.push(
      nonFullSpan.slice(i * itemsPerColumn, (i + 1) * itemsPerColumn)
    )
  }

  return { columns, fullSpan }
}

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

const FormContainer = ({
  fields,
  displayConfig,
  columnCount = 2,
  createMutation,
  updateMutation,
  deleteMutation = false,
  fetchQuery,
  transformInput = (input) => input,
  onCreate,
  onDelete,
  onUpdate,
  onFetch,
  id,
  skipUpdatedCheck = false,
  autoComplete = 'off',
  highlightDirty = true,
}) => {
  const smallLayout = useContainerWidth(860)
  const schema = get(fieldSchema, displayConfig?.type?.toLowerCase(), {})

  return (
    <BaseForm
      autoComplete={autoComplete}
      formConfig={{
        schema,
        modelType: displayConfig?.type,
        namePath: displayConfig.namePath,
        createMutation,
        updateMutation,
        deleteMutation,
        fetchQuery,
        transformInput,
        onCreate,
        onDelete,
        onUpdate,
        onFetch,
        id,
        skipUpdatedCheck,
      }}
      loadingElement={
        <Box>
          <Loading loading />
          {/* {footer} */}
        </Box>
      }
    >
      {({
        isLoading,
        confirmDelete,
        formData,
        stats,
        loading: { loadingDelete, loadingCreate, loadingUpdate },
      }) => {
        const disabled = isLoading

        const footer = (
          <Footer>
            {id &&
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
            <Grid
              xs
              sx={{
                textAlign: 'right',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 2,
              }}
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
                  Delete {displayConfig.type}
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
                Save {displayConfig.type}
              </LoadingButton>
            </Grid>
          </Footer>
        )

        return (
          <Box sx={{ position: 'relative', width: '100%', pb: 3 }}>
            <Stack spacing={4} sx={{ pb: 2 }} className="content-container">
              {fields.map(
                (
                  { fields: sectionFields, title, sectionActions },
                  groupIndex
                ) => {
                  const { columns, fullSpan } = fieldsToColumns(
                    sectionFields,
                    columnCount
                  )
                  return (
                    <FormSection
                      key={groupIndex}
                      title={title}
                      sectionActions={sectionActions}
                    >
                      <Grid container sx={{ alignItems: 'start' }} xs={12}>
                        {columns.map((fieldSet, columnIndex) => (
                          <Grid
                            key={columnIndex}
                            xs={12 / columnCount}
                            container
                          >
                            {fieldSet.map(([key, options = {}], index) => (
                              <Grid key={key} xs={12}>
                                <Field
                                  tabIndex={100 * (groupIndex + 1) + index}
                                  name={key}
                                  highlightDirty={highlightDirty}
                                  {...options}
                                />
                              </Grid>
                            ))}
                          </Grid>
                        ))}
                        <Grid xs={12} container>
                          {fullSpan.map(([key, options = {}], index) => (
                            <Grid key={key} xs={12}>
                              <Field
                                tabIndex={
                                  100 * (groupIndex + 1) +
                                  columns.length +
                                  index
                                }
                                highlightDirty={highlightDirty}
                                name={key}
                                {...options}
                              />
                            </Grid>
                          ))}
                        </Grid>
                      </Grid>
                    </FormSection>
                  )
                }
              )}
            </Stack>
            <Box
              elevation={9}
              sx={{
                position: 'sticky',
                bottom: 0,
                zIndex: 10,
                pb: 2,
              }}
            >
              {footer}
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
          </Box>
        )
      }}
    </BaseForm>
  )
}

export default FormContainer
