# Integración de pagos con Wompi — estado y guía de conexión
 
> Para el razonamiento detrás de esta decisión, ver [ADR 0003](./adr//0003-wompi-sin-conectar.md).
 
## Estado actual
 
La integración con **Wompi** (pasarela de pago para Colombia — tarjeta de crédito/débito y PSE) está **implementada en código pero no conectada a credenciales reales**.
 
Lo que sí existe y funciona:
- Cliente de firma de integridad (SHA256) para las transacciones.
- Endpoint de webhook (`POST /api/payments/webhook`) que valida la firma del evento antes de procesar.
- Plantilla de correo de confirmación de pago.
- Endpoints completos del módulo `payments`: registro de pago, confirmación manual, reembolso, listado por pedido.
- El flujo de pago **offline** (`efectivo`, `contra_entrega`) funciona de extremo a extremo sin depender de Wompi en absoluto.

Lo que no se ha hecho:
- No hay una cuenta de comercio registrada en Wompi (requiere RUT y cuenta bancaria).
- El flujo online (tarjeta/PSE) nunca se ha probado contra el sandbox o producción real de Wompi — se validó simulando webhooks firmados manualmente.
## Por qué está así
 
Wompi, como la mayoría de pasarelas de pago, exige el registro de un comercio real para operar. Este es un proyecto de práctica/portafolio sin transacciones de dinero real, por lo que conectar credenciales reales no aporta valor de aprendizaje adicional sobre la validación ya hecha, y sí implica un proceso de registro innecesario para el alcance actual del proyecto.
 
## Cómo conectarlo (si alguien quiere usar este proyecto en un contexto real)
 
1. Registrar un comercio en [Wompi](https://wompi.co) y obtener credenciales de sandbox o producción.
2. Completar en `backend/.env` las siguientes variables (ya documentadas como placeholder en `.env.example`):
```
   WOMPI_API_URL=
   WOMPI_PUBLIC_KEY=
   WOMPI_PRIVATE_KEY=
   WOMPI_EVENTS_SECRET=
```
3. Configurar la URL de webhook en el panel de Wompi apuntando a `POST /api/payments/webhook` de tu backend desplegado (Wompi necesita una URL pública accesible, no `localhost`).
4. Probar el flujo completo contra el sandbox de Wompi antes de considerar la integración validada — la validación actual del proyecto (webhooks simulados manualmente) **no** es equivalente a una prueba real contra su entorno.
## Riesgo a tener en cuenta
 
Como el código nunca se ha probado contra la API real de Wompi, es posible que existan diferencias no detectadas entre lo simulado y el comportamiento real de su API (por ejemplo, cambios en el formato de eventos del webhook). Quien conecte credenciales reales debe tratar el primer ciclo de pruebas como una validación completa, no como una simple activación.