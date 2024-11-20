import { createContext, useState, useContext, useEffect } from 'react'
const AppContext = createContext()

export const defaultAction = { id: -1, name: 'All Actions', start_date: null }

const AppProvider = ({ children }) => {
  const [currentAction, setCurrentAction] = useState(() => {
    const stored = localStorage.getItem('currentAction')
    return stored ? JSON.parse(stored) : defaultAction
  })
  const [userPreferences, setUserPreferences] = useState({})
  // const [themeMode, setThemeMode] = useState('light')

  useEffect(() => {
    localStorage.setItem('currentAction', JSON.stringify(currentAction))
  }, [currentAction])

  const value = {
    currentAction,
    setCurrentAction,
    userPreferences,
    setUserPreferences,
    // themeMode,
    // setThemeMode,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  return useContext(AppContext)
}

export default AppProvider
