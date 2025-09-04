import { Paper } from '@mui/material'

import { BaseForm } from 'src/components/utils/BaseForm'
import { Field } from 'src/components/utils/Field'
import Footer from 'src/components/utils/Footer'

const QUERY = gql`
  query EditSiteSetting($id: String!) {
    siteSetting: siteSetting(id: $id) {
      id
      value
    }
  }
`

const UPDATE_MUTATION = gql`
  mutation EditSettingMutation($id: String!, $input: UpdateSiteSettingInput!) {
    updateSiteSetting(id: $id, input: $input) {
      id
      value
    }
  }
`

const schema = {
  value: {
    label: 'Site Help',
    field_type: 'richtext',
    span: 12,
    sx: {
      '& .MuiTiptap-FieldContainer-root': { minHeight: 300 },
    },
  },
}
const EditHelpPage = () => {
  return (
    <BaseForm
      formConfig={{
        id: 'siteHelp',
        schema,
        title: 'Site Help',
        modelType: 'SiteSettings',
        namePath: 'Site Help',
        skipUpdatedCheck: true,
        defaultValues: {
          arrests: [],
        },
        fetchQuery: QUERY,
        updateMutation: UPDATE_MUTATION,
      }}
    >
      {(formManagerContext) => {
        return (
          <>
            <Paper sx={{ p: 2 }}>
              <Field
                name="value"
                label="Site Help"
                field_type="richtext"
                rows={10}
                sx={{
                  '& .MuiTiptap-RichTextContent-root': {
                    minHeight: 300,
                    height: (theme) =>
                      `calc(${theme.custom.scrollAreaHeight} - 28px)`,
                    overflowY: 'auto',
                  },
                }}
              />
            </Paper>
            <Footer
              {...{
                label: 'Site Help',
                formManagerContext,
              }}
            />
          </>
        )
      }}
    </BaseForm>
  )
}
export default EditHelpPage
