import { Request, Response } from 'express';
import restaurantInfoService from './restaurant_info.service';

const restaurantInfoController = {

    async getPublicInfo(req: Request, res: Response) {

        try {

            const info = await restaurantInfoService.getInfo();
            return res.status(200).json({ info });

        } catch (err: any) {

            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },

    async update(req: Request, res: Response) {

        try {

            const { name, description, address, phone, email, schedule, social_links } = req.body;

            const info = await restaurantInfoService.updatedInfo({
                name, description, address, phone, email, schedule, social_links,
            });

            return res.status(200).json({ message: 'Información actualizada exitosamente', info });

        } catch (err: any) {

            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },
};

export default restaurantInfoController;