import ArresteeArrestCell from 'src/components/ArresteeArrestsCell/'
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
      <ArresteeArrestCell filters={filters} />
    </>
  )
}

export default HomePage
