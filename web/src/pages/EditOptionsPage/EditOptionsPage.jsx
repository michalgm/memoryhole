import Grid from '@mui/material/Unstable_Grid2/Grid2'

import { useLocation } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

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
      <MetaTags title="EditOptions" description="EditOptions page" />

      <h2>Edit Options Sets</h2>
      <Grid container spacing={8}>
        <Grid xs={6}>
          <EditOptionsCell id={id} />
        </Grid>
        <Grid xs={6}>{rightPane}</Grid>
      </Grid>
    </>
  )
}

export default EditOptionsPage
