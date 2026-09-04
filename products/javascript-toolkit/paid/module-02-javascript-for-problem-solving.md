# Module 2: JavaScript for Problem Solving

## Mission

Use JavaScript as a tool for expressing algorithms clearly. The goal is not to memorize every language feature. The goal is to choose simple language features that make your reasoning executable.

## Learning outcomes

By the end of this module, you can:

- choose functions and variables that make a solution understandable;
- traverse arrays safely;
- use objects, `Map`, and `Set` for different problem types;
- distinguish mutation from creating a new result;
- use early returns to simplify control flow;
- recognize common JavaScript mistakes in algorithmic code;
- write tests around small functions.

---

## Lesson 1: Functions as Problem Boundaries

A function should usually represent one clear job.

```js
function countPositive(numbers) {
  let count = 0;

  for (const number of numbers) {
    if (number > 0) count++;
  }

  return count;
}
```

The function has one responsibility: count positive numbers.

### Rule

If a function is doing five unrelated jobs, split it. Complexity is not proof of intelligence. Sometimes it is just five functions trapped in a trench coat.

---

## Lesson 2: Variables Should Describe State

Good algorithmic variables describe what they currently mean.

Prefer:

```js
let largest = numbers[0];
let count = 0;
let total = 0;
```

over:

```js
let x = numbers[0];
let a = 0;
let temp = 0;
```

A future debugging session should not require archaeology.

---

## Lesson 3: Array Traversal

Three common approaches are:

### `for...of`

Useful when you need values.

```js
for (const number of numbers) {
  console.log(number);
}
```

### Indexed `for`

Useful when you need positions.

```js
for (let i = 0; i < numbers.length; i++) {
  console.log(i, numbers[i]);
}
```

### Array methods

Useful when the transformation is naturally expressed as an operation.

```js
const doubled = numbers.map(number => number * 2);
const positives = numbers.filter(number => number > 0);
```

For learning algorithms, understand the loop underneath the abstraction. You need to know what work is actually happening.

---

## Lesson 4: Objects, Map, and Set

### Object

Good for simple key/value records.

```js
const student = {
  name: "Aline",
  score: 78
};
```

### Set

Good when you care whether a value has appeared and uniqueness matters.

```js
const seen = new Set();
seen.add("A");
seen.has("A");
```

### Map

Good for key/value associations where explicit map operations are useful.

```js
const scores = new Map();
scores.set("Aline", 78);
scores.get("Aline");
```

### Decision rule

Ask what information you need to remember:

- unique values → `Set`
- key/value lookup → `Map`
- simple record with named fields → object

---

## Lesson 5: Mutation vs New Results

Mutation changes an existing value.

```js
numbers[0] = 100;
```

Creating a new result leaves the original untouched.

```js
const doubled = numbers.map(number => number * 2);
```

Neither approach is automatically correct. Choose deliberately.

When a challenge does not require mutation, producing a new result can make reasoning and testing easier.

---

## Lesson 6: Control Flow and Early Returns

Early returns can remove unnecessary nesting.

Instead of:

```js
function contains(numbers, target) {
  let found = false;

  for (const number of numbers) {
    if (number === target) {
      found = true;
    }
  }

  return found;
}
```

You can stop as soon as the answer is known:

```js
function contains(numbers, target) {
  for (const number of numbers) {
    if (number === target) return true;
  }

  return false;
}
```

This is both simpler and potentially faster because the scan can stop early.

---

## Lesson 7: Defensive Thinking

Before coding, identify assumptions.

Ask:

- Can the array be empty?
- Can values be negative?
- Can values repeat?
- Is capitalization important?
- Is order important?
- Can the input contain invalid values?

Do not invent requirements that do not exist, but do not silently assume away obvious edge cases either.

---

# Guided Challenge 7: Count Frequencies

**ID:** DSP-007  
**Difficulty:** 2/5  
**Skills:** object/Map thinking, counting, traversal

## Problem

Return an object containing the number of times each number appears.

```text
[2, 1, 2, 3, 1, 2]
→ { 1: 2, 2: 3, 3: 1 }
```

## Pseudocode

```text
FUNCTION countFrequencies(numbers)
    frequencies = empty map

    FOR each number
        IF number is not in frequencies
            frequencies[number] = 0
        increase frequencies[number]

    RETURN frequencies
```

## JavaScript solution

```js
function countFrequencies(numbers) {
  const frequencies = {};

  for (const number of numbers) {
    frequencies[number] = (frequencies[number] ?? 0) + 1;
  }

  return frequencies;
}
```

## Tests

```js
console.assert(JSON.stringify(countFrequencies([2, 1, 2, 3, 1, 2])) === '{"1":2,"2":3,"3":1}');
console.assert(JSON.stringify(countFrequencies([])) === '{}');
console.assert(JSON.stringify(countFrequencies([5, 5, 5])) === '{"5":3}');
```

## Complexity

- Time: **O(n)** average.
- Space: **O(k)** where `k` is the number of distinct values.

---

# Guided Challenge 8: Remove Duplicates

**ID:** DSP-008  
**Difficulty:** 2/5  
**Skills:** Set, uniqueness, arrays

## Problem

Return a new array containing each value only once, preserving the first-seen order.

## Examples

```text
[4, 2, 4, 1, 2] → [4, 2, 1]
[] → []
[7, 7, 7] → [7]
```

## JavaScript solution

```js
function removeDuplicates(numbers) {
  return [...new Set(numbers)];
}
```

## Tests

```js
console.assert(JSON.stringify(removeDuplicates([4, 2, 4, 1, 2])) === '[4,2,1]');
console.assert(JSON.stringify(removeDuplicates([])) === '[]');
console.assert(JSON.stringify(removeDuplicates([7, 7, 7])) === '[7]');
```

## Complexity

- Time: **O(n)** average.
- Space: **O(n)** worst case.

---

# Guided Challenge 9: First Non-Repeating Character

**ID:** DSP-009  
**Difficulty:** 3/5  
**Skills:** frequency counting, two-pass reasoning, strings

## Problem

Return the first character that occurs exactly once. Return `null` when every character repeats.

## Examples

```text
"swiss" → "w"
"aabb" → null
"abcd" → "a"
"" → null
```

## Strategy

Use two passes:

1. Count every character.
2. Scan again and return the first character with count `1`.

Separating counting from selection makes the reasoning clear.

## JavaScript solution

```js
function firstNonRepeating(text) {
  const counts = new Map();

  for (const char of text) {
    counts.set(char, (counts.get(char) ?? 0) + 1);
  }

  for (const char of text) {
    if (counts.get(char) === 1) return char;
  }

  return null;
}
```

## Tests

```js
console.assert(firstNonRepeating("swiss") === "w");
console.assert(firstNonRepeating("aabb") === null);
console.assert(firstNonRepeating("abcd") === "a");
console.assert(firstNonRepeating("") === null);
```

## Complexity

- Time: **O(n)**
- Space: **O(k)** where `k` is the number of distinct characters.

---

# Guided Challenge 10: Two Sum

**ID:** DSP-010  
**Difficulty:** 3/5  
**Skills:** Map, complement lookup, one-pass reasoning

## Problem

Return the indices of two numbers whose values add up to the target. Return `[]` when no pair exists.

Assume each valid input has at most one required answer.

## Example

```text
[2, 7, 11, 15], target 9 → [0, 1]
[3, 3], target 6 → [0, 1]
[1, 2, 3], target 20 → []
```

## Key idea

For each number, calculate:

```text
needed = target - current
```

Then ask whether `needed` has already been seen.

## JavaScript solution

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

  return [];
}
```

## Tests

```js
console.assert(JSON.stringify(twoSum([2, 7, 11, 15], 9)) === '[0,1]');
console.assert(JSON.stringify(twoSum([3, 3], 6)) === '[0,1]');
console.assert(JSON.stringify(twoSum([1, 2, 3], 20)) === '[]');
console.assert(JSON.stringify(twoSum([-3, 4, 1, 2], -1)) === '[0,1]');
```

## Complexity

- Time: **O(n)** average.
- Space: **O(n)**.

---

# Independent Challenge 11: Group Words by Length

**ID:** DSP-011  
**Difficulty:** 2/5  
**Skills:** objects, arrays, grouping

## Problem

Return an object where each key is a word length and its value is an array of words having that length.

Example:

```text
["cat", "to", "dog", "a"]
→ {
  1: ["a"],
  2: ["to"],
  3: ["cat", "dog"]
}
```

### Requirements

- Preserve input order within each group.
- Return `{}` for an empty array.
- Do not mutate the input.

### Hint

The key can be `word.length`.

---

# Independent Challenge 12: Move Zeros

**ID:** DSP-012  
**Difficulty:** 3/5  
**Skills:** arrays, filtering, order preservation

## Problem

Return a new array where all zeros have been moved to the end while the relative order of non-zero values remains unchanged.

Examples:

```text
[0, 1, 0, 3, 12] → [1, 3, 12, 0, 0]
[0, 0] → [0, 0]
[1, 2] → [1, 2]
```

### Hint

Separate non-zero values from zeros, then combine the results.

---

# Debugging Lab: Accidental Mutation

Broken code:

```js
function doubleValues(numbers) {
  for (let i = 0; i < numbers.length; i++) {
    numbers[i] *= 2;
  }

  return numbers;
}
```

This function mutates the input array.

If the requirement is to return a new array, use:

```js
function doubleValues(numbers) {
  return numbers.map(number => number * 2);
}
```

### Tests

```js
const input = [1, 2, 3];
const result = doubleValues(input);

console.assert(JSON.stringify(result) === '[2,4,6]');
console.assert(JSON.stringify(input) === '[1,2,3]');
```

The second assertion is important. A test should verify the behavior the requirement actually promises.

---

# Module Assessment

Complete without reference solutions.

1. Write `maxFrequency(numbers)` that returns the number appearing most often.
2. Write `intersection(first, second)` that returns unique values appearing in both arrays.
3. Write `isAnagram(first, second)` using frequency reasoning.
4. Explain when `Set` is a better fit than an array.
5. Explain why `twoSum` can be faster than checking every possible pair.

## Rubric

| Skill | Points |
|---|---:|
| Correct problem interpretation | 2 |
| Appropriate JavaScript structure | 2 |
| Correct algorithm | 2 |
| Edge-case tests | 2 |
| Complexity explanation | 2 |
| **Total** | **10** |

## Mastery target

**8/10 or higher**, with no unresolved correctness bugs.

---

# Revision Checklist

- [ ] I can choose between `for`, `for...of`, and array methods.
- [ ] I understand why `Map` and `Set` are useful.
- [ ] I can count frequencies in one pass.
- [ ] I can recognize when two passes make a problem simpler.
- [ ] I can use early returns safely.
- [ ] I can identify accidental mutation.
- [ ] I can write tests for empty, repeated, negative, and boundary values.
- [ ] I can explain the time and space cost of my approach.
