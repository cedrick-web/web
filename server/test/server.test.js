import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { once } from 'node:events';
import test, { before, after } from 'node:test';
import { createApp } from '../src/server.js';

const originalJwtSecret = process.env.JWT_SECRET;
const TEST_JWT_SECRET = 'devsprint-test-secret-with-more-than-32-bytes';

before(() => {
  process.env.JWT_SECRET = TEST_JWT_SECRET;
});

after(() => {
  if (originalJwtSecret === undefined) delete process.env.JWT_SECRET;
  else process.env.JWT_SECRET = originalJwtSecret;
});

function makeFakeDb() {
  const state = {
    users: [],
    progress: [],
    products: [{ id: 7, slug: 'javascript-problem-solving-dsa-toolkit-v1', name: 'DevSprint V1', price_minor: 900, currency: 'USD', status: 'active' }],
    orders: [],
    receipts: [],
    entitlements: [],
    queries: [],
  };
  let nextUserId = 1;
  let nextOrderId = 1;

  async function query(sql, params = []) {
    const statement = sql.replace(/\s+/g, ' ').trim().toLowerCase();
    state.queries.push(statement);

    if (statement.startsWith('select 1 as ok')) return [{ ok: 1 }];
    if (statement.startsWith('select id from users where email')) {
      return state.users.filter(user => user.email === params[0]).map(user => ({ id: user.id }));
    }
    if (statement.startsWith('insert into users')) {
      const [name, email, password_hash, role] = params;
      if (state.users.some(user => user.email === email)) {
        const error = new Error('Duplicate email');
        error.code = 'ER_DUP_ENTRY';
        throw error;
      }
      const user = { id: nextUserId++, name, email, password_hash, role, created_at: new Date().toISOString() };
      state.users.push(user);
      return { insertId: user.id };
    }
    if (statement.startsWith('select id, name, email, password_hash, role from users')) {
      return state.users.filter(user => user.email === params[0]).map(user => ({ ...user }));
    }
    if (statement.startsWith('select id, name, email, role, created_at from users')) {
      return state.users.filter(user => String(user.id) === String(params[0]))
        .map(({ id, name, email, role, created_at }) => ({ id, name, email, role, created_at }));
    }
    if (statement.startsWith('select challenge_id, status, attempts, updated_at from user_progress')) {
      return state.progress.filter(row => String(row.user_id) === String(params[0]))
        .map(({ challenge_id, status, attempts, updated_at }) => ({ challenge_id, status, attempts, updated_at }));
    }
    if (statement.startsWith('insert into user_progress')) {
      const [user_id, challenge_id, status] = params;
      const existing = state.progress.find(row => String(row.user_id) === String(user_id) && row.challenge_id === challenge_id);
      if (existing) {
        existing.status = status;
        existing.attempts += 1;
        existing.updated_at = new Date().toISOString();
      } else {
        state.progress.push({ user_id, challenge_id, status, attempts: 1, updated_at: new Date().toISOString() });
      }
      return { affectedRows: 1 };
    }
    if (statement.startsWith('select id, name, price_minor, currency, status from products')) {
      return state.products.filter(product => product.slug === params[0]).map(product => ({ ...product }));
    }
    if (statement.startsWith('select id, name from users where email')) {
      return state.users.filter(user => user.email === params[0]).map(({ id, name }) => ({ id, name }));
    }
    if (statement.startsWith('insert into orders')) {
      const [user_id, product_id, provider, provider_transaction_id, amount_minor, currency] = params;
      let order = state.orders.find(row => row.provider === provider && row.provider_transaction_id === provider_transaction_id);
      if (!order) {
        order = { id: nextOrderId++, user_id, product_id, provider, provider_transaction_id, amount_minor, refunded_amount_minor: 0, currency, status: 'paid' };
        state.orders.push(order);
      } else {
        if (user_id != null) order.user_id = user_id;
        order.amount_minor = amount_minor;
        order.currency = currency;
        if (!['refunded', 'partially_refunded'].includes(order.status)) order.status = 'paid';
      }
      return { insertId: order.id };
    }
    if (statement.startsWith('select id, amount_minor, refunded_amount_minor, status from orders')) {
      return state.orders.filter(row => row.provider === params[0] && row.provider_transaction_id === params[1])
        .map(({ id, amount_minor, refunded_amount_minor, status }) => ({ id, amount_minor, refunded_amount_minor, status }));
    }
    if (statement.startsWith('insert into receipts')) {
      const [order_id, receipt_number, customer_name, customer_email, amount_minor, currency] = params;
      const existing = state.receipts.find(receipt => String(receipt.order_id) === String(order_id));
      if (existing) existing.status = 'issued';
      else state.receipts.push({ order_id, receipt_number, customer_name, customer_email, amount_minor, currency, status: 'issued' });
      return { affectedRows: 1 };
    }
    if (statement.startsWith('insert into entitlements')) {
      const [user_id, product_id, source_order_id] = params;
      const existing = state.entitlements.find(row => String(row.user_id) === String(user_id) && String(row.product_id) === String(product_id));
      if (existing) existing.source_order_id = source_order_id;
      else state.entitlements.push({ user_id, product_id, source_order_id });
      return { affectedRows: 1 };
    }
    if (statement.startsWith('update orders set refunded_amount_minor')) {
      const [refunded_amount_minor, status, provider, transactionId] = params;
      const order = state.orders.find(row => row.provider === provider && row.provider_transaction_id === transactionId);
      if (order) {
        order.refunded_amount_minor = refunded_amount_minor;
        order.status = status;
      }
      return { affectedRows: order ? 1 : 0 };
    }
    if (statement.startsWith('update receipts r join orders o')) {
      const [provider, transactionId] = params;
      const order = state.orders.find(row => row.provider === provider && row.provider_transaction_id === transactionId);
      if (order) {
        const receipt = state.receipts.find(row => String(row.order_id) === String(order.id));
        if (receipt) receipt.status = 'voided';
      }
      return { affectedRows: 1 };
    }
    if (statement.startsWith('delete e from entitlements')) {
      const [provider, transactionId] = params;
      const order = state.orders.find(row => row.provider === provider && row.provider_transaction_id === transactionId);
      if (order) state.entitlements = state.entitlements.filter(row => String(row.source_order_id) !== String(order.id));
      return { affectedRows: 1 };
    }
    if (statement.startsWith('select e.product_id, p.slug, p.name, e.granted_at from entitlements')) {
      return state.entitlements.map(row => {
        const product = state.products.find(item => String(item.id) === String(row.product_id));
        return { product_id: row.product_id, slug: product?.slug, name: product?.name, granted_at: new Date().toISOString() };
      }).filter(row => row.slug);
    }
    throw new Error('Test database has no handler for SQL: ' + statement);
  }

  return { state, query };
}

async function withApi({ db = makeFakeDb(), env = {}, run }) {
  const app = createApp({
    queryFn: db.query,
    env: {
      NODE_ENV: 'test',
      PAYHIP_WEBHOOK_API_KEY: 'test-payhip-api-key',
      PAYHIP_PRODUCT_ID: 'ds-v1-product-id',
      ...env,
    },
  });
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const base = 'http://127.0.0.1:' + server.address().port;
  try {
    await run({ base, db });
  } finally {
    await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  }
}

async function jsonRequest(base, path, options = {}) {
  const response = await fetch(base + path, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  return { response, body: await response.json() };
}

function signedPayload(overrides = {}) {
  const apiKey = 'test-payhip-api-key';
  return {
    id: 'txn-devsprint-001',
    email: 'buyer@example.com',
    currency: 'USD',
    price: 900,
    type: 'paid',
    signature: createHash('sha256').update(apiKey).digest('hex'),
    items: [{ product_id: 'ds-v1-product-id', product_name: 'DevSprint Toolkit V1' }],
    ...overrides,
  };
}

test('registration, login, current-user and challenge progress work end to end', async () => {
  await withApi({ run: async ({ base, db }) => {
    const registered = await jsonRequest(base, '/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name: 'Dev Student', email: 'student@example.com', password: 'strong-test-password' }),
    });
    assert.equal(registered.response.status, 201);
    assert.ok(registered.body.token);
    assert.equal(registered.body.user.email, 'student@example.com');

    const me = await jsonRequest(base, '/api/me', {
      headers: { Authorization: 'Bearer ' + registered.body.token },
    });
    assert.equal(me.response.status, 200);
    assert.equal(me.body.user.name, 'Dev Student');

    const saved = await jsonRequest(base, '/api/progress/DSP-001', {
      method: 'PUT',
      headers: { Authorization: 'Bearer ' + registered.body.token },
      body: JSON.stringify({ status: 'completed' }),
    });
    assert.equal(saved.response.status, 200);
    assert.equal(saved.body.status, 'completed');

    const progress = await jsonRequest(base, '/api/progress', {
      headers: { Authorization: 'Bearer ' + registered.body.token },
    });
    assert.equal(progress.response.status, 200);
    assert.equal(progress.body.progress.length, 1);
    assert.equal(progress.body.progress[0].challenge_id, 'DSP-001');

    const login = await jsonRequest(base, '/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'student@example.com', password: 'strong-test-password' }),
    });
    assert.equal(login.response.status, 200);
    assert.ok(login.body.token);
    assert.equal(db.state.users.length, 1);
  }});
});

test('progress rejects out-of-range challenge IDs and invalid statuses', async () => {
  await withApi({ run: async ({ base }) => {
    const registered = await jsonRequest(base, '/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name: 'Dev Student', email: 'student2@example.com', password: 'strong-test-password' }),
    });
    const headers = { Authorization: 'Bearer ' + registered.body.token };
    const badId = await jsonRequest(base, '/api/progress/DSP-061', {
      method: 'PUT', headers, body: JSON.stringify({ status: 'completed' }),
    });
    assert.equal(badId.response.status, 400);
    const badStatus = await jsonRequest(base, '/api/progress/DSP-001', {
      method: 'PUT', headers, body: JSON.stringify({ status: 'finished' }),
    });
    assert.equal(badStatus.response.status, 400);
  }});
});

test('invalid Payhip signature is rejected before database writes', async () => {
  await withApi({ run: async ({ base, db }) => {
    const payload = signedPayload({ signature: 'not-a-valid-signature' });
    const result = await jsonRequest(base, '/api/payments/payhip/webhook', {
      method: 'POST', body: JSON.stringify(payload),
    });
    assert.equal(result.response.status, 401);
    assert.equal(db.state.orders.length, 0);
    assert.equal(db.state.queries.some(query => query.includes('from products')), false);
  }});
});

test('Payhip events for a different product are ignored', async () => {
  await withApi({ run: async ({ base, db }) => {
    const result = await jsonRequest(base, '/api/payments/payhip/webhook', {
      method: 'POST',
      body: JSON.stringify(signedPayload({ items: [{ product_id: 'some-other-product' }] })),
    });
    assert.equal(result.response.status, 200);
    assert.equal(result.body.ignored, true);
    assert.equal(result.body.reason, 'product_mismatch');
    assert.equal(db.state.orders.length, 0);
  }});
});

test('Payhip paid events grant receipt and entitlement; partial/full refunds and replay are safe', async () => {
  await withApi({ run: async ({ base, db }) => {
    db.state.users.push({ id: 11, name: 'Buyer', email: 'buyer@example.com', password_hash: '', role: 'student' });

    const paid = await jsonRequest(base, '/api/payments/payhip/webhook', {
      method: 'POST', body: JSON.stringify(signedPayload()),
    });
    assert.equal(paid.response.status, 200);
    assert.equal(db.state.orders.length, 1);
    assert.equal(db.state.orders[0].status, 'paid');
    assert.equal(db.state.receipts.length, 1);
    assert.equal(db.state.entitlements.length, 1);

    const partial = await jsonRequest(base, '/api/payments/payhip/webhook', {
      method: 'POST', body: JSON.stringify(signedPayload({ type: 'refunded', amount_refunded: 200 })),
    });
    assert.equal(partial.response.status, 200);
    assert.equal(partial.body.fullRefund, false);
    assert.equal(db.state.orders[0].status, 'partially_refunded');
    assert.equal(db.state.entitlements.length, 1);
    assert.equal(db.state.receipts[0].status, 'issued');

    const full = await jsonRequest(base, '/api/payments/payhip/webhook', {
      method: 'POST', body: JSON.stringify(signedPayload({ type: 'refunded', amount_refunded: 900 })),
    });
    assert.equal(full.response.status, 200);
    assert.equal(full.body.fullRefund, true);
    assert.equal(db.state.orders[0].status, 'refunded');
    assert.equal(db.state.entitlements.length, 0);
    assert.equal(db.state.receipts[0].status, 'voided');

    const replay = await jsonRequest(base, '/api/payments/payhip/webhook', {
      method: 'POST', body: JSON.stringify(signedPayload()),
    });
    assert.equal(replay.response.status, 200);
    assert.equal(replay.body.ignored, true);
    assert.equal(db.state.orders[0].status, 'refunded');
    assert.equal(db.state.entitlements.length, 0);
  }});
});
