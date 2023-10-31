import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';

import ArresteeArrestCell from 'src/components/ArresteeArrest'
import { Link } from '@redwoodjs/router'
import { useMemo } from 'react';

export const QUERY = gql`
  query ArresteeArrestsQuery {
    arresteeArrests: arrests {
      id
      date
      location
      arrestee {
        first_name
        last_name
      }
      created_at
      updated_at
      updated_by {
        name
      }
    }
  }
`
const flattenObject = (obj, parent = '', result = {}) => {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      let newKey = parent ? `${parent}.${key}` : key;
      if (typeof obj[key] === 'object' && !Array.isArray(obj[key]) && obj[key] !== null) {
        flattenObject(obj[key], newKey, result);
      } else {
        result[newKey] = obj[key];
      }
    }
  }
  return result;
}


export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

const data = [
  {
    name: "John",
    age: 30
  },
  {
    name: "Sara",
    age: 25
  }
];

export const Success = ({ arresteeArrests }) => {
  // const columns = useMemo(() => ([
    //   // {accessorKey: 'arrestee.first_name', header: 'First Name'},
    //   // {accessorKey: 'arrestee.last_name', header: 'Last Name'},
    //   {accessorKey: 'date', header: 'Date'},
    //   {accessorKey: 'location', header: 'Location'}

  // ], []))
  const columns = useMemo(
    () => [
        {accessorKey: 'arrestee.first_name', header: 'First Name',  Cell: ({cell, row}) => console.log(row) || <Link to={`/arrestee-arrest/${row.original.id}`}>{cell.getValue()}</Link>,},

        {accessorKey: 'arrestee.last_name', header: 'Last Name'},
      { accessorKey: "date", header: "Date", },
      { accessorKey: "location", header: "Location", },

    ],
    []
  );
  const data = arresteeArrests
  const table = useMaterialReactTable({
    columns,
    data,
    muiTableBodyProps: {
      sx: {
        //stripe the rows, make odd rows a darker color
        '& tr:nth-of-type(odd) > td': {
          backgroundColor: '#f5f5f5',
        },
      },
    },
  });
  return (
    <MaterialReactTable table={table} />
  )
  return (
    <ul>
      {arresteeArrests.map((item) => {
        return <ArresteeArrestCell key={item.id} arresteeArrest={item} />
      })}
    </ul>
  )
}
