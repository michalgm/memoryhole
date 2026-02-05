import { useEffect, useRef } from 'react'

import { Add, Sort } from '@mui/icons-material'
import { Typography } from '@mui/material'
import { Grid, Stack } from '@mui/system'
import { startCase } from 'lodash-es'
import { createPortal } from 'react-dom'
import { useFieldArray } from 'react-hook-form'

import { navigate, routes } from '@redwoodjs/router'
import { useQuery } from '@redwoodjs/web'

import { BaseField } from 'src/components/utils/BaseField'
import { BaseForm } from 'src/components/utils/BaseForm'
import Footer from 'src/components/utils/Footer'
import FormSection from 'src/components/utils/FormSection'
import { useApp } from 'src/lib/AppContext'
import OptionSetValuesList from 'src/pages/EditOptionsPage/OptionSetValuesList'

const QUERY_OPTION_SETS = gql`
  query optionSets {
    optionSets: optionSets {
      id
      name
      values {
        id
        label
        value
        is_static
        order
      }
    }
  }
`

const QUERY_OPTION_SET = gql`
  query OptionSetQuery($id: Int!) {
    optionSet: optionSet(id: $id) {
      id
      name
      values {
        id
        label
        value
        is_static
        order
      }
    }
  }
`

const UPDATE_OPTION_SET_MUTATION = gql`
  mutation UpdateOptionSetValues($id: Int!, $input: UpdateOptionSetInput!) {
    updateOptionSetValues(id: $id, input: $input) {
      id
      name
      values {
        id
        label
        value
        is_static
        order
      }
    }
  }
`

const EditOptionsPage = ({ id }) => {
  const { data: setsData, loading: setsLoading } = useQuery(QUERY_OPTION_SETS)
  const { setPageTitle } = useApp()
  const optionSets = setsData?.optionSets || []
  const bottomRef = useRef(null)
  const selectTarget = document.getElementById('modal_layout_header_actions')

  const handleChange = (selectedId) => {
    if (selectedId) {
      navigate(routes['editOptionSet']({ id: selectedId }))
    }
  }
  const selectedSetName = startCase(
    optionSets.find((s) => s.id === parseInt(id))?.name || ''
  )

  useEffect(() => {
    if (selectedSetName) {
      setPageTitle({
        editOptionSet: `'${selectedSetName}' Options`,
      })
    }
  }, [selectedSetName, setPageTitle])

  const options = optionSets.map((set) => ({
    id: set.id,
    label: startCase(set.name),
  }))
  const selectedValue = options.find((set) => set.id === parseInt(id)) || null

  const transformInput = (input, { getValues }) => {
    const valuesList = Object.keys(input.values || {}).map((idx) => {
      const v = input.values[idx]
      const base = getValues(`values.${idx}`) || {}
      return {
        ...base,
        ...v,
        id: v.id ?? base.id,
        order: Number(idx),
        fieldId: undefined,
      }
    })
    return { values: valuesList }
  }

  if (setsLoading) {
    return <div>Loading...</div>
  }

  // useFieldArray must be called at the top level inside a component using useForm context
  // We'll move useFieldArray into a child component to avoid conditional hook calls
  const OptionSetForm = ({ formManagerContext }) => {
    const { hasDirtyFields } = formManagerContext
    const fieldArray = useFieldArray({
      name: 'values',
      keyName: 'fieldId',
    })
    const { fields, remove, move, update, append } = fieldArray

    const addValue = () => {
      append({
        label: '',
        value: '',
        is_static: false,
      })
      if (bottomRef.current?.scrollIntoView) {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      }
    }
    const sortOptions = () => {
      const sortedFields = [...fields].sort((a, b) =>
        (a.value || '').localeCompare(b.value || '')
      )
      // Update the order in the form state
      sortedFields.forEach((field, idx) => {
        update(idx, { ...field, order: idx })
      })
    }
    return (
      <>
        <FormSection
          title={`${selectedSetName} Options`}
          sectionActions={[
            {
              label: 'Add Value',
              icon: Add,
              onClick: addValue,
            },
            {
              label: 'Sort Values',
              icon: Sort,
              onClick: sortOptions,
              tooltip: 'Sort options alphabetically by value',
            },
          ]}
        >
          <Grid size={12}>
            <Typography variant="body1">
              Drag and drop to reorder options.
            </Typography>
          </Grid>
          <OptionSetValuesList
            fields={fields}
            remove={remove}
            move={move}
            update={update}
          />
        </FormSection>
        <div ref={bottomRef}></div>
        <Footer
          {...{
            formManagerContext,
            allowSave: hasDirtyFields,
            label: `${selectedSetName} Options`,
          }}
        />
      </>
    )
  }

  return (
    <>
      <Stack spacing={3} sx={{ mb: 3 }}>
        {id && selectedValue && (
          <BaseForm
            formConfig={{
              id,
              modelType: 'OptionSet',
              skipUpdatedCheck: true,
              fetchQuery: QUERY_OPTION_SET,
              fetchQueryVariables: { id: parseInt(id) },
              updateMutation: UPDATE_OPTION_SET_MUTATION,
              transformInput,
            }}
          >
            {(formManagerContext) => (
              <OptionSetForm formManagerContext={formManagerContext} />
            )}
          </BaseForm>
        )}
      </Stack>
      {selectTarget &&
        createPortal(
          <BaseField
            sx={{ width: 250 }}
            field_type="select"
            name="optionSet"
            label="Select Option Set"
            options={options}
            value={selectedValue}
            onChange={handleChange}
            transformOptions={(opts) => opts}
            size="x-small"
            textFieldProps={{
              sx: { backgroundColor: 'background.paper', px: 1 },
              variant: 'standard',
              size: 'x-small',
            }}
          />,
          selectTarget
        )}
    </>
  )
}

export default EditOptionsPage
