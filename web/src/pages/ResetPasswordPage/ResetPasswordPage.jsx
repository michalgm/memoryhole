import { useEffect } from 'react'

import { TextFieldElement } from 'react-hook-form-mui'

import { navigate, routes } from '@redwoodjs/router'

import { useAuth } from 'src/auth'
import { useDisplayError } from 'src/components/utils/SnackBar'

import { AuthManage } from '../LoginPage/LoginPage'

const ResetPasswordPage = ({ resetToken }) => {
  const { reauthenticate, validateResetToken, resetPassword } = useAuth()
  const displayError = useDisplayError()

  useEffect(() => {
    const validateToken = async () => {
      const response = await validateResetToken(resetToken)
      if (response.error) {
        displayError(response.error)
      }
    }
    validateToken()
  }, [resetToken, validateResetToken, displayError])

  const action = (data) =>
    resetPassword({
      resetToken,
      password: data.password,
    })

  return (
    <>
      <AuthManage
        title="Reset Password"
        action={action}
        onSuccess={async ({ response, openSnackbar }) => {
          openSnackbar('Password changed!')
          try {
            await reauthenticate()
          } catch (e) {
            displayError(e)
          }
          navigate(routes.login())
        }}
      >
        <TextFieldElement
          fullWidth
          sx={{ pb: 2 }}
          id="password"
          name="password"
          label="New Password"
          type="password"
          autoComplete="new-password"
          validation={{
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters',
            },
          }}
        />
      </AuthManage>
    </>
  )
}

export default ResetPasswordPage
