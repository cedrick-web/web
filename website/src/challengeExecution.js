const MAX_CODE_LENGTH = 20_000;

const casesById = {
  1: [[[8, 3, 15, 6, 10], 15], [[5], 5], [[-4, -9, -2], -2], [[0, -1, -3], 0]],
  2: [[[2, 7, 4, 9, 10], 3], [[], 0], [[1, 3, 5], 0], [[-4, -3, 0, 2], 3]],
  3: [['devsprint', 'tnirpsved'], ['', ''], ['a', 'a'], ['DevSprint', 'tnirpSveD']],
  4: [[[-2, 5, 7, -1, 3], 15], [[-4, 0], 0], [[2], 2], [[1, -1, 0, 3], 4]],
  5: [[[4, 8, 2, 8], 8, 1], [[1, 2, 3], 9, -1], [[], 1, -1], [[7, 2, 7], 7, 0]],
  6: [[[3, 3, 1, 2, 1], [3, 1, 2]], [[], []], [[5, 5, 5], [5]], [[2, 3, 2, 4], [2, 3, 4]]],
  7: [['Level', true], ['hello', false], ['', true], ['RaceCar', true]],
  8: [[[10, 4, 10, 7, 8], 8], [[5, 5], null], [[-2, -8, -4], -4], [[0, -1], -1], [[0, 0, -2], -2], [[], null]],
  9: [['(()())', true], ['(()', false], [')(', false], ['', true], ['()()', true], ['())(', false]],
  10: [[[2, 7, 11, 15], 9, [0, 1]], [[3, 2, 4], 6, [1, 2]], [[3, 3], 6, [0, 1]], [[1, 5], 10, []], [[-3, 4, 2, 7], 1, [0, 1]]],
};

const functionNames = {
  1: 'findLargest',
  2: 'countEven',
  3: 'reverseString',
  4: 'sumPositive',
  5: 'findFirst',
  6: 'removeDuplicates',
  7: 'isPalindrome',
  8: 'secondLargest',
  9: 'isBalanced',
  10: 'twoSum',
};

function failure(message) {
  return [{ pass: false, message }];
}

function sameValue(actual, expected) {
  try {
    const actualJson = JSON.stringify(actual);
    const expectedJson = JSON.stringify(expected);
    return actualJson !== undefined && actualJson === expectedJson;
  } catch {
    return false;
  }
}

export function executeChallengeTests(challengeId, code) {
  if (!Number.isInteger(challengeId) || !functionNames[challengeId]) {
    return failure('This challenge is not supported by the interactive runner.');
  }
  if (typeof code !== 'string') return failure('Enter JavaScript source code first.');
  if (code.length > MAX_CODE_LENGTH) {
    return failure(`Code is too long. Keep submissions under ${MAX_CODE_LENGTH.toLocaleString()} characters.`);
  }
  if (!code.trim()) return failure('Write a solution before running tests.');

  const fnName = functionNames[challengeId];
  let fn;
  try {
    // This module is imported by a dedicated Worker. Never execute submitted code
    // in the page's main JavaScript realm.
    const factory = new Function(`"use strict";\n${code}\n; return typeof ${fnName} === 'function' ? ${fnName} : null;`);
    fn = factory();
  } catch (error) {
    return failure('Syntax error: ' + String(error?.message || 'Could not parse submitted code.'));
  }

  if (typeof fn !== 'function') return failure(`Define ${fnName} before running tests.`);

  return casesById[challengeId].map((test) => {
    const expected = test[test.length - 1];
    const args = test.slice(0, -1);
    try {
      const actual = fn(...args);
      const pass = sameValue(actual, expected);
      let actualText = '[unserializable result]';
      try {
        actualText = JSON.stringify(actual);
        if (actualText === undefined) actualText = 'undefined';
        if (actualText.length > 240) actualText = actualText.slice(0, 237) + '...';
      } catch { /* Report a bounded result label rather than crashing the runner. */ }
      let expectedText = JSON.stringify(expected);
      if (expectedText === undefined) expectedText = 'undefined';
      return {
        pass,
        message: pass ? 'Passed' : `Expected ${expectedText}, received ${actualText}`,
      };
    } catch (error) {
      return { pass: false, message: 'Runtime error: ' + String(error?.message || 'The solution threw an error.') };
    }
  });
}

export { MAX_CODE_LENGTH };
