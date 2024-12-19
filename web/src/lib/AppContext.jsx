import { createContext, useContext, useEffect, useMemo, useState } from 'react'

import { useMediaQuery } from '@mui/system'

import { useParams } from '@redwoodjs/router'

export const RIGHT_DRAWER_WIDTH = 450
export const LEFT_DRAWER_WIDTH = 150
export const LEFT_DRAWER_WIDTH_SMALL = 64
export const HEADER_HEIGHT = 48

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

export const useContainerWidth = (width) => {
  const { navOpen, logsOpen } = useApp()
  const minWidth = useMemo(() => {
    const padding = 24 * 2
    return (
      width +
      padding +
      (navOpen ? LEFT_DRAWER_WIDTH : LEFT_DRAWER_WIDTH_SMALL) +
      (logsOpen ? RIGHT_DRAWER_WIDTH : 0)
    )
  }, [width, navOpen, logsOpen])

  const matches = useMediaQuery(`(max-width:${minWidth}px)`)
  return matches
}

export default AppProvider
