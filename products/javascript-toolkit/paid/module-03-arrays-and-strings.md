# Module 3 — Arrays & Strings

## Mission

Turn the two most common problem-solving inputs, arrays and strings, into reliable algorithmic tools.

This module focuses on patterns rather than memorizing isolated tricks: traversal, running state, frequency counting, two pointers, sliding-window thinking, normalization, and combining structures.

## Learning outcomes

By the end, the learner can:

- traverse arrays and strings deliberately;
- track a running answer without unnecessary nested loops;
- compare values from both ends with two pointers;
- build frequency maps for strings and arrays;
- normalize messy text before processing it;
- recognize when a sliding window is useful;
- merge sorted data safely;
- explain time and space complexity;
- test edge cases before trusting a solution.

## Pattern map

| Pattern | Typical use |
|---|---|
| Single traversal | min/max, running totals, filtering |
| Running state | best-so-far, cumulative values |
| Frequency map | counts, duplicates, anagrams |
| Two pointers | comparisons from both ends, sorted arrays |
| Sliding window | contiguous ranges/substrings |
| Normalization | case/space/punctuation-insensitive text |
| Merge pointers | combining sorted arrays |

---

# DSP-013 — Find the Minimum Number

**Difficulty:** 1 — Basic  
**Skills:** array traversal, comparison, initialization

### Problem
Return the smallest number in a non-empty array.

### Input
`numbers`: non-empty array of numbers.

### Output
The smallest number.

### Constraints
- `numbers.length >= 1`
- Values may be positive, zero, or negative.

### Examples

```text
[8, 3, 15, 6] → 3
[-4, -9, -2] → -9
[7] → 7
```

### Hint
Keep the smallest value seen so far.

### Reasoning
Start with the first value. Scan the rest. Whenever a smaller value appears, replace the current minimum.

### Pseudocode

```text
minimum = first number
FOR each remaining number
    IF number < minimum
        minimum = number
RETURN minimum
```

### Solution

```js
function findMinimum(numbers) {
  let minimum = numbers[0];

  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] < minimum) {
      minimum = numbers[i];
    }
  }

  return minimum;
}
```

### Tests

```js
console.assert(findMinimum([8, 3, 15, 6]) === 3);
console.assert(findMinimum([-4, -9, -2]) === -9);
console.assert(findMinimum([7]) === 7);
console.assert(findMinimum([0, 0, 5]) === 0);
```

### Edge cases
Single item, duplicate minimums, all negative values, zero.

### Complexity
- Time: `O(n)`
- Extra space: `O(1)`

### Extension
Return both the minimum value and its first index.

---

# DSP-014 — Running Total

**Difficulty:** 1 — Basic  
**Skills:** traversal, accumulator

### Problem
Return an array where each position contains the sum of all values up to that position.

### Examples

```text
[2, 4, 3] → [2, 6, 9]
[5] → [5]
[] → []
```

### Hint
Keep a `total` variable and append it after each number.

### Pseudocode

```text
result = empty array
 total = 0
FOR each number
    total = total + number
    append total to result
RETURN result
```

### Solution

```js
function runningTotals(numbers) {
  const result = [];
  let total = 0;

  for (const number of numbers) {
    total += number;
    result.push(total);
  }

  return result;
}
```

### Tests

```js
console.assert(JSON.stringify(runningTotals([2, 4, 3])) === JSON.stringify([2, 6, 9]));
console.assert(JSON.stringify(runningTotals([5])) === JSON.stringify([5]));
console.assert(JSON.stringify(runningTotals([])) === JSON.stringify([]));
console.assert(JSON.stringify(runningTotals([-2, 5, -1])) === JSON.stringify([-2, 3, 2]));
```

### Edge cases
Empty input, negatives, zeros.

### Complexity
- Time: `O(n)`
- Extra space: `O(n)` for the result.

### Extension
Create an in-place version and explain the trade-off.

---

# DSP-015 — Count Character Frequencies

**Difficulty:** 2 — Beginner  
**Skills:** strings, frequency map, objects

### Problem
Return an object containing the number of times each character occurs. Treat uppercase and lowercase letters as different characters.

### Examples

```text
"banana" → { b: 1, a: 3, n: 2 }
"Aa" → { A: 1, a: 1 }
```

### Hint
For every character, increment its existing count or start it at `1`.

### Pseudocode

```text
counts = empty map
FOR each character
    IF character not in counts
        counts[character] = 0
    counts[character] += 1
RETURN counts
```

### Solution

```js
function characterFrequency(text) {
  const counts = {};

  for (const char of text) {
    counts[char] = (counts[char] ?? 0) + 1;
  }

  return counts;
}
```

### Tests

```js
console.assert(JSON.stringify(characterFrequency("banana")) === JSON.stringify({ b: 1, a: 3, n: 2 }));
console.assert(JSON.stringify(characterFrequency("Aa")) === JSON.stringify({ A: 1, a: 1 }));
console.assert(JSON.stringify(characterFrequency("")) === JSON.stringify({}));
```

### Edge cases
Empty string, spaces, punctuation, mixed case.

### Complexity
- Time: `O(n)`
- Extra space: `O(k)`, where `k` is the number of distinct characters.

### Extension
Create a case-insensitive version.

---

# DSP-016 — Valid Palindrome

**Difficulty:** 2 — Beginner  
**Skills:** strings, two pointers, normalization

### Problem
Return `true` when a string reads the same forward and backward after converting letters to lowercase and ignoring non-alphanumeric characters.

### Examples

```text
"Race car" → true
"hello" → false
"A man, a plan, a canal: Panama" → true
```

### Hint
Normalize first, then compare characters from both ends.

### Pseudocode

```text
normalized = lowercase text with non-alphanumeric characters removed
left = 0
right = last index
WHILE left < right
    IF normalized[left] != normalized[right]
        RETURN false
    move left forward
    move right backward
RETURN true
```

### Solution

```js
function isPalindrome(text) {
  const normalized = text.toLowerCase().replace(/[^a-z0-9]/g, '');
  let left = 0;
  let right = normalized.length - 1;

  while (left < right) {
    if (normalized[left] !== normalized[right]) return false;
    left++;
    right--;
  }

  return true;
}
```

### Tests

```js
console.assert(isPalindrome("Race car") === true);
console.assert(isPalindrome("hello") === false);
console.assert(isPalindrome("A man, a plan, a canal: Panama") === true);
console.assert(isPalindrome("") === true);
console.assert(isPalindrome("!!!") === true);
```

### Edge cases
Empty input, punctuation-only input, one character, mixed case.

### Complexity
- Time: `O(n)`
- Extra space: `O(n)` because normalization creates a new string.

### Extension
Design a version that avoids creating the normalized copy by moving the two pointers over the original string.

---

# DSP-017 — Check for an Anagram

**Difficulty:** 2 — Beginner  
**Skills:** strings, frequency counting

### Problem
Return `true` if two strings contain the same characters with the same frequencies. Ignore spaces and letter case.

### Examples

```text
"listen", "silent" → true
"hello", "world" → false
"Dormitory", "Dirty room" → true
```

### Hint
Normalize both strings and compare their frequency maps.

### Pseudocode

```text
normalize both strings
IF lengths differ
    RETURN false
count characters in first string
FOR each character in second string
    decrease its count
    IF count becomes invalid
        RETURN false
RETURN true
```

### Solution

```js
function areAnagrams(first, second) {
  const a = first.toLowerCase().replace(/\s/g, '');
  const b = second.toLowerCase().replace(/\s/g, '');

  if (a.length !== b.length) return false;

  const counts = new Map();

  for (const char of a) {
    counts.set(char, (counts.get(char) ?? 0) + 1);
  }

  for (const char of b) {
    const count = counts.get(char) ?? 0;
    if (count === 0) return false;
    counts.set(char, count - 1);
  }

  return true;
}
```

### Tests

```js
console.assert(areAnagrams("listen", "silent") === true);
console.assert(areAnagrams("hello", "world") === false);
console.assert(areAnagrams("Dormitory", "Dirty room") === true);
console.assert(areAnagrams("a", "A") === true);
console.assert(areAnagrams("ab", "aa") === false);
```

### Edge cases
Empty strings, different lengths, repeated characters, spaces and case.

### Complexity
- Time: `O(n)`
- Extra space: `O(k)`.

### Extension
Decide whether punctuation should also be ignored and document the rule.

---

# DSP-018 — Merge Two Sorted Arrays

**Difficulty:** 3 — Intermediate  
**Skills:** arrays, two pointers, sorted data

### Problem
Merge two arrays already sorted in ascending order into one sorted array without calling `.sort()`.

### Examples

```text
[1, 4, 7], [2, 3, 6] → [1, 2, 3, 4, 6, 7]
[], [1, 2] → [1, 2]
```

### Hint
Keep one pointer for each input and always take the smaller current value.

### Pseudocode

```text
left = 0
right = 0
result = empty array
WHILE both arrays still have values
    append smaller current value
    move that pointer
append remaining values from either array
RETURN result
```

### Solution

```js
function mergeSortedArrays(first, second) {
  const result = [];
  let i = 0;
  let j = 0;

  while (i < first.length && j < second.length) {
    if (first[i] <= second[j]) {
      result.push(first[i]);
      i++;
    } else {
      result.push(second[j]);
      j++;
    }
  }

  while (i < first.length) result.push(first[i++]);
  while (j < second.length) result.push(second[j++]);

  return result;
}
```

### Tests

```js
console.assert(JSON.stringify(mergeSortedArrays([1, 4, 7], [2, 3, 6])) === JSON.stringify([1, 2, 3, 4, 6, 7]));
console.assert(JSON.stringify(mergeSortedArrays([], [1, 2])) === JSON.stringify([1, 2]));
console.assert(JSON.stringify(mergeSortedArrays([1, 1], [1])) === JSON.stringify([1, 1, 1]));
console.assert(JSON.stringify(mergeSortedArrays([-3, 0], [-2, 4])) === JSON.stringify([-3, -2, 0, 4]));
```

### Edge cases
Empty arrays, duplicates, negative values.

### Complexity
- Time: `O(n + m)`
- Extra space: `O(n + m)` for the result.

### Extension
Merge in a way that minimizes extra allocation when the first array has spare capacity.

---

# DSP-019 — Move All Negative Numbers to the Front

**Difficulty:** 3 — Intermediate  
**Skills:** arrays, partitioning, two pointers

### Problem
Return a new array with all negative numbers before non-negative numbers. Preserve the relative order within each group.

### Examples

```text
[3, -1, 4, -2, 0] → [-1, -2, 3, 4, 0]
```

### Hint
Build two groups during one traversal.

### Pseudocode

```text
negative = empty array
nonNegative = empty array
FOR each number
    IF number < 0
        append to negative
    ELSE
        append to nonNegative
RETURN negative followed by nonNegative
```

### Solution

```js
function negativesFirst(numbers) {
  const negative = [];
  const nonNegative = [];

  for (const number of numbers) {
    if (number < 0) negative.push(number);
    else nonNegative.push(number);
  }

  return [...negative, ...nonNegative];
}
```

### Tests

```js
console.assert(JSON.stringify(negativesFirst([3, -1, 4, -2, 0])) === JSON.stringify([-1, -2, 3, 4, 0]));
console.assert(JSON.stringify(negativesFirst([-3, -2])) === JSON.stringify([-3, -2]));
console.assert(JSON.stringify(negativesFirst([1, 2])) === JSON.stringify([1, 2]));
console.assert(JSON.stringify(negativesFirst([])) === JSON.stringify([]));
```

### Edge cases
Empty input, all negative, no negative, zeros.

### Complexity
- Time: `O(n)`
- Extra space: `O(n)`.

### Extension
Compare this stable solution with an in-place partitioning approach and explain what changes.

---

# DSP-020 — Maximum Sum of a Fixed Window

**Difficulty:** 3 — Intermediate  
**Skills:** sliding window, running state

### Problem
Given an array and a window size `k`, return the largest sum of any contiguous block of exactly `k` values.

### Constraints
- `1 <= k <= numbers.length`

### Examples

```text
[2, 1, 5, 1, 3, 2], k=3 → 9
[4, 2, 1], k=1 → 4
```

### Hint
Calculate the first window once. Then slide by adding the new value and removing the value leaving the window.

### Pseudocode

```text
windowSum = sum of first k values
best = windowSum
FOR each index from k to end
    windowSum += incoming value
    windowSum -= outgoing value
    best = maximum(best, windowSum)
RETURN best
```

### Solution

```js
function maxWindowSum(numbers, k) {
  let windowSum = 0;

  for (let i = 0; i < k; i++) {
    windowSum += numbers[i];
  }

  let best = windowSum;

  for (let i = k; i < numbers.length; i++) {
    windowSum += numbers[i] - numbers[i - k];
    best = Math.max(best, windowSum);
  }

  return best;
}
```

### Tests

```js
console.assert(maxWindowSum([2, 1, 5, 1, 3, 2], 3) === 9);
console.assert(maxWindowSum([4, 2, 1], 1) === 4);
console.assert(maxWindowSum([-5, -2, -7], 2) === -7);
console.assert(maxWindowSum([6], 1) === 6);
```

### Edge cases
`k = 1`, `k = n`, all negative values.

### Complexity
- Time: `O(n)`
- Extra space: `O(1)`.

### Extension
Build a function that returns the starting index of the best window.

---

# DSP-021 — Longest Substring Without Repeating Characters

**Difficulty:** 4 — Challenging  
**Skills:** strings, sliding window, Set, pointers

### Problem
Return the length of the longest substring containing no repeated characters.

### Examples

```text
"abcabcbb" → 3
"bbbbb" → 1
"pwwkew" → 3
"" → 0
```

### Hint
Maintain a moving window. When a duplicate appears, move the left side until the duplicate is outside the window.

### Pseudocode

```text
seen = empty set
left = 0
best = 0
FOR right from 0 to end
    WHILE current character is already seen
        remove character at left
        left++
    add current character
    best = maximum(best, window length)
RETURN best
```

### Solution

```js
function longestUniqueSubstring(text) {
  const seen = new Set();
  let left = 0;
  let best = 0;

  for (let right = 0; right < text.length; right++) {
    while (seen.has(text[right])) {
      seen.delete(text[left]);
      left++;
    }

    seen.add(text[right]);
    best = Math.max(best, right - left + 1);
  }

  return best;
}
```

### Tests

```js
console.assert(longestUniqueSubstring("abcabcbb") === 3);
console.assert(longestUniqueSubstring("bbbbb") === 1);
console.assert(longestUniqueSubstring("pwwkew") === 3);
console.assert(longestUniqueSubstring("") === 0);
console.assert(longestUniqueSubstring("abcd") === 4);
```

### Edge cases
Empty input, all repeated characters, all unique characters, spaces.

### Complexity
- Time: `O(n)` because each character enters and leaves the set at most once.
- Extra space: `O(k)` for the active character set.

### Extension
Return the actual longest substring, not only its length.

---

# DSP-022 — Compress Consecutive Characters

**Difficulty:** 3 — Intermediate  
**Skills:** strings, run tracking, output construction

### Problem
Compress consecutive repeated characters into character-count pairs. For example, `aaabbc` becomes `a3b2c1`.

### Examples

```text
"aaabbc" → "a3b2c1"
"abcd" → "a1b1c1d1"
"" → ""
```

### Hint
Track the current character and its count. Flush the group when the character changes.

### Pseudocode

```text
IF text is empty
    RETURN empty string
result = empty
count = 1
FOR each character from index 1
    IF same as previous
        count++
    ELSE
        append previous character + count
        count = 1
append final character + count
RETURN result
```

### Solution

```js
function compressRuns(text) {
  if (text.length === 0) return '';

  let result = '';
  let count = 1;

  for (let i = 1; i <= text.length; i++) {
    if (text[i] === text[i - 1]) {
      count++;
    } else {
      result += text[i - 1] + count;
      count = 1;
    }
  }

  return result;
}
```

### Tests

```js
console.assert(compressRuns("aaabbc") === "a3b2c1");
console.assert(compressRuns("abcd") === "a1b1c1d1");
console.assert(compressRuns("") === "");
console.assert(compressRuns("aaaa") === "a4");
```

### Edge cases
Empty string, one character, one long run, alternating characters.

### Complexity
- Time: `O(n)`
- Extra space: `O(n)` for output.

### Extension
Create a decompression function for the output format.

---

# DSP-023 — Rotate an Array Right

**Difficulty:** 3 — Intermediate  
**Skills:** arrays, modulo, index mapping

### Problem
Return a new array containing the input rotated to the right by `k` positions. If `k` is larger than the array length, wrap around.

### Examples

```text
[1, 2, 3, 4, 5], k=2 → [4, 5, 1, 2, 3]
[1, 2, 3], k=5 → [2, 3, 1]
```

### Hint
Reduce `k` with modulo. An element at index `i` moves to `(i + k) % n`.

### Pseudocode

```text
IF array is empty
    RETURN empty array
shift = k modulo array length
result = array of same length
FOR each index i
    newIndex = (i + shift) modulo length
    result[newIndex] = numbers[i]
RETURN result
```

### Solution

```js
function rotateRight(numbers, k) {
  if (numbers.length === 0) return [];

  const shift = k % numbers.length;
  const result = new Array(numbers.length);

  for (let i = 0; i < numbers.length; i++) {
    result[(i + shift) % numbers.length] = numbers[i];
  }

  return result;
}
```

### Tests

```js
console.assert(JSON.stringify(rotateRight([1, 2, 3, 4, 5], 2)) === JSON.stringify([4, 5, 1, 2, 3]));
console.assert(JSON.stringify(rotateRight([1, 2, 3], 5)) === JSON.stringify([2, 3, 1]));
console.assert(JSON.stringify(rotateRight([], 4)) === JSON.stringify([]));
console.assert(JSON.stringify(rotateRight([7], 99)) === JSON.stringify([7]));
```

### Edge cases
Empty array, one element, `k = 0`, `k > n`.

### Complexity
- Time: `O(n)`
- Extra space: `O(n)`.

### Extension
Implement an in-place rotation with `O(1)` extra space using the reversal technique.

---

# DSP-024 — Find the Longest Consecutive Increasing Run

**Difficulty:** 4 — Challenging  
**Skills:** arrays, running state, sequence detection

### Problem
Return the length of the longest contiguous run where every next number is strictly greater than the previous number.

### Examples

```text
[1, 2, 3, 2, 4, 5, 6] → 3
[5, 4, 3] → 1
[1, 2, 2, 3] → 2
```

### Hint
Track the current increasing run and the best run seen so far. Equal values break a strictly increasing run.

### Pseudocode

```text
IF array is empty
    RETURN 0
current = 1
best = 1
FOR i from 1 to end
    IF numbers[i] > numbers[i - 1]
        current++
    ELSE
        current = 1
    best = maximum(best, current)
RETURN best
```

### Solution

```js
function longestIncreasingRun(numbers) {
  if (numbers.length === 0) return 0;

  let current = 1;
  let best = 1;

  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] > numbers[i - 1]) {
      current++;
    } else {
      current = 1;
    }

    best = Math.max(best, current);
  }

  return best;
}
```

### Tests

```js
console.assert(longestIncreasingRun([1, 2, 3, 2, 4, 5, 6]) === 3);
console.assert(longestIncreasingRun([5, 4, 3]) === 1);
console.assert(longestIncreasingRun([1, 2, 2, 3]) === 2);
console.assert(longestIncreasingRun([]) === 0);
console.assert(longestIncreasingRun([1, 2, 3, 4]) === 4);
```

### Edge cases
Empty array, one element, all decreasing, duplicates, all increasing.

### Complexity
- Time: `O(n)`
- Extra space: `O(1)`.

### Extension
Return the actual start and end indices of the longest run. If tied, return the earliest run.

---

# Module 3 Debugging Lab — The Wrong Pattern

A developer writes:

```js
function maxWindowSum(numbers, k) {
  let best = 0;

  for (let i = 0; i <= numbers.length - k; i++) {
    let sum = 0;
    for (let j = i; j < i + k; j++) {
      sum += numbers[j];
    }
    best = Math.max(best, sum);
  }

  return best;
}
```

### Tasks

1. Find the hidden correctness bug when all window sums are negative.
2. Identify the complexity of this implementation.
3. Replace it with the sliding-window solution from DSP-020.
4. Explain why the optimized version does not repeatedly sum the same values.

### Expected lesson
A solution can be correct on common positive examples and still fail edge cases. Passing one happy-path test is not evidence of correctness. Humanity has suffered enough from software that “worked on my machine.”

---

# Module 3 Assessment

## Part A — Pattern recognition

For each problem, choose the strongest first pattern:

1. Find whether two strings contain the same character frequencies.
2. Find the largest sum among every contiguous block of size `k`.
3. Merge two already sorted arrays.
4. Compare a string from both ends.
5. Find the longest substring with no repeated character.

Expected patterns: frequency map, sliding window, two-pointer merge, two pointers, sliding window + Set.

## Part B — Implementation

Complete one of these without looking at the solution:

- DSP-018 Merge Two Sorted Arrays
- DSP-020 Maximum Sum of a Fixed Window
- DSP-021 Longest Substring Without Repeating Characters

## Part C — Complexity

Explain why DSP-020 improves on the nested-loop version from the debugging lab.

## Part D — Edge-case design

Write at least four tests for a function you choose. Include an empty or minimal input where valid, a normal input, an edge case, and a case designed to break a common incorrect implementation.

## Assessment rubric

| Area | Pass standard |
|---|---|
| Pattern recognition | Correctly identifies the main pattern in 4/5 cases |
| Implementation | Produces correct output for representative and edge tests |
| Complexity | Correctly explains time and extra space |
| Testing | Creates meaningful edge cases, not duplicate happy paths |
| Reasoning | Can explain why the algorithm works |

---

# Module 3 Revision Checklist

Before marking the module complete, the learner should be able to:

- [ ] Traverse arrays and strings deliberately.
- [ ] Maintain a running result.
- [ ] Build a frequency map.
- [ ] Normalize text before comparison.
- [ ] Use two pointers when the problem structure supports it.
- [ ] Explain the fixed-window sliding-window pattern.
- [ ] Merge sorted arrays without `.sort()`.
- [ ] Recognize repeated-work problems that can be optimized.
- [ ] Write edge-case tests.
- [ ] State time and space complexity.
- [ ] Explain the solution without reading the answer.

## Completion rule

The module is complete only when the learner can solve at least **4 of the 5 assessment tasks**, including one implementation task, without copying the solution and can explain the chosen algorithm in plain language.
