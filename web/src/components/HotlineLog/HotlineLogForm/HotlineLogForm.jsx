import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  TextAreaField,
  NumberField,
  Submit,
} from '@redwoodjs/forms'

const HotlineLogForm = (props) => {
  const onSubmit = (data) => {
    props.onSave(data, props?.hotlineLog?.id)
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
          name="type"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Type
        </Label>

        <TextField
          name="type"
          defaultValue={props.hotlineLog?.type}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="type" className="rw-field-error" />

        <Label
          name="notes"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Notes
        </Label>

        <TextField
          name="notes"
          defaultValue={props.hotlineLog?.notes}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="notes" className="rw-field-error" />

        <Label
          name="custom_fields"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Custom fields
        </Label>

        <TextAreaField
          name="custom_fields"
          defaultValue={JSON.stringify(props.hotlineLog?.custom_fields)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ valueAsJSON: true }}
        />

        <FieldError name="custom_fields" className="rw-field-error" />

        <Label
          name="createdby_id"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Createdby id
        </Label>

        <NumberField
          name="createdby_id"
          defaultValue={props.hotlineLog?.createdby_id}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="createdby_id" className="rw-field-error" />

        <Label
          name="updatedby_id"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Updatedby id
        </Label>

        <NumberField
          name="updatedby_id"
          defaultValue={props.hotlineLog?.updatedby_id}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="updatedby_id" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default HotlineLogForm
