# DevSprint Free Pack

## 10 JavaScript Problem-Solving Challenges

**Goal:** Practice the full DevSprint loop: Understand → Break down → Algorithm → Pseudocode → Implement → Test → Debug → Analyze.

Do not look at the solution first. Try the problem before scrolling to the answer.

---

## Challenge 01: Find the Largest Number

**Difficulty:** 1/5  
**Skill:** Arrays, iteration, comparison

Write `findLargest(numbers)` that returns the largest number in a non-empty array without sorting.

**Example:** `[8, 3, 15, 6, 10]` → `15`

**Hint:** Keep one value as the current largest and compare every remaining value against it.

### Pseudocode
1. Set `largest` to the first number.
2. Loop from the second number to the end.
3. If the current number is greater than `largest`, replace `largest`.
4. Return `largest`.

### Solution
```js
function findLargest(numbers) {
  let largest = numbers[0];

  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] > largest) largest = numbers[i];
  }

  return largest;
}
```

**Tests:** `[5] → 5`, `[-4, -9, -2] → -2`, `[0, -1, -3] → 0`  
**Complexity:** Time `O(n)`, Space `O(1)`.

---

## Challenge 02: Count Even Numbers

**Difficulty:** 1/5  
**Skill:** Arrays, conditionals, modulo

Write `countEven(numbers)` that returns how many values are even.

**Example:** `[2, 7, 4, 9, 10]` → `3`

**Hint:** A number is even when `number % 2 === 0`.

### Pseudocode
1. Start a counter at zero.
2. Visit every number.
3. If it is even, increase the counter.
4. Return the counter.

### Solution
```js
function countEven(numbers) {
  let count = 0;

  for (const number of numbers) {
    if (number % 2 === 0) count++;
  }

  return count;
}
```

**Tests:** `[] → 0`, `[1, 3, 5] → 0`, `[-4, -3, 0, 2] → 3`  
**Complexity:** Time `O(n)`, Space `O(1)`.

---

## Challenge 03: Reverse a String

**Difficulty:** 1/5  
**Skill:** Strings, iteration

Write `reverseString(text)` without using `.reverse()`.

**Example:** `"devsprint"` → `"tnirpsved"`

**Hint:** Build the result from the end of the string toward the beginning.

### Pseudocode
1. Start with an empty result.
2. Loop from the last character to the first.
3. Add each character to the result.
4. Return the result.

### Solution
```js
function reverseString(text) {
  let result = '';

  for (let i = text.length - 1; i >= 0; i--) {
    result += text[i];
  }

  return result;
}
```

**Tests:** `"" → ""`, `"a" → "a"`, `"DevSprint" → "tnirpSveD"`  
**Complexity:** Time `O(n)`, Space `O(n)`.

---

## Challenge 04: Sum Positive Numbers

**Difficulty:** 2/5  
**Skill:** Arrays, conditions, accumulators

Write `sumPositive(numbers)` that returns the sum of only positive numbers.

**Example:** `[-2, 5, 7, -1, 3]` → `15`

**Hint:** Start at zero. Add a value only when it is greater than zero.

### Solution
```js
function sumPositive(numbers) {
  let total = 0;

  for (const number of numbers) {
    if (number > 0) total += number;
  }

  return total;
}
```

**Tests:** `[-2, 5, 7, -1, 3] → 15`, `[-4, 0] → 0`, `[1, -1, 0, 3] → 4`  
**Complexity:** Time `O(n)`, Space `O(1)`.

---

## Challenge 05: Find First Matching Value

**Difficulty:** 2/5  
**Skill:** Linear search, early exit

Write `findFirst(numbers, target)` that returns the index of the first occurrence of `target`, or `-1` when it does not exist. Do not use `.indexOf()`.

**Example:** `findFirst([4, 8, 2, 8], 8)` → `1`

**Hint:** Return immediately when you find the target.

### Pseudocode
1. Loop through every index.
2. Compare the current value with the target.
3. Return the index when they match.
4. Return `-1` after the loop.

### Solution
```js
function findFirst(numbers, target) {
  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] === target) return i;
  }

  return -1;
}
```

**Tests:** `[4, 8, 2, 8], 8 → 1`, `[1, 2, 3], 9 → -1`, `[7, 2, 7], 7 → 0`, `[], 1 → -1`  
**Complexity:** Time `O(n)`, Space `O(1)`.

---

## Challenge 06: Remove Duplicates

**Difficulty:** 3/5  
**Skill:** Arrays, Set, uniqueness

Write `removeDuplicates(numbers)` that returns a new array containing each value once while preserving first-seen order.

**Example:** `[3, 3, 1, 2, 1]` → `[3, 1, 2]`

**Hint:** A `Set` can remember which values have already appeared.

### Pseudocode
1. Create an empty `Set` and result array.
2. Visit each value.
3. If the `Set` does not contain it, add it to both.
4. Return result.

### Solution
```js
function removeDuplicates(numbers) {
  const seen = new Set();
  const result = [];

  for (const number of numbers) {
    if (!seen.has(number)) {
      seen.add(number);
      result.push(number);
    }
  }

  return result;
}
```

**Tests:** `[] → []`, `[5, 5, 5] → [5]`, `[2, 3, 2, 4] → [2, 3, 4]`  
**Complexity:** Average time `O(n)`, Space `O(n)`.

**Extension:** Solve it without `Set` and compare the complexity and readability.

---

## Challenge 07: Check Palindrome

**Difficulty:** 3/5  
**Skill:** Strings, two pointers

Write `isPalindrome(text)` that returns `true` when the string reads the same forward and backward. Treat uppercase and lowercase as equivalent.

**Example:** `"Level"` → `true`

**Hint:** Normalize the text, then compare characters from both ends.

### Pseudocode
1. Normalize the string.
2. Set `left` at the beginning and `right` at the end.
3. Compare both characters.
4. Move inward until they meet.
5. Return `true` if no mismatch is found.

### Solution
```js
function isPalindrome(text) {
  const value = text.toLowerCase();
  let left = 0;
  let right = value.length - 1;

  while (left < right) {
    if (value[left] !== value[right]) return false;
    left++;
    right--;
  }

  return true;
}
```

**Tests:** `"Level" → true`, `"hello" → false`, `"" → true`, `"RaceCar" → true`  
**Complexity:** Time `O(n)`, Space `O(n)` for normalized text.

---

## Challenge 08: Second Largest Distinct Number

**Difficulty:** 3/5  
**Skill:** Arrays, state tracking, edge cases

Write `secondLargest(numbers)` that returns the second-largest **distinct** number. Return `null` if fewer than two distinct values exist.

**Example:** `[10, 4, 10, 7, 8]` → `8`

**Hint:** Track the largest and second-largest distinct values while scanning once. Do not use sorting.

### Pseudocode
1. Start `largest` and `second` as empty.
2. Visit each number.
3. Ignore a number equal to `largest`.
4. Update `largest` and `second` when appropriate.
5. Return `second`, or `null` when it does not exist.

### Solution
```js
function secondLargest(numbers) {
  let largest;
  let second;

  for (const number of numbers) {
    if (number === largest) continue;

    if (largest === undefined || number > largest) {
      second = largest;
      largest = number;
    } else if (second === undefined || number > second) {
      second = number;
    }
  }

  return second === undefined ? null : second;
}
```

**Tests:** `[10, 4, 10, 7, 8] → 8`, `[5, 5] → null`, `[-2, -8, -4] → -4`, `[0, -1] → -1`, `[0, 0, -2] → -2`, `[] → null`  
**Complexity:** Time `O(n)`, Space `O(1)`.

---

## Challenge 09: Balanced Parentheses

**Difficulty:** 3/5  
**Skill:** Stack, data structures

Write `isBalanced(text)` that checks whether `(` and `)` are correctly paired and nested.

**Examples:** `"(()())" → true`, `"(()"` → false`, `")("` → false`

**Hint:** Every opening parenthesis must be remembered until its matching closing parenthesis appears. That is exactly what a stack is for.

### Pseudocode
1. Create an empty stack.
2. Push every opening parenthesis.
3. For a closing parenthesis, reject if the stack is empty; otherwise pop.
4. Accept only when the stack is empty at the end.

### Solution
```js
function isBalanced(text) {
  const stack = [];

  for (const char of text) {
    if (char === '(') stack.push(char);
    else if (char === ')') {
      if (stack.length === 0) return false;
      stack.pop();
    }
  }

  return stack.length === 0;
}
```

**Tests:** `"" → true`, `"()" → true`, `"((()))" → true`, `"(()" → false`, `"())(" → false`  
**Complexity:** Time `O(n)`, Space `O(n)`.

**Extension:** Support `[]` and `{}` too.

---

## Challenge 10: Two Sum

**Difficulty:** 3/5  
**Skill:** Hash map, algorithm design

Write `twoSum(numbers, target)` that returns the indexes of two different values whose sum equals `target`. Return `[]` if no pair exists.

**Example:** `twoSum([2, 7, 11, 15], 9)` → `[0, 1]`

**Hint:** For each number, ask: “What value do I need to reach the target?” Store previously seen values in a `Map`.

### Pseudocode
1. Create an empty map of value → index.
2. For each number, calculate `needed = target - number`.
3. If `needed` is already in the map, return its index and the current index.
4. Otherwise store the current number and index.
5. Return `[]` if no pair exists.

### Solution
```js
function twoSum(numbers, target) {
  const seen = new Map();

  for (let i = 0; i < numbers.length; i++) {
    const needed = target - numbers[i];

    if (seen.has(needed)) return [seen.get(needed), i];
    seen.set(numbers[i], i);
  }

  return [];
}
```

**Tests:** `[2, 7, 11, 15], 9 → [0, 1]`, `[3, 2, 4], 6 → [1, 2]`, `[3, 3], 6 → [0, 1]`, `[1, 5], 10 → []`, `[-3, 4, 2, 7], 1 → [0, 1]`  
**Complexity:** Average time `O(n)`, Space `O(n)`.

---

# Final Self-Assessment

Score yourself honestly:

- **0–3 solved independently:** Focus on the DevSprint thinking loop before increasing difficulty.
- **4–6:** Your basic problem-solving foundation is forming. Repeat failed problems without looking at solutions.
- **7–8:** You are ready for more data-structure and complexity work.
- **9–10:** Move into the paid toolkit's deeper problem sets and timed assessments.

## Rules for Using This Pack

1. Spend at least 10 minutes thinking before opening a solution.
2. Write the input and output in your own words.
3. Write pseudocode before JavaScript for challenges 5–10.
4. Test normal cases and edge cases.
5. Explain your time and space complexity in one sentence.
6. If you copy a solution, mark the challenge as **not yet mastered**.
7. Re-solve missed challenges 24–48 hours later without notes.

**Next step:** Use these ten challenges as the free entry product, then move learners into the full 60-problem JavaScript Problem-Solving & DSA Toolkit.
