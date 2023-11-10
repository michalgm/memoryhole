import { Box, Button, Tooltip, Typography } from '@mui/material'
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

import ArresteeLogsDrawer from '../ArresteeLogs/ArresteeLogsDrawer'
import { Field, formatLabel } from '../utils/Field'
import FormSection from '../utils/FormSection'

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
        if (value === undefined && params.default) {
          value = params.default
        }
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

  const midPoint = Math.ceil(nonFullSpan.length / 2)
  const leftColumn = nonFullSpan.slice(0, midPoint)
  const rightColumn = nonFullSpan.slice(midPoint)

  return { leftColumn, rightColumn, fullSpan }
}

const ArresteeArrestForm = (props) => {
  const values = pruneData(props.arrest, ArrestFields)
  const onSubmit = (data) => {
    console.warn('SAVING', data)
    props.onSave(data, props?.arrest?.id)
  }

  const fields = ArrestFields.map(({ fields, title }, groupIndex) => {
    const { leftColumn, rightColumn, fullSpan } = reorderFieldsLodash(fields)
    return (
      <FormSection key={groupIndex} title={title}>
        <Grid container sx={{ alignItems: 'start' }} xs={12}>
          {[leftColumn, rightColumn, fullSpan].map(
            (fieldSet, fieldSetIndex) => {
              return (
                <Grid
                  key={fieldSetIndex}
                  xs={fieldSetIndex == 2 ? 12 : 6}
                  container
                >
                  {fieldSet.map(
                    ([key, { label, ...options } = {}, index] = []) => {
                      return (
                        <Grid key={key || index} xs={12}>
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
            }
          )}
        </Grid>
      </FormSection>
    )
  })
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
    <Box>
      <FormContainer
        defaultValues={values}
        onSuccess={(data) => onSubmit(data)}
      >
        <Grid
          sx={{ pb: 8 }}
          container
          spacing={4}
          className="content-container"
        >
          <Grid xs={12} container>
            {fields}
          </Grid>
        </Grid>
        <Grid
          container
          spacing={2}
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            bgcolor: 'primary.main',
            color: 'white',
            zIndex: 10,
            p: 2,
          }}
          xs={12}
        >
          <Grid xs>{props.arrest?.id && <ModTime time="created" />}</Grid>
          <Grid xs>{props.arrest?.id && <ModTime time="updated" />}</Grid>
          <Grid xs sx={{ textAlign: 'right' }}>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              size="small"
            >
              Save Arrestee
            </Button>
          </Grid>
        </Grid>
      </FormContainer>
      {props.arrest?.arrestee?.id && (
        <ArresteeLogsDrawer arrestee_id={props.arrest?.arrestee?.id} />
      )}
    </Box>
  )
}

export default ArresteeArrestForm
