import { Request, Response } from 'express';
import paymentsService from './payments.service';
import wompiClient from '../../config/wompi';

const paymentsController = {

    async findAll(req: Request, res: Response) {

        try {
            const payments = await paymentsService.findAll();
            return res.status(200).json({ payments });
        } catch (err: any) {
            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },

    async findById(req: Request, res: Response) {

        try {

            const id = req.params.id as string;
            const payment = await paymentsService.findById(id);
            return res.status(200).json({ payment });
        } catch (err: any) {
            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },

    async findByOrderId(req: Request, res: Response) {

        try {

            const orderId = req.params.id as string;
            const payments = await paymentsService.findByOrderId(orderId);
            return res.status(200).json({ payments });
        } catch (err: any) {
            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },

    async create(req: Request, res: Response) {

        try {

            const { order_id, method } = req.body;

            if (!order_id || !method) {
                return res.status(400).json({ message: 'order_id y method son obligatorios' });
            }

            const result = await paymentsService.create({ order_id, method });

            return res.status(201).json({ message: 'Pago registrado exitosamente', ...result });

        } catch (err: any) {
            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },

    async confirmManual(req: Request, res: Response) {

        try {

            const { status } = req.body;

            if (!['aprobado', 'rechazado'].includes(status)) {
                return res.status(400).json({ message: "status debe ser 'aprobado' o 'rechazado'" });
            }

            const payment = await paymentsService.confirmManual(req.params.id as string, status);

            return res.status(200).json({ message: 'Pago actualizado exitosamente', payment });

        } catch (err: any) {
            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },

    async refund(req: Request, res: Response) {

        try {

            const id = req.params.id as string;
            const payment = await paymentsService.refund(id);
            return res.status(200).json({ message: 'Pago reembolsado exitosamente', payment });

        } catch (err: any) {
            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },
    
    async webhook(req: Request, res: Response) {

        try {

            const isValid = wompiClient.verifyWebhookSignature(req.body);

            if (!isValid) {
                return res.status(401).json({ message: 'Firma de evento inválida' });
            }

            await paymentsService.handleWebhookEvent(req.body);

            return res.status(200).json({ received: true });

        } catch (err: any) {

            console.error('Error procesando webhook de Wompi:', err);
            return res.status(200).json({ received: true });
        }
    },
};

export default paymentsController;