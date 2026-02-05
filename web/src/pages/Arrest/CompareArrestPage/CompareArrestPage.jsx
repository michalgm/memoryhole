import { useEffect, useState } from 'react'

import { DialogContentText } from '@mui/material'
import { useConfirm } from 'material-ui-confirm'

import { navigate, routes, useRouteName } from '@redwoodjs/router'
import { useMutation, useQuery } from '@redwoodjs/web'

import { ArrestLayout } from 'src/../../api/src/lib/fieldDefinitions'
import CompareForm from 'src/components/CompareForm/CompareForm'
import { useDisplayError, useSnackbar } from 'src/components/utils/SnackBar'
import { useApp } from 'src/lib/AppContext'
import { fieldSchema } from 'src/lib/FieldSchemas'
import { displayItem } from 'src/lib/utils'
import ArrestPage, { QUERY } from 'src/pages/Arrest/ArrestPage/ArrestPage'

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

const MERGE_ARRESTS_MUTATION = gql`
  mutation MergeArrestsMutation(
    $id: Int!
    $input: UpdateArrestInput!
    $merge_id: Int!
  ) {
    mergeArrests(id: $id, input: $input, merge_id: $merge_id) {
      id
      ...ArrestFields
    }
  }
`

const CompareArrestPage = ({ id, compareId }) => {
  const { data, loading } = useQuery(QUERY, {
    variables: { id: parseInt(compareId) },
  })
  const [merging, setMerging] = useState(false)
  const displayError = useDisplayError()
  const { openSnackbar } = useSnackbar()
  const confirm = useConfirm()
  const { setPageTitle, pageTitle } = useApp()
  const routeName = useRouteName()

  const compareData = data?.arrest || {}

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
    }
  )

  const [mergeArrests] = useMutation(MERGE_ARRESTS_MUTATION, {
    onError: displayError,
  })

  const mergeButton = ({
    disabled,
    prepareUpdate,
    loadingUpdate,
    resetForm,
    formData,
  }) => {
    const displayMerged = displayItem({ item: compareData })
    const displayCurrent = displayItem({ item: formData })
    return {
      children: 'Merge Arrests',
      disabled: disabled || loadingUpdate || merging,
      loading: merging,
      onClick: async () => {
        try {
          await confirm({
            title: 'Confirm Merge Arrests',
            content: (
              <DialogContentText component={'div'}>
                Are you sure you want to merge these arrest records?
                <ul>
                  <li>
                    The record for {displayCurrent} will be updated with the
                    values from the left column
                  </li>
                  <li>
                    All logs associated with {displayMerged} will be associated
                    with {displayCurrent}
                  </li>
                  <li>The record for {displayMerged} will be deleted</li>
                </ul>
              </DialogContentText>
            ),
          })
          setMerging(true)
          const { input } = (await prepareUpdate({})) || {}
          if (!input) {
            setMerging(false)
            return
          }
          await mergeArrests({
            variables: {
              id: parseInt(id),
              merge_id: parseInt(compareId),
              input,
            },
            onCompleted: async (result) => {
              openSnackbar(`Arrests merged successfully`)
              setMerging(false)
              await resetForm(result)
              navigate(routes.arrest({ id }))
            },
          })
        } catch (err) {
          console.warn('user cancelled')
          setMerging(false)
        }
      },
    }
  }

  const ignoreDuplicatesButton = ({ disabled, formData }) => {
    const displayMerged = displayItem({ item: compareData })
    const displayCurrent = displayItem({ item: formData })

    return {
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
          await ignoreDuplicates({
            variables: {
              arrest1_id: parseInt(id),
              arrest2_id: parseInt(compareId),
            },
            onCompleted: async () => {
              openSnackbar(
                <span>
                  Arrest pair {displayMerged} and {displayCurrent} marked as not
                  duplicates
                </span>
              )
              if (routeName === 'findDuplicateArrestsCompare') {
                navigate(routes.findDuplicateArrests())
              } else {
                navigate(routes.arrest({ id }))
              }
            },
          })
        } catch (err) {
          console.warn('user cancelled')
        }
      },
    }
  }

  return (
    <ArrestPage
      id={id}
      skipDirtyCheck={true}
      footerProps={{
        disableStats: true,
        disableDelete: true,
        postButtons: [mergeButton, ignoreDuplicatesButton],
      }}
    >
      {(formManagerContext) => (
        <CompareForm
          loading={loading}
          formManagerContext={formManagerContext}
          schema={fieldSchema.arrest}
          // fields={ArrestFields}
          layout={ArrestLayout}
          compareData={compareData}
        />
      )}
    </ArrestPage>
  )
}

export default CompareArrestPage
