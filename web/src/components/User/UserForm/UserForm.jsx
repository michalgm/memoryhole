import dayjs from 'dayjs'

import {
  DatetimeLocalField,
  FieldError,
  Form,
  FormError,
  Label,
  SelectField,
  Submit,
  TextField,
} from '@redwoodjs/forms'

const UserForm = (props) => {
  const onSubmit = (data) => {
    props.onSave(data, props?.user?.id)
  }

  const expiresAt = props?.user?.expiresAt
    ? dayjs(props.user.expiresAt).format('YYYY-MM-DDTHH:mm')
    : null

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
          name="email"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Email
        </Label>

        <TextField
          name="email"
          defaultValue={props.user?.email}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="email" className="rw-field-error" />

        <Label
          name="name"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
          validation={{ required: true }}
        >
          Name
        </Label>

        <TextField
          name="name"
          defaultValue={props.user?.name}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="name" className="rw-field-error" />

        <Label
          name="role"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Role
        </Label>
        <SelectField
          name="role"
          defaultValue={props.user?.role}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        >
          <option>User</option>
          <option>Admin</option>
        </SelectField>

        <Label
          name="expiresAt"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Expires At
        </Label>
        <DatetimeLocalField
          name="expiresAt"
          defaultValue={expiresAt}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        ></DatetimeLocalField>

        <FieldError name="role" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default UserForm
