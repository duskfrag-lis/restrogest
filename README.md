# RestroGest

Sistema de gestión integral para restaurantes: pedidos en mesa, cocina en tiempo real, domicilios, reservas, inventario, pagos, reseñas, noticias y reportes administrativos. Monorepo fullstack, proyecto de portafolio.

## Stack 
- **Frontend:** React 19 + TypeScript + Vite
- **Backend:** Node.js + Express + TypeScript
- **Base de datos:** PostgreSQL - sin ORM, SQL puro con `pg`
- **Autenticación:** JWT en cookie HttpOnly + Google Oauth2 (passport)
- **Tiempo real:** Socket.io 
- **Pasarela de pago:** Wompi (tarjeta y PSE)
- **Email transaccional:** Resend
- **Imágenes:** Cloudinary
- **Contenedores:** Docker + Docker Compose

## Estructura

```
restrogest/
├── backend/                  # API REST (Express + TypeScript)
├── frontend/                 # SPA (React + Vite)
├── docker-compose.yml        # Producción
├── docker-compose.dev.yml    # Desarrollo (hot reload)
├── API.md                    # Documentación de endpoints
└── EJECUCION.md               # Guía detallada de ejecución local
```
## Cómo correr el proyecto (Docker, recomendado)

Requisitos: Docker Desktop instalado y corriendo.

```bash
git clone <url-del-repo>
cd restrogest

cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# completa los valores reales en los tres archivos
```

**Producción:**
```bash
docker compose up -d --build
```

**Desarrollo (hot reload):**
```bash
docker compose -f docker-compose.dev.yml up -d --build
docker compose -f docker-compose.dev.yml exec backend npm run migrate
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3000

Guía completa (variables de entorno, troubleshooting, ejecución sin Docker) en [EJECUCION.md](./EJECUCION.md).

## Documentación

- [API.md](./API.md) — endpoints, bodies, respuestas y códigos de error
- [backend/README.md](./backend/README.md) — arquitectura, módulos, convenciones del backend
- [EJECUCION.md](./EJECUCION.md) — guía completa de ejecución (Docker y manual)

## Estado del proyecto

Proyecto de portafolio en desarrollo activo. Limitaciones conocidas de la v1 (integración de pagos validada con webhooks simulados, elegibilidad de reseñas limitada a domicilios, exportación PDF sin librería de tablas) están documentadas en [backend/README.md](./backend/README.md#estado-del-proyecto-y-limitaciones-conocidas).

## Desarrollo local
Ver README individual en cada carpeta.
