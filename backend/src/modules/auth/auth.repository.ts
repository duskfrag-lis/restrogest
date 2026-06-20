import pool from '../../config/db';

export interface CreateUserDTO {
    first_name: string;
    last_name: string;
    phone?: string;
    email: string;
    password_hash?: string;
    provider?: string;
}

const authRepository = {
    async findByEmail(email: string) {
        const { rows } = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        return rows[0] || null;
    },

    async createUser(data: CreateUserDTO) {
        const { rows } = await pool.query(
            `INSERT INTO users (first_name, last_name, phone, email, password_hash, provider)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, first_name, last_name, email, provider, email_verified, is_active, created_at`,

            [
                data.first_name,
                data.last_name,
                data.phone || null,
                data.email,
                data.password_hash || null,
                data.provider || 'local',
            ]
        );

        return rows[0];
    },
    
    async assignDefaultRole(userId: string) {
        const { rows } = await pool.query(
            `SELECT id FROM roles WHERE name = 'cliente'`
        );

        const roleId = rows[0]?.id;
        if (!roleId) throw new Error('Rol cliente no encontrado');

        await pool.query(
            `INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)`,
            [userId, roleId]
        );
    },

    async getUserWithRole(userId: string) {
        const { rows } = await pool.query(
            `SELECT u.id, u.first_name, u.last_name, u.email, u.is_active,
                u.email_verified, u.provider, r.name as role

            FROM users u
            JOIN user_roles ur ON ur.user_id = u.id
            JOIN roles r ON r.id = ur.role_id
            WHERE u.id = $1`,
            [userId]
        );

        return rows[0] || null;
    },

    async verifyEmail(userId: string) {
        await pool.query(
            `UPDATE users SET email_verified = true WHERE id = $1`, [userId]
        );
    },

    async updatePassword(userId: string, password_hash: string) {
        await pool.query(
            `UPDATE users SET password_hash = $1 WHERE id = $2`, [password_hash, userId]
        );
    },

    async incrementLoginAttempts(email: string) {
        await pool.query(
            `UPDATE users SET login_attempts = COALESCE(login_attempts, 0) + 1,
            last_login_attempt = now() WHERE email = $1`, [email]
        );
    },

    async resetLoginAttempts(email: string) {
        await pool.query(
            `UPDATE users SET login_attempts = 0 WHERE email = $1`, [email]
        );
    },

};

export default authRepository;