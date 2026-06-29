import { Request, Response } from 'express';
import kitchenService from './kitchen.service';

const kitchenController = {

    async getActiveOrders(req: Request, res: Response) {

        try {

            const orders = await kitchenService.getActiveOrders();
            return res.status(200).json({ orders });

        } catch (err: any) {

            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },

    async getOrderWithItems(req: Request, res: Response) {

        try {

            const id = req.params.id as string;
            const order = await kitchenService.getOrderWithItems(id);
            return res.status(200).json({ order });

        } catch (err: any) {

            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },

    async updateItemStatus(req: Request, res: Response) {

        try {

            const orderId = req.params.id as string;
            const itemId = req.params.itemId as string;
            const { status } = req.body;

            if (!status) {
                return res.status(400).json({ message: 'El estado es obligatorio' });
            }

            const item = await kitchenService.updateItemStatus(orderId, itemId, status);

            return res.status(200).json({ item });

        } catch (err: any) {

            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },

    async markOrderReady(req: Request, res: Response) {

        try {

            const id = req.params.id as string;
            const order = await kitchenService.markOrderReady(id);
            return res.status(200).json({ order });

        } catch (err: any) {

            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },
};

export default kitchenController;