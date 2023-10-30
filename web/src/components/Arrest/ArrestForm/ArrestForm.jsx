import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  DatetimeLocalField,
  NumberField,
  TextAreaField,
  Submit,
} from '@redwoodjs/forms'

const formatDatetime = (value) => {
  if (value) {
    return value.replace(/:\d{2}\.\d{3}\w/, '')
  }
}

const ArrestForm = (props) => {
  const onSubmit = (data) => {
    props.onSave(data, props?.arrest?.id)
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
          name="display_field"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Display field
        </Label>

        <TextField
          name="display_field"
          defaultValue={props.arrest?.display_field}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="display_field" className="rw-field-error" />

        <Label
          name="search_field"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Search field
        </Label>

        <TextField
          name="search_field"
          defaultValue={props.arrest?.search_field}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="search_field" className="rw-field-error" />

        <Label
          name="date"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Date
        </Label>

        <DatetimeLocalField
          name="date"
          defaultValue={formatDatetime(props.arrest?.date)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="date" className="rw-field-error" />

        <Label
          name="location"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Location
        </Label>

        <TextField
          name="location"
          defaultValue={props.arrest?.location}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="location" className="rw-field-error" />

        <Label
          name="charges"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Charges
        </Label>

        <TextField
          name="charges"
          defaultValue={props.arrest?.charges}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="charges" className="rw-field-error" />

        <Label
          name="arrest_city"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Arrest city
        </Label>

        <TextField
          name="arrest_city"
          defaultValue={props.arrest?.arrest_city}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="arrest_city" className="rw-field-error" />

        <Label
          name="jurisdiction"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Jurisdiction
        </Label>

        <TextField
          name="jurisdiction"
          defaultValue={props.arrest?.jurisdiction}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="jurisdiction" className="rw-field-error" />

        <Label
          name="citation_number"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Citation number
        </Label>

        <TextField
          name="citation_number"
          defaultValue={props.arrest?.citation_number}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="citation_number" className="rw-field-error" />

        <Label
          name="arrestee_id"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Arrestee id
        </Label>

        <NumberField
          name="arrestee_id"
          defaultValue={props.arrest?.arrestee_id}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="arrestee_id" className="rw-field-error" />

        <Label
          name="custom_fields"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Custom fields
        </Label>

        <TextAreaField
          name="custom_fields"
          defaultValue={JSON.stringify(props.arrest?.custom_fields)}
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
          defaultValue={props.arrest?.createdby_id}
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
          defaultValue={props.arrest?.updatedby_id}
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

export default ArrestForm
