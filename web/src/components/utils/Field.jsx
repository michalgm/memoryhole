import { get } from 'lodash-es'
import { useFormContext } from 'react-hook-form-mui'

import { BaseField } from './BaseField'

export const Field = ({ highlightDirty, ...props }) => {
  const context = useFormContext()
  const { setValue, getValues, control, formState } = useFormContext()

  const fieldState =
    highlightDirty &&
    get(formState.dirtyFields, props.name) &&
    !get(formState.errors, props.name)
  const color = fieldState ? 'success' : undefined

  return (
    <BaseField
      {...props}
      value={getValues(props.name)}
      control={control}
      color={color}
      isRHF
      onChange={(...args) => {
        const inputType = args[0]?.target?.type
        let value
        if (['checkbox', 'switch'].includes(inputType)) {
          value = args[1]
        } else if (inputType) {
          if (inputType === 'number') {
            value = Number(args[0].target.value)
          } else {
            value = args[0].target.value
          }
        } else {
          value = args[0]
        }

        if (props.onChange) {
          props.onChange(value, context)
        }
        setValue(props.name, value)
      }}
    />
  )
}
