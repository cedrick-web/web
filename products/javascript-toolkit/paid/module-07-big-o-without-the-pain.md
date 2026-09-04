# Module 7 — Big-O Without the Pain

## Mission

Learn to estimate how an algorithm grows as its input grows, then use that information to make sensible engineering decisions.

Big-O is a decision tool, not a contest to see who can recite notation fastest.

## Learning outcomes

By the end of this module, the learner can:

- identify the dominant work in a solution;
- distinguish O(1), O(log n), O(n), O(n log n), and O(n²);
- recognize common hidden loops and repeated work;
- compare time and space trade-offs;
- use complexity to decide when an optimization is worth the added complexity.

---

# Lesson 1 — What Big-O Measures

Big-O describes how resource usage grows as input size grows.

It does **not** tell you the exact number of milliseconds on a particular computer.

For example:

```js
function first(numbers) {
  return numbers[0];
}
```

The operation does not grow with the size of the array, so it is **O(1)**.

A simple scan:

```js
function contains(numbers, target) {
  for (const number of numbers) {
    if (number === target) return true;
  }

  return false;
}
```

may inspect every element, so it is **O(n)**.

---

# Lesson 2 — The Main Complexity Patterns

| Complexity | Typical pattern | Intuition |
|---|---|---|
| O(1) | direct access | same amount of work |
| O(log n) | binary search | repeatedly halve the search space |
| O(n) | one full scan | work grows with input |
| O(n log n) | efficient comparison sorting | scan across logarithmic levels |
| O(n²) | nested pair comparisons | compare many pairs |

These are approximations for growth. Real performance also depends on constants, memory, implementation, hardware, and input characteristics.

---

# Lesson 3 — Ignore the Noise, Find the Dominant Work

Suppose:

```js
function example(numbers) {
  let total = 0;

  for (const number of numbers) {
    total += number;
  }

  for (const number of numbers) {
    if (number > 0) total++;
  }

  return total;
}
```

Two separate O(n) loops still produce **O(n)** overall, not O(2n).

Big-O drops constant factors because the growth category remains linear.

But nested loops are different:

```js
for (const a of numbers) {
  for (const b of numbers) {
    // work
  }
}
```

That pattern can perform about n × n operations, giving **O(n²)**.

---

# DSP-049 — Constant-Time Access

**Difficulty:** 1 — Basic  
**Skills:** arrays, complexity recognition

## Problem
Return the first element of an array without scanning the entire array.

Return `null` for an empty array.

### Solution
```js
function firstValue(numbers) {
  return numbers.length === 0 ? null : numbers[0];
}
```

### Tests
```js
firstValue([10, 20, 30]); // 10
firstValue([7]); // 7
firstValue([]); // null
firstValue([-5, 2]); // -5
```

### Complexity
**Time:** O(1)  
**Extra space:** O(1)

### Why
The function performs a fixed amount of work regardless of whether the array contains 1 item or 1 million items.

---

# DSP-050 — Detect a Hidden Quadratic Algorithm

**Difficulty:** 3 — Intermediate  
**Skills:** nested loops, complexity analysis

## Problem
Determine whether an array contains a duplicate using pairwise comparison.

### Solution
```js
function hasDuplicatePairwise(numbers) {
  for (let i = 0; i < numbers.length; i++) {
    for (let j = i + 1; j < numbers.length; j++) {
      if (numbers[i] === numbers[j]) return true;
    }
  }

  return false;
}
```

### Tests
```js
hasDuplicatePairwise([1, 2, 3, 2]); // true
hasDuplicatePairwise([1, 2, 3]); // false
hasDuplicatePairwise([]); // false
hasDuplicatePairwise([5, 5]); // true
```

### Complexity
**Time:** O(n²) worst case  
**Space:** O(1) extra

### Thinking challenge
The two loops do not each scan the entire array independently, but the number of pairs still grows quadratically.

---

# DSP-051 — Improve Duplicate Detection

**Difficulty:** 3 — Intermediate  
**Skills:** Set, trade-offs, optimization

## Problem
Solve the duplicate-detection problem using a `Set`.

### Solution
```js
function hasDuplicateFast(numbers) {
  const seen = new Set();

  for (const number of numbers) {
    if (seen.has(number)) return true;
    seen.add(number);
  }

  return false;
}
```

### Tests
```js
hasDuplicateFast([1, 2, 3, 2]); // true
hasDuplicateFast([1, 2, 3]); // false
hasDuplicateFast([]); // false
hasDuplicateFast([9, 9]); // true
```

### Complexity
**Time:** O(n) average  
**Space:** O(n)

### Trade-off
We spend additional memory to reduce the expected search work.

That is the important engineering lesson: optimization often moves cost from one resource to another.

---

# DSP-052 — Binary Search Complexity

**Difficulty:** 3 — Intermediate  
**Skills:** binary search, logarithmic growth

## Problem
Implement binary search on an ascending sorted array and return the target index, or `-1` when absent.

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
binarySearch([1, 3, 5, 7, 9], 7); // 3
binarySearch([1, 3, 5, 7, 9], 2); // -1
binarySearch([], 4); // -1
binarySearch([5], 5); // 0
```

### Complexity
**Time:** O(log n)  
**Space:** O(1)

### Why
Each iteration discards roughly half of the remaining search space.

### Critical condition
The input must be sorted according to the comparison rule. Binary search is not a magic faster `find()`.

---

# DSP-053 — Compare Three Strategies

**Difficulty:** 4 — Challenging  
**Skills:** complexity comparison, algorithm selection

## Problem
You receive a sorted array and need to determine whether a target exists.

Compare these strategies:

1. linear scan;
2. binary search;
3. convert to a `Set` and use membership testing.

Then implement a function that uses binary search.

### Reference implementations

Linear scan:

```js
function containsLinear(numbers, target) {
  for (const number of numbers) {
    if (number === target) return true;
  }

  return false;
}
```

Binary search:

```js
function containsBinary(numbers, target) {
  let left = 0;
  let right = numbers.length - 1;

  while (left <= right) {
    const middle = Math.floor((left + right) / 2);

    if (numbers[middle] === target) return true;
    if (numbers[middle] < target) left = middle + 1;
    else right = middle - 1;
  }

  return false;
}
```

Set approach:

```js
function containsWithSet(numbers, target) {
  return new Set(numbers).has(target);
}
```

### Complexity discussion

| Strategy | Build cost | Query cost | Extra space |
|---|---:|---:|---:|
| Linear scan | none | O(n) | O(1) |
| Binary search | none if already sorted | O(log n) | O(1) |
| Build Set | O(n) average | O(1) average | O(n) |

### Engineering decision

- One query on unsorted data: a scan may be simplest.
- Many queries on already sorted data: binary search is attractive.
- Many membership queries where ordering is irrelevant: a `Set` can be attractive.

There is no universal winner. Requirements decide.

---

# Debugging Lab — The Loop That Lies

Consider:

```js
function countPairs(numbers, target) {
  let count = 0;

  for (let i = 0; i < numbers.length; i++) {
    for (let j = 0; j < numbers.length; i++) {
      if (numbers[i] + numbers[j] === target) count++;
    }
  }

  return count;
}
```

### Bug
The inner loop increments `i` instead of `j`.

### Corrected version
```js
function countPairs(numbers, target) {
  let count = 0;

  for (let i = 0; i < numbers.length; i++) {
    for (let j = 0; j < numbers.length; j++) {
      if (numbers[i] + numbers[j] === target) count++;
    }
  }

  return count;
}
```

### QA lesson
Complexity analysis does not replace correctness testing. An algorithm can be beautifully O(n²) and still be spectacularly wrong.

---

# Complexity Decision Lab

For each scenario, choose the most sensible approach and explain why.

### Scenario A
You need the first element of an array.

**Expected:** O(1) direct access.

### Scenario B
You need to find a target in a sorted array once.

**Expected:** binary search is a strong option when the implementation cost is justified.

### Scenario C
You need 100,000 membership checks against the same collection.

**Expected:** consider building a `Set` if its memory cost is acceptable.

### Scenario D
You need to compare every pair of students.

**Expected:** an O(n²) approach may be inherent to the requirement, although the exact problem may allow a smarter formulation.

---

# Module Assessment

Complete without looking at the solutions.

1. Explain O(1), O(log n), O(n), O(n log n), and O(n²) in plain language.
2. Analyze a function containing two sequential O(n) loops.
3. Analyze a function containing two nested loops.
4. Optimize duplicate detection with `Set`.
5. Explain the time/space trade-off introduced by the optimization.
6. Explain why binary search requires sorted data.
7. Given a real problem, justify an algorithm using both correctness and complexity.

## Rubric

| Skill | Points |
|---|---:|
| Correct complexity identification | 3 |
| Correct reasoning | 2 |
| Appropriate optimization | 2 |
| Trade-off explanation | 1 |
| Edge-case awareness | 1 |
| Clear engineering justification | 1 |
| **Total** | **10** |

### Mastery target
**8/10 or higher**, with no unresolved complexity misconception.

---

# Revision Checklist

- [ ] I understand what Big-O measures.
- [ ] I can recognize O(1).
- [ ] I can recognize O(log n).
- [ ] I can recognize O(n).
- [ ] I can recognize O(n log n).
- [ ] I can recognize O(n²).
- [ ] I can identify dominant work.
- [ ] I understand time/space trade-offs.
- [ ] I know when binary search applies.
- [ ] I can justify an optimization instead of optimizing blindly.
