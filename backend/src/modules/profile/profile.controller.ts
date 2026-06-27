import { Request, Response } from "express";
import profileService from "./profile.service";

const profileController = {

    async getProfile(req: Request, res: Response) {

        try {

            const id = (req as any).user.id;
            const user = await profileService.getProfile(id);

            return res.status(200).json({ user });

        } catch (err: any) {

            const status = err.status || 500;

            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },

    async updateProfile(req: Request, res: Response) {

        try {

            const id = (req as any).user.id;
            const { first_name, last_name, phone } = req.body;
            const file = req.file as Express.Multer.File;
            const filePath = file?.path;
            
            const result = await profileService.updateProfile(id, { first_name, last_name, phone }, filePath);

            return res.status(200).json({ user: result })

        } catch (err: any) {

            const status = err.status || 500;

            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },

    async changePassword(req: Request, res: Response) {

        try {

            const id = (req as any).user.id;
            const { currentPassword, newPassword } = req.body;

            if (!currentPassword || !newPassword) {
                return res.status(400).json({ message: 'Contraseña actual y nueva son obligatorias' });
            }

            const result = await profileService.changePassword(id, currentPassword, newPassword);

            return res.status(200).json( result );

        } catch (err: any) {

            const status = err.status || 500;

            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },

    async deleteAccount(req:Request, res:Response) {

        try {

            const id = (req as any).user.id;
            const result = await profileService.deleteAccount(id);

            res.clearCookie('token');
            
            return res.status(200).json(result);

        } catch (err: any) {

            const status = err.status || 500;

            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },
};

export default profileController;