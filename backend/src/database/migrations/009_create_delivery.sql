CREATE TABLE delivery_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    deliverer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    address TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'recibido' CHECK (status IN ('recibido', 'en_preparacion', 'en_camino', 'entregado')),
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('efectivo', 'tarjeta', 'pse', 'contra_entrega')),
    payment_status VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK (payment_status IN ('pendiente', 'aprobado', 'rechazado')),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
); 