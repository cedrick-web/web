const lessonNotes = {
  'Input → Process → Output': {
    objective: 'Translate a requirement into explicit inputs, transformations, and outputs before writing code.',
    explain: 'Every program starts with data, changes that data through rules, and produces a result. Making those three parts explicit prevents missing requirements.',
    example: 'For an average-score calculator: input = scores; process = add and divide by count; output = average.',
    practice: 'Take a student result problem and write its input, process, output, and two edge cases.'
  },
  'Break large problems into smaller decisions': {
    objective: 'Decompose a large requirement into small functions or decisions that can be tested independently.',
    explain: 'Break the problem into stages such as validation, calculation, filtering, and reporting. Each stage should have a clear responsibility.',
    example: 'A performance report can be split into calculateAverage(), isPassing(), rankStudents(), and buildReport().',
    practice: 'Decompose a dashboard requirement into at least five independently testable tasks.'
  },
  'Write algorithms before JavaScript': {
    objective: 'Describe a solution as ordered logical steps before choosing JavaScript syntax.',
    explain: 'An algorithm is the procedure. JavaScript is only the implementation language. Separating the two makes errors easier to find.',
    example: 'To find a maximum: start with the first value, compare each remaining value, and replace the maximum when a larger value appears.',
    practice: 'Write six language-independent steps for finding the highest score in an array.'
  },
  'Use pseudocode to expose missing logic': {
    objective: 'Use plain-language pseudocode to reveal assumptions, branches, and missing edge cases.',
    explain: 'Pseudocode forces you to answer what happens at each decision point without being distracted by syntax.',
    example: 'IF the list is empty, return a defined result. OTHERWISE set the first value as the current maximum and scan the rest.',
    practice: 'Write pseudocode for checking whether a string is a palindrome.'
  },
  'Follow the DevSprint solving loop': {
    objective: 'Apply one repeatable workflow from understanding through improvement.',
    explain: 'The loop is Understand → Input/Output → Break Down → Design → Pseudocode → Implement → Test → Debug → Analyze → Improve.',
    example: 'When a test fails, return to the smallest broken step instead of rewriting the entire solution.',
    practice: 'Use the full loop on DSP-001 and record one assumption you discovered during testing.'
  },
  'Test assumptions before coding': {
    objective: 'Identify constraints and edge cases before implementation.',
    explain: 'Most beginner bugs come from assumptions about empty input, duplicates, negative values, boundaries, or invalid data.',
    example: 'For a maximum function, test one item, all negative values, zeros, and an empty array according to the stated contract.',
    practice: 'Create five edge cases for a function that finds the first matching index.'
  },
  'Functions and variables for clear solutions': {
    objective: 'Use functions and descriptive variables to make algorithmic intent visible.',
    explain: 'A good function has one clear responsibility, and a variable name should explain the state it represents.',
    example: 'Use totalScore and studentCount instead of vague names such as x and y.',
    practice: 'Rename unclear variables in a short score-calculation function and split one large function into two.'
  },
  'Array traversal and mutation': {
    objective: 'Choose safe traversal patterns and understand when an array should or should not be mutated.',
    explain: 'for...of is useful for values, indexed loops for positions, and array methods for expressive transformations. Mutation should be deliberate.',
    example: 'Use map() when producing a new array and sort() only when changing order is acceptable.',
    practice: 'Transform an array into doubled values without changing the original array.'
  },
  'Objects for simple lookup tables': {
    objective: 'Use objects when keys are simple strings and a lightweight lookup structure is enough.',
    explain: 'Objects are useful for records and basic frequency tables. Keep the key space and intended operations clear.',
    example: 'A frequency table can store counts under words such as { apple: 2, orange: 1 }.',
    practice: 'Build an object that counts how many times each grade appears.'
  },
  'Map and Set for frequency and uniqueness': {
    objective: 'Choose Map for key-value relationships and Set for uniqueness or membership checks.',
    explain: 'Set answers “have I seen this?” while Map answers “what value belongs to this key?” Both make common lookup problems simpler.',
    example: 'Use a Set to detect duplicate IDs and a Map to count occurrences of words.',
    practice: 'Rewrite a duplicate detector using Set and explain why it is clearer than nested loops.'
  },
  'Early returns and defensive logic': {
    objective: 'Handle invalid or terminal cases early so the main algorithm stays readable.',
    explain: 'Early returns reduce nesting and make exceptional cases explicit before the core logic runs.',
    example: 'If input is not an array or is empty, return the contract-defined result before scanning it.',
    practice: 'Add defensive checks to a function that searches a list of students.'
  },
  'Numeric sort and comparator rules': {
    objective: 'Understand why JavaScript’s default sort behavior can produce incorrect numeric ordering.',
    explain: 'Array.sort() compares values as strings unless a comparator is supplied. Numeric data normally needs (a, b) => a - b.',
    example: '[10, 2, 30].sort() can place 10 before 2, while sort((a,b) => a-b) orders numerically.',
    practice: 'Sort scores ascending and descending, then add tests for negative numbers.'
  },
  'Binary-search invariants': {
    objective: 'Maintain a precise search interval and invariant when implementing binary search.',
    explain: 'Binary search works because the data is ordered and each comparison safely eliminates half of the remaining range.',
    example: 'Keep left and right bounds, inspect the midpoint, then discard the half that cannot contain the target.',
    practice: 'Write down the invariant that must remain true after every binary-search iteration.'
  },
  'Two-pointer thinking': {
    objective: 'Use two moving positions to reduce repeated work when scanning ordered or structured data.',
    explain: 'Two pointers can replace nested loops in problems involving pairs, boundaries, or opposite ends of an array.',
    example: 'Start one pointer at each end of a sorted array and move the pointer whose value needs adjustment.',
    practice: 'Design a two-pointer solution for checking whether a sorted array contains a pair with a target sum.'
  },
  'Sliding-window foundations': {
    objective: 'Maintain a changing contiguous range without recomputing the whole range each time.',
    explain: 'A sliding window reuses information when the next window overlaps the current one, often reducing O(nk) work to O(n).',
    example: 'For a fixed-size window, subtract the outgoing value and add the incoming value.',
    practice: 'Find the maximum sum of any three consecutive numbers in one pass.'
  },
  'JavaScript numeric comparator rules': {
    objective: 'Write correct numeric and multi-field comparators.',
    explain: 'Comparators should return a negative, zero, or positive value describing order. Tie-breakers should be explicit.',
    example: 'Sort students by score descending, then name ascending when scores are equal.',
    practice: 'Write a comparator for products ordered by price, then alphabetically by name.'
  },
  'Selection sort mechanics': {
    objective: 'Understand how selection sort repeatedly selects the smallest remaining value.',
    explain: 'Selection sort scans the unsorted suffix, finds its minimum, and swaps it into the next position.',
    example: 'After the first pass, the smallest value is fixed at index zero.',
    practice: 'Trace selection sort by hand for [5, 2, 4, 1].'
  },
  'Insertion sort and nearly sorted data': {
    objective: 'Understand why insertion sort can be useful when data is small or nearly ordered.',
    explain: 'Insertion sort grows a sorted prefix and inserts each new item into its correct position.',
    example: 'If only one new score arrives in an already sorted list, insertion logic can require little movement.',
    practice: 'Trace the sorted prefix after each insertion for [2, 4, 3, 5, 1].'
  },
  'Merge sort and divide-and-conquer': {
    objective: 'Understand how splitting, recursively sorting, and merging produces O(n log n) sorting.',
    explain: 'Merge sort divides the array, solves smaller instances, then combines sorted halves in linear merge work.',
    example: 'Two sorted halves can be merged by repeatedly taking the smaller front value.',
    practice: 'Draw the split and merge stages for eight numbers.'
  },
  'Quick-sort partitioning': {
    objective: 'Understand partitioning around a pivot and the factors that affect quick-sort performance.',
    explain: 'Partitioning rearranges values so items on one side compare before the pivot and items on the other side compare after it.',
    example: 'A poor pivot can create highly unbalanced partitions, while balanced partitions lead toward O(n log n) average behavior.',
    practice: 'Partition [7, 2, 9, 4, 1] around 4 and show the resulting regions.'
  },
  'Sorting real records with tie-breakers': {
    objective: 'Build deterministic sorting rules for real objects rather than isolated numbers.',
    explain: 'Production sorting often needs a primary key and one or more tie-breakers so equal primary values have predictable order.',
    example: 'Sort students by score descending, then attendance descending, then name ascending.',
    practice: 'Define a complete ordering for products with equal prices.'
  },
  'When built-in sort is the production choice': {
    objective: 'Choose an algorithm based on requirements rather than implementing an algorithm for its own sake.',
    explain: 'Learning sorting algorithms matters, but production code should usually prefer the language’s tested built-in sort unless a specific requirement says otherwise.',
    example: 'Use Array.sort with a clear comparator for ordinary application data; study merge or quick sort when algorithmic control is the actual requirement.',
    practice: 'List three situations where built-in sort is preferable and one where custom sorting logic is justified.'
  },
  'Stacks and last-in-first-out behavior': {
    objective: 'Recognize problems where the most recently added item must be processed first.',
    explain: 'A stack follows LIFO. Typical operations are push and pop, making it useful for undo systems, parsing, and depth-first workflows.',
    example: 'Browser history backtracking can be modeled with stack-like behavior.',
    practice: 'Implement push, pop, and peek using a JavaScript array.'
  },
  'Queues and head-index optimization': {
    objective: 'Model first-in-first-out processing and avoid unnecessary front-array deletion.',
    explain: 'A queue processes the oldest item first. Removing index zero repeatedly with shift() can cause avoidable work, so a head index is useful in performance-sensitive code.',
    example: 'const queue = []; let head = 0; queue.push(item); const next = queue[head++];',
    practice: 'Build a queue simulator and track the head position.'
  },
  'Linked-list traversal and deletion': {
    objective: 'Follow node references and reason about pointer changes.',
    explain: 'A linked list stores nodes connected by next references. Traversal follows those references rather than array indexes.',
    example: 'To delete a node, reconnect the previous node’s next reference to the deleted node’s successor.',
    practice: 'Draw three linked-list nodes and show the references before and after deleting the middle node.'
  },
  'Set for uniqueness and membership': {
    objective: 'Use Set when the main operation is checking whether a value has already appeared.',
    explain: 'Set gives a direct model for uniqueness and membership without manually managing duplicate checks.',
    example: 'new Set(visitorIds).size gives the number of unique visitor IDs.',
    practice: 'Create a unique visitor tracker and test repeated IDs.'
  },
  'Map for key-value frequency data': {
    objective: 'Use Map when keys need explicit key-value storage and frequent lookup/update.',
    explain: 'Map makes frequency counting and keyed aggregation direct and avoids awkward object-key edge cases.',
    example: 'counts.set(word, (counts.get(word) ?? 0) + 1).',
    practice: 'Count words case-insensitively with a Map.'
  },
  'Binary search tree insertion': {
    objective: 'Maintain the ordering rule of a binary search tree while inserting values.',
    explain: 'Values smaller than a node go left and larger values go right, according to the chosen duplicate policy.',
    example: 'Insert 7, then 4, then 9, then 5 to build a predictable search tree.',
    practice: 'Draw the tree after inserting [7, 4, 9, 5, 2].'
  },
  'Tree traversal and structure selection': {
    objective: 'Select a traversal based on the information the problem requires.',
    explain: 'In-order traversal visits left, node, right and produces sorted values for a valid BST. Other traversals serve different purposes.',
    example: 'Use in-order traversal to extract BST values in ascending order.',
    practice: 'Perform in-order traversal on a five-node tree and verify the result is sorted.'
  },
  'Recognize constant-time work': {
    objective: 'Identify operations whose work does not grow with input size.',
    explain: 'O(1) describes bounded work relative to input size. Accessing an array element by index is a common example.',
    example: 'scores[3] performs one indexed access regardless of whether the array has 10 or 10,000 items.',
    practice: 'Classify five simple operations as constant or input-dependent.'
  },
  'Spot hidden quadratic loops': {
    objective: 'Recognize nested work that can grow as n².',
    explain: 'If one loop processes n items and another full loop runs inside it, total work can become quadratic.',
    example: 'Comparing every pair in an array with nested loops is commonly O(n²).',
    practice: 'Find the quadratic portion of a duplicate detector and explain its growth.'
  },
  'Trade memory for speed deliberately': {
    objective: 'Understand when extra memory can reduce running time.',
    explain: 'A Set or Map can store information already seen, replacing repeated scans with near-constant average lookup.',
    example: 'A Set-based duplicate detector can reduce an O(n²) comparison approach to O(n) expected time with O(n) extra space.',
    practice: 'Describe the time and space trade-off in one paragraph.'
  },
  'Understand binary-search complexity': {
    objective: 'Connect repeated halving of a search range to O(log n).',
    explain: 'Each binary-search step removes roughly half the remaining candidates, so the number of steps grows logarithmically.',
    example: 'A million sorted values require only around twenty comparisons in the idealized halving model.',
    practice: 'Explain why doubling the input does not double binary-search steps.'
  },
  'Compare complete strategies, not isolated lines': {
    objective: 'Compare solutions using time, space, correctness, constraints, and maintainability together.',
    explain: 'Big-O is one engineering signal, not the whole decision. Data size, clarity, memory limits, and implementation risk matter too.',
    example: 'A simple O(n²) method can be acceptable for tiny inputs while an O(n) method matters for large production datasets.',
    practice: 'Compare two duplicate detectors and justify the choice for 100 items versus 10 million items.'
  }
};

const genericNotes = (module, title, index) => ({
  objective: `Master “${title}” as part of ${module.title} and apply it to challenge work.`,
  explain: `${title} is a core skill in this module. Learn the rule, identify when it applies, implement it in small steps, and verify it with edge cases before optimizing.`,
  example: `Start with a small concrete input, trace the state after each important step, then translate that trace into JavaScript.`,
  practice: `Create a small example for “${title}”, solve it without copying a solution, and explain why your approach works.`
});

const attachLessons = (module) => ({
  ...module,
  lessonDetails: module.lessons.map((title, index) => ({
    id: `${module.id}-L${index + 1}`,
    title,
    ...((lessonNotes[title] || genericNotes(module, title, index)))
  }))
});

export const modules = [
  { id: 'M1', number: '01', title: 'Think Like a Programmer', description: 'Turn a problem into a clear plan before you write code.', count: 6, range: 'DSP-001 → DSP-006', focus: 'Reasoning, decomposition, pseudocode', outcomes: ['Translate requirements into input/process/output', 'Break large problems into testable pieces', 'Write algorithms and pseudocode before coding', 'Use the DevSprint solving loop consistently'], lessons: ['Input → Process → Output', 'Break large problems into smaller decisions', 'Write algorithms before JavaScript', 'Use pseudocode to expose missing logic', 'Follow the DevSprint solving loop', 'Test assumptions before coding'] },
  { id: 'M2', number: '02', title: 'JavaScript for Problem Solving', description: 'Use JavaScript features to express algorithms cleanly.', count: 6, range: 'DSP-007 → DSP-012', focus: 'Arrays, objects, Map, Set, testing', outcomes: ['Use functions as clear problem boundaries', 'Traverse arrays safely', 'Choose Object, Map, and Set deliberately', 'Write defensive and testable JavaScript'], lessons: ['Functions and variables for clear solutions', 'Array traversal and mutation', 'Objects for simple lookup tables', 'Map and Set for frequency and uniqueness', 'Early returns and defensive logic', 'Test assumptions before coding'] },
  { id: 'M3', number: '03', title: 'Arrays & Strings', description: 'Master the patterns that appear constantly in real problems.', count: 12, range: 'DSP-013 → DSP-024', focus: 'Traversal, two pointers, windows, normalization', outcomes: ['Recognize array and string patterns', 'Use frequency counting and two pointers', 'Apply sliding-window reasoning', 'Handle edge cases and complexity'], lessons: ['Traversal patterns and running state', 'Min/max and prefix-style reasoning', 'Frequency counting', 'Two-pointer thinking', 'Sliding-window foundations', 'String normalization and comparison'] },
  { id: 'M4', number: '04', title: 'Searching', description: 'Know when linear search is enough and when binary search wins.', count: 7, range: 'DSP-025 → DSP-031', focus: 'Linear search, binary search, bounds', outcomes: ['Choose linear versus binary search', 'Maintain binary-search invariants', 'Implement lower-bound style searches', 'Search structured records correctly'], lessons: ['Linear search and first-match logic', 'Counting occurrences efficiently', 'Binary-search invariants', 'Lower and upper bounds', 'Searching structured records', 'Rotated sorted arrays', 'Choosing the right search strategy'] },
  { id: 'M5', number: '05', title: 'Sorting', description: 'Understand sorting mechanics and choose the right approach.', count: 7, range: 'DSP-032 → DSP-038', focus: 'Comparators, selection, insertion, merge, quick sort', outcomes: ['Write correct JavaScript comparators', 'Understand classic sorting mechanics', 'Compare sorting complexity', 'Sort real records with deterministic tie-breakers'], lessons: ['JavaScript numeric comparator rules', 'Selection sort mechanics', 'Insertion sort and nearly sorted data', 'Merge sort and divide-and-conquer', 'Quick-sort partitioning', 'Sorting real records with tie-breakers', 'When built-in sort is the production choice'] },
  { id: 'M6', number: '06', title: 'Data Structures', description: 'Choose structures based on the operations your problem needs.', count: 10, range: 'DSP-039 → DSP-048', focus: 'Stack, queue, linked list, Set, Map, trees', outcomes: ['Model stack and queue workflows', 'Traverse and modify linked lists', 'Use Set and Map for lookup-heavy problems', 'Understand basic tree insertion and traversal'], lessons: ['Stacks and last-in-first-out behavior', 'Queues and head-index optimization', 'Linked-list traversal and deletion', 'Set for uniqueness and membership', 'Map for key-value frequency data', 'Binary search tree insertion', 'Tree traversal and structure selection'] },
  { id: 'M7', number: '07', title: 'Big-O Without the Pain', description: 'Use complexity to make better engineering decisions.', count: 5, range: 'DSP-049 → DSP-053', focus: 'O(1), O(log n), O(n), O(n log n), O(n²)', outcomes: ['Recognize common complexity classes', 'Find dominant work in code', 'Trade memory for speed consciously', 'Compare complete strategies using constraints'], lessons: ['Recognize constant-time work', 'Spot hidden quadratic loops', 'Trade memory for speed deliberately', 'Understand binary-search complexity', 'Compare complete strategies, not isolated lines'] },
  { id: 'M8', number: '08', title: 'Problem-Solving Lab', description: 'Apply the full system to realistic developer-style problems.', count: 7, range: 'DSP-054 → DSP-060', focus: 'Analysis, debugging, ranking, reporting', outcomes: ['Solve realistic multi-step data problems', 'Combine searching, sorting, structures, and complexity', 'Debug requirements and edge cases', 'Produce a complete tested performance report'], lessons: ['Analyze student performance data', 'Detect duplicate transactions', 'Search and rank inventory', 'Detect appointment conflicts', 'Analyze logs and frequency patterns', 'Build stable rankings with tie-breakers', 'Integrate the full system into a final report'] },
].map(attachLessons);

export const tools = [
  { id: 'debugging', icon: '🐛', title: 'Debugging Lab', description: 'Find the bug, explain why it happens, fix it, and prevent regression.', status: 'Interactive', prompt: 'A function should return the average score, but it sometimes rejects students who score exactly 50.', buggyCode: 'if (average > 50) {\\n  return "PASS";\\n}', fix: 'if (average >= 50) {\\n  return "PASS";\\n}' },
  { id: 'assessment', icon: '⏱', title: 'Assessment Simulator', description: 'Practice under time pressure with a repeatable assessment workflow.', status: 'Practice', prompt: '15-minute drill: Given an array of student scores, return the highest score, average score, and number of students who passed.', steps: ['Read the requirements', 'Write input/output examples', 'Plan the algorithm', 'Implement', 'Test edge cases', 'State time and space complexity'] },
  { id: 'project', icon: '🏆', title: 'Final Project', description: 'Build the Student Performance Analyzer from requirements to tested solution.', status: 'Build', prompt: 'Build a report from student records containing name, scores, and attendance. A student passes when average score is at least 50 and attendance is at least 75%.', steps: ['Define the data model', 'Calculate statistics', 'Implement pass/fail', 'Add search and ranking', 'Generate attendance risks', 'Test and explain complexity'] },
  { id: 'revision', icon: '📋', title: 'Revision System', description: 'Use a focused checklist to identify weak patterns and revisit them.', status: 'Review', steps: ['Can I explain the problem without code?', 'Can I state the input and output?', 'Can I write pseudocode?', 'Can I test edge cases?', 'Can I explain my data structure choice?', 'Can I explain time and space complexity?'] },
];

export const challengeTitles = [
  'Find Largest Number','Count Even Numbers','Reverse a String','Find a Target','Sum Positive Numbers','First Duplicate',
  'Count Frequencies','Remove Duplicates','First Non-Repeating Character','Two Sum','Group Words by Length','Move Zeros',
  'Array Traversal Practice','Running Total','Frequency Pattern','Palindrome Check','Anagram Check','Two Pointers','Longest Unique Substring','Merge Sorted Arrays','Rotate Array','Move Zeros','Sequence Detection','String Transformation',
  'Find First Matching Index','Count Occurrences','Binary Search','Lower Bound','Search Student List by Score','Search Rotated Sorted Array','Find Closest Value',
  'Numeric Sort Without the Trap','Selection Sort','Insertion Sort','Merge Sort','Quick Sort Partition','Sort Students by Score','Sort by Distance From a Target',
  'Build a Stack','Queue Simulation','Efficient Queue with Head Index','Linked List Traversal','Remove a Linked-List Value','Unique Visitor Tracker','First Repeated Value with Set','Word Frequency with Map','Binary Search Tree Insert','In-Order Tree Traversal',
  'Constant-Time Access','Detect a Hidden Quadratic Algorithm','Improve Duplicate Detection','Binary Search Complexity','Compare Three Strategies',
  'Student Score Analyzer','Transaction Duplicate Detector','Inventory Search and Ranking','Appointment Conflict Detector','Log Analyzer','Top Performers With Stable Tie-Breaking','Final Integrated Challenge: Course Performance Report'
].map((title, index) => ({ id: `DSP-${String(index + 1).padStart(3, '0')}`, number: index + 1, title }));

export const methodSteps = [
  ['01', 'Understand', 'Clarify the problem before touching code.'],
  ['02', 'Break down', 'Separate the task into smaller decisions.'],
  ['03', 'Design', 'Choose an algorithm and data structure.'],
  ['04', 'Pseudocode', 'Describe the solution in plain logic.'],
  ['05', 'Implement', 'Translate the plan into JavaScript.'],
  ['06', 'Test + debug', 'Attack normal cases and edge cases.'],
  ['07', 'Analyze', 'Measure time and space complexity.'],
  ['08', 'Improve', 'Find a cleaner or faster approach.'],
];
