# DevSprint Test Guide

Testing is how you stop trusting your own assumptions.

## Minimum test set

For every challenge, include:

1. A normal case.
2. A smallest valid case.
3. An empty-input case when the contract allows it.
4. Negative or zero values when relevant.
5. Duplicate values when relevant.
6. A boundary case.
7. A case that should fail or return the documented empty result.

## JavaScript assertions

```js
console.assert(actual === expected);
```

For arrays or objects, compare the relevant fields or use a small helper rather than assuming reference equality means identical content.

## Regression testing

Whenever you fix a bug:

- keep the failing input;
- add it to the test set;
- rerun previous tests;
- confirm the original failure is gone.

## Complexity testing

Tests answer: **Does it work?**

Complexity analysis answers: **How does the work grow as input grows?**

Do both. A fast wrong answer is still wrong, and a correct algorithm that collapses on realistic input is not a production victory.