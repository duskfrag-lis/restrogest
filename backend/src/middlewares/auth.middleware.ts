import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET no está definido en las variables de entorno');
}

const SECRET: string = JWT_SECRET;

export function authenticate(req: Request, res: Response, next: NextFunction) {

    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ message: 'No autenticado' });
    }

    try {

        const decoded = jwt.verify(token, SECRET);
        (req as any).user = decoded;
        next();

    } catch {
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