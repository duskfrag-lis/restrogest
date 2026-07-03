import pool from "../../config/db";

const reviewsRepository = {

    async findAllVisible() {

        const { rows } = await pool.query(

            `SELECT r.id, r.rating, r.comment, r.created_at, u.first_name, u.last_name
            FROM reviews r
            JOIN users u ON u.id = r.user_id
            WHERE r.is_visible = true
            ORDER BY r.created_at DESC`
        );

        return rows;
    },

    async findAll() {

        const { rows } = await pool.query(

            `SELECT r.*, u.first_name, u.last_name
            FROM reviews r
            JOIN users u ON u.id = r.user_id
            ORDER BY r.created_at DESC`
        );

        return rows;
    },

    async findById(id: string) {

        const { rows } = await pool.query(

            `SELECT * FROM reviews WHERE id = $1`, [id]
        );

        return rows[0] || null;
    },

    async findByUserId(userId: string) {

        const { rows } = await pool.query(

            `SELECT * FROM reviews WHERE user_id = $1 ORDER BY created_at DESC`, [userId]
        );

        return rows;
    },

    async hasCompletedDeliveryOrder(userId: string) {

        const { rows } = await pool.query(

            `SELECT 1 FROM delivery_orders
            WHERE client_id = $1 AND status = 'entregado'
            LIMIT 1`, [userId]
        );

        return rows.length > 0;
    },

    async create(data: {

        user_id: string;
        rating: number;
        comment?: string;
    }) {

        const { rows } = await pool.query(

            `INSERT INTO reviews (user_id, rating, comment) VALUES ($1, $2, $3) RETURNING *`,
            [data.user_id, data.rating, data.comment || null]
        );

        return rows[0];
    },

    async setVisibility(id: string, isVisible: boolean) {

        const { rows } = await pool.query(

            `UPDATE reviews SET is_visible = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
            [isVisible, id]
        );

        return rows[0] || null;
    },

    async getAverageRating(): Promise<{ average: number; total: number }> {

        const { rows } = await pool.query(

            `SELECT COALESCE(ROUND(AVG(rating)::numeric, 1),0) as average, COUNT(*) as total
            FROM reviews WHERE is_visible = true`
        );

        return { 
            average: Number(rows[0].average), 
            total: Number(rows[0].total) 
        };
    },
};

export default reviewsRepository;