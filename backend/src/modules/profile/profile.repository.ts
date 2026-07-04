import pool from '../../config/db';

const profileRepository = {

    async findById(id: string) {

        const { rows } = await pool.query(
            `SELECT u.id, u.first_name, u.last_name, u.email, u.phone, u.provider, 
                u.email_verified, u.is_active, u.created_at, r.name as role
            FROM users u
            JOIN user_roles ur ON ur.user_id = u.id
            JOIN roles r ON r.id = ur.role_id
            WHERE u.id = $1 AND u.deleted_at is NULL`,

            [id]
        );

        return rows[0] || null;
    },

    async updateProfile(id: string, data:{

        first_name?: string;
        last_name?: string;
        phone?: string;
        photo_url?: string;

    }) {

        const { rows } = await pool.query(

            `UPDATE users SET first_name = COALESCE($1, first_name),
                last_name = COALESCE($2, last_name),
                phone = COALESCE($3, phone),
                photo_url = COALESCE($4, photo_url),
                updated_at = NOW()
            WHERE id = $5
            RETURNING *`, 

            [data.first_name, data.last_name, data.phone, data.photo_url, id]
        );

        return rows[0] || null;

    },

    async getPassword(id: string){
        
        const { rows } = await pool.query(
            `SELECT id, password_hash FROM users WHERE id = $1`, [id]
        );

        return rows[0] || null;
    },

    async updatePassword(id: string,  password_hash: string) {

        await pool.query(
            
            `UPDATE users SET password_hash = $1,
                updated_at = NOW()
            WHERE id = $2`,

            [password_hash, id]
        );
    },

    async softDelete(id: string) {
        
        await pool.query(
            `UPDATE users SET deleted_at = NOW(), is_active = false, email = 'deleted_' || id || '_' || email
            WHERE id = $1`,
            [id]
        );
    }
};

export default profileRepository;