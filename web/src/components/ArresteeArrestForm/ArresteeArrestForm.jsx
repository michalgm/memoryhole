import { Button, Divider, Tooltip, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import dayjs from 'dayjs'
import {
  _,
  flatMap,
  get,
  isEqual,
  isObject,
  reduce,
  set,
  startCase,
  transform,
} from 'lodash'
import { FormContainer } from 'react-hook-form-mui'

import ArrestFields from 'src/lib/ArrestFields'

import ArresteeLogsCell from '../ArresteeLogsCell/ArresteeLogsCell'
import CreateArresteeLog from '../ArresteeLogsCell/CreateArresteeLog'
import { Field } from '../utils/Field'

const diffObjects = (a, b) => {
  return transform(b, (result, value, key) => {
    if (!isEqual(value, a[key])) {
      result[key] =
        isObject(value) && isObject(a[key]) ? diffObjects(a[key], value) : value
    }
  })
}

const pruneData = (data, fields) => {
  const fieldPaths = flatMap(fields, (section) =>
    section.fields.map((field) => [field[0], field[1]])
  )
  const buildNewObject = (paths, originalData) =>
    reduce(
      paths,
      (result, [path, params = {}]) => {
        let value = get(originalData, path)
        if (value !== undefined) {
          if (['date', 'date-time'].includes(params.field_type)) {
            value = dayjs(value)
          }
          set(result, path, value)
        }
        return result
      },
      {}
    )

  return buildNewObject(fieldPaths, data)
}

function reorderFieldsLodash(fields) {
  const midPoint = Math.ceil(fields.length / 2)
  fields = fields.map(([name, props = {}], index) => [name, props, index])
  const chunks = _.chunk(fields, midPoint)
  const interleaved = _.zip(...chunks)
  const reorderedFields = _.compact(_.flatten(interleaved))
  return reorderedFields
}

const ArresteeArrestForm = (props) => {
  const values = pruneData(props.arrest, ArrestFields)
  const onSubmit = (data) => {
    // const diff = diffObjects(props.arrest, data)
    // console.log(data)
    console.warn('SAVING', data)
    props.onSave(data, props?.arrest?.id)
  }

  const formatLabel = (label) => {
    const index = label.lastIndexOf('.')
    return startCase(label.slice(index + 1))
  }

  const fields = ArrestFields.map(({ fields, title }, groupIndex) => {
    return (
      <Grid
        xs={12}
        spacing={2}
        key={groupIndex}
        container
        alignItems={'center'}
      >
        {title && (
          <Grid xs={12}>
            <Divider
              textAlign="left"
              sx={{ styleOverrides: { 'MuiDivider-root': { width: 5 } } }}
            >
              {title && (
                <Typography variant="h6" gutterBottom>
                  {title}
                </Typography>
              )}
            </Divider>
          </Grid>
        )}
        {reorderFieldsLodash(fields).map(
          ([key, { label, ...options } = {}, index] = []) => {
            return (
              <Grid key={key} xs={6}>
                <Field
                  tabIndex={100 * (groupIndex + 1) + index}
                  key={key}
                  id={key}
                  label={formatLabel(label || key)}
                  name={key}
                  {...options}
                />
              </Grid>
            )
          }
        )}
      </Grid>
    )
  })
  //  console.log(reorderFieldsLodash(fields)) ||
  const stats = {
    created: dayjs(props?.arrest?.created_at),
    updated: dayjs(props?.arrest?.updated_at),
  }

  const ModTime = ({ time }) => (
    <Typography variant="overline">
      {startCase(time)}&nbsp;
      <Tooltip title={stats[time].format('LLLL')}>
        <b>{stats[time].calendar()}</b>
      </Tooltip>
      &nbsp;by&nbsp;
      <b>{props?.arrest[`${time}_by`]?.name}</b>
    </Typography>
  )

  return (
    <>
      <FormContainer
        defaultValues={values}
        onSuccess={(data) => onSubmit(data)}
      >
        <Grid container spacing={4} className="content-container">
          <Grid xs={12} sx={{ textAlign: 'right', clear: 'both' }}>
            <Button type="submit" variant="contained">
              Save
            </Button>
          </Grid>
          <Grid xs={12} container className="form-content">
            {fields}
          </Grid>
          {props.arrest?.id && (
            <>
              <Grid xs={6}>
                <ModTime time="created" />
              </Grid>
              <Grid xs={6}>
                <ModTime time="updated" />
              </Grid>
            </>
          )}
        </Grid>
      </FormContainer>
      {props.arrest?.id && (
        <>
          <CreateArresteeLog arrestee_id={props.arrest.arrestee.id} />
          <ArresteeLogsCell arrestee_id={props.arrest.arrestee.id} />
        </>
      )}
    </>
  )
}

export default ArresteeArrestForm
