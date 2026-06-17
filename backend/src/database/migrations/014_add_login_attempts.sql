ALTER TABLE users
ADD COLUMN login_attempts INT NOT NULL DEFAULT 0,
ADD COLUMN last_login_attempt TIMESTAMP;