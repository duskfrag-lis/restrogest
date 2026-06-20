import crypto from 'crypto';
import pool from './db';

export type TokenType = 'email_verification' | 'password_reset' | 'employee_activation';

const tokensRepository = {

    async create(userId: string, type: TokenType, expiresInMs: number) {

        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + expiresInMs);

        await pool.query(
            `INSERT INTO tokens (user_id, token, type, expires_at) VALUES ($1, $2, $3, $4)`, 
            [userId, token, type, expiresAt]
        );

        return token;
    },

    async findValid(token: string, type: TokenType) {

        const { rows } = await pool.query(
            `SELECT * FROM tokens 
            WHERE token = $1 AND type = $2 AND used_at IS NULL AND expires_at > NOW()`,
            [token, type]
        );

        return rows[0] || null;
    },

    async markUsed(tokenId: string) {

        await pool.query(`UPDATE tokens SET used_at = NOW() WHERE id = $1`, [tokenId] );
    },
}

export default tokensRepository;