import assert from 'node:assert/strict';
import test from 'node:test';
import { clearSessionToken, readSessionToken, saveSessionToken } from '../src/session.js';

const originalStorage = globalThis.sessionStorage;
function restoreStorage() {
  if (originalStorage === undefined) delete globalThis.sessionStorage;
  else globalThis.sessionStorage = originalStorage;
}

test('session token survives reloads within the browser tab and clears on logout', () => {
  const values = new Map();
  globalThis.sessionStorage = {
    getItem: key => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: key => values.delete(key),
  };
  saveSessionToken('test-token');
  assert.equal(readSessionToken(), 'test-token');
  clearSessionToken();
  assert.equal(readSessionToken(), '');
  restoreStorage();
});

test('session helper fails safely when browser storage is blocked', () => {
  globalThis.sessionStorage = {
    getItem() { throw new Error('blocked'); },
    setItem() { throw new Error('blocked'); },
    removeItem() { throw new Error('blocked'); },
  };
  assert.equal(readSessionToken(), '');
  assert.doesNotThrow(() => saveSessionToken('token'));
  assert.doesNotThrow(clearSessionToken);
  restoreStorage();
});
