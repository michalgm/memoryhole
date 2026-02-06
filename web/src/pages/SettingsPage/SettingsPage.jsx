// import { Link, routes } from '@cedarjs/router'

import { Divider, Grid2, Typography } from '@mui/material'
import { Stack } from '@mui/system'

import { BaseForm } from 'src/components/utils/BaseForm'
import { Field } from 'src/components/utils/Field'
import Footer from 'src/components/utils/Footer'
import FormSection from 'src/components/utils/FormSection'
import Show from 'src/components/utils/Show'
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
    <>
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
    </>
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

const SettingsPage = () => {
  return (
    <BaseForm
      formConfig={{
        id: 'settings',
        modelType: 'Settings',
        skipUpdatedCheck: true,
        transformInput: (input) => {
          const transformed = Object.keys(input).map((key) => ({
            id: key,
            value: input[key],
          }))
          return transformed
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
