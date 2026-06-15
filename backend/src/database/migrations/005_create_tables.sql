CREATE TABLE restaurant_tables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    number INT NOT NULL UNIQUE,
    capacity INT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'disponible' CHECK (status IN ('disponible', 'ocupada', 'reservada', 'en_limpieza')),
    update_at TIMESTAMP NOT NULL DEFAULT NOW()
);