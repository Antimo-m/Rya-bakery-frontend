import { useCallback, useMemo, useState } from 'react'
import { ErrorContext } from './error-context'

export function ErrorProvider({ children }) {
  const [error, setError] = useState(null)

  const reportError = useCallback((message, status = null) => {
    setError({ message, status })
  }, [])

  const clearError = useCallback(() => setError(null), [])

  const value = useMemo(() => ({ error, reportError, clearError }), [clearError, error, reportError])

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  )
}
