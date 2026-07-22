import pool from '../../config/db';


const usersRepository = {
    async findAll(role?: string) {

        const query = role 
            ? `SELECT u.id, u.first_name, u.last_name, u.email, u.phone,
                    u.is_active, u.email_verified, u.provider, u.created_at,
                    r.name as role
                FROM users u
                JOIN user_roles ur ON ur.user_id = u.id
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

    async findByEmail(email: string) {

        const { rows } = await pool.query(`SELECT id FROM users WHERE email = $1`, [email]);
        return rows[0] || null;
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

    async findPendingDeletionRequestByUserId(userId: string) {

        const { rows } = await pool.query(

            `SELECT * FROM account_deletion_requests
            WHERE user_id = $1 AND status = 'pending'`,

            [userId]
        );

        return rows[0] || null;
    },

    async findLatestDeletionRequestByUserId(userId: string) {

        const { rows } = await pool.query(

            `SELECT * FROM account_deletion_requests
            WHERE user_id = $1
            ORDER BY created_at DESC
            LIMIT 1`,

            [userId]
        );

        return rows[0] || null;
    },

    async createDeletionRequest(userId: string, reason: string) {

        const { rows } = await pool.query(

            `INSERT INTO account_deletion_requests (user_id, reason)
            VALUES ($1, $2) RETURNING *`,

            [userId, reason]
        );

        return rows[0];
    },

    async findAllDeletionRequestsByStatus(status?: string) {

        if (status && status !== 'all') {

            const { rows } = await pool.query(

                `SELECT dr.*, u.first_name, u.last_name, u.email, r.name as role
                FROM account_deletion_requests dr
                JOIN users u ON u.id = dr.user_id
                JOIN user_roles ur ON ur.user_id = u.id
                JOIN roles r ON r.id = ur.role_id
                WHERE dr.status = $1
                ORDER BY dr.created_at DESC`,

                [status]
            );

            return rows;

        }

        const { rows } = await pool.query(

            `SELECT dr.*, u.first_name, u.last_name, u.email, r.name as role
            FROM account_deletion_requests dr
            JOIN users u ON u.id = dr.user_id
            JOIN user_roles ur ON ur.user_id = u.id
            JOIN roles r ON r.id = ur.role_id
            ORDER BY dr.created_at DESC`
        );

        return rows;
    },

    async findDeletionRequestById(id: string) {

        const { rows } = await pool.query(

            `SELECT * FROM account_deletion_requests WHERE id = $1`,
            [id]
        );

        return rows[0] || null;
    },

    async resolveDeletionRequest(id: string, status: string, resolvedBy: string, rejectionReason: string | null) {

        const { rows } = await pool.query(

            `UPDATE account_deletion_requests
            SET status = $1, rejection_reason = $2, resolved_by = $3, resolved_at = NOW()
            WHERE id = $4 RETURNING *`, 
            [status, rejectionReason, resolvedBy, id]
        );

        return rows[0];
    },

    async markDeletionRequestAsUsed(id: string) {

        await pool.query(

            `UPDATE account_deletion_requests SET used_at = NOW() WHERE id = $1`,
            [id]
        );
    },

    async findUnusedApprovedDeletionRequestByUserId(userId: string) {

        const { rows } = await pool.query(

            `SELECT * FROM account_deletion_requests
            WHERE user_id = $1 AND status = 'approved' AND used_at IS NULL
            ORDER BY resolved_at DESC
            LIMIT 1`,
            [userId]
        );

        return rows[0] || null;
    },

};

export default usersRepository;