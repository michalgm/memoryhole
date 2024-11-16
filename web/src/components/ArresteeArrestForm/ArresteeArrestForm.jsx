import { Box, Button, Tooltip, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import dayjs from 'dayjs'
import { startCase } from 'lodash'
import { useConfirm } from 'material-ui-confirm'
import { FormContainer } from 'react-hook-form-mui'

import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'

import ArrestFields from 'src/lib/FieldSchemas'
import { transformData } from 'src/lib/transforms'

import ArresteeLogsDrawer from '../ArresteeLogs/ArresteeLogsDrawer'
import { Field, formatLabel } from '../utils/Field'
import Footer from '../utils/Footer'
import FormSection from '../utils/FormSection'
import { useSnackbar } from '../utils/SnackBar'

// const diffObjects = (a, b) => {
//   return transform(b, (result, value, key) => {
//     if (!isEqual(value, a[key])) {
//       result[key] =
//         isObject(value) && isObject(a[key]) ? diffObjects(a[key], value) : value
//     }
//   })
// }

export const DELETE_ARRESTEE = gql`
  mutation deleteArrestee($id: Int!) {
    deleteArrestee(id: $id) {
      id
    }
  }
`

function fieldsToColumns(fields) {
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
  const confirm = useConfirm()
  const { openSnackbar } = useSnackbar()

  const [deleteArrestee] = useMutation(DELETE_ARRESTEE, {
    onCompleted: () => {
      openSnackbar(`Arrestee "${props.arrest.arrestee.display_field}" deleted`)
      navigate(routes.home())
    },
  })

  const values = transformData(props.arrest, ArrestFields)
  const onSubmit = (data) => {
    console.warn('SAVING', data)
    props.onSave(data, props?.arrest?.id)
  }

  const fields = ArrestFields.map(({ fields, title }, groupIndex) => {
    const { leftColumn, rightColumn, fullSpan } = fieldsToColumns(fields)
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
      {' '}
      {startCase(time)}{' '}
      <Tooltip title={stats[time].format('LLLL')}>
        <b>{stats[time].calendar()}</b>
      </Tooltip>{' '}
      by <b>{props?.arrest[`${time}_by`]?.name}</b>
    </Typography>
  )

  const confirmDeleteArrestee = async () => {
    await confirm({
      title: 'Confirm Delete',
      description: `Are you sure you want to delete the arrestee "${props.arrest.arrestee.display_field}"?`,
    })
    await deleteArrestee({ variables: { id: props.arrest.arrestee.id } })
  }

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
        <Footer>
          <Grid xs>{props.arrest?.id && <ModTime time="created" />}</Grid>
          <Grid xs>{props.arrest?.id && <ModTime time="updated" />}</Grid>
          <Grid
            xs
            sx={{
              textAlign: 'right',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
            }}
          >
            <Button
              variant="outlined"
              color="inherit"
              size="small"
              onClick={() => confirmDeleteArrestee()}
            >
              Delete Arrestee
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              size="small"
            >
              Save Arrestee
            </Button>
          </Grid>
        </Footer>
      </FormContainer>
      {props.arrest?.arrestee?.id && (
        <ArresteeLogsDrawer arrestee_id={props.arrest?.arrestee?.id} />
      )}
    </Box>
  )
}

export default ArresteeArrestForm
