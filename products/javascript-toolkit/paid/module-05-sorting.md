# Module 5 — Sorting

## Mission

Understand how and why data gets ordered, then choose a sorting strategy based on the problem rather than blindly calling `.sort()` and hoping complexity goes away.

This module covers built-in sorting behavior, selection sort, insertion sort, merge sort, quicksort partitioning, custom comparators, stability, and algorithm trade-offs.

## Learning outcomes

By the end, the learner can:

- explain why JavaScript's `.sort()` needs care with numbers;
- write selection sort and insertion sort;
- understand divide-and-conquer sorting;
- implement merge sort;
- reason about quicksort partitioning;
- sort objects with explicit comparator rules;
- compare time and space trade-offs;
- recognize stable versus unstable sorting behavior;
- test sorting algorithms with duplicates, negatives, and empty input.

## Sorting decision rule

| Situation | Strategy to consider |
|---|---|
| Ordinary application code | Built-in `.sort()` with a correct comparator |
| Learning algorithm mechanics | Selection/insertion/merge/quicksort |
| Nearly sorted small data | Insertion sort can be useful |
| Need predictable `O(n log n)` worst-case behavior | Merge sort or an appropriate production implementation |
| Need a custom order | Comparator function |

**Production principle:** Knowing how sorting works is educationally valuable. In normal application code, use the language's tested built-in implementation unless there is a measured reason not to.

---

# DSP-032 — Numeric Sort Without the Trap

**Difficulty:** 1 — Basic  
**Skills:** JavaScript arrays, comparator functions

### Problem
Return a new array sorted numerically in ascending order. Do not mutate the original array.

### Why this exists
JavaScript's default `.sort()` compares values as strings. For example, `[10, 2, 5]` can become `[10, 2, 5]` instead of numeric order. The comparator makes the intended rule explicit.

### Examples

```text
[10, 2, 5] → [2, 5, 10]
[-2, 0, -10] → [-10, -2, 0]
```

### Hint
Use a copy and `(a, b) => a - b`.

### Pseudocode

```text
copy the array
sort the copy using numeric ascending comparison
return the copy
```

### Solution

```js
function numericSort(numbers) {
  return [...numbers].sort((a, b) => a - b);
}
```

### Tests

```js
const original = [10, 2, 5];
const sorted = numericSort(original);
console.assert(JSON.stringify(sorted) === JSON.stringify([2, 5, 10]));
console.assert(JSON.stringify(original) === JSON.stringify([10, 2, 5]));
console.assert(JSON.stringify(numericSort([-2, 0, -10])) === JSON.stringify([-10, -2, 0]));
console.assert(JSON.stringify(numericSort([])) === JSON.stringify([]));
```

### Edge cases
Empty array, negatives, duplicates, original-array mutation.

### Complexity
- Time: depends on the JavaScript engine's built-in sort implementation.
- Extra space: implementation-dependent; copying the input requires `O(n)` space.

### Extension
Create a descending numeric version.

---

# DSP-033 — Selection Sort

**Difficulty:** 2 — Beginner  
**Skills:** nested loops, minimum selection, swapping

### Problem
Implement selection sort in ascending order without using `.sort()`.

### Examples

```text
[5, 2, 4, 1] → [1, 2, 4, 5]
[3, 3, 1] → [1, 3, 3]
```

### Hint
For each position, find the smallest remaining value and swap it into that position.

### Pseudocode

```text
FOR start from first index to second-last
    minIndex = start
    FOR i after start
        IF numbers[i] < numbers[minIndex]
            minIndex = i
    swap numbers[start] and numbers[minIndex]
RETURN numbers
```

### Solution

```js
function selectionSort(numbers) {
  const result = [...numbers];

  for (let start = 0; start < result.length - 1; start++) {
    let minIndex = start;

    for (let i = start + 1; i < result.length; i++) {
      if (result[i] < result[minIndex]) {
        minIndex = i;
      }
    }

    [result[start], result[minIndex]] = [result[minIndex], result[start]];
  }

  return result;
}
```

### Tests

```js
console.assert(JSON.stringify(selectionSort([5, 2, 4, 1])) === JSON.stringify([1, 2, 4, 5]));
console.assert(JSON.stringify(selectionSort([3, 3, 1])) === JSON.stringify([1, 3, 3]));
console.assert(JSON.stringify(selectionSort([])) === JSON.stringify([]));
console.assert(JSON.stringify(selectionSort([-1, -5, 2])) === JSON.stringify([-5, -1, 2]));
```

### Edge cases
Empty array, one item, duplicates, negatives.

### Complexity
- Time: `O(n²)`
- Extra space: `O(n)` here because the input is copied.

### Extension
Write a truly in-place version and explain its mutation trade-off.

---

# DSP-034 — Insertion Sort

**Difficulty:** 3 — Intermediate  
**Skills:** loops, shifting, nearly sorted data

### Problem
Implement insertion sort in ascending order without `.sort()`.

### Examples

```text
[5, 2, 4, 1] → [1, 2, 4, 5]
[1, 2, 3] → [1, 2, 3]
```

### Hint
Treat the left side as sorted. Insert each next value into its correct position by shifting larger values right.

### Pseudocode

```text
result = copy of input
FOR i from 1 to end
    key = result[i]
    j = i - 1
    WHILE j >= 0 AND result[j] > key
        shift result[j] right
        j--
    place key at j + 1
RETURN result
```

### Solution

```js
function insertionSort(numbers) {
  const result = [...numbers];

  for (let i = 1; i < result.length; i++) {
    const key = result[i];
    let j = i - 1;

    while (j >= 0 && result[j] > key) {
      result[j + 1] = result[j];
      j--;
    }

    result[j + 1] = key;
  }

  return result;
}
```

### Tests

```js
console.assert(JSON.stringify(insertionSort([5, 2, 4, 1])) === JSON.stringify([1, 2, 4, 5]));
console.assert(JSON.stringify(insertionSort([1, 2, 3])) === JSON.stringify([1, 2, 3]));
console.assert(JSON.stringify(insertionSort([4, 4, 1, 2])) === JSON.stringify([1, 2, 4, 4]));
console.assert(JSON.stringify(insertionSort([])) === JSON.stringify([]));
```

### Edge cases
Already sorted input, reverse order, duplicates, empty input.

### Complexity
- Worst-case time: `O(n²)`
- Best-case time: `O(n)` for already sorted input
- Extra space: `O(n)` here because of the defensive copy.

### Extension
Explain why insertion sort can be attractive for small or nearly sorted datasets.

---

# DSP-035 — Merge Sort

**Difficulty:** 4 — Challenging  
**Skills:** recursion, divide and conquer, merging

### Problem
Implement merge sort without using `.sort()`.

### Examples

```text
[8, 3, 5, 1, 9, 2] → [1, 2, 3, 5, 8, 9]
```

### Hint
Split until each piece has at most one item, recursively sort each half, then merge the sorted halves.

### Pseudocode

```text
IF length <= 1
    RETURN copy
split array into left and right
sort left recursively
sort right recursively
merge the sorted halves
RETURN merged result
```

### Solution

```js
function merge(left, right) {
  const result = [];
  let i = 0;
  let j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) result.push(left[i++]);
    else result.push(right[j++]);
  }

  while (i < left.length) result.push(left[i++]);
  while (j < right.length) result.push(right[j++]);

  return result;
}

function mergeSort(numbers) {
  if (numbers.length <= 1) return [...numbers];

  const middle = Math.floor(numbers.length / 2);
  const left = mergeSort(numbers.slice(0, middle));
  const right = mergeSort(numbers.slice(middle));

  return merge(left, right);
}
```

### Tests

```js
console.assert(JSON.stringify(mergeSort([8, 3, 5, 1, 9, 2])) === JSON.stringify([1, 2, 3, 5, 8, 9]));
console.assert(JSON.stringify(mergeSort([])) === JSON.stringify([]));
console.assert(JSON.stringify(mergeSort([4])) === JSON.stringify([4]));
console.assert(JSON.stringify(mergeSort([2, 2, 1])) === JSON.stringify([1, 2, 2]));
console.assert(JSON.stringify(mergeSort([-3, 7, -1])) === JSON.stringify([-3, -1, 7]));
```

### Edge cases
Empty input, one item, duplicates, negative values.

### Complexity
- Time: `O(n log n)`
- Extra space: `O(n)` for this implementation.

### Extension
Explain why the merge step is `O(n)` and why there are `O(log n)` levels of splitting.

---

# DSP-036 — Quick Sort Partition

**Difficulty:** 4 — Challenging  
**Skills:** partitioning, recursion, pivot reasoning

### Problem
Implement quicksort using the last element as the pivot. Return a sorted new array. Values are distinct for this challenge.

### Examples

```text
[7, 2, 9, 4, 1] → [1, 2, 4, 7, 9]
```

### Hint
Partition values into those smaller than the pivot and those larger than the pivot, then recursively sort both sides.

### Pseudocode

```text
IF length <= 1
    RETURN copy
pivot = last value
smaller = values below pivot
larger = values above pivot
RETURN quickSort(smaller) + pivot + quickSort(larger)
```

### Solution

```js
function quickSort(numbers) {
  if (numbers.length <= 1) return [...numbers];

  const pivot = numbers[numbers.length - 1];
  const smaller = [];
  const larger = [];

  for (let i = 0; i < numbers.length - 1; i++) {
    if (numbers[i] < pivot) smaller.push(numbers[i]);
    else larger.push(numbers[i]);
  }

  return [...quickSort(smaller), pivot, ...quickSort(larger)];
}
```

### Tests

```js
console.assert(JSON.stringify(quickSort([7, 2, 9, 4, 1])) === JSON.stringify([1, 2, 4, 7, 9]));
console.assert(JSON.stringify(quickSort([])) === JSON.stringify([]));
console.assert(JSON.stringify(quickSort([3])) === JSON.stringify([3]));
console.assert(JSON.stringify(quickSort([-2, 5, 0, -1])) === JSON.stringify([-2, -1, 0, 5]));
```

### Edge cases
Empty input, one item, already sorted input, reverse sorted input.

### Complexity
- Average time: `O(n log n)`
- Worst-case time with this pivot rule: `O(n²)`
- Extra space: depends on recursion and the created partitions.

### Extension
Explain why choosing the last element as pivot can perform badly on already sorted data. Research a randomized or median-based pivot strategy.

---

# DSP-037 — Sort Students by Score

**Difficulty:** 2 — Beginner  
**Skills:** objects, comparator design, non-mutating transformation

### Problem
Return a new student array sorted by score from highest to lowest. When two students have the same score, sort their names alphabetically.

### Example

```js
[
  { name: "Eric", score: 80 },
  { name: "Aline", score: 90 },
  { name: "Diane", score: 90 }
]
```

Expected:

```js
[
  { name: "Aline", score: 90 },
  { name: "Diane", score: 90 },
  { name: "Eric", score: 80 }
]
```

### Hint
The comparator needs two rules. Score decides first. Name breaks ties.

### Pseudocode

```text
copy students
sort by descending score
IF scores equal
    compare names alphabetically
RETURN sorted copy
```

### Solution

```js
function sortStudentsByScore(students) {
  return [...students].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.name.localeCompare(b.name);
  });
}
```

### Tests

```js
const students = [
  { name: "Eric", score: 80 },
  { name: "Aline", score: 90 },
  { name: "Diane", score: 90 }
];

const result = sortStudentsByScore(students);
console.assert(result[0].name === "Aline");
console.assert(result[1].name === "Diane");
console.assert(result[2].name === "Eric");
console.assert(students[0].name === "Eric");
console.assert(sortStudentsByScore([]).length === 0);
```

### Edge cases
Empty list, tied scores, one student, negative or zero scores if the application permits them.

### Complexity
- Time: determined by the engine's sort implementation, typically `O(n log n)` for modern production engines.
- Extra space: `O(n)` for the copied array.

### Extension
Create a function that accepts a comparator so callers can choose score ascending, score descending, or name ascending.

---

# DSP-038 — Sort by Distance From a Target

**Difficulty:** 5 — Advanced Beginner  
**Skills:** comparator logic, absolute difference, tie-breaking

### Problem
Given numbers and a target, return a new array ordered by increasing absolute distance from the target. If two numbers are equally distant, place the smaller number first.

### Examples

```text
[10, 3, 7, 5], target=6 → [5, 7, 3, 10]
[1, 5, 3], target=3 → [3, 1, 5]
```

### Hint
The comparator should first compare `Math.abs(value - target)`. If those distances match, compare the values themselves.

### Pseudocode

```text
copy array
sort using:
    distanceA = absolute difference from target
    distanceB = absolute difference from target
    IF distances differ
        smaller distance first
    ELSE
        smaller value first
RETURN copy
```

### Solution

```js
function sortByDistance(numbers, target) {
  return [...numbers].sort((a, b) => {
    const distanceA = Math.abs(a - target);
    const distanceB = Math.abs(b - target);

    if (distanceA !== distanceB) return distanceA - distanceB;
    return a - b;
  });
}
```

### Tests

```js
console.assert(JSON.stringify(sortByDistance([10, 3, 7, 5], 6)) === JSON.stringify([5, 7, 3, 10]));
console.assert(JSON.stringify(sortByDistance([1, 5, 3], 3)) === JSON.stringify([3, 1, 5]));
console.assert(JSON.stringify(sortByDistance([], 4)) === JSON.stringify([]));
console.assert(JSON.stringify(sortByDistance([-2, 2, 5], 0)) === JSON.stringify([-2, 2, 5]));
```

### Edge cases
Empty input, exact target match, equal-distance values, negative values.

### Complexity
- Time: typically `O(n log n)`
- Extra space: `O(n)` for the copied array.

### Extension
Instead of fully sorting the array, design a function that returns only the `k` closest values and discuss when full sorting is unnecessary work.

---

# Module 5 Debugging Lab — The Comparator Disaster

Consider:

```js
const numbers = [10, 2, 5, 1];
numbers.sort();
```

### Tasks

1. Predict the result.
2. Explain why JavaScript's default behavior is surprising for numeric arrays.
3. Fix it without changing the original array.
4. Add tests containing `10`, `2`, and `1` so the bug cannot hide.

Then inspect:

```js
students.sort((a, b) => a.score - b.score);
```

Explain why this mutates `students` and when that could cause a separate bug elsewhere in an application.

---

# Module 5 Assessment

## Part A — Concepts

Explain:

1. Why numeric sorting needs an explicit comparator.
2. The core idea of selection sort.
3. Why insertion sort can perform well on nearly sorted data.
4. Why merge sort is `O(n log n)`.
5. Why quicksort can degrade to `O(n²)`.

## Part B — Implementation

Without the solution, implement one of:

- DSP-033 Selection Sort
- DSP-034 Insertion Sort
- DSP-035 Merge Sort

## Part C — Production judgment

Given ordinary application code that needs to sort 5,000 user records, explain why using a tested built-in sort is normally preferable to maintaining a custom merge-sort implementation.

## Part D — Testing

Create tests for:

- empty input;
- one item;
- already sorted input;
- reverse sorted input;
- duplicates;
- negative values;
- and the original-array mutation rule where applicable.

## Assessment rubric

| Area | Pass standard |
|---|---|
| Comparator understanding | Explains numeric and object sorting correctly |
| Algorithm implementation | Correctly sorts representative and edge cases |
| Complexity | Correctly compares `O(n²)` and `O(n log n)` patterns |
| Production judgment | Distinguishes learning implementations from production choices |
| Testing | Includes mutation and edge-case tests |

---

# Module 5 Revision Checklist

- [ ] Explain JavaScript's default `.sort()` behavior.
- [ ] Write numeric comparators.
- [ ] Implement selection sort.
- [ ] Implement insertion sort.
- [ ] Explain divide and conquer.
- [ ] Implement merge sort.
- [ ] Explain quicksort partitioning.
- [ ] Understand worst-case quicksort behavior.
- [ ] Sort arrays of objects with multiple rules.
- [ ] Test duplicates, negatives, empty input, and mutation.
- [ ] Choose built-in sorting appropriately in production.

## Completion rule

The module is complete when the learner can implement at least one educational sorting algorithm from memory, explain its complexity and trade-offs, correctly write a production comparator, and diagnose the JavaScript numeric-sort trap.
