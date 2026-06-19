import usersRepository from './users.repository';
import emailService from '../../config/email';

const EMPLOYEE_ROLES = ['mesero', 'cocinero', 'jefe_cocina', 'domiciliario', 'administrador'];

const usersService = {

    async getAllUsers(role?: string) {
        return await usersRepository.findAll(role);
    },

    async getUserById(id: string) {
        const user = await usersRepository.findById(id);

        if (!user) throw { status: 404, message: 'Usuario no encontrado' };

        return user;
    },

    async createEmployee(data: {
        first_name: string;
        last_name: string;
        email: string;
        phone?: string;
        role: string;
    }) {

        if (!EMPLOYEE_ROLES.includes(data.role)) {
            throw { status: 400, message: `Rol inválido. Los roles permitidos son: ${EMPLOYEE_ROLES.join(', ')}`};
        }

        const user = await usersRepository.createEmployee(data);
        const token = await usersRepository.createActivationToken(user.id);

        await emailService.sendEmployeeActivation(
            user.email,
            user.first_name,
            token
        );

        return {
            message: 'Empleado creado correctamente. Se envió un correo de activación.', user,
        };
    },

    async activateEmployee(token: string, password: string) {
        const tokenRecord = await usersRepository.findValidToken(token, 'employee_activation');

        if (!tokenRecord) {
            throw { status: 400, message: 'El enlace de activación es inválido o ha expirado.'};
        }

        const bcrypt = await import('bcryptjs');
        const password_hash = await bcrypt.hash(password, 10);

        await import('../../config/db').then(({ default: pool }) => pool.query(
                `UPDATE users SET password_hash = $1, email_verified = true WHERE id = $2`, [password_hash, tokenRecord.user_id]
            )
        );

        await usersRepository.markTokenUsed(tokenRecord.id);

        return { message: 'Cuenta activada correctamente. Ya puedes iniciar sesión.'};
    },

    async changeRole(userId: string, newRole: string) {

        if (!EMPLOYEE_ROLES.includes(newRole) && newRole !== 'cliente') {
            throw { status: 400, message: `Rol inválido`};
        }

        const user = await usersRepository.findById(userId);

        if (!user) throw { status: 404, message: 'Usuario no encontrado'};

        await usersRepository.changeRole(userId, newRole);
        return { message: `Rol actualizado a '${newRole}' correctamente` };

    },

    async setActiveStatus(userId: string, isActive: boolean) {
        const user = await usersRepository.findById(userId);

        if (!user) throw { status: 404, message: 'Usuario no encontrado'};

        await usersRepository.setActiveStatus(userId, isActive);

        const action = isActive ? 'activada' : 'desactivada';
        return { message: `Cuenta ${action} correctamente`};
    },
    
};

export default usersService;