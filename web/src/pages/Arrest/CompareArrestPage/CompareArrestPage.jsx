import { useRef } from 'react'

import { useConfirm } from 'material-ui-confirm'

import { navigate, routes } from '@redwoodjs/router'
import { useMutation, useQuery } from '@redwoodjs/web'

import CompareForm from 'src/components/CompareForm/CompareForm'
import { useDisplayError, useSnackbar } from 'src/components/utils/SnackBar'
import ArrestFields, { fieldSchema } from 'src/lib/FieldSchemas'
import ArrestPage, {
  DELETE_ARREST_MUTATION,
  QUERY,
} from 'src/pages/Arrest/ArrestPage/ArrestPage'

const CompareArrestPage = ({ id, compareId }) => {
  const { data, loading } = useQuery(QUERY, {
    variables: { id: parseInt(compareId) },
  })
  const deleteAfterSave = useRef(false)
  const displayError = useDisplayError()
  const { openSnackbar } = useSnackbar()
  const confirm = useConfirm()

  const compareData = data?.arrest || {}
  const displayName = compareData?.arrestee?.search_display_field

  const [deleteEntity] = useMutation(DELETE_ARREST_MUTATION, {
    onCompleted: async () => {
      openSnackbar(`Arrest "${displayName}" deleted`)
    },
    onError: displayError,
    variables: { id: parseInt(compareId) },
  })
  const onUpdate = async () => {
    if (deleteAfterSave.current) {
      deleteAfterSave.current = false
      await deleteEntity()
      navigate(routes.arrest({ id }))
    }
  }

  return (
    <ArrestPage
      id={id}
      onUpdate={onUpdate}
      footerProps={{
        disableStats: true,
        disableDelete: true,
        postButtons: [
          ({ disabled, allowSave, loadingUpdate, loadingCreate }) => ({
            children: 'Save Arrest and delete comparison',
            tooltip:
              !allowSave &&
              !loadingUpdate &&
              !loadingCreate &&
              'There are no changes to be saved',
            disabled: disabled || !allowSave,
            loading: loadingUpdate,
            type: 'submit',
            onClick: async (e) => {
              e.preventDefault()
              const form = e.target.closest('form')
              try {
                await confirm({
                  title: 'Confirm save and delete',
                  description: (
                    <>
                      <span>
                        Are you sure you want to delete the arrest &quot;
                        {displayName}&quot;?
                      </span>
                    </>
                  ),
                })
                deleteAfterSave.current = true
                form.requestSubmit()
              } catch (err) {
                console.debug('user cancelled')
              }
            },
          }),
        ],
      }}
    >
      {(formManagerContext) => (
        <CompareForm
          loading={loading}
          formManagerContext={formManagerContext}
          schema={fieldSchema.arrest}
          fields={ArrestFields}
          compareData={compareData}
        />
      )}
    </ArrestPage>
  )
}

export default CompareArrestPage
