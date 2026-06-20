# RestroGest — Documentación de API

Base URL local: `http://localhost:3000/api`

Todas las rutas protegidas requieren la cookie `token` (HttpOnly), seteada automáticamente al hacer login.
Desde el frontend se debe enviar cada petición autenticada con credenciales incluidas:

```typescript
fetch('http://localhost:3000/api/auth/me', {
  credentials: 'include'
});
```

---

## Auth — `/api/auth`

### POST `/api/auth/register`
Registra un nuevo usuario con rol `cliente` por defecto.

**Body:**
```json
{
  "first_name": "string (requerido)",
  "last_name": "string (requerido)",
  "phone": "string (opcional)",
  "email": "string (requerido)",
  "password": "string (requerido, mín. 8 caracteres)"
}
```

**Respuesta exitosa `201`:**
```json
{
  "message": "Registro exitoso. Revisa tu correo para verificar tu cuenta.",
  "user": {
    "id": "uuid",
    "first_name": "string",
    "last_name": "string",
    "email": "string"
  }
}
```

**Errores:**
- `400` — Faltan campos obligatorios
- `400` — La contraseña tiene menos de 8 caracteres
- `409` — El correo ya está registrado

---

### POST `/api/auth/login`
Autentica un usuario y setea la cookie `token` (JWT, HttpOnly, expira en 8h). La cookie usa `SameSite=Lax`, `path=/` y `Secure` solo cuando `NODE_ENV=production`.

**Body:**
```json
{
  "email": "string (requerido)",
  "password": "string (requerido)"
}
```

**Respuesta exitosa `200`:**
```json
{
  "message": "Inicio de sesión exitoso",
  "user": {
    "id": "uuid",
    "first_name": "string",
    "last_name": "string",
    "email": "string",
    "role": "cliente | mesero | cocinero | jefe_cocina | domiciliario | administrador"
  }
}
```

**Errores:**
- `400` — Faltan campos, o la cuenta usa Google como proveedor
- `401` — Credenciales inválidas
- `403` — Cuenta desactivada
- `429` — Cuenta bloqueada temporalmente por intentos fallidos (5 intentos, bloqueo de 15 min)

---

### POST `/api/auth/logout`
Cierra la sesión actual, limpiando la cookie `token` con las mismas opciones base usadas al crearla.

**Body:** ninguno

**Respuesta exitosa `200`:**
```json
{ "message": "Sesión cerrada correctamente" }
```

---

### GET `/api/auth/me`
Requiere autenticación. Devuelve la información del usuario autenticado a partir del token.

**Respuesta exitosa `200`:**
```json
{
  "user": {
    "id": "uuid",
    "email": "string",
    "role": "string",
    "iat": "number (timestamp de emisión)",
    "exp": "number (timestamp de expiración)"
  }
}
```

**Errores:**
- `401` — No autenticado o token inválido/expirado

---

## Middlewares disponibles para futuras rutas

### `authenticate`
Verifica que exista un token válido en la cookie. Si no, responde `401`.

### `authorize(...roles)`
Verifica que el rol del usuario autenticado esté en la lista permitida. Si no, responde `403`.

**Ejemplo de uso en futuras rutas:**
```typescript
router.get('/admin/reports', authenticate, authorize('administrador'), reportsController.getReports);
```

---

## Users — `/api/users`

### POST `/api/users/activate`
Ruta pública. Activa la cuenta de un empleado usando el token enviado por correo y establece su contraseña.

**Body:**
```json
{
  "token": "string (requerido)",
  "password": "string (requerido, mín. 8 caracteres)"
}
```

**Respuesta exitosa `200`:**
```json
{ "message": "Cuenta activada correctamente. Ya puedes iniciar sesión." }
```

**Errores:**
- `400` — Token y/o contraseña faltantes, o token inválido/expirado

---

### GET `/api/users`
Requiere autenticación + rol `administrador`. Lista todos los usuarios del sistema.

**Query params:**
- `role` (opcional) — filtra por rol (`cliente`, `mesero`, `cocinero`, `jefe_cocina`, `domiciliario`, `administrador`)

**Respuesta exitosa `200`:**
```json
{
  "users": [
    {
      "id": "uuid",
      "first_name": "string",
      "last_name": "string",
      "email": "string",
      "phone": "string | null",
      "is_active": "boolean",
      "email_verified": "boolean",
      "provider": "local | google",
      "created_at": "timestamp",
      "role": "string"
    }
  ]
}
```

**Errores:**
- `401` — No autenticado
- `403` — Rol distinto a administrador

---

### GET `/api/users/:id`
Requiere autenticación + rol `administrador`. Obtiene un usuario por su ID.

**Respuesta exitosa `200`:**
```json
{ "user": { /* mismo shape que arriba */ } }
```

**Errores:**
- `401` — No autenticado
- `403` — Rol distinto a administrador
- `404` — Usuario no encontrado

---

### POST `/api/users/employees`
Requiere autenticación + rol `administrador`. Crea una cuenta de empleado sin contraseña y envía correo de activación (válido 24h).

**Body:**
```json
{
  "first_name": "string (requerido)",
  "last_name": "string (requerido)",
  "email": "string (requerido)",
  "phone": "string (opcional)",
  "role": "mesero | cocinero | jefe_cocina | domiciliario | administrador (requerido)"
}
```

**Respuesta exitosa `201`:**
```json
{
  "message": "Empleado creado correctamente. Se envió un correo de activación.",
  "user": {
    "id": "uuid",
    "first_name": "string",
    "last_name": "string",
    "email": "string"
  }
}
```

**Errores:**
- `400` — Campos faltantes o rol inválido
- `401` — No autenticado
- `403` — Rol distinto a administrador
- `409` — El correo ya está registrado

---

### PATCH `/api/users/:id/role`
Requiere autenticación + rol `administrador`. Cambia el rol de un usuario existente.

**Body:**
```json
{ "role": "string (requerido)" }
```

**Respuesta exitosa `200`:**
```json
{ "message": "Rol actualizado a '<rol>' correctamente" }
```

**Errores:**
- `400` — Rol inválido
- `401` — No autenticado
- `403` — Rol distinto a administrador
- `404` — Usuario no encontrado

---

### PATCH `/api/users/:id/status`
Requiere autenticación + rol `administrador`. Activa o desactiva la cuenta de un usuario. Si se desactiva, cualquier sesión activa de ese usuario queda invalidada de inmediato (verificación en tiempo real en cada request).

**Body:**
```json
{ "is_active": "boolean (requerido)" }
```

**Respuesta exitosa `200`:**
```json
{ "message": "Cuenta activada correctamente" }
```
o
```json
{ "message": "Cuenta desactivada correctamente" }
```

**Errores:**
- `400` — `is_active` no es booleano
- `401` — No autenticado
- `403` — Rol distinto a administrador
- `404` — Usuario no encontrado
