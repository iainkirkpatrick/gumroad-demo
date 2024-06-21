import React, { createContext, useState, useContext } from 'react'


interface ToastContextT {
  toasts: Array<string>
  addToast: (toast: string) => void
}

const ToastContext = createContext<ToastContextT | undefined>([])


interface ToastProviderProps {
  children: React.ReactNode
}

export function ToastProvider ({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Array<string>>([])

  const addToast = (toast: string) => {
    setToasts([...toasts, toast])
    setTimeout(() => {
      setToasts(toasts.filter((t: string) => t !== toast))
    }, 5000)
  }

  return (
    <ToastContext.Provider value={{ toasts, addToast }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast () {
  const ctx = useContext(ToastContext)

  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider')
  }

  return ctx
}