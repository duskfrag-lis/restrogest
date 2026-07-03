ALTER TABLE reviews
ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'America/Bogota';

ALTER TABLE reviews
ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

ALTER TABLE news
ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at AT TIME ZONE 'America/Bogota',
ALTER COLUMN published_at TYPE TIMESTAMPTZ USING published_at AT TIME ZONE 'America/Bogota';

ALTER TABLE news
ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_is_visible ON reviews(is_visible);
CREATE INDEX idx_news_is_published ON news(is_published);