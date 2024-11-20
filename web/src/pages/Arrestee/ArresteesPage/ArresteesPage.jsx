import ArresteesCell from 'src/components/Arrestee/ArresteesCell'
import { useApp } from 'src/lib/AppContext'

const ArresteesPage = () => {
  const { currentAction } = useApp()
  const filters = []
  if (currentAction?.id) {
    filters.push({
      field: 'action_id',
      operator: 'equals',
      value: currentAction.id,
    })
  }
  return <ArresteesCell filters={filters} />
}

export default ArresteesPage
