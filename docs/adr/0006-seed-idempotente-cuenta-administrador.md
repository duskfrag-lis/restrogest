# ADR 0006 — Seed idempotente para la cuenta administrador inicial

**Estado:** Aceptado

## Contexto

RestroGest necesita que exista al menos una cuenta con rol `administrador` desde el primer arranque, para que quien despliegue o pruebe el proyecto (compañeros de equipo, jurado de hackathon, entrevistador revisando el portafolio) pueda gestionar empleados, moderar reseñas y acceder a reportes sin depender de una intervención manual en la base de datos.

El endpoint de registro (`POST /api/auth/register`) es público por diseño. Cualquier estrategia que otorgue el rol admin dentro de ese flujo (por ejemplo, "el primer usuario que se registra es admin") depende de quién le gane a quién en un endpoint accesible por cualquiera con la URL — incluyendo un juez de hackathon probando la demo, o un bot/scanner automático, antes de que el propio equipo se registre.

## Decisión

La cuenta administrador se crea mediante un script de seed (`src/database/seed.ts`) que corre **fuera del alcance de la red pública**, como parte del arranque del contenedor (producción) o de forma manual antes de levantar el servidor (desarrollo) — nunca a través de un endpoint HTTP.

El seed:
- Lee `ADMIN_EMAIL` y `ADMIN_PASSWORD` de variables de entorno; aborta si faltan.
- Rechaza el placeholder de ejemplo del `.env.example` y contraseñas de menos de 8 caracteres.
- Verifica que no exista ya ninguna cuenta con rol `administrador` antes de insertar (idempotente — seguro de correr múltiples veces).
- Reutiliza la misma función de hash (`bcrypt.hash(password, 10)`) que usa el resto del sistema de autenticación, en vez de reimplementarla.
- Crea la cuenta siempre con `provider = 'local'` fijo (no configurable), lo que la deja fuera del alcance del flujo de login con Google — la estrategia de Passport ya rechaza login por Google si el correo está registrado con otro provider.
- Nunca loggea el password ni el hash.

## Alternativas consideradas

**Primer usuario registrado obtiene el rol admin automáticamente**, aplicado dentro de `authService.register()`.

Se descartó porque introduce una ventana de carrera pública: cualquiera que llegue al endpoint de registro antes que el equipo dueño del proyecto se queda con el rol admin. Este riesgo es real específicamente para RestroGest porque el proyecto está pensado para desplegarse y compartirse públicamente (portafolio, entrevistas, demo de hackathon), no como una app interna donde el registro nunca es visible antes de que el equipo dueño se registre primero.

## Consecuencias

**Positivas:**
- No existe ninguna ventana de ataque vía HTTP para obtener el rol admin — la cuenta ya existe antes de que el sistema reciba tráfico externo.
- La lógica de creación es consistente con el resto del sistema (mismo hash, mismas tablas `users`/`user_roles`/`roles`).
- El seed es seguro de correr en cada arranque sin duplicar ni sobrescribir datos.
- Falla de forma explícita y detallada si faltan credenciales o si se detecta el placeholder de ejemplo, en vez de arrancar con un admin de credenciales predecibles.

**Negativas / trade-offs asumidos:**
- Quien despliega el proyecto debe conocer y completar `ADMIN_EMAIL`/`ADMIN_PASSWORD` antes del primer arranque; si no lo hace, el seed aborta el proceso (comportamiento intencional, pero requiere leer la documentación).
- El seed no valida si `ADMIN_EMAIL` ya está en uso por otra cuenta antes de intentar el `INSERT` — si coincide con un correo ya registrado (cliente, empleado, u otra sesión de pruebas previa), falla con un error de base de datos crudo (`UNIQUE constraint`) en vez de un mensaje claro. Mejora pendiente: validar con `findByEmail` antes de insertar, igual que hacen `register()` y `createEmployee()`.