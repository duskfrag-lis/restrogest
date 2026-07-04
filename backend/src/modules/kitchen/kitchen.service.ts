import kitchenRepository from "./kitchen.repository";
import { getIO } from '../../config/socket';

const VALID_ITEM_STATUSES = ['pendiente', 'en_preparacion', 'listo'];

const kitchenService = {

    async getActiveOrders() {

        const orders = await kitchenRepository.findActiveOrders();

        const ordersWithItems = await Promise.all(
            orders.map(order => kitchenRepository.findOrderWithItems(order.id))
        );

        return ordersWithItems.filter(Boolean);
    },

    async getOrderWithItems(orderId: string) {

        const order = await kitchenRepository.findOrderWithItems(orderId);

       if (!order) throw { status: 404, message: 'Pedido no encontrado'};

       return order;
    },

    async updateItemStatus(orderId: string, itemId: string, status: string) {

        if (!VALID_ITEM_STATUSES.includes(status)) {
            throw { status: 400, message: `Estado inválido. Los estados válidos son ${VALID_ITEM_STATUSES.join(', ')}`};
        }

        const order = await kitchenRepository.findOrderWithItems(orderId);

        if (!order) throw { status: 404, message: 'Pedido no encontrado'};

        const updatedItem = await kitchenRepository.updateItemStatus(itemId, status);

        if (!updatedItem) throw { status: 404, message: 'Ítem no encontrado'};

        const io = getIO();

        io.to('kitchen').emit('item_status_updated', {
            order_id: orderId, item: updatedItem,
        });

        if (status === 'listo') {

            const allReady = await kitchenRepository.checkAllItemsReady(orderId);

            if (allReady) {

                const updatedOrder = await kitchenRepository.updateOrderStatus(orderId, 'listo');

                io.to('kitchen').emit('order_ready', updatedOrder);
                io.to(`waiter_${order.waiter_id}`).emit('order_ready', {
                    ...updatedOrder, table_number: order.table_number,
                });
            }
        }

        return updatedItem;
    },

    async markOrderReady(orderId: string) {

        const order = await kitchenRepository.findOrderWithItems(orderId);

        if (!order) throw { status: 404, message: 'Pedido no encontrado' };

        if (order.status !== 'en_preparacion') {
            throw { status: 400, message: 'Solo se pueden marcar como listos pedidos en preparación' };
        }

        await Promise.all( order.items.map((item: any) => kitchenRepository.updateItemStatus(item.id, 'listo')));

        const updatedOrder = await kitchenRepository.updateOrderStatus(orderId, 'listo');

        const io = getIO();
        io.to('kitchen').emit('order_ready', updatedOrder);
        io.to(`waiter_${order.waiter_id}`).emit('order_ready', { ...updatedOrder, table_number: order.table_number, });

        return updatedOrder;
    },
};

export default kitchenService;