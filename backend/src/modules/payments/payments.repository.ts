import pool from '../../config/db';
import { PoolClient } from 'pg';

const paymentsRepository = {

    async findAll() {

        const { rows } = await pool.query(

            `SELECT p.*, o.type as order_type, o.total as order_total
            FROM payments p
            JOIN orders o ON o.id = p.order_id
            ORDER BY p.created_at DESC`
        );

        return rows;
    },

    async findById(id: string) {

        const { rows } = await pool.query(`SELECT * FROM payments WHERE id = $1`, [id]);
        return rows[0] || null;
    },

    async findByOrderId(orderId: string) {

        const { rows } = await pool.query(

            `SELECT * FROM payments WHERE order_id = $1 ORDER BY created_at DESC`,
            [orderId]
        );

        return rows;
    },

    async findByTransactionId(transactionId: string) {

        const { rows } = await pool.query(

            `SELECT * FROM payments WHERE transaction_id = $1`,
            [transactionId]
        );

        return rows[0] || null;
    },

    async create(data: {

        order_id: string;
        method: string;
        amount: number;
        transaction_id?: string;

    }, client: PoolClient = pool as any) {

        const { rows } = await client.query(

            `INSERT INTO payments (order_id, method, amount, transaction_id)
            VALUES ($1, $2, $3, $4) RETURNING *`,

            [data.order_id, data.method, data.amount, data.transaction_id || null]
        );

        return rows[0];
    },

    async updateStatus(id: string, status: string, client: PoolClient = pool as any) {

        const { rows } = await client.query(

            `UPDATE payments SET status = $1, updated_at = NOW()
            WHERE id = $2 RETURNING *`,

            [status, id]
        );

        return rows[0] || null;
    },

    async updateTransactionId(id: string, transactionId: string, client: PoolClient = pool as any) {

        const { rows } = await client.query(

            `UPDATE payments SET transaction_id = $1, updated_at = NOW()
            WHERE id = $2 RETURNING *`,

            [transactionId, id]
        );

        return rows[0] || null;
    },

   
    async syncDeliveryPaymentStatus(orderId: string, status: string, client: PoolClient = pool as any) {

        await client.query(

            `UPDATE delivery_orders SET payment_status = $1, updated_at = NOW()
            WHERE order_id = $2`,

            [status, orderId]
        );
    },

    
    async findClientEmailByOrderId(orderId: string) {

        const { rows } = await pool.query(

            `SELECT u.email, u.first_name, u.last_name
            FROM delivery_orders do2
            JOIN users u ON u.id = do2.client_id
            WHERE do2.order_id = $1`,

            [orderId]
        );

        return rows[0] || null;
    },
};

export default paymentsRepository;