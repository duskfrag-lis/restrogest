CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE CHECK (name IN ('cliente', 'mesero', 'cocinero', 'jefe_cocina', 'domiciliario', 'administrador')),
    description VARCHAR(255)
);

INSERT INTO roles (name, description) VALUES
('cliente', 'Usuario final del restaurante'),
('mesero', 'Gestiona mesas y pedidos  en sala'),
('cocinero', 'Prepara pedidos  en cocina'),
('jefe_cocina', 'Supervisa cocina e inventario'),
('domiciliario', 'Gestiona entregas a domicilio'),
('administrador', 'Acceso total al sistema');