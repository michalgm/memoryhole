import ArrestsCell from 'src/components/ArrestsCell/ArrestsCell'
import { useApp } from 'src/lib/AppContext'

const HomePage = () => {
  const { currentAction } = useApp()
  const filters = []
  if (currentAction?.id && currentAction.id !== -1) {
    filters.push({
      field: 'action_id',
      operator: 'equals',
      value: currentAction.id,
    })
  }
  return (
    <>
      <ArrestsCell filters={filters} />
    </>
  )
}

export default HomePage
