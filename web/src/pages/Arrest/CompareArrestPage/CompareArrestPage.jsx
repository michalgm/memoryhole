import { useEffect, useRef } from 'react'

import { useConfirm } from 'material-ui-confirm'

import { navigate, routes, useRouteName } from '@redwoodjs/router'
import { useMutation, useQuery } from '@redwoodjs/web'

import CompareForm from 'src/components/CompareForm/CompareForm'
import { useDisplayError, useSnackbar } from 'src/components/utils/SnackBar'
import { useApp } from 'src/lib/AppContext'
import ArrestFields, { fieldSchema } from 'src/lib/FieldSchemas'
import ArrestPage, {
  DELETE_ARREST_MUTATION,
  QUERY,
} from 'src/pages/Arrest/ArrestPage/ArrestPage'

const CREATE_IGNORED_DUPLICATE = gql`
  mutation CreateIgnoredDuplicateArrest($arrest1_id: Int!, $arrest2_id: Int!) {
    createIgnoredDuplicateArrest(
      arrest1_id: $arrest1_id
      arrest2_id: $arrest2_id
    ) {
      id
    }
  }
`

const CompareArrestPage = ({ id, compareId }) => {
  const { data, loading } = useQuery(QUERY, {
    variables: { id: parseInt(compareId) },
  })
  const deleteAfterSave = useRef(false)
  const displayError = useDisplayError()
  const { openSnackbar } = useSnackbar()
  const confirm = useConfirm()
  const { setPageTitle, pageTitle } = useApp()
  const routeName = useRouteName()

  const compareData = data?.arrest || {}
  const displayName = compareData?.arrestee?.search_display_field

  const originalName = pageTitle?.arrest

  useEffect(() => {
    setPageTitle({
      compareArrest: compareData?.arrestee?.display_field
        ? `Compare to "${compareData?.arrestee?.display_field}"`
        : 'Loading...',
      findDuplicateArrestsCompare:
        originalName && compareData?.arrestee?.display_field
          ? `Compare "${originalName}" to "${compareData?.arrestee?.display_field}"`
          : 'Loading...',
    })
  }, [compareData?.arrestee?.display_field, setPageTitle, originalName])

  const [ignoreDuplicates, { loading: loadingIgnore }] = useMutation(
    CREATE_IGNORED_DUPLICATE,
    {
      onError: displayError,
      variables: { arrest1_id: parseInt(id), arrest2_id: parseInt(compareId) },
      onCompleted: async () => {
        openSnackbar(
          `Arrest pair "${originalName}" and "${displayName}" marked as not a duplicate`
        )
        if (routeName === 'findDuplicateArrestsCompare') {
          navigate(routes.findDuplicateArrests())
        } else {
          navigate(routes.arrest({ id }))
        }
      },
    }
  )

  const [deleteEntity, { loading: loadingDelete }] = useMutation(
    DELETE_ARREST_MUTATION,
    {
      onCompleted: async () => {
        openSnackbar(`Arrest "${displayName}" deleted`)
      },
      onError: displayError,
      variables: { id: parseInt(compareId) },
    }
  )

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
          ({ disabled, allowSave, loadingUpdate }) => ({
            children: 'Save Arrest and delete comparison',
            disabled: disabled,
            loading: loadingUpdate || loadingDelete,
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
                if (allowSave) {
                  form.requestSubmit()
                } else {
                  onUpdate()
                }
              } catch (err) {
                console.debug('user cancelled')
              }
            },
          }),
          ({ disabled }) => ({
            children: 'Mark these arrests as NOT duplicates',
            disabled: disabled,
            loading: loadingIgnore,
            variant: 'outlined',
            color: 'inherit',
            onClick: async () => {
              try {
                await confirm({
                  title: 'Confirm marking as not duplicates',
                  description: (
                    <>
                      <span>
                        Are you sure you want to mark this arrest pair as not a
                        duplicate? They will be excluded from future duplicate
                        searches.
                      </span>
                    </>
                  ),
                })
                await ignoreDuplicates()
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
