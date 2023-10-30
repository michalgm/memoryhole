import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  DatetimeLocalField,
  TextAreaField,
  NumberField,
  Submit,
} from '@redwoodjs/forms'

const formatDatetime = (value) => {
  if (value) {
    return value.replace(/:\d{2}\.\d{3}\w/, '')
  }
}

const ArresteeForm = (props) => {
  const onSubmit = (data) => {
    props.onSave(data, props?.arrestee?.id)
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
          defaultValue={props.arrestee?.display_field}
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
          defaultValue={props.arrestee?.search_field}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="search_field" className="rw-field-error" />

        <Label
          name="first_name"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          First name
        </Label>

        <TextField
          name="first_name"
          defaultValue={props.arrestee?.first_name}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="first_name" className="rw-field-error" />

        <Label
          name="last_name"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Last name
        </Label>

        <TextField
          name="last_name"
          defaultValue={props.arrestee?.last_name}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="last_name" className="rw-field-error" />

        <Label
          name="preferred_name"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Preferred name
        </Label>

        <TextField
          name="preferred_name"
          defaultValue={props.arrestee?.preferred_name}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="preferred_name" className="rw-field-error" />

        <Label
          name="pronoun"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Pronoun
        </Label>

        <TextField
          name="pronoun"
          defaultValue={props.arrestee?.pronoun}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="pronoun" className="rw-field-error" />

        <Label
          name="dob"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Dob
        </Label>

        <DatetimeLocalField
          name="dob"
          defaultValue={formatDatetime(props.arrestee?.dob)}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="dob" className="rw-field-error" />

        <Label
          name="email"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Email
        </Label>

        <TextField
          name="email"
          defaultValue={props.arrestee?.email}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="email" className="rw-field-error" />

        <Label
          name="phone_1"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Phone 1
        </Label>

        <TextField
          name="phone_1"
          defaultValue={props.arrestee?.phone_1}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="phone_1" className="rw-field-error" />

        <Label
          name="phone_2"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Phone 2
        </Label>

        <TextField
          name="phone_2"
          defaultValue={props.arrestee?.phone_2}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="phone_2" className="rw-field-error" />

        <Label
          name="address"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Address
        </Label>

        <TextField
          name="address"
          defaultValue={props.arrestee?.address}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="address" className="rw-field-error" />

        <Label
          name="city"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          City
        </Label>

        <TextField
          name="city"
          defaultValue={props.arrestee?.city}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="city" className="rw-field-error" />

        <Label
          name="state"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          State
        </Label>

        <TextField
          name="state"
          defaultValue={props.arrestee?.state}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="state" className="rw-field-error" />

        <Label
          name="zip"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Zip
        </Label>

        <TextField
          name="zip"
          defaultValue={props.arrestee?.zip}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="zip" className="rw-field-error" />

        <Label
          name="notes"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Notes
        </Label>

        <TextField
          name="notes"
          defaultValue={props.arrestee?.notes}
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
          defaultValue={JSON.stringify(props.arrestee?.custom_fields)}
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
          defaultValue={props.arrestee?.createdby_id}
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
          defaultValue={props.arrestee?.updatedby_id}
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

export default ArresteeForm
