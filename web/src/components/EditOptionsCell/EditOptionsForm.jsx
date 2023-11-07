import { CheckBox } from '@mui/icons-material'
import { Button, FormControlLabel, Radio, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { useConfirm } from 'material-ui-confirm'
import { FormContainer, RadioButtonGroup, useForm } from 'react-hook-form-mui'

import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'

import { QUERY } from '../OptionSetValuesCell/OptionSetValuesCell'
import { Field } from '../utils/Field'
import { useSnackbar } from '../utils/SnackBar'

import { QUERY as QUERYLIST } from './EditOptionsCell'

export const UPDATE_OPTION_SET_MUTATION = gql`
  mutation ReplaceOptionSetValuesQuery(
    $id: Int!
    $input: UpdateOptionSetInput!
  ) {
    updateOptionSet(id: $id, input: $input) {
      id
    }
  }
`
export const CREATE_OPTION_SET = gql`
  mutation createOptionSet($input: CreateOptionSetInput!) {
    createOptionSet(input: $input) {
      id
      name
    }
  }
`

export const DELETE_OPTION_SET = gql`
  mutation deleteOptionSet($id: Int!) {
    deleteOptionSet(id: $id) {
      id
    }
  }
`

const EditOptionsForm = ({ optionsSet = {} }) => {
  const { id, name, values = [] } = optionsSet
  const { openSnackbar } = useSnackbar()
  const formContext = useForm()
  const { reset } = formContext
  const valuesString = values.map(({ value }) => value).join('\n')
  const confirm = useConfirm()

  const handleMutation = (message, action) => {
    return {
      onCompleted: (res) => {
        openSnackbar(message)
        reset({})
        if (action) {
          return action(res)
        }
      },
      refetchQueries: [
        { query: QUERY, variables: { id } },
        { query: QUERYLIST },
      ],
      awaitRefetchQueries: true,
      onError: (error) => {
        openSnackbar(error.message, 'error')
      },
    }
  }

  const [updateOptionSet] = useMutation(
    UPDATE_OPTION_SET_MUTATION,
    handleMutation('Option set updated')
  )

  const [deleteOptionSet] = useMutation(
    DELETE_OPTION_SET,
    handleMutation('Option set deleted', () =>
      navigate(routes['editOptions']())
    )
  )

  const [createOptionSet] = useMutation(
    CREATE_OPTION_SET,
    handleMutation('Option set created', ({ createOptionSet: { id } }) => {
      navigate(routes['editOptionSet']({ id }))
    })
  )

  const deleteSet = async () => {
    return confirm({
      description: `Are you sure you want to delete the option set '${name}'?`,
    })
      .then(() => {
        return deleteOptionSet({ variables: { id } })
      })
      .catch(() => {})
  }

  const handleReplaceOptionSetValues = ({ name, values, sortType }) => {
    const valuesList = values
      .split('\n')
      .reduce((acc, item) => {
        const value = item.trim()
        if (value) {
          acc.push({
            option_set_id: id,
            label: value,
            value,
          })
        }
        return acc
      }, [])
      .sort((a, b) =>
        sortType === 'sort' ? a.value.localeCompare(b.value) : 0
      )
    console.log(valuesList)
    if (id) {
      return updateOptionSet({
        variables: {
          id,
          input: { name, values: valuesList },
        },
      })
    } else {
      return createOptionSet({
        variables: {
          input: { name, values: valuesList },
        },
      })
    }
  }

  return (
    <FormContainer
      key={valuesString}
      defaultValues={{ name, values: valuesString, sortType: 'preserve' }}
      onSuccess={handleReplaceOptionSetValues}
    >
      <Grid container spacing={4}>
        <Typography variant="h5">Edit {name}</Typography>
        <Grid xs={12}>
          <Field name="name" />
        </Grid>
        <Grid xs={12}>
          <Field
            row
            field_type="radio"
            label="Sort options?"
            name="sortType"
            options={[
              { id: 'sort', label: 'Sort alphabetically' },
              { id: 'preserve', label: 'Use current order' },
            ]}
          />
        </Grid>
        <Grid xs={12}>
          <Field
            maxRows={20}
            // sx={{ maxHeight: 300, overflowY: 'auto' }}
            // InputProps={{ sx: { maxHeight: 300, overflowY: 'auto' } }}
            name="values"
            field_type="textarea"
            helperText="One option value per line"
          />
        </Grid>
        <Grid xs={12}>
          <Grid container spacing={2}>
            <Grid>
              <Button type="submit" variant="contained">
                Save
              </Button>
            </Grid>
            <Grid>
              <Button color="error" variant="outlined" onClick={deleteSet}>
                Delete
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </FormContainer>
  )
}

export default EditOptionsForm
