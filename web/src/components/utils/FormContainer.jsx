import { Box, Tooltip, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { Stack } from '@mui/system'
import { startCase } from 'lodash-es'

import Loading from 'src/components/Loading/Loading'

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

const ModTime = ({ time, stats, formData }) => (
  <Typography variant="overline">
    {startCase(time)}{' '}
    <Tooltip title={stats[time].format('LLLL')}>
      <b>{stats[time].calendar()}</b>
    </Tooltip>{' '}
    by <b>{formData[`${time}_by`]?.name}</b>
  </Typography>
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
}) => {
  return (
    <BaseForm
      autoComplete={autoComplete}
      formConfig={{
        fields,
        displayConfig,
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
    >
      {({
        isLoading,
        confirmDelete,
        formData,
        stats,
        retrieveTime,
        loading: { loadingDelete, loadingCreate, loadingUpdate },
      }) => {
        const disabled = isLoading
        const footer = (
          <Footer>
            <Grid xs>
              {formData?.created_at && id && (
                <ModTime time="created" stats={stats} formData={formData} />
              )}
            </Grid>
            <Grid xs>
              {formData?.updated_at && id && (
                <ModTime time="updated" stats={stats} formData={formData} />
              )}
            </Grid>
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
                  variant="outlined"
                  color="inherit"
                  size="small"
                  onClick={confirmDelete}
                  disabled={disabled}
                  loading={loadingDelete}
                >
                  Delete {displayConfig.type}
                </LoadingButton>
              )}
              <LoadingButton
                type="submit"
                variant="contained"
                color="secondary"
                size="small"
                disabled={disabled}
                loading={loadingUpdate || loadingCreate}
              >
                Save {displayConfig.type}
              </LoadingButton>
            </Grid>
          </Footer>
        )
        if (!retrieveTime)
          return (
            <Box>
              <Loading loading />
              {footer}
            </Box>
          )

        return (
          <Box>
            <Stack spacing={4} sx={{ pb: 8 }} className="content-container">
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
            {footer}
          </Box>
        )
      }}
    </BaseForm>
  )
}

export default FormContainer
