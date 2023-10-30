import ArresteeArrestsCell from 'src/components/ArresteeArrestsCell'
import { Link } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
const HomePage = () => {
  return (
    <>
      <MetaTags title="Home" description="Home page" />
      <Link to='/arrestee-arrest/new'>New Arrestee </Link>
      <ArresteeArrestsCell />
    </>
  )
}

export default HomePage
