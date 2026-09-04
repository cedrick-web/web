# Final Project — Student Performance Analyzer

## Project purpose

Build a small JavaScript application that turns raw student records into a useful performance report.

This is the capstone for the **JavaScript Problem-Solving & DSA Toolkit**. The goal is not to produce the fanciest interface. The goal is to demonstrate that you can take requirements, design an algorithm, choose data structures, implement it, test it, debug it, and explain its complexity.

## Scenario

A school has student performance data and wants a lightweight report generator for teachers.

The application receives records like:

```js
const students = [
  { name: "Aline", scores: [78, 82, 91], attendance: 92 },
  { name: "Eric", scores: [55, 61, 58], attendance: 81 },
  { name: "Kevin", scores: [92, 88, 95], attendance: 73 },
  { name: "Diane", scores: [45, 51, 49], attendance: 88 }
];
```

## Core rules

A student passes when:

- average score is **50 or higher**, and
- attendance is **75% or higher**.

A student can therefore fail because of low scores, low attendance, or both.

---

# Required features

## 1. Calculate averages

For every student, calculate the average of their scores.

Students with no scores must receive an average of `0` rather than producing `NaN`.

## 2. Highest and lowest performer

Identify the highest and lowest student by average score.

Do not sort the entire dataset just to find these two values.

## 3. Pass/fail classification

Add a `passed` boolean according to the rules.

Example:

```js
{
  name: "Aline",
  average: 83.67,
  attendance: 92,
  passed: true
}
```

## 4. Search

Implement a function that searches for a student by exact name.

Expected behavior:

```js
findStudent(students, "Aline")
```

returns the matching student or `null` when no match exists.

## 5. Ranking

Return students ordered by:

1. average score descending;
2. original input order when averages are equal.

The original input array must not be mutated.

## 6. Attendance-risk report

Return the names of students who have an average of at least 50 but attendance below 75%.

These students are academically performing but fail the overall rule because of attendance.

## 7. Summary statistics

Return:

- total students,
- passing students,
- failing students,
- average score across all students,
- highest performer,
- lowest performer.

---

# Recommended architecture

Do not put everything into one 150-line function. Humans already invented spaghetti; your project does not need to preserve the tradition.

Use small functions with clear responsibilities:

```text
calculateAverage(scores)
        ↓
enrichStudent(student)
        ↓
buildStudentReport(students)
        ↓
├── findStudent(...)
├── rankStudents(...)
├── getAttendanceRisks(...)
└── buildSummary(...)
```

A reasonable file structure is:

```text
student-performance-analyzer/
├── src/
│   ├── analyzer.js
│   ├── search.js
│   ├── ranking.js
│   └── index.js
├── tests/
│   └── analyzer.test.js
└── README.md
```

For the toolkit version, a single JavaScript file is also acceptable if the functions remain clearly separated.

---

# Development milestones

## Milestone 1 — Understand the requirements

Write down:

- inputs,
- outputs,
- business rules,
- constraints,
- edge cases.

Do this before coding.

### Acceptance check

You can explain the pass/fail rule without looking at the prompt.

---

## Milestone 2 — Build the smallest useful function

Implement:

```js
function calculateAverage(scores) {
  // your implementation
}
```

Test:

```js
calculateAverage([80, 90]) === 85;
calculateAverage([50]) === 50;
calculateAverage([]) === 0;
```

### Acceptance check

No division-by-zero bug and no `NaN` for empty input.

---

## Milestone 3 — Enrich student records

Create a function that calculates each student's average and pass/fail state.

Example output:

```js
{
  name: "Aline",
  average: 83.67,
  attendance: 92,
  passed: true
}
```

Keep the original input objects unchanged.

---

## Milestone 4 — Add search

Implement exact-name search.

Test:

```js
findStudent(students, "Aline");
findStudent(students, "Nobody");
findStudent([], "Aline");
```

Expected missing result: `null`.

---

## Milestone 5 — Add ranking

Implement ranking by average descending.

For equal averages, preserve original order.

Test explicitly with:

```js
[
  { name: "A", scores: [80], attendance: 90 },
  { name: "B", scores: [80], attendance: 90 },
  { name: "C", scores: [70], attendance: 90 }
]
```

Expected order: `A`, `B`, `C`.

---

## Milestone 6 — Add summary and attendance analysis

Calculate the remaining report fields.

Avoid unnecessary repeated traversals where a clean single pass can collect information safely.

---

## Milestone 7 — Test the whole system

Your tests must include:

### Normal case

Several students with different scores and attendance.

### Empty input

```js
[]
```

### One student

The highest and lowest student are the same person.

### Boundary score

Average exactly `50` must pass the score rule.

### Boundary attendance

Attendance exactly `75` must pass the attendance rule.

### Just below boundaries

`49.99` or an equivalent exact test case should fail the score rule, and `74.99` should fail the attendance rule.

### No scores

A student with `scores: []` must receive average `0`.

### Equal averages

Original order must remain stable.

### Missing student

Search should return `null`.

---

# Suggested implementation

The following is a reference implementation. Attempt the project yourself before reading it.

```js
function calculateAverage(scores) {
  if (scores.length === 0) return 0;
  const total = scores.reduce((sum, score) => sum + score, 0);
  return total / scores.length;
}

function enrichStudent(student, index) {
  const average = calculateAverage(student.scores || []);

  return {
    name: student.name,
    average,
    attendance: student.attendance,
    passed: average >= 50 && student.attendance >= 75,
    index
  };
}

function findStudent(students, name) {
  return students.find(student => student.name === name) || null;
}

function rankStudents(students) {
  return students
    .map((student, index) => enrichStudent(student, index))
    .sort((a, b) => b.average - a.average || a.index - b.index)
    .map(({ index, ...student }) => student);
}

function buildStudentReport(students) {
  const enriched = [];
  const attendanceRisks = [];
  let totalScore = 0;
  let totalScoreCount = 0;
  let highest = null;
  let lowest = null;
  let passed = 0;

  for (let index = 0; index < students.length; index++) {
    const enrichedStudent = enrichStudent(students[index], index);
    enriched.push(enrichedStudent);

    const scores = students[index].scores || [];
    totalScore += scores.reduce((sum, score) => sum + score, 0);
    totalScoreCount += scores.length;

    if (enrichedStudent.passed) passed++;

    if (
      enrichedStudent.average >= 50 &&
      enrichedStudent.attendance < 75
    ) {
      attendanceRisks.push(enrichedStudent.name);
    }

    if (highest === null || enrichedStudent.average > highest.average) {
      highest = enrichedStudent;
    }

    if (lowest === null || enrichedStudent.average < lowest.average) {
      lowest = enrichedStudent;
    }
  }

  const ranking = [...enriched]
    .sort((a, b) => b.average - a.average || a.index - b.index)
    .map(({ index, ...student }) => student);

  return {
    totalStudents: students.length,
    passed,
    failed: students.length - passed,
    overallAverage: totalScoreCount === 0 ? 0 : totalScore / totalScoreCount,
    highest: highest
      ? { name: highest.name, average: highest.average }
      : null,
    lowest: lowest
      ? { name: lowest.name, average: lowest.average }
      : null,
    attendanceRisks,
    ranking
  };
}
```

---

# Test specification

A strong implementation should pass tests equivalent to:

```js
const students = [
  { name: "Aline", scores: [78, 82, 91], attendance: 92 },
  { name: "Eric", scores: [55, 61, 58], attendance: 81 },
  { name: "Kevin", scores: [92, 88, 95], attendance: 73 },
  { name: "Diane", scores: [45, 51, 49], attendance: 88 }
];

const report = buildStudentReport(students);

console.assert(report.totalStudents === 4);
console.assert(report.passed === 2);
console.assert(report.failed === 2);
console.assert(report.highest.name === "Kevin");
console.assert(report.lowest.name === "Diane");
console.assert(report.attendanceRisks.includes("Kevin"));
console.assert(report.ranking[0].name === "Kevin");
console.assert(findStudent(students, "Aline").name === "Aline");
console.assert(findStudent(students, "Unknown") === null);
console.assert(buildStudentReport([]).highest === null);
console.assert(buildStudentReport([]).overallAverage === 0);
```

---

# Complexity analysis

Let:

- `N` = number of students,
- `S` = total number of individual scores.

Score processing requires **O(S)** work.

Building student records requires **O(N)** additional work.

Ranking requires **O(N log N)** because of sorting.

Therefore the overall complexity is:

**Time: O(S + N log N)**

**Space: O(N)** for enriched records and the ranking copy.

Search with a simple array traversal is **O(N)**.

If the application performs many repeated name searches, a `Map` indexed by name could reduce expected lookup time to **O(1)** after an **O(N)** construction step. That is an optimization decision, not a law handed down from the algorithm gods.

---

# Required student explanation

When submitting the project, explain these questions in your README:

1. Why did you calculate averages before ranking?
2. Why should the original input remain unchanged?
3. Why is finding the highest student different from ranking every student?
4. Why is ranking O(N log N)?
5. When would a `Map` be better than an array for student search?
6. Which edge case was easiest to miss?
7. What bug did you encounter and how did your test expose it?
8. What would you change if the dataset contained one million students?

---

# Stretch goals

These are deliberately outside the minimum requirements.

- Add grade letters A–F.
- Filter students by pass/fail state.
- Search by partial name.
- Add category-specific averages.
- Export the report as JSON.
- Build a small browser UI.
- Add pagination to a large ranking.
- Add a `Map`-based search index.
- Add automated tests using a JavaScript test framework.
- Add a performance benchmark comparing array search and map lookup.

Do not build every stretch goal before the core project works. Feature accumulation is not the same thing as progress.

---

# Final assessment rubric

| Category | Points |
|---|---:|
| Requirement understanding | 10 |
| Problem decomposition | 15 |
| Correct JavaScript | 20 |
| Data-structure/algorithm choices | 10 |
| Edge-case handling | 10 |
| Automated/manual tests | 15 |
| Complexity explanation | 10 |
| Code quality | 10 |
| **Total** | **100** |

### Passing standard

- **90–100:** Excellent. Ready for a harder project.
- **80–89:** Strong. Fix small weaknesses.
- **70–79:** Functional but needs revision.
- **60–69:** Major gaps remain.
- **Below 60:** Repeat the relevant modules before moving forward.

## Definition of done

The final project is complete only when:

- [ ] All core features work.
- [ ] Empty input works.
- [ ] Boundary conditions work.
- [ ] The original input is not mutated.
- [ ] Search handles missing students.
- [ ] Ranking handles ties correctly.
- [ ] Tests cover normal and edge cases.
- [ ] Complexity is documented.
- [ ] The student can explain every major function without copying the explanation.

**The real graduation test:** given a new but related dataset, can you design the solution yourself before searching for someone else's code?
