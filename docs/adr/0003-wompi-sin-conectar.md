# ADR 0003 — Integración de Wompi implementada pero no conectada
 
**Estado:** Aceptado
 
## Contexto
 
Los requerimientos del proyecto (RF66–RF71) establecen a Wompi como pasarela de pago principal, con soporte para tarjeta de crédito/débito y PSE. Wompi, como la mayoría de pasarelas de pago reales, requiere el registro de un comercio (con RUT y cuenta bancaria) para operar contra su entorno de producción, y su entorno de pruebas (sandbox) también implica un proceso de registro y, en algunos flujos, restricciones de uso.
 
Este es un proyecto académico/de portafolio sin comercio real ni intención de procesar transacciones reales de dinero.
 
## Decisión
 
Se implementa el código completo de integración con Wompi a nivel de backend (cliente de firma de integridad SHA256, verificación de webhooks, plantilla de correo de confirmación de pago, endpoints de `payments`), pero **no se conecta a credenciales reales**. Las variables de entorno de Wompi (`WOMPI_API_URL`, `WOMPI_PUBLIC_KEY`, `WOMPI_PRIVATE_KEY`, `WOMPI_EVENTS_SECRET`) quedan documentadas en `.env.example` como placeholder, listas para que cualquiera que clone el proyecto con intención de usarlo en producción solo tenga que obtener sus propias credenciales y conectarlas.
 
La validación del flujo de pago (firma de webhook, transiciones de estado) se hizo simulando webhooks firmados manualmente, en lugar de contra el sandbox real de Wompi.
 
## Alternativas consideradas
 
**Conectar credenciales de sandbox de Wompi.**
 
Se descartó porque implicaba registrar una cuenta y pasar por el proceso de habilitación de Wompi únicamente para un flujo que no se va a usar con dinero real, sin beneficio adicional sobre la validación ya realizada con webhooks simulados.
 
**Omitir la integración de pagos por completo.**
 
Se descartó porque los requerimientos (RF66–RF71) y las reglas de negocio de la plataforma dependen explícitamente de un flujo de pago (un pedido no puede cerrarse sin pago confirmado o marcado como contra entrega — ver `reglas-negocio.md`, sección Pagos). Omitirla habría dejado esa parte del dominio sin resolver.
 
**Usar una pasarela distinta con sandbox gratuito sin registro de comercio (ej. Stripe test mode).**
 
Se descartó porque el requerimiento explícito del proyecto es Wompi, por ser la pasarela más relevante para el mercado colombiano — cambiarla habría sido una desviación de alcance no solicitada.
 
## Consecuencias
 
**Positivas:**
- El código de integración existe completo y es funcionalmente correcto según la documentación oficial de Wompi, listo para conectarse con solo agregar credenciales reales.
- No se incurre en ningún costo ni proceso de registro de comercio para un proyecto sin transacciones reales.
- El endpoint de pagos en efectivo o contra entrega (`efectivo`, `contra_entrega`) funciona de extremo a extremo sin depender de Wompi, cubriendo el caso de uso principal en un contexto de práctica.

**Negativas / trade-offs asumidos:**
- El flujo de pago con tarjeta/PSE nunca se ha probado contra el sandbox o producción real de Wompi — solo contra webhooks simulados manualmente. Un cambio no documentado en la API de Wompi no sería detectado hasta que alguien conecte credenciales reales.
- Cualquiera que quiera usar este proyecto en un contexto real debe asumir la validación end-to-end contra Wompi como un paso pendiente, no como algo ya probado en producción.