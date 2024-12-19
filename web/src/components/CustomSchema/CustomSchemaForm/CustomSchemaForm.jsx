import {
  FieldError,
  Form,
  FormError,
  Label,
  NumberField,
  Submit,
  TextAreaField,
  TextField,
} from '@redwoodjs/forms'

const CustomSchemaForm = (props) => {
  const onSubmit = (data) => {
    props.onSave(data, props?.customSchema?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="table"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Table
        </Label>

        <TextField
          name="table"
          defaultValue={props.customSchema?.table}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          rules={{ required: true }}
        />

        <FieldError name="table" className="rw-field-error" />

        <Label
          name="section"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Section
        </Label>

        <TextField
          name="section"
          defaultValue={props.customSchema?.section}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          rules={{ required: true }}
        />

        <FieldError name="section" className="rw-field-error" />

        <Label
          name="schema"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Schema
        </Label>

        <TextAreaField
          name="schema"
          defaultValue={JSON.stringify(props.customSchema?.schema)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          rules={{ valueAsJSON: true, required: true }}
        />

        <FieldError name="schema" className="rw-field-error" />

        <Label
          name="updated_by_id"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Updatedby id
        </Label>

        <NumberField
          name="updated_by_id"
          defaultValue={props.customSchema?.updated_by_id}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="updated_by_id" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default CustomSchemaForm
