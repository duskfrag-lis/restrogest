# Requerimientos de la plataforma RestroGest
 
## Requerimientos Funcionales
 
### Autenticación
 
| ID | Requerimiento |
|----|----------------|
| RF01 | El sistema debe permitir registrar un usuario con nombres, apellidos, teléfono, correo y contraseña |
| RF02 | El sistema permite la autenticación mediante cuenta Google (OAuth2) |
| RF03 | El sistema envía un correo de verificación al registrarse manualmente; la cuenta no puede iniciar sesión hasta verificarse |
| RF04 | El sistema permite iniciar sesión con correo y contraseña |
| RF05 | El sistema emite un JWT almacenado en HttpOnly cookie al autenticarse exitosamente |
| RF06 | El sistema bloquea temporalmente la cuenta por 15 minutos tras 5 intentos fallidos de login |
| RF07 | El sistema permite recuperar contraseña mediante enlace de un solo uso enviado al correo, válido por 30 minutos |
| RF08 | El sistema invalida la sesión activa de un empleado si su cuenta es desactivada por el administrador |
| RF09 | El sistema redirige al usuario no autenticado que intenta acceder a una ruta protegida, con retorno automático post-login |
 
### Roles y permisos
 
| ID | Requerimiento |
|----|----------------|
| RF10 | El sistema asigna el rol cliente por defecto a todo usuario que se registre públicamente |
| RF11 | El administrador puede crear cuentas de empleados con rol asignado desde el panel de gestión |
| RF12 | El sistema envía al empleado nuevo un correo con enlace de activación para establecer contraseña, válido 24 horas |
| RF13 | El administrador puede cambiar el rol de cualquier usuario empleado |
| RF14 | El administrador puede activar o desactivar cuentas de empleados |
| RF15 | El sistema restringe las vistas y acciones disponibles según el rol del usuario autenticado |
| RF16 | El sistema retorna 401 si el token es inválido o inexistente, y 403 si el rol no tiene permiso |
 
### Gestión de perfil
 
| ID | Requerimiento |
|----|----------------|
| RF17 | El usuario autenticado puede editar su nombre, apellidos y teléfono |
| RF18 | El usuario puede cambiar su contraseña ingresando la contraseña actual y la nueva |
| RF19 | El usuario puede subir o cambiar su foto de perfil |
| RF20 | El usuario puede ver su historial de pedidos y reservas |
 
### Eliminación de cuenta
 
| ID | Requerimiento |
|----|----------------|
| RF20a | Un cliente puede eliminar su propia cuenta directamente, sin aprobación previa |
| RF20b | Un empleado (mesero, cocinero, jefe_cocina, domiciliario) no puede eliminar su cuenta directamente — debe enviar una solicitud de eliminación con un motivo, la cual queda pendiente de revisión por un administrador |
| RF20c | Un empleado puede consultar el estado de su solicitud más reciente (pendiente, aprobada o rechazada) |
| RF20d | Si la solicitud de un empleado es rechazada, debe esperar 2 horas desde la resolución antes de poder enviar una nueva solicitud |
| RF20e | Un empleado no puede tener más de una solicitud pendiente de revisión a la vez |
| RF20f | El administrador puede ver el listado de solicitudes de eliminación, filtrable por estado |
| RF20g | El administrador puede aprobar o rechazar una solicitud; si la rechaza, debe indicar un motivo de rechazo |
| RF20h | Una vez aprobada la solicitud, el empleado puede completar la eliminación de su cuenta usando esa aprobación |
| RF20i | Una solicitud aprobada solo puede usarse una vez — al completarse la eliminación, queda marcada como usada y no puede reutilizarse |
| RF20j | Un administrador no puede eliminar su propia cuenta bajo ninguna circunstancia |
 
### Gestión de mesas
 
| ID | Requerimiento |
|----|----------------|
| RF21 | El sistema muestra el estado actual de todas las mesas en tiempo real |
| RF22 | El mesero y el administrador pueden cambiar el estado de una mesa (disponible, ocupada, reservada, en_limpieza) |
| RF23 | El administrador puede crear, editar o eliminar mesas, asignando número y capacidad |
| RF24 | Una mesa en estado reservada no puede ser ocupada directamente hasta que el cliente sea atendido o la reserva expire |
 
### Toma de pedidos en mesa
 
| ID | Requerimiento |
|----|----------------|
| RF25 | El mesero puede abrir un pedido asociado a una mesa disponible u ocupada |
| RF26 | El mesero puede agregar, quitar o modificar ítems del pedido antes de enviarlo a cocina |
| RF27 | El mesero puede agregar notas por ítem (ej. "sin cebolla") |
| RF28 | Al enviar el pedido a cocina, este aparece en la pantalla de cocina en tiempo real |
| RF29 | El mesero puede ver el estado de sus pedidos activos |
| RF30 | El mesero puede cerrar un pedido (cobro) una vez está en estado entregado |
| RF31 | El mesero no puede modificar un pedido ya enviado a cocina; solo puede solicitar cancelación al administrador |
 
### Pantalla de cocina
 
| ID | Requerimiento |
|----|----------------|
| RF32 | La pantalla de cocina muestra todos los pedidos activos en estados pendiente y en preparación en tiempo real |
| RF33 | El cocinero puede cambiar el estado de un pedido de pendiente a en preparación y luego a listo |
| RF34 | El jefe de cocina puede ver todos los pedidos activos y reasignarlos |
| RF35 | El sistema notifica visualmente (y opcionalmente con sonido) cuando llega un nuevo pedido a cocina |
| RF36 | Un pedido no puede marcarse como listo si alguno de sus ítems aún está en preparación |
 
### Gestión del menú
 
| ID | Requerimiento |
|----|----------------|
| RF37 | El administrador puede crear categorías del menú |
| RF38 | El administrador puede crear, editar y desactivar ítems del menú con nombre, descripción, precio, imagen y categoría |
| RF39 | Los ítems desactivados no aparecen en la vista pública del menú ni en la toma de pedidos |
| RF40 | Cualquier visitante puede visualizar el menú activo sin autenticación |
| RF41 | El sistema muestra el menú organizado por categorías |
 
### Domicilios
 
| ID | Requerimiento |
|----|----------------|
| RF42 | El cliente autenticado puede agregar ítems del menú a un carrito |
| RF43 | El sistema valida que la dirección ingresada esté dentro de la zona de cobertura antes de procesar el pedido |
| RF44 | El cliente ingresa dirección de entrega, teléfono de contacto y selecciona método de pago |
| RF45 | El sistema procesa el pago online o registra el pedido como "pago contra entrega" |
| RF46 | El pedido a domicilio sigue los estados: recibido → en preparación → en camino → entregado |
| RF47 | El administrador asigna el pedido a un domiciliario disponible |
| RF48 | El domiciliario puede marcar el pedido como entregado desde su pantalla |
| RF49 | El cliente puede ver el estado actual de su pedido a domicilio |
| RF50 | El administrador configura las zonas de cobertura (radio en km o zonas manuales) |
 
### Reservas
 
| ID | Requerimiento |
|----|----------------|
| RF51 | El cliente autenticado puede hacer una reserva seleccionando fecha, hora, número de personas y mesa disponible |
| RF52 | El sistema solo muestra mesas disponibles para el rango de tiempo solicitado |
| RF53 | No se pueden hacer reservas con menos de 2 horas de anticipación |
| RF54 | El sistema envía confirmación por correo al cliente al crear la reserva |
| RF55 | El cliente puede cancelar su reserva hasta 1 hora antes de la hora agendada |
| RF56 | El administrador puede cancelar cualquier reserva en cualquier momento |
| RF57 | Si el cliente no llega en los primeros 15 minutos, el mesero o administrador puede marcar la mesa como disponible |
| RF58 | El sistema muestra al mesero y administrador las reservas del día en orden cronológico |
 
### Inventario
 
| ID | Requerimiento |
|----|----------------|
| RF59 | El jefe de cocina y el administrador pueden crear ítems de inventario con nombre, cantidad, unidad de medida, umbral mínimo y fecha de vencimiento opcional |
| RF60 | El jefe de cocina y el administrador pueden actualizar manualmente la cantidad de un ítem — cada cambio queda registrado en el historial de movimientos |
| RF61 | El sistema genera una alerta visible cuando un ítem cae por debajo de su umbral mínimo |
| RF62 | El administrador puede ver el historial completo de movimientos de inventario |
| RF63 | El sistema genera una alerta cuando un ítem está vencido o vence en los próximos 7 días |
| RF64 | El jefe de cocina puede ver el historial de movimientos de un ítem específico |
| RF65 | No pueden existir dos ítems de inventario con el mismo nombre |
 
### Pasarela de pago
 
| ID | Requerimiento |
|----|----------------|
| RF66 | El sistema integra Wompi como pasarela de pago principal para Colombia |
| RF67 | El sistema permite pago con tarjeta crédito/débito y PSE a través de la pasarela |
| RF68 | El sistema registra el estado de pago (pendiente, aprobado, rechazado, reembolsado) |
| RF69 | Un pedido solo pasa a procesarse si el pago es aprobado o está marcado como pago contra entrega |
| RF70 | El sistema envía confirmación de pago al correo del cliente |
| RF71 | El reembolso en v1 es manual y gestionado por el administrador |
 
> **Nota de estado (agosto 2026):** ver [`integracion-wompi.md`](./integracion-wompi.md) para el detalle de esta integración.
 
### Noticias y reseñas
 
| ID | Requerimiento |
|----|----------------|
| RF72 | El administrador puede publicar, editar y despublicar noticias o novedades del restaurante |
| RF73 | Cualquier visitante puede leer noticias y ver reseñas sin autenticación |
| RF74 | Solo clientes autenticados con al menos un pedido completado pueden dejar una reseña |
| RF75 | Una reseña incluye calificación de 1 a 5 estrellas y comentario opcional |
| RF76 | El administrador puede ocultar reseñas inapropiadas, pero no editarlas |
| RF77 | El sistema muestra el promedio de calificaciones del restaurante en la vista pública |
 
### Reportes
 
| ID | Requerimiento |
|----|----------------|
| RF78 | El administrador puede ver un reporte de ventas filtrado por rango de fechas |
| RF79 | El administrador puede ver pedidos agrupados por estado en un período |
| RF80 | El administrador puede ver los productos más vendidos en un período |
| RF81 | El administrador puede ver el estado actual del inventario con alertas destacadas |
| RF82 | Los reportes son de solo lectura y exportables a PDF o Excel en v1 |
 
### Información general del restaurante
 
| ID | Requerimiento |
|----|----------------|
| RF83 | El sistema muestra públicamente nombre, descripción, dirección, teléfono, horario y redes sociales del restaurante |
| RF84 | El administrador puede editar la información general desde el panel de configuración |
| RF85 | El sistema muestra una sección de ubicación con mapa embebido |
 
## Requerimientos No Funcionales
 
### Rendimiento
 
| ID | Requerimiento |
|----|----------------|
| RNF01 | El tiempo de respuesta de las APIs no debe superar los 500ms en condiciones normales de carga |
| RNF02 | La pantalla de cocina debe recibir actualizaciones en tiempo real con latencia máxima de 1 segundo vía WebSocket |
| RNF03 | El sistema debe soportar al menos 50 usuarios concurrentes sin degradación perceptible en v1 |
| RNF04 | Las imágenes del menú deben optimizarse antes de almacenarse (máx. 500KB por imagen) |
 
### Seguridad
 
| ID | Requerimiento |
|----|----------------|
| RNF05 | Las contraseñas se almacenan hasheadas con bcrypt (mínimo 10 rondas de sal) |
| RNF06 | Los tokens JWT se almacenan en HttpOnly cookies, no en localStorage |
| RNF07 | Todas las rutas protegidas validan el token y el rol en cada request mediante middleware |
| RNF08 | El sistema implementa CORS restringido al dominio del frontend |
| RNF09 | Las variables sensibles (credenciales de BD, claves de API, secreto JWT) se gestionan mediante variables de entorno, nunca en el repositorio |
| RNF10 | El sistema implementa rate limiting en las rutas de login y registro para prevenir ataques de fuerza bruta |
| RNF11 | Las comunicaciones entre cliente y servidor se realizan exclusivamente por HTTPS en producción |
 
### Usabilidad
 
| ID | Requerimiento |
|----|----------------|
| RNF12 | El sistema es responsive y funcional en dispositivos móviles y desktop |
| RNF13 | La pantalla de cocina debe ser legible desde una distancia de aproximadamente 1 metro (fuentes grandes, alto contraste) |
| RNF14 | Los mensajes de error deben ser descriptivos para el usuario final, sin exponer detalles técnicos |
| RNF15 | El flujo de pedido a domicilio no debe requerir más de 5 pasos desde el menú hasta la confirmación |
 
### Mantenibilidad
 
| ID | Requerimiento |
|----|----------------|
| RNF16 | El código del backend sigue arquitectura en capas: rutas → controladores → servicios → repositorios |
| RNF17 | El código del frontend sigue separación por módulos, con componentes reutilizables y custom hooks |
| RNF18 | El proyecto usa Gitflow con ramas main, develop, feature/*, release/* y hotfix/* |
| RNF19 | Los commits siguen la convención de Conventional Commits en español |
| RNF20 | El proyecto incluye un archivo README.md por repositorio (frontend y backend) con instrucciones de instalación y variables de entorno necesarias |
 
### Disponibilidad y despliegue
 
| ID | Requerimiento |
|----|----------------|
| RNF21 | El backend se despliega en Railway o Render con variables de entorno configuradas en la plataforma |
| RNF22 | El frontend se despliega en Vercel conectado al repositorio de GitHub |
| RNF23 | La base de datos se gestiona en una instancia PostgreSQL en la nube (Railway DB o Supabase) |
| RNF24 | El sistema debe tener disponibilidad mínima del 95% mensual en producción (v1) |
 
> **Nota de estado (agosto 2026):** el proyecto se está dockerizando (Dockerfiles multi-stage para frontend y backend, docker-compose para desarrollo y producción) como paso previo al despliegue descrito en RNF21–RNF23. El despliegue en la nube aún está pendiente.