import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  DatetimeLocalField,
  TextAreaField,
  Submit,
} from '@redwoodjs/forms'

const formatDatetime = (value) => {
  if (value) {
    return value.replace(/:\d{2}\.\d{3}\w/, '')
  }
}

const ActionForm = (props) => {
  const onSubmit = (data) => {
    props.onSave(data, props?.action?.id)
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
          name="name"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Name
        </Label>

        <TextField
          name="name"
          defaultValue={props.action?.name}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="name" className="rw-field-error" />

        <Label
          name="description"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Description
        </Label>

        <TextField
          name="description"
          defaultValue={props.action?.description}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="description" className="rw-field-error" />

        <Label
          name="start_date"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Start date
        </Label>

        <DatetimeLocalField
          name="start_date"
          defaultValue={formatDatetime(props.action?.start_date)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="start_date" className="rw-field-error" />

        <Label
          name="end_date"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          End date
        </Label>

        <DatetimeLocalField
          name="end_date"
          defaultValue={formatDatetime(props.action?.end_date)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="end_date" className="rw-field-error" />

        <Label
          name="jurisdiction"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Jurisdiction
        </Label>

        <TextField
          name="jurisdiction"
          defaultValue={props.action?.jurisdiction}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="jurisdiction" className="rw-field-error" />

        <Label
          name="city"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          City
        </Label>

        <TextField
          name="city"
          defaultValue={props.action?.city}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="city" className="rw-field-error" />

        <Label
          name="custom_fields"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Custom fields
        </Label>

        <TextAreaField
          name="custom_fields"
          defaultValue={JSON.stringify(props.action?.custom_fields)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ valueAsJSON: true }}
        />

        <FieldError name="custom_fields" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default ActionForm
