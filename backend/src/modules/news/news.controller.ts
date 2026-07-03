import { Request, Response } from 'express';
import newsService from './news.service';

const newsController = {

    async getPublicNews(req: Request, res: Response) {

        try {
            const news = await newsService.getPublicNews();
            return res.status(200).json({ news });

        } catch (err: any) {
            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor'});
        }
    },

    async getPublicNewsById(req: Request, res: Response) {

        try {
            const id = req.params.id as string;
            const news = await newsService.getPublicNewsById(id);
            return res.status(200).json({ news });

        } catch (err: any) {
            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor'});
        }
    },

    async getAllNews(req: Request, res: Response) {

        try {
            const news = await newsService.getAllNews();
            return res.status(200).json({ news });

        } catch (err: any) {
            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor'});
        }
    },

    async create(req: Request, res: Response) {

        try {
            const user = (req as any).user;
            const { title, body } = req.body;

            const news = await newsService.create({
                author_id: user.id, title, body
            });

            return res.status(201).json({ message: 'Noticia creada exitosamente', news });

        } catch (err: any) {
            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor'});
        }
    },

    async update(req: Request, res: Response) {

        try {
            const id = req.params.id as string;
            const { title, body } = req.body;

            const news = await newsService.update(id, { title, body });

            return res.status(200).json({ message: 'Noticia actualizada exitosamente' , news});

        } catch (err: any) {
            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor'});
        }
    },

    async publish(req: Request, res: Response) {

        try {
            const id = req.params.id as string;
            const news = await newsService.publish(id);
            return res.status(200).json({ message: 'Noticia publicada exitosamente',news });

        } catch (err: any) {
            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor'});
        }
    },

    async unpublish(req: Request, res: Response) {

        try {
            const id = req.params.id as string;
            const news = await newsService.unpublish(id);
            return res.status(200).json({ message: 'Noticia despublicada exitosamente' });

        } catch (err: any) {
            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor'});
        }
    },
};

export default newsController;