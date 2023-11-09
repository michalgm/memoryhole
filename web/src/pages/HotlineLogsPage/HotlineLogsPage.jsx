import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

import HotlineLogsCell from 'src/components/HotlineLogsCell/HotlineLogsCell'

const HotlineLogsPage = () => {
  return (
    <>
      <MetaTags title="HotlineLogs" description="HotlineLogs page" />

      <HotlineLogsCell />
    </>
  )
}

export default HotlineLogsPage
