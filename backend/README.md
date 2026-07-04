# RestroGest — Backend

API HTTP de RestroGest, un sistema de gestión integral para restaurantes: pedidos en mesa, cocina en tiempo real, domicilios, reservas, inventario, pagos, reseñas, noticias y reportes administrativos.

Para levantar el proyecto localmente (backend + frontend juntos), consulta la guía de ejecución en la raíz del repositorio.

## Stack tecnológico

- **Runtime:** Node.js + TypeScript
- **Framework:** Express
- **Base de datos:** PostgreSQL, sin ORM — SQL puro con el driver `pg`
- **Autenticación:** JWT en cookie HttpOnly + Passport (Google OAuth2)
- **Tiempo real:** Socket.io (actualizaciones de cocina)
- **Pagos:** Wompi (tarjeta y PSE)
- **Email transaccional:** Resend
- **Almacenamiento de imágenes:** Cloudinary
- **Exportación de reportes:** ExcelJS, PDFKit
- **Subida de archivos:** Multer

## Arquitectura

El backend sigue una arquitectura en capas estricta, organizada por módulo de negocio:
routes → controller → service → repository → base de datos

- **`*.routes.ts`** — define endpoints, middlewares de autenticación/autorización, y conecta con el controller.
- **`*.controller.ts`** — lee la petición HTTP (`req`), llama al service, y da forma a la respuesta (`res`). No contiene lógica de negocio.
- **`*.service.ts`** — contiene las reglas de negocio: validaciones, permisos, orquestación entre repositorios, transacciones.
- **`*.repository.ts`** — encapsula las consultas SQL. Es la única capa que toca `pool.query()` directamente.

Cada módulo es independiente entre sí — un `service` no llama a otro `service` de otro módulo directamente; cuando un módulo necesita datos de otro (por ejemplo, `payments` leyendo `orders`), accede a través del `repository` correspondiente, no de su capa de servicio.

## Estructura de carpetas

```
backend/
├── src/
│   ├── app.ts                # Registro de middlewares globales y rutas
│   ├── server.ts              # Punto de entrada, inicia HTTP + Socket.io
│   ├── config/                # Conexión a BD, email, Cloudinary, Wompi, sockets, passport, tokens
│   ├── middlewares/            # authenticate, authorize, rate limiting, upload (multer)
│   ├── modules/                # Un directorio por dominio de negocio
│   │   ├── auth/
│   │   ├── users/
│   │   ├── profile/
│   │   ├── menu/
│   │   ├── tables/
│   │   ├── orders/
│   │   ├── kitchen/
│   │   ├── reservations/
│   │   ├── delivery/
│   │   ├── inventory/
│   │   ├── payments/
│   │   ├── reviews/
│   │   ├── news/
│   │   ├── reports/
│   │   └── restaurant_info/
│   └── database/
│       ├── migrate.ts          # Script runner de migraciones
│       ├── migrations/         # Archivos .sql, ejecutados en orden alfabético/numérico
│       └── seeds/               # (reservado para datos de prueba, no en uso actualmente)
├── .env.example
└── package.json
```

## Módulos disponibles

| Módulo | Responsabilidad |
|---|---|
| `auth` | Registro, login, verificación de correo, recuperación de contraseña, Google OAuth2 |
| `users` | Gestión de empleados y roles (solo administrador) |
| `profile` | Perfil del usuario autenticado: datos personales, foto, contraseña, baja de cuenta |
| `menu` | Categorías e ítems del menú, con imágenes vía Cloudinary |
| `tables` | Mesas del restaurante y su estado |
| `orders` | Pedidos en mesa: ítems, envío a cocina, ciclo de vida completo |
| `kitchen` | Vista de cocina en tiempo real (Socket.io), estado de ítems por pedido |
| `reservations` | Reservas de mesa con validación de disponibilidad y anticipación |
| `delivery` | Pedidos a domicilio, validación de cobertura (fórmula de Haversine), asignación de domiciliario |
| `inventory` | Stock de insumos, alertas de bajo stock/vencimiento, historial de movimientos |
| `payments` | Integración con Wompi (tarjeta/PSE), confirmación manual, reembolsos |
| `reviews` | Reseñas de clientes con elegibilidad validada y moderación por administrador |
| `news` | Noticias/novedades del restaurante con ciclo de publicación |
| `reports` | Reportes administrativos de solo lectura, exportables a Excel/PDF |
| `restaurant_info` | Información pública general del restaurante (nombre, dirección, horario, redes) |

Documentación detallada de cada endpoint, con bodies, respuestas y códigos de error: ver [`API.md`](./API.md).

## Base de datos

Sin ORM — las migraciones son archivos `.sql` planos en `src/database/migrations/`, ejecutadas por un runner propio (`src/database/migrate.ts`) que:

1. Lee todos los archivos `.sql` del directorio, ordenados alfabéticamente (de ahí la convención de prefijo numérico: `001_`, `002_`, etc.).
2. Registra cada archivo ejecutado en una tabla `migrations`, usando el **nombre del archivo** como clave única.
3. Salta los archivos ya registrados en corridas futuras.

```bash
npm run migrate
```

**Importante:** como el tracking es por nombre de archivo, nunca renombres un archivo de migración después de que ya se haya ejecutado — el runner no lo reconocerá como aplicado e intentará correrlo de nuevo. Si es indispensable renombrarlo, actualiza el registro correspondiente en la tabla `migrations` manualmente.

Convenciones seguidas en el esquema:
- `TIMESTAMPTZ` para todas las columnas de fecha/hora (evita desalineación con el offset de Colombia, UTC-5).
- Patrón de transacción explícita (`BEGIN`/`COMMIT`/`ROLLBACK` con `pool.connect()`) para operaciones que escriben en más de una tabla.
- Forma estándar de error en controllers: `{ status, message }`.

## Autenticación y autorización

- El JWT se emite al hacer login y se almacena en una cookie `token` (`HttpOnly`, `SameSite=Lax`, expira en 8h). El frontend nunca lee el token directamente — solo debe enviar `credentials: 'include'` en cada petición.
- `authenticate` (middleware): valida el JWT y verifica en cada request que el usuario siga activo y no eliminado (no confía solo en el contenido del token).
- `authorize(...roles)` (middleware): restringe una ruta a los roles indicados.
- Roles del sistema: `cliente`, `mesero`, `cocinero`, `jefe_cocina`, `domiciliario`, `administrador`.
- Login con Google (OAuth2) crea la cuenta automáticamente con rol `cliente` y correo verificado.

## Variables de entorno

Ver `.env.example` para la lista completa. Grupos principales:
- Conexión: `PORT`, `FRONTEND_URL`, `DATABASE_URL`
- Autenticación: `JWT_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`
- Email: `RESEND_API_KEY`
- Imágenes: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- Pagos: `WOMPI_API_URL`, `WOMPI_PUBLIC_KEY`, `WOMPI_PRIVATE_KEY`, `WOMPI_EVENTS_SECRET`

## Estado del proyecto y limitaciones conocidas

- **Integración con Wompi:** implementada siguiendo la documentación oficial de Wompi (firma de integridad SHA256, verificación de webhooks). No se completó el registro de comercio real (requiere RUT y cuenta bancaria), por lo que el flujo fue validado simulando webhooks firmados manualmente en lugar de contra el sandbox real de Wompi.
- **Reseñas (`reviews`):** la elegibilidad para dejar una reseña se valida únicamente contra pedidos a domicilio completados (`delivery_orders`), ya que los pedidos en mesa no tienen un mecanismo de identificación del cliente presencial. Extender esto a pedidos en mesa requeriría diseñar un flujo de vinculación cliente-pedido presencial, fuera del alcance de v1.
- **Exportación de reportes a PDF:** generada con `pdfkit` sin librería de tablas — el layout es funcional pero básico (columnas de ancho fijo, sin bordes).

## Comandos

```bash
npm install       # instalar dependencias
npm run migrate   # ejecutar migraciones pendientes
npm run dev        # levantar el servidor en modo desarrollo
npm run build      # compilar TypeScript
```

## Convenciones de Git

- Gitflow: ramas `feature/<modulo>-backend`, `fix/<descripcion>` para correcciones.
- Conventional Commits en español: `feat(modulo): descripción`, `fix(modulo): descripción`, `docs(modulo): descripción`, `chore: descripción`.
- Cada módulo se documenta en `API.md` al cerrarse.