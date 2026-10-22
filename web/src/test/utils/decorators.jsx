import { FormContainer, useWatch } from 'react-hook-form-mui'

const FormDebug = () => {
  const values = useWatch()
  return (
    <pre style={{ marginTop: 16, fontSize: 12, opacity: 0.7 }}>
      {JSON.stringify(values, null, 2)}
    </pre>
  )
}

export const withRHF =
  (defaultValues = {}, { debug = false } = {}) =>
  (Story, { globals }) => {
    return (
      <FormContainer defaultValues={defaultValues}>
        <Story />
        {(globals.showFormValues || debug) && <FormDebug />}
      </FormContainer>
    )
  }
