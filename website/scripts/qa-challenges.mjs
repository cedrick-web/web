import assert from 'node:assert/strict';
import { freeChallenges } from '../src/challenges.js';

assert.equal(freeChallenges.length, 10, 'Free pack must contain exactly 10 challenges.');

const requiredFields = ['id', 'title', 'difficulty', 'skill', 'prompt', 'example', 'hint', 'pseudocode', 'solution', 'tests', 'complexity'];

for (const challenge of freeChallenges) {
  for (const field of requiredFields) {
    assert.ok(challenge[field] !== undefined && challenge[field] !== '', `Challenge ${challenge.id} is missing ${field}.`);
  }
  assert.ok(Array.isArray(challenge.pseudocode) && challenge.pseudocode.length > 0, `Challenge ${challenge.id} needs pseudocode.`);
  assert.ok(Array.isArray(challenge.tests) && challenge.tests.length > 0, `Challenge ${challenge.id} needs tests.`);
  assert.match(challenge.solution, /^function\s+\w+\s*\(/, `Challenge ${challenge.id} solution must define a function.`);
}

const solutions = new Map();
for (const challenge of freeChallenges) {
  const factory = new Function(`${challenge.solution}\nreturn ${challenge.solution.match(/^function\s+(\w+)/)[1]};`);
  solutions.set(challenge.id, factory());
}

const run = (id, ...args) => solutions.get(id)(...args);

assert.equal(run(1, [8, 3, 15, 6, 10]), 15);
assert.equal(run(1, [0, -1, -3]), 0);
assert.equal(run(1, [-4, -9, -2]), -2);

assert.equal(run(2, [2, 7, 4, 9, 10]), 3);
assert.equal(run(2, []), 0);
assert.equal(run(2, [-4, -3, 0, 2]), 3);

assert.equal(run(3, 'devsprint'), 'tnirpsved');
assert.equal(run(3, ''), '');
assert.equal(run(3, 'DevSprint'), 'tnirpSveD');

assert.equal(run(4, [-2, 5, 7, -1, 3]), 15);
assert.equal(run(4, [-4, 0]), 0);
assert.equal(run(4, [1, -1, 0, 3]), 4);

assert.equal(run(5, [4, 8, 2, 8], 8), 1);
assert.equal(run(5, [7, 2, 7], 7), 0);
assert.equal(run(5, [], 1), -1);

assert.deepEqual(run(6, [3, 3, 1, 2, 1]), [3, 1, 2]);
assert.deepEqual(run(6, []), []);
assert.deepEqual(run(6, [5, 5, 5]), [5]);

assert.equal(run(7, 'Level'), true);
assert.equal(run(7, 'hello'), false);
assert.equal(run(7, ''), true);
assert.equal(run(7, 'RaceCar'), true);

assert.equal(run(8, [10, 4, 10, 7, 8]), 8);
assert.equal(run(8, [5, 5]), null);
assert.equal(run(8, [-2, -8, -4]), -4);
assert.equal(run(8, [0, -1]), -1);
assert.equal(run(8, [0, 0, -2]), -2);
assert.equal(run(8, []), null);

assert.equal(run(9, '(()())'), true);
assert.equal(run(9, '(()'), false);
assert.equal(run(9, ')('), false);
assert.equal(run(9, ''), true);
assert.equal(run(9, '())('), false);

assert.deepEqual(run(10, [2, 7, 11, 15], 9), [0, 1]);
assert.deepEqual(run(10, [3, 2, 4], 6), [1, 2]);
assert.deepEqual(run(10, [3, 3], 6), [0, 1]);
assert.deepEqual(run(10, [1, 5], 10), []);
assert.deepEqual(run(10, [-3, 4, 2, 7], 1), [0, 1]);

console.log('DevSprint challenge QA passed: 10 challenges, required fields, and representative edge cases are valid.');
