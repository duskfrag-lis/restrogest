# RestroGest — Frontend
 
Frontend web de RestroGest, sistema de gestión integral para restaurantes: pedidos en mesa, cocina en tiempo real, domicilios, reservas, inventario, pagos, reseñas, noticias y reportes administrativos.
 
Documentación detallada de cada endpoint que consume este frontend: ver [`API.md`](../docs/API.md).
 
## Stack tecnológico
 
- **Librería/Framework**: React + TypeScript
- **Build tool**: Vite
- **Enrutamiento**: React Router, separado por dominio (`auth`, `public`, `backoffice`)
- **Tiempo real**: Socket.io-client (actualizaciones de cocina)
- **Iconografía**: Phosphor Icons
- **Autenticación**: cookie `HttpOnly` emitida por el backend — el frontend nunca lee ni manipula el JWT directamente
## Arquitectura
 
El frontend está organizado **por módulo de negocio** (feature-based), no por tipo de archivo. Cada módulo bajo `src/modules/` sigue la misma estructura interna:
 
```
modules/<nombre-del-modulo>/
├── components/    # componentes visuales propios del módulo
├── hooks/         # hooks custom del módulo
├── services/       # llamadas HTTP al backend
├── types/          # tipos e interfaces del dominio del módulo
└── context/         # solo en módulos con estado global propio (auth, cart)
```
 
Un módulo no importa directamente lógica interna de otro módulo; si necesita datos de otro dominio, lo hace a través de su capa de `services`, igual que en el backend cada módulo accede a otros solo vía su repository.
 
Fuera de `modules/`, el proyecto se divide en:
 
- `core/` — configuración global, guards de rutas (`PrivateRoute`, `GuestRoute`) y conexión de sockets.
- `layouts/` — `PublicLayout` (header, contenido, footer) y `BackofficeLayout` (con `Sidebar`), como envoltorios visuales según el tipo de vista.
- `router/` — rutas agrupadas por dominio: públicas, de autenticación y de backoffice.
- `shared/` — componentes, hooks, utilidades, iconos y el cliente HTTP común a todos los módulos.
- `styles/tokens` — sistema de diseño (color, tipografía, tema).
Todas las peticiones autenticadas usan `credentials: 'include'` para que el navegador envíe y reciba la cookie de sesión del backend. El cliente HTTP fuerza `no-cache` para evitar respuestas `304` sin body.
 
## Estructura de carpetas
 
```
frontend
└── src
    ├── core
    │   ├── config
    │   ├── guards
    │   └── socket
    ├── layouts
    │   ├── BackofficeLayout
    │   │   └── Sidebar
    │   └── PublicLayout
    │       ├── Footer
    │       └── PublicHeader
    ├── modules
    │   ├── account
    │   ├── auth
    │   ├── cart
    │   ├── delivery
    │   ├── inventory
    │   ├── kitchen
    │   ├── landing
    │   ├── menu
    │   ├── news
    │   ├── orders
    │   ├── payments
    │   ├── reports
    │   ├── reservations
    │   ├── restaurant-info
    │   ├── reviews
    │   ├── tables
    │   └── users
    ├── router
    ├── shared
    │   ├── components
    │   ├── hooks
    │   ├── http
    │   ├── icons
    │   └── utils
    └── styles
        └── tokens
```
 
> Cada carpeta en `modules/` sigue el patrón `components / hooks / services / types` descrito en Arquitectura (se omite aquí para no repetirlo 17 veces).
 
## Módulos
 
| Módulo | Estado | Responsabilidad |
|---|---|---|
| `auth` | ✅ Implementado | Login, registro, verificación y reenvío de verificación de correo, recuperación/restablecimiento de contraseña, activación de cuenta de empleado, login con Google, redirección a la acción original tras iniciar sesión |
| `account` | ✅ Implementado | Perfil del usuario autenticado: edición de datos, avatar, cambio de contraseña, historial (pedidos y reservas), vista diferenciada por rol, solicitud de eliminación de cuenta (empleados) |
| `landing` | ✅ Implementado | Página de inicio pública: hero, "cómo funciona", menú destacado, reseñas, sección "visítanos" |
| `menu` | ✅ Implementado (vista pública) | Menú con filtros por categoría |
| `reviews` | ✅ Implementado | Elegibilidad, creación y listado de reseñas desde la vista del cliente |
| `reservations` | ✅ Implementado | Disponibilidad, validación de horario/solapamiento, creación, listado de reservas activas del cliente |
| `delivery` | 🟡 Parcial | Historial de pedidos del cliente con detalle en modal; falta el flujo de creación/checkout |
| `news` | ✅ Implementado | Listado y detalle público de noticias |
| `restaurant-info` | ✅ Implementado | Página de contacto con mapa; zona de cobertura y horario |
| `cart` | 🟡 Parcial | Contexto y estado base con persistencia local; falta conectar con `payments` |
| `tables` | 🏗️ Estructura creada, sin implementar | Gestión de mesas (backoffice) |
| `orders` | 🏗️ Estructura creada, sin implementar | Pedidos en mesa (backoffice) |
| `kitchen` | 🏗️ Estructura creada, sin implementar | Pantalla de cocina en tiempo real (backoffice) |
| `inventory` | 🏗️ Estructura creada, sin implementar | Inventario y alertas (backoffice) |
| `payments` | 🏗️ Estructura creada, sin implementar | Checkout y pasarela Wompi (backoffice/cliente) |
| `reports` | 🏗️ Estructura creada, sin implementar | Reportes administrativos exportables (backoffice) |
| `users` | 🏗️ Estructura creada, sin implementar | Gestión de empleados y roles (backoffice) |
 
> **Nota:** las carpetas de los módulos marcados como 🏗️ ya están creadas (incluyendo subcarpetas de componentes previstos, como `KitchenColumn` o `TableCard`), pero corresponden a la fase de scaffolding — la lógica e integración con el backend todavía está pendiente. 
 
## Sistema de diseño
 
- Tokens de diseño propios en `styles/tokens` (color, tipografía, tema) — paleta actual verde salvia.
- Iconografía con **Phosphor Icons** (se migró desde iconos custom y `lucide-react`).
- Componentes compartidos en `shared/components`: `LoginRequiredNotice`, `ZoomCarousel`, además de estado vacío y modales reutilizables usados por varios módulos.
## Variables de entorno
 
Crear `frontend/.env` a partir de este ejemplo:
 
```
VITE_API_URL=http://localhost:3000/api
```
 
Si el backend corre en otro puerto durante desarrollo, ajusta el valor:
 
```
VITE_API_URL=http://localhost:3003/api
```
 
## Comandos
 
```bash
npm install       # instalar dependencias
npm run dev         # levantar el servidor de desarrollo
npm run build       # compilar para producción
npm run lint         # revisar estilo y errores de lint
```
 
## Docker
 
El frontend incluye un `Dockerfile` multi-stage (build con Node, servido con nginx en producción) y `.dockerignore`. Para levantar el proyecto completo con Docker Compose, ver la guía de arquitectura Docker en `docs/` en la raíz del repositorio.
 
## Estado del proyecto y limitaciones conocidas
 
- Los módulos operativos de backoffice (`tables`, `orders`, `kitchen`, `inventory`, `payments`, `reports`, `users`) tienen su estructura de carpetas creada pero aún no están implementados — el backend que consumirán ya existe y está documentado en `API.md`.
- El módulo `cart` no está conectado todavía con `payments`; el flujo de checkout de domicilio no está completo end-to-end en el frontend.
- La integración con Wompi (pasarela de pago) está configurada en el backend pero no conectada a credenciales reales — ver nota en `requerimientos.md`.
## Convenciones de Git
 
- Gitflow: ramas `feature/<módulo>-frontend`, `fix/<descripción>`, merges a `develop`.
- Conventional Commits en español: `feat(modulo): descripción`, `fix(modulo): descripción`, `docs(modulo): descripción`, `chore: descripción`.
 