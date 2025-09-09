import { Grid2 } from '@mui/material'

import { useLocation } from '@redwoodjs/router'

import OptionSetValuesCell from 'src/components/OptionSetValuesCell'

import CreateNewOptionsSet from '../../components/EditOptionsCell/CreateOptionsSet'
import EditOptionsCell from '../../components/EditOptionsCell/EditOptionsCell'

const EditOptionsPage = ({ id }) => {
  const { pathname } = useLocation()
  let rightPane = null
  if (id) {
    rightPane = <OptionSetValuesCell id={id} />
  } else if (/\/new$/.test(pathname)) {
    rightPane = <CreateNewOptionsSet />
  }
  return (
    <>
      <h2>Edit Options Sets</h2>
      <Grid2 container spacing={8}>
        <Grid2 size={6}>
          <EditOptionsCell id={id} />
        </Grid2>
        <Grid2 size={6}>{rightPane}</Grid2>
      </Grid2>
    </>
  )
}

export default EditOptionsPage
