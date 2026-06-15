CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
    method VARCHAR(20) NOT NULL CHECK (method IN ('efectivo', 'tarjeta', 'pse', 'contra_entrega')),
    status VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'aprobado', 'rechazado', 'reembolsado')),
    amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
    transactions_id VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);