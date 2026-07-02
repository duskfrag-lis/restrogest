ALTER TABLE inventory_items
ADD COLUMN expiry_date DATE,
ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

ALTER TABLE inventory_items
ALTER COLUMN updated_at TYPE TIMESTAMPTZ USING updated_at AT TIME ZONE 'America/Bogota';

ALTER TABLE inventory_items
ADD CONSTRAINT chk_inventory_quantity_positive CHECK (quantity >= 0),
ADD CONSTRAINT chk_inventory_min_threshold_positive CHECK (min_threshold >= 0);

CREATE INDEX indx_inventory_movements_items_id ON inventory_movements(item_id);