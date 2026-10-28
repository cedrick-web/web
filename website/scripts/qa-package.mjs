import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { modules } from '../src/learningData.js';

const websiteDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rootDir = path.resolve(websiteDir, '..');
const productDir = path.join(rootDir, 'products', 'javascript-toolkit');
const registry = JSON.parse(fs.readFileSync(path.join(productDir, 'data', 'challenge-registry.json'), 'utf8'));

const packageFiles = [
  ['customer/README.md', 'README.md'],
  ['paid/module-01-think-like-a-programmer.md', 'Workbook/Module-01-Think-Like-a-Programmer.md'],
  ['paid/module-02-javascript-for-problem-solving.md', 'Workbook/Module-02-JavaScript-for-Problem-Solving.md'],
  ['paid/module-03-arrays-and-strings.md', 'Workbook/Module-03-Arrays-and-Strings.md'],
  ['paid/module-04-searching.md', 'Workbook/Module-04-Searching.md'],
  ['paid/module-05-sorting.md', 'Workbook/Module-05-Sorting.md'],
  ['paid/module-06-data-structures.md', 'Workbook/Module-06-Data-Structures.md'],
  ['paid/module-07-big-o-without-the-pain.md', 'Workbook/Module-07-Big-O-Without-the-Pain.md'],
  ['paid/module-08-problem-solving-lab.md', 'Workbook/Module-08-Problem-Solving-Lab.md'],
  ['customer/Practice/60-Challenge-Index.md', 'Practice/60-Challenge-Index.md'],
  ['customer/Debugging-Lab/Debugging-Lab.md', 'Debugging-Lab/Debugging-Lab.md'],
  ['customer/Assessment-Simulator/Assessment-Simulator.md', 'Assessment-Simulator/Assessment-Simulator.md'],
  ['paid/final-project-student-performance-analyzer.md', 'Final-Project/Student-Performance-Analyzer.md'],
  ['customer/Tests/Test-Guide.md', 'Tests/Test-Guide.md'],
  ['customer/Revision/Revision-Checklist.md', 'Revision/Revision-Checklist.md'],
];

assert.equal(registry.total, 60, 'The paid toolkit must define 60 challenges.');
assert.equal(registry.challenges.length, 60, 'The challenge registry must contain 60 entries.');
assert.equal(modules.length, 8, 'The curriculum must contain 8 modules.');

for (const [sourcePath] of packageFiles) {
  const fullPath = path.join(productDir, sourcePath);
  assert.ok(fs.existsSync(fullPath), `Missing customer package source: ${sourcePath}`);
  assert.ok(fs.statSync(fullPath).size > 0, `Customer package source is empty: ${sourcePath}`);
}

for (const module of modules) {
  for (const lesson of module.lessonDetails) {
    for (const field of ['objective', 'explain', 'example', 'practice']) {
      assert.ok(String(lesson[field] || '').trim(), `${module.id} ${lesson.title} is missing ${field}.`);
      assert.doesNotMatch(String(lesson[field]), /core skill in this module|create a small example for/i,
        `${module.id} ${lesson.title} still uses generic fallback content.`);
    }
  }
}

for (const challenge of registry.challenges) {
  const sourcePath = path.join(productDir, challenge.source.replace(/^paid\//, 'paid/'));
  const source = fs.readFileSync(sourcePath, 'utf8');
  const idPattern = new RegExp(`(?:\\*\\*ID:\\*\\*\\s*${challenge.id}\\b|^#{1,6}\\s+${challenge.id}\\b)`, 'gm');
  const idMatches = [...source.matchAll(idPattern)];
  assert.equal(idMatches.length, 1, `${challenge.id} must appear exactly once in ${challenge.source}.`);
  const markerIndex = idMatches[0]?.index ?? -1;
  assert.notEqual(markerIndex, -1, `${challenge.id} is missing from ${challenge.source}.`);

  const headings = [...source.matchAll(/^#{1,6}\s+(?:Guided Challenge\s+\d+|Independent Challenge[^\r\n]*|DSP-\d{3}\b)[^\r\n]*$/gm)];
  const heading = headings.filter((match) => match.index <= markerIndex).at(-1);
  const nextHeading = headings.find((match) => match.index > markerIndex);
  const section = source.slice(heading?.index ?? markerIndex, nextHeading?.index ?? source.length);

  assert.match(section, /^#{1,4}\s+.*(problem|challenge)|\*\*Problem\*\*/im,
    `${challenge.id} needs a problem statement.`);
  assert.match(section, /^#{1,4}\s+.*(pseudocode|algorithm)|^```text/im,
    `${challenge.id} needs pseudocode or algorithm steps.`);
  assert.match(section, /^#{1,4}\s+.*(solution|implementation|reference implementations)|function\s+\w+\s*\(/im,
    `${challenge.id} needs a solution or implementation.`);
  assert.match(section, /^#{1,4}\s+.*tests?|console\.assert|assert\.(?:equal|deepEqual)/im,
    `${challenge.id} needs test cases.`);
  assert.match(section, /^#{1,4}\s+.*complexity|\*\*(?:time|complexity):?\*\*/im,
    `${challenge.id} needs time/space complexity guidance.`);
}

console.log(`PACKAGE QA PASSED: ${packageFiles.length} deliverables, 8 populated modules, and 60 complete challenge records.`);
