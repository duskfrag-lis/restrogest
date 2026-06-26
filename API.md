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

### POST `/api/auth/verify-email`
Ruta pública. Verifica el correo de un usuario recién registrado usando el token enviado por correo (válido 24h).

**Body:**
```json
{
  "token": "string (requerido)"
}
```

**Respuesta exitosa `200`:**
```json
{ "message": "Correo verificado correctamente. Ya puedes iniciar sesión." }
```

**Errores:**
- `400` — Token faltante, inválido o expirado

---

### POST `/api/auth/forgot-password`
Ruta pública. Solicita un enlace de recuperación de contraseña (válido 30 minutos). Por seguridad, siempre responde con el mismo mensaje genérico, exista o no el correo en el sistema, y aunque la cuenta use Google como proveedor.

**Body:**
```json
{
  "email": "string (requerido)"
}
```

**Respuesta exitosa `200`:**
```json
{ "message": "Si el correo existe en nuestro sistema, recibirás un enlace de recuperación." }
```

---

### POST `/api/auth/reset-password`
Ruta pública. Restablece la contraseña usando el token recibido por correo.

**Body:**
```json
{
  "token": "string (requerido)",
  "password": "string (requerido, mín. 8 caracteres)"
}
```

**Respuesta exitosa `200`:**
```json
{ "message": "Contraseña actualizada correctamente. Ya puedes iniciar sesión." }
```

**Errores:**
- `400` — Contraseña muy corta, o token inválido/expirado

---

### GET `/api/auth/google`
Ruta pública. Redirige al flujo de autenticación de Google OAuth2.

**Respuesta:** Redirect a la pantalla de selección de cuenta de Google.

---

### GET `/api/auth/google/callback`
Ruta pública. Callback que Google llama tras la autorización del usuario. Crea el usuario si no existe (con `provider: 'google'`, correo ya verificado y rol `cliente`), emite el JWT y setea la cookie de sesión.

**Respuesta exitosa:** Redirect a `{FRONTEND_URL}/auth/success`

**Errores:**
- Si el correo ya está registrado con un proveedor distinto a Google (`local`), redirige a `{FRONTEND_URL}/login?error=google_auth_failed`

---

## Rate limiting

Las siguientes rutas tienen límite de requests por IP para prevenir ataques de fuerza bruta:

| Ruta | Límite | Ventana |
|---|---|---|
| `POST /api/auth/register` | 10 requests | 15 minutos |
| `POST /api/auth/login` | 10 requests | 15 minutos |
| `POST /api/auth/forgot-password` | 5 requests | 15 minutos |
| `POST /api/auth/reset-password` | 5 requests | 15 minutos |

Al exceder el límite, el sistema responde `429 Too Many Requests` con:
```json
{ "message": "Demasiados intentos. Intenta de nuevo en unos minutos." }
```

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
- `400` — Faltan campos, o la cuenta usa Google como proveedor, o el correo no ha sido verificado
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

---

## Menú — `/api/menu`
### GET `/api/menu/categories`
Ruta pública. Lista todas las categorías del menú.

**Query params:**
- `onlyActive` (opcional) - `true` para mostrar solo categorías activas

**Respuesta exitosa `200`:**
```json
{
  "categories": [
    {
      "id": "uuid",
      "name": "string",
      "description": "string | null",
      "sort_order": "number",
      "is_active": "boolean",
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
  ]
}
```
---

## GET `api/menu/categories/:id`
Ruta pública. Obtiene una categoria por su ID.

**Respuesta exitosa `200`:**
```json
{
  "category": { /*mismo shape que arriba */ }
}
```
**Errores:**

- `404` - Categoría no encontrada

---

## POST `api/menu/categories`
Requiere autenticación + rol `administrador`. Crea una categoría.

**Body:**
```json
{
  "name": "string (requerido)",
  "description": "string (opcional)",
  "sort_order": "number (opcional)"
}
```

**Respuesta exitosa `201`:**
```json
{
  "result": { /* categoría creada */ }
}
```

**Errores:**
- `400` - Nombre faltante
- `401` - No autenticado
- `403` - Rol distinto a administrador

---

## PUT `api/menu/categories/:id`
Requiere autenticación + rol `administrador`. Actualiza una categoría existente.

**Body (todos opcionales):**
```json
{
  "name": "string",
  "description": "string",
  "sort_order": "number",
  "is_active": "boolean"
}
```

**Respuesta exitosa `200`:**
```json
{
  "result": { /* categoría actualizada */ }
}
```

**Errores:**
- `401` - No autenticado
- `403` - Rol distinto a administrador
- `404` - Categoría no encontrada

---

## PATCH `api/menu/categories/:id/toggle`
Requiere autenticación + rol `administrador`. Activa o desactiva una categoría.

**Body:** ninguno

**Respuesta exitosa `200`:**
```json
{
  "message": "Categoría Activada correctamente",
  "category": { /* categoria actualizada */ }
}
```

**Errores:**
- `401` - no autenticado
- `403` - Rol distinto a administrador
- `404` - Categoria no encontrada

---

## GET `api/menu/items`
Ruta pública. Lista todos los ítems del menú.

**Query params:**
- `onlyActive` (opcional) - `true` para mostrar solo ítems activos

**Respuesta exitosa `200`:**
```json
{
  "items": [
    {
      "id": "uuid",
      "category_id": "uuid",
      "name": "string",
      "description": "string | null",
      "price": "number",
      "image_url": "string | null",
      "is_active": "boolean",
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
  ]
}
```

---

## GET `api/menu/items/:id`
Ruta pública. Obtiene un ítem por su ID.

**Respuesta exitosa `200`:**
```json
{ "item": { /* mismo shape que arriba */ }}
```

**Errores:**
- `404` - ítem no encontrado

---

## GET `api/menu/categories/:id/items`
Ruta pública. Lista los ítems de una categoría específica.

**Query params:**
- `onlyActive` (opcional) - `true`para mostrar solo ítems activos

**Respuesta exitosa `200`:**
```json
{ "items": [ /* array de items */ ]}
```
**Errores:**
- `404` - Categoría no encontrada

---

## POST `api/menu/items`
Requiere autenticación + rol `administrador`. Crea un nuevo ítem con imagen opcional.

**Body (multipart/form-data)**
| Campo | Tipo | Requerido |
|-------|------|-----------|
| `category_id` | string (uuid) | Sí |
| `name` | string | Sí |
| `description` | string | No |
| `price` | number | Sí |
| `image` | file | No |

**Formatos de imagen aceptados: JPEG, PNG, WebP (máx. 5MB)**

**Respuesta exitosa `201`:**
```json
{
  "result": { /*item creado*/ }
}
```

**Errores:**

- `400` - Campos obligatorios faltantes, precio negativo, o categoría inactiva
- `401` - No autenticado
- `403` - Rol distinto a administrador
- `404` - Categoría no encontrada

---

## PUT `api/menu/items/:id`
Requiere autenticación + rol `administrador`. Actualiza un ítem existente con imagen opcional. Si se envía una nueva imagen, la anterior se elimina de Cloudinary.

**Body (multipart/form-data, todos opcionales):**
| Campo | Tipo |
|-------|------|
| category_id | string (uuid) |
| name | string |
| description | string |
| price | number |
| is_active | boolean |
| image | file |

**Formatos de imagen aceptados: JPEG, PNG, WebP (máx. 5MB)**

**Respuesta exitosa `200`:**
```json
{
  "result": { /* item actualizado */ }
}
```

**Errores:**

- `400` - Precio negativo, o categoría no encontrada
- `401` - No autenticado
- `403` - Rol distinto a administrador
- `404` - ítem no encontrado

---

## PATCH `api/menu/items/:id/toggle`
Requiere autenticación + rol `administrador`. Activa o desactiva un ítem.

**Body:** ninguno

**Respuesta exitosa `200`:**
```json
{
  "message": "Ítem activado correctamente",
  "item": { /* item actualizado*/ }
}
```

**Errores:**

- `401` - No autenticado
- `403` - Rol distinto a administrador
- `404` - ítem no encontrado 