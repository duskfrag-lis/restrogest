import { Request, Response } from 'express';
import deliveryService from './delivery.service';

const deliveryController = {

    async getAll(req: Request, res: Response) {

        try {

            const status = req.query.status as string | undefined;
            const deliveries = await deliveryService.getAllDeliveries(status);

            return res.status(200).json({ deliveries });

        } catch (err: any) {

            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },

    async getById(req: Request, res: Response) {

        try {

            const id = req.params.id as string;
            const delivery = await deliveryService.getDeliveryById(id);

            return res.status(200).json({ delivery });

        } catch (err: any) {

            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },

    async getMyDeliveries(req: Request, res: Response) {

        try {

            const clientId = (req as any).user.id;
            const deliveries = await deliveryService.getMyDeliveries(clientId);

            return res.status(200).json({ deliveries });

        } catch (err: any) {

            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor'});
        }
    },

    async create(req: Request, res: Response) {

        try {

            const client_id = (req as any).user.id;
            const { items, address, phone, payment_method, client_lat, client_lng } = req.body;

            if (!items || !address || !phone || !payment_method || !client_lat || !client_lng) {
                return res.status(400).json({ message: 'Ítems, dirección, teléfono, método de pago y ubicación son obligatorios'});
            }

            const delivery = await deliveryService.createDeliveryOrder({
                client_id, items, address, phone,payment_method, client_lat, client_lng
            });

            return res.status(201).json({ delivery });

        } catch (err: any) {

            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },

    async updateStatus(req: Request, res: Response) {

        try {

            const id = req.params.id as string;
            const { status } = req.body;
            const userRole = (req as any).user.role;

            if (!status) {
                return res.status(400).json({ message: 'El estado es obligatorio'});
            }

            const delivery = await deliveryService.updateStatus(id, status, userRole);

            return res.status(200).json({ delivery });

        } catch (err: any) {

            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },

    async assignDeliverer(req: Request, res: Response) {

        try {

            const id = req.params.id as string;
            const { deliverer_id } = req.body;

            if (!deliverer_id) {
                return res.status(400).json({ message: 'El domiciliario es obligatorio' });
            }

            const delivery = await deliveryService.assignDeliverer(id, deliverer_id);

            return res.status(200).json({ delivery });

        } catch (err: any) {

            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },

    async getCoverageZones(req: Request, res: Response) {

        try {

            const zones = await deliveryService.getCoverageZones();
            return res.status(200).json({ zones });

        } catch (err: any) {
            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },

    async updateCoverageZones(req: Request, res: Response) {

        try {

            const { type, center_lat, center_lng, radius_km } = req.body;

            if (!type || !center_lat || !center_lng || !radius_km) {
                res.status(400).json({ message: 'Todos los campos de zona de cobertura son obligatorios' });
            }

            const result = await deliveryService.updateCoverageZones({
                type, center_lat, center_lng, radius_km
            });

            return res.status(200).json(result);

        } catch (err: any) {

            const status = err.status || 500;
            return res.status(status).json({message: err.menssage || 'Error interno del servidor' });
        }
    },
};

export default deliveryController;