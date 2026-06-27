import pool from '../../config/db';

const tablesRepository = {

    async findAll() {

        const { rows } = await pool.query(

            `SELECT * FROM restaurant_tables ORDER BY number ASC`
        );

        return rows;
    },

    async findById(id: string) {

        const { rows } = await pool.query(

            `SELECT * FROM restaurant_tables WHERE id = $1`, [id]
        );

        return rows[0] || null;
    },

    async findByNumber(number: number) {

        const { rows } = await pool.query(

            `SELECT * FROM restaurant_tables WHERE number = $1`, [number]
        );

        return rows[0] || null;
    },

    async create(data: { number: number; capacity: number }) {

        const { rows } = await pool.query(

            `INSERT INTO restaurant_tables (number, capacity) VALUES ($1, $2)
            RETURNING *`, [data.number, data.capacity]
        );

        return rows[0] || null;
    },

    async update(id: string, data: { number?: number; capacity?: number }) {

        const { rows } = await pool.query(

            `UPDATE restaurant_tables SET number = COALESCE($1, number),
                capacity = COALESCE($2, capacity),
                updated_at = NOW()
            WHERE id = $3
            RETURNING *`,
            [data.number, data.capacity]
        );

        return rows[0] || null;
    },

    async updateStatus(id: string, status: string) {

        const { rows } = await pool.query(

            `UPDATE restaurant_tables SET status = $1, updated_at = NOW()
            WHERE id = $2
            RETURNING *`,
            [status, id]
        );

        return rows[0] || null;
    },

    async delete(id: string) {

        await pool.query(
            `DELETE FROM restaurant_tables WHERE id = $1`, [id]
        );
    },
};

export default tablesRepository;