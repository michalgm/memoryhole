import { useEffect, useState } from 'react'

import { useConfirm } from 'material-ui-confirm'
import { FormContainer } from 'react-hook-form-mui'

import { useFormManager } from 'src/hooks/useFormManager'

const FormStateHandler = ({ blocker }) => {
  const confirm = useConfirm()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    const handleNav = async () => {
      if (isDialogOpen) return

      setIsDialogOpen(true)
      try {
        await confirm({
          title:
            'You have unsaved changes. Are you sure you want to leave this page? Changes you made will be lost if you navigate away.',
        })
        blocker.confirm()
      } catch (e) {
        blocker.abort()
      } finally {
        setIsDialogOpen(false)
      }
    }
    if (blocker.state === 'BLOCKED') {
      handleNav()
    }
  }, [blocker, confirm, isDialogOpen])
  return null
}

export const BaseForm = ({ children, autoComplete = 'off', formConfig }) => {
  const formManager = useFormManager(formConfig)
  const { formContext, onSave, blocker } = formManager

  return (
    <FormContainer
      onSuccess={onSave}
      FormProps={{ autoComplete }}
      formContext={formContext}
      disabled={true}
    >
      <FormStateHandler blocker={blocker} />
      {typeof children === 'function' ? children(formManager) : children}
    </FormContainer>
  )
}
