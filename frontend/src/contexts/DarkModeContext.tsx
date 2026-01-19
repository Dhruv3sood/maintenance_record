import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface DarkModeContextType {
  darkMode: boolean
  toggleDarkMode: () => void
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined)

export function DarkModeProvider({ children }: { children: ReactNode }) {
  // Default to LIGHT mode (false = light, true = dark)
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return false  // Server-side: default to LIGHT
    }
    
    // Check localStorage for saved preference
    const saved = localStorage.getItem('darkMode')
    
    // Only use dark mode if explicitly saved as 'true'
    // Otherwise default to LIGHT mode
    const isDark = saved === 'true'
    
    // CRITICAL: Immediately set the DOM class on initialization
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
    } else {
      // Force remove dark class to ensure light mode
      root.classList.remove('dark')
    }
    
    return isDark
  })

  // Update DOM whenever darkMode state changes
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const root = document.documentElement
    
    // Synchronously update the dark class
    if (darkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    
    // Save to localStorage
    localStorage.setItem('darkMode', darkMode.toString())
  }, [darkMode])

  const toggleDarkMode = () => {
    // Update state and DOM immediately
    setDarkMode((prev) => {
      const newValue = !prev
      const root = document.documentElement
      
      // Immediately update DOM (synchronously, before React re-render)
      if (newValue) {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
      
      // Save to localStorage immediately
      localStorage.setItem('darkMode', newValue.toString())
      
      return newValue
    })
  }

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  )
}

export function useDarkMode() {
  const context = useContext(DarkModeContext)
  if (context === undefined) {
    throw new Error('useDarkMode must be used within a DarkModeProvider')
  }
  return context
}
