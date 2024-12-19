import { Button, Grid2 } from '@mui/material'
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
      <Grid2 container spacing={2}>
        {children}
        <Grid2 sx={{ textAlign: 'right' }} size={12}>
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
        </Grid2>
      </Grid2>
    </FormContainer>
  )
}

export default Form
