# Guia de ejecucion local

Esta guia explica como correr backend y frontend para que el flujo de autenticacion funcione completo en desarrollo local.

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

Crea el archivo `.env` a partir de `.env.example`:

```env
PORT=3000
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://usuario:contrasena@localhost:5432/restrogest
JWT_SECRET=una_clave_larga_y_privada
```

Ejecuta las migraciones:

```bash
npm run migrate
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
3. Levantar backend con `npm run dev`.
4. Levantar frontend con `npm run dev`.
5. Entrar a `http://localhost:5173/`.
6. Registrar un usuario.
7. Iniciar sesion con ese usuario.
8. Probar cerrar sesion.

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
