import ArresteeArrestCell from 'src/components/ArresteeArrestCell'
import { MetaTags } from '@redwoodjs/web'

const ArresteeArrestPage = ({id}) => {
  return (
    <>
      <MetaTags title="ArresteeArrest" description="ArresteeArrest page" />
      <ArresteeArrestCell id={id}/>
    </>
  )
}

export default ArresteeArrestPage
