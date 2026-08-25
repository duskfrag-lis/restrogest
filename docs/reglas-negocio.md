# Reglas de negocio — Plataforma RestroGest
 
Reglas del dominio: lo que el sistema permite, prohíbe o condiciona, independientemente de la tecnología usada para implementarlo.
 
## Autenticación y acceso
 
- Un visitante no autenticado puede navegar libremente: información del restaurante, noticias, menú y reseñas.
- Si intenta hacer una reserva, pedir a domicilio, dejar una reseña o proceder al pago sin sesión activa, el sistema lo redirige a login con retorno automático a la acción que intentaba completar (redirect a la URL original después de autenticarse).
- Un usuario puede registrarse manualmente con nombres, apellidos, teléfono, correo y contraseña, o mediante OAuth2 con Google.
- El correo electrónico es único en el sistema — no puede existir dos cuentas con el mismo correo.
- Un usuario registrado con Google no puede iniciar sesión con correo/contraseña y viceversa (no se mezclan proveedores).
- La contraseña debe tener mínimo 8 caracteres, al menos una mayúscula, una minúscula, un número y un carácter especial.
- El sistema envía un correo de verificación al registrarse manualmente. Hasta que no se verifique, la cuenta no puede iniciar sesión.
- La recuperación de contraseña se hace mediante enlace de un solo uso enviado al correo, con expiración de 30 minutos.
- Tras 5 intentos fallidos de login, la cuenta se bloquea temporalmente por 15 minutos.
- Los tokens de sesión tienen una duración de 8 horas. Si el usuario está inactivo más de ese tiempo, debe volver a autenticarse.
## Roles y permisos
 
- Los roles existentes son: cliente, mesero, cocinero, jefe_cocina, domiciliario, administrador.
- El registro público es exclusivo para clientes. No existe autoregistro para empleados.
- El administrador crea las cuentas de empleados desde el panel de gestión, asignando nombre, apellido, correo y rol desde el inicio.
- El sistema envía al empleado un correo con enlace de activación para que establezca su contraseña (enlace de un solo uso, expira en 24 horas).
- Un usuario solo puede tener un rol activo a la vez.
- El administrador puede desactivar o cambiar el rol de un empleado en cualquier momento.
- Si un empleado es desactivado, pierde acceso inmediatamente, aunque tenga sesión activa (el token se invalida en el siguiente request).
- El administrador ve y puede acceder a todos los módulos del sistema.
## Eliminación de cuenta
 
- Un cliente puede eliminar su propia cuenta directamente, en cualquier momento, sin necesidad de aprobación.
- Un empleado (mesero, cocinero, jefe_cocina, domiciliario) no puede eliminar su cuenta directamente. Debe enviar una solicitud con un motivo, la cual queda en estado `pending` hasta que un administrador la revise.
- Un empleado no puede tener más de una solicitud de eliminación pendiente a la vez.
- Si la solicitud es rechazada, el empleado debe esperar 2 horas desde la resolución del rechazo antes de poder enviar una nueva solicitud.
- El administrador revisa las solicitudes pendientes y las aprueba o rechaza; si rechaza, debe indicar un motivo de rechazo.
- Una solicitud aprobada habilita al empleado a eliminar su cuenta, pero solo una vez — al completarse la eliminación, la solicitud queda marcada como usada (`used_at`) y no puede reutilizarse para una futura eliminación.
- Un administrador no puede eliminar su propia cuenta bajo ninguna circunstancia, ni de forma directa ni mediante el flujo de solicitud.
## Mesas y pedidos
 
- Una mesa tiene un estado en todo momento: disponible, ocupada, reservada, en_limpieza.
- Solo un mesero o administrador puede cambiar el estado de una mesa.
- Un pedido en mesa solo puede abrirse si la mesa está en estado disponible u ocupada.
- Un pedido puede tener múltiples ítems. Cada ítem tiene cantidad, producto y notas opcionales.
- Una vez que un pedido es enviado a cocina, no puede modificarse — solo cancelarse si aún no fue aceptado por el cocinero.
- El mesero no puede cancelar un pedido que ya fue aceptado por cocina; debe notificar al administrador.
- Un pedido pasa por los estados: pendiente → en_preparación → listo → entregado → cerrado.
- El cierre del pedido (cobro) lo puede hacer el mesero o el administrador.
## Cocina
 
- El cocinero solo puede ver pedidos en estado pendiente y en_preparación.
- El jefe_cocina puede ver todos los pedidos activos y reasignarlos entre cocineros.
- La pantalla de cocina se actualiza en tiempo real — no requiere recarga manual.
- El cocinero no puede modificar el contenido de un pedido, solo su estado.
- Un pedido no puede pasar a listo si alguno de sus ítems aún está pendiente de preparación.
## Menú
 
- El menú está organizado en categorías (entradas, platos fuertes, bebidas, postres, cocteles).
- Solo el administrador puede crear, editar o desactivar ítems del menú.
- Un ítem del menú puede desactivarse temporalmente (no aparece para el cliente) sin eliminarse.
- Cada ítem del menú tiene: nombre, descripción, precio, categoría, imagen y disponibilidad.
- El precio en el menú es el precio de referencia; el sistema no permite descuentos a nivel de ítem sin un módulo de promociones (fuera del alcance v1).
## Domicilios
 
- Solo los usuarios con rol cliente pueden hacer pedidos a domicilio.
- El sistema valida si la dirección ingresada por el cliente está dentro de la zona de cobertura configurada por el administrador.
- Si la dirección está fuera de zona, el pedido no puede procesarse como domicilio.
- Un pedido a domicilio requiere dirección de entrega, teléfono de contacto y método de pago confirmado antes de enviarse.
- El administrador gestiona las zonas de cobertura (puede ser por radio en km o por barrios/zonas definidas manualmente).
- Un domicilio pasa por: recibido → en_preparación → en_camino → entregado.
- El rol domiciliario ve exclusivamente los pedidos a domicilio asignados a él en estado en_camino.
- El domiciliario puede marcar un pedido como entregado con confirmación.
- El domiciliario no tiene acceso a ningún otro módulo del sistema.
- El administrador asigna pedidos a domicilio manualmente (v1).
## Reservas
 
- Las reservas solo pueden hacerse con mínimo 2 horas de anticipación.
- Una reserva ocupa una mesa específica en un rango de tiempo; ese rango queda bloqueado para otras reservas.
- El cliente recibe confirmación por correo al hacer la reserva.
- Si el cliente no llega en los primeros 15 minutos después de la hora reservada, el mesero o administrador puede liberar la mesa.
- Solo el administrador puede cancelar reservas existentes de cualquier cliente.
- El cliente puede cancelar su propia reserva hasta 1 hora antes de la hora agendada.
## Inventario
 
- El jefe_cocina y el administrador pueden gestionar el inventario.
- El inventario es manual: no se descuenta automáticamente al hacer pedidos (v1). Es un registro de control básico.
- Cada ítem de inventario tiene: nombre, cantidad actual, unidad de medida, cantidad mínima (umbral de alerta).
- Cuando un ítem cae por debajo del umbral mínimo, se genera una alerta visible para jefe_cocina y administrador.
## Pagos
 
- Los métodos de pago aceptados son: efectivo, tarjeta (pasarela online), y transferencia.
- Un pedido solo puede cerrarse si el pago está confirmado o marcado como "pago contra entrega" (para domicilios en efectivo).
- La pasarela de pago online aplica para pedidos a domicilio y, opcionalmente, para reservas con anticipo.
- No se procesan reembolsos automáticos en v1 — es un proceso manual gestionado por el administrador.
> **Nota de estado (agosto 2026):** ver [`integracion-wompi.md`](./integracion-wompi.md) para el detalle de esta integración.
 
## Reseñas y noticias
 
- Solo el usuario con rol cliente que haya completado al menos un pedido puede dejar una reseña; si no, el sistema muestra un mensaje explicativo, no un error genérico.
- Una reseña tiene: calificación (1-5 estrellas) y comentario opcional.
- El administrador puede moderar (ocultar) reseñas inapropiadas, pero no editarlas.
- Las noticias/novedades del restaurante solo pueden ser publicadas por el administrador.
## Reportes
 
- Solo el administrador tiene acceso al módulo de reportes.
- Los reportes disponibles en v1 son: ventas por período, pedidos por estado, productos más vendidos e inventario actual.
- Los reportes son de solo lectura — no modifican ningún dato.