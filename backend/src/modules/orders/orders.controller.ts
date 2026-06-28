import { Request, Response } from 'express';
import ordersService from './orders.service';

const ordersController = {

    async getAll(req: Request, res: Response) {

        try {

            const status = req.query.status as string | undefined;
            const orders = await ordersService.getAllOrders(status);

            return res.status(200).json({ orders });

        } catch (err: any) {

            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },

    async getById(req: Request, res: Response) {

        try {

            const id = req.params.id as string;
            const order = await ordersService.getOrderById(id);

            return res.status(200).json({ order });

        } catch (err: any) {

            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },

    async getByTable(req: Request, res: Response) {

        try {

            const tableId = req.params.tableId as string;
            const orders = await ordersService.getOrdersByTable(tableId);

            return res.status(200).json({ orders });

        } catch (err: any) {

            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },

    async create(req: Request, res: Response) {

        try {

            const { table_id } = req.body;
            const waiter_id = (req as any).user.id;

            if (!table_id) {
                return res.status(400).json({ message: 'La mesa es obligatoria' });
            }

            const order = await ordersService.createOrder({ table_id, waiter_id });
            return res.status(201).json({ order });

        } catch (err: any) {

            const status = err.status || 500;
            return res.status(status).json({ message: err.mesage || 'Error interno del servidor' });
        }
    },

    async addItem(req: Request, res: Response) {

        try {

            const orderId = req.params.Id as string;
            const { menu_item_id, quantity, notes } = req.body;

            if (!menu_item_id || !quantity) {
                throw res.status(400).json({ message: 'El ítem y la cantidad son obligatorios' });
            }

            const item = await ordersService.addItem(orderId, { menu_item_id, quantity, notes });
            return res.status(201).json({ item });

        } catch (err: any) {

            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },

    async removeItem(req: Request, res: Response) {

        try {

            const orderId = req.params.id as string;
            const orderItemId = req.params.itemId as string;

            const result = await ordersService.removeItem(orderId, orderItemId);

            return res.status(200).json({ result });

        } catch (err: any) {

            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del  servidor' });
        }
    },

    async sendToKitchen(req: Request, res: Response) {

        try {

            const id = req.params.id as string;
            const order  = await ordersService.sendToKitchen(id);

            return res.status(200).json({ order });

        } catch (err: any) {

            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },

    async updateStatus(req: Request, res: Response) {

        try {

            const id = req.params.id as string;
            const { status } = req.body;
            const userId = (req as any).user.id;
            const userRole = (req as any).user.role;
        
            if (!status) {
                throw res.status(400).json({ message: 'El estado es obligatorio' });
            }

            const order = await ordersService.updateStatus(id, status, userId, userRole);
            return res.status(200).json({ order });

        } catch (err: any) {

            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },

};

export default ordersController;
