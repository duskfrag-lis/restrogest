import { Request, Response } from 'express';
import usersService from './users.service';

const usersController = {

    async getAll(req: Request, res: Response) {

        try {

            const role = req.query.role as string | undefined;
            const users = await usersService.getAllUsers(role);

            return res.status(200).json({ users });

        } catch (err: any) {

            const status = err.status || 500;
            return res.status(status).json({ message: err.message  || 'Error interno del servidor ' });
        }

    },

    async getById(req: Request, res: Response) {

        try {

            const id = req.params.id as string;
            const user = await usersService.getUserById(id);

            return res.status(200).json({ user });

        } catch (err: any) {

            const status = err.status || 500;

            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },

    async createEmployee(req: Request, res: Response) {

        try {

            const { first_name, last_name, email, phone, role } = req.body;

            if (!first_name || !last_name || !email || !role) {
                return res.status(400).json({
                    message: 'Nombre, apellido, correo y rol son obligatorios',
                });
            }

            const result = await usersService.createEmployee({
                first_name, last_name, email, phone, role });

            return res.status(201).json(result);

        } catch (err: any) {

            const status = err.status || 500;

            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },

    async activateEmployee(req: Request, res: Response) {

        try {

            const { token, password } = req.body;

            if (!token || !password) {
                return res.status(400).json({ message: 'Token y contraseña son obligatorios.'});
            }

            const result = await usersService.activateEmployee(token, password);

            return res.status(200).json(result);

        } catch (err: any) {

            const status = err.status || 500;

            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },

    async changeRole(req: Request, res: Response) {

        try {

            const id = req.params.id as string;
            const { role } = req.body;

            if (!role) {
                return res.status(400).json({ message: 'El nuevo rol es obligatorio' });
            }

            const result = await usersService.changeRole(id, role);

            return res.status(200).json(result);

        } catch (err: any) {

            const status = err.status || 500;

            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },

    async setActiveStatus(req: Request, res: Response) {

        try {

            const id = req.params.id as string;
            const { is_active } = req.body;

            if (typeof is_active !== 'boolean') {
                return res.status(400).json({ message: 'is_active debe ser true o false' });
            }

            const result = await usersService.setActiveStatus(id, is_active);

            return res.status(200).json(result);
            
        } catch (err: any) {

            const status = err.status || 500;

            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },

    async createDeletionRequest(req: Request, res: Response) {

        try {

            const userId = (req as any).user.id;
            const userRole = (req as any).user.role;
            const { reason } = req.body;

            if (!reason) {

                return res.status(400).json({ message: 'El motivo es obligatorio' });
            }

            const request = await usersService.createDeletionRequest(userId, userRole, reason);

            return res.status(201).json({ message: 'Solicitud enviada exitosamente', request });

        } catch  (err: any) {

            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },

    async getMyDeletionRequest(req: Request, res: Response) {

        try {

            const userId = (req as any).user.id;
            const request = await usersService.getMyLatestDeletionRequest(userId);

            return res.status(200).json({ request });

        } catch (err: any) {

            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },

    async listDeletionRequest(req: Request, res: Response) {

        try {

            const { status } = req.query;
            const request = await usersService.listDeletionRequests(status as string | undefined);

            return res.status(200).json({ request });

        } catch (err: any) {

            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },

    async resolveDeletionRequest(req: Request, res: Response) {

        try {

            const adminId = (req as any).user.id;
            const id = req.params.id as string
            const { status, rejection_reason } = req.body;

            if (!['approved', 'rejected'].includes(status)) {

                return res.status(400).json({ message: 'Estado inválido' });
            }

            const request = await usersService.resolveDeletionRequest(id, adminId, status, rejection_reason);

            return res.status(200).json({ message: 'Solicitud actualizada correctamente', request });

        } catch (err: any) {

            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },
};

export default usersController;
