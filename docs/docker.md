# Docker — arquitectura y referencia
 
> Para los comandos paso a paso de cómo levantar el proyecto (con o sin Docker), ver `EJECUCION.md` en la raíz del repositorio. Este documento explica **cómo está construida** la infraestructura de contenedores y por qué, como referencia técnica.
 
## Servicios
 
`docker-compose.yml` (producción) levanta tres servicios:
 
| Servicio | Imagen | Puerto expuesto | Descripción |
|---|---|---|---|
| `postgres` | `postgres:16-alpine` | `5432` | Base de datos, con volumen persistente `postgres_data` y healthcheck (`pg_isready`) |
| `backend` | build propio (`./backend`, target `production`) | `3000` | API REST, espera a que `postgres` esté `healthy` antes de arrancar (`depends_on: condition: service_healthy`) |
| `frontend` | build propio (`./frontend`, target `production`) | `5173` → `80` interno | SPA compilada, servida por nginx |
 
## Dockerfiles — arquitectura multi-stage
 
### Backend (`backend/Dockerfile`)
 
Tres etapas:
 
1. **`deps`** — instala dependencias con `npm ci` (incluye `devDependencies`). Es la etapa que usa el modo desarrollo directamente, para tener disponibles herramientas como `ts-node-dev`.
2. **`build`** (parte de `deps`) — copia el código fuente y compila TypeScript (`npm run build`).
3. **`production`** — imagen final: reinstala dependencias con `npm ci --omit=dev` (sin `devDependencies`, imagen más liviana), copia solo el `dist/` ya compilado y las migraciones `.sql`, crea la carpeta `uploads`, expone el puerto `3000`.
**Comando de arranque en producción:**
```dockerfile
CMD ["sh", "-c", "node dist/database/migrate.js && node dist/app.js"]
```
Las migraciones corren **automáticamente** al iniciar el contenedor de producción — no hace falta ejecutarlas a mano en ese modo.
 
### Frontend (`frontend/Dockerfile`)
 
Tres etapas equivalentes:
 
1. **`deps`** — recibe `VITE_API_URL` como build arg (Vite incrusta esta variable en el bundle en tiempo de *build*, no de *runtime* — por eso se pasa como `ARG`, no como variable de entorno del contenedor corriendo). Incluye configuración de reintentos de `npm` (`fetch-retries`) para builds más resilientes en CI/CD con conexión inestable.
2. **`build`** — compila el proyecto Vite (`npm run build`), genera los estáticos en `dist/`.
3. **`production`** — imagen basada en `nginx:alpine`, copia los estáticos compilados a `/usr/share/nginx/html` y la configuración custom `nginx.conf`. Expone el puerto `80`.
**Por qué nginx y no `vite preview` o Node sirviendo estáticos:** nginx es el estándar para servir contenido estático en producción — más liviano, más rápido, y sin mantener un proceso de Node corriendo solo para servir archivos que no cambian.
 
## `docker-compose.yml` (producción) vs `docker-compose.dev.yml` (desarrollo)
 
| Aspecto | Producción (`docker-compose.yml`) | Desarrollo (`docker-compose.dev.yml`) |
|---|---|---|
| Target del build | `production` (código compilado) | `deps` (con hot reload) |
| Código fuente | Copiado dentro de la imagen en build | Montado como volumen — cambios en `backend/src` o `frontend/src` se reflejan sin reconstruir |
| Comando del backend | `node dist/database/migrate.js && node dist/app.js` | `npm run dev` |
| Migraciones | Automáticas al iniciar el contenedor | **Manuales** — hay que ejecutarlas explícitamente: `docker compose -f docker-compose.dev.yml exec backend npm run migrate` |
| Frontend servido por | nginx (estáticos compilados) | Vite dev server |
 
## Variables de entorno — los tres `.env`
 
El proyecto usa **tres archivos `.env` distintos**, cada uno con un propósito diferente (fuente: `EJECUCION.md`):
 
| Archivo | Para qué sirve |
|---|---|
| `.env` (raíz) | Variables que usa `docker-compose.yml` para crear el contenedor de Postgres (`DB_USER`, `DB_PASSWORD`, `DB_NAME`) y para el build del frontend (`VITE_API_URL`) |
| `backend/.env` | Variables que usa la app del backend en runtime (conexión a BD, JWT, OAuth, Cloudinary, Wompi, Resend) |
| `frontend/.env` | Variable(s) que Vite incrusta en el bundle al compilar (`VITE_API_URL`) — solo relevante fuera de Docker; dentro de Docker esta variable se pasa como build arg, no se lee de este archivo |
 
```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```
 
> **Nota:** algunos clientes de servicios externos (Resend, Cloudinary, Wompi, Google OAuth) se inicializan al cargar el módulo del backend — dejar esas variables vacías puede impedir que el servidor arranque, incluso si no planeas usarlas activamente (ej. Wompi, ver `integracion-wompi.md`).
 
## Comandos de referencia rápida
 
```bash
# Desarrollo
docker compose -f docker-compose.dev.yml up -d --build
docker compose -f docker-compose.dev.yml exec backend npm run migrate   # primera vez y cada migración nueva
docker compose -f docker-compose.dev.yml logs -f backend                  # logs en vivo
docker compose -f docker-compose.dev.yml exec backend sh                   # entrar al contenedor
docker compose -f docker-compose.dev.yml down                               # apagar
docker compose -f docker-compose.dev.yml down -v                             # apagar y borrar la BD
 
# Producción
docker compose up -d --build
```
 
## Verificación
 
```bash
docker compose -f docker-compose.dev.yml ps   # los 3 servicios deben estar "Up", no "Restarting"
curl http://localhost:3000/health              # respuesta esperada: {"status":"ok","project":"RestroGest"}
```
 
Frontend en `http://localhost:5173`, backend en `http://localhost:3000`.