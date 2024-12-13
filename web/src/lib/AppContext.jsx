import { createContext, useContext, useEffect, useState } from 'react'

import { useParams } from '@redwoodjs/router' // Import useLocation

const AppContext = createContext()

export const defaultAction = { id: -1, name: 'All Actions', start_date: null }

const AppProvider = ({ children }) => {
  const [currentAction, setCurrentAction] = useState(() => {
    const stored = localStorage.getItem('currentAction')
    return stored ? JSON.parse(stored) : defaultAction
  })
  const [userPreferences, setUserPreferences] = useState({})
  const [pageTitle, setPageTitle] = useState('')
  const [navOpen, setNavOpen] = useState(true)
  const [logsOpen, setLogsOpen] = useState(false)
  const { id } = useParams() // Get the current location

  useEffect(() => {
    localStorage.setItem('currentAction', JSON.stringify(currentAction))
  }, [currentAction])

  useEffect(() => {
    if (!id) {
      setPageTitle('')
    }
  }, [id])

  const value = {
    currentAction,
    setCurrentAction,
    userPreferences,
    setUserPreferences,
    pageTitle,
    setPageTitle,
    navOpen,
    setNavOpen,
    logsOpen,
    setLogsOpen,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  return useContext(AppContext)
}

export default AppProvider
