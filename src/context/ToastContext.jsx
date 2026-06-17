import { useCallback, useMemo, useState } from 'react'
import { ToastContext } from './toast-context'

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)

  const notify = useCallback((type, text) => {
    setToast({ type, text })
    window.setTimeout(() => setToast(null), 4500)
  }, [])

  const value = useMemo(() => ({ toast, notify }), [toast, notify])

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  )
}
