import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateEnvironment } from '../scripts/check-env.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

const validBase = {
  NODE_ENV: 'production',
  DATABASE_URL: 'mysql://appuser:strong%40password@db.example.com:4000/devsprint?ssl-mode=VERIFY_IDENTITY',
  JWT_SECRET: 'this-is-a-valid-generated-256-bit-secret',
  CORS_ORIGIN: 'https://devsprint-web.onrender.com',
};

test('production passes with valid database, JWT and exact HTTPS CORS origin', () => {
  assert.deepEqual(validateEnvironment(validBase), { production: true, warnings: [] });
});

test('production fails clearly when required configuration is missing', () => {
  assert.throws(() => validateEnvironment({ NODE_ENV: 'production' }), /DATABASE_URL is required.*JWT_SECRET is required.*CORS_ORIGIN is required/s);
});

test('production refuses an HTTP or non-exact CORS origin', () => {
  assert.throws(() => validateEnvironment({ ...validBase, CORS_ORIGIN: 'http://devsprint-web.onrender.com' }), /exact HTTPS origin/);
  assert.throws(() => validateEnvironment({ ...validBase, CORS_ORIGIN: 'https://devsprint-web.onrender.com/' }), /exact HTTPS origin/);
});

test('production refuses a too-short JWT secret and non-MySQL database URL', () => {
  assert.throws(() => validateEnvironment({ ...validBase, JWT_SECRET: 'too-short-secret' }), /at least 32 characters/);
  assert.throws(() => validateEnvironment({ ...validBase, DATABASE_URL: 'postgres://user:pass@db.example.com/app' }), /mysql:\/\//);
});

test('Payhip webhook values must be configured together', () => {
  assert.throws(() => validateEnvironment({ ...validBase, PAYHIP_WEBHOOK_API_KEY: 'api-key' }), /Payhip webhook configuration is partial/);
  assert.throws(() => validateEnvironment({
    ...validBase,
    PAYHIP_WEBHOOK_API_KEY: 'api-key',
    PAYHIP_PRODUCT_ID: 'product-id',
    PAYHIP_WEBHOOK_SECRET: 'tiny',
  }), /PAYHIP_WEBHOOK_SECRET must be at least 32 characters/);
});

test('production can run the free learning API without partially configured payment credentials', () => {
  assert.doesNotThrow(() => validateEnvironment(validBase));
});

test('local automated QA can run without production secrets', () => {
  assert.deepEqual(validateEnvironment({ NODE_ENV: 'test' }), {
    production: false,
    warnings: ['Missing DATABASE_URL, JWT_SECRET is acceptable for local automated tests, but not for production.'],
  });
});

test('Render blueprint wires frontend to API and generates private secrets without fake Payhip values', () => {
  const render = fs.readFileSync(path.join(repoRoot, 'render.yaml'), 'utf8');
  assert.match(render, /key: VITE_API_URL\s+value: https:\/\/devsprint-api\.onrender\.com/);
  assert.match(render, /key: CORS_ORIGIN\s+value: https:\/\/devsprint-web\.onrender\.com/);
  assert.match(render, /key: JWT_SECRET\s+generateValue: true/);
  assert.match(render, /key: PAYHIP_WEBHOOK_SECRET\s+generateValue: true/);
  assert.match(render, /key: DATABASE_URL\s+sync: false/);
  assert.doesNotMatch(render, /key: PAYHIP_WEBHOOK_API_KEY\s+sync: false/);
  assert.doesNotMatch(render, /key: PAYHIP_PRODUCT_ID\s+sync: false/);
  assert.doesNotMatch(render, /key: VITE_CHECKOUT_URL/);
});
