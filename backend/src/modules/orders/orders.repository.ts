import pool from '../../config/db';

const ordersRepository = {

    async findAll(status?: string) {

        const query = status ? 

        `SELECT o.*, first_name as waiter_first_name, u.last_name as waiter_last_name,
            rt.number as table_number
        FROM orders o
        LEFT JOIN users u ON u.id = o.waiter_id
        LEFT JOIN restaurant_tables rt ON rt.id = o.table_id
        WHERE o.status = $1
        ORDER BY o.created_at DESC`

        : `SELECT o.*, u.first_name as waiter_first_name, u.last_name as waiter_last_name,
            rt.number as table_number
        FROM orders o
        LEFT JOIN users u ON u.id = o.waiter_id
        LEFT JOIN restaurant_tables rt ON rt.id = o.table_id
        ORDER BY o.created_at DESC`;

        const { rows } = status ? await pool.query(query, [status]) : await pool.query(query);

        return rows;
    },

    async findById(id: string) {

        const { rows } = await pool.query(

            `SELECT o.*, u.first_name as waiter_first_name, u.last_name as waiter_last_name,
                rt.number as table_number
            FROM orders o
            LEFT JOIN users u ON u.id = o.waiter_id
            LEFT JOIN restaurant_tables rt ON rt.id = o.table_id
            WHERE o.id = $1`,

            [id]
        );

        return rows[0] || null;
    },

    async findItemsByOrderId(orderId: string) {

        const { rows } = await pool.query(

            `SELECT oi.*, mi.name as item_name, mi.description as item_description
            FROM order_items oi
            JOIN menu_item mi ON mi.id = oi.menu_items_id
            WHERE oi.order_id = $1`,

            [orderId]
        );

        return rows;
    },

    async findByTableId(tableId: string) {

        const { rows } = await pool.query(

            `SELECT * FROM orders
            WHERE table_id = $1 AND status NOT IN ('cerrado', 'cancelado')
            ORDER BY created_at DESC`,

            
            [tableId]
        );

        return rows;
    },

    async create(data: { table_id: string; waiter_id: string; type?: string }) {

        const { rows } = await pool.query(

            `INSERT INTO orders (table_id, waiter_id, type) VALUES ($1, $2, $3)
            RETURNING *`,

            [data.table_id, data.waiter_id, data.type || 'mesa']
        );

        return rows[0];
    },

    async addItem(data: {

        order_id: string;
        menu_item_id: string;
        quantity: number;
        unit_price: number;
        notes?: string;
    }) {

        const { rows } = await pool.query(

            `INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, notes)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,

            [data.order_id, data.menu_item_id, data.quantity, data.unit_price, data.notes || null]
        );

        return rows[0];
    },

    async removeItem(orderItemId: string) {

        await pool.query(

            `DELETE FROM order_items WHERE id = $1`, [orderItemId]
        );
    },

    async updateItemStatus(orderItemId: string, status: string) {

        const { rows } = await pool.query(

            `UPDATE order_items SET status = $1 WHERE id = $2 RETURNING *`,
            [status, orderItemId]
        );

        return rows[0] || null;
    },

    async updateStatus(id: string, status: string) {

        const { rows } = await pool.query(

            `UPDATE orders SET status = $1, updated_at = NOW()
            WHERE id = $2 RETURNING *`,

            [status, id]
        );

        return rows[0] || null;
    },

    async updateTotal(id: string) {

        const { rows } = await pool.query(

            `UPDATE orders SET total = (
                SELECT COALESCE(SUM(quantity * unit_price), 0)
                FROM order_items
                WHERE order_id = $1
            ),
            updated_at = NOW()
            WHERE id = $1
            RETURNING *`,

            [id]
        );

        return rows[0] || null;
    },
};

export default ordersRepository;