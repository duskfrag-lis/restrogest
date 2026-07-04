import pool from "../../config/db";

const reportsRepository = {

    async getSalesByDateRange(startDate: string, endDate: string) {

        const { rows } = await pool.query(

            `SELECT DATE(updated_at) as date, COUNT(*) as total_orders, SUM(total) as total_sales
            FROM orders
            WHERE status = 'cerrado'
            AND updated_at BETWEEN $1 AND $2
            GROUP BY DATE(updated_at)
            ORDER BY DATE(updated_at) ASC`,

            [startDate, endDate]
        );

        return rows;
    },

    async getOrdersByStatus(startDate: string, endDate: string) {

        const { rows } = await pool.query(

            `SELECT status, COUNT(*) as total
            FROM orders
            WHERE created_at BETWEEN $1 AND $2
            GROUP BY status
            ORDER BY total DESC`,

            [startDate, endDate]
        );

        return rows;
    },

    async getTopSellingProducts(startDate: string, endDate: string, limit: number = 10) {

        const { rows } = await pool.query(

            `SELECT mi.id, mi.name, SUM(oi.quantity) as total_quantity,
            SUM(oi.quantity * oi.unit_price) as total_revenue
            FROM order_items oi
            JOIN menu_items mi ON mi.id = oi.menu_item_id
            JOIN orders o ON o.id = oi.order_id
            WHERE o.status = 'cerrado'
            AND o.updated_at BETWEEN $1 AND $2
            GROUP BY mi.id, mi.name
            ORDER BY total_quantity DESC
            LIMIT $3`,

            [startDate, endDate]
        );

        return rows;
    },

    async getCurrentInventoryStatus() {

        const { rows } = await pool.query(

            `SELECT *, quantity <= min_threshold as is_low_stock,
            CASE WHEN expiry_date IS NOT NULL AND expiry_date < CURRENT_DATE THEN true ELSE false END as is_expired,
            CASE WHEN expiry_date IS NOT NULL AND expiry_date <= CURRENT_DATE + interval '7 days'
            AND expiry_date >= CURRENT_DATE THEN true ELSE false END as expires_soon
            FROM inventory_items ORDER BY name ASC`
        );

        return rows;
    },
};

export default reportsRepository;