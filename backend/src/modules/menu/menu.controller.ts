import { Request, Response } from 'express';
import menuService from './menu.service';

const menuController = {

    async getAllCategories(req: Request, res: Response) {

        try {

            const onlyActive = req.query.onlyActive === 'true';

            const categories = await menuService.getAllCategories(onlyActive);

            return res.status(200).json({ categories });

        } catch (err: any) {

            const status = err.status || 500;

            return res.status(status).json ({ message: err.message || 'Error interno del servidor' });
        }
    }, 

    async getCategoryById(req: Request, res: Response) {

        try {

            const id = req.params.id as string ;

            const category = await menuService.getCategoryById(id);

            return res.status(200).json({ category });

        } catch (err: any) {

            const status = err.status || 500;

            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },

    async createCategory(req: Request, res: Response) {

        try {

            const { name, description, sort_order } = req.body;

            if (!name) {
                return res.status(400).json({ message: 'El nombre es obligatorio'});
            }

            const result = await menuService.createCategory({ name, description, sort_order });

            return res.status(201).json({ result });

        } catch (err: any) {

            const status = err.status || 500;

            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },

    async updateCategory(req: Request, res: Response) {

        try {

            const id = req.params.id as string;

            const { name, description, sort_order, is_active } = req.body;

            const result = await menuService.updateCategory(id, {
                name, description, sort_order, is_active
            });

            return res.status(200).json({ result });

        } catch (err: any) {

            const status = err.status || 500;

            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },

    async toggleCategory(req: Request, res: Response) {

        try {

            const id = req.params.id as string;

            const result = await menuService.toggleCategory(id);

            return res.status(200).json({ result});

        } catch (err: any){

            const status = err.status || 500;

            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },

    async getAllItems(req: Request, res: Response) {

        try {

            const onlyActive = req.query.onlyActive === 'true';

            const items = await menuService.getAllItems(onlyActive);

            return res.status(200).json({ result: items});

        } catch (err: any) {

            const status = err.status || 500;

            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },

    async getItemById(req: Request, res: Response) {

        try{

            const id = req.params.id as string;

            const item = await menuService.getItemById(id);

            return res.status(200).json({ item });

        } catch (err: any) {

            const status = err.status || 500;

            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },

    async getItemsByCategory(req: Request, res: Response) {

        try {

            const categoryId = req.params.id as string;

            const onlyActive = req.query.onlyActive === 'true';

            const items = await menuService.getItemsByCategory(categoryId, onlyActive);

            return res.status(200).json({ items });

        } catch (err: any) {

            const status = err.status || 500;

            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },

    async createItem(req: Request, res: Response) {

        try {

            const { category_id, name, description, price } = req.body;

            if (!category_id || !name || price === undefined) {
                return res.status(400).json({ message: 'Categoría, nombre y precio son obligatorios.' });
            }

            const file = req.file as Express.Multer.File;

            const filePath = file?.path;

            const result = await menuService.createItem({ category_id, name, description, price }, filePath);

            return res.status(201).json({ result });

        } catch (err: any) {

            const  status = err.status || 500;

            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },

    async updateItem(req: Request, res: Response) {

        try {

            const id = req.params.id as string;

            const { category_id, name, description, price, is_active } = req.body;

            const file = req.file as Express.Multer.File;
            const filePath = file?.path;

            const result = await menuService.updateItem(id, { category_id, name, description, price, is_active }, filePath);

            return res.status(200).json({ result });

        } catch (err: any) {

            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },

    async toggleItem(req: Request, res: Response) {

        try {

            const id = req.params.id as string;

            const result = await menuService.toggleItem(id);

            return res.status(200).json({ result });

        } catch (err: any) {

            const status = err.status || 500;

            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    }
}

export default menuController;