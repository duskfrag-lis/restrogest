import { Request, Response } from 'express';
import tablesService from './tables.service';

const tablesController = {

    async getAll(req: Request, res: Response) {

        try {

            const tables = await tablesService.getAllTables();
            return res.status(200).json({ tables });

        } catch (err: any) {

            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },

    async getById(req: Request, res: Response) {

        try {

            const id = req.params.is as string;
            const table = await tablesService.getTableById(id);
            return res.status(200).json({ table });

        } catch (err: any) {

            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },

    async createTable(req: Request, res: Response) {

        try {

            const { number, capacity } = req.body;

            if (!number || !capacity) {
                throw res.status(400).json({ message: 'Número y capacidad son obligatorios' });
            }

            const result = await tablesService.createTable({ number, capacity });
            return res.status(201).json({ table: result });

        } catch (err: any) {

            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },

    async updateTable(req: Request, res: Response) {

        try {

            const id = req.params.id as string;
            const { number, capacity } = req.body;

            const result = await tablesService.updateTable(id, { number, capacity });
            return res.status(200).json({ table: result });

        } catch (err: any) {

            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },

    async updateStatus(req: Request, res: Response) {

        try {

            const id = req.params.id as string;
            const { status } = req.body;

            if (!status) {
                return res.status(400).json({ message: 'El estado es obligatorio' });
            }

            const result = await tablesService.updateStatus(id, status);
            return res.status(200).json({ table: result });

        } catch (err: any) {

            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },

    async deleteTable(req: Request, res: Response) {

        try {

            const id = req.params.is as string;
            const result = await tablesService.deleteTable(id);
            return res.status(200).json(result);

        } catch ( err: any) {

            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },
};

export default tablesController;