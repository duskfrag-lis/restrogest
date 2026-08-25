# ADR 0005 — Arquitectura en capas por módulo en el backend
 
**Estado:** Aceptado
 
## Contexto
 
El backend de RestroGest expone 14 módulos de negocio (auth, users, profile, menu, tables, orders, kitchen, reservations, delivery, inventory, payments, reviews, news, reports, restaurant_info), cada uno con su propia lógica de validación, permisos por rol y persistencia. Era necesario definir un patrón de organización interno de cada módulo que separara responsabilidades de forma consistente y predecible en los 14 módulos, sin depender del criterio individual de quien escribiera cada uno.
 
Al igual que en el frontend (ver [ADR 0001](./0001-arquitectura-modular-por-feature.md)), existe una red real de dependencias de negocio entre módulos — por ejemplo, `payments` necesita leer datos de `orders`, `kitchen` necesita datos de `orders`. El reto no era eliminar esas dependencias, sino controlarlas.
 
## Decisión
 
Cada módulo del backend sigue una arquitectura en capas estricta:
 
```
routes → controller → service → repository → base de datos
```
 
- **`*.routes.ts`** — define endpoints, aplica middlewares de autenticación/autorización, y conecta con el controller. No contiene lógica.
- **`*.controller.ts`** — lee la petición HTTP (`req`), llama al service, y da forma a la respuesta (`res`). No contiene lógica de negocio.
- **`*.service.ts`** — contiene las reglas de negocio: validaciones, permisos, orquestación entre repositorios, transacciones.
- **`*.repository.ts`** — encapsula las consultas SQL. Es la única capa que toca `pool.query()` directamente.
Regla de aislamiento entre módulos: **un service no llama directamente a otro service de otro módulo**. Cuando un módulo necesita datos de otro (ej. `payments` leyendo `orders`), accede a través del `repository` correspondiente del otro módulo, nunca de su capa de `service`.
 
## Alternativas consideradas
 
**Arquitectura por capas transversales (todos los controllers en una carpeta, todos los services en otra, etc., sin agrupar por módulo de negocio).**
 
Se descartó porque con 14 dominios de negocio, tener una sola carpeta `controllers/` con 14+ archivos mezclados (sin agrupación por dominio) dificulta ubicar y razonar sobre un módulo específico — el mismo argumento de legibilidad que llevó a la decisión modular en el frontend (ADR 0001) aplica en simétrico aquí.
 
**Permitir llamadas directas entre services de distintos módulos.**
 
Se descartó porque genera acoplamiento implícito y difícil de rastrear: si `payments.service.ts` importa y llama directamente a `orders.service.ts`, cualquier cambio en las reglas de negocio de `orders` (por ejemplo, una validación adicional antes de retornar un pedido) se propaga silenciosamente a `payments` sin que sea evidente desde el código de `payments`. Forzar el acceso vía `repository` mantiene el acceso a datos crudos explícito, sin heredar reglas de negocio ajenas por accidente.
 
**Usar un ORM que abstrajera la capa de repository (ver también [ADR 0002](./0002-sql-puro-sin-orm.md)).**
 
Descartado por las razones ya documentadas en el ADR 0002 — control total sobre consultas complejas de reportes y transacciones explícitas multi-tabla.
 
## Consecuencias
 
**Positivas:**
- El flujo de una petición HTTP es predecible y idéntico en los 14 módulos: siempre `routes → controller → service → repository`.
- Las reglas de negocio quedan concentradas en un solo lugar por módulo (`service`), facilitando su localización al debuggear o auditar comportamiento.
- El acceso a otro módulo siempre pasa por su `repository`, lo que hace explícito qué datos crudos se están consumiendo, sin heredar validaciones o efectos secundarios de la capa de negocio ajena.
**Negativas / trade-offs asumidos:**
- Requiere más archivos y más código de "conexión" entre capas (boilerplate) que un enfoque menos estructurado, aceptado como costo razonable a cambio de consistencia.
- Si un módulo necesita una operación de negocio compleja que involucra a otro módulo (no solo lectura de datos crudos vía repository), no hay un mecanismo formal definido para eso todavía — actualmente se resuelve caso por caso dentro del `service` que inicia la operación (ej. `payments.service.ts` orquesta la actualización del estado espejo en `delivery_orders` directamente). Si esta necesidad crece, valdría la pena un ADR futuro evaluando un patrón explícito (eventos de dominio, capa de orquestación) en vez de mantenerlo implícito.