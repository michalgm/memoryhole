import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useLazyQuery, useMutation } from '@apollo/client'
import dayjs from 'dayjs'
import { get } from 'lodash-es'
import { useConfirm } from 'material-ui-confirm'
import { useForm } from 'react-hook-form-mui'

import { useBlocker } from '@redwoodjs/router'

import { useDisplayError, useSnackbar } from 'src/components/utils/SnackBar'
import { transformData } from 'src/lib/transforms'

const dataFromResult = (result) => {
  return result[Object.keys(result)[0]]
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

const mockMutation = gql`
  mutation NoOp {
    __typename
  }
`

export function useFormManager({
  fields,
  displayConfig,
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
}) {
  const confirm = useConfirm()
  const context = useForm({ defaultValues: transformData({}, fields) })
  const { formState, reset } = context
  const [retrieveTime, setRetrieveTime] = useState(null)
  const [formData, setFormData] = useState({})
  const resetPromiseRef = useRef(null)
  const display_name = get(formData, displayConfig?.namePath || 'name')
  const displayError = useDisplayError()
  const { openSnackbar } = useSnackbar()

  const blocker = useBlocker({ when: formState.isDirty })

  const stats = useMemo(
    () => ({
      created: dayjs(formData?.created_at),
      updated: dayjs(formData?.updated_at),
    }),
    [formData?.created_at, formData?.updated_at]
  )

  const [deleteEntity, { loading: loadingDelete }] = useMutation(
    deleteMutation || mockMutation,
    {
      onCompleted: async (data) => {
        openSnackbar(`${displayConfig.type} "${display_name}" deleted`)
        onDelete && (await onDelete(data))
      },
      onError: displayError,
    }
  )
  const [createEntity, { loading: loadingCreate }] = useMutation(
    createMutation || mockMutation,
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
    updateMutation || mockMutation,
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

  // Move all the existing form management functions here
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

  const confirmDelete = async () => {
    if (!deleteMutation) {
      throw new Error('Delete mutation not configured')
    }

    await confirm({
      title: 'Confirm Delete',
      description: `Are you sure you want to delete the ${displayConfig.type.toLowerCase()} "${display_name}"?`,
    })
    await deleteEntity({ variables: { id } })
  }

  const onSave = async (input) => {
    const { dirtyFields } = formState

    if (!id && !createMutation) {
      throw new Error('Create mutation not configured')
    } else if (id && !updateMutation) {
      throw new Error('Update mutation not configured')
    }

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
        const { updated_at, updated_by } = dataFromResult(currentRecord)
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

  useEffect(() => {
    const updateData = async () => {
      const { data } = id
        ? await fetchEntity({ variables: { id } })
        : { data: null }
      return resetForm(data)
    }
    updateData()
  }, [id, fetchEntity, resetForm, onFetch])

  return {
    formContext: context,
    formState,
    formData,
    stats,
    loadingDelete,
    loadingCreate,
    loadingUpdate,
    loadingFetch,
    onSave,
    confirmDelete,
    blocker,
    display_name,
    retrieveTime,
    isLoading: loadingCreate || loadingDelete || loadingUpdate || loadingFetch,
    loading: {
      loadingDelete,
      loadingCreate,
      loadingUpdate,
      loadingFetch,
    },
  }
}
