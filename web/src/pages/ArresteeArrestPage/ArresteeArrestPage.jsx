import ArresteeArrestCell from 'src/components/ArresteeArrestCell'
import { MetaTags } from '@redwoodjs/web'

const ArresteeArrestPage = ({id}) => {
  return (
    <>
      <MetaTags title="Arrest" description="Arrest page" />
      <ArresteeArrestCell id={id}/>
    </>
  )
}

export default ArresteeArrestPage
