import { Link, navigate, routes } from '@redwoodjs/router'

import { Add } from '@mui/icons-material'
import ArresteeArrestsCell from 'src/components/ArresteeArrestsCell'
import { Button } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { MetaTags } from '@redwoodjs/web'

const HomePage = () => {
  return (
    <>
      <MetaTags title="Home" description="Home page" />
      <Grid spacing={8}>
        <Grid sx={{ textAlign: 'right' }}>
          <Button onClick={() => navigate(routes['newArresteeArrest']())} variant="contained" color='primary' startIcon={<Add />}>
            New Arrestee
          </Button>
        </Grid>
        <Grid>
          <ArresteeArrestsCell />
        </Grid>
      </Grid>
    </>
  )
}

export default HomePage
