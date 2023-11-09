import { Add } from '@mui/icons-material'
import { Button } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2/Grid2'

import { Link, navigate, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

import ArresteeArrestsCell from 'src/components/ArresteeArrestsCell'

const HomePage = () => {
  return (
    <>
      <MetaTags title="Home" description="Home page" />
      <Grid spacing={2} container>
        <Grid xs={12} sx={{ textAlign: 'right' }}>
          <Button
            onClick={() => navigate(routes['newArresteeArrest']())}
            variant="contained"
            color="secondary"
            startIcon={<Add />}
          >
            New Arrestee
          </Button>
        </Grid>
        <Grid xs={12}>
          <ArresteeArrestsCell />
        </Grid>
      </Grid>
    </>
  )
}

export default HomePage
