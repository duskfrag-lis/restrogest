import pool from '../../config/db';

const kitchenRepository = {

    async findActiveOrders() {

        const { rows } = await pool.query(

            `SELECT o.*, rt.number as table_number,
                    u.first_name as waiter_first_name,
                    u.last_name as waiter_last_name
             FROM orders o
             LEFT JOIN restaurant_tables rt ON rt.id = o.table_id
             LEFT JOIN users u ON u.id = o.waiter_id
             WHERE o.status IN ('pendiente', 'en_preparacion')
             AND o.type = 'mesa'
             ORDER BY o.created_at ASC`
        );

        return rows;
    },

    async findOrderWithItems(orderId: string) {

        const { rows: orderRows } = await pool.query(

            `SELECT o.*, rt.number as table_number
             FROM orders o
             LEFT JOIN restaurant_tables rt ON rt.id = o.table_id
             WHERE o.id = $1`,

            [orderId]
        );

        if (!orderRows[0]) return null;

        const { rows: itemRows } = await pool.query(

            `SELECT oi.*, mi.name as item_name
             FROM order_items oi
             JOIN menu_items mi ON mi.id = oi.menu_item_id
             WHERE oi.order_id = $1
             ORDER BY oi.id ASC`,

            [orderId]
        );

        return { ...orderRows[0], items: itemRows };
    },

    async updateItemStatus(itemId: string, status: string) {

        const { rows } = await pool.query(

            `UPDATE order_items SET status = $1
             WHERE id = $2
             RETURNING *`,

            [status, itemId]
        );

        return rows[0] || null;
    },

    async checkAllItemsReady(orderId: string) {

        const { rows } = await pool.query(

            `SELECT COUNT(*) as total,
                    COUNT(CASE WHEN status = 'listo' THEN 1 END) as ready
             FROM order_items
             WHERE order_id = $1`,

            [orderId]
        );

        return rows[0].total === rows[0].ready;
    },

    async updateOrderStatus(orderId: string, status: string) {

        const { rows } = await pool.query(

            `UPDATE orders SET status = $1, updated_at = NOW()
             WHERE id = $2
             RETURNING *`,

            [status, orderId]
        );
        
        return rows[0] || null;
    },
};

export default kitchenRepository;