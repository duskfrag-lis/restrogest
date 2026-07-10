import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'onboarding@resend.dev';
const APP_NAME = 'RestroGest';

const emailService = {

    async sendEmployeeActivation(to: string, name: string, activationToken: string) {
        const activationUrl = `${process.env.FRONTEND_URL}/activate?token={activationToken}`;

        await resend.emails.send({
            from: FROM_EMAIL,
            to,
            subject: `${APP_NAME} - Activa tu cuenta`,
            html: `
            
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; background: #F5F5EF; padding: 32px; border-radius: 8px;">
                <div style="margin-bottom: 24px;">
 
                    <span style="font-size: 13px; font-weight: 800; text-transform: uppercase; color: #7A8B5C; letter-spacing: 0.06em;">
                        RestroGest
                    </span>
 
                    <h2 style="margin: 8px 0 0; font-size: 26px; font-weight: 850; color: #232620; line-height: 1.1;">
                        Bienvenido al equipo
                    </h2>
 
                </div>
 
                <p style="color: #5E6354; font-size: 15px; line-height: 1.6;">
                    Hola <strong style="color: #232620">${name}</strong>, 
                </p>
 
                <p style="color: #5E6354; font-size: 15px; line-height: 1.6;">
                    El administrador ha creado una cuenta para ti en ${APP_NAME}. Haz clic en
                    el botón para establecer tu contraseña:
                </p>
 
                <a href="${activationUrl}" style="display: inline-block; background: #7A8B5C; color: #F5F5EF; padding: 14px 28px; 
                    border-radius: 8px; text-decoration: none; font-weight:900; margin: 24px 0; box-shadow: 0 16px 34px rgba(122,139,92,0.28);">
 
                    Activar cuenta
                </a>
 
                <p style="color: #8A8A7C; font-size: 13px; margin-top: 24px; padding-top: 16px; border-top: 1px solid #E1E1D6;">
                    Este enlace expira en 24 horas. Si no esperabas este correo, ignóralo.
                </p>
 
            </div>
            `,
        });
    },

    async sendEmailVerification(to: string, name: string, verificationToken: string) {
        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

        await resend.emails.send({
            from: FROM_EMAIL,
            to,
            subject: `${APP_NAME} - Verifica tu correo`,
            html: `
            
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; background: #F5F5EF; padding: 32px; border-radius: 8px;">
                
                <div style="margin-bottom: 24px;">
                    
                    <span style="font-size: 13px; font-weight: 800; text-transform: uppercase; color: #7A8B5C; letter-spacing: 0.06em;">
                        RestroGest
                    </span>
                    
                    <h2 style="margin: 8px 0 0; font-size: 26px; font-weight: 850; color: #232620; line-height: 1.1;">
                        Verifica tu correo
                    </h2>
                </div>
                
                <p style="color: #5E6354; font-size: 15px; line-height: 1.6;">
                    Hola <strong style="color: #232620;">${name}</strong>,
                </p>
                
                <p style="color: #5E6354; font-size: 15px; line-height: 1.6;">
                    Gracias por registrarte en ${APP_NAME}. Haz clic en el botón para verificar tu correo:
                </p>
                
                <a href="${verificationUrl}" style="display: inline-block; background: #7A8B5C; color: #F5F5EF; padding: 14px 28px;
                    border-radius: 8px; text-decoration: none; font-weight: 900; margin: 24px 0; box-shadow: 0 16px 34px rgba(122,139,92,0.28);">
                    
                    Verificar correo
                </a>
                
                <p style="color: #8A8A7C; font-size: 13px; margin-top: 24px; padding-top: 16px; border-top: 1px solid #E1E1D6;">
                    Este enlace expira en 24 horas.
                </p>
                
            </div>
            `,
        });
    },

    async sendPasswordReset(to: string, name: string, resetToken: string) {
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

        await resend.emails.send({
            from: FROM_EMAIL,
            to,
            subject: `${APP_NAME} - Recuperar tu contraseña`,
            html: `
            
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; background: #F5F5EF; padding: 32px; border-radius: 8px;">
            
                <div style="margin-bottom: 24px;">
                    <span style="font-size: 13px; font-weight: 800; text-transform: uppercase; color: #7A8B5C; letter-spacing: 0.06em;">
                        RestroGest
                    </span>
                    
                    <h2 style="margin: 8px 0 0; font-size: 26px; font-weight: 850; color: #232620; line-height: 1.1;">
                        Recupera tu contraseña
                    </h2>
                </div>
                
                <p style="color: #5E6354; font-size: 15px; line-height: 1.6;">
                    Hola <strong style="color: #232620;">${name}</strong>,
                </p>
                
                <p style="color: #5E6354; font-size: 15px; line-height: 1.6;">
                    Recibimos tu solicitud para restablecer tu contraseña. Haz clic en el botón para continuar:
                </p>
                
                <a href="${resetUrl}" style="display: inline-block; background: #7A8B5C; color: #F5F5EF; padding: 14px 28px; border-radius: 8px;
                    text-decoration: none; font-weight: 900; margin: 24px 0; box-shadow: 0 16px 34px rgba(122,139,92,0.28);">
                    
                    Restablecer contraseña
                </a>
                
                <p style="color: #8A8A7C; font-size: 13px; margin-top: 24px; padding-top: 16px; border-top: 1px solid #E1E1D6;">
                    Este enlace expira en 30 minutos. Si no solicitaste esto, ignora este correo.
                </p>
            
            </div>
            `,
        });
    },

    async sendReservationConfirmation(to: string, name: string, data: {

        date: string;
        time: string;
        party_size: number;
        table_number: number;

    }) {

        await resend.emails.send({
            from: FROM_EMAIL,
            to,
            subject: `${APP_NAME} - Confirmación de reserva`,
            html: `
            
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; background: #F5F5EF; padding: 32px; border-radius: 8px;">
 
                <div style="margin-bottom: 24px;">
                    <span style="font-size: 13px; font-weight: 800; text-transform: uppercase; color: #7A8B5C; letter-spacing: 0.06em;">
                        RestroGest
                    </span>
 
                    <h2 style="margin: 8px 0 0; font-size: 26px; font-weight: 850; color: #232620; line-height: 1.1;">
                        ¡Reserva confirmada!
                    </h2>
                </div>
 
                <p style="color: #5E6354; font-size: 15px; line-height: 1.6;">
                    Hola <strong style="color: #232620;">${name}</strong>,
                </p>
 
                <p style="color: #5E6354; font-size: 15px; line-height: 1.6;">Tu reserva ha sido confirmada con los siguientes detalles: </p>
 
                <div style="background: #FFFFFF; border-radius: 8px; padding: 16px; margin: 16px 0; border: 1px solid #E1E1D6;">
 
                    <p style="margin: 0; color: #232620;"><strong>Fecha:</strong> ${data.date}</p>
                    <p style="margin: 8px 0 0; color: #232620;"><strong>Hora:</strong> ${data.time}</p>
                    <p style="margin: 8px 0 0; color: #232620;"><strong>Personas:</strong> ${data.party_size}</p>
                    <p style="margin: 8px 0 0; color: #232620;"><strong>Mesa:</strong> ${data.table_number}</p>
                
                </div>
 
                <p style="color: #5E6354; font-size: 15px; line-height: 1.6;">Recuerda que puedes cancelar tu reserva hasta 1 hora antes de la hora asignada.</p>
                <p style="color: #8A8A7C; font-size: 13px; margin-top: 24px; padding-top: 16px; border-top: 1px solid #E1E1D6;">Si no esperabas este correo, ignóralo.</p>
            
            </div>
            `,
        });
    },

    async sendPaymentConfirmation(to: string, name: string, data: {

        amount: number;
        method: string;

    }) {

        const methodLabels: Record<string, string> = {
            efectivo: 'Efectivo',
            tarjeta: 'Tarjeta',
            pse: 'PSE',
            contra_entrega: 'Pago contra entrega',
        };

        await resend.emails.send({
            from: FROM_EMAIL,
            to,
            subject: `${APP_NAME} - Confirmación de pago`,
            html: `

            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; background: #F5F5EF; padding: 32px; border-radius: 8px;">
 
                <div style="margin-bottom: 24px;">
                    <span style="font-size: 13px; font-weight: 800; text-transform: uppercase; color: #7A8B5C; letter-spacing: 0.06em;">
                        RestroGest
                    </span>
 
                    <h2 style="margin: 8px 0 0; font-size: 26px; font-weight: 850; color: #232620; line-height: 1.1;">
                        ¡Pago confirmado!
                    </h2>
                </div>
 
                <p style="color: #5E6354; font-size: 15px; line-height: 1.6;">
                    Hola <strong style="color: #232620;">${name}</strong>,
                </p>
 
                <p style="color: #5E6354; font-size: 15px; line-height: 1.6;">Hemos confirmado el pago de tu pedido con los siguientes detalles:</p>
 
                <div style="background: #FFFFFF; border-radius: 8px; padding: 16px; margin: 16px 0; border: 1px solid #E1E1D6;">
 
                    <p style="margin: 0; color: #232620;"><strong>Monto:</strong> $${Number(data.amount).toLocaleString('es-CO')}</p>
                    <p style="margin: 8px 0 0; color: #232620;"><strong>Método de pago:</strong> ${methodLabels[data.method] || data.method}</p>
 
                </div>
 
                <p style="color: #8A8A7C; font-size: 13px; margin-top: 24px; padding-top: 16px; border-top: 1px solid #E1E1D6;">Si no esperabas este correo, ignóralo.</p>
 
            </div>
            `,
        });
    },
};

export default emailService;