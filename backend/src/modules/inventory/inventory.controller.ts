import { Request, Response } from 'express';
import inventoryService from './inventory.service';

const inventoryController = {

    async findAll(req: Request, res: Response) {

        try {

            const items = await inventoryService.findAll();

            return res.status(200).json({ items });

        } catch (err: any) {

            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor'});
        }
    },

    async findLowStock(req: Request, res: Response) {

        try {

            const items = await inventoryService.findLowStock();

            return res.status(200).json({ items });

        } catch (err: any) {

            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },

    async findExpiringSoon(req: Request, res: Response) {

        try {

            const days = req.query.days ? parseInt(req.query.days as string) : 7;
            const items = await inventoryService.findExpiringSoon(days);

            return res.status(200).json({ items });

        } catch (err: any) {

            const status = err.status || 500;

            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },

    async findExpired(req: Request, res: Response) {

        try {

            const items = await inventoryService.findExpired();

            return res.status(200).json({ items });

        } catch (err: any) {

            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },

    async findById(req: Request, res: Response) {

        try {

            const id = req.params.id as string;

            if (!id) {
                return res.status(400).json({ message: 'El ID del ítem es obligatorio' });
            }

            const item = await inventoryService.findById(id);

            return res.status(200).json({ item });

        } catch (err: any) {

            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },

    async create(req: Request, res: Response) {

        try {

            const { name, quantity, unit, min_threshold, expiry_date } = req.body;

            if (!name || quantity === undefined || !unit || min_threshold === undefined) {
                return res.status(400).json({ message: 'Nombre, cantidad, unidad, de medida y umbral mínimo son obligatorios'});
            }

            const item = await inventoryService.create({

                name, quantity, unit, min_threshold, expiry_date,
            });

            return res.status(201).json({ message: 'ítem de inventario creado exitosamente', item }); 

        } catch (err: any) {

            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor'});
        }
    },

    async update(req: Request, res: Response) {

        try {

            const id = req.params.id as string;
            const { name, unit, min_threshold, expiry_date } = req.body;

            if (!id) {
                return res.status(400).json({ message: 'El ID es obligatorio'});
            }

            const item = await inventoryService.update(id, {
                name, unit, min_threshold, expiry_date,
            });

            return res.status(200).json({ message: 'Ítem de inventario actualizado exitosamente', item});

        } catch (err: any) {

            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },

    async updateQuantity(req: Request, res: Response) {

        try {

            const id = req.params.id as string;
            const { quantity, reason } = req.body;
            const user = (req as any).user;

            if (!id) {
                return res.status(400).json({ message: 'El ID es obligatorio' });
            }

            if (quantity === undefined || quantity === null) {
                return res.status(400).json({ message: 'La cantidad es obligatoria' });
            }

            if (!user || !user.id) {
                return res.status(401).json({ message: 'Usuario no autenticado' });
            }

            const item = await inventoryService.updateQuantity(id, {
                quantity, reason, change_by: user.id,
            });

            return res.status(200).json({ message: 'Cantidad actualizada exitosamente', item });

        } catch (err: any) {

            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor'});
        }
    },

    async getItemMovements(req: Request, res: Response) {

        try {

            const id = req.params.id as string;

            if (!id) {
                return res.status(400).json({ message: 'El ID es obligatorio'});
            }

            const movements = await inventoryService.getItemMovements(id);
            
            return res.status(200).json({ movements });

        } catch (err: any) {

            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },

    async getAllMovements(req: Request, res: Response) {

        try {

            const movements = await inventoryService.getAllMovements();
            return res.status(200).json({ movements });

        } catch (err: any) {

            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },

    async getAlerts(req: Request, res: Response) {

        try {

            const alerts = await inventoryService.getAlerts();
            return res.status(200).json({ alerts });

        } catch (err: any) {

            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },
};

export default inventoryController;