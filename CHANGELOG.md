# Changelog — RestroGest
 
Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/). Este proyecto no usa versionado semántico numerado todavía; las entradas están agrupadas por hito funcional y fecha.
 
## [Sin publicar]
 
## [Módulo de carrito y contacto público] - 2026-08-11
### Added
- Contexto y estado base del carrito de compras con persistencia local
- Vista de carrito
- Página de contacto con mapa y datos condicionales del restaurante
### Fixed
- El footer se mantiene pegado abajo en páginas con poco contenido
## [Noticias públicas] - 2026-08-10
### Added
- Tipos, servicio y hooks de noticias públicas
- Listado y detalle de noticias con ruta propia
## [Historial de domicilios y reservas del cliente] - 2026-08-09
### Added
- Ítems del pedido incluidos en el detalle de domicilio
- Vista de historial de pedidos a domicilio con detalle en modal
- Vista de reservas activas del cliente
- Contadores reales conectados en la vista de cuenta
### Docs
- Documentados los ítems en el detalle de pedido a domicilio en `API.md`
## [Reservas desde la vista del cliente] - 2026-08-05
### Added
- Validación de horario y solapamiento de reservas (2 horas)
- Flujo completo de reserva desde la vista del cliente
- Ruta pública de reservas
### Fixed
- Redirección post-login para respetar la ruta de origen
- Ruta duplicada de login sin protección de `GuestRoute`
### Docs
- Documentado el endpoint de elegibilidad de reseñas y la validación de horario de reservas
## [Reseñas desde la vista del cliente] - 2026-08-04
### Added
- Endpoint de elegibilidad de reseñas (validación de rating corregida)
- Flujo completo de reseñas desde la vista del cliente
- Ruta pública de reseñas
### Fixed
- Prop `color` agregada a `Icon`, utilidades de fecha relativa y redirección
- Orden de logout corregido para evitar redirección incorrecta a login
## [Vista pública del menú] - 2026-08-03
### Added
- Vista pública del menú con filtros por categoría y mensaje si aún no está configurado
### Fixed
- Forzado `no-cache` en el cliente HTTP para evitar respuestas `304` sin body
## [Landing pública y reestructuración de rutas] - 2026-08-02
### Added
- Landing con hero, "cómo funciona", menú destacado, reseñas y sección "visítanos"
- Footer público, layout con header/contenido/pie de página
- Componentes compartidos: estado vacío, carrusel infinito, formato de horario
- Servicios y tipos públicos de menú, reseñas e información del restaurante
### Changed
- Rutas separadas por dominio: auth, público y backoffice
- `App.tsx` simplificado a providers globales
## [Migración de iconografía y ajustes de cuenta] - Jul 26 - Ago 2, 2026
### Changed
- Iconos custom y `lucide-react` reemplazados por Phosphor Icons
### Fixed
- Nombre de archivo de tipos de `restaurant-info`; colores de estrellas y superficie sobre fondo oscuro
### Added
- Redirección a la acción original tras iniciar sesión
## [Módulo de cuenta y solicitudes de eliminación] - Jul 21-22, 2026
### Added
- Hook y servicio de perfil de usuario
- Avatar, edición de perfil, cambio de contraseña, tarjetas de estadísticas
- Vista de cuenta ensamblada para cliente, staff y administrador
- Guards de rutas privadas y de invitado
- Solicitud de eliminación de cuenta para empleados con aprobación de administrador (frontend y backend)
### Fixed
- Redirección tras login para evitar bucle con la ruta raíz
## [Módulo de autenticación (frontend)] - Jul 18-19, 2026
### Added
- Sistema de tokens de diseño (colores, tipografía, tema)
- Layouts público y de backoffice
- UI de login y registro con verificación de correo
- Checklist de validación de contraseña en vivo
- Recuperación, restablecimiento y activación de cuenta, verificación de correo y callback de Google
### Fixed
- Layout deslizante y manejo de cuenta bloqueada en login
## [Reestructuración de auth y correcciones de backend] - Jul 3-18, 2026
### Changed
- Módulo `auth` migrado a arquitectura modular con paleta verde salvia
### Added
- Endpoint de reenvío de verificación de correo
### Docs
- README completo del backend con arquitectura, módulos y estado del proyecto
## [Backend completo: pagos, reseñas, noticias, reportes] - Jul 2-3, 2026
### Added
- Módulo de pagos con integración de Wompi (firma de integridad, confirmación manual, reembolso)
- Módulo de reseñas con moderación y validación de elegibilidad
- Módulo de noticias con publicación y edición
- Módulos de reportes (ventas, pedidos, productos, inventario) con exportación a Excel y PDF
- Módulo de información general del restaurante
### Fixed
- Corrección amplia de bugs y typos en auth, delivery, kitchen, menu, orders, profile, tables, users
- Migración de hardening del esquema de base de datos (timestamptz, tipos de columna, nombres)
## [Backend: inventario, domicilios, reservas] - Jun 30 - Jul 2, 2026
### Added
- Módulo de inventario con alertas de stock y vencimiento, historial de movimientos
- Módulo de domicilios con validación de cobertura por fórmula de Haversine
- Módulo de reservas con validaciones de negocio y plantilla de correo de confirmación
## [Backend: mesas, pedidos y cocina en tiempo real] - Jun 25-29, 2026
### Added
- Módulo de menú (categorías e ítems) con imágenes vía Cloudinary
- Módulo de perfil de usuario
- Módulo de gestión de mesas
- Módulo de pedidos en mesa con ciclo de vida completo
- Socket.io para comunicación en tiempo real; eventos de cocina
## [Backend: autenticación y usuarios] - Jun 8-22, 2026
### Added
- Estructura inicial del monorepo
- Registro, login, verificación de correo, recuperación de contraseña
- Autenticación con Google OAuth2
- Middleware de autenticación y autorización por rol
- Rate limiting en rutas de login, registro y recuperación de contraseña
- Gestión de empleados y roles (solo administrador)
- Servicio de correo transaccional con Resend
- Configuración de subida de imágenes con Cloudinary
 