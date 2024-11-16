import { Box, Button } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { useConfirm } from 'material-ui-confirm'
import { FormContainer } from 'react-hook-form-mui'

import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'

import { useDisplayError, useSnackbar } from 'src/components/utils/SnackBar'
import { UserFields } from 'src/lib/FieldSchemas'
import { transformData } from 'src/lib/transforms'

import { Field } from '../../utils/Field'
import Footer from '../../utils/Footer'
import FormSection from '../../utils/FormSection'

export const DELETE_USER = gql`
  mutation deleteUser($id: Int!) {
    deleteUser(id: $id) {
      id
    }
  }
`

const UserForm = ({ user, onSave, loading, error }) => {
  const confirm = useConfirm()
  const { openSnackbar } = useSnackbar()
  const displayError = useDisplayError()
  const values = transformData(user || {}, UserFields)

  const [deleteUser] = useMutation(DELETE_USER, {
    onCompleted: () => {
      openSnackbar(`User "${user.name}" deleted`)
      navigate(routes.users())
    },
    onError: (error) => {
      displayError(error)
    },
  })

  const confirmDeleteUser = async () => {
    await confirm({
      title: 'Confirm Delete',
      description: `Are you sure you want to delete the user "${user.name}"?`,
    })
    await deleteUser({ variables: { id: user.id } })
  }

  return (
    <Box>
      <FormContainer
        defaultValues={{
          ...values,
        }}
        onSuccess={(data) => onSave(data, user?.id)}
      >
        <Grid
          sx={{ pb: 8 }}
          container
          spacing={4}
          className="content-container"
        >
          <Grid xs={12} container>
            {UserFields.map(({ fields, title }, groupIndex) => (
              <FormSection key={groupIndex} title={title}>
                <Grid container spacing={2}>
                  {fields.map(([key, options = {}]) => (
                    <Grid xs={options.span || 12} key={key}>
                      <Field name={key} {...options} />
                    </Grid>
                  ))}
                </Grid>
              </FormSection>
            ))}
          </Grid>
        </Grid>
        <Footer>
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
              onClick={() => confirmDeleteUser()}
            >
              Delete User
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              size="small"
            >
              Save User
            </Button>
          </Grid>
        </Footer>
      </FormContainer>
    </Box>
  )
}

export default UserForm
