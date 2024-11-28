import { useEffect, useState } from 'react'

import { useLazyQuery } from '@apollo/client'
import { Box, Tooltip, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { Stack } from '@mui/system'
import dayjs from 'dayjs'
import { startCase } from 'lodash-es'
import { useConfirm } from 'material-ui-confirm'
import { FormContainer as RHFFormContainer, useForm } from 'react-hook-form-mui'

import { useBlocker } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'

import Loading from 'src/components/Loading/Loading'
import { transformData } from 'src/lib/transforms'

import { Field } from './Field'
import Footer from './Footer'
import FormSection from './FormSection'
import LoadingButton from './LoadingButton'
import { useDisplayError, useSnackbar } from './SnackBar'

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

const ModTime = ({ time, stats, entity }) => (
  <Typography variant="overline">
    {startCase(time)}{' '}
    <Tooltip title={stats[time].format('LLLL')}>
      <b>{stats[time].calendar()}</b>
    </Tooltip>{' '}
    by <b>{entity[`${time}_by`]?.name}</b>
  </Typography>
)

// New component to handle form state
const FormStateHandler = ({ formState }) => {
  const { isDirty } = formState
  const blocker = useBlocker({ when: isDirty })
  const confirm = useConfirm()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    const handleNav = async () => {
      if (isDialogOpen) return

      setIsDialogOpen(true)
      try {
        await confirm({
          title:
            'You have unsaved changes. Are you sure you want to leave this page? Changes you made will be lost if you navigate away.',
        })
        blocker.confirm()
      } catch (e) {
        blocker.abort()
      } finally {
        setIsDialogOpen(false)
      }
    }
    if (blocker.state === 'BLOCKED') {
      handleNav()
    }
  }, [blocker, confirm, isDialogOpen])
  return null
}

const FormContainer = ({
  fields,
  entity,
  displayConfig,
  columnCount = 2,
  createMutation,
  updateMutation,
  deleteMutation,
  fetchQuery,
  transformInput,
  onCreate,
  onDelete,
  onUpdate,
  loading,
  autoComplete = 'off',
}) => {
  const confirm = useConfirm()
  const { openSnackbar } = useSnackbar()
  const displayError = useDisplayError()
  const context = useForm({ defaultValues: {} })
  const { formState } = context
  const [retrieveTime, setRetrieveTime] = useState(null)

  useEffect(() => {
    if (!loading) {
      const values = transformData(entity, fields)
      setRetrieveTime(dayjs(values.created_at))
      context.reset(values)
    }
  }, [context, loading, entity, fields])

  const stats = {
    created: dayjs(entity?.created_at),
    updated: dayjs(entity?.updated_at),
  }

  const [deleteEntity, { loading: loadingDelete }] = useMutation(
    deleteMutation,
    {
      onCompleted: async () => {
        openSnackbar(`${displayConfig.type} "${displayConfig.name}" deleted`)
        onDelete && (await onDelete())
      },
      onError: displayError,
    }
  )

  const [createEntity, { loading: loadingCreate }] = useMutation(
    createMutation,
    {
      onCompleted: async (data) => {
        openSnackbar(`${displayConfig.type} created`)
        onCreate && (await onCreate(data))
      },
      onError: displayError,
    }
  )

  const [updateEntity, { loading: loadingUpdate }] = useMutation(
    updateMutation,
    {
      onCompleted: async () => {
        openSnackbar(`${displayConfig.type} updated`)
        onUpdate && (await onUpdate())
      },
      refetchQueries: [{ query: fetchQuery, variables: { id: entity?.id } }],
      awaitRefetchQueries: true,
      onError: displayError,
    }
  )

  const [fetchEntity, { loading: loadingFetch }] = useLazyQuery(fetchQuery, {
    onError: displayError,
    fetchPolicy: 'no-cache',
  })

  const confirmDelete = async () => {
    await confirm({
      title: 'Confirm Delete',
      description: `Are you sure you want to delete the ${displayConfig.type} "${displayConfig.name}"?`,
    })
    await deleteEntity({ variables: { id: entity.id } })
  }

  const getChangedFields = (input, dirtyFields) => {
    const changed = {}
    for (const key in dirtyFields) {
      if (typeof dirtyFields[key] === 'object' && dirtyFields[key] !== null) {
        changed[key] = getChangedFields(input[key], dirtyFields[key])
      } else {
        changed[key] = input[key]
      }
    }

    return changed
  }

  const onSave = async (input) => {
    const { dirtyFields } = formState
    const changedFields = getChangedFields(input, dirtyFields)
    if (Object.keys(dirtyFields).length === 0) {
      displayError('No changes to save')
      return
    }
    const transformedInput = await transformInput(changedFields)
    if (entity?.id) {
      const { data: currentRecord } = await fetchEntity({
        variables: { id: entity.id },
      })
      const { updated_at, updated_by } =
        currentRecord[Object.keys(currentRecord)[0]]

      const current_time = dayjs(updated_at)

      if (current_time > retrieveTime) {
        displayError(
          <span>
            Unable to save your changes. This record was updated by{' '}
            <b>{updated_by.name}</b> on <b>{current_time.format('LLLL')}</b>{' '}
            after you began editing. Please refresh the page to view the latest
            version and manually reapply your changes.
          </span>
        )
        return false
      }
      return updateEntity({
        variables: { id: entity.id, input: transformedInput },
      })
    } else {
      return createEntity({ variables: { input: transformedInput } })
    }
  }

  const disabled =
    loading || loadingCreate || loadingDelete || loadingUpdate || loadingFetch
  const footer = (
    <Footer>
      <Grid xs>
        {entity?.created_at && entity?.id && (
          <ModTime time="created" stats={stats} entity={entity} />
        )}
      </Grid>
      <Grid xs>
        {entity?.updated_at && entity?.id && (
          <ModTime time="updated" stats={stats} entity={entity} />
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
        {entity?.id && deleteMutation && (
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
          loading={loadingCreate || loadingUpdate}
        >
          Save {displayConfig.type}
        </LoadingButton>
      </Grid>
    </Footer>
  )

  if (loading)
    return (
      <Box>
        <Loading />
        {footer}
      </Box>
    )

  return (
    <Box>
      <RHFFormContainer
        onSuccess={onSave}
        FormProps={{
          autoComplete,
        }}
        formContext={context}
      >
        <FormStateHandler formState={formState} />
        <Stack spacing={4} sx={{ pb: 8 }} className="content-container">
          {fields.map(
            ({ fields: sectionFields, title, sectionActions }, groupIndex) => {
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
                      <Grid key={columnIndex} xs={12 / columnCount} container>
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
                              100 * (groupIndex + 1) + columns.length + index
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
      </RHFFormContainer>
    </Box>
  )
}

export default FormContainer
