import bcrypt from "bcryptjs";
import pool from "../config/db";
import usersRepository from "../modules/users/users.repository";

const ADMIN_ROLE = 'administrador';
const PLACEHOLDER_PASSWORD = 'CHANGE_ME_BEFORE_DEPLOY';
const MIN_PASSWORD_LENGTH = 8;

async function seedAdmin() {

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const firstName = process.env.ADMIN_FIRST_NAME || 'Admin';
    const lastName = process.env.ADMIN_LAST_NAME || 'RestroGest';


    if (!email || !password) {

        console.error('[seed] ADMIN_EMAIL y ADMIN_PASSWORD son obligatorias. Seed abortado.');
        process.exit(1);
    }

    if (password === PLACEHOLDER_PASSWORD) {

        console.error('[seed] ADMIN_PASSWORD sigue siendo el valor de ejemplo. Cámbiala antes de desplegar. Seed abortado.');
        process.exit(1);
    }

    if (password.length < MIN_PASSWORD_LENGTH) {

        console.error(`[seed] ADMIN_PASSWORD debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres. Seed abortado.`);
        process.exit(1);
    }

    const adminCount = await usersRepository.countByRole(ADMIN_ROLE);

    if (adminCount > 0) {

        console.log('[seed] Ya existe una cuenta con rol administrador. Seed omitido.');
        await pool.end();
        return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await usersRepository.createAdminAccount({

        first_name: firstName,
        last_name: lastName,
        email,
        password_hash: passwordHash,
    });

    console.log('[seed] Cuenta administrador creada correctamente.');
    await pool.end();
}

seedAdmin().catch((err) => {

    console.error('[seed] Error inesperado ejecutando el seed: ', err.message );
    process.exit(1);
});