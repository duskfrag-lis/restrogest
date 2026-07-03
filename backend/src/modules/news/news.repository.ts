import pool from '../../config/db';

const newsRepository = {

    async findAllPublished() {

        const { rows } = await pool.query(

            `SELECT n.id, n.title, n.body, n.published_at, u.first_name as author_first_name,
            u.last_name as author_last_name
            FROM news n
            JOIN users u ON u.id = n.author_id
            WHERE n.is_published = true
            ORDER BY n.published_at = DESC`
        );

        return rows;
    },

    async findPublishedById(id: string) {

        const { rows } = await pool.query(

            `SELECT n.id, n.title, n.body, n.published_at, u.first_name as author_first_name, u.last_name as author_last_name
            FROM news n
            JOIN users u ON u.id = n.author_id
            WHERE n.id = $1 AND n.is_published = true`, [id]
        );

        return rows[0] || null;
    },

    async findAll() {

        const { rows } = await pool.query(

            `SELECT n.*, u.first_name as author_first_name, u.last_name as author_last_name
            FROM news n 
            JOIN users u ON u.id = n.author_id
            ORDER BY n.created_at DESC`
        );

        return rows;
    },

    async findById(id: string) {

        const { rows } = await pool.query(

           `SELECT * FROM news WHERE id = $1`, [id] 
        );

        return rows[0] || null;
    },

    async create(data: {
        author_id: string;
        title: string;
        body: string;
    }) {

        const { rows } = await pool.query(

            `INSERT INTO news (author_id, title, body) VALUES ($1, $2, $3) RETURNING *`,
            [data.author_id, data.title, data.body]
        );

        return rows[0];
    },

    async update(id: string, data: {
        title?: string; 
        body?: string
    }) {
        const { rows } = await pool.query(

            `UPDATE news SET title = COALESCE($1, title),
            body = COALESCE($2, body),
            updated_at = NOW()
            WHERE id = $3 RETURNING *`,

            [data.title, data.body]
        );

        return rows[0] || null;
    },

    async publish(id: string) {

        const { rows } = await pool.query(

            `UPDATE news SET is_published = true, published_at = NOW(), updated_at = NOW()
            WHERE id = $1 RETURNING *`, 
            [id]
        );

        return rows[0] || null;
    },

    async unpublish(id: string) {

        const { rows } = await pool.query(

            `UPDATE news SET is_published = false, updated_at = NOW()
            WHERE id = $1 RETURNING *` ,
            [id]
        );

        return rows[0] || null;
    },
};

export default newsRepository;