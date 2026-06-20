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
};

export default usersController;
