import { useEffect, useState } from 'react'

import { Add, KeyboardDoubleArrowLeft, Replay, Sync } from '@mui/icons-material'
import {
  Button,
  Divider,
  FormControlLabel,
  Grid2,
  IconButton,
  Paper,
  Switch,
  Tooltip,
  Typography,
} from '@mui/material'
import { Stack } from '@mui/system'
import { get, isEqual, isObject } from 'lodash-es'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'

import { Link, routes, useParams } from '@redwoodjs/router'

import CompositeIcon from 'src/components/utils/CompositeIcon'
import { Field } from 'src/components/utils/Field'
import { ModInfo } from 'src/components/utils/Footer'
import FormSection from 'src/components/utils/FormSection'
import TextLink from 'src/components/utils/Link'
import Show from 'src/components/utils/Show'
import dayjs from 'src/lib/dayjs'
import { transformData } from 'src/lib/transforms'

const compareObjects = (obj1, obj2, path = '', diffs = new Set()) => {
  if (!isObject(obj1) || !isObject(obj2)) {
    if (!isEqual(obj1, obj2)) {
      diffs.add(path)
    }
    return diffs
  }

  const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)])

  allKeys.forEach((key) => {
    const currentPath = path ? `${path}.${key}` : key
    const value1 = obj1[key]
    const value2 = obj2[key]

    if (dayjs.isDayjs(value1) || dayjs.isDayjs(value2)) {
      if (!value1 || !value1?.isSame(value2)) {
        diffs.add(currentPath)
      }
    } else if (isObject(value1) || isObject(value2)) {
      diffs = compareObjects(value1, value2, currentPath, diffs)
    } else if (!isEqual(value1, value2)) {
      diffs.add(currentPath)
    }
  })
  return diffs
}

const CompareFormSection = ({
  showOnlyDiffs,
  fields: sectionFields,
  schema,
  groupIndex,
  title,
  sectionActions,
  compareFormMethods,
  diffFields,
}) => {
  const fields = sectionFields.map((name, index) => {
    const props = schema[name]
    return [name, props, index]
  })
  if (showOnlyDiffs && !fields.some(([name]) => diffFields.has(name))) {
    return null
  }
  return (
    <FormSection key={groupIndex} title={title} sectionActions={sectionActions}>
      <Grid2 container sx={{ alignItems: 'start' }} size={12}>
        {fields.map(([key, options = {}], index) => (
          <Show when={!showOnlyDiffs || diffFields.has(key)} key={key}>
            <CompareField
              name={key}
              options={options}
              index={index}
              groupIndex={groupIndex}
              hasDiff={diffFields.has(key)}
              compareFormMethods={compareFormMethods}
            />
          </Show>
        ))}
      </Grid2>
    </FormSection>
  )
}

function DataCard({ title, subtitle, data, stats, route, id }) {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h5">
        <TextLink to={routes[route]({ id })} target="_blank">
          {title}
        </TextLink>
      </Typography>
      <Typography color="GrayText" variant="subtitle2">
        {subtitle}
      </Typography>
      <Divider sx={{ my: 1 }} />
      <ModInfo
        stats={stats}
        formData={data}
        sx={{ flexWrap: 'wrap' }}
        useFlexGap
      />
    </Paper>
  )
}

const CompareForm = ({
  compareData: inputData,
  fields,
  schema,
  loading,
  formManagerContext,
}) => {
  const [showOnlyDiffs, setShowOnlyDiffs] = useState(true)
  const [diffFields, setDiffFields] = useState(new Set())
  const [compareStats, setCompareStats] = useState({})
  const {
    stats,
    formData,
    formState: { defaultValues },
    formContext: { setValue, getValues },
  } = formManagerContext

  const { id, compareId } = useParams()
  const compareFormMethods = useForm({})

  const mergeBlankValues = () => {
    for (const key of diffFields) {
      const compareValue = compareFormMethods.getValues(key)
      const prevValue = getValues(key)
      if (compareValue !== null && prevValue == null) {
        setValue(key, compareValue, {
          shouldValidate: true,
          shouldDirty: true,
        })
      }
    }
  }

  useEffect(() => {
    if (inputData) {
      const compareData = transformData(inputData, schema)
      compareFormMethods.reset(compareData)
      const diffs = compareObjects(defaultValues, compareData)
      setDiffFields(diffs)
      setCompareStats({
        created: dayjs(inputData?.created_at),
        updated: dayjs(inputData?.updated_at),
        date: dayjs(inputData?.date),
      })
    }
  }, [inputData, schema, defaultValues, compareFormMethods])

  if (loading) {
    return null
  }

  const layout = fields.map((section) => ({
    ...section,
    fields: section.fields.map(([name]) => name),
  }))

  const sections = layout.map((section, groupIndex) => {
    return (
      <CompareFormSection
        key={groupIndex}
        showOnlyDiffs={showOnlyDiffs}
        schema={schema}
        groupIndex={groupIndex}
        diffFields={diffFields}
        compareFormMethods={compareFormMethods}
        {...section}
      />
    )
  })

  return (
    <>
      <Stack direction="column" spacing={2}>
        <Paper sx={{ p: 2 }}>
          Compare the current record in the left column with the record values
          in the right column. Use the
          <IconButton variant="outlined">
            <KeyboardDoubleArrowLeft />
          </IconButton>
          button to replace values in the left column with those from the right.
          For multi-line text fields, the value will be appended.
          <br />
          <FormControlLabel
            control={
              <Switch
                checked={showOnlyDiffs}
                onChange={(e) => setShowOnlyDiffs(e.target.checked)}
              />
            }
            label="Only show fields with differences"
          />
          <Tooltip title="Update all empty values in the left column with non-empty values from the right column">
            <span>
              <Button
                variant="outlined"
                onClick={mergeBlankValues}
                disabled={diffFields.size === 0}
              >
                Merge Blank Values
              </Button>
            </span>
          </Tooltip>
        </Paper>
        <Stack
          direction={'row'}
          spacing={2}
          alignItems="center"
          sx={{ justifyContent: 'space-between' }}
        >
          <DataCard
            title={formData?.arrestee?.search_display_field}
            subtitle={`${defaultValues?.date?.tz().format('L LT')} - ${defaultValues.arrest_city}`}
            data={formData}
            stats={stats}
            route="arrest"
            id={id}
          />
          <Tooltip title="Swap comparison">
            <Link to={`/arrests/${inputData?.id}/compare/${formData?.id}`}>
              <Button variant="outlined" size="small">
                <Sync />
              </Button>
            </Link>
          </Tooltip>
          <DataCard
            title={inputData?.arrestee?.search_display_field}
            subtitle={`${compareStats?.date ? compareStats.date.tz().format('L LT') : ''} - ${inputData?.arrest_city}`}
            data={inputData}
            stats={compareStats}
            route="arrest"
            id={compareId}
          />
        </Stack>
      </Stack>
      {sections}
    </>
  )
}

const CompareField = ({
  name,
  options,
  index,
  groupIndex,
  hasDiff,
  compareFormMethods,
}) => {
  const { setValue, resetField, formState, getValues } = useFormContext() // Get form context from parent
  const isDirty = get(formState.dirtyFields, name)
  const append = options.field_type === 'textarea'

  const handleCopyRight = () => {
    const compareValue = compareFormMethods.getValues(name)
    const prevValue = getValues(name)
    const updatedValue =
      append && prevValue ? `${prevValue}\n${compareValue || ''}` : compareValue

    setValue(name, updatedValue, {
      shouldValidate: true,
      shouldDirty: true,
    })
  }

  const tooltip = append
    ? 'Append value from right column to current value'
    : 'Replace current value with value from right column'
  return (
    <Grid2 container size={12} alignItems={'center'} spacing={2}>
      <Grid2 size="grow">
        <Field
          tabIndex={100 * (groupIndex + 1) + index}
          highlightDirty={true}
          name={name}
          {...options}
          color={hasDiff ? 'info' : null}
        />
      </Grid2>
      <Grid2>
        {isDirty ? (
          <Tooltip title="Restore current value">
            <span>
              <Button
                variant="outlined"
                onClick={() => resetField(name)}
                disabled={!hasDiff}
              >
                <Replay />
              </Button>
            </span>
          </Tooltip>
        ) : (
          <Tooltip title={tooltip}>
            <Button variant="outlined" onClick={handleCopyRight}>
              {append ? (
                <CompositeIcon
                  baseIcon={KeyboardDoubleArrowLeft}
                  overlayIcon={Add}
                />
              ) : (
                <KeyboardDoubleArrowLeft />
              )}
            </Button>
          </Tooltip>
        )}
      </Grid2>
      <Grid2 size="grow">
        <FormProvider {...compareFormMethods}>
          <Field name={name} disabled={true} {...options} />
        </FormProvider>
      </Grid2>
    </Grid2>
  )
}

export default CompareForm
