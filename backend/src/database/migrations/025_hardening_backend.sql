ALTER TABLE users
ALTER COLUMN email TYPE VARCHAR(255);

ALTER TABLE users
ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'America/Bogota',
ALTER COLUMN updated_at TYPE TIMESTAMPTZ USING updated_at AT TIME ZONE 'America/Bogota';

ALTER TABLE menu_items
RENAME COLUMN update_at TO updated_at;

ALTER TABLE menu_items
ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'America/Bogota',
ALTER COLUMN updated_at TYPE TIMESTAMPTZ USING updated_at AT TIME ZONE 'America/Bogota';

ALTER TABLE restaurant_tables
ALTER COLUMN updated_at TYPE TIMESTAMPTZ USING updated_at AT TIME ZONE 'America/Bogota';