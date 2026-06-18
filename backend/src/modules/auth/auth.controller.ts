import { CookieOptions, Request, Response } from 'express';
import authService from './auth.service';

const AUTH_COOKIE_NAME = 'token';
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;

const sharedCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
};

const sessionCookieOptions: CookieOptions = {
    ...sharedCookieOptions,
    maxAge: SESSION_DURATION_MS,
};

const authController = {
    
    async register(req: Request, res: Response) {

        try {
            const { first_name, last_name, phone, email, password } = req.body;

            if (!first_name || !last_name || !email || !password) {

                return res.status(400).json({
                    message: 'Nombre, apellido, correo y contraseña son obligatorios',
                });
            }

            const result = await authService.register({
                first_name,
                last_name,
                phone,
                email,
                password,
            });

            return res.status(201).json(result);
            
        } catch (err: any) {

            const status = err.status || 500;
            const message = err.message || 'Error interno del servidor';
            
            return res.status(status).json({ message });
        }
    },

    async login(req: Request, res: Response) {

        try {
            const { email, password } = req.body;

            if (!email || !password) {

                return res.status(400).json({
                    message: 'Correo y contraseña son obligatorios.'
                });
            }

            const { token, user } = await authService.login({ email, password });

            res.cookie(AUTH_COOKIE_NAME, token, sessionCookieOptions);

            return res.status(200).json({
                message: 'Inicio de sesión exitoso',
                user,
            });

        } catch (err: any) {

            const status = err.status || 500;
            const message = err.message || 'Error interno del servidor';

            return res.status(status).json({ message });
        }
    },

    async logout(_req: Request, res: Response) {

        res.clearCookie(AUTH_COOKIE_NAME, sharedCookieOptions);

        return res.status(200).json({ message: 'Sesión cerrada correctamente' });
    },

    async me(req: Request, res: Response) {

        //req.user lo inyecta el middleware de autenticacion
        return res.status(200).json({ user: (req as any).user });
    },
};

export default authController;
