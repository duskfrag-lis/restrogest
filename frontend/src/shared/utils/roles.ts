import type { AuthRole } from "../../modules/auth/types/auth.types";

const BACKOFFICE_ROLES: AuthRole[] = ['mesero', 'cocinero', 'jefe_cocina', 'domiciliario', 'administrador']

export function isBackofficeRole(role: AuthRole): boolean {

    return BACKOFFICE_ROLES.includes(role)
}

export function getDisclaimerMessage(role: AuthRole): string {

    if (role === 'administrador') {

        return 'Los administradores no pueden eliminar su propia cuenta.'
    } 

    return 'Si deseas dejar de trabajar en el restaurante, comunícate con el administrador para desactivar tu cuenta.'
}