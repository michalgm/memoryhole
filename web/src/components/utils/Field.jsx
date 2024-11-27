import { useFormContext } from 'react-hook-form-mui'

import { BaseField } from './BaseField'

export const Field = (props) => {
  const { setValue, getValues, ...context } = useFormContext()

  return (
    <BaseField
      {...props}
      value={getValues(props.name)}
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
          props.onChange(value, { setValue, getValues, ...context })
        }
        setValue(props.name, value)
      }}
    />
  )
}
