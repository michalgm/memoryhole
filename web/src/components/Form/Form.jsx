import { Button } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { FormContainer } from 'react-hook-form-mui'

const Form = ({
  defaultValues,
  onSubmit,
  onCancel,
  children,
  loading,

  submitText = 'Save',
  error,
}) => {
  return (
    <FormContainer
      defaultValues={defaultValues}
      onSuccess={(data) => onSubmit(data)}
    >
      <Grid container spacing={2}>
        {children}
        <Grid sx={{ textAlign: 'right' }} xs={12}>
          {onCancel && (
            <Button disabled={loading} onClick={() => onCancel()}>
              Cancel
            </Button>
          )}
          <Button
            disabled={loading}
            type="submit"
            variant="contained"
            color="secondary"
          >
            {submitText}
          </Button>
        </Grid>
      </Grid>
    </FormContainer>
  )
}

export default Form
