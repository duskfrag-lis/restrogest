# Guia de ejecucion local

Esta guia explica como correr backend y frontend para que el flujo completo funcione en local. Hay dos formas: con Docker (recomendada, no requiere instalar PostgreSQL en tu máquina) o de forma manual.

## Opción A: con Docker (recomendado)

### Requisitos

- Docker Desktop instalado y corriendo.
- Estar ubicado en la raíz del repositorio `restrogest`.

### 1. Configurar variables de entorno

El proyecto usa tres archivos `.env`, cada uno con un propósito distinto:

| Archivo | Para qué sirve |
|---|---|
| `.env` (raíz) | Variables que usa `docker-compose.yml` para crear el contenedor de Postgres (`DB_USER`, `DB_PASSWORD`, `DB_NAME`) y para el build del frontend (`VITE_API_URL`) |
| `backend/.env` | Variables que usa la app del backend en runtime (conexión a BD, JWT, OAuth, Cloudinary, Wompi, Resend) |
| `frontend/.env` | Variable(s) que Vite incrusta en el bundle al compilar (`VITE_API_URL`) |

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Completa los valores reales en los tres (ver cada `.env.example` para la lista completa).

### 2. Levantar en modo desarrollo (hot reload)

```bash
docker compose -f docker-compose.dev.yml up -d --build
```

Este modo monta tu código como volumen: los cambios en `backend/src` o `frontend/src` se reflejan sin reconstruir la imagen.

### 3. Ejecutar migraciones y crear la cuenta administrador (primera vez, y cada vez que agregues una migración nueva)

**Importante:** en modo desarrollo las migraciones y el seed no corren automáticamente al iniciar el contenedor — eso solo pasa en producción. Ejecútalas manualmente, en este orden:

```bash
docker compose -f docker-compose.dev.yml exec backend npm run migrate
docker compose -f docker-compose.dev.yml exec backend npm run seed
```
El seed crea la cuenta administrador inicial usando `ADMIN_EMAIL` y `ADMIN_PASSWORD` de `backend/.env`. Es idempotente: si ya existe una cuenta con rol administrador, no hace nada.

### 4. Verificar que todo levantó

```bash
docker compose -f docker-compose.dev.yml ps
```

Los tres servicios (`postgres`, `backend`, `frontend`) deben estar `Up`, no `Restarting`.

```bash
curl http://localhost:3000/health
```

Respuesta esperada:
```json
{"status":"ok","project":"RestroGest"}
```

Abre `http://localhost:5173` en el navegador.

### 5. Modo producción

```bash
docker compose up -d --build
```

Diferencias con desarrollo: el frontend se sirve compilado desde nginx (no Vite dev server), el backend corre desde `dist/` ya compilado, y las migraciones sí corren automáticamente al iniciar el contenedor.

### Comandos útiles

```bash
docker compose -f docker-compose.dev.yml logs -f backend   # logs en vivo
docker compose -f docker-compose.dev.yml exec backend sh   # entrar al contenedor
docker compose -f docker-compose.dev.yml down               # apagar todo
docker compose -f docker-compose.dev.yml down -v             # apagar y borrar la base de datos
```

### Troubleshooting: el contenedor no ve archivos nuevos o cambios en `package.json`

Si el repositorio vive dentro de una carpeta sincronizada por OneDrive dentro de WSL, el bind mount de Docker Desktop puede quedar desactualizado respecto a cambios recientes en el host — típicamente después de agregar un archivo nuevo o editar `package.json`. Síntomas: `npm error Missing script`, o un archivo que existe según `git status` pero no aparece con `ls` dentro del contenedor.

```bash
docker compose -f docker-compose.dev.yml restart backend
```

Si persiste:

```bash
docker compose -f docker-compose.dev.yml up -d --force-recreate backend
```

---

## Opción B: sin Docker (instalación manual)

## Requisitos

- Node.js instalado.
- PostgreSQL instalado y corriendo.
- Una base de datos creada para RestroGest.
- Estar ubicado en la raiz del repositorio `restrogest`.

## Puertos usados

- Backend: `http://localhost:3000` por defecto.
- Frontend: `http://localhost:5173`.
- API usada por el frontend: `http://localhost:3000/api`.

Si el puerto `3000` ya esta ocupado, usa otro puerto para el backend, por ejemplo `3003`, y ajusta `VITE_API_URL` en el frontend.

## 1. Configurar el backend

Entra a la carpeta del backend:

```bash
cd backend
```

Instala dependencias:

```bash
npm install
```

Crea el archivo `.env` a partir de `.env.example`. Además de conexión y auth, completa también los servicios externos (Resend, Cloudinary, Wompi, Google Oauth) - algunos clientes se inicializan al cargar el módulo, así que un valor vacío puede impedir que el servidor arranque: 

```env
PORT=3000
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://usuario:contrasena@localhost:5432/restrogest
JWT_SECRET=una_clave_larga_y_privada
RESEND_API_KEY=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
WOMPI_API_URL=
WOMPI_PUBLIC_KEY=
WOMPI_PRIVATE_KEY=
WOMPI_EVENTS_SECRET=
```

Ejecuta las migraciones:

```bash
npm run migrate
```

Crea la cuenta administrador inicial (agrega `ADMIN_EMAIL` y `ADMIN_PASSWORD` a `backend/.env` antes de este paso):

```bash
 npm run seed
```

Levanta el backend:

```bash
npm run dev
```

Verifica que el backend responde:

```bash
curl http://localhost:3000/health
```

Respuesta esperada:

```json
{"status":"ok","project":"RestroGest"}
```

## 2. Configurar el frontend

En otra terminal, desde la raiz del repositorio:

```bash
cd frontend
```

Instala dependencias:

```bash
npm install
```

Crea el archivo `.env` a partir de `.env.example`:

```env
VITE_API_URL=http://localhost:3000/api
```

Levanta el frontend:

```bash
npm run dev
```

Abre la app en el navegador:

```text
http://localhost:5173/
```

## 3. Si el backend usa otro puerto

Ejemplo usando backend en `3003`.

Backend `.env`:

```env
PORT=3003
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://usuario:contrasena@localhost:5432/restrogest
JWT_SECRET=una_clave_larga_y_privada
```

Frontend `.env`:

```env
VITE_API_URL=http://localhost:3003/api
```

Luego reinicia ambos servidores para que lean las nuevas variables.

## 4. Orden recomendado de ejecucion

1. Levantar PostgreSQL.
2. Ejecutar migraciones del backend con `npm run migrate`.
3. Crear la cuenta administrador con `npm run seed` (requiere `ADMIN_EMAIL`/`ADMIN_PASSWORD` en `backend/.env`).
4. Levantar backend con `npm run dev`.
5. Levantar frontend con `npm run dev`.
6. Entrar a `http://localhost:5173/`.
7. Iniciar sesion con la cuenta administrador sembrada.
8. Registrar un usuario cliente normal (opcional, para probar ese flujo).
9. Probar cerrar sesion.

## 5. Comandos de verificacion

Backend:

```bash
cd backend
npm run build
```

Frontend:

```bash
cd frontend
npm run build
npm run lint
```

## 6. Notas importantes

- El frontend debe enviar cookies con `credentials: 'include'`; esto ya esta implementado en el cliente HTTP.
- El backend crea la cookie `token` como `HttpOnly`, por eso el frontend no debe intentar leer el JWT desde JavaScript.
- Para login y registro reales, PostgreSQL debe estar activo y la base debe tener las migraciones ejecutadas.
- Si cambias `PORT`, `FRONTEND_URL` o `VITE_API_URL`, reinicia los servidores.
