import { createContext, useContext, useEffect, useState } from 'react'

import { useMediaQuery } from '@mui/system'

import { useParams } from '@redwoodjs/router'

const AppContext = createContext()

export const defaultAction = { id: -1, name: 'All Actions', start_date: null }

const AppProvider = ({ children }) => {
  const smallScreen = useMediaQuery('(max-width:900px)')
  const [currentAction, setCurrentAction] = useState(() => {
    const stored = localStorage.getItem('currentAction')
    return stored ? JSON.parse(stored) : defaultAction
  })
  const [userPreferences, setUserPreferences] = useState({})
  const [pageTitle, setPageTitle] = useState('')
  const [navOpen, setNavOpen] = useState(!smallScreen)
  const [logsOpen, setLogsOpen] = useState(false)
  const [currentFormData, setCurrentFormData] = useState({})
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
    currentFormData,
    setCurrentFormData,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  return useContext(AppContext)
}

export default AppProvider
