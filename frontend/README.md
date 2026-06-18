# RestroGest Frontend

Frontend web de RestroGest construido con React, TypeScript y Vite. La primera funcionalidad implementada es la experiencia de autenticacion conectada al backend existente.

## Que es

Es la interfaz de entrada para los usuarios de RestroGest. Permite iniciar sesion, registrar usuarios cliente, restaurar una sesion activa por cookie y cerrar sesion.

## Para que sirve

Sirve como puerta de acceso al sistema antes de construir los modulos operativos del restaurante. El usuario no manipula tokens manualmente: el backend crea una cookie `HttpOnly` y el frontend solo envia credenciales incluidas en cada peticion.

## Como funciona

La arquitectura del auth esta organizada por capas:

- `features/auth/domain`: tipos del dominio y contrato del repositorio.
- `features/auth/application`: servicio de sesion usado por la UI.
- `features/auth/infrastructure`: implementacion HTTP conectada al backend.
- `features/auth/presentation`: provider, hook y componentes visuales.
- `shared/infrastructure/http`: cliente HTTP comun con manejo de errores.

El flujo principal es:

1. La app inicia y llama `GET /api/auth/me` para validar si existe una cookie activa.
2. Login llama `POST /api/auth/login` con `email` y `password`.
3. Registro llama `POST /api/auth/register` con nombre, apellido, telefono opcional, correo y contrasena.
4. Logout llama `POST /api/auth/logout` y limpia la sesion local.

Todas las peticiones usan `credentials: 'include'` para que el navegador envie y reciba la cookie del backend.

## Variables de entorno

Crear `frontend/.env` desde este ejemplo:

```env
VITE_API_URL=http://localhost:3000/api
```

Si el backend esta en otro puerto durante desarrollo, cambia el valor. Ejemplo:

```env
VITE_API_URL=http://localhost:3003/api
```

## Comandos

```bash
npm install
npm run dev
npm run build
npm run lint
```

## UI implementada

- Tema claro y oscuro con preferencia guardada en `localStorage`.
- Color principal rojo para identidad visual.
- Login y registro en una sola experiencia.
- Boton para mostrar u ocultar contrasena.
- Mensajes de error provenientes del backend.
- Pantalla de sesion autenticada con rol y cierre de sesion.
