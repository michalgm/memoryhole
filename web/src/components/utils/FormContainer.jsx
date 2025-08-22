import { Box, Grid2, Stack } from '@mui/material'
import { get } from 'lodash-es'

import Loading from 'src/components/Loading/Loading'
import { useContainerWidth } from 'src/lib/AppContext'
import { fieldSchema } from 'src/lib/FieldSchemas'

import { BaseForm } from './BaseForm'
import { Field } from './Field'
import Footer from './Footer'
import FormSection from './FormSection'

export function fieldsToColumns(fields, schema, columnCount = 2) {
  const { fullSpan, nonFullSpan } = fields.reduce(
    (acc, name, index) => {
      const props = schema[name]
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

export const FormContainerSectionFields = ({
  highlightDirty,
  fieldProps,
  fields,
  baseIndex,
}) => {
  return fields.map(([name, options = {}], index) => (
    <Grid2 size={12} key={name}>
      <Field
        tabIndex={baseIndex + index}
        name={name}
        highlightDirty={highlightDirty}
        {...options}
        {...(fieldProps[name] || {})}
      />
    </Grid2>
  ))
}

const FormContainerFieldsLayout = ({
  layout,
  schema,
  columnCount,
  highlightDirty,
  fieldProps,
}) => {
  const sections = layout.map(
    ({ fields: sectionFields, title, sectionActions }, groupIndex) => {
      const { columns, fullSpan } = fieldsToColumns(
        sectionFields,
        schema,
        columnCount
      )

      return (
        <FormSection
          key={groupIndex}
          title={title}
          sectionActions={sectionActions}
        >
          <Grid2 container sx={{ alignItems: 'start' }} size={12}>
            {columns.map((fieldSet, columnIndex) => (
              <Grid2 key={columnIndex} container size={12 / columnCount}>
                <FormContainerSectionFields
                  highlightDirty={highlightDirty}
                  fieldProps={fieldProps}
                  fields={fieldSet}
                  baseIndex={100 * (groupIndex + 1)}
                />
              </Grid2>
            ))}
            <Grid2 container size={12}>
              <FormContainerSectionFields
                highlightDirty={highlightDirty}
                fieldProps={fieldProps}
                fields={fullSpan}
                baseIndex={100 * (groupIndex + 1) + columns.length}
              />
            </Grid2>
          </Grid2>
        </FormSection>
      )
    }
  )

  return <>{sections}</>
}

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
  layout,
  deleteOptions = {},
  fieldProps = {},
  footerProps = {},
  children,
}) => {
  const smallLayout = useContainerWidth(860)
  const schema = get(fieldSchema, displayConfig?.type?.toLowerCase(), {})

  if (!layout) {
    layout = fields.map((section) => ({
      ...section,
      fields: section.fields.map(([name]) => name),
    }))
  }

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
      {(formManagerContext) => {
        const {
          isLoading,
          confirmDelete,
          formData,
          stats,
          hasDirtyFields,
          loading: { loadingDelete, loadingCreate, loadingUpdate },
        } = formManagerContext
        const disabled = isLoading

        return (
          <Box sx={{ position: 'relative', width: '100%', pb: 3 }}>
            <Stack spacing={4} sx={{ pb: 2 }} className="content-container">
              {children ? (
                typeof children === 'function' ? (
                  children(formManagerContext)
                ) : (
                  children
                )
              ) : (
                <FormContainerFieldsLayout
                  layout={layout}
                  schema={schema}
                  columnCount={columnCount}
                  highlightDirty={highlightDirty}
                  fieldProps={fieldProps}
                />
              )}
            </Stack>
            <Footer
              {...{
                id,
                formData,
                smallLayout,
                stats,
                deleteMutation,
                disabled,
                confirmDelete,
                loadingUpdate,
                loadingCreate,
                loadingDelete,
                deleteOptions,
                allowSave: hasDirtyFields,
                label: displayConfig?.type,
                ...footerProps,
              }}
            ></Footer>
          </Box>
        )
      }}
    </BaseForm>
  )
}

export default FormContainer
