const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function sanitizeNameInput(value: string): string {

    return value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]/g, '')
}

export function sanitizePhoneInput(value: string): string {

    return value.replace(/\D/g, '').slice(0, 10)
}

export function isValidEmail(value: string): boolean {

    return EMAIL_PATTERN.test(value)
}