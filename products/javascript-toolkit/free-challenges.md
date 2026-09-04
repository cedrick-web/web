# DevSprint Free Pack

## 10 JavaScript Problem-Solving Challenges

**Goal:** Practice the full DevSprint loop: Understand → Break down → Algorithm → Pseudocode → Implement → Test → Debug → Analyze.

Do not look at the solution first. Human beings have somehow survived thousands of years without immediately scrolling to the answer. Try the problem.

---

## Challenge 01: Find the Largest Number

**Difficulty:** 1/5  
**Skill:** Arrays, iteration, comparison

Write `findLargest(numbers)` that returns the largest number in a non-empty array without using `Math.max()` or sorting.

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
    if (numbers[i] > largest) {
      largest = numbers[i];
    }
  }

  return largest;
}
```

**Tests:** `[5] → 5`, `[-8, -3, -15] → -3`, `[4, 4, 4] → 4`  
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
    if (number % 2 === 0) {
      count++;
    }
  }

  return count;
}
```

**Tests:** `[] → 0`, `[1, 3, 5] → 0`, `[2, 4, 6] → 3`  
**Complexity:** Time `O(n)`, Space `O(1)`.

---

## Challenge 03: Reverse a String

**Difficulty:** 1/5  
**Skill:** Strings, iteration

Write `reverseString(text)` without using `.reverse()`.

**Example:** `"hello"` → `"olleh"`

**Hint:** Build the result from the end of the string toward the beginning.

### Pseudocode
1. Start with an empty result.
2. Loop from the last character to the first.
3. Add each character to the result.
4. Return the result.

### Solution
```js
function reverseString(text) {
  let result = "";

  for (let i = text.length - 1; i >= 0; i--) {
    result += text[i];
  }

  return result;
}
```

**Tests:** `"" → ""`, `"a" → "a"`, `"DevSprint" → "tnirpS veD"`  
**Complexity:** Time `O(n)`, Space `O(n)` for the returned string.

---

## Challenge 04: Sum Positive Numbers

**Difficulty:** 1/5  
**Skill:** Accumulators, conditions

Write `sumPositive(numbers)` that returns the sum of only positive numbers.

**Example:** `[-2, 5, 7, -1, 3]` → `15`

**Hint:** Start at zero. Add a value only when it is greater than zero.

### Solution
```js
function sumPositive(numbers) {
  let sum = 0;

  for (const number of numbers) {
    if (number > 0) {
      sum += number;
    }
  }

  return sum;
}
```

**Tests:** `[] → 0`, `[-4, -2] → 0`, `[5, 10] → 15`  
**Complexity:** Time `O(n)`, Space `O(1)`.

---

## Challenge 05: Find the First Matching Value

**Difficulty:** 2/5  
**Skill:** Linear search, early exit

Write `findIndex(numbers, target)` that returns the index of the first occurrence of `target`, or `-1` when it does not exist. Do not use `.indexOf()`.

**Example:** `findIndex([4, 8, 2, 8], 8)` → `1`

**Hint:** Return immediately when you find the target.

### Pseudocode
1. Loop through every index.
2. Compare the current value with the target.
3. Return the index when they match.
4. Return `-1` after the loop.

### Solution
```js
function findIndex(numbers, target) {
  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] === target) {
      return i;
    }
  }

  return -1;
}
```

**Tests:** target at beginning, middle, end, and absent.  
**Complexity:** Time `O(n)`, Space `O(1)`.

---

## Challenge 06: Remove Duplicates

**Difficulty:** 2/5  
**Skill:** Sets, arrays, uniqueness

Write `removeDuplicates(numbers)` that returns a new array containing each value once while preserving its first-seen order.

**Example:** `[3, 1, 3, 2, 1, 4]` → `[3, 1, 2, 4]`

**Hint:** JavaScript's `Set` is designed to store unique values.

### Solution
```js
function removeDuplicates(numbers) {
  return [...new Set(numbers)];
}
```

**Tests:** `[] → []`, `[1, 1, 1] → [1]`, `[2, 3, 2, 4] → [2, 3, 4]`  
**Complexity:** Average time `O(n)`, Space `O(n)`.

**Think:** Could you solve this without `Set`? That is the extension challenge.

---

## Challenge 07: Check for a Palindrome

**Difficulty:** 2/5  
**Skill:** Strings, two pointers

Write `isPalindrome(text)` that returns `true` when the string reads the same forward and backward. Treat uppercase and lowercase as equivalent.

**Example:** `"Level"` → `true`; `"coding"` → `false`

**Hint:** Normalize the text, then compare characters from both ends.

### Solution
```js
function isPalindrome(text) {
  const value = text.toLowerCase();
  let left = 0;
  let right = value.length - 1;

  while (left < right) {
    if (value[left] !== value[right]) {
      return false;
    }

    left++;
    right--;
  }

  return true;
}
```

**Tests:** `"a" → true`, `"abba" → true`, `"abca" → false`  
**Complexity:** Time `O(n)`, Space `O(n)` because of normalization.

---

## Challenge 08: Find the Second Largest Distinct Number

**Difficulty:** 3/5  
**Skill:** Tracking multiple values, edge cases

Write `secondLargest(numbers)` that returns the second-largest **distinct** number. Return `null` if fewer than two distinct values exist.

**Example:** `[10, 4, 8, 10, 6]` → `8`

**Hint:** Track the largest and second-largest values while scanning once.

### Solution
```js
function secondLargest(numbers) {
  let largest = null;
  let second = null;

  for (const number of numbers) {
    if (largest === null || number > largest) {
      if (largest !== number) {
        second = largest;
      }
      largest = number;
    } else if (number !== largest && (second === null || number > second)) {
      second = number;
    }
  }

  return second;
}
```

**Tests:** `[5] → null`, `[5, 5] → null`, `[5, 3, 4] → 4`, `[-1, -4, -2] → -2`  
**Complexity:** Time `O(n)`, Space `O(1)`.

---

## Challenge 09: Check Balanced Parentheses

**Difficulty:** 3/5  
**Skill:** Stack, data structures

Write `isBalanced(text)` that checks whether `(` and `)` are correctly paired and nested.

**Examples:** `"(()())" → true`, `"(()" → false`, `")(" → false`

**Hint:** Every opening parenthesis must be remembered until its matching closing parenthesis appears. That is exactly the job of a stack.

### Solution
```js
function isBalanced(text) {
  const stack = [];

  for (const char of text) {
    if (char === "(") {
      stack.push(char);
    } else if (char === ")") {
      if (stack.length === 0) {
        return false;
      }
      stack.pop();
    }
  }

  return stack.length === 0;
}
```

**Tests:** `"" → true`, `"()" → true`, `"((()))" → true`, `"(()))" → false`  
**Complexity:** Time `O(n)`, Space `O(n)`.

**Extension:** Support `[]` and `{}` too.

---

## Challenge 10: Find Two Numbers That Add to a Target

**Difficulty:** 3/5  
**Skill:** Hash maps, algorithm design

Write `twoSum(numbers, target)` that returns the indexes of two different values whose sum equals `target`. Return `null` if no pair exists.

**Example:** `twoSum([2, 7, 11, 15], 9)` → `[0, 1]`

**Hint:** For each number, ask: “What value do I need to reach the target?” Store previously seen values in a `Map`.

### Pseudocode
1. Create an empty map of value → index.
2. For each number, calculate `needed = target - number`.
3. If `needed` is already in the map, return its index and the current index.
4. Otherwise store the current number and index.
5. Return `null` if no pair exists.

### Solution
```js
function twoSum(numbers, target) {
  const seen = new Map();

  for (let i = 0; i < numbers.length; i++) {
    const needed = target - numbers[i];

    if (seen.has(needed)) {
      return [seen.get(needed), i];
    }

    seen.set(numbers[i], i);
  }

  return null;
}
```

**Tests:** `[2, 7, 11, 15], 9 → [0, 1]`, `[3, 3], 6 → [0, 1]`, `[1, 2], 8 → null`  
**Complexity:** Average time `O(n)`, Space `O(n)`.

---

# Final Self-Assessment

Score yourself honestly:

- **0–3 solved independently:** Focus on the DevSprint thinking loop before increasing difficulty.
- **4–6:** Your basic problem-solving foundation is forming. Repeat the failed problems without looking at solutions.
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

**Next step:** use these ten challenges as the free entry product, then move learners into the full 60-problem JavaScript Problem-Solving & DSA Toolkit.