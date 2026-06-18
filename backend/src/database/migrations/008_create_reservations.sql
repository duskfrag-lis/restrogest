CREATE TABLE reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    table_id UUID NOT NULL REFERENCES restaurant_tables(id) ON DELETE RESTRICT,
    reserved_at TIMESTAMP NOT NULL,
    party_size INT NOT NULL CHECK (party_size > 0),
    status VARCHAR(20) NOT NULL DEFAULT 'confirmada' CHECK (status IN ('confirmada', 'cancelada', 'completada', 'no_presentado')),
    notes VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
