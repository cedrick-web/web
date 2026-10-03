import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { query } from './db.js';
import { hashPassword, verifyPassword, signUser, requireAuth } from './auth.js';

const app = express();
const port = Number(process.env.PORT || 10000);
const allowedOrigins = (process.env.CORS_ORIGIN || '').split(',').map(x => x.trim()).filter(Boolean);

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: allowedOrigins.length ? allowedOrigins : true, credentials: false }));
app.use(express.json({ limit: '100kb' }));

app.get('/health', async (_req, res) => {
  try {
    await query('SELECT 1 AS ok');
    res.json({ ok: true, service: 'devsprint-api', database: 'ok' });
  } catch {
    res.status(503).json({ ok: false, service: 'devsprint-api', database: 'unavailable' });
  }
});

app.post('/api/auth/register', async (req, res, next) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '');
    const name = String(req.body?.name || '').trim();
    if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: 'Valid email required' });
    if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });
    if (name.length < 2 || name.length > 80) return res.status(400).json({ error: 'Name must be 2-80 characters' });
    const existing = await query('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);
    if (existing.length) return res.status(409).json({ error: 'An account with that email already exists' });
    const passwordHash = await hashPassword(password);
    const result = await query('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)', [name, email, passwordHash, 'student']);
    const user = { id: result.insertId, name, email, role: 'student' };
    res.status(201).json({ user, token: signUser(user) });
  } catch (error) { next(error); }
});

app.post('/api/auth/login', async (req, res, next) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '');
    const rows = await query('SELECT id, name, email, password_hash, role FROM users WHERE email = ? LIMIT 1', [email]);
    if (!rows.length || !(await verifyPassword(password, rows[0].password_hash))) return res.status(401).json({ error: 'Invalid email or password' });
    const user = { id: rows[0].id, name: rows[0].name, email: rows[0].email, role: rows[0].role };
    res.json({ user, token: signUser(user) });
  } catch (error) { next(error); }
});

app.get('/api/me', requireAuth, async (req, res, next) => {
  try {
    const rows = await query('SELECT id, name, email, role, created_at FROM users WHERE id = ? LIMIT 1', [req.user.sub]);
    if (!rows.length) return res.status(404).json({ error: 'User not found' });
    res.json({ user: rows[0] });
  } catch (error) { next(error); }
});

app.get('/api/progress', requireAuth, async (req, res, next) => {
  try {
    const rows = await query('SELECT challenge_id, status, attempts, updated_at FROM user_progress WHERE user_id = ? ORDER BY challenge_id', [req.user.sub]);
    res.json({ progress: rows });
  } catch (error) { next(error); }
});

app.put('/api/progress/:challengeId', requireAuth, async (req, res, next) => {
  try {
    const challengeId = String(req.params.challengeId || '').toUpperCase();
    if (!/^DSP-\d{3}$/.test(challengeId)) return res.status(400).json({ error: 'Invalid challenge ID' });
    const status = req.body?.status === 'completed' ? 'completed' : 'started';
    await query(`INSERT INTO user_progress (user_id, challenge_id, status, attempts)
      VALUES (?, ?, ?, 1)
      ON DUPLICATE KEY UPDATE status = VALUES(status), attempts = attempts + 1, updated_at = CURRENT_TIMESTAMP`, [req.user.sub, challengeId, status]);
    res.json({ ok: true, challengeId, status });
  } catch (error) { next(error); }
});



// Payhip webhook: signed payment events are the source of truth for paid access.
app.post('/api/payments/payhip/webhook', async (req, res, next) => {
  try {
    const apiKey = String(process.env.PAYHIP_WEBHOOK_API_KEY || '');
    const signature = String(req.body?.signature || '');
    if (!apiKey || !signature) return res.status(401).json({ error: 'Webhook not configured' });

    const { createHash, timingSafeEqual } = await import('node:crypto');
    const expected = createHash('sha256').update(apiKey).digest('hex');
    const a = Buffer.from(expected, 'utf8');
    const b = Buffer.from(signature, 'utf8');
    if (a.length !== b.length || !timingSafeEqual(a, b)) return res.status(401).json({ error: 'Invalid webhook signature' });

    const type = String(req.body?.type || '');
    const transactionId = String(req.body?.id || '').trim();
    const email = String(req.body?.email || '').trim().toLowerCase();
    const currency = String(req.body?.currency || 'USD').toUpperCase();
    const amountMinor = Math.max(0, Math.round(Number(req.body?.price || 0)));
    const item = Array.isArray(req.body?.items) ? req.body.items[0] : null;
    const productExternalId = String(item?.product_id || '').trim();
    const productName = String(item?.product_name || 'JavaScript Problem-Solving & DSA Toolkit V1').trim();
    if (!transactionId || !email || !item) return res.status(400).json({ error: 'Invalid Payhip event' });

    const productSlug = 'javascript-problem-solving-dsa-toolkit-v1';
    let products = await query('SELECT id FROM products WHERE slug = ? LIMIT 1', [productSlug]);
    if (!products.length) {
      const created = await query('INSERT INTO products (slug, name, price_minor, currency, status) VALUES (?, ?, ?, ?, ?)', [productSlug, productName, amountMinor, currency, 'active']);
      products = [{ id: created.insertId }];
    }
    const productId = products[0].id;
    const users = await query('SELECT id, name FROM users WHERE email = ? LIMIT 1', [email]);
    const userId = users.length ? users[0].id : null;

    if (type === 'paid') {
      await query(
        'INSERT INTO orders (user_id, product_id, provider, provider_transaction_id, amount_minor, currency, status) VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE user_id = COALESCE(VALUES(user_id), user_id), amount_minor = VALUES(amount_minor), currency = VALUES(currency), status = "paid", updated_at = CURRENT_TIMESTAMP',
        [userId, productId, 'payhip', transactionId, amountMinor, currency, 'paid']
      );
      const orders = await query('SELECT id FROM orders WHERE provider = ? AND provider_transaction_id = ? LIMIT 1', ['payhip', transactionId]);
      const orderId = orders[0].id;
      const receiptNumber = 'DSR-' + Date.now() + '-' + transactionId.slice(-6).toUpperCase();
      await query(
        'INSERT INTO receipts (order_id, receipt_number, customer_name, customer_email, amount_minor, currency) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE status = "issued"',
        [orderId, receiptNumber, users.length ? users[0].name : email.split('@')[0].slice(0, 80), email, amountMinor, currency]
      );
      if (userId) {
        await query('INSERT INTO entitlements (user_id, product_id, source_order_id) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE source_order_id = VALUES(source_order_id)', [userId, productId, orderId]);
      }
    } else if (type === 'refunded') {
      await query('UPDATE orders SET status = "refunded" WHERE provider = ? AND provider_transaction_id = ?', ['payhip', transactionId]);
      await query('UPDATE receipts r JOIN orders o ON o.id = r.order_id SET r.status = "voided" WHERE o.provider = ? AND o.provider_transaction_id = ?', ['payhip', transactionId]);
      await query('DELETE e FROM entitlements e JOIN orders o ON o.id = e.source_order_id WHERE o.provider = ? AND o.provider_transaction_id = ?', ['payhip', transactionId]);
    }

    res.json({ ok: true, type, transactionId, productExternalId });
  } catch (error) { next(error); }
});

app.get('/api/entitlements', requireAuth, async (req, res, next) => {
  try {
    const rows = await query('SELECT e.product_id, p.slug, p.name, e.granted_at FROM entitlements e JOIN products p ON p.id = e.product_id WHERE e.user_id = ? ORDER BY e.granted_at DESC', [req.user.sub]);
    res.json({ entitlements: rows });
  } catch (error) { next(error); }
});

app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));
app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, '0.0.0.0', () => console.log(`DevSprint API listening on ${port}`));
