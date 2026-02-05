import { createContext, useContext } from 'react'

import { jest } from '@jest/globals'

// Create a mock context for the Snackbar
const SnackbarContext = createContext()

// Mock implementation of the provider
export const MockSnackbarProvider = ({ children }) => {
  const contextValue = {
    openSnackbar: jest.fn(),
    closeSnackbar: jest.fn(),
  }

  return (
    <SnackbarContext.Provider value={contextValue}>
      {children}
    </SnackbarContext.Provider>
  )
}

// Mock hook
export const useSnackbar = () => {
  const context = useContext(SnackbarContext)
  if (!context) {
    throw new Error('useSnackbar must be used within a MockSnackbarProvider')
  }
  return context
}

const displayErrorMock = jest.fn()

export const useDisplayError = () => displayErrorMock

export const _getMockDisplayError = () => displayErrorMock

export const SnackBarProvider = MockSnackbarProvider
