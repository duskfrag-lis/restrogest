import { Request, Response } from 'express';
import reservationsService from './reservations.service';

const reservationsController = {

    async getAll(req: Request, res: Response) {

        try {

            const reservations = await reservationsService.getAllReservations();
            return res.status(200).json({ reservations });

        } catch (err: any) {

            const status = err.status || 500;
            res.status(status).json({ message: err.message || 'Error interno del servidor'});
        }
    },

    async getToday(req: Request, res: Response) {

        try {

            const reservations = await reservationsService.getTodayReservations();
            return res.status(200).json({ reservations });

        } catch (err: any) {

            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },

    async getById(req: Request, res: Response) {

        try {

            const id = req.params.id as string;
            const reservation = await reservationsService.getReservationById(id);
            return res.status(200).json({ reservation });

        } catch (err: any) {

            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor '});
        }
    },

    async getMyReservations(req: Request, res: Response) {

        try {

            const clientId = (req as any).user.id;
            const reservations = await reservationsService.getMyReservations(clientId);
            return res.status(200).json({ reservations });

        } catch (err: any) {

            const status = err.status || 500;
            return res.status(status).json({ message: err.menssage || 'Error interno del servidor' });
        }
    },

    async getAvailableTables(req: Request, res: Response) {

       try {

            const { reserved_at, party_size } = req.query;

            if (!reserved_at || !party_size) {
                return res.status(400).json({ message: 'Fecha y número de personas son obligatorios' });
            }

            const tables = await reservationsService.getAvailableTables(
                reserved_at as string, Number(party_size)
            );

            return res.status(200).json({ tables });

        } catch (err: any) {

            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },

    async create(req: Request, res: Response) {

        try {

            const user = (req as any).user;
            const { table_id, reserved_at, party_size, notes } = req.body;

            if (!table_id || !reserved_at || !party_size) {
                return res.status(400).json({ message: 'Mesa, fecha y número de personas son obligatorios' });
            }

            const reservation = await reservationsService.createReservation({

                user_id: user.id,
                user_email: user.email,
                user_name: user.first_name || 'Cliente',
                table_id,
                reserved_at,
                party_size: Number(party_size),
                notes,
            });

            return res.status(201).json({ reservation });

        } catch (err: any) {

            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },

    async cancel(req: Request, res: Response) {

        try {

            const id = req.params.id as string;
            const user = (req as any).user;

            const reservation = await reservationsService.cancelReservation(id, user.id, user.role);
            return res.status(200).json({ reservation });

        } catch (err: any) {

            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },

    async markNoShow(req: Request, res: Response) {

        try {

            const id = req.params.id as string;
            const result = await reservationsService.markNoShow(id);
            return res.status(200).json(result);

        } catch (err: any) {
            
            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },
};

export default reservationsController;