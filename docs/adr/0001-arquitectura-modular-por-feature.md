# ADR 0001 — Arquitectura modular por feature en el frontend
 
**Estado:** Aceptado
 
## Contexto
 
El frontend de RestroGest cubre 17 dominios de negocio distintos (auth, cuenta, menú, mesas, pedidos, cocina, domicilios, reservas, inventario, pagos, reseñas, noticias, información del restaurante, reportes, usuarios, carrito, landing). Se necesitaba decidir el criterio de organización de carpetas del código fuente antes de escalar el proyecto más allá del módulo de autenticación.
 
Los dominios del negocio no son independientes entre sí: por ejemplo, un pedido a domicilio necesita datos del menú y del módulo de pagos; una reseña solo puede crearse si existe un pedido a domicilio completado; una reserva necesita el estado de las mesas. Esta red de dependencias es inherente al negocio (ver `diagrama-dependencias-modulos.md`) y existiría bajo cualquier organización de carpetas — el problema a resolver era cómo estructurar el código para que esas dependencias fueran explícitas y controladas, no cómo eliminarlas.
 
## Decisión
 
Se organiza el código **por módulo de negocio** (`src/modules/<dominio>/`), donde cada módulo agrupa sus propios `components/`, `hooks/`, `services/` y `types/` (y `context/` cuando el módulo requiere estado global propio, como `auth` y `cart`).
 
La comunicación entre módulos está restringida a una sola vía permitida: un módulo puede importar la carpeta `services` (o `types`) de otro módulo, pero nunca sus `components`, `hooks` o `context` internos. Esta regla se hace cumplir automáticamente con una regla de ESLint (`no-restricted-imports`), no solo por convención documentada.
 
## Alternativas consideradas
 
**Clean Architecture (organización por capas técnicas: domain / application / infrastructure / presentation, cruzando todos los dominios de negocio).**
 
Se descartó por tres razones:
 
1. **Costo de reescritura**: al momento de evaluar esta alternativa, ya existían múltiples módulos funcionando bajo el enfoque modular (auth, account, menú público, reseñas, reservas, entre otros). Migrar implicaba reescribir la estructura completa sin un beneficio claro para el tamaño y complejidad de este proyecto.
2. **Complejidad no justificada por el dominio**: Clean Architecture aporta más valor en dominios con reglas de negocio muy complejas que necesitan aislarse agresivamente de la infraestructura (ej. sistemas financieros o de seguros con múltiples fuentes de datos intercambiables). RestroGest es un sistema de gestión de restaurante con reglas de negocio directas; el beneficio de esa separación agresiva de capas no compensa la fragmentación de código que produce (entender "reservas" requeriría saltar entre 4 carpetas de capas distintas en vez de una sola carpeta de dominio).
3. **Legibilidad para el tamaño del equipo**: con un equipo pequeño, la organización por feature permite ubicar y razonar sobre un dominio completo en un solo lugar, lo cual reduce la carga cognitiva al incorporarse a una parte del código no trabajada antes.
## Consecuencias
 
**Positivas:**
- Cada módulo es fácil de ubicar, entender y (en teoría) eliminar de forma aislada.
- El patrón se repite de forma idéntica en los 17 módulos, lo que reduce la curva de aprendizaje interna del proyecto.
- Las dependencias entre módulos quedan documentadas explícitamente (`diagrama-dependencias-modulos.md`) y controladas por lint, en vez de quedar implícitas en el código.

**Negativas / trade-offs asumidos:**
- No hay una separación tan estricta entre lógica de dominio y detalles de infraestructura (HTTP, UI) como la que ofrecería Clean Architecture — se acepta como razonable dado el tamaño del dominio.
- La disciplina de "solo importar `services`" depende de que la regla de lint se mantenga activa y actualizada a medida que se agregan módulos nuevos; si se desactiva o se ignora, el acoplamiento entre módulos puede degradarse silenciosamente.
 