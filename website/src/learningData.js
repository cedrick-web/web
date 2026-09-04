export const modules = [
  { id: 'M1', number: '01', title: 'Think Like a Programmer', description: 'Turn a problem into a clear plan before you write code.', count: 6, range: 'DSP-001 → DSP-006', focus: 'Reasoning, decomposition, pseudocode', lessons: ['Input → Process → Output', 'Break large problems into smaller decisions', 'Write algorithms before JavaScript', 'Use pseudocode to expose missing logic', 'Follow the DevSprint solving loop', 'Test assumptions before coding'] },
  { id: 'M2', number: '02', title: 'JavaScript for Problem Solving', description: 'Use JavaScript features to express algorithms cleanly.', count: 6, range: 'DSP-007 → DSP-012', focus: 'Arrays, objects, Map, Set, testing', lessons: ['Functions and variables for clear solutions', 'Array traversal and mutation', 'Objects for simple lookup tables', 'Map and Set for frequency and uniqueness', 'Early returns and defensive logic', 'Write tests that expose edge cases'] },
  { id: 'M3', number: '03', title: 'Arrays & Strings', description: 'Master the patterns that appear constantly in real problems.', count: 12, range: 'DSP-013 → DSP-024', focus: 'Traversal, two pointers, windows, normalization', lessons: ['Traversal patterns and running state', 'Min/max and prefix-style reasoning', 'Frequency counting', 'Two-pointer thinking', 'Sliding-window foundations', 'String normalization and comparison'] },
  { id: 'M4', number: '04', title: 'Searching', description: 'Know when linear search is enough and when binary search wins.', count: 7, range: 'DSP-025 → DSP-031', focus: 'Linear search, binary search, bounds', lessons: ['Linear search and first-match logic', 'Counting occurrences efficiently', 'Binary-search invariants', 'Lower and upper bounds', 'Searching structured records', 'Rotated sorted arrays', 'Choosing the right search strategy'] },
  { id: 'M5', number: '05', title: 'Sorting', description: 'Understand sorting mechanics and choose the right approach.', count: 7, range: 'DSP-032 → DSP-038', focus: 'Comparators, selection, insertion, merge, quick sort', lessons: ['JavaScript numeric comparator rules', 'Selection sort mechanics', 'Insertion sort and nearly sorted data', 'Merge sort and divide-and-conquer', 'Quick-sort partitioning', 'Sorting real records with tie-breakers', 'When built-in sort is the production choice'] },
  { id: 'M6', number: '06', title: 'Data Structures', description: 'Choose structures based on the operations your problem needs.', count: 10, range: 'DSP-039 → DSP-048', focus: 'Stack, queue, linked list, Set, Map, trees', lessons: ['Stacks and last-in-first-out behavior', 'Queues and head-index optimization', 'Linked-list traversal and deletion', 'Set for uniqueness and membership', 'Map for key-value frequency data', 'Binary search tree insertion', 'Tree traversal and structure selection'] },
  { id: 'M7', number: '07', title: 'Big-O Without the Pain', description: 'Use complexity to make better engineering decisions.', count: 5, range: 'DSP-049 → DSP-053', focus: 'O(1), O(log n), O(n), O(n log n), O(n²)', lessons: ['Recognize constant-time work', 'Spot hidden quadratic loops', 'Trade memory for speed deliberately', 'Understand binary-search complexity', 'Compare complete strategies, not isolated lines'] },
  { id: 'M8', number: '08', title: 'Problem-Solving Lab', description: 'Apply the full system to realistic developer-style problems.', count: 7, range: 'DSP-054 → DSP-060', focus: 'Analysis, debugging, ranking, reporting', lessons: ['Analyze student performance data', 'Detect duplicate transactions', 'Search and rank inventory', 'Detect appointment conflicts', 'Analyze logs and frequency patterns', 'Build stable rankings with tie-breakers', 'Integrate the full system into a final report'] },
];

export const tools = [
  { id: 'debugging', icon: '🐛', title: 'Debugging Lab', description: 'Find the bug, explain why it happens, fix it, and prevent regression.', status: 'Interactive', prompt: 'A function should return the average score, but it sometimes rejects students who score exactly 50.', buggyCode: 'if (average > 50) {\n  return "PASS";\n}', fix: 'if (average >= 50) {\n  return "PASS";\n}' },
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
