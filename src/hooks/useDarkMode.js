import { useState, useEffect, useCallback } from 'react'

export default function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    try {
      const stored = localStorage.getItem('theme')
      if (stored === 'dark') return true
      if (stored === 'light') return false
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    } catch (e) {
      return false
    }
  })

  useEffect(() => {
    const root = document.documentElement
    if (isDark) root.classList.add('dark')
    else root.classList.remove('dark')

    try {
      localStorage.setItem('theme', isDark ? 'dark' : 'light')
    } catch (e) {}
  }, [isDark])

  const toggle = useCallback(() => setIsDark((s) => !s), [])

  return [isDark, toggle, setIsDark]
}
