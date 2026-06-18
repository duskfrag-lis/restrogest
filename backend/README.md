# RestroGest Backend

Backend HTTP de RestroGest construido con Node.js, Express, TypeScript y PostgreSQL. Su responsabilidad actual es exponer la API de autenticación y preparar la base de datos mediante migraciones SQL.

## Para que sirve

Este backend centraliza el acceso de usuarios al sistema. Permite registrar clientes, iniciar sesión con correo y contraseña, cerrar sesión y consultar la sesión activa desde una cookie segura para el navegador.

## Como funciona la autenticacion

El modulo `auth` vive en `src/modules/auth` y se divide en rutas, controlador, servicio y repositorio:

- `auth.routes.ts`: declara los endpoints publicos y protegidos.
- `auth.controller.ts`: lee la peticion HTTP, responde errores y configura la cookie de sesion.
- `auth.service.ts`: contiene reglas de negocio como longitud minima de contrasena, cuenta activa, proveedor local, intentos fallidos y emision del JWT.
- `auth.repository.ts`: encapsula las consultas SQL de usuarios y roles.

Cuando un usuario inicia sesion correctamente, el backend devuelve los datos del usuario y guarda el JWT en una cookie `token` con `HttpOnly`, `SameSite=Lax`, `path=/` y duracion de 8 horas. El frontend no lee el token directamente; solo debe llamar la API con `credentials: 'include'`.

## Variables de entorno

Crear un archivo `.env` en `backend/` usando `.env.example` como base:

```env
PORT=3000
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://usuario:contrasena@localhost:5432/restrogest
JWT_SECRET=una_clave_larga_y_privada
```

## Comandos

```bash
npm install
npm run migrate
npm run dev
npm run build
```

## Endpoints actuales

- `GET /health`: verifica que el servidor esta activo.
- `POST /api/auth/register`: crea usuario local con rol `cliente`.
- `POST /api/auth/login`: autentica y crea cookie de sesion.
- `POST /api/auth/logout`: limpia la cookie de sesion.
- `GET /api/auth/me`: devuelve el payload del JWT autenticado.

## Reglas importantes

- La contrasena de registro debe tener minimo 8 caracteres.
- El login bloquea temporalmente una cuenta despues de 5 intentos fallidos.
- Las rutas protegidas dependen de la cookie `token`; no se usa `Authorization: Bearer` en el frontend actual.
- Las migraciones SQL se ejecutan en orden alfabetico y registran cada archivo aplicado en la tabla `migrations`.
