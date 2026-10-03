CREATE TABLE IF NOT EXISTS receipts (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id BIGINT UNSIGNED NOT NULL,
  receipt_number VARCHAR(40) NOT NULL,
  customer_name VARCHAR(80) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  amount_minor INT UNSIGNED NOT NULL,
  currency CHAR(3) NOT NULL,
  status ENUM('issued','voided') NOT NULL DEFAULT 'issued',
  issued_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_receipts_order (order_id),
  UNIQUE KEY uq_receipts_number (receipt_number),
  CONSTRAINT fk_receipts_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE RESTRICT,
  INDEX idx_receipts_email (customer_email),
  INDEX idx_receipts_issued_at (issued_at)
);