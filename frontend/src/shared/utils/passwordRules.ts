export interface PasswordRule {

    id: string
    label: string
    test: (value: string) => boolean
}

export const PASSWORD_RULES: PasswordRule[] = [

    { id: 'minLength', label: 'Mínimo 8 caracteres', test: (value) => value.length >= 8 },
    { id: 'uppercase', label: 'Una mayúscula', test: (value) => /[A-Z]/.test(value) },
    { id: 'lowercase', label: 'Una minúscula', test: (value) => /[a-z]/.test(value) },
    { id: 'special', label: 'Un caracter especial', test: (value) => /[^A-Za-z0-9]/.test(value) },
    { id: 'number', label: 'Un número', test: (value) => /\d/.test(value) },
]

export function isPasswordValid(value: string): boolean {

    return PASSWORD_RULES.every((rule) => rule.test(value))
}