import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useLazyQuery } from '@apollo/client'
import { Box, Tooltip, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { Stack } from '@mui/system'
import dayjs from 'dayjs'
import { get, startCase } from 'lodash-es'
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

const ModTime = ({ time, stats, formData }) => (
  <Typography variant="overline">
    {startCase(time)}{' '}
    <Tooltip title={stats[time].format('LLLL')}>
      <b>{stats[time].calendar()}</b>
    </Tooltip>{' '}
    by <b>{formData[`${time}_by`]?.name}</b>
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
  displayConfig,
  columnCount = 2,
  createMutation,
  updateMutation,
  deleteMutation,
  fetchQuery,
  transformInput = (input) => input,
  onCreate,
  onDelete,
  onUpdate,
  onFetch,
  id,
  skipUpdatedCheck,
  autoComplete = 'off',
}) => {
  const confirm = useConfirm()
  const { openSnackbar } = useSnackbar()
  const displayError = useDisplayError()
  const context = useForm({ defaultValues: transformData({}, fields) })
  const { formState, reset } = context
  const [retrieveTime, setRetrieveTime] = useState(null)
  const [formData, setFormData] = useState({})
  const resetPromiseRef = useRef(null)
  const display_name = get(formData, displayConfig?.namePath || 'name')

  const resetForm = useCallback(
    async (result) => {
      const result_data = result ? dataFromResult(result) : {}
      const data = onFetch ? await onFetch(result_data) : result_data
      setFormData(data)
      setRetrieveTime(dayjs(data?.updated_at))
      const values = transformData(data, fields)

      reset(values)

      // Create a Promise that resolves when formState.isDirty becomes false
      const waitForReset = new Promise((resolve) => {
        resetPromiseRef.current = resolve
      })

      // Await the Promise
      await waitForReset

      return data
    },
    [fields, onFetch, reset]
  )

  useEffect(() => {
    if (!formState.isDirty && resetPromiseRef.current) {
      resetPromiseRef.current()
      resetPromiseRef.current = null
    }
  }, [formState.isDirty])

  const stats = useMemo(
    () => ({
      created: dayjs(formData?.created_at),
      updated: dayjs(formData?.updated_at),
    }),
    [formData?.created_at, formData?.updated_at]
  )

  const dataFromResult = (result) => {
    return result[Object.keys(result)[0]]
  }

  const [deleteEntity, { loading: loadingDelete }] = useMutation(
    deleteMutation,
    {
      onCompleted: async (data) => {
        openSnackbar(`${displayConfig.type} "${display_name}" deleted`)
        // await new Promise((resolve) => setTimeout(resolve, 0))
        onDelete && (await onDelete(data))
      },
      onError: displayError,
    }
  )

  const [createEntity, { loading: loadingCreate }] = useMutation(
    createMutation,
    {
      onCompleted: async (result) => {
        openSnackbar(`${displayConfig.type} created`)
        const data = await resetForm(result)
        onCreate && (await onCreate(data))
      },
      onError: displayError,
    }
  )

  const [updateEntity, { loading: loadingUpdate }] = useMutation(
    updateMutation,
    {
      onCompleted: async (result) => {
        openSnackbar(`${displayConfig.type} updated`)
        const data = await resetForm(result)
        onUpdate && (await onUpdate(data))
      },
      onError: displayError,
    }
  )

  const [fetchEntity, { loading: loadingFetch }] = useLazyQuery(fetchQuery, {
    onError: displayError,
    fetchPolicy: 'no-cache',
  })

  useEffect(() => {
    const updateData = async () => {
      const { data } = id
        ? await fetchEntity({
            variables: { id },
          })
        : { data: null }
      return resetForm(data)
    }
    updateData()
  }, [id, fetchEntity, resetForm, onFetch])

  const confirmDelete = async () => {
    await confirm({
      title: 'Confirm Delete',
      description: `Are you sure you want to delete the ${displayConfig.type.toLowerCase()} "${display_name}"?`,
    })
    await deleteEntity({ variables: { id } })
  }

  const getChangedFields = (input, dirtyFields) => {
    if (!dirtyFields || typeof dirtyFields !== 'object') {
      return input
    }

    return Object.keys(dirtyFields).reduce((acc, key) => {
      if (dirtyFields[key] === true) {
        acc[key] = input[key]
      } else {
        acc[key] = getChangedFields(input[key], dirtyFields[key])
      }
      return acc
    }, {})
  }

  const onSave = async (input) => {
    const { dirtyFields } = formState
    if (!id && Object.keys(input).length === 0) {
      displayError('No data to save')
      return
    }
    const changedFields = id ? getChangedFields(input, dirtyFields) : input
    if (Object.keys(dirtyFields).length === 0) {
      displayError('No changes to save')
      return
    }
    const transformedInput = await transformInput(changedFields)
    if (id) {
      if (!skipUpdatedCheck) {
        const { data: currentRecord = {} } = await fetchEntity({
          variables: { id: id },
        })
        const { updated_at, updated_by } =
          currentRecord[Object.keys(currentRecord)[0]]
        const currentTime = dayjs(updated_at)
        // console.log(currentTime.format(), retrieveTime.format())
        if (currentTime > retrieveTime) {
          displayError(
            <span>
              Unable to save your changes. This record was updated by{' '}
              <b>{updated_by?.name}</b> on <b>{currentTime?.format('LLLL')}</b>{' '}
              after you began editing. Please refresh the page to view the
              latest version and manually reapply your changes.
            </span>
          )
          return false
        }
      }
      await updateEntity({
        variables: { id: id, input: transformedInput },
      })
    } else {
      await createEntity({ variables: { input: transformedInput } })
    }
    return true
  }

  const disabled =
    loadingCreate || loadingDelete || loadingUpdate || loadingFetch
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
          loading={loadingCreate || loadingUpdate}
        >
          Save {displayConfig.type}
        </LoadingButton>
      </Grid>
    </Footer>
  )

  if (loadingFetch || !retrieveTime)
    return (
      <Box>
        <Loading loading />
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
