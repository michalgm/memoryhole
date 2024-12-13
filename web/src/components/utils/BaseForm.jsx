import { FormContainer } from 'react-hook-form-mui'

import { useFormManager } from 'src/hooks/useFormManager'

import { FormStateHandler } from './FormStateHandler'

export const BaseForm = ({
  children,
  autoComplete = 'off',
  formConfig,
  loadingElement,
}) => {
  const formManager = useFormManager(formConfig)
  const { formContext, onSave, blocker } = formManager
  const { isLoading } = formContext.formState

  if (isLoading) {
    return loadingElement || null
  }
  return (
    <FormContainer
      onSuccess={onSave}
      FormProps={{ autoComplete }}
      formContext={formContext}
    >
      <FormStateHandler blocker={blocker} />
      {typeof children === 'function' ? children(formManager) : children}
    </FormContainer>
  )
}
