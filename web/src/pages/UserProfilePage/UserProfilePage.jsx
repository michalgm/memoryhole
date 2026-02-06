import { Grid2 } from '@mui/material'
import { Stack } from '@mui/system'

import { gql } from '@cedarjs/web'

import { useAuth } from 'src/auth'
import { BaseForm } from 'src/components/utils/BaseForm'
import { Field } from 'src/components/utils/Field'
import FormSection from 'src/components/utils/FormSection'

const UPDATE_USER_PROFILE_MUTATION = gql`
  mutation UpdateUserProfile($id: Int!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      name
    }
  }
`

const CHANGE_PASSWORD_MUTATION = gql`
  mutation ChangePassword($input: ChangePasswordInput!) {
    changePassword(input: $input) {
      success
    }
  }
`

const UserProfilePage = () => {
  const { currentUser } = useAuth()

  if (!currentUser) {
    return null
  }

  return (
    <Stack direction="column" spacing={2}>
      <BaseForm
        formConfig={{
          id: currentUser.id,
          modelType: 'User Profile',
          namePath: 'name',
          displayText: () => currentUser.name,
          skipUpdatedCheck: true,
          updateMutation: UPDATE_USER_PROFILE_MUTATION,
          defaultValues: {
            name: currentUser.name,
          },
        }}
      >
        {(formManagerContext) => {
          const { formContext, hasDirtyFields, loadingUpdate } =
            formManagerContext
          const {
            formState: { isValid },
          } = formContext

          return (
            <FormSection
              title="Profile Information"
              disableCollapse={true}
              buttons={[
                {
                  children: 'Save Profile',
                  type: 'submit',
                  disabled: hasDirtyFields && !isValid,
                  loading: loadingUpdate,
                },
              ]}
            >
              <Grid2 size={6}>
                <Field
                  name="name"
                  required
                  rules={{
                    required: 'Name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters',
                    },
                  }}
                />
              </Grid2>
            </FormSection>
          )
        }}
      </BaseForm>

      <BaseForm
        formConfig={{
          id: currentUser.id,
          modelType: 'User Password',
          namePath: 'name',
          skipUpdatedCheck: true,
          displayText: () => currentUser.name,
          updateMutation: CHANGE_PASSWORD_MUTATION,
          defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          },
          transformInput: ({ currentPassword, newPassword }) => {
            return { currentPassword, newPassword }
          },
        }}
      >
        {(formManagerContext) => {
          const { formContext, hasDirtyFields, loadingUpdate } =
            formManagerContext
          const {
            getValues,
            formState: { isValid },
          } = formContext

          return (
            <FormSection
              title="Change Password"
              disableCollapse={true}
              buttons={[
                {
                  children: 'Change Password',
                  loading: loadingUpdate,
                  type: 'submit',
                  disabled: hasDirtyFields && !isValid,
                },
              ]}
            >
              <Grid2 size={12}>
                <Field
                  name="currentPassword"
                  label="Current Password"
                  type="password"
                  autoComplete="current-password"
                  rules={{
                    required: 'Current password is required',
                  }}
                />
              </Grid2>
              <Grid2 size={6}>
                <Field
                  name="newPassword"
                  label="New Password"
                  type="password"
                  autoComplete="new-password"
                  rules={{
                    required: 'New password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters',
                    },
                  }}
                />
              </Grid2>
              <Grid2 size={6}>
                <Field
                  name="confirmPassword"
                  label="Confirm New Password"
                  type="password"
                  autoComplete="new-password"
                  rules={{
                    required: 'Please confirm your new password',
                    validate: (value) => {
                      const newPassword = getValues('newPassword')
                      return value === newPassword || 'Passwords do not match'
                    },
                  }}
                />
              </Grid2>
            </FormSection>
          )
        }}
      </BaseForm>
    </Stack>
  )
}

export default UserProfilePage
