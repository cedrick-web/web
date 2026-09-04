# Module 8 — Problem-Solving Lab

## Mission

Stop solving toy problems in isolation. This module puts the full DevSprint loop under pressure with realistic JavaScript tasks that combine reasoning, data structures, searching, sorting, testing, debugging, and complexity analysis.

> **DevSprint rule:** do not write code first. Define the problem, inputs, outputs, constraints, and strategy before implementation.

## Learning outcomes

By the end of this module, the learner should be able to:

- Translate realistic requirements into precise algorithmic tasks.
- Select data structures based on the operations the problem needs.
- Combine traversal, maps, sets, searching, sorting, and custom algorithms.
- Design edge cases before trusting a solution.
- Explain time and space complexity in practical terms.
- Debug solutions without randomly changing lines until the computer stops complaining.
- Compare a working solution with a better solution and justify the trade-off.

---

# DSP-054 — Student Score Analyzer

## Problem

A school stores student records as objects containing a name and score. Build an analyzer that returns the average score, highest-scoring student, lowest-scoring student, and the number of students who passed.

A passing score is **50 or higher**.

## Input

```js
[
  { name: "Aline", score: 78 },
  { name: "Eric", score: 62 },
  { name: "Kevin", score: 91 },
  { name: "Diane", score: 85 }
]
```

## Output

```js
{
  average: 79,
  highest: { name: "Kevin", score: 91 },
  lowest: { name: "Aline", score: 78 },
  passed: 4
}
```

## Constraints

- Scores are numbers from 0 to 100.
- An empty list should return `null`.
- Do not sort the entire list just to find the highest and lowest values.

## Hints

1. You need one traversal.
2. Keep a running total.
3. Track the highest and lowest record as you go.

## Reasoning

The required information can all be collected during one pass. Sorting would add unnecessary work because we only need the extremes, not a complete ranking.

## Pseudocode

```text
IF the list is empty
    RETURN null
SET total to 0
SET highest and lowest to the first student
SET passed to 0
FOR each student
    add score to total
    update highest if needed
    update lowest if needed
    increase passed when score >= 50
RETURN average, highest, lowest, passed
```

## Solution

```js
function analyzeScores(students) {
  if (students.length === 0) return null;

  let total = 0;
  let highest = students[0];
  let lowest = students[0];
  let passed = 0;

  for (const student of students) {
    total += student.score;
    if (student.score > highest.score) highest = student;
    if (student.score < lowest.score) lowest = student;
    if (student.score >= 50) passed++;
  }

  return {
    average: total / students.length,
    highest,
    lowest,
    passed
  };
}
```

## Tests

```js
analyzeScores([]) === null;
analyzeScores([{ name: "A", score: 50 }]).passed === 1;
analyzeScores([{ name: "A", score: 49 }, { name: "B", score: 50 }]).passed === 1;
```

## Complexity

- Time: **O(n)**
- Extra space: **O(1)**

## Extension

Add a `failed` count and a grade classification system without changing the overall complexity.

---

# DSP-055 — Transaction Duplicate Detector

## Problem

An online service receives transaction IDs. A transaction is considered duplicated if its ID has already appeared earlier in the same batch. Return the duplicated IDs in the order in which the duplicates are first detected.

## Example

```js
["TX1", "TX2", "TX1", "TX3", "TX2", "TX2"]
```

Output:

```js
["TX1", "TX2"]
```

## Constraints

- Preserve detection order.
- Do not report the same duplicate more than once.
- IDs are strings.

## Hints

Use one `Set` for IDs already seen and another `Set` for duplicates already reported.

## Reasoning

For every transaction, ask two questions: have I seen it, and have I already reported it? A set gives expected constant-time membership checks.

## Pseudocode

```text
CREATE seen set
CREATE duplicates set
CREATE result list
FOR each transaction ID
    IF ID is in seen AND ID is not in duplicates
        add ID to duplicates
        add ID to result
    add ID to seen
RETURN result
```

## Solution

```js
function findDuplicateTransactions(ids) {
  const seen = new Set();
  const duplicates = new Set();
  const result = [];

  for (const id of ids) {
    if (seen.has(id) && !duplicates.has(id)) {
      duplicates.add(id);
      result.push(id);
    }
    seen.add(id);
  }

  return result;
}
```

## Tests

```js
JSON.stringify(findDuplicateTransactions([])) === "[]";
JSON.stringify(findDuplicateTransactions(["A", "B", "C"])) === "[]";
JSON.stringify(findDuplicateTransactions(["A", "A", "A"])) === '["A"]';
JSON.stringify(findDuplicateTransactions(["A", "B", "A", "B"])) === '["A","B"]';
```

## Complexity

- Time: **O(n)** expected
- Extra space: **O(n)**

## Extension

Return an object containing the number of times each duplicated transaction ID occurred.

---

# DSP-056 — Inventory Search and Ranking

## Problem

An inventory contains products with a name, category, price, and stock count. Given a category and maximum price, return matching products sorted by **highest stock first**, then by **lowest price** when stock counts are equal.

## Example

```js
const products = [
  { name: "Keyboard", category: "hardware", price: 40, stock: 12 },
  { name: "Mouse", category: "hardware", price: 20, stock: 12 },
  { name: "Monitor", category: "hardware", price: 150, stock: 4 },
  { name: "Notebook", category: "office", price: 10, stock: 30 }
];
```

For category `hardware` and maximum price `100`, the result begins with Mouse because both Keyboard and Mouse have stock 12, but Mouse is cheaper.

## Reasoning

Filtering and ordering are separate concerns. First identify valid products, then sort the smaller result set using the required comparator.

## Pseudocode

```text
FILTER products where category matches AND price <= maximum price
SORT matches by stock descending
    IF stock is equal, price ascending
RETURN matches
```

## Solution

```js
function searchInventory(products, category, maxPrice) {
  return products
    .filter(product => product.category === category && product.price <= maxPrice)
    .sort((a, b) => b.stock - a.stock || a.price - b.price);
}
```

## Tests

```js
searchInventory([], "hardware", 100).length === 0;
searchInventory([
  { name: "A", category: "hardware", price: 10, stock: 5 },
  { name: "B", category: "hardware", price: 20, stock: 5 },
  { name: "C", category: "office", price: 5, stock: 99 }
], "hardware", 100)[0].name === "A";
```

## Complexity

If `n` products match after filtering, sorting costs **O(n log n)**. Overall expected complexity is **O(N + n log n)**.

## Extension

Add a third tie-breaker by product name alphabetically.

---

# DSP-057 — Appointment Conflict Detector

## Problem

A calendar contains appointments represented by start and end times in minutes after midnight. Determine whether any appointments overlap.

Two appointments that touch exactly at a boundary do **not** overlap. For example, `[60, 120]` and `[120, 180]` are valid back-to-back appointments.

## Example

```js
[
  { start: 60, end: 120 },
  { start: 120, end: 180 },
  { start: 170, end: 200 }
]
```

Output:

```js
true
```

## Hints

Sort appointments by start time. After sorting, compare each appointment with the previous one.

## Reasoning

Once appointments are ordered by start time, an overlap can only occur between neighboring appointments. This avoids comparing every pair.

## Pseudocode

```text
SORT appointments by start time
FOR each appointment after the first
    IF current start < previous end
        RETURN true
RETURN false
```

## Solution

```js
function hasAppointmentConflict(appointments) {
  const sorted = [...appointments].sort((a, b) => a.start - b.start);

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].start < sorted[i - 1].end) return true;
  }

  return false;
}
```

## Tests

```js
hasAppointmentConflict([]) === false;
hasAppointmentConflict([{ start: 60, end: 120 }]) === false;
hasAppointmentConflict([{ start: 60, end: 120 }, { start: 120, end: 180 }]) === false;
hasAppointmentConflict([{ start: 60, end: 120 }, { start: 100, end: 180 }]) === true;
```

## Complexity

- Time: **O(n log n)**
- Extra space: **O(n)** because a copy is sorted.

## Extension

Return the conflicting pair instead of only `true` or `false`.

---

# DSP-058 — Log Analyzer

## Problem

A server produces log entries containing a timestamp, level, and message. Count how many entries belong to each log level and return the most common level.

## Example

```js
[
  { level: "INFO", message: "Started" },
  { level: "ERROR", message: "Database failed" },
  { level: "INFO", message: "Retrying" },
  { level: "WARN", message: "Slow response" }
]
```

Output:

```js
{
  counts: { INFO: 2, ERROR: 1, WARN: 1 },
  mostCommon: "INFO"
}
```

## Constraints

- Empty input returns `{ counts: {}, mostCommon: null }`.
- Preserve the first level encountered when there is a tie for most common.

## Reasoning

A `Map` is ideal for frequency counting. Track the best level while counting so no second traversal is required.

## Pseudocode

```text
CREATE counts map
SET mostCommon to null
SET highestCount to 0
FOR each log entry
    increment count for its level
    IF count is greater than highestCount
        update mostCommon and highestCount
RETURN counts and mostCommon
```

## Solution

```js
function analyzeLogs(logs) {
  const counts = {};
  let mostCommon = null;
  let highestCount = 0;

  for (const log of logs) {
    counts[log.level] = (counts[log.level] || 0) + 1;

    if (counts[log.level] > highestCount) {
      highestCount = counts[log.level];
      mostCommon = log.level;
    }
  }

  return { counts, mostCommon };
}
```

## Tests

```js
JSON.stringify(analyzeLogs([])) === JSON.stringify({ counts: {}, mostCommon: null });
analyzeLogs([{ level: "INFO" }, { level: "ERROR" }, { level: "INFO" }]).mostCommon === "INFO";
analyzeLogs([{ level: "ERROR" }, { level: "INFO" }]).mostCommon === "ERROR";
```

## Complexity

- Time: **O(n)** expected
- Extra space: **O(k)** where `k` is the number of distinct levels.

## Extension

Add a function that returns the percentage of logs that are `ERROR`.

---

# DSP-059 — Top Performers With Stable Tie-Breaking

## Problem

Given student records, return the top `k` students ordered by score descending. When scores are equal, preserve the students' original order.

## Example

```js
const students = [
  { name: "Aline", score: 80 },
  { name: "Eric", score: 95 },
  { name: "Diane", score: 95 },
  { name: "Kevin", score: 70 }
];
```

For `k = 3`, return Eric, Diane, Aline.

## Reasoning

A simple solution can copy and sort the records, then take the first `k`. Attach the original index as a stable tie-breaker so the requirement is explicit rather than dependent on assumptions about sorting behavior.

## Pseudocode

```text
ATTACH each student with original index
SORT by score descending
    IF scores tie, index ascending
TAKE first k records
REMOVE helper index
RETURN students
```

## Solution

```js
function topStudents(students, k) {
  return students
    .map((student, index) => ({ student, index }))
    .sort((a, b) => b.student.score - a.student.score || a.index - b.index)
    .slice(0, Math.max(0, k))
    .map(item => item.student);
}
```

## Tests

```js
JSON.stringify(topStudents([], 3)) === "[]";
topStudents([{ name: "A", score: 90 }], 5).length === 1;
JSON.stringify(topStudents([
  { name: "A", score: 95 },
  { name: "B", score: 95 },
  { name: "C", score: 80 }
], 2).map(s => s.name)) === '["A","B"]';
```

## Complexity

- Time: **O(n log n)**
- Extra space: **O(n)**

## Extension

Design a more efficient approach when `k` is tiny compared with millions of students. Explain why a heap can help.

---

# DSP-060 — Final Integrated Challenge: Course Performance Report

## Problem

Build a function that receives student records containing:

- `name`
- `scores`: an array of numbers
- `attendance`: a percentage

A student **passes** when their average score is at least 50 **and** attendance is at least 75%.

Return a report containing:

1. Every student's average score.
2. The highest-performing student by average score.
3. The number of passing students.
4. Students who failed because of attendance.
5. A ranking ordered by average score descending, preserving original order for ties.

## Example input

```js
const students = [
  { name: "Aline", scores: [80, 70, 90], attendance: 90 },
  { name: "Eric", scores: [90, 85, 95], attendance: 60 },
  { name: "Kevin", scores: [60, 55, 65], attendance: 80 }
];
```

## Expected key results

- Aline average: `80`
- Eric average: `90`
- Kevin average: `60`
- Passing students: `2`
- Attendance failure: `Eric`
- Highest performer: `Eric`

## Constraints

- Empty input must return a valid empty report.
- A student with no scores has average `0`.
- Do not mutate the original input.
- Use clear helper functions instead of one enormous function.
- Include tests for boundary values such as score `50` and attendance `75`.

## Required approach

This challenge is intentionally integrative. The learner should demonstrate:

- decomposition into helper functions,
- array traversal,
- running totals,
- filtering,
- sorting with a comparator,
- stable tie handling,
- edge-case testing,
- complexity analysis.

## Suggested pseudocode

```text
CREATE helper average(scores)
    IF scores is empty RETURN 0
    RETURN total / number of scores

CREATE enriched student records containing average and original index
FOR each student
    calculate average
    determine pass/fail
    track attendance failures
    track highest performer
SORT enriched records by average descending
    if tied, original index ascending
BUILD final report
RETURN report
```

## Reference solution

```js
function coursePerformanceReport(students) {
  const enriched = [];
  const attendanceFailures = [];
  let highest = null;
  let passed = 0;

  for (let index = 0; index < students.length; index++) {
    const student = students[index];
    const scores = student.scores || [];
    const total = scores.reduce((sum, score) => sum + score, 0);
    const average = scores.length === 0 ? 0 : total / scores.length;
    const passes = average >= 50 && student.attendance >= 75;

    if (passes) passed++;
    if (average >= 50 && student.attendance < 75) {
      attendanceFailures.push(student.name);
    }

    const enrichedStudent = {
      name: student.name,
      average,
      attendance: student.attendance,
      passed: passes,
      index
    };

    enriched.push(enrichedStudent);

    if (highest === null || average > highest.average) {
      highest = enrichedStudent;
    }
  }

  const ranking = [...enriched]
    .sort((a, b) => b.average - a.average || a.index - b.index)
    .map(({ index, ...student }) => student);

  const highestResult = highest
    ? { name: highest.name, average: highest.average }
    : null;

  return {
    students: ranking,
    highest: highestResult,
    passed,
    attendanceFailures,
    ranking
  };
}
```

## Tests

```js
const report = coursePerformanceReport([
  { name: "Aline", scores: [80, 70, 90], attendance: 90 },
  { name: "Eric", scores: [90, 85, 95], attendance: 60 },
  { name: "Kevin", scores: [60, 55, 65], attendance: 80 }
]);

report.highest.name === "Eric";
report.passed === 2;
JSON.stringify(report.attendanceFailures) === '["Eric"]';
report.ranking[0].name === "Eric";

const boundary = coursePerformanceReport([
  { name: "Pass", scores: [50], attendance: 75 },
  { name: "FailAttendance", scores: [50], attendance: 74 },
  { name: "FailScore", scores: [49], attendance: 100 }
]);

boundary.passed === 1;
boundary.attendanceFailures.length === 1;
coursePerformanceReport([]).highest === null;
```

## Complexity

Let `N` be the number of students and `S` the total number of scores.

- Score processing: **O(S)**
- Ranking: **O(N log N)**
- Total: **O(S + N log N)**
- Extra space: **O(N)**

## Devil's advocate review

Could the ranking be made faster? Yes, depending on requirements. If the application only needs the top few students, a heap or selection-based approach may avoid a full sort. But a complete ranking genuinely requires ordering all students, so **O(N log N)** is a reasonable baseline.

Could everything be forced into one loop? Probably. That does not make it better. Readability, testability, and clear responsibilities matter in production software.

---

# Debugging Lab — The Vanishing Student

The following function is supposed to return students whose average score is at least 50, but it produces incorrect results.

```js
function passingStudents(students) {
  const result = [];

  for (const student of students) {
    let total = 0;

    for (const score of student.scores) {
      total += score;
    }

    const average = total / student.scores.length;

    if (average > 50) {
      result.push(student.name);
    }
  }

  return result;
}
```

## Task

Find the bug without rewriting the whole function.

## Diagnosis

The requirement says **50 or higher**, but the condition uses `> 50`. A student with exactly 50 is incorrectly excluded.

## Fix

```js
if (average >= 50) {
  result.push(student.name);
}
```

## Lesson

Many bugs are not syntax errors. The program runs perfectly while implementing the wrong rule. Tests must include boundary cases because computers are spectacularly obedient to incorrect instructions.

---

# Assessment Simulator

Complete the following without looking at the reference solutions.

## Task A — Explain before coding

Given an array of orders, each with `customerId` and `amount`, explain how you would find customers whose total spending exceeds 1,000.

Expected concepts:

- `Map` for accumulation,
- one traversal for totals,
- filtering or final traversal,
- complexity analysis.

## Task B — Choose the structure

You need to answer thousands of questions asking whether a username exists. Choose between an array, `Set`, and `Map`. Explain why.

## Task C — Complexity diagnosis

A developer compares every student with every other student to find duplicate names. Identify the likely complexity and propose a better strategy.

## Task D — Debugging

A binary search implementation sometimes loops forever. Explain which loop variables must change on every iteration and what boundary condition should terminate the search.

## Task E — Integrated build

Create a small report generator that accepts products, calculates total inventory value, finds the most valuable product, counts out-of-stock products, and returns products ordered by inventory value.

---

# Final Module Rubric

| Skill | 0 | 1 | 2 | 3 |
|---|---:|---:|---:|---:|
| Problem decomposition | Missing | Partial | Mostly clear | Precise |
| Algorithm choice | Incorrect | Weak | Reasonable | Well justified |
| JavaScript implementation | Broken | Major bugs | Minor bugs | Correct and clear |
| Edge cases | Missing | Few | Good | Deliberate and comprehensive |
| Testing | Missing | Basic | Good | Boundary + failure cases |
| Complexity | Missing | Incorrect | Mostly correct | Correct and justified |
| Debugging | Random edits | Finds symptoms | Finds cause | Explains cause and prevention |

**Target:** 17/21 or higher.

If the learner scores below 17, repeat the weak skill before moving to the final project.

---

# Revision Checklist

Before finishing Module 8, the learner should be able to say yes to all of these:

- [ ] I can turn a vague requirement into inputs, outputs, constraints, and rules.
- [ ] I can decompose a realistic task into smaller functions.
- [ ] I know when a `Map` or `Set` is better than repeated array searches.
- [ ] I can use sorting deliberately rather than automatically.
- [ ] I can protect the original input from accidental mutation.
- [ ] I test empty input and boundary values.
- [ ] I can explain why a solution is O(n), O(n log n), or O(n²).
- [ ] I can debug a logic error by tracing the requirement and state changes.
- [ ] I can compare a simple solution with a more efficient alternative.
- [ ] I can build an integrated problem-solving solution from scratch.

## Module completion standard

Do not measure completion by whether the learner read the pages. Measure it by whether they can solve a new problem without immediately searching for the answer.

That is the actual skill being sold.