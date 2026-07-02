import pool from "../../config/db";
import inventoryRepository from "./inventory.repository";

export interface CreateItemDTO {

    name: string;
    quantity: number;
    unit: string;
    min_threshold: number;
    expiry_date?: string;
}

export interface UpdateItemDTO {

    name?: string;
    unit?: string; 
    min_threshold?: number;
    expiry_date?: string;
}

export interface updateQuantityDTO {

    quantity: number;
    reason?: string;
    change_by: string;
}

const inventoryService = {

    async findAll() {

        const items = await inventoryRepository.findAll();
        return items;
    },

    async findLowStock() {

        const items = await inventoryRepository.findLowStock();
        return items;
    },

    async findExpiringSoon(days: number = 7) {

        const items = await inventoryRepository.findExpiringSoon(days);
        return items;
    },

    async findExpired() {

        const items = await inventoryRepository.findExpired();
        return items;
    },

    async findById(id: string) {

        const item = await inventoryRepository.findById(id);

        if (!item) throw { status: 404, message: 'Ítem de inventario no encontrado'};

        return item;
    },

    async create(data: CreateItemDTO) {

        if (!data.name || data.name.trim().length === 0) {
            throw { status: 400, message: 'El nombre del ítem es obligatorio' };
        }

        if (data.name.length > 150) {
            throw { status: 400, message: 'El nombre no puede exceder los 150 caracteres' };
        }

        if (data.quantity === undefined || data.quantity === null || data.quantity < 0) {
            throw { status: 400, message: 'La cantidad debe ser un número positivo o cero' };
        }

        if (!data.unit || data.unit.trim().length === 0) {
            throw { status: 400, message: 'La unidad de medida es obligatoria'};
        }

        if (data.min_threshold === undefined || data.min_threshold === null || data.min_threshold < 0) {
            throw { status: 400, message: 'El umbral mínimo debe ser un número positivo o cero' };
        }

        const existing = await inventoryRepository.findByName(data.name);

        if (existing) {
            throw { status: 409, message: 'Ya existe un ítem de inventario con ese nombre' };
        }

        const item = await inventoryRepository.create({

            name: data.name.trim(),
            quantity: data.quantity,
            unit: data.unit.trim(),
            min_threshold: data.min_threshold,
            expiry_date: data.expiry_date,
        });

        return item;
    },

    async update(id: string, data: UpdateItemDTO) {

        const item = await inventoryRepository.findById(id);

        if (!item) throw { status: 404, message: 'Ítem de inventario no encontrado' };

        if (data.name && data.name.trim().toLowerCase() !== item.name.toLowerCase()) {

            const nameExist = await inventoryRepository.findByName(data.name.trim());

            if (nameExist) {
                throw { status: 409, message: 'Ya existe un ítem de inventario con ese nombre' };
            }
        }

        if (data.name && data.name.length > 150) {
            throw { status: 400, message: 'El nombre no puede exceder los 150 caracteres' };
        }

        if (data.min_threshold !== undefined && data.min_threshold < 0) {
            throw { status: 400, message: 'El umbral mínimo debe ser un número positivo o cero' };
        }

        const updatedItem = await inventoryRepository.update(id, {

            name: data.name?.trim(),
            unit: data.unit?.trim(),
            min_threshold: data.min_threshold,
            expiry_date: data.expiry_date
        });

        return updatedItem;
    },

    async updateQuantity(id: string, data: updateQuantityDTO) {

        const item = await inventoryRepository.findById(id);

        if (!item) throw { status: 404, message: 'Ítem de inventario no encontrado' };

        if (data.quantity === undefined || data.quantity === null || data.quantity < 0) {
            throw { status: 400, message: 'La cantidad debe ser un número positivo o cero'};
        }

        const quantityChange = data.quantity - item.quantity;

        const client = await pool.connect();

        try {

            await client.query('BEGIN')
            const updatedItem = await inventoryRepository.updateQuantity(id, data.quantity, client);

            await inventoryRepository.createMovement({

                item_id: id,
                quantity_change: quantityChange,
                reason: data.reason || 'Actualización manual de cantidad',
                change_by: data.change_by,
            }, client);

            await client.query('COMMIT');

            return updatedItem;

        } catch (err) {

            await client.query('ROLLBACK');
            throw err;
            
        } finally {
            client.release();
        }
    },

    async getItemMovements(itemId: string) {

        const item = await inventoryRepository.findById(itemId);

        if (!item) {
            throw { status: 404, message: 'Ítem de inventario no encontrado' };
        }

        const movements = await inventoryRepository.findMovementsByItemId(itemId);

        return movements;
    },

    async getAllMovements() {

        const movements = await inventoryRepository.findAllMovements();
        return movements;
    },

    async getAlerts() {

        const [lowStockItems, expiringSoonItems, expiredItems] = await Promise.all([

            inventoryRepository.findLowStock(),
            inventoryRepository.findExpiringSoon(7),
            inventoryRepository.findExpired(),
        ]);

        return {

            low_stock: lowStockItems,
            expiring_soon: expiringSoonItems,
            expired: expiredItems,
            total: lowStockItems.length + expiringSoonItems.length + expiredItems.length,
        };
    },
};

export default inventoryService;