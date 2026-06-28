import ArrestPage from './ArrestPage'
import './ArrestPage.mock'

mockCurrentUser({ id: 1, email: 'test@example.com', roles: ['admin'] })

const meta = {
  component: ArrestPage,
  tags: ['autodocs'],
}

export default meta

export const Primary = {
  args: {
    id: 1,
  },
}
