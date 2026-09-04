# Module 4 — Searching

## Mission

Learn to choose the right search strategy instead of automatically scanning everything and hoping the computer develops intuition.

This module moves from simple linear search to binary search and then into reusable search patterns for real data.

## Learning outcomes

By the end, the learner can:

- implement linear search reliably;
- return useful search results such as indexes or counts;
- exploit sorted data with binary search;
- recognize the conditions required for binary search;
- handle duplicates deliberately;
- search rotated sorted arrays;
- search structured records using a key;
- explain why an algorithm is `O(n)` or `O(log n)`;
- test search functions against edge cases and invalid assumptions.

## Search decision rule

| Situation | First strategy to consider |
|---|---|
| Unsorted data, one search | Linear search |
| Sorted data, repeated lookup | Binary search |
| Need all matching values | Full traversal/filtering |
| Need first/last occurrence in sorted data | Boundary binary search |
| Sorted array has been rotated | Modified binary search |

**Important:** Binary search is not automatically better. It requires exploitable structure, normally sorted data. An `O(log n)` algorithm applied to the wrong input is still the wrong algorithm.

---

# DSP-025 — Find the First Matching Index

**Difficulty:** 1 — Basic  
**Skills:** traversal, equality, indexes

### Problem
Return the index of the first occurrence of `target` in an array. Return `-1` when the target is absent.

### Examples

```text
[4, 8, 2, 8], 8 → 1
[1, 2, 3], 9 → -1
[5], 5 → 0
```

### Hint
Scan from left to right and return immediately when you find the target.

### Pseudocode

```text
FOR index from 0 to end
    IF numbers[index] equals target
        RETURN index
RETURN -1
```

### Solution

```js
function firstIndexOf(numbers, target) {
  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] === target) return i;
  }

  return -1;
}
```

### Tests

```js
console.assert(firstIndexOf([4, 8, 2, 8], 8) === 1);
console.assert(firstIndexOf([1, 2, 3], 9) === -1);
console.assert(firstIndexOf([5], 5) === 0);
console.assert(firstIndexOf([], 5) === -1);
console.assert(firstIndexOf([2, 2, 2], 2) === 0);
```

### Edge cases
Empty array, target absent, duplicates, target at index `0`.

### Complexity
- Time: `O(n)` worst case
- Extra space: `O(1)`

### Extension
Return the number of comparisons performed before finding the target.

---

# DSP-026 — Count Occurrences of a Target

**Difficulty:** 2 — Beginner  
**Skills:** traversal, counting

### Problem
Return how many times `target` occurs in an array.

### Examples

```text
[2, 4, 2, 2, 7], 2 → 3
[1, 2, 3], 9 → 0
```

### Hint
Do not return when you find the first match. Keep scanning and increment a counter.

### Pseudocode

```text
count = 0
FOR each number
    IF number equals target
        count++
RETURN count
```

### Solution

```js
function countOccurrences(numbers, target) {
  let count = 0;

  for (const number of numbers) {
    if (number === target) count++;
  }

  return count;
}
```

### Tests

```js
console.assert(countOccurrences([2, 4, 2, 2, 7], 2) === 3);
console.assert(countOccurrences([1, 2, 3], 9) === 0);
console.assert(countOccurrences([], 4) === 0);
console.assert(countOccurrences([5, 5, 5], 5) === 3);
```

### Edge cases
Empty array, no matches, all values matching, one value.

### Complexity
- Time: `O(n)`
- Extra space: `O(1)`

### Extension
Return an object containing both the count and all matching indexes.

---

# DSP-027 — Binary Search

**Difficulty:** 3 — Intermediate  
**Skills:** sorted arrays, divide and conquer, pointers

### Problem
Given an array sorted in ascending order, return the index of `target`, or `-1` if it is absent. Do not use `.indexOf()`.

### Examples

```text
[1, 3, 5, 7, 9], 7 → 3
[1, 3, 5, 7, 9], 4 → -1
```

### Hint
Compare the target with the middle value. Eliminate half of the remaining search space each iteration.

### Pseudocode

```text
left = 0
right = last index
WHILE left <= right
    middle = floor((left + right) / 2)
    IF middle value equals target
        RETURN middle
    IF middle value < target
        left = middle + 1
    ELSE
        right = middle - 1
RETURN -1
```

### Solution

```js
function binarySearch(numbers, target) {
  let left = 0;
  let right = numbers.length - 1;

  while (left <= right) {
    const middle = Math.floor((left + right) / 2);

    if (numbers[middle] === target) return middle;

    if (numbers[middle] < target) {
      left = middle + 1;
    } else {
      right = middle - 1;
    }
  }

  return -1;
}
```

### Tests

```js
console.assert(binarySearch([1, 3, 5, 7, 9], 7) === 3);
console.assert(binarySearch([1, 3, 5, 7, 9], 4) === -1);
console.assert(binarySearch([5], 5) === 0);
console.assert(binarySearch([], 5) === -1);
console.assert(binarySearch([-8, -4, -1, 0, 6], -8) === 0);
```

### Edge cases
Empty array, one item, target at either boundary, negative values, absent target.

### Complexity
- Time: `O(log n)`
- Extra space: `O(1)`

### Extension
Explain why binary search requires sorted data. Then deliberately run it on an unsorted array and describe why the result cannot be trusted.

---

# DSP-028 — First Position Greater Than or Equal To Target

**Difficulty:** 4 — Challenging  
**Skills:** binary search, boundary search

### Problem
Given an ascending sorted array, return the first index whose value is greater than or equal to `target`. If every value is smaller, return the array length.

### Examples

```text
[1, 3, 3, 5, 8], 3 → 1
[1, 3, 3, 5, 8], 4 → 3
[1, 3, 3, 5, 8], 9 → 5
```

### Hint
When the middle value is large enough, record it as a possible answer and continue searching left.

### Pseudocode

```text
left = 0
right = length
WHILE left < right
    middle = floor((left + right) / 2)
    IF numbers[middle] >= target
        right = middle
    ELSE
        left = middle + 1
RETURN left
```

### Solution

```js
function lowerBound(numbers, target) {
  let left = 0;
  let right = numbers.length;

  while (left < right) {
    const middle = Math.floor((left + right) / 2);

    if (numbers[middle] >= target) {
      right = middle;
    } else {
      left = middle + 1;
    }
  }

  return left;
}
```

### Tests

```js
console.assert(lowerBound([1, 3, 3, 5, 8], 3) === 1);
console.assert(lowerBound([1, 3, 3, 5, 8], 4) === 3);
console.assert(lowerBound([1, 3, 3, 5, 8], 9) === 5);
console.assert(lowerBound([1, 3, 3, 5, 8], 0) === 0);
console.assert(lowerBound([], 4) === 0);
```

### Edge cases
Empty array, target below minimum, above maximum, many duplicates, exact match.

### Complexity
- Time: `O(log n)`
- Extra space: `O(1)`

### Extension
Use `lowerBound` to count how many values are smaller than a target.

---

# DSP-029 — Search a Sorted Student List by Score

**Difficulty:** 3 — Intermediate  
**Skills:** objects, binary search, key extraction

### Problem
You are given student records sorted by `score` in ascending order. Return the index of a student with the exact score. Return `-1` if no student has that score.

```js
const students = [
  { name: "Aline", score: 55 },
  { name: "Eric", score: 68 },
  { name: "Diane", score: 74 },
  { name: "Kevin", score: 91 }
];
```

### Examples

```text
score 74 → 2
score 70 → -1
```

### Hint
Binary search does not require arrays of plain numbers. Compare the target against `students[middle].score`.

### Pseudocode

```text
left = 0
right = last index
WHILE left <= right
    middle = middle index
    score = students[middle].score
    IF score equals target
        RETURN middle
    IF score < target
        move left rightward
    ELSE
        move right leftward
RETURN -1
```

### Solution

```js
function findStudentByScore(students, targetScore) {
  let left = 0;
  let right = students.length - 1;

  while (left <= right) {
    const middle = Math.floor((left + right) / 2);
    const score = students[middle].score;

    if (score === targetScore) return middle;

    if (score < targetScore) left = middle + 1;
    else right = middle - 1;
  }

  return -1;
}
```

### Tests

```js
const students = [
  { name: "Aline", score: 55 },
  { name: "Eric", score: 68 },
  { name: "Diane", score: 74 },
  { name: "Kevin", score: 91 }
];

console.assert(findStudentByScore(students, 74) === 2);
console.assert(findStudentByScore(students, 70) === -1);
console.assert(findStudentByScore(students, 55) === 0);
console.assert(findStudentByScore(students, 91) === 3);
console.assert(findStudentByScore([], 50) === -1);
```

### Edge cases
Empty list, boundary scores, absent score, duplicate scores.

### Complexity
- Time: `O(log n)`
- Extra space: `O(1)`

### Extension
Define the behavior when multiple students have the same score. Then implement the first matching index using a boundary search.

---

# DSP-030 — Search in a Rotated Sorted Array

**Difficulty:** 5 — Advanced Beginner  
**Skills:** binary search, reasoning, sorted regions

### Problem
A sorted ascending array has been rotated at an unknown position. Return the index of `target`, or `-1` if absent.

Example:

```text
[0, 1, 2, 4, 5, 6, 7]
rotated → [4, 5, 6, 7, 0, 1, 2]
```

### Examples

```text
[4, 5, 6, 7, 0, 1, 2], 0 → 4
[4, 5, 6, 7, 0, 1, 2], 3 → -1
```

### Hint
At every midpoint, at least one half is normally sorted. Determine which half is sorted, then decide whether the target belongs inside that half.

### Pseudocode

```text
left = 0
right = last index
WHILE left <= right
    middle = midpoint
    IF middle value equals target
        RETURN middle
    IF left half is sorted
        IF target lies inside left half
            search left half
        ELSE
            search right half
    ELSE
        IF target lies inside right half
            search right half
        ELSE
            search left half
RETURN -1
```

### Solution

```js
function searchRotated(numbers, target) {
  let left = 0;
  let right = numbers.length - 1;

  while (left <= right) {
    const middle = Math.floor((left + right) / 2);

    if (numbers[middle] === target) return middle;

    if (numbers[left] <= numbers[middle]) {
      if (numbers[left] <= target && target < numbers[middle]) {
        right = middle - 1;
      } else {
        left = middle + 1;
      }
    } else {
      if (numbers[middle] < target && target <= numbers[right]) {
        left = middle + 1;
      } else {
        right = middle - 1;
      }
    }
  }

  return -1;
}
```

### Tests

```js
console.assert(searchRotated([4, 5, 6, 7, 0, 1, 2], 0) === 4);
console.assert(searchRotated([4, 5, 6, 7, 0, 1, 2], 3) === -1);
console.assert(searchRotated([1], 1) === 0);
console.assert(searchRotated([1], 2) === -1);
console.assert(searchRotated([], 2) === -1);
console.assert(searchRotated([6, 7, 0, 1, 2, 4, 5], 4) === 5);
```

### Edge cases
Empty array, one item, no rotation, rotation by one position, target absent.

### Complexity
- Time: `O(log n)` under the distinct-value assumption.
- Extra space: `O(1)`.

### Extension
Investigate what changes when duplicates are allowed. Identify why duplicates can make the sorted-half decision ambiguous.

---

# DSP-031 — Find the Closest Value in a Sorted Array

**Difficulty:** 4 — Challenging  
**Skills:** binary search, boundaries, absolute difference

### Problem
Given an ascending sorted array of numbers and a target, return the value whose absolute difference from the target is smallest. If two values are equally close, return the smaller value.

### Examples

```text
[1, 4, 7, 10], target=6 → 7
[1, 4, 7, 10], target=5.5 → 4
[1, 4, 7, 10], target=8 → 7
```

### Hint
Use binary search to locate where the target would be inserted. Only nearby boundary values can be the answer.

### Pseudocode

```text
IF array is empty
    RETURN null
Find insertion position using lower-bound binary search
Compare candidate at insertion position with candidate immediately before it
Return the closer value
If tied, return smaller value
```

### Solution

```js
function closestValue(numbers, target) {
  if (numbers.length === 0) return null;

  let left = 0;
  let right = numbers.length;

  while (left < right) {
    const middle = Math.floor((left + right) / 2);

    if (numbers[middle] < target) left = middle + 1;
    else right = middle;
  }

  if (left === 0) return numbers[0];
  if (left === numbers.length) return numbers[numbers.length - 1];

  const before = numbers[left - 1];
  const after = numbers[left];
  const beforeDistance = Math.abs(before - target);
  const afterDistance = Math.abs(after - target);

  if (beforeDistance <= afterDistance) return before;
  return after;
}
```

### Tests

```js
console.assert(closestValue([1, 4, 7, 10], 6) === 7);
console.assert(closestValue([1, 4, 7, 10], 5.5) === 4);
console.assert(closestValue([1, 4, 7, 10], 8) === 7);
console.assert(closestValue([1, 4, 7, 10], -5) === 1);
console.assert(closestValue([1, 4, 7, 10], 20) === 10);
console.assert(closestValue([], 5) === null);
```

### Edge cases
Empty input, target below minimum, target above maximum, exact match, equal-distance tie.

### Complexity
- Time: `O(log n)`
- Extra space: `O(1)`

### Extension
Return both the closest value and its index.

---

# Module 4 Debugging Lab — Binary Search That Lies

Consider this implementation:

```js
function binarySearch(numbers, target) {
  let left = 0;
  let right = numbers.length;

  while (left < right) {
    const middle = Math.floor((left + right) / 2);

    if (numbers[middle] === target) return middle;
    if (numbers[middle] < target) left = middle;
    else right = middle;
  }

  return -1;
}
```

### Tasks

1. Find the update that can make the loop stop progressing.
2. Explain why `left = middle` can leave `left` unchanged.
3. Replace it with a correct binary search.
4. Test it on `[1, 3]` with targets `3` and `9`.

### Expected lesson
Binary search is simple to describe and surprisingly easy to implement incorrectly. The loop invariant and pointer movement matter more than memorizing the phrase “cut the array in half.”

---

# Module 4 Assessment

## Part A — Choose the strategy

1. Search one value in an unsorted array.
2. Search thousands of values in a sorted array.
3. Find every occurrence of a value.
4. Find the first position where a sorted array reaches a target.
5. Search a rotated sorted array.

Expected: linear search, binary search, full traversal, lower-bound binary search, modified binary search.

## Part B — Implementation

Without looking at the solution, implement:

- DSP-027 Binary Search
- DSP-028 Lower Bound

Then test both against empty arrays, one-item arrays, boundary targets, missing targets, and duplicate values where relevant.

## Part C — Explain the optimization

Explain why repeatedly searching an unsorted array with linear search can become expensive, and when preprocessing data into a sorted structure may be worth the cost.

## Part D — Debugging

Fix the buggy binary search from the debugging lab and explain the exact reason the original can fail.

## Assessment rubric

| Area | Pass standard |
|---|---|
| Strategy selection | 4/5 correct |
| Binary search | Correct on boundary and missing-target tests |
| Boundary reasoning | Correctly handles insertion positions |
| Complexity | Correctly distinguishes `O(n)` and `O(log n)` |
| Debugging | Explains the pointer-progress failure |

---

# Module 4 Revision Checklist

- [ ] Implement linear search.
- [ ] Count occurrences without stopping early.
- [ ] Implement iterative binary search.
- [ ] Explain the sorted-data requirement.
- [ ] Implement lower-bound search.
- [ ] Search objects using a sorted key.
- [ ] Understand rotated-array binary search.
- [ ] Handle empty and boundary inputs.
- [ ] Explain `O(n)` versus `O(log n)`.
- [ ] Debug pointer-update mistakes.

## Completion rule

The module is complete when the learner can implement binary search and lower-bound search independently, explain their invariants, and pass edge-case tests without copying the reference solution.
