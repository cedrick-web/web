import 'dotenv/config';
import { createHash, timingSafeEqual } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { query as defaultQuery } from './db.js';
import { hashPassword, verifyPassword, signUser, requireAuth } from './auth.js';

const PRODUCT_SLUG = 'javascript-problem-solving-dsa-toolkit-v1';

function createRateLimiter(limit, windowMs) {
  const windows = new Map();
  return (req, res, next) => {
    const now = Date.now();
    const key = String(req.ip || req.socket?.remoteAddress || 'unknown');
    let record = windows.get(key);
    if (!record || record.resetAt <= now) record = { count: 0, resetAt: now + windowMs };
    if (windows.size > 5000) {
      for (const [address, value] of windows) {
        if (value.resetAt <= now) windows.delete(address);
      }
    }
    if (record.count >= limit) {
      res.set('Retry-After', String(Math.max(1, Math.ceil((record.resetAt - now) / 1000))));
      windows.set(key, record);
      return res.status(429).json({ error: 'Too many attempts. Please try again shortly.' });
    }
    record.count += 1;
    windows.set(key, record);
    next();
  };
}

function validEmail(email) {
  return typeof email === 'string' && email.length <= 255 && /^\S+@\S+\.\S+$/.test(email);
}

function isValidChallengeId(value) {
  return /^DSP-(?:00[1-9]|0[1-5]\d|060)$/.test(value);
}

function sameSecret(expected, provided) {
  if (typeof provided !== 'string' || !/^[a-f0-9]{64}$/i.test(provided)) return false;
  const expectedBytes = Buffer.from(expected, 'utf8');
  const providedBytes = Buffer.from(provided, 'utf8');
  return expectedBytes.length === providedBytes.length && timingSafeEqual(expectedBytes, providedBytes);
}

function sameEndpointSecret(expected, provided) {
  if (typeof expected !== 'string' || expected.length < 32 || typeof provided !== 'string') return false;
  const expectedBytes = Buffer.from(expected, 'utf8');
  const providedBytes = Buffer.from(provided, 'utf8');
  return expectedBytes.length === providedBytes.length && timingSafeEqual(expectedBytes, providedBytes);
}

export function createApp({ queryFn = defaultQuery, env = process.env } = {}) {
  const app = express();
  const allowedOrigins = String(env.CORS_ORIGIN || '').split(',').map(value => value.trim()).filter(Boolean);

  app.disable('x-powered-by');
  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      const localhostOrigin = /^https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?$/.test(origin);
      if (env.NODE_ENV !== 'production' && localhostOrigin) return callback(null, true);
      return callback(null, false);
    },
    methods: ['GET', 'POST', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400,
  }));
  app.use(express.json({ limit: '100kb', strict: true }));
  app.use((_req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
  });

  app.get('/health', async (_req, res) => {
    try {
      await queryFn('SELECT 1 AS ok');
      res.json({ ok: true, service: 'devsprint-api', database: 'ok' });
    } catch (error) {
      console.error('Health check database query failed:', error);
      res.status(503).json({ ok: false, service: 'devsprint-api', database: 'unavailable' });
    }
  });

  app.post('/api/auth/register', createRateLimiter(5, 15 * 60 * 1000), async (req, res, next) => {
    try {
      const email = String(req.body?.email || '').trim().toLowerCase();
      const password = String(req.body?.password || '');
      const name = String(req.body?.name || '').trim();
      if (!validEmail(email)) return res.status(400).json({ error: 'Valid email required' });
      if (name.length < 2 || name.length > 80) return res.status(400).json({ error: 'Name must be 2-80 characters' });
      const passwordBytes = Buffer.byteLength(password, 'utf8');
      if (passwordBytes < 8 || passwordBytes > 72) {
        return res.status(400).json({ error: 'Password must be 8-72 UTF-8 bytes' });
      }

      const existing = await queryFn('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);
      if (existing.length) return res.status(409).json({ error: 'An account with that email already exists' });
      const passwordHash = await hashPassword(password);
      const result = await queryFn(
        'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
        [name, email, passwordHash, 'student']
      );
      const user = { id: result.insertId, name, email, role: 'student' };
      res.status(201).json({ user, token: signUser(user) });
    } catch (error) {
      next(error);
    }
  });

  app.post('/api/auth/login', createRateLimiter(10, 15 * 60 * 1000), async (req, res, next) => {
    try {
      const email = String(req.body?.email || '').trim().toLowerCase();
      const password = String(req.body?.password || '');
      if (!validEmail(email) || !password || Buffer.byteLength(password, 'utf8') > 72) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      const rows = await queryFn(
        'SELECT id, name, email, password_hash, role FROM users WHERE email = ? LIMIT 1',
        [email]
      );
      if (!rows.length || !(await verifyPassword(password, rows[0].password_hash))) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      const user = { id: rows[0].id, name: rows[0].name, email: rows[0].email, role: rows[0].role };
      res.json({ user, token: signUser(user) });
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/me', requireAuth, async (req, res, next) => {
    try {
      const rows = await queryFn(
        'SELECT id, name, email, role, created_at FROM users WHERE id = ? LIMIT 1',
        [req.user.sub]
      );
      if (!rows.length) return res.status(404).json({ error: 'User not found' });
      res.json({ user: rows[0] });
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/progress', requireAuth, async (req, res, next) => {
    try {
      const rows = await queryFn(
        'SELECT challenge_id, status, attempts, updated_at FROM user_progress WHERE user_id = ? ORDER BY challenge_id',
        [req.user.sub]
      );
      res.json({ progress: rows });
    } catch (error) {
      next(error);
    }
  });

  app.put('/api/progress/:challengeId', requireAuth, async (req, res, next) => {
    try {
      const challengeId = String(req.params.challengeId || '').toUpperCase();
      if (!isValidChallengeId(challengeId)) {
        return res.status(400).json({ error: 'Challenge ID must be DSP-001 through DSP-060' });
      }
      const status = req.body?.status;
      if (!['started', 'completed'].includes(status)) {
        return res.status(400).json({ error: 'Status must be started or completed' });
      }
      await queryFn(
        'INSERT INTO user_progress (user_id, challenge_id, status, attempts) VALUES (?, ?, ?, 1) ON DUPLICATE KEY UPDATE status = VALUES(status), attempts = attempts + 1, updated_at = CURRENT_TIMESTAMP',
        [req.user.sub, challengeId, status]
      );
      res.json({ ok: true, challengeId, status });
    } catch (error) {
      next(error);
    }
  });

  // Payhip documents the webhook signature as SHA-256(api key). Only process the configured product.
  app.post('/api/payments/payhip/webhook', async (req, res, next) => {
    try {
      const apiKey = String(env.PAYHIP_WEBHOOK_API_KEY || '');
      const configuredProductId = String(env.PAYHIP_PRODUCT_ID || '').trim();
      const endpointSecret = String(env.PAYHIP_WEBHOOK_SECRET || '');
      if (!apiKey || !configuredProductId || endpointSecret.length < 32) {
        return res.status(503).json({ error: 'Payment webhook is not fully configured' });
      }
      if (!sameEndpointSecret(endpointSecret, String(req.query?.secret || ''))) {
        return res.status(401).json({ error: 'Invalid webhook endpoint secret' });
      }

      const expectedSignature = createHash('sha256').update(apiKey, 'utf8').digest('hex');
      if (!sameSecret(expectedSignature, req.body?.signature)) {
        return res.status(401).json({ error: 'Invalid webhook signature' });
      }

      const type = String(req.body?.type || '');
      if (!['paid', 'refunded'].includes(type)) {
        return res.json({ ok: true, ignored: true, reason: 'unsupported_event' });
      }

      const items = Array.isArray(req.body?.items) ? req.body.items : [];
      const item = items.find(entry => String(entry?.product_id || '').trim() === configuredProductId);
      if (!item) {
        // Ignore valid events for unrelated products without retrying them.
        return res.json({ ok: true, ignored: true, reason: 'product_mismatch' });
      }

      const transactionId = String(req.body?.id || '').trim();
      const email = String(req.body?.email || '').trim().toLowerCase();
      const currency = String(req.body?.currency || '').trim().toUpperCase();
      const amountMinor = Number(req.body?.price);
      if (!transactionId || transactionId.length > 160 || !validEmail(email) ||
          !/^[A-Z]{3}$/.test(currency) || !Number.isSafeInteger(amountMinor) || amountMinor < 0) {
        return res.status(400).json({ error: 'Invalid Payhip event payload' });
      }

      const products = await queryFn(
        'SELECT id, name, price_minor, currency, status FROM products WHERE slug = ? LIMIT 1',
        [PRODUCT_SLUG]
      );
      if (!products.length) {
        return res.status(503).json({ error: 'Configured DevSprint product is missing in the database' });
      }
      const product = products[0];
      // New sales require an active product; refunds must still be processed if the
      // seller later archives the product, otherwise customers could retain access.
      if (type === 'paid' && product.status !== 'active') {
        return res.status(503).json({ error: 'Configured DevSprint product is inactive for new sales' });
      }
      if (currency !== String(product.currency).toUpperCase()) {
        return res.status(400).json({ error: 'Payment currency does not match the configured DevSprint product' });
      }

      const users = await queryFn('SELECT id, name FROM users WHERE email = ? LIMIT 1', [email]);
      const userId = users.length ? users[0].id : null;

      if (type === 'paid') {
        await queryFn(
          'INSERT INTO orders (user_id, product_id, provider, provider_transaction_id, amount_minor, refunded_amount_minor, currency, status) VALUES (?, ?, ?, ?, ?, 0, ?, ?) ON DUPLICATE KEY UPDATE user_id = COALESCE(VALUES(user_id), user_id), amount_minor = VALUES(amount_minor), currency = VALUES(currency), status = CASE WHEN status IN ("refunded", "partially_refunded") THEN status ELSE "paid" END, updated_at = CURRENT_TIMESTAMP',
          [userId, product.id, 'payhip', transactionId, amountMinor, currency, 'paid']
        );
        const orders = await queryFn(
          'SELECT id, amount_minor, refunded_amount_minor, status FROM orders WHERE provider = ? AND provider_transaction_id = ? LIMIT 1',
          ['payhip', transactionId]
        );
        if (!orders.length) throw new Error('Payhip order insert did not return a persisted order');
        const order = orders[0];
        if (order.status === 'refunded') {
          return res.json({ ok: true, ignored: true, reason: 'transaction_already_refunded', transactionId });
        }

        const receiptNumber = 'DSR-' + Date.now() + '-' + transactionId.slice(-6).toUpperCase();
        await queryFn(
          'INSERT INTO receipts (order_id, receipt_number, customer_name, customer_email, amount_minor, currency) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE status = "issued"',
          [order.id, receiptNumber, users.length ? users[0].name : email.split('@')[0].slice(0, 80), email, amountMinor, currency]
        );
        if (userId && ['paid', 'partially_refunded'].includes(order.status)) {
          await queryFn(
            'INSERT INTO entitlements (user_id, product_id, source_order_id) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE source_order_id = VALUES(source_order_id)',
            [userId, product.id, order.id]
          );
        }
        return res.json({ ok: true, type, transactionId, productId: configuredProductId });
      }

      const orders = await queryFn(
        'SELECT id, amount_minor, refunded_amount_minor, status FROM orders WHERE provider = ? AND provider_transaction_id = ? LIMIT 1',
        ['payhip', transactionId]
      );
      if (!orders.length) {
        return res.json({ ok: true, ignored: true, reason: 'unknown_transaction', transactionId });
      }
      const order = orders[0];
      if (order.status === 'refunded') {
        // Retry cleanup even if an earlier webhook attempt updated the order but failed
        // before receipt voiding or entitlement revocation completed.
        await queryFn(
          'UPDATE receipts r JOIN orders o ON o.id = r.order_id SET r.status = "voided" WHERE o.provider = ? AND o.provider_transaction_id = ?',
          ['payhip', transactionId]
        );
        await queryFn(
          'DELETE e FROM entitlements e JOIN orders o ON o.id = e.source_order_id WHERE o.provider = ? AND o.provider_transaction_id = ?',
          ['payhip', transactionId]
        );
        return res.json({ ok: true, type, transactionId, fullRefund: true, alreadyProcessed: true });
      }

      const refundAmount = Number(req.body?.amount_refunded);
      if (!Number.isSafeInteger(refundAmount) || refundAmount <= 0 || refundAmount > Number(order.amount_minor)) {
        return res.status(400).json({ error: 'Invalid Payhip refund amount' });
      }
      const previousRefund = Math.max(0, Number(order.refunded_amount_minor || 0));
      if (refundAmount < previousRefund) {
        // Payhip may retry/deliver events out of order. Never roll refund state backwards.
        return res.json({
          ok: true,
          ignored: true,
          reason: 'stale_refund_event',
          transactionId,
          refundedAmountMinor: previousRefund,
        });
      }
      const fullRefund = refundAmount >= Number(order.amount_minor);
      const nextStatus = fullRefund ? 'refunded' : 'partially_refunded';
      await queryFn(
        'UPDATE orders SET refunded_amount_minor = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE provider = ? AND provider_transaction_id = ?',
        [refundAmount, nextStatus, 'payhip', transactionId]
      );

      if (fullRefund) {
        await queryFn(
          'UPDATE receipts r JOIN orders o ON o.id = r.order_id SET r.status = "voided" WHERE o.provider = ? AND o.provider_transaction_id = ?',
          ['payhip', transactionId]
        );
        await queryFn(
          'DELETE e FROM entitlements e JOIN orders o ON o.id = e.source_order_id WHERE o.provider = ? AND o.provider_transaction_id = ?',
          ['payhip', transactionId]
        );
      }
      res.json({ ok: true, type, transactionId, fullRefund, status: nextStatus });
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/entitlements', requireAuth, async (req, res, next) => {
    try {
      const rows = await queryFn(
        'SELECT e.product_id, p.slug, p.name, e.granted_at FROM entitlements e JOIN products p ON p.id = e.product_id WHERE e.user_id = ? ORDER BY e.granted_at DESC',
        [req.user.sub]
      );
      res.json({ entitlements: rows });
    } catch (error) {
      next(error);
    }
  });

  app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));
  app.use((error, _req, res, _next) => {
    if (error?.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'A record with these details already exists' });
    if (error?.type === 'entity.parse.failed' || error instanceof SyntaxError) {
      return res.status(400).json({ error: 'Malformed JSON request body' });
    }
    if (error?.status === 413) return res.status(413).json({ error: 'Request body is too large' });
    console.error('API request failed:', error);
    return res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}

export default createApp;

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const app = createApp();
  const port = Number(process.env.PORT || 10000);
  app.listen(port, '0.0.0.0', () => console.log('DevSprint API listening on ' + port));
}
