import {
  FieldError,
  Form,
  FormError,
  Label,
  NumberField,
  Submit,
  TextField,
} from '@cedarjs/forms'

const TableViewForm = (props) => {
  const onSubmit = (data) => {
    props.onSave(data, props?.tableView?.id)
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
          defaultValue={props.tableView?.name}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          rules={{ required: true }}
        />

        <FieldError name="name" className="rw-field-error" />

        <Label
          name="state"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          State
        </Label>

        <TextField
          name="state"
          defaultValue={props.tableView?.state}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          rules={{ required: true }}
        />

        <FieldError name="state" className="rw-field-error" />

        <Label
          name="type"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Type
        </Label>

        <TextField
          name="type"
          defaultValue={props.tableView?.type}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          rules={{ required: true }}
        />

        <FieldError name="type" className="rw-field-error" />

        <Label
          name="created_by_id"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Created by id
        </Label>

        <NumberField
          name="created_by_id"
          defaultValue={props.tableView?.created_by_id}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="created_by_id" className="rw-field-error" />

        <Label
          name="updated_by_id"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Updated by id
        </Label>

        <NumberField
          name="updated_by_id"
          defaultValue={props.tableView?.updated_by_id}
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

export default TableViewForm
