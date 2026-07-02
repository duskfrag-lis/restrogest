import ordersRepository from "./orders.repository";
import tablesRepository from "../tables/tables.repository";
import menuRepository from "../menu/menu.repository";
import pool from "../../config/db";
import { getIO } from "../../config/socket";

const ordersService = {

    async getAllOrders(status?: string) {
        return await ordersRepository.findAll(status);
    },

    async getOrderById(id: string) {

        const order = await ordersRepository.findById(id);

        if (!order) throw { status: 404, message: 'Pedido no encontrado' };

        const items = await ordersRepository.findItemsByOrderId(id);

        return { ...order, items };
    },

    async getOrdersByTable(tableId: string) {

        const table = await tablesRepository.findById(tableId);

        if (!table) throw { status: 404, message: 'Mesa no encontrada' };

        return await ordersRepository.findByTableId(tableId);
    },

    async createOrder(data: { table_id: string, waiter_id: string }) {

        const table = await tablesRepository.findById(data.table_id);

        if (!table) throw { status: 404, message: 'Mesa no encontrada' };

        if (!['disponible', 'ocupada'].includes(table.status)) {
            throw { status: 400, message: `No se puede abrir un pedido en una mesa con estado '${table.status}' `};
        }

        const order = await ordersRepository.create(data);

        if (table.status === 'disponible') {

            await tablesRepository.updateStatus(data.table_id, 'ocupada');
        }

        return order;
    },

    async addItem(orderId: string, data: {

        menu_item_id: string;
        quantity: number;
        notes?: string;

    }) {
        const order = await ordersRepository.findById(orderId);

        if (!order) throw { status: 404, message: 'Pedido no encontrado' };

        if (order.status !== 'pendiente') {
            throw { status: 400, message: 'No se puede agregar ítems a un pedido ya enviado a cocina' };
        }

        const menuItem = await menuRepository.findItemById(data.menu_item_id);

        if (!menuItem) throw { status: 404, message: 'Ítem del menú no encontrado' };

        if (!menuItem.is_active) throw { status: 400, message: 'Este ítem no está disponible actualmente' };

        const item = await ordersRepository.addItem({

            order_id: orderId,
            menu_item_id: data.menu_item_id,
            quantity: data.quantity,
            unit_price: menuItem.price,
            notes: data.notes,
        });

        await ordersRepository.updateTotal(orderId);

        return item;
    },

    async removeItem(orderId: string, orderItemId: string) {

        const order = await ordersRepository.findById(orderId);

        if (!order) throw { status: 404, message: 'Pedido no encontrado' };

        if (order.status !== 'pendiente') {
            throw { status: 400, message: 'No se pueden quitar ítems a un pedido ya enviado a cocina' };
        }

        await ordersRepository.removeItem(orderItemId);
        await ordersRepository.updateTotal(orderId);

        return { message: 'Ítem eliminado del pedido' };
    },

    async sendToKitchen(orderId: string) {

        const order = await ordersRepository.findById(orderId);

        if (!order) throw { status: 404, message: 'Pedido no encontrado' };

        if (order.status !== 'pendiente') {
            throw { status: 400, message: 'Este pedido ya fue enviado a cocina' };
        }

        const items = await ordersRepository.findItemsByOrderId(orderId);

        if (items.length === 0) {
            throw { status: 400, message: 'No se puede enviar a cocina un pedido sin ítems' };
        }

        const updated = await ordersRepository.updateStatus(orderId, 'en_preparacion');

        const io = getIO();
        io.to('kitchen').emit('new_order', { ...updated, items });

        return updated;
    },

    async updateStatus(orderId: string, status: string, userId: string, userRole: string) {

        const order = await ordersRepository.findById(orderId);

        if (!order) throw { status: 404, message: 'Pedido no encontrado' };

        const VALID_TRANSITIONS: Record<string, string[]> = {

            'pendiente': ['en_preparacion', 'cancelado'],
            'en_preparacion': ['listo', 'cancelado'],
            'listo': ['entregado'],
            'entregado': ['cerrado'],
            'cerrado': [],
            'cancelado': [],
        };

        if (!VALID_TRANSITIONS[order.status]?.includes(status)) {
            throw { status: 400, message: `No se puede cambiar el estado de '${order.status}' a '${status}' `};
        } 

        if (status === 'cancelado' && userRole !== 'administrador') {
            throw { status: 403, message: 'Solo el administrador puede cancelar un pedido enviado a cocina' };
        }

        if (status === 'cerrado') {
            if (order.status !== 'entregado') {
                throw { status: 400, message: 'Solo se pueden cerrar pedidos en estado entregado' };
            }

            if (userRole !== 'mesero' && userRole !== 'administrador') {
                throw { status: 403, message: 'Solo el mesero o el administrador pueden cerrar un pedido' };
            }

            await tablesRepository.updateStatus(order.table_id, 'disponible');
        }

        return await ordersRepository.updateStatus(orderId, status);
    },
};

export default ordersService;