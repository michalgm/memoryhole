import EditOptionsForm from '../EditOptionsCell/EditOptionsForm'

export const QUERY = gql`
  query OptionSetQuery($id: Int!) {
    optionSet: optionSet(id: $id) {
      id
      name
      values {
        label
        value
        id
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ optionSet: { id, name, values } }) => {
  return <EditOptionsForm optionsSet={{ id, name, values }} />
}

// export const CREATE_OPTION_SET_VALUE_MUTATION = gql`
//   mutation AddOptionsSetValueQuery($input: CreateOptionSetValueInput!) {
//     createOptionSetValue(input: $input) {
//       id
//     }
//   }
// `

// export const DELETE_OPTION_SET_VALUE_MUTATION = gql`
//   mutation DeleteOptionsSetValueQuery($id: Int!) {
//     deleteOptionSetValue(id: $id) {
//       id
//     }
//   }
// `

// export const EDIT_OPTION_SET_VALUE_MUTATION = gql`
//   mutation EditOptionsSetValueQuery(
//     $id: Int!
//     $input: UpdateOptionSetValueInput!
//   ) {
//     updateOptionSetValue(id: $id, input: $input) {
//       id
//     }
//   }
// `

// const EditOptionSetValue = ({
//   editValue,
//   setEditValue,
//   saveOptionSetValue,
// }) => (
//   <>
//     <TextField
//       size="small"
//       name="label"
//       value={editValue.value}
//       onChange={({ target: { value } }) =>
//         setEditValue({ ...editValue, value })
//       }
//       autoFocus
//       onKeyDown={(e) => e.key === 'Enter' && saveOptionSetValue()}
//       InputProps={{
//         endAdornment: (
//           <InputAdornment position="end">
//             <IconButton onClick={() => saveOptionSetValue()}>
//               <Save />
//             </IconButton>
//           </InputAdornment>
//         ),
//       }}
//     />
//   </>
// )

// const [createOptionSetValue, { loading, error }] = useMutation(
//   CREATE_OPTION_SET_VALUE_MUTATION,
//   handleMutation('Option set value created')
// )

// const [deleteOptionSetValue] = useMutation(
//   DELETE_OPTION_SET_VALUE_MUTATION,
//   handleMutation('Option set value deleted')
// )

// const [editOptionSetValue] = useMutation(
//   EDIT_OPTION_SET_VALUE_MUTATION,
//   handleMutation('Option set value updated')
// )
// const onSuccess = (input) => {
//   input.option_set = name
//   input.label = input.value
//   createOptionSetValue({ variables: { input } })
// }

// const saveOptionSetValue = async () => {
//   await editOptionSetValue({
//     variables: { id: editValue.id, input: { value: editValue.value } },
//   })
//   setEditValue({})
// }

// const OptionSetValue = ({ item: { id, value } }) => (
//   <>
//     {value}
//     <Button onClick={() => setEditValue({ id, value })}>
//       <Edit />
//     </Button>
//     <Button
//       color="error"
//       onClick={() => deleteOptionSetValue({ variables: { id } })}
//     >
//       <Delete />
//     </Button>
//   </>
// )

{
  /* <FormContainer defaultValues={{}} onSuccess={(data) => onSuccess(data)}>
  <Field name="value" />
  <Button type="submit" variant="contained">
    Save
  </Button>
</FormContainer> */
}
{
  /* <ul>
  {values.map((item) => (
    <li key={item.id}>
      {item.id === editValue.id ? (
        <EditOptionSetValue
          editValue={editValue}
          setEditValue={setEditValue}
          saveOptionSetValue={saveOptionSetValue}
        />
      ) : (
        <OptionSetValue item={item} />
      )}
    </li>
  ))}
</ul> */
}
