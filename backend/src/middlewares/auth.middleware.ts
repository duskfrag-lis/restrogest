import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../config/db';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET no está definido en las variables de entorno');
}

const SECRET: string = JWT_SECRET;

export async function authenticate(req: Request, res: Response, next: NextFunction) {

    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ message: 'No autenticado' });
    }

    try {

        const decoded = jwt.verify(token, SECRET) as { id: string; email: string; role: string };
        
        const { rows } = await pool.query(
            'SELECT is_active, deleted_at FROM users WHERE id = $1', [decoded.id]
        );

        const user = rows[0];

        if (!user || !user.is_active || user.deleted_at) {
            return res.status(401).json({ message: 'Tu sesión ya no es válida. Inicia sesión nuevamente.' });
        }

        (req as any).user = decoded;
        next();

    } catch (err){
        console.error('Error en authenticate: ', err);
        return res.status(401).json({ message: 'Token inválido o expirado' });
    }
}

export function authorize(...allowedRoles: string[]) {

    return (req: Request, res: Response, next: NextFunction) => {

        const user = (req as any).user;

        if (!user || !allowedRoles.includes(user.role)) {

            return res.status(403).json({ message: 'No tienes permiso para acceder a este recurso' });
        }

        next();
    };
}