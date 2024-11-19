import { useFormContext } from 'react-hook-form-mui'

import { BaseField } from './BaseField'

export const Field = (props) => {
  const { setValue, getValues } = useFormContext()

  return (
    <BaseField
      {...props}
      value={getValues(props.name)}
      isRHF
      onChange={(value) => setValue(props.name, value)}
    />
  )
}
