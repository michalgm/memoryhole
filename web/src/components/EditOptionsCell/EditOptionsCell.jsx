import {
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material'

import { navigate, routes } from '@redwoodjs/router'

export const QUERY = gql`
  query optionSets {
    optionSets: optionSets {
      id
      name
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ optionSets = [], id }) => {
  return (
    <>
      <Button
        variant="outlined"
        onClick={() => navigate(routes.createOptionSet())}
      >
        Create new option set
      </Button>

      <List dense>
        {optionSets.map((item) => {
          return (
            <ListItem key={item.name}>
              <ListItemButton
                selected={item.id === id}
                onClick={() =>
                  navigate(routes['editOptionSet']({ id: item.id }))
                }
              >
                <ListItemText>{item.name}</ListItemText>
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
    </>
  )
}
