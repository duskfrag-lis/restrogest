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

    async verifyEmail(req: Request, res: Response) {

        try {

            const { token } = req.body;

            if (!token) {
                return res.status(400).json({ message: 'El token es obligatorio' });
            }

            const result = await authService.verifyEmail(token);

            return res.status(200).json(result);

        } catch (err: any) {

            const status = err.status || 500;
            const message = err.message || 'Error interno del servidor';

            return res.status(status).json({ message });
        }
    },

    async resendVerification(req: Request, res: Response) {

        try {

            const { email } = req.body;

            if (!email) {
                return res.status(400).json({ message: 'El correo es requerido '});
            }

            await authService.resendVerification(email);

            return res.status(200).json({ message: 'Si el correo está registrado y pendiente de verificación, te enviamos un nuevo enlace.'});

        } catch (err: any) {

            const status = err.status || 500;
            return res.status(status).json({ message: err.message || 'Error interno del servidor' });
        }
    },

    async forgotPassword(req: Request, res: Response) {

        try {

            const { email } = req.body;

            if (!email) {
                return res.status(400).json({ message: 'El correo es obligatorio' });
            }

            const result = await authService.forgotPassword(email);

            return res.status(200).json(result);

        } catch (err: any) {

            const status = err.status || 500;
            const message = err.message || 'Error interno  del servidor';

            return res.status(status).json({ message });
        }
    },

    async resetPassword(req: Request, res: Response) {

        try {

            const { token, password } = req.body;

            if (!token || !password) {
                return res.status(400).json({ message: 'Token y nueva contraseña son obligatorios.' });
            }

            const result = await authService.resetPassword(token, password);

            return res.status(200).json(result);

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

    async googleCallback(req: Request, res: Response) {

        try {

            const user = req.user as any;
            const result = await authService.loginWithGoogle(user);

            res.cookie(AUTH_COOKIE_NAME, result.token, sessionCookieOptions);

            return res.redirect(`${process.env.FRONTEND_URL}/auth/success`);

        } catch (err: any) {

            return res.redirect(`${process.env.FRONTEND_URL}/login?error=google_auth_failed`);
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
