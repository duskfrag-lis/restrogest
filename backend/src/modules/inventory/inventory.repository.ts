import pool from '../../config/db';
import { PoolClient } from 'pg';

const inventoryRepository = {

    async findAll() {

        const { rows } = await pool.query(

            `SELECT *, quantity <= min_threshold as is_low_stock,
                CASE WHEN expiry_date IS NOT NULL AND expiry_date < CURRENT_DATE THEN true ELSE false END as is_expired,
                CASE WHEN expiry_date IS NOT NULL AND expiry_date <= CURRENT_DATE + interval '7 days' AND expiry_date >= CURRENT_DATE THEN true
                ELSE false END as expires_soon
            FROM inventory_items ORDER BY name ASC`
        );

        return rows;
    },

    async findLowStock() {

        const { rows } = await pool.query(

            `SELECT * FROM inventory_items
            WHERE quantity <= min_threshold
            ORDER BY name ASC`
        );

        return rows;
    },

    async findExpiringSoon(days: number = 7) {

        const { rows } = await pool.query(

            `SELECT * FROM inventory_items
            WHERE expiry_date IS NOT NULL
            AND expiry_date <= CURRENT_DATE + $1 * INTERVAL '1 day'
            AND expiry_date >= CURRENT_DATE
            ORDER BY expiry_date ASC`,

            [days]
        );

        return rows;
    },

    async findExpired() {

        const { rows } = await pool.query(
            
            `SELECT * FROM inventory_items
            WHERE expiry_date IS NOT NULL
            AND expiry_date < CURRENT_DATE
            ORDER BY expiry_date ASC`
        );

        return rows;
    },

    async findById(id: string) {

        const { rows } = await pool.query(

            `SELECT *, quantity <= min_threshold as is_low_stock,
                CASE WHEN expiry_date IS NOT NULL AND expiry_date < CURRENT_DATE THEN true ELSE false END as is_expired
            FROM inventory_items WHERE id = $1`,
            [id]
        );

        return rows[0] || null;
    },

    async findByName(name: string) {

        const { rows } = await pool.query(

            `SELECT * FROM inventory_items WHERE LOWER(name) = LOWER($1)`,
            [name]
        );

        return rows[0] || null;
    },

    async create(data: {

        name: string;
        quantity: number;
        unit: string;
        min_threshold: number;
        expiry_date?: string;
    }) {

        const { rows } = await pool.query(

            `INSERT INTO inventory_items (name, quantity, unit, min_threshold, expiry_date) VALUES ($1, $2, $3, $4, $5)
            RETURNING *, quantity <= min_threshold as is_low_stock`,
            [data.name, data.quantity, data.unit, data.min_threshold, data.expiry_date]
        );

        return rows[0];
    },

    async update(id: string, data: {

        name?: string;
        unit?: string;
        min_threshold?: number;
        expiry_date?: string;
    }) {

        const { rows } = await pool.query(

            `UPDATE inventory_items SET name = COALESCE($1, name),
                unit = COALESCE($2, unit),
                min_threshold = COALESCE($3, min_threshold),
                expiry_date = COALESCE($4, expiry_date),
                updated_at = NOW()
            WHERE id = $5
            RETURNING *, quantity <= min_threshold as is_low_stock`,

            [data.name, data.unit, data.min_threshold, data.expiry_date, id]
        );

        return rows[0] || null;
    },

    async updateQuantity(id: string, newQuantity: number, client: PoolClient = pool as any) {

        const { rows } = await client.query(

            `UPDATE inventory_items SET quantity = $1, updated_at = NOW()
            WHERE id = $2 RETURNING *, quantity <= min_threshold as is_low_stock`,

            [newQuantity, id]
        );

        return rows[0] || null;
    },

    async createMovement(data: {

        item_id: string;
        quantity_change: number;
        reason?: string;
        change_by: string;

    }, client: PoolClient = pool as any) {

        const { rows } = await client.query(

            `INSERT INTO inventory_movements (item_id, quantity_change, reason, change_by)
            VALUES ($1, $2, $3, $4) RETURNING *`,

            [data.item_id, data.quantity_change, data.reason || null, data.change_by]
        );

        return rows[0];
    },

    async findMovementsByItemId(itemId: string) {

        const { rows } = await pool.query(

            `SELECT im.*, u.first_name, u.last_name
            FROM inventory_movements im
            LEFT JOIN users u ON u.id = im.change_by
            WHERE im.item_id = $1
            ORDER BY im.created_at DESC`,

            [itemId]
        );

        return rows;
    },

    async findAllMovements() {

        const { rows } = await pool.query(

            `SELECT im.*, u.first_name, u.last_name, ii.name as item_name
            FROM inventory_movements im
            LEFT JOIN users u ON u.id = im.change_by
            JOIN inventory_items ii ON ii.id = im.item_id
            ORDER BY im.created_at DESC`
        );

        return rows;
    },
};

export default inventoryRepository;