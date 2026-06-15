import { Client } from 'pg'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config();

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

async function runMigrations() {
    await client.connect();
    console.log('Conectado a PostgreSQL');

    await client.query(`
        CREATE TABLE IF NOT EXISTS migrations ( id SERIAL PRIMARY KEY,
        filename VARCHAR(300) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT NOW()
        )
    `);

    const migrationsDir = path.join(__dirname, 'migrations');
    const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql'))
    .sort();

    for (const file of files) {

        const { rows } = await client.query(
        'SELECT id FROM migrations WHERE filename = $1', [file]
        );

        if ( rows.length > 0 ) {
            console.log(`Ya ejecutada: ${file}`);

            continue;
        }

        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
        await client.query(sql);
        await client.query('INSERT INTO migrations (filename) VALUES ($1)', [file]);
        console.log(`Ejecutada: ${file}`);

    }

    await client.end();
    console.log('Migraciones completadas');

}

runMigrations().catch(err => {
    console.error('Error en migraciones:', err);
    process.exit(1);
})



