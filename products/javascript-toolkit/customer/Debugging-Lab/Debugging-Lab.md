# DevSprint Debugging Lab

Debugging is part of programming, not evidence that the universe personally dislikes your code. Use a repeatable process.

## The debugging loop

1. Reproduce the failure.
2. Capture the exact input and output.
3. Identify the smallest failing case.
4. Inspect assumptions, indexes, conditions, mutation, and return values.
5. Form one hypothesis.
6. Change one thing.
7. Run the regression tests again.
8. Explain the root cause.

## Lab 1: Off-by-one loop

Broken pattern:

```js
for (let i = 0; i <= numbers.length; i++) {
  total += numbers[i];
}
```

Find the invalid index and correct the loop condition.

## Lab 2: Search boundary bug

Take the binary-search implementation in Module 4 and intentionally test targets below the minimum, above the maximum, and absent from the array. Verify that the search terminates and returns the documented value.

## Lab 3: Comparator bug

In Module 5, inspect a numeric sort that uses the default JavaScript `.sort()` behavior. Explain why numeric values need an explicit comparator.

## Lab 4: Infinite-loop diagnosis

Use the nested-loop duplicate-pair example from Module 7. Trace both loop variables. Identify which variable must advance in the inner loop and add a regression test that would have caught the defect.

## Lab 5: Business-rule boundary

In Module 8, inspect the student pass rule. The average threshold is inclusive. Test values immediately below, exactly at, and immediately above the threshold.

## Debugging worksheet

For every bug, record:

- Challenge ID:
- Failing input:
- Expected result:
- Actual result:
- Error message, if any:
- Smallest reproduction:
- Root cause:
- Fix:
- Regression test:
- Complexity after the fix:

## Definition of a completed debugging lab

You have not finished when the red error disappears. You have finished when you can explain the cause, reproduce the old failure, verify the fix, and keep the bug from returning.