-- Apply once to an existing database that was created before this migration.
-- Fresh databases created from the current schema.sql already include these definitions and seed data.
ALTER TABLE orders
  MODIFY COLUMN status ENUM('pending','paid','partially_refunded','failed','refunded') NOT NULL DEFAULT 'pending';

ALTER TABLE orders
  ADD COLUMN refunded_amount_minor INT UNSIGNED NOT NULL DEFAULT 0 AFTER amount_minor;

INSERT INTO products (slug, name, price_minor, currency, status)
VALUES ('javascript-problem-solving-dsa-toolkit-v1', 'JavaScript Problem-Solving & DSA Toolkit V1', 900, 'USD', 'active')
ON DUPLICATE KEY UPDATE name = VALUES(name), price_minor = VALUES(price_minor), currency = VALUES(currency);
