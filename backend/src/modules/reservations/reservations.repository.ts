import pool from '../../config/db';

const reservationsRepository = {

    async findAll() {

        const { rows } = await pool.query(

            `SELECT r.*, u.first_name, u.last_name, u.email, rt.number as table_number, rt.capacity
            FROM reservations r
            JOIN users u ON u.id = r.user_id
            JOIN restaurant_tables rt ON rt.id = r.table_id
            ORDER BY r.reserved_at ASC`
        );

        return rows;
    },

    async findToday() {

        const { rows } = await pool.query(

            `SELECT r.*, u.first_name, u.last_name, u.email, rt.number as table_number, rt.capacity
            FROM reservations r
            JOIN users u ON u.id = r.user_id
            JOIN restaurant_tables rt ON rt.id = r.table_id
            WHERE DATE(r.reserved_at) = CURRENT_DATE
            AND r.status = 'confirmada'
            ORDER BY r.reserved_at ASC`
        );

        return rows;
    },

    async findById(id: string) {

        const { rows } = await pool.query(

            `SELECT r.*, u.first_name, u.last_name, u.email, rt.number as table_number, rt.capacity
            FROM reservations r
            JOIN users u ON u.id = r.user_id
            JOIN restaurant_tables rt ON rt.id = r.table_id
            WHERE r.id = $1`,
            [id]
        );

        return rows[0] || null;
    },

    async findByClientId(clientId: string) {

        const { rows } = await pool.query(

            `SELECT r.*, rt.number as table_number, rt.capacity
            FROM reservations r
            JOIN restaurant_tables rt ON rt.id = r.table_id
            WHERE r.user_id = $1
            ORDER BY r.reserved_at DESC`,

            [clientId]
        );

        return rows;
    },

    async findAvailableTables(reservedAt: Date, partySize: number) {

        const { rows } = await pool.query(

            `SELECT rt.* FROM restaurant_tables rt
            WHERE rt.capacity >= $1
            AND rt.status = 'disponible'
            AND rt.id NOT IN (
                SELECT table_id FROM reservations
                WHERE status = 'confirmada'
                AND reserved_at BETWEEN $2::timestamp - interval '2 hours'
                AND $2::timestamp + interval '2 hours'
            )
            ORDER BY rt.number ASC`,

            [partySize, reservedAt]
        );

        return rows;
    },

    async create(data: {

        user_id: string;
        table_id: string;
        reserved_at: Date;
        party_size: number;
        notes?: string;
    }) {

        const { rows } = await pool.query(

            `INSERT INTO reservations (user_id, table_id, reserved_at, party_size, notes)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,

            [data.user_id, data.table_id, data.reserved_at, data.party_size, data.notes || null]
        );

        return rows[0];
    },

    async updateStatus(id: string, status: string) {

        const { rows } = await pool.query(

            `UPDATE reservations SET status = $1
            WHERE id = $2 RETURNING *`,

            [status, id]
        );

        return rows[0] || null;
    },
};

export default reservationsRepository;