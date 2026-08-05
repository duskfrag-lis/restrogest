const REDIRECT_KEY = 'authRedirect'

export function saveRedirectPath(path: string) {

    sessionStorage.setItem(REDIRECT_KEY, path)
}

export function getAndClearRedirectPath(fallback: string): string {

    const stored = sessionStorage.getItem(REDIRECT_KEY)

    sessionStorage.removeItem(REDIRECT_KEY)

    return stored ?? fallback
}

export function peekRedirectPath(fallback: string): string {

    return sessionStorage.getItem(REDIRECT_KEY) ?? fallback
}