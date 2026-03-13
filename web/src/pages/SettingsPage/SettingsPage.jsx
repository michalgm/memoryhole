import { useEffect, useRef, useState } from 'react'

import { Alert, Button, Divider, Grid2, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { FormProvider } from 'react-hook-form'
import { useForm } from 'react-hook-form-mui'

import { useMutation } from '@cedarjs/web'

import { BaseForm } from 'src/components/utils/BaseForm'
import { Field } from 'src/components/utils/Field'
import Footer from 'src/components/utils/Footer'
import FormSection from 'src/components/utils/FormSection'
import Show from 'src/components/utils/Show'
import { useDisplayError, useSnackbar } from 'src/components/utils/SnackBar'
import { userSchema } from 'src/lib/FieldSchemas'
import { transformSettings } from 'src/lib/useSiteSettings'

const QUERY_SETTINGS = gql`
  query SettingsQuery {
    siteSettings {
      id
      value
      updated_at
      updated_by {
        id
        name
      }
    }
  }
`

const SEND_TEST_EMAIL_MUTATION = gql`
  mutation SendTestEmailMutation($to: String!) {
    sendTestEmail(to: $to)
  }
`

const UPSERT_SETTINGS_MUTATION = gql`
  mutation BulkUpsertSiteSettingMutation($input: [UpsertSiteSettingInput!]!) {
    bulkUpsertSiteSetting(input: $input) {
      id
      value
      updated_at
      updated_by {
        id
        name
      }
    }
  }
`

const EMAIL_SERVER_PRESETS = {
  None: {
    smtp_host: '',
    smtp_secure: false,
  },
  'Protonmail Bridge': {
    smtp_host: 'protonmail-bridge:1025',
    smtp_secure: false,
  },
  Gmail: {
    smtp_host: 'smtp.gmail.com:465',
    smtp_secure: true,
  },
}

const inferEmailServer = (smtpHost) => {
  if (!smtpHost || smtpHost.startsWith('protonmail_bridge'))
    return 'Protonmail Bridge'
  if (smtpHost.startsWith('smtp.gmail.com')) return 'Gmail'
  return 'custom_smtp'
}

const restrictionTypes = [
  {
    name: 'expiresAt',
    noDisable: true,
  },
  {
    name: 'access_date_min',
    withDirection: true,
  },
  {
    name: 'access_date_max',
    withDirection: true,
  },
  {
    name: 'access_date_threshold',
  },
].map((type) => ({
  ...type,
  label: userSchema[type.name]?.props.label,
  description: userSchema[type.name]?.props.helperText,
}))

const DaysInputField = ({ withDirection = false, ...props }) => {
  return (
    <Stack direction="row" spacing={0} alignItems="center">
      <Field
        sx={{
          flex: '1 0 ',
          // minWidth: '80px'
        }}
        type="number"
        endAdornment="days"
        {...props}
        label=""
      />
      <Show when={withDirection}>
        <Field
          field_type="togglebutton"
          name={`${props.name}_direction`}
          options={['before', 'after']}
          label=""
          size="small"
        />
      </Show>
    </Stack>
  )
}

const SettingsRow = ({ title, description, children }) => {
  return (
    <Grid2 size={12}>
      <Grid2 container spacing={2}>
        <Grid2 size={3}>
          <Typography variant="body1">{title}</Typography>
          <Typography variant="caption">{description}</Typography>
        </Grid2>
        <Grid2 size={9}>
          <Stack
            direction="row"
            spacing={2}
            sx={{
              '& > *': {
                flex: '1 1 0',
                display: 'flex',
                justifyContent: 'flex-start',
              },
            }}
          >
            {children}
          </Stack>
        </Grid2>
      </Grid2>
    </Grid2>
  )
}

const EmailSettingsSection = ({ formContext }) => {
  const [sendTestEmail] = useMutation(SEND_TEST_EMAIL_MUTATION)
  const { openSnackbar } = useSnackbar()
  const displayError = useDisplayError()

  const handleSendTestEmail = async (to) => {
    setSending(true)
    try {
      await sendTestEmail({ variables: { to } })
      openSnackbar('Test email sent successfully', 'success')
    } catch (error) {
      displayError(error)
    } finally {
      setSending(false)
    }
  }
  const [sending, setSending] = useState(false)
  const localForm = useForm({
    defaultValues: {
      email_server: 'Protonmail Bridge',
      test_email_address: '',
    },
  })
  const emailServer = localForm.watch('email_server')
  const initialSyncDone = useRef(false)

  // Sync email_server from parent's smtp_host once on initial load
  const parentSmtpHost = formContext.watch('smtp_host')
  useEffect(() => {
    if (!parentSmtpHost || initialSyncDone.current) return
    initialSyncDone.current = true
    localForm.setValue('email_server', inferEmailServer(parentSmtpHost))
  }, [parentSmtpHost, localForm])

  // Push preset values back to the main form when user changes email_server
  useEffect(() => {
    const preset = EMAIL_SERVER_PRESETS[emailServer]
    if (!preset) return
    if (formContext.getValues('smtp_host') !== preset.smtp_host) {
      formContext.setValue('smtp_host', preset.smtp_host, { shouldDirty: true })
      formContext.setValue('smtp_secure', preset.smtp_secure, {
        shouldDirty: true,
      })
    }
    // formContext is a stable ref from useForm — intentionally excluded from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailServer])

  return (
    <FormSection title="Email Settings">
      <Typography variant="body1">
        Email is used to send account setup invitations to new users and to
        manage password resets. For the best security, it is highly recommended
        to use the locally-run Protonmail Bridge service, as it ensures
        end-to-end encryption for emails sent to Protonmail addresses — though
        this requires a paid Protonmail account.
      </Typography>
      <Grid2
        container
        spacing={2}
        sx={{
          width: '100%',
          '& .MuiRadioGroup-row': {
            justifyContent: 'space-around',
          },
        }}
      >
        <FormProvider {...localForm}>
          <SettingsRow
            title="Email Server"
            description="Configure the email server settings for the application. This will be used for sending notifications and other emails from the system."
          >
            <Field
              name="email_server"
              field_type="radio"
              options={[
                'None',
                'Protonmail Bridge',
                'Gmail',
                { id: 'custom_smtp', label: 'Custom SMTP' },
              ]}
              row
              label=""
            />
          </SettingsRow>
        </FormProvider>
        {emailServer === 'Protonmail Bridge' && (
          <Grid2 size={12}>
            <Alert severity="info">
              <Typography variant="body2" gutterBottom>
                <strong>
                  Using the Protonmail Bridge service requires a paid Protonmail
                  account.
                </strong>
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Setup required:</strong> SSH into your server and run{' '}
                <code>sudo init-bridge.sh</code>. Follow the prompts to log in
                to your Protonmail account, then run <code>info</code> to
                retrieve the generated SMTP username and password. Enter those
                credentials in the fields below.
              </Typography>
            </Alert>
          </Grid2>
        )}
        {emailServer === 'Gmail' && (
          <Grid2 size={12}>
            <Alert severity="info">
              <strong>App password required:</strong> Gmail does not allow
              regular passwords for SMTP. In your Google Account, go to{' '}
              <strong>
                <a
                  href="https://myaccount.google.com/apppasswords"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://myaccount.google.com/apppasswords
                </a>
              </strong>
              , generate a new app password, and enter it in the SMTP Password
              field below.
            </Alert>
          </Grid2>
        )}
        <SettingsRow
          title="SMTP Host and Port"
          description="If using Custom SMTP, enter the SMTP host and port information. For example, smtp.example.com:587"
        >
          <Field
            name="smtp_host"
            field_type="text"
            label="SMTP Host"
            disabled={emailServer !== 'custom_smtp'}
          />
        </SettingsRow>
        <SettingsRow
          title="SMTP Security"
          description="Check the box if your SMTP server requires a secure connection (TLS/SSL)."
        >
          <Field
            name="smtp_secure"
            field_type="checkbox"
            label="Use TLS/SSL"
            disabled={emailServer !== 'custom_smtp'}
          />
        </SettingsRow>
        <SettingsRow
          title="SMTP Username and Password"
          description="Enter the SMTP username and password for authentication."
        >
          <Field name="smtp_user" field_type="text" label="SMTP Username" />
          <Field
            name="smtp_pass"
            field_type="text"
            label="SMTP Password"
            type="password"
          />
        </SettingsRow>
        <FormProvider {...localForm}>
          <SettingsRow
            title="Test Email Address"
            description="Enter an email address to send a test email to verify the SMTP settings. This will not be saved as part of the settings."
          >
            <Field
              name="test_email_address"
              field_type="text"
              label="Test Email Address"
              type="email"
              sx={{ flexGrow: 1 }}
            />
            <Button
              variant="contained"
              loading={sending}
              loadingPosition="start"
              onClick={() =>
                handleSendTestEmail(localForm.getValues('test_email_address'))
              }
              sx={{ flexGrow: 0, flexBasis: 'fit-content' }}
            >
              Send Test Email
            </Button>
          </SettingsRow>
        </FormProvider>
      </Grid2>
    </FormSection>
  )
}

const SettingsPage = () => {
  return (
    <BaseForm
      formConfig={{
        id: 'settings',
        modelType: 'Settings',
        skipUpdatedCheck: true,
        transformInput: (input) => {
          return Object.keys(input).map((key) => ({
            id: key,
            value: input[key],
          }))
        },
        onFetch: (data) => transformSettings({ siteSettings: data }),
        fetchQuery: QUERY_SETTINGS,
        updateMutation: UPSERT_SETTINGS_MUTATION,
      }}
    >
      {(formManagerContext) => {
        const { formContext, hasDirtyFields } = formManagerContext
        const restrictionSettings = formContext.watch('restriction_settings')

        return (
          <Stack spacing={3} sx={{ mb: 3 }}>
            <FormSection title="General Settings">
              <Grid2 container spacing={2} sx={{ width: '100%' }}>
                <SettingsRow
                  title="Time Zone"
                  description="Select the default time zone for the site. This will be used for displaying dates and times."
                >
                  <Field
                    name="timeZone"
                    field_type="select"
                    label=""
                    description=""
                    options={Intl.supportedValuesOf('timeZone')}
                    fullWidth
                  />
                </SettingsRow>
              </Grid2>
            </FormSection>
            <FormSection title="Default User Restrictions">
              <Typography variant="body1">
                The settings below define default values for new users and apply
                when a user&apos;s restrictions are updated. For all fields
                except &apos;Access Date Threshold,&apos; values are relative to
                the time the user is created or updated. For &apos;Access Date
                Threshold,&apos; the value is always relative to the current
                time, functioning as a rolling restriction.
              </Typography>
              <Grid2 container spacing={2}>
                <SettingsRow
                  title="Enable/Disable Restriction Types"
                  description="Use the toggles to enable or disable the restriction types in the settings and user edit interfaces"
                >
                  {restrictionTypes.map((setting) => (
                    <Show unless={setting.noDisable} key={setting.name}>
                      <Field
                        name={`restriction_settings.${setting.name}`}
                        field_type="switch"
                        label={setting.label}
                        labelPlacement="bottom"
                      />
                    </Show>
                  ))}
                </SettingsRow>
                <Grid2 size={12}>
                  <Divider />
                </Grid2>
                <SettingsRow>
                  <Typography variant="h6">Operator</Typography>
                  <Typography variant="h6">Coordinator</Typography>
                  <Typography variant="h6">Admin</Typography>
                </SettingsRow>
                {restrictionTypes.map((setting) => (
                  <Show
                    unless={
                      !restrictionSettings?.[setting.name] &&
                      setting.name !== 'expiresAt'
                    }
                    key={setting.name}
                  >
                    <SettingsRow
                      key={setting.name}
                      title={setting.label}
                      description={setting.description}
                    >
                      {['operator', 'coordinator', 'admin'].map((role) => (
                        <DaysInputField
                          key={`${role}-${setting.name}`}
                          name={`default_restrictions.${role}.${setting.name}`}
                          label={setting.label}
                          withDirection={setting.withDirection}
                        />
                      ))}
                    </SettingsRow>
                  </Show>
                ))}
              </Grid2>
            </FormSection>
            <EmailSettingsSection formContext={formContext} />
            <Footer
              {...{
                formManagerContext,
                allowSave: hasDirtyFields,
                label: 'Settings',
              }}
            />
          </Stack>
        )
      }}
    </BaseForm>
  )
}

export default SettingsPage
