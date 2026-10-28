import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { executeChallengeTests, MAX_CODE_LENGTH } from '../src/challengeExecution.js';

const websiteDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const app = fs.readFileSync(path.join(websiteDir, 'src', 'App.jsx'), 'utf8');
const runner = fs.readFileSync(path.join(websiteDir, 'src', 'challengeRunner.js'), 'utf8');
const worker = fs.readFileSync(path.join(websiteDir, 'src', 'challengeWorker.js'), 'utf8');

const largest = executeChallengeTests(1, 'function findLargest(numbers) { return Math.max(...numbers); }');
assert.equal(largest.length, 4);
assert.ok(largest.every((item) => item.pass), 'A valid solution should pass all largest-number test cases.');

const missing = executeChallengeTests(1, 'function notTheRightName() { return 1; }');
assert.equal(missing.length, 1);
assert.equal(missing[0].pass, false);
assert.match(missing[0].message, /findLargest/);

const runtime = executeChallengeTests(1, 'function findLargest() { throw new Error("sample failure"); }');
assert.equal(runtime.length, 4);
assert.ok(runtime.every((item) => !item.pass && item.message.includes('sample failure')));

const syntax = executeChallengeTests(1, 'function findLargest( {');
assert.equal(syntax.length, 1);
assert.equal(syntax[0].pass, false);
assert.match(syntax[0].message, /Syntax error/);

const oversized = executeChallengeTests(1, ' '.repeat(MAX_CODE_LENGTH + 1));
assert.equal(oversized.length, 1);
assert.match(oversized[0].message, /too long/i);

const unknown = executeChallengeTests(999, 'function example() {}');
assert.equal(unknown.length, 1);
assert.equal(unknown[0].pass, false);

assert.match(app, /runChallengeInWorker/);
assert.doesNotMatch(app, /setResults\(executeChallenge\(challenge,\s*code\)\)/);
assert.match(runner, /new Worker\(/);
assert.match(runner, /worker\.terminate\(\)/);
assert.match(runner, /EXECUTION_TIMEOUT_MS/);
for (const apiName of ['fetch', 'XMLHttpRequest', 'WebSocket', 'importScripts']) {
  assert.match(worker, new RegExp(`['"]${apiName}['"]`), `Worker should disable ${apiName} where supported.`);
}
assert.match(worker, /self\.postMessage = undefined/);

console.log('RUNNER QA PASSED: test behavior, syntax/runtime errors, input limits, worker isolation, and timeout checks.');
