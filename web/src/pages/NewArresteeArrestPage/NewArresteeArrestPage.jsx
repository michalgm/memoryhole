import { Link, routes } from '@redwoodjs/router'

import { MetaTags } from '@redwoodjs/web'
import NewArresteeArrest from 'src/components/NewArresteeArrest'

const NewArresteeArrestPage = () => {
  return (
    <>
      <MetaTags
        title="NewArresteeArrest"
        description="NewArresteeArrest page"
      />

    <NewArresteeArrest/>
    </>
  )
}

export default NewArresteeArrestPage
