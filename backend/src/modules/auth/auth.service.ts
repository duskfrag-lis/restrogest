import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import authRepository from "./auth.repository";
import tokensRepository from "../../config/tokens.repository";
import emailService from "../../config/email";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '8h';
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME_MINUTES = 15;
const MIN_PASSWORD_LENGTH = 8;
const VERIFICATION_TOKEN_EXPIRY = 24 * 60 * 60 * 1000;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET no está definido en las variables de entorno');
}

export interface RegisterDTO {
    first_name: string;
    last_name: string;
    phone?: string;
    email: string;
    password: string;
}

export interface LoginDTO {
    email: string;
    password: string;
}

const authService = {

    async register(data: RegisterDTO) {

        if (typeof data.password !== 'string' || data.password.length < MIN_PASSWORD_LENGTH) {
            throw { status: 400, message: `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres` };
        }

        const existing = await authRepository.findByEmail(data.email);

        if (existing) {
            throw { status: 409, message: 'El correo ya está registrado' };
        }

        const password_hash = await bcrypt.hash(data.password, 10);

        const user = await authRepository.createUser({
            first_name: data.first_name,
            last_name: data.last_name,
            phone: data.phone,
            email: data.email,
            password_hash,
            provider: 'local',
        });

        await authRepository.assignDefaultRole(user.id);

        const verificationToken = await tokensRepository.create(
            user.id, 'email_verification', VERIFICATION_TOKEN_EXPIRY
        );

        await emailService.sendEmailVerification(
            user.email, user.first_name, verificationToken
        );

        return {
            message: 'Registro exitoso. Revisa tu correo para verificar tu cuenta.',
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
            },
        };
    },

    async verifyEmail(token: string) {

        const tokenRecord = await tokensRepository.findValid(token, 'email_verification');

        if (!tokenRecord) {
            throw { status: 400, message: 'El enlace de verificación es inválido o ha expirado.' };
        }

        await authRepository.verifyEmail(tokenRecord.user_id);

        await tokensRepository.markUsed(tokenRecord.id);

        return { message: 'Correo verificado correctamente. Ya puedes iniciar sesión.' };
    },

    async login(data: LoginDTO) {
        const user = await authRepository.findByEmail(data.email);

        if (!user) {
            throw { status: 401, message: 'Credenciales inválidas'};
        }

        if (!user.is_active) {
            throw { status: 403, message: 'Tu cuenta está desactivada. Contacta al administrador.'};
        }

        if (user.provider === 'google') {
            throw { status: 400, message: 'Esta cuenta usa Google para iniciar sesión.'};
        }

        if (!user.email_verified) {
            throw { status: 400, message: 'Debes verificar tu correo antes de iniciar sesión.' };
        }

        if (user.login_attempts >= MAX_LOGIN_ATTEMPTS) {

            const lastAttempt = new Date(user.last_login_attempt).getTime();
            const now = Date.now();
            const diffMinutes = (now - lastAttempt) / 1000 /60;

            if (diffMinutes < LOCK_TIME_MINUTES) {

                const remaining = Math.ceil(LOCK_TIME_MINUTES - diffMinutes);

                throw { status: 429, message: `Cuenta bloqueada temporalmente. Intenta de nuevo en ${remaining} minutos.`, };
            } else {

                await authRepository.resetLoginAttempts(data.email);
            }
        }

        const validPassword = await bcrypt.compare(data.password, user.password_hash);

        if (!validPassword) {

            await authRepository.incrementLoginAttempts(data.email);

            throw { status: 401, message: 'Credenciales inválidad.'};
        }

        await authRepository.resetLoginAttempts(data.email);

        const userWithRole = await authRepository.getUserWithRole(user.id);

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: userWithRole.role,
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        return { token, user: userWithRole };
    },

    async verifyToken(token: string) {
        
        try {

            const decoded = jwt.verify(token, JWT_SECRET);
            return decoded;

        } catch {
            throw { status: 401, message: 'Token inválido o expirado'};
        }
    },
};

export default authService;
