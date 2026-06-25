import pool from '../../config/db';

const menuRepository = {

    async findAllCategories(onlyActive = false) {

        const query = onlyActive ? `SELECT * FROM menu_categories WHERE is_active = true ORDER BY sort_order ASC`
        : `SELECT * FROM menu_categories ORDER BY sort_order ASC`;

        const { rows } = await pool.query(query);

        return rows;
    },

    async findCategoryById(id: string) {

        const { rows } = await pool.query( `SELECT * FROM menu_categories WHERE id = $1`, [id]);

        return rows[0]  || null;
    },

    async createCategory(data: {

        name: string;
        description?: string;
        sort_order?: number;
    }) {

        const { rows } = await pool.query(
            `INSERT INTO menu_categories (name, description, sort_order) VALUES ($1, $2, $3)
            RETURNING *`, [data.name, data.description || null, data.sort_order ?? 0]
        );

        return rows[0];
    },

    async updateCategory(id: string, data: {

        name?: string;
        description?: string;
        sort_order?: number;
        is_active?: boolean;
    }) {

        const { rows } = await pool.query(

            `UPDATE menu_categories SET name = COALESCE($1, name),
                description = COALESCE($2, description),
                sort_order = COALESCE($3, sort_order),
                is_active = COALESCE($4, is_actibe)
            WHERE id = $5
            RETURNING *`,

            [data.name, data.description, data.sort_order, data.is_active, id]
        );

        return rows[0] || null;
    },

    async findAllItems(onlyActive = false) {

        const query = onlyActive

            ? `SELECT mi.*, mc.name as category_name
                FROM menu_items mi
                JOIN menu_categories mc ON mc.id = mi.category_id
                WHERE mi.is_active = true AND mc.is_active = true
                ORDER BY mc.sort_order ASC, mi.name ASC`
            
            : `SELECT mi.*, mc.name as category_name
                FROM menu_items mi
                JOIN menu_categories mc ON mc.id = mi.category_id
                ORDER BY mc.sort_order ASC, mi.name ASC`;
        
        const { rows } = await pool.query(query);

        return rows;
    },

    async findItemById(id: string) {

        const { rows } = await pool.query(
            `SELECT mi.*, mc_name as category_name
            FROM menu_items mi
            JOIN menu_categories mc ON mc.id = mi.category_id
            WHERE mi.id = $1`, [id]
        );

        return rows[0] || null;
    },

    async findItemsByCategory(categoryId: string, onlyActive = false) {

        const query = onlyActive ? `SELECT * FROM menu_items WHERE category_id = $1 AND is_active = true`
            : `SELECT * FROM menu_items WHERE category_id = $1 ORDER BY name ASC`;

        const { rows } = await pool.query(query, [categoryId]);

        return rows;
    },

    async createItem(data: {

        category_id: string;
        name: string;
        description?: string;
        price: number;
        image_url?: string;
    }) {

        const { rows } = await pool.query(

            `INSERT INTO menu_items (category_id, name, description, price, image_url)
            VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [data.category_id, data.name, data.description || null, data.price, data.image_url || null]
        );

        return rows[0];
    },

    async updateItem(id: string, data: {

        category_id?: string;
        name?: string;
        description?: string;
        price?: number;
        image_url?: string;
        is_active?: boolean;
    }) {

        const { rows } = await pool.query(

            `UPDATE menu_items 
            SET category_id = COALESCE($1, category_id),
                name = COALESCE($2, name),
                description = COALESCE($3, description),
                price = COALESCE($4, price),
                image_url = COALESCE($5, image_url),
                is_active = COALESCE($6, is_active),
                update_at = NOW()
            WHERE id = $7
            RETURNING *`,
            [data.category_id, data.name, data.description, data.price, data.image_url, data.is_active, id]
        );

        return rows[0] || null;
    },
};

export default menuRepository;