CREATE TABLE restaurant_info (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    description TEXT,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    schedule JSONB,
    social_links JSONB,
    converage_zones JSONB,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO restaurant_info (name, description, address, phone, email) VALUES
('RestroGest', 'Plataforma de gestión de restaurante', '', '', '');