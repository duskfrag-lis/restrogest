import menuRepository from "./menu.repository";
import { uploadImage, deleteImage } from "../../config/cloudinary";
import fs from 'fs';

const menuService = {

    async getAllCategories(onlyActive = false) {
        return await menuRepository.findAllCategories(onlyActive);
    },

    async getCategoryById(id: string) {

        const category = await menuRepository.findCategoryById(id);

        if (!category) throw { status: 404, message: 'Categoría no encontrada' };

        return category;
    },

    async createCategory(data: {

        name: string;
        description?: string;
        sort_order?: number;
    }) {

        return await menuRepository.createCategory(data);
    },

    async updateCategory(id: string, data: {

        name?: string;
        description?: string;
        sort_order?: number;
        is_active?: boolean;
    }) {

        const category = await menuRepository.findCategoryById(id);

        if (!category) throw { status: 404, message: 'Categoría no encontrada' };

        const updated = await menuRepository.updateCategory(id, data);
        return updated;
    },

    async toggleCategory(id: string) {

        const category = await menuRepository.findCategoryById(id);

        if (!category) throw { status: 404, message: 'Categoría no encontrada' };

        const updated = await menuRepository.updateCategory(id, {
            is_active: !category.is_active,
        });

        const action = updated.is_active ? 'Activada' : 'Desactivada';

        return { message: `Categoría ${action} correctamente`, category: updated };
    },

    async getAllItems(onlyActive = false) {
        return await menuRepository.findAllItems(onlyActive);
    },

    async getItemById(id: string) {
        
        const item = await menuRepository.findItemById(id);

        if (!item) throw { status: 404, message: 'Ítem no encontrado' };

        return item;
    },

    async getItemsByCategory(categoryId: string, onlyActive = false) {

        const category = await menuRepository.findCategoryById(categoryId);

        if (!category) throw { status: 404, message: 'Categoría no encontrada' };

        return await menuRepository.findItemsByCategory(categoryId, onlyActive);
    },

    async createItem(data: {
        category_id: string;
        name: string;
        description?: string;
        price: number;
    },

    filePath?: string
    ) {

        if (data.price < 0) {
            throw { status: 400, message: 'El precio no puede ser negativo' };
        }

        const category = await menuRepository.findCategoryById(data.category_id);

        if (!category) throw { status: 404, message: 'Categoría no encontrada' };
        if (!category.is_active) throw { status: 400, message: 'No se pueden agregar ítems a una categoría inactiva' };

        let image_url: string | undefined;

        if (filePath) {
            image_url = await uploadImage(filePath, 'menu');
            fs.unlinkSync(filePath);
        }

        return await menuRepository.createItem({ ...data, image_url });
    },

    async updateItem(id: string, data: {
        category_id?: string;
        name?: string;
        description?: string;
        price?: number;
        is_active?: boolean;
    }, 

    filePath?: string
    ) {

        const item = await menuRepository.findItemById(id);

        if (!item) throw { status: 404, message: 'Ítem no encontrado' };

        if (data.price !== undefined && data.price < 0) {
            throw { status: 400, message: 'El preci0 no puede ser negativo' };
        }

        if (data.category_id) {

            const category = await menuRepository.findCategoryById(data.category_id);

            if (!category) throw { status: 404, message: 'Categoría no encontrada' };
        }

        let image_url : string | undefined;

        if (filePath) {
            
            if (item.image_url) {
                await deleteImage(item.image_url).catch(() => null);
            }

            image_url = await uploadImage(filePath, 'menu');
            fs.unlinkSync(filePath);
        }

        return await menuRepository.updateItem(id, { ...data, image_url });
    },

    async toggleItem(id: string) {

        const item = await menuRepository.findItemById(id);

        if (!item) throw { status: 404, message: 'Ítem no encontrado' };

        const updated = await menuRepository.updateItem(id, { is_active: !item.is_active, });

        const action = updated.is_active ? 'activado' : 'desactivado';

        return { message: `Ítem ${action} correctamente`, item: updated };
    },
};

export default menuService;