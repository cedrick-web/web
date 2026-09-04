# Module 1: Think Like a Programmer

## Mission

Stop jumping from a problem statement straight into JavaScript.

The skill this module builds is **turning an unfamiliar problem into a small, testable plan before writing code**.

## Learning outcomes

By the end of this module, you can:

- separate input, process, and output;
- decompose a large problem into smaller tasks;
- describe an algorithm without JavaScript syntax;
- write useful pseudocode;
- choose a first solution deliberately;
- identify edge cases before they become bugs;
- test a solution against expected behavior;
- explain why a solution is correct at a beginner level.

---

## Lesson 1: Input → Process → Output

Every programming problem can be reduced to three questions:

1. **What do I receive?** Input.
2. **What must I do with it?** Process.
3. **What must I return or display?** Output.

### Example

Problem: Find the largest number in an array.

- Input: an array of numbers.
- Process: inspect the numbers and keep track of the largest value seen.
- Output: one number, the largest value.

### Practice

For each problem, identify input, process, and output before writing code:

1. Count how many numbers are even.
2. Reverse a string.
3. Find whether a target number exists in an array.

**Rule:** If you cannot clearly state the input and output, you are not ready to code. Your keyboard is not a thinking device, despite humanity's persistent attempts to use it as one.

---

## Lesson 2: Decomposition

Decomposition means splitting a problem into smaller tasks that can be solved and tested separately.

### Example: Student performance analyzer

Instead of "build a student analyzer," decompose it:

1. Store student records.
2. Calculate the average.
3. Find the highest score.
4. Find the lowest score.
5. Search for a student.
6. Determine pass/fail status.
7. Sort students by score.
8. Produce a ranking.
9. Test each operation.

This turns an intimidating project into a sequence of manageable problems.

### Exercise

Decompose this problem into at least five tasks:

> Build a function that receives a list of products and returns the three cheapest products that are in stock.

Suggested decomposition:

- define the product fields;
- remove unavailable products;
- compare prices;
- select the cheapest three;
- handle fewer than three available products;
- test duplicates and empty input.

---

## Lesson 3: Algorithms

An algorithm is a finite sequence of steps that transforms input into the required output.

An algorithm is **not** the same thing as JavaScript code.

Example goal: find the largest number.

### Algorithm

1. Start with the first number as the current largest.
2. Inspect each remaining number.
3. If the current number is larger, replace the current largest.
4. After the scan, return the current largest.

Notice that this can be understood without knowing a single JavaScript keyword.

---

## Lesson 4: Pseudocode

Pseudocode is a plain-language description of an algorithm that is structured enough to translate into code.

### Example

```text
FUNCTION findLargest(numbers)
    largest = first number

    FOR each remaining number
        IF number is greater than largest
            largest = number

    RETURN largest
```

Good pseudocode explains **logic**, not decoration.

Bad pseudocode simply rewrites JavaScript with English words.

---

## Lesson 5: The DevSprint Problem-Solving Loop

Use this loop for every serious challenge:

```text
Understand
   ↓
Input / Output
   ↓
Break Down
   ↓
Think of approaches
   ↓
Choose an algorithm
   ↓
Pseudocode
   ↓
Implement
   ↓
Test
   ↓
Debug
   ↓
Analyze complexity
   ↓
Improve if necessary
```

### The anti-rush rule

Do not start implementation immediately after reading a problem.

Spend the first few minutes answering:

- What exactly is being asked?
- What does the input look like?
- What should the output look like?
- What assumptions are safe?
- What could make the solution fail?
- What is the simplest correct approach?

Correct first. Fast second.

---

# Guided Challenge 1: Find the Largest Number

**ID:** DSP-001  
**Difficulty:** 1/5  
**Skills:** loops, comparison, variables, decomposition

## Problem

Write a function that receives a non-empty array of numbers and returns the largest number.

## Input

An array of numbers.

## Output

The largest number in the array.

## Constraints

- The array contains at least one number.
- Numbers may be positive, zero, or negative.
- Duplicate values are allowed.

## Examples

```text
[8, 3, 15, 6, 10] → 15
[5] → 5
[-8, -2, -10] → -2
[7, 7, 3] → 7
```

## Think first

What should the algorithm remember while it scans the array?

### Hint 1

You need one variable representing the largest value seen so far.

### Hint 2

Initialize it with the first element, then compare every remaining element against it.

## Pseudocode

```text
FUNCTION findLargest(numbers)
    largest = first element

    FOR each element after the first
        IF element > largest
            largest = element

    RETURN largest
```

## JavaScript solution

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

## Tests

```js
console.assert(findLargest([8, 3, 15, 6, 10]) === 15);
console.assert(findLargest([5]) === 5);
console.assert(findLargest([-8, -2, -10]) === -2);
console.assert(findLargest([7, 7, 3]) === 7);
```

## Complexity

- Time: **O(n)** because every element is inspected once.
- Space: **O(1)** because only one tracking variable is required.

## Extension

Return both the largest number and its index.

---

# Guided Challenge 2: Count Even Numbers

**ID:** DSP-002  
**Difficulty:** 1/5  
**Skills:** loops, modulo, counters

## Problem

Return how many numbers in an array are even.

## Examples

```text
[1, 2, 3, 4, 6] → 3
[1, 3, 5] → 0
[] → 0
[-4, -3, 0, 7] → 2
```

## Algorithm

1. Start a counter at zero.
2. Inspect each number.
3. If `number % 2 === 0`, increase the counter.
4. Return the counter.

## Pseudocode

```text
FUNCTION countEven(numbers)
    count = 0

    FOR each number
        IF number is divisible by 2
            count = count + 1

    RETURN count
```

## JavaScript solution

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

## Tests

```js
console.assert(countEven([1, 2, 3, 4, 6]) === 3);
console.assert(countEven([1, 3, 5]) === 0);
console.assert(countEven([]) === 0);
console.assert(countEven([-4, -3, 0, 7]) === 2);
```

## Complexity

- Time: **O(n)**
- Space: **O(1)**

## Extension

Return the even numbers themselves instead of their count.

---

# Guided Challenge 3: Reverse a String

**ID:** DSP-003  
**Difficulty:** 1/5  
**Skills:** strings, loops, indexing

## Problem

Return a new string containing the characters of the input in reverse order.

## Examples

```text
"hello" → "olleh"
"Rwanda" → "adnawR"
"a" → "a"
"" → ""
```

## Think first

If you visit characters from the end toward the beginning, what should you append to the result?

## Pseudocode

```text
FUNCTION reverseString(text)
    result = empty string

    FOR index from last character down to first character
        append text[index] to result

    RETURN result
```

## JavaScript solution

```js
function reverseString(text) {
  let result = "";

  for (let i = text.length - 1; i >= 0; i--) {
    result += text[i];
  }

  return result;
}
```

## Tests

```js
console.assert(reverseString("hello") === "olleh");
console.assert(reverseString("Rwanda") === "adnawR");
console.assert(reverseString("a") === "a");
console.assert(reverseString("") === "");
```

## Complexity

- Time: **O(n)** because each character is processed once.
- Space: **O(n)** for the resulting string.

## Extension

Determine whether a string is a palindrome using the same reasoning.

---

# Guided Challenge 4: Find a Target

**ID:** DSP-004  
**Difficulty:** 1/5  
**Skills:** linear search, equality, early return

## Problem

Return `true` if a target number exists in an array. Otherwise return `false`.

## Examples

```text
[4, 8, 2, 9], 2 → true
[4, 8, 2, 9], 7 → false
[], 3 → false
```

## Pseudocode

```text
FUNCTION contains(numbers, target)
    FOR each number
        IF number equals target
            RETURN true

    RETURN false
```

## JavaScript solution

```js
function contains(numbers, target) {
  for (const number of numbers) {
    if (number === target) {
      return true;
    }
  }

  return false;
}
```

## Tests

```js
console.assert(contains([4, 8, 2, 9], 2) === true);
console.assert(contains([4, 8, 2, 9], 7) === false);
console.assert(contains([], 3) === false);
console.assert(contains([-2, 0, 5], -2) === true);
```

## Complexity

- Time: **O(n)** worst case.
- Space: **O(1)**.

## Extension

Return the index of the first matching target, or `-1` when it is absent.

---

# Guided Challenge 5: Sum Positive Numbers

**ID:** DSP-005  
**Difficulty:** 1/5  
**Skills:** accumulation, conditionals, loops

## Problem

Return the sum of all positive numbers in an array. Ignore zero and negative values.

## Examples

```text
[4, -2, 7, 0, -5] → 11
[-3, -1] → 0
[5] → 5
[] → 0
```

## Pseudocode

```text
FUNCTION sumPositive(numbers)
    total = 0

    FOR each number
        IF number > 0
            total = total + number

    RETURN total
```

## JavaScript solution

```js
function sumPositive(numbers) {
  let total = 0;

  for (const number of numbers) {
    if (number > 0) {
      total += number;
    }
  }

  return total;
}
```

## Tests

```js
console.assert(sumPositive([4, -2, 7, 0, -5]) === 11);
console.assert(sumPositive([-3, -1]) === 0);
console.assert(sumPositive([5]) === 5);
console.assert(sumPositive([]) === 0);
```

## Complexity

- Time: **O(n)**
- Space: **O(1)**

## Extension

Return both the positive-number sum and the number of positive values.

---

# Independent Challenge: First Duplicate

**ID:** DSP-006  
**Difficulty:** 2/5  
**Skills:** decomposition, Set, early return, edge cases

## Problem

Return the first number that appears more than once when scanning from left to right. If there is no duplicate, return `null`.

## Examples

```text
[4, 2, 7, 2, 9] → 2
[1, 3, 5] → null
[5, 5, 2] → 5
[] → null
```

## Hint

A `Set` can remember which values have already appeared.

## Pseudocode

```text
FUNCTION firstDuplicate(numbers)
    seen = empty set

    FOR each number
        IF seen contains number
            RETURN number
        ADD number to seen

    RETURN null
```

## Reference solution

```js
function firstDuplicate(numbers) {
  const seen = new Set();

  for (const number of numbers) {
    if (seen.has(number)) {
      return number;
    }

    seen.add(number);
  }

  return null;
}
```

## Tests

```js
console.assert(firstDuplicate([4, 2, 7, 2, 9]) === 2);
console.assert(firstDuplicate([1, 3, 5]) === null);
console.assert(firstDuplicate([5, 5, 2]) === 5);
console.assert(firstDuplicate([]) === null);
```

## Complexity

- Time: **O(n)** average.
- Space: **O(n)** in the worst case.

---

# Debugging Lab: Off-by-One Error

Consider this broken function:

```js
function sum(numbers) {
  let total = 0;

  for (let i = 0; i <= numbers.length; i++) {
    total += numbers[i];
  }

  return total;
}
```

## Task

Explain why this produces an invalid result and fix it.

### Diagnosis

The final valid index is `numbers.length - 1`. When `i` becomes `numbers.length`, `numbers[i]` is `undefined`.

Adding `undefined` to a number produces `NaN`.

### Fixed solution

```js
function sum(numbers) {
  let total = 0;

  for (let i = 0; i < numbers.length; i++) {
    total += numbers[i];
  }

  return total;
}
```

### Regression tests

```js
console.assert(sum([1, 2, 3]) === 6);
console.assert(sum([]) === 0);
console.assert(sum([-2, 5]) === 3);
```

---

# Module Assessment

Complete these without looking at the reference solutions.

### Assessment A

Write `countPositive(numbers)` that returns the number of positive values.

### Assessment B

Write `findSmallest(numbers)` for a non-empty array.

### Assessment C

Write `containsIgnoreCase(words, target)` that returns whether a word exists, ignoring letter case.

### Assessment D

Write `lastIndexOfValue(numbers, target)` without using the built-in `lastIndexOf` method.

### Assessment E

Explain the difference between an **algorithm** and an **implementation** in three sentences or fewer.

## Assessment rubric

| Skill | Points |
|---|---:|
| Correct input/output interpretation | 2 |
| Algorithm design | 2 |
| Correct implementation | 2 |
| Edge-case handling | 2 |
| Tests and explanation | 2 |
| **Total** | **10** |

### Mastery target

- **9–10:** Ready for Module 2.
- **7–8:** Review weak areas and retry failed problems.
- **0–6:** Repeat the guided challenges before moving on.

---

# Revision Checklist

Before leaving Module 1, you should be able to say:

- [ ] I can identify input, process, and output.
- [ ] I can break a large task into smaller problems.
- [ ] I can describe an algorithm without code.
- [ ] I can write readable pseudocode.
- [ ] I can identify common edge cases.
- [ ] I test normal cases and boundary cases.
- [ ] I can read a failing loop and find an off-by-one error.
- [ ] I can explain why a simple solution is correct.
- [ ] I know that coding speed is not a substitute for understanding the problem.

## Completion rule

Do not mark the module complete because you read it.

Mark it complete when you can solve the assessment independently and explain your reasoning.
