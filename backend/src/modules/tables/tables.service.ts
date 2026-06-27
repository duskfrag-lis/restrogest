import tablesRepository from "./tables.repository";

const VALID_STATUSES = ['disponible', 'ocupada', 'reservada', 'en_limpieza'];

const tablesService = {

    async getAllTables() {
        return await tablesRepository.findAll();
    },

    async getTableById(id: string) {

        const table = await tablesRepository.findById(id);

        if (!table) throw { status: 404, message: 'Mesa no encontrada' };

        return table;
    },

    async createTable(data: { number: number; capacity: number }) {

        if (!data.number || !data.capacity) {
            throw { status: 400, message: 'Número y capacidad son obligatorios' };
        }

        if (data.capacity < 1) {
            throw { status: 400, message: 'La capacidad debe ser mayor a 0' };
        }

        const existing = await tablesRepository.findByNumber(data.number);

        if (existing) {
            throw { status: 409, message: `Ya existe una mesa con el número ${data.number} `};
        }

        return await tablesRepository.create(data);
    },

    async updateTable(id: string, data: {number?: number, capacity?: number }) {

        const table = await tablesRepository.findById(id);

        if (!table) throw { status: 404, message: 'Mesa no encontrada' };

        if (data.number) {

            const existing = await tablesRepository.findByNumber(data.number);

            if (existing && existing.is !== id) {
                throw { status: 409, message: `Ya existe una mesa con el número ${data.number} `};
            }
        }

        if (data.capacity !== undefined && data.capacity < 1) {
            throw { status: 400, message: 'La capacidad debe ser mayor a 0 '};
        }

        return await tablesRepository.update(id, data);
    },

    async updateStatus(id: string, status: string) {

        const table = await tablesRepository.findById(id);

        if (!table) throw { status: 404, message: 'Mesa no encontrada'};

        if (!VALID_STATUSES.includes(status)) {
            throw { status: 400, message: `Estado inválido. Los estados válidos son ${VALID_STATUSES.join(', ')} `};
        }

        if (table.status === 'reservada' && status === 'ocupada') {
            throw { status: 400, message: 'Una mesa reservada no puede pasar directamente a ocupada. Debe ser atendida primero.' };
        }

        return await tablesRepository.updateStatus(id, status);
    },

    async deleteTable(id: string) {

        const table = await tablesRepository.findById(id);

        if (!table) throw { status: 404, message: 'Mesa no encontrada' };

        if (table.status !== 'disponible') {
            throw { status: 400, message: 'Solo se pueden eliminar mesas en estado disponible' };
        }

        await tablesRepository.delete(id);

        return { message: 'Mesa eliminada correctamente' };
    },
};

export default tablesService;