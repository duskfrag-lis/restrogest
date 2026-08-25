# ADR 0002 — SQL puro sin ORM en el backend
 
**Estado:** Aceptado
 
## Contexto
 
El backend de RestroGest necesita persistir y consultar datos relacionales con transacciones multi-tabla (por ejemplo, crear un pedido a domicilio implica escribir en `orders`, `delivery_orders` y potencialmente `payments` de forma atómica), consultas con joins moderadamente complejos (reportes de ventas, historial de movimientos de inventario) y control fino sobre el tipo de dato `TIMESTAMPTZ` para evitar desalineación con el offset horario de Colombia (UTC-5).
 
## Decisión
 
Se usa el driver nativo `pg` de PostgreSQL con SQL escrito a mano, organizado en archivos de migración `.sql` planos (`src/database/migrations/`) ejecutados por un runner propio, en vez de un ORM (Prisma, TypeORM, Sequelize, etc.).
 
## Alternativas consideradas
 
**Usar un ORM (Prisma o TypeORM).**
 
Se descartó por las siguientes razones:
 
1. **Control total sobre las consultas**: reportes como ventas agrupadas por día, productos más vendidos, o alertas de inventario por umbral requieren SQL con agregaciones y condiciones específicas que son más directas de escribir y optimizar en SQL puro que a través del query builder de un ORM.
2. **Transacciones explícitas**: el patrón `BEGIN/COMMIT/ROLLBACK` con `pool.connect()` usado en operaciones que escriben en más de una tabla (ej. cerrar un pedido y liberar una mesa) es más predecible de razonar en SQL directo que a través de las abstracciones de transacciones de un ORM.
3. **Curva de aprendizaje**: escribir SQL directo refuerza el entendimiento del modelo relacional subyacente, lo cual es un objetivo explícito del proyecto al usarse como práctica de aprendizaje además de portafolio.
## Consecuencias
 
**Positivas:**
- Control total y explícito sobre cada consulta, sin comportamientos "mágicos" u ocultos de un ORM.
- Sin dependencia de una capa adicional de abstracción que aprender ni mantener actualizada.
- Migraciones simples y legibles como archivos `.sql` planos, versionadas junto al código.

**Negativas / trade-offs asumidos:**
- No hay autocompletado ni validación de tipos en tiempo de compilación entre las consultas SQL y el modelo de datos de TypeScript — un cambio de esquema no se detecta automáticamente en el código que lo consume, a diferencia de un ORM con generación de tipos.
- El runner de migraciones es una implementación propia y simple: el tracking de qué migración ya se ejecutó se hace por **nombre de archivo**, no por hash de contenido — renombrar un archivo de migración ya ejecutado hace que el runner no lo reconozca como aplicado (documentado explícitamente en el README del backend como precaución operativa).
- Más código repetitivo (boilerplate) en la capa de repositorio comparado con un ORM, que se acepta como costo razonable dado el tamaño del proyecto.