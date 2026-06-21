import passport from 'passport';
import { Strategy as GoogleStrategy} from 'passport-google-oauth20';
import pool from './db';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALL_URL;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_CALLBACK_URL) {
    throw { message: 'Falta variables de entorno de Google OAuth' };
}

passport.use(

    new GoogleStrategy(

        {
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: GOOGLE_CALLBACK_URL,
        },

        async (_accessToken, _refreshToken, profile, done) => {

            try {

                const email = profile.emails?.[0]?.value;

                if (!email) {
                    return done(new Error('Google no devolvió un correo válido'));
                }

                const { rows } = await pool.query(
                    'SELECT * FROM users WHERE email = $1', [email]
                );

                let user = rows[0];

                if (user && user.provider !== 'google') {
                    return done(new Error('Este correo ya está registrado con contraseña. Inicia sesión nuevamente.' ));
                }

                if (!user) {

                    const firstName = profile.name?.givenName || profile.displayName || 'Usuario';
                    const lastName = profile.name?.familyName || '';

                    const { rows: newUserRows } = await pool.query(
                        `INSERT INTO users (first_name, last_name, email, provider, email_verified, is_active) VALUES 
                        ($1, $2, $3, 'google', true, true) RETURNING *`, [firstName, lastName, email]
                    );

                    user = newUserRows[0];

                    const { rows: roleRows } = await pool.query(
                        `SELECT id FROM roles WHERE name = 'cliente'`
                    );

                    await pool.query(
                        `INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)`, [user.id, roleRows[0].id]
                    );
                }

                return done(null, user);

            } catch (err) {
                return done(err as Error); 
            }
        }
    )
);

export default passport;