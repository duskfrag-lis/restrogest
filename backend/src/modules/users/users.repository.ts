import pool from '../../config/db';
import crypto from 'crypto';

const usersRepository = {
    async findAll(role?: string) {

        const query = role 
            ? `SELECT u.id, u.first_name, u.last_name, u.email, u.phone,
                    u.is_active, u.email_verified, u.provider, u.created_at,
                    r.name as role
                FROM users u
                JOIN user_role ur ON ur.user_id = u.id
                JOIN roles r ON r.id = ur.role_id
                WHERE r.name = $1
                ORDER BY u.created_at DESC`

            : `SELECT u.id, u.first_name, u.last_name, u.email, u.phone, u.is_active,
                    u.email_verified, u.provider, u.created_at, r.name as role
                FROM users u
                JOIN user_roles ur ON ur.user_id = u.id
                JOIN roles r ON r.id = ur.role_id
                ORDER BY u.created_at DESC`;

        const { rows } = role ? await pool.query(query, [role]) : await pool.query(query);

        return rows;
    },

    async findById(id: string) {
        const { rows } = await pool.query(

            `SELECT u.id, u.first_name, u.last_name, u.email, u.phone, u.is_active, u.email_verified,
                u.provider, u.created_at, r.name as role
            FROM users u
            JOIN user_roles ur ON ur.user_id = u.id
            JOIN roles r ON r.id = ur.role_id
            WHERE u.id = $1`, [id]
        );

        return rows[0] || null;
    },

    async createEmployee(data: {
        first_name: string;
        last_name: string;
        email: string;
        phone?: string;
        role: string;

    }) {
        const { rows } = await pool.query(

            `INSERT INTO users (first_name, last_name, email, phone, provider, is_active, email_verified)
            VALUES ($1, $2, $3, $4, 'local', true, false)
            RETURNING id, first_name, last_name, email`, 
            [data.first_name, data.last_name, data.email, data.phone || null]
        );

        const user = rows[0];

        const { rows: roleRows } = await pool.query(
            `SELECT id FROM roles WHERE name = $1`, [data.role]
        );

        if (!roleRows[0]) throw { status: 400, message: `El rol '${data.role}' no existe `};

        await pool.query(
            `INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)`, [user.id, roleRows[0].id]
        );

        return user;
    },

    async changeRole(userId: string, newRole: string) {
        const { rows } = await pool.query(
            `SELECT id FROM roles WHERE name = $1`, [newRole]
        );

        if (!rows[0]) throw { status: 400, message: `El rol '${newRole}' no existe`};

        await pool.query(
            `UPDATE user_roles SET role_id = $1 WHERE user_id = $2`, [rows[0].id, userId]
        );
    },

    async setActiveStatus(userId: string, isActive: boolean) {

        await pool.query(
            `UPDATE users SET is_active = $1, updated_at = NOW() WHERE id = $2`,
            [isActive, userId]
        );
    },

    async createActivationToken(userId: string) {

        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

        await pool.query(
            `INSERT INTO tokens (user_id, token, type, expires_at) VALUES ($1, $2, 'employee_activation', $3)`,
            [userId, token, expiresAt]
        );
        
        return token;
    },

    async findValidToken(token: string, type: string) {

        const { rows } = await pool.query(

            `SELECT * FROM tokens
            WHERE token = $1 AND type = $2 AND used_at IS NULL AND expires_at > NOW()`,
            [token, type]
        );

        return rows[0] || null;
    },

    async markTokenUsed(tokenId: string) {

        await pool.query(
            `UPDATE tokens SET used_at = NOW() WHERE id =$1`,
            [tokenId]
        );
    },
};

export default usersRepository;