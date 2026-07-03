import pool from '../../config/db';
import paymentsRepository from './payments.repository';
import ordersRepository from '../orders/orders.repository';
import wompiClient from '../../config/wompi';
import emailService from '../../config/email';

const VALID_METHODS = ['efectivo', 'tarjeta', 'pse', 'contra_entrega'];
const ONLINE_METHODS = ['tarjeta', 'pse']; 

export interface CreatePaymentDTO {
    order_id: string;
    method: string;
}

const paymentsService = {

    async findAll() {
        return await paymentsRepository.findAll();
    },

    async findById(id: string) {

        const payment = await paymentsRepository.findById(id);
        if (!payment) throw { status: 404, message: 'Pago no encontrado' };
        return payment;
    },

    async findByOrderId(orderId: string) {
        return await paymentsRepository.findByOrderId(orderId);
    },

    async create(data: CreatePaymentDTO) {

        if (!VALID_METHODS.includes(data.method)) {
            throw { status: 400, message: `Método de pago inválido. Opciones: ${VALID_METHODS.join(', ')}` };
        }

        const order = await ordersRepository.findById(data.order_id);

        if (!order) throw { status: 404, message: 'Pedido no encontrado' };

        const existing = await paymentsRepository.findByOrderId(data.order_id);
        const alreadyApproved = existing.find(p => p.status === 'aprobado');

        if (alreadyApproved) {
            throw { status: 409, message: 'Este pedido ya tiene un pago aprobado' };
        }

        const payment = await paymentsRepository.create({

            order_id: data.order_id,
            method: data.method,
            amount: order.total,
        });

        if (!ONLINE_METHODS.includes(data.method)) {
            return { payment, checkout: null };
        }

        const amountInCents = Math.round(Number(order.total) * 100);

        const checkout = wompiClient.buildCheckoutData({

            amountInCents,
            reference: payment.id, 
            redirectUrl: `${process.env.FRONTEND_URL}/orders/${data.order_id}/payment-result`,
        });

        return { payment, checkout };
    },

    async confirmManual(id: string, status: 'aprobado' | 'rechazado') {

        const payment = await paymentsRepository.findById(id);

        if (!payment) throw { status: 404, message: 'Pago no encontrado' };

        if (payment.status !== 'pendiente') {
            throw { status: 400, message: `Este pago ya está en estado '${payment.status}'` };
        }

        return await paymentsService._resolvePayment(payment, status);
    },

    async refund(id: string) {

        const payment = await paymentsRepository.findById(id);

        if (!payment) throw { status: 404, message: 'Pago no encontrado' };

        if (payment.status !== 'aprobado') {
            throw { status: 400, message: 'Solo se pueden reembolsar pagos aprobados' };
        }

        const client = await pool.connect();

        try {

            await client.query('BEGIN');

            const updated = await paymentsRepository.updateStatus(id, 'reembolsado', client);
            await paymentsRepository.syncDeliveryPaymentStatus(payment.order_id, 'reembolsado', client);

            await client.query('COMMIT');

            return updated;

        } catch (err) {

            await client.query('ROLLBACK');
            throw err;

        } finally {

            client.release();
        }
    },

    async handleWebhookEvent(payload: any) {

        const transactionId = payload?.data?.transaction?.id;
        const wompiStatus = payload?.data?.transaction?.status; 
        const reference = payload?.data?.transaction?.reference; 

        if (!transactionId || !wompiStatus || !reference) {
            throw { status: 400, message: 'Payload de webhook incompleto' };
        }

        const payment = await paymentsRepository.findById(reference);

        if (!payment) {
            
            console.warn(`Webhook recibido para payment inexistente: ${reference}`);
            return;
        }

        if (payment.status !== 'pendiente') {
            return;
        }

        const statusMap: Record<string, 'aprobado' | 'rechazado'> = {
            APPROVED: 'aprobado',
            DECLINED: 'rechazado',
            ERROR: 'rechazado',
            VOIDED: 'rechazado',
        };

        const mappedStatus = statusMap[wompiStatus];

        if (!mappedStatus) return;

        await paymentsRepository.updateTransactionId(payment.id, transactionId);

        await paymentsService._resolvePayment(payment, mappedStatus);
    },

    async _resolvePayment(payment: any, status: 'aprobado' | 'rechazado') {

        const client = await pool.connect();

        try {

            await client.query('BEGIN');

            const updated = await paymentsRepository.updateStatus(payment.id, status, client);
            await paymentsRepository.syncDeliveryPaymentStatus(payment.order_id, status, client);

            await client.query('COMMIT');

            if (status === 'aprobado') {

                const clientInfo = await paymentsRepository.findClientEmailByOrderId(payment.order_id);

                if (clientInfo) {

                    await emailService.sendPaymentConfirmation(

                        clientInfo.email,
                        `${clientInfo.first_name} ${clientInfo.last_name}`,
                        { amount: payment.amount, method: payment.method },
                    );
                }
                
            }

            return updated;

        } catch (err) {

            await client.query('ROLLBACK');
            throw err;

        } finally {

            client.release();
        }
    },
};

export default paymentsService;