import pool from '../../config/db';

const restaurantInfoRepository = {

    async find() {

        const { rows } = await pool.query(`SELECT * FROM restaurant_info LIMIT 1`);
        return rows [0] || null;
    },

    async update(data: {

        name?: string;
        description?: string;
        address?: string;
        phone?: string;
        email?: string;
        schedule?: object;
        social_links?: object;
    }) {

        const { rows } = await pool.query(

            `UPDATE restaurant_info SET
            name = COALESCE($1, name),
            description = COALESCE($2, description),
            address = COALESCE($3, address),
            phone = COALESCE($4, phone),
            email = COALESCE($5, email),
            schedule = COALESCE($6, schedule),
            social_links = COALESCE($7, social_links),
            updated_at = NOW()
            RETURNING *`,

            [
                data.name, data.description, data.address, data.phone, data.email,
                data.schedule ? JSON.stringify(data.schedule) : null,
                data.social_links ? JSON.stringify(data.social_links) : null,
            ]
        );

        return rows[0];
    },
};

export default restaurantInfoRepository;