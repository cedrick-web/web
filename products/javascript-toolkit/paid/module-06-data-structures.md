# Module 6 — Data Structures

## Mission

Choose and use data structures because they make a problem easier, not because a course told you to memorize them.

## Learning outcomes

By the end of this module, the learner can:

- choose an appropriate structure for a problem;
- use JavaScript arrays, objects, `Map`, and `Set` deliberately;
- model stack and queue behavior;
- understand linked-list nodes and traversal;
- understand tree nodes and depth-first traversal;
- explain the trade-off between structure, access, update, and search costs.

## Core rule

**The data structure is part of the algorithm.** Choosing the wrong structure can turn a simple problem into a messy one.

---

## DSP-039 — Build a Stack

**Difficulty:** 2 — Beginner  
**Skills:** arrays, LIFO, push/pop

### Problem
Implement a stack with `push`, `pop`, and `peek` operations.

### Input
An array of operations such as:

```js
[
  ["push", 10],
  ["push", 20],
  ["peek"],
  ["pop"],
  ["peek"]
]
```

### Output
Return the results of `peek` and `pop` operations:

```js
[20, 20, 10]
```

### Constraints
- Values may be numbers or strings.
- `pop` or `peek` on an empty stack returns `null`.

### Hint
A stack is **last in, first out**.

### Pseudocode
1. Create an empty array.
2. For each operation, apply the matching stack operation.
3. Record results from `pop` and `peek`.
4. Return the results.

### Solution
```js
function runStack(operations) {
  const stack = [];
  const results = [];

  for (const operation of operations) {
    if (operation[0] === "push") {
      stack.push(operation[1]);
    } else if (operation[0] === "pop") {
      results.push(stack.length ? stack.pop() : null);
    } else if (operation[0] === "peek") {
      results.push(stack.length ? stack[stack.length - 1] : null);
    }
  }

  return results;
}
```

### Tests
```js
runStack([["push", 10], ["push", 20], ["peek"], ["pop"], ["peek"]]); // [20, 20, 10]
runStack([["pop"], ["peek"]]); // [null, null]
runStack([["push", "A"], ["push", "B"], ["pop"]]); // ["B"]
```

**Complexity:** O(n) total operations, O(n) space.

### Extension
Add a `size` operation.

---

## DSP-040 — Queue Simulation

**Difficulty:** 2 — Beginner  
**Skills:** arrays, FIFO, queues

### Problem
Simulate a first-in, first-out queue using operations `enqueue`, `dequeue`, and `front`.

### Example
```js
runQueue([
  ["enqueue", "A"],
  ["enqueue", "B"],
  ["front"],
  ["dequeue"],
  ["dequeue"]
]); // ["A", "A", "B"]
```

### Pseudocode
1. Create an empty queue.
2. Add new values to the end.
3. Remove values from the front.
4. Return results from `dequeue` and `front`.

### Solution
```js
function runQueue(operations) {
  const queue = [];
  const results = [];

  for (const operation of operations) {
    if (operation[0] === "enqueue") {
      queue.push(operation[1]);
    } else if (operation[0] === "dequeue") {
      results.push(queue.length ? queue.shift() : null);
    } else if (operation[0] === "front") {
      results.push(queue.length ? queue[0] : null);
    }
  }

  return results;
}
```

### Tests
```js
runQueue([["enqueue", "A"], ["enqueue", "B"], ["dequeue"]]); // ["A"]
runQueue([["dequeue"], ["front"]]); // [null, null]
runQueue([["enqueue", 1], ["enqueue", 2], ["front"], ["dequeue"]]); // [1, 1]
```

**Complexity:** O(n²) worst case with JavaScript `shift()` across many dequeues.  
**Space:** O(n).

### Production note
For large queues, use a head index instead of repeatedly shifting the array.

---

## DSP-041 — Efficient Queue with a Head Index

**Difficulty:** 3 — Intermediate  
**Skills:** queues, indexing, performance

### Problem
Implement queue simulation without using `shift()`.

### Solution
```js
function runFastQueue(operations) {
  const queue = [];
  let head = 0;
  const results = [];

  for (const operation of operations) {
    if (operation[0] === "enqueue") {
      queue.push(operation[1]);
    } else if (operation[0] === "dequeue") {
      results.push(head < queue.length ? queue[head++] : null);
    } else if (operation[0] === "front") {
      results.push(head < queue.length ? queue[head] : null);
    }
  }

  return results;
}
```

### Tests
```js
runFastQueue([["enqueue", 1], ["enqueue", 2], ["dequeue"], ["dequeue"]]); // [1, 2]
runFastQueue([["front"]]); // [null]
runFastQueue([["enqueue", "x"], ["front"], ["dequeue"], ["dequeue"]]); // ["x", "x", null]
```

**Complexity:** O(n) total operations, O(n) space.

### Extension
Design a compaction strategy that occasionally removes already-consumed entries.

---

## DSP-042 — Linked List Traversal

**Difficulty:** 3 — Intermediate  
**Skills:** nodes, references, traversal

### Problem
Create a singly linked list from an array and return its values in order.

### Solution
```js
function buildList(values) {
  const dummy = { value: null, next: null };
  let tail = dummy;

  for (const value of values) {
    tail.next = { value, next: null };
    tail = tail.next;
  }

  return dummy.next;
}

function listToArray(head) {
  const values = [];
  let current = head;

  while (current !== null) {
    values.push(current.value);
    current = current.next;
  }

  return values;
}
```

### Tests
```js
listToArray(buildList([10, 20, 30])); // [10, 20, 30]
listToArray(buildList([])); // []
listToArray(buildList(["A"])); // ["A"]
```

**Complexity:** O(n) time, O(n) space.

### Key idea
A linked list stores relationships through references. Traversal follows `next` until it reaches `null`.

---

## DSP-043 — Remove a Linked-List Value

**Difficulty:** 3 — Intermediate  
**Skills:** linked lists, references, edge cases

### Problem
Remove the first node whose value equals `target` and return the new head.

### Solution
```js
function removeFirst(head, target) {
  const dummy = { value: null, next: head };
  let previous = dummy;

  while (previous.next !== null) {
    if (previous.next.value === target) {
      previous.next = previous.next.next;
      return dummy.next;
    }
    previous = previous.next;
  }

  return dummy.next;
}
```

### Tests
```js
listToArray(removeFirst(buildList([1, 2, 3]), 2)); // [1, 3]
listToArray(removeFirst(buildList([1, 2, 3]), 1)); // [2, 3]
listToArray(removeFirst(buildList([1, 2, 3]), 9)); // [1, 2, 3]
listToArray(removeFirst(buildList([]), 1)); // []
```

**Complexity:** O(n) time, O(1) extra space.

### Edge cases
Removing the head is the reason the dummy node is useful.

---

## DSP-044 — Unique Visitor Tracker

**Difficulty:** 2 — Beginner  
**Skills:** `Set`, membership testing

### Problem
Given a sequence of user IDs, return the number of unique visitors.

### Solution
```js
function countUniqueVisitors(ids) {
  const seen = new Set();

  for (const id of ids) {
    seen.add(id);
  }

  return seen.size;
}
```

### Tests
```js
countUniqueVisitors(["a", "b", "a", "c"]); // 3
countUniqueVisitors([]); // 0
countUniqueVisitors([1, 1, 1]); // 1
```

**Complexity:** O(n) average time, O(n) space.

### Extension
Return the unique IDs in their first-seen order.

---

## DSP-045 — First Repeated Value with Set

**Difficulty:** 3 — Intermediate  
**Skills:** `Set`, early return, search

### Problem
Return the first value that appears twice while scanning from left to right. Return `null` if none repeats.

### Solution
```js
function firstRepeated(values) {
  const seen = new Set();

  for (const value of values) {
    if (seen.has(value)) return value;
    seen.add(value);
  }

  return null;
}
```

### Tests
```js
firstRepeated([4, 2, 7, 2, 9]); // 2
firstRepeated([1, 2, 3]); // null
firstRepeated([5, 5]); // 5
firstRepeated([]); // null
```

**Complexity:** O(n) average time, O(n) space.

### Extension
Return the index of the repeated occurrence instead of the value.

---

## DSP-046 — Word Frequency with Map

**Difficulty:** 3 — Intermediate  
**Skills:** `Map`, frequency counting

### Problem
Return a `Map` containing the frequency of every word in an array.

### Solution
```js
function wordFrequency(words) {
  const frequencies = new Map();

  for (const word of words) {
    frequencies.set(word, (frequencies.get(word) || 0) + 1);
  }

  return frequencies;
}
```

### Tests
```js
[...wordFrequency(["js", "css", "js"])]; // [["js", 2], ["css", 1]]
[...wordFrequency([])]; // []
[...wordFrequency(["a", "a", "a"])]; // [["a", 3]]
```

**Complexity:** O(n) average time, O(k) space for k unique words.

### Production note
`Map` is useful when keys are dynamic and you want explicit key/value collection semantics.

---

## DSP-047 — Binary Search Tree Insert

**Difficulty:** 4 — Challenging  
**Skills:** trees, recursion, ordering

### Problem
Insert values into a binary search tree (BST). Smaller values go left, larger values go right. Ignore duplicates.

### Solution
```js
function insertBST(root, value) {
  if (root === null) return { value, left: null, right: null };

  if (value < root.value) {
    root.left = insertBST(root.left, value);
  } else if (value > root.value) {
    root.right = insertBST(root.right, value);
  }

  return root;
}
```

### Tests
```js
let root = null;
for (const value of [8, 3, 10, 1, 6]) root = insertBST(root, value);
root.value; // 8
root.left.value; // 3
root.right.value; // 10
root.left.right.value; // 6
```

**Complexity:** O(h) per insertion, where h is tree height.  
**Average balanced case:** O(log n).  
**Worst case:** O(n).

### Key idea
A tree is not automatically fast. Its shape matters.

---

## DSP-048 — In-Order Tree Traversal

**Difficulty:** 4 — Challenging  
**Skills:** trees, recursion, traversal

### Problem
Return the values of a BST using in-order traversal.

For a valid BST, in-order traversal produces sorted values.

### Solution
```js
function inOrder(root) {
  const result = [];

  function visit(node) {
    if (node === null) return;
    visit(node.left);
    result.push(node.value);
    visit(node.right);
  }

  visit(root);
  return result;
}
```

### Tests
```js
inOrder(null); // []

let root = null;
for (const value of [8, 3, 10, 1, 6]) root = insertBST(root, value);
inOrder(root); // [1, 3, 6, 8, 10]
```

**Complexity:** O(n) time, O(h) call-stack space.

### Extension
Implement pre-order and post-order traversal.

---

# Data-Structure Selection Lab

Before coding, ask:

| Requirement | Useful structure |
|---|---|
| Unique membership | `Set` |
| Key/value lookup | `Map` / object |
| Last-in-first-out | Stack |
| First-in-first-out | Queue |
| Sequential linked nodes | Linked list |
| Hierarchical data | Tree |
| Ordered indexed collection | Array |

The goal is not to memorize this table. The goal is to explain **why** your choice fits the operation pattern.

---

# Debugging Lab — The Queue That Gets Slower

Consider:

```js
function processQueue(items) {
  const queue = [...items];
  const result = [];

  while (queue.length > 0) {
    result.push(queue.shift());
  }

  return result;
}
```

### Questions
1. Does it produce the correct order?
2. What operation may become expensive as the queue grows?
3. How can a head index improve it?

### Expected reasoning
The logic is correct, but repeated `shift()` can require moving remaining elements. The head-index solution avoids that repeated work.

---

# Module Assessment

A learner passes when they can:

1. explain LIFO vs FIFO;
2. implement a stack without copying a tutorial;
3. implement a queue and identify the `shift()` performance issue;
4. traverse and modify a linked list safely;
5. explain when `Set` and `Map` are appropriate;
6. build and traverse a basic BST;
7. identify the complexity and edge cases of their solution.

## Rubric

- **Excellent:** chooses structures independently and explains trade-offs.
- **Strong:** implements structures correctly with minor debugging.
- **Developing:** can implement with hints but cannot yet justify choices.
- **Not ready:** memorizes operations without understanding the underlying behavior.

---

# Revision Checklist

- [ ] I can explain stack behavior.
- [ ] I can explain queue behavior.
- [ ] I know why `shift()` can be expensive.
- [ ] I understand linked-list references.
- [ ] I can use `Set` for uniqueness.
- [ ] I can use `Map` for frequency/key-value problems.
- [ ] I understand BST ordering.
- [ ] I can perform in-order traversal.
- [ ] I can choose a structure based on required operations.
- [ ] I can state time and space complexity.
