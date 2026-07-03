ALTER TABLE payments
RENAME COLUMN transactions_id TO transaction_id;

ALTER TABLE payments
ADD CONSTRAINT uq_payments_transaction_id UNIQUE (transaction_id);

ALTER TABLE payments
ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

ALTER TABLE payments
ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'America/Bogota';