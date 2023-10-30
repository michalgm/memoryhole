import {Link, routes} from '@redwoodjs/router'
const ArresteeArrest = ({arresteeArrest={}}) => {
  if (arresteeArrest) {

  } else {

  }


  return (
    <h4>
      {arresteeArrest.id ? arresteeArrest.display_name : 'New Arrestee'}
    </h4>
    // <li key={arresteeArrest.id}>
    //   <h4><Link to={routes.arresteeArrest({ id: arresteeArrest.id })}>{arresteeArrest.date}</Link></h4>
    // </li>
  )
}

export default ArresteeArrest
