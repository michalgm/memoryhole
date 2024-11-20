import { TextFieldElement } from 'react-hook-form-mui'

import { useAuth } from 'src/auth'

import { AuthManage } from '../LoginPage/LoginPage'

const ForgotPasswordPage = () => {
  const { forgotPassword } = useAuth()
  const action = (data) => forgotPassword(data.email)

  return (
    <AuthManage
      title="Forgot Password"
      action={action}
      onSuccess={({ response, openSnackbar }) => {
        return openSnackbar(
          `A link to reset your password was sent to ${response.email}`,
          'success',
          null
        )
      }}
    >
      <TextFieldElement
        fullWidth
        name="email"
        label="Email"
        id="email"
        autoComplete="username"
        autoFocus // eslint-disable-line jsx-a11y/no-autofocus
        validation={{
          required: 'Email is required',
          validate: (value) =>
            !value ||
            /^[^@\s]+@[^.\s]+\.[^\s]+$/.test(value) ||
            'Email must be formatted like an email',
        }}
      />
    </AuthManage>
  )
}

export default ForgotPasswordPage
