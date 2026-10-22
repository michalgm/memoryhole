import { Button, Grid } from '@mui/material'
import { FormContainer } from 'react-hook-form-mui'

const Form = ({
  defaultValues,
  onSubmit,
  onCancel,
  children,
  loading,
  submitText = 'Save',
}) => {
  return (
    <FormContainer
      defaultValues={defaultValues}
      onSuccess={(data) => onSubmit(data)}
    >
      <Grid container spacing={2}>
        {children}
        <Grid sx={{ textAlign: 'right' }} size={12}>
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
