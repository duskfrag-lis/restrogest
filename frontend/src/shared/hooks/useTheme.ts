import { useCallback, useEffect, useState } from 'react'

type ThemeMode = 'light' | 'dark'

function resolveInitialTheme(): ThemeMode {

    const stored = window.localStorage.getItem('restrogest-theme')

    if (stored === 'dark' || stored === 'light') return stored

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useTheme() {

    const [theme, setTheme] = useState<ThemeMode>(() => resolveInitialTheme())

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
    }, [theme])

    const toggleTheme = useCallback(() => {

        setTheme((current) => {

            const next = current === 'light' ? 'dark' : 'light'
            window.localStorage.setItem('restrogest-theme', next)

            return next
        })
    }, [])

    return { theme, toggleTheme }
}