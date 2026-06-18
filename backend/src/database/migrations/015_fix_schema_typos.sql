DO $$
BEGIN
    IF to_regclass('public.orders') IS NOT NULL THEN
        ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_type_check;
        UPDATE orders SET type = 'mesa' WHERE type = 'mmesa';
        ALTER TABLE orders ALTER COLUMN type SET DEFAULT 'mesa';
        ALTER TABLE orders ADD CONSTRAINT orders_type_check CHECK (type IN ('mesa', 'domicilio'));
    END IF;

    IF to_regclass('public.reservations') IS NOT NULL THEN
        ALTER TABLE reservations DROP CONSTRAINT IF EXISTS reservations_status_check;
        ALTER TABLE reservations ADD CONSTRAINT reservations_status_check CHECK (
            status IN ('confirmada', 'cancelada', 'completada', 'no_presentado')
        );
    END IF;

    IF to_regclass('public.restaurant_info') IS NOT NULL THEN
        IF EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_schema = 'public'
              AND table_name = 'restaurant_info'
              AND column_name = 'converage_zones'
        ) AND NOT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_schema = 'public'
              AND table_name = 'restaurant_info'
              AND column_name = 'coverage_zones'
        ) THEN
            ALTER TABLE restaurant_info RENAME COLUMN converage_zones TO coverage_zones;
        END IF;
    END IF;
END $$;
