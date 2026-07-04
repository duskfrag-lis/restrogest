# RestroGest — Documentación de API

Base URL local: `http://localhost:3000/api`

Todas las rutas protegidas requieren la cookie `token` (HttpOnly), seteada automáticamente al hacer login.
Desde el frontend se debe enviar cada petición autenticada con credenciales incluidas:

```typescript
fetch('http://localhost:3000/api/auth/me', {
  credentials: 'include'
});
```

## Índice

- [Auth](#auth)
- [Users](#users)
- [Profile](#profile)
- [Menu](#menu)
- [Tables](#tables)
- [Orders](#orders)
- [Kitchen](#kitchen)
- [Reservations](#reservations)
- [Delivery](#delivery)
- [Inventory](#inventory)
- [Payments](#payments)
- [Reports](#reports)
- [Reviws](#reviews)
- [News](#news)
- [Reports](#reports)
- [Restaurant_info](#restaurant-info)

---

## Auth
`/api/auth`

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

## Users
`/api/users`

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

## Menú 
`/api/menu`

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

---

### Perfil 
`/api/profile`

Todos los endpoinst requieren autenticación. El `id` del usuario se obtiene del token JWT - un usuario solo puede gestionar sus propio perfil.

---

## GET `api/profile`
Requiere autenticación. Devuelve el perfil del usuario autenticado.

**Respuesta exitosa `200`:**
```json
{
  "user": {
    "id": "uuid",
    "first_name": "string",
    "last_name": "string",
    "email": "string",
    "phone": "string | null",
    "photo_url": "string |null",
    "provider": "local | google",
    "email_verified": "boolean",
    "is_active": "boolean",
    "created_at": "timestamp",
    "role": "string"
  }
}
```

**Errores:**
- `401` - No autenticado

---

### PUT `/api/profile`
Requiere autenticación. Actualiza los datos personales del usuario. Acepta imagen de perfil opcional.

**Body (multipart/form-data, todos opcionales):**
| Campo | Tipo |
|---|---|
| first_name | string |
| last_name | string |
| phone | string |
| image | file (JPEG, PNG, WebP, máx. 5MB) |

**Respuesta exitosa `200`:**
```json
{ "user": { /* perfil actualizado */ } }
```

**Errores:**
- `401` — No autenticado
- `404` — Usuario no encontrado

---

### PATCH `/api/profile/change-password`
Requiere autenticación. Cambia la contraseña del usuario validando la actual primero.

**Body:**
```json
{
  "currentPassword": "string (requerido)",
  "newPassword": "string (requerido, mín. 8 caracteres)"
}
```

**Respuesta exitosa `200`:**
```json
{ "message": "Contraseña actualizada correctamente" }
```

**Errores:**
- `400` — Campos faltantes o nueva contraseña muy corta
- `401` — No autenticado o contraseña actual incorrecta
- `404` — Usuario no encontrado

---

### DELETE `/api/profile`
Requiere autenticación. Elimina la cuenta del usuario (soft delete). La sesión se cierra inmediatamente. Los administradores no pueden eliminar su propia cuenta.

**Respuesta exitosa `200`:**
```json
{ "message": "Cuenta eliminada correctamente" }
```

**Errores:**
- `401` — No autenticado
- `403` — El usuario es administrador
- `404` — Usuario no encontrado

---

## Tables 
`/api/tables`

### GET `/api/tables`
Ruta pública. Lista todas las mesas con su estado actual.

**Respuesta exitosa `200`:**
```json
{
  "tables": [
    {
      "id": "uuid",
      "number": "number",
      "capacity": "number",
      "status": "disponible | ocupada | reservada | en_limpieza",
      "updated_at": "timestamp"
    }
  ]
}
```

---

### GET `/api/tables/:id`
Ruta pública. Obtiene una mesa por su ID.

**Respuesta exitosa `200`:**
```json
{ "table": { /* mismo shape que arriba */ } }
```

**Errores:**
- `404` — Mesa no encontrada

---

### POST `/api/tables`
Requiere autenticación + rol `administrador`. Crea una nueva mesa.

**Body:**
```json
{
  "number": "number (requerido, único)",
  "capacity": "number (requerido, mín. 1)"
}
```

**Respuesta exitosa `201`:**
```json
{ "table": { /* mesa creada */ } }
```

**Errores:**
- `400` — Campos faltantes o capacidad inválida
- `401` — No autenticado
- `403` — Rol distinto a administrador
- `409` — Ya existe una mesa con ese número

---

### PUT `/api/tables/:id`
Requiere autenticación + rol `administrador`. Actualiza número y/o capacidad de una mesa.

**Body (todos opcionales):**
```json
{
  "number": "number",
  "capacity": "number"
}
```

**Respuesta exitosa `200`:**
```json
{ "table": { /* mesa actualizada */ } }
```

**Errores:**
- `400` — Capacidad inválida
- `401` — No autenticado
- `403` — Rol distinto a administrador
- `404` — Mesa no encontrada
- `409` — Ya existe una mesa con ese número

---

### PATCH `/api/tables/:id/status`
Requiere autenticación + rol `administrador` o `mesero`. Cambia el estado de una mesa. Una mesa en estado `reservada` no puede pasar directamente a `ocupada`.

**Body:**
```json
{ "status": "disponible | ocupada | reservada | en_limpieza" }
```

**Respuesta exitosa `200`:**
```json
{ "table": { /* mesa con nuevo estado */ } }
```

**Errores:**
- `400` — Estado inválido o transición no permitida (reservada → ocupada)
- `401` — No autenticado
- `403` — Rol no permitido
- `404` — Mesa no encontrada

---

### DELETE `/api/tables/:id`
Requiere autenticación + rol `administrador`. Elimina una mesa. Solo se pueden eliminar mesas en estado `disponible`.

**Respuesta exitosa `200`:**
```json
{ "message": "Mesa eliminada correctamente" }
```

**Errores:**
- `400` — La mesa no está disponible
- `401` — No autenticado
- `403` — Rol distinto a administrador
- `404` — Mesa no encontrada

---

## Orders 
`/api/orders`

Todos los endpoints requieren autenticación.

### GET `/api/orders`
Requiere autenticación + rol `mesero` o `administrador`. Lista todos los pedidos.

**Query params:**
- `status` (opcional) — filtra por estado (`pendiente`, `en_preparacion`, `listo`, `entregado`, `cerrado`, `cancelado`)

**Respuesta exitosa `200`:**
```json
{
  "orders": [
    {
      "id": "uuid",
      "table_id": "uuid",
      "waiter_id": "uuid",
      "type": "mesa | domicilio",
      "status": "string",
      "total": "number",
      "table_number": "number",
      "waiter_first_name": "string",
      "waiter_last_name": "string",
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
  ]
}
```

---

### GET `/api/orders/:id`
Requiere autenticación + rol `mesero` o `administrador`. Obtiene un pedido con sus ítems.

**Respuesta exitosa `200`:**
```json
{
  "order": {
    /* datos del pedido */
    "items": [
      {
        "id": "uuid",
        "menu_item_id": "uuid",
        "item_name": "string",
        "quantity": "number",
        "unit_price": "number",
        "notes": "string | null",
        "status": "pendiente | en_preparacion | listo"
      }
    ]
  }
}
```

**Errores:**
- `404` — Pedido no encontrado

---

### GET `/api/orders/table/:tableId`
Requiere autenticación + rol `mesero` o `administrador`. Lista los pedidos activos de una mesa.

**Errores:**
- `404` — Mesa no encontrada

---

### POST `/api/orders`
Requiere autenticación + rol `mesero` o `administrador`. Abre un nuevo pedido en mesa. Si la mesa estaba disponible, pasa automáticamente a ocupada.

**Body:**
```json
{ "table_id": "uuid (requerido)" }
```

**Respuesta exitosa `201`:**
```json
{ "order": { /* pedido creado */ } }
```

**Errores:**
- `400` — Mesa en estado no permitido (reservada o en_limpieza)
- `404` — Mesa no encontrada

---

### POST `/api/orders/:id/items`
Requiere autenticación + rol `mesero` o `administrador`. Agrega un ítem al pedido. Solo funciona si el pedido está en estado `pendiente`.

**Body:**
```json
{
  "menu_item_id": "uuid (requerido)",
  "quantity": "number (requerido)",
  "notes": "string (opcional)"
}
```

**Respuesta exitosa `201`:**
```json
{ "item": { /* ítem agregado con precio al momento del pedido */ } }
```

**Errores:**
- `400` — Pedido ya enviado a cocina, ítem inactivo, o campos faltantes
- `404` — Pedido o ítem del menú no encontrado

---

### DELETE `/api/orders/:id/items/:itemId`
Requiere autenticación + rol `mesero` o `administrador`. Elimina un ítem del pedido. Solo funciona si el pedido está en estado `pendiente`.

**Respuesta exitosa `200`:**
```json
{ "message": "Ítem eliminado del pedido" }
```

**Errores:**
- `400` — Pedido ya enviado a cocina
- `404` — Pedido no encontrado

---

### PATCH `/api/orders/:id/send-to-kitchen`
Requiere autenticación + rol `mesero` o `administrador`. Envía el pedido a cocina — cambia el estado de `pendiente` a `en_preparacion`. El pedido ya no puede modificarse después de esto.

**Respuesta exitosa `200`:**
```json
{ "order": { /* pedido actualizado */ } }
```

**Errores:**
- `400` — Pedido ya enviado o sin ítems
- `404` — Pedido no encontrado

---

### PATCH `/api/orders/:id/status`
Requiere autenticación + rol `mesero`, `cocinero`, `jefe_cocina` o `administrador`. Cambia el estado del pedido siguiendo las transiciones válidas.

**Transiciones válidas:**
pendiente → en_preparacion | cancelado

en_preparacion → listo | cancelado

listo → entregado

entregado → cerrado

**Reglas:**
- Solo el administrador puede cancelar un pedido
- Solo el mesero o administrador pueden cerrar un pedido
- Al cerrar un pedido, la mesa vuelve automáticamente a `disponible`

**Body:**
```json
{ "status": "string (requerido)" }
```

**Respuesta exitosa `200`:**
```json
{ "order": { /* pedido con nuevo estado */ } }
```

**Errores:**
- `400` — Transición de estado no permitida
- `403` — Rol no permitido para esa transición
- `404` — Pedido no encontrado

---

## Kitchen 
`/api/kitchen`

Todos los endpoints requieren autenticación. Roles permitidos: `cocinero`, `jefe_cocina`, `administrador`.

### GET `/api/kitchen`
Lista todos los pedidos activos en cocina (estados `pendiente` y `en_preparacion`), con sus ítems.

**Respuesta exitosa `200`:**
```json
{
  "orders": [
    {
      "id": "uuid",
      "status": "pendiente | en_preparacion",
      "table_number": "number",
      "waiter_first_name": "string",
      "waiter_last_name": "string",
      "created_at": "timestamp",
      "items": [
        {
          "id": "uuid",
          "item_name": "string",
          "quantity": "number",
          "notes": "string | null",
          "status": "pendiente | en_preparacion | listo"
        }
      ]
    }
  ]
}
```

---

### GET `/api/kitchen/:id`
Obtiene un pedido específico con todos sus ítems.

**Errores:**
- `404` — Pedido no encontrado

---

### PATCH `/api/kitchen/:id/items/:itemId/status`
Cambia el estado de un ítem específico. Si todos los ítems pasan a `listo`, el pedido se marca automáticamente como `listo` y se notifica al mesero via Socket.io.

**Body:**
```json
{ "status": "pendiente | en_preparacion | listo" }
```

**Respuesta exitosa `200`:**
```json
{ "item": { /* ítem actualizado */ } }
```

**Errores:**
- `400` — Estado inválido
- `404` — Pedido o ítem no encontrado

---

### PATCH `/api/kitchen/:id/ready`
Marca todos los ítems y el pedido completo como `listo` de una sola vez. Notifica al mesero via Socket.io.

**Respuesta exitosa `200`:**
```json
{ "order": { /* pedido actualizado */ } }
```

**Errores:**
- `400` — Pedido no está en preparación
- `404` — Pedido no encontrado

---

## Eventos Socket.io

El servidor emite estos eventos en tiempo real:

| Evento | Sala | Descripción |
|---|---|---|
| `new_order` | `kitchen` | Nuevo pedido enviado a cocina |
| `item_status_updated` | `kitchen` | Estado de un ítem actualizado |
| `order_ready` | `kitchen` | Pedido marcado como listo |
| `order_ready` | `waiter_{id}` | Notificación al mesero del pedido listo |

**Para conectarse a una sala desde el frontend:**
```javascript
socket.emit('join_kitchen');         // cocinero/jefe_cocina
socket.emit('join_waiter', userId);  // mesero
```

---

## Delivery 
`/api/delivery`

### GET `/api/delivery/coverage`
Ruta pública. Obtiene la zona de cobertura configurada del restaurante.

**Respuesta exitosa `200`:**
```json
{
  "zones": {
    "type": "radius",
    "center_lat": "number",
    "center_lng": "number",
    "radius_km": "number"
  }
}
```

**Errores:**
- `404` — No hay zonas configuradas

---

### PUT `/api/delivery/coverage`
Requiere autenticación + rol `administrador`. Configura la zona de cobertura del restaurante.

**Body:**
```json
{
  "type": "radius",
  "center_lat": "number (requerido)",
  "center_lng": "number (requerido)",
  "radius_km": "number (requerido, mayor a 0)"
}
```

**Respuesta exitosa `200`:**
```json
{ "message": "Zona de cobertura actualizada correctamente" }
```

---

### GET `/api/delivery`
Requiere autenticación + rol `administrador`. Lista todos los pedidos a domicilio.

**Query params:**
- `status` (opcional) — filtra por estado (`recibido`, `en_preparacion`, `en_camino`, `entregado`)

**Respuesta exitosa `200`:**
```json
{
  "deliveries": [
    {
      "id": "uuid",
      "order_id": "uuid",
      "client_id": "uuid",
      "deliverer_id": "uuid | null",
      "address": "string",
      "phone": "string",
      "status": "string",
      "payment_method": "string",
      "payment_status": "string",
      "client_lat": "number",
      "client_lng": "number",
      "client_first_name": "string",
      "client_last_name": "string",
      "deliverer_first_name": "string | null",
      "deliverer_last_name": "string | null",
      "total": "number",
      "created_at": "timestamp"
    }
  ]
}
```

---

### GET `/api/delivery/my`
Requiere autenticación + rol `cliente`. Lista los pedidos a domicilio del cliente autenticado.

**Respuesta exitosa `200`:**
```json
{ "deliveries": [ /* array de domicilios */ ] }
```

---

### GET `/api/delivery/:id`
Requiere autenticación + rol `cliente`, `domiciliario` o `administrador`. Obtiene un pedido a domicilio por su ID.

**Errores:**
- `404` — Pedido no encontrado

---

### POST `/api/delivery`
Requiere autenticación + rol `cliente`. Crea un pedido a domicilio. Valida que la ubicación esté dentro de la zona de cobertura usando la fórmula de Haversine.

**Body:**
```json
{
  "items": [
    {
      "menu_item_id": "uuid (requerido)",
      "quantity": "number (requerido)",
      "notes": "string (opcional)"
    }
  ],
  "address": "string (requerido)",
  "phone": "string (requerido)",
  "payment_method": "efectivo | tarjeta | pse | contra_entrega (requerido)",
  "client_lat": "number (requerido)",
  "client_lng": "number (requerido)"
}
```

**Respuesta exitosa `201`:**
```json
{ "delivery": { /* pedido a domicilio creado */ } }
```

**Errores:**
- `400` — Campos faltantes, método de pago inválido, ubicación fuera de cobertura, o sin ítems
- `404` — Ítem del menú no encontrado o inactivo

---

### PATCH `/api/delivery/:id/status`
Requiere autenticación + rol `domiciliario` o `administrador`. Cambia el estado del pedido.

**Transiciones válidas:**
recibido -> en_preparacion
en_preparacion -> en_camino
en_camino -> entregado

**Reglas:**
- `en_camino` — domiciliario o administrador
- `entregado` — domiciliario o administrador

**Body:**
```json
{ "status": "string (requerido)" }
```

**Errores:**
- `400` — Estado inválido o transición no permitida
- `403` — Rol no permitido para esa transición
- `404` — Pedido no encontrado

---

### PATCH `/api/delivery/:id/assign`
Requiere autenticación + rol `administrador`. Asigna un domiciliario a un pedido.

**Body:**
```json
{ "deliverer_id": "uuid (requerido)" }
```

**Respuesta exitosa `200`:**
```json
{ "delivery": { /* pedido actualizado con domiciliario */ } }
```

**Errores:**
- `400` — El usuario no existe o no tiene rol de domiciliario
- `404` — Pedido no encontrado

---

## Reservations 
`/api/reservations`

### GET `/api/reservations/available`
Ruta pública. Lista las mesas disponibles para una fecha y número de personas específicos.

**Query params:**
- `reserved_at` (requerido) — fecha y hora en formato ISO (`2026-07-15T19:00:00`)
- `party_size` (requerido) — número de personas

**Respuesta exitosa `200`:**
```json
{
  "tables": [
    {
      "id": "uuid",
      "number": "number",
      "capacity": "number",
      "status": "string"
    }
  ]
}
```

**Errores:**
- `400` — Fecha inválida o menos de 2 horas de anticipación

---

### GET `/api/reservations/today`
Requiere autenticación + rol `mesero` o `administrador`. Lista las reservas confirmadas del día en orden cronológico.

**Respuesta exitosa `200`:**
```json
{
  "reservations": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "table_id": "uuid",
      "reserved_at": "timestamp",
      "party_size": "number",
      "status": "confirmada",
      "notes": "string | null",
      "first_name": "string",
      "last_name": "string",
      "email": "string",
      "table_number": "number",
      "capacity": "number"
    }
  ]
}
```

---

### GET `/api/reservations/my`
Requiere autenticación + rol `cliente`. Lista las reservas del cliente autenticado.

**Respuesta exitosa `200`:**
```json
{ "reservations": [ /* array de reservas */ ] }
```

---

### GET `/api/reservations`
Requiere autenticación + rol `administrador`. Lista todas las reservas del sistema.

---

### GET `/api/reservations/:id`
Requiere autenticación + rol `cliente`, `mesero` o `administrador`. Obtiene una reserva por su ID.

**Errores:**
- `404` — Reserva no encontrada

---

### POST `/api/reservations`
Requiere autenticación + rol `cliente`. Crea una reserva. Envía confirmación por correo automáticamente.

**Body:**
```json
{
  "table_id": "uuid (requerido)",
  "reserved_at": "string ISO (requerido)",
  "party_size": "number (requerido)",
  "notes": "string (opcional)"
}
```

**Respuesta exitosa `201`:**
```json
{ "reservation": { /* reserva creada */ } }
```

**Errores:**
- `400` — Campos faltantes, menos de 2h de anticipación, capacidad insuficiente, o mesa no disponible
- `404` — Mesa no encontrada

---

### PATCH `/api/reservations/:id/cancel`
Requiere autenticación + rol `cliente` o `administrador`. Cancela una reserva.

**Reglas:**
- El cliente solo puede cancelar sus propias reservas y con mínimo 1 hora de anticipación
- El administrador puede cancelar cualquier reserva en cualquier momento

**Respuesta exitosa `200`:**
```json
{ "reservation": { /* reserva cancelada */ } }
```

**Errores:**
- `400` — Reserva ya cancelada o menos de 1h de anticipación
- `403` — El cliente intenta cancelar una reserva que no es suya
- `404` — Reserva no encontrada

---

### PATCH `/api/reservations/:id/no-show`
Requiere autenticación + rol `mesero` o `administrador`. Marca una reserva como no presentado y libera la mesa automáticamente. Solo disponible después de 15 minutos de la hora reservada.

**Respuesta exitosa `200`:**
```json
{ "message": "Reserva marcada como no presentado y mesa liberada" }
```

**Errores:**
- `400` — Reserva no confirmada o aún no han pasado 15 minutos
- `404` — Reserva no encontrada

## Inventory 
`/api/inventory`

### GET `/api/inventory/low-stock`
Requiere autenticación + rol `administrador` o `jefe_cocina`. Lista los ítems cuya cantidad está en o por debajo de su umbral mínimo.

Respuesta exitosa `200`:
```json
{
  "items": [
    {
      "id": "uuid",
      "name": "string",
      "quantity": "number",
      "unit": "string",
      "min_threshold": "number",
      "expiry_date": "date | null",
      "is_low_stock": "boolean",
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
  ]
}
```

### GET `/api/inventory/expiring-soon`
Requiere autenticación + rol `administrador` o `jefe_cocina`. Lista los ítems que vencen dentro de los próximos 7 días (o el número de días indicado).

Query params:
- `days` (opcional) — número de días hacia adelante para considerar. Default: `7`

Respuesta exitosa `200`:
```json
{
  "items": [
    {
      "id": "uuid",
      "name": "string",
      "quantity": "number",
      "unit": "string",
      "min_threshold": "number",
      "expiry_date": "date",
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
  ]
}
```

### GET `/api/inventory/expired`
Requiere autenticación + rol `administrador` o `jefe_cocina`. Lista los ítems cuya fecha de vencimiento ya pasó.

Respuesta exitosa `200`:
```json
{
  "items": [
    {
      "id": "uuid",
      "name": "string",
      "quantity": "number",
      "unit": "string",
      "min_threshold": "number",
      "expiry_date": "date",
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
  ]
}
```

### GET `/api/inventory/alerts`
Requiere autenticación + rol `administrador` o `jefe_cocina`. Devuelve un resumen consolidado de alertas: ítems con bajo stock, próximos a vencer y vencidos.

Respuesta exitosa `200`:
```json
{
  "alerts": {
    "low_stock": [ /* array de ítems */ ],
    "expiring_soon": [ /* array de ítems */ ],
    "expired": [ /* array de ítems */ ],
    "total": "number"
  }
}
```

### GET `/api/inventory/movements`
Requiere autenticación + rol `administrador`. Lista el historial completo de movimientos de inventario de todos los ítems.

Respuesta exitosa `200`:
```json
{
  "movements": [
    {
      "id": "uuid",
      "item_id": "uuid",
      "quantity_change": "number",
      "reason": "string | null",
      "change_by": "uuid",
      "created_at": "timestamp",
      "first_name": "string",
      "last_name": "string",
      "item_name": "string"
    }
  ]
}
```

### GET `/api/inventory`
Requiere autenticación + rol `administrador` o `jefe_cocina`. Lista todos los ítems de inventario.

Respuesta exitosa `200`:
```json
{
  "items": [
    {
      "id": "uuid",
      "name": "string",
      "quantity": "number",
      "unit": "string",
      "min_threshold": "number",
      "expiry_date": "date | null",
      "is_low_stock": "boolean",
      "is_expired": "boolean",
      "expires_soon": "boolean",
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
  ]
}
```

### POST `/api/inventory`
Requiere autenticación + rol `administrador` o `jefe_cocina`. Crea un nuevo ítem de inventario.

Body:
```json
{
  "name": "string (requerido)",
  "quantity": "number (requerido)",
  "unit": "string (requerido)",
  "min_threshold": "number (requerido)",
  "expiry_date": "string ISO (opcional)"
}
```

Respuesta exitosa `201`:
```json
{ "message": "ítem de inventario creado exitosamente", "item": { /* ítem creado */ } }
```

Errores:
- `400` — Nombre, cantidad, unidad o umbral mínimo faltantes o inválidos
- `409` — Ya existe un ítem con ese nombre

### GET `/api/inventory/:id`
Requiere autenticación + rol `administrador` o `jefe_cocina`. Obtiene un ítem de inventario por su ID.

Errores:
- `404` — Ítem de inventario no encontrado

### PUT `/api/inventory/:id`
Requiere autenticación + rol `administrador` o `jefe_cocina`. Actualiza los datos de un ítem (nombre, unidad, umbral mínimo, fecha de vencimiento). No permite modificar la cantidad directamente.

Body:
```json
{
  "name": "string (opcional)",
  "unit": "string (opcional)",
  "min_threshold": "number (opcional)",
  "expiry_date": "string ISO (opcional)"
}
```

Respuesta exitosa `200`:
```json
{ "message": "Ítem de inventario actualizado exitosamente", "item": { /* ítem actualizado */ } }
```

Errores:
- `400` — Nombre excede 150 caracteres, o umbral mínimo negativo
- `404` — Ítem de inventario no encontrado
- `409` — Ya existe un ítem con ese nombre

### PATCH `/api/inventory/:id/quantity`
Requiere autenticación + rol `administrador` o `jefe_cocina`. Actualiza manualmente la cantidad de un ítem. Cada cambio queda registrado en el historial de movimientos.

Body:
```json
{
  "quantity": "number (requerido)",
  "reason": "string (opcional)"
}
```

Respuesta exitosa `200`:
```json
{ "message": "Cantidad actualizada exitosamente", "item": { /* ítem con cantidad actualizada */ } }
```

Errores:
- `400` — Cantidad faltante o negativa
- `401` — Usuario no autenticado
- `404` — Ítem de inventario no encontrado

### GET `/api/inventory/:id/movements`
Requiere autenticación + rol `administrador` o `jefe_cocina`. Lista el historial de movimientos de un ítem específico.

Respuesta exitosa `200`:
```json
{
  "movements": [
    {
      "id": "uuid",
      "item_id": "uuid",
      "quantity_change": "number",
      "reason": "string | null",
      "change_by": "uuid",
      "created_at": "timestamp",
      "first_name": "string",
      "last_name": "string"
    }
  ]
}
```

Errores:
- `404` — Ítem de inventario no encontrado

## Payments 
`/api/payments`

### POST `/api/payments/webhook`
Ruta pública, sin autenticación. Endpoint que consume Wompi para notificar el resultado de una transacción. Valida la firma del evento antes de procesar. Siempre responde `200` a Wompi (incluso ante errores internos) para evitar reintentos indefinidos del mismo evento; los errores se registran en logs del servidor.

Respuesta `200`:
```json
{ "received": true }
```

Errores:
- `401` — Firma de evento inválida

### GET `/api/payments`
Requiere autenticación + rol `administrador`. Lista todos los pagos del sistema.

Respuesta exitosa `200`:
```json
{
  "payments": [
    {
      "id": "uuid",
      "order_id": "uuid",
      "method": "string",
      "status": "string",
      "amount": "number",
      "transaction_id": "string | null",
      "created_at": "timestamp",
      "updated_at": "timestamp",
      "order_type": "string",
      "order_total": "number"
    }
  ]
}
```

### POST `/api/payments`
Requiere autenticación. Registra un pago para un pedido existente. Si el método es `tarjeta` o `pse`, devuelve además los datos necesarios para abrir el Widget de Wompi. Si el método es `efectivo` o `contra_entrega`, el pago queda `pendiente` y no requiere pasarela.

Body:
```json
{
  "order_id": "uuid (requerido)",
  "method": "string (requerido) - efectivo | tarjeta | pse | contra_entrega"
}
```

Respuesta exitosa `201` (método offline):
```json
{
  "message": "Pago registrado exitosamente",
  "payment": { /* pago creado */ },
  "checkout": null
}
```

Respuesta exitosa `201` (método online):
```json
{
  "message": "Pago registrado exitosamente",
  "payment": { /* pago creado */ },
  "checkout": {
    "public_key": "string",
    "currency": "COP",
    "amount_in_cents": "number",
    "reference": "uuid",
    "signature": { "integrity": "string" },
    "redirect_url": "string"
  }
}
```

Errores:
- `400` — `order_id` o `method` faltantes, o método inválido
- `404` — Pedido no encontrado
- `409` — El pedido ya tiene un pago aprobado

### GET `/api/payments/order/:orderId`
Requiere autenticación. Lista los pagos asociados a un pedido específico.

Respuesta exitosa `200`:
```json
{ "payments": [ /* array de pagos */ ] }
```

### GET `/api/payments/:id`
Requiere autenticación. Obtiene un pago por su ID.

Errores:
- `404` — Pago no encontrado

### PATCH `/api/payments/:id/confirm`
Requiere autenticación + rol `administrador`, `mesero` o `domiciliario`. Confirma o rechaza manualmente un pago pendiente (usado para `efectivo`/`contra_entrega`, o como respaldo si el webhook de Wompi falla). Si el pago queda `aprobado`, envía confirmación por correo al cliente (solo aplica a pedidos a domicilio) y actualiza el estado espejo en `delivery_orders`.

Body:
```json
{ "status": "string (requerido) - aprobado | rechazado" }
```

Respuesta exitosa `200`:
```json
{ "message": "Pago actualizado exitosamente", "payment": { /* pago actualizado */ } }
```

Errores:
- `400` — `status` inválido, o el pago ya no está en estado `pendiente`
- `404` — Pago no encontrado

### PATCH `/api/payments/:id/refund`
Requiere autenticación + rol `administrador`. Marca un pago como reembolsado. Proceso manual en v1 — no se comunica con la API de Wompi.

Respuesta exitosa `200`:
```json
{ "message": "Pago reembolsado exitosamente", "payment": { /* pago reembolsado */ } }
```

Errores:
- `400` — Solo se pueden reembolsar pagos en estado `aprobado`
- `404` — Pago no encontrado

---
## Reviews 
`/api/reviews`

### GET `/api/reviews/public`
Ruta pública. Lista las reseñas visibles junto con el promedio general de calificaciones del restaurante.

Respuesta exitosa `200`:
```json
{
  "reviews": [
    {
      "id": "uuid",
      "rating": "number",
      "comment": "string | null",
      "created_at": "timestamp",
      "first_name": "string",
      "last_name": "string"
    }
  ],
  "average_rating": "number",
  "total_reviews": "number"
}
```

### GET `/api/reviews`
Requiere autenticación + rol `administrador`. Lista todas las reseñas, incluyendo las ocultas.

Respuesta exitosa `200`:
```json
{
  "reviews": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "rating": "number",
      "comment": "string | null",
      "is_visible": "boolean",
      "created_at": "timestamp",
      "updated_at": "timestamp",
      "first_name": "string",
      "last_name": "string"
    }
  ]
}
```

### GET `/api/reviews/my`
Requiere autenticación. Lista las reseñas del usuario autenticado.

Respuesta exitosa `200`:
```json
{ "reviews": [ /* array de reseñas del usuario */ ] }
```

### POST `/api/reviews`
Requiere autenticación + rol `cliente`. Crea una reseña. Solo disponible para clientes que hayan completado al menos un pedido a domicilio.

Body:
```json
{
  "rating": "number (requerido) - entero entre 1 y 5",
  "comment": "string (opcional)"
}
```

Respuesta exitosa `201`:
```json
{ "message": "Reseña publicada exitosamente", "review": { /* reseña creada */ } }
```

Errores:
- `400` — Calificación faltante o fuera de rango (1-5)
- `403` — El cliente no ha completado ningún pedido a domicilio. Devuelve un mensaje explicativo, no un error genérico

### PATCH `/api/reviews/:id/visibility`
Requiere autenticación + rol `administrador`. Oculta o muestra una reseña. No permite editar el contenido de la reseña, solo su visibilidad.

Body:
```json
{ "is_visible": "boolean (requerido)" }
```

Respuesta exitosa `200`:
```json
{ "message": "Reseña ocultada exitosamente", "review": { /* reseña actualizada */ } }
```

Errores:
- `400` — `is_visible` faltante o no es booleano
- `404` — Reseña no encontrada

---

## News 
`/api/news`

### GET `/api/news/public`
Ruta pública. Lista las noticias publicadas, ordenadas por fecha de publicación descendente.

Respuesta exitosa `200`:
```json
{
  "news": [
    {
      "id": "uuid",
      "title": "string",
      "body": "string",
      "published_at": "timestamp",
      "author_first_name": "string",
      "author_last_name": "string"
    }
  ]
}
```

### GET `/api/news/public/:id`
Ruta pública. Obtiene una noticia publicada por su ID.

Errores:
- `404` — Noticia no encontrada

### GET `/api/news`
Requiere autenticación + rol `administrador`. Lista todas las noticias, incluyendo borradores no publicados.

Respuesta exitosa `200`:
```json
{
  "news": [
    {
      "id": "uuid",
      "author_id": "uuid",
      "title": "string",
      "body": "string",
      "is_published": "boolean",
      "published_at": "timestamp | null",
      "created_at": "timestamp",
      "updated_at": "timestamp",
      "author_first_name": "string",
      "author_last_name": "string"
    }
  ]
}
```

### POST `/api/news`
Requiere autenticación + rol `administrador`. Crea una noticia como borrador (no publicada).

Body:
```json
{
  "title": "string (requerido, máx. 255 caracteres)",
  "body": "string (requerido)"
}
```

Respuesta exitosa `201`:
```json
{ "message": "Noticia creada exitosamente", "news": { /* noticia creada */ } }
```

Errores:
- `400` — Título o contenido faltantes, o título excede 255 caracteres

### PUT `/api/news/:id`
Requiere autenticación + rol `administrador`. Edita el título y/o contenido de una noticia.

Body:
```json
{
  "title": "string (opcional, máx. 255 caracteres)",
  "body": "string (opcional)"
}
```

Respuesta exitosa `200`:
```json
{ "message": "Noticia actualizada exitosamente", "news": { /* noticia actualizada */ } }
```

Errores:
- `400` — Título excede 255 caracteres
- `404` — Noticia no encontrada

### PATCH `/api/news/:id/publish`
Requiere autenticación + rol `administrador`. Publica una noticia, registrando la fecha de publicación.

Respuesta exitosa `200`:
```json
{ "message": "Noticia publicada exitosamente", "news": { /* noticia publicada */ } }
```

Errores:
- `400` — La noticia ya está publicada
- `404` — Noticia no encontrada

### PATCH `/api/news/:id/unpublish`
Requiere autenticación + rol `administrador`. Despublica una noticia. La fecha original de publicación se conserva para historial.

Respuesta exitosa `200`:
```json
{ "message": "Noticia despublicada exitosamente", "news": { /* noticia despublicada */ } }
```

Errores:
- `400` — La noticia ya está despublicada
- `404` — Noticia no encontrada

---
## Reports 
`/api/reports`

Todos los endpoints de este módulo requieren autenticación + rol `administrador`. Son de solo lectura — no modifican ningún dato. Todos aceptan un query param `format` (`json` por defecto, `excel`, o `pdf`) para exportar el resultado.

### GET `/api/reports/sales`
Reporte de ventas filtrado por rango de fechas, agrupado por día, basado en pagos aprobados.

Query params:
- `start_date` (requerido) — fecha ISO (`2026-07-01`)
- `end_date` (requerido) — fecha ISO (`2026-07-31`)
- `format` (opcional) — `json` | `excel` | `pdf`

Respuesta exitosa `200` (`format=json`):
```json
{
  "report": {
    "by_day": [
      { "date": "date", "total_payments": "number", "total_amount": "number" }
    ],
    "grand_total": "number",
    "total_transactions": "number"
  }
}
```

Con `format=excel` o `format=pdf`, la respuesta es un archivo binario descargable (`Content-Disposition: attachment`).

Errores:
- `400` — Fechas faltantes, inválidas, o fecha de inicio posterior a la de fin

### GET `/api/reports/orders-status`
Reporte de pedidos agrupados por estado en un período.

Query params: mismos que `/sales`.

Respuesta exitosa `200` (`format=json`):
```json
{
  "report": [
    { "status": "string", "total": "number" }
  ]
}
```

Errores:
- `400` — Fechas faltantes o inválidas

### GET `/api/reports/top-products`
Reporte de productos más vendidos en un período, excluyendo pedidos cancelados.

Query params:
- `start_date`, `end_date` (requeridos)
- `limit` (opcional) — cantidad de productos a mostrar. Default: `10`
- `format` (opcional)

Respuesta exitosa `200` (`format=json`):
```json
{
  "report": [
    {
      "menu_item_id": "uuid",
      "name": "string",
      "total_quantity": "number",
      "total_revenue": "number"
    }
  ]
}
```

Errores:
- `400` — Fechas faltantes o inválidas

### GET `/api/reports/inventory`
Reporte del estado actual del inventario, incluyendo alertas de bajo stock, próximos a vencer y vencidos.

Query params:
- `format` (opcional)

Respuesta exitosa `200` (`format=json`):
```json
{
  "report": {
    "items": [ /* array de ítems de inventario, ver módulo Inventory */ ],
    "alerts": {
      "low_stock": [ /* array de ítems */ ],
      "expiring_soon": [ /* array de ítems */ ],
      "expired": [ /* array de ítems */ ],
      "total": "number"
    }
  }
}
```

---

## Restaurant Info 
`/api/restaurant-info`

### GET `/api/restaurant-info/public`
Ruta pública. Muestra la información general del restaurante: nombre, descripción, dirección, teléfono, correo, horario y redes sociales.

Respuesta exitosa `200`:
```json
{
  "info": {
    "id": "uuid",
    "name": "string",
    "description": "string | null",
    "address": "string | null",
    "phone": "string | null",
    "email": "string | null",
    "schedule": "object | null",
    "social_links": "object | null",
    "updated_at": "timestamp"
  }
}
```

Errores:
- `404` — Información del restaurante no configurada

### PUT `/api/restaurant-info`
Requiere autenticación + rol `administrador`. Edita la información general del restaurante. No modifica las zonas de cobertura de delivery (se gestionan desde el módulo Delivery).

Body:
```json
{
  "name": "string (opcional)",
  "description": "string (opcional)",
  "address": "string (opcional)",
  "phone": "string (opcional)",
  "email": "string (opcional)",
  "schedule": "object (opcional)",
  "social_links": "object (opcional)"
}
```

Respuesta exitosa `200`:
```json
{ "message": "Información actualizada exitosamente", "info": { /* información actualizada */ } }
```

Errores:
- `400` — Nombre vacío, o correo electrónico inválido