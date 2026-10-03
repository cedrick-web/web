import { modules, challengeTitles } from '../src/learningData.js';

const failures = [];

if (modules.length !== 8) failures.push('Expected exactly 8 modules.');
if (challengeTitles.length !== 60) failures.push('Expected exactly 60 challenges.');

for (const module of modules) {
  if (!module.title?.trim()) failures.push(`Module ${module.number} has no title.`);
  if (!module.description?.trim()) failures.push(`Module ${module.number} has no description.`);
  if (!Array.isArray(module.lessonDetails) || module.lessonDetails.length === 0) {
    failures.push(`Module ${module.number} has no lessons.`);
    continue;
  }
  module.lessonDetails.forEach((lesson, index) => {
    for (const field of ['title', 'objective', 'explain', 'example', 'practice']) {
      if (!String(lesson[field] || '').trim()) {
        failures.push(`Module ${module.number} Lesson ${index + 1} is missing ${field}.`);
      }
    }
  });
}

if (failures.length) {
  console.error('MODULE QA FAILED');
  failures.forEach(x => console.error(' - ' + x));
  process.exit(1);
}

console.log(`MODULE QA PASSED: ${modules.length} modules, ${modules.reduce((n, m) => n + m.lessonDetails.length, 0)} non-empty lessons, ${challengeTitles.length} challenges.`);
