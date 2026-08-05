import { Request, Response } from 'express';
import reviewsService from './reviews.service';

const reviewsController = {

    async getPublicReviews(req: Request, res: Response) {

        try {
            const data = await reviewsService.getPublicReviews();
            return res.status(200).json(data);

        } catch (err: any) {
            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor'});
        }
    },

    async getAllReviews(req: Request, res: Response) {

        try {
            const reviews = await reviewsService.getAllReviews();
            return res.status(200).json({ reviews });

        } catch (err: any) {
            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor'});
        }
    },

    async getMyReviews(req: Request, res: Response) {

        try {
            const user = (req as any).user;
            const reviews = await reviewsService.getMyReviews(user.id);
            return res.status(200).json({ reviews });

        } catch (err: any) {
            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor'});
        }
    },

    async create(req: Request, res: Response) {

        try {
            const user = (req as any).user;
            const { rating, comment } = req.body;

            const review = await reviewsService.create({
                user_id: user.id,
                rating,
                comment
            });

            return res.status(201).json({ message: 'Reseña publicada exitosamente ', review});

        } catch (err: any) {
            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor'});
        }
    },

    async setVisibility(req: Request, res: Response) {

        try {
            const id = req.params.id as string;
            const { is_visible } = req.body;

            if (typeof is_visible !== 'boolean') {
                return res.status(400).json({ message: 'is_visible debe ser true o false' });
            }

            const review = await reviewsService.setVisibility(id, is_visible);

            return res.status(200).json({

                message: is_visible ? 'Reseña visible nuevamente' : 'Reseña oculta exitosamente',
                review
            });

        } catch (err: any) {
            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor'});
        }
    },

    async checkEligibility(req: Request, res: Response) {

        try {

            const user = (req as any).user;
            const result = await reviewsService.checkEligibility(user.id);
            return res.status(200).json(result);

        } catch (err: any) {

            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor'})
        }
    }
};

export default reviewsController;