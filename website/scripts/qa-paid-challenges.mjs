import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const websiteDir = path.resolve(__dirname, '..');
const rootDir = path.resolve(websiteDir, '..');
const registryPath = path.join(rootDir, 'products/javascript-toolkit/data/challenge-registry.json');
const paidDir = path.join(rootDir, 'products/javascript-toolkit/paid');

const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
const expectedCounts = [6, 6, 12, 7, 7, 10, 5, 7];
const expectedIds = Array.from({ length: 60 }, (_, i) => `DSP-${String(i + 1).padStart(3, '0')}`);
const failures = [];
const assert = (condition, message) => {
  if (!condition) failures.push(message);
};

assert(registry.product === 'JavaScript Problem-Solving & DSA Toolkit', 'Registry product name is incorrect');
assert(registry.version === 'V1', `Registry version must be V1, got ${registry.version}`);
assert(registry.total === 60, `Registry total must be 60, got ${registry.total}`);
assert(Array.isArray(registry.modules), 'Registry modules must be an array');
assert(registry.modules.length === 8, `Registry must contain 8 modules, got ${registry.modules.length}`);
assert(Array.isArray(registry.challenges), 'Registry challenges must be an array');
assert(registry.challenges.length === 60, `Registry must contain 60 challenges, got ${registry.challenges.length}`);

const ids = registry.challenges.map((challenge) => challenge.id);
assert(JSON.stringify(ids) === JSON.stringify(expectedIds), 'Registry IDs must be exactly DSP-001 through DSP-060 in order');

registry.modules.forEach((module, index) => {
  assert(module.id === `M${index + 1}`, `Module ${index + 1} has unexpected ID: ${module.id}`);
  assert(Number.isInteger(module.count), `${module.id} count must be an integer`);
  assert(module.count === expectedCounts[index], `${module.id} count must be ${expectedCounts[index]}, got ${module.count}`);
  assert(Array.isArray(module.range) && module.range.length === 2, `${module.id} must have a two-value range`);

  const moduleChallenges = registry.challenges.filter((challenge) => challenge.module === module.id);
  assert(moduleChallenges.length === module.count, `${module.id} registry membership count mismatch`);

  const sourceFiles = new Set(moduleChallenges.map((challenge) => challenge.source));
  assert(sourceFiles.size === 1, `${module.id} should point to exactly one source document`);
  for (const source of sourceFiles) {
    const relativeSource = source.replace(/^paid\//, '');
    assert(fs.existsSync(path.join(paidDir, relativeSource)), `${module.id} source does not exist: ${source}`);
  }

  const firstExpected = `DSP-${String(module.range[0]).padStart(3, '0')}`;
  const lastExpected = `DSP-${String(module.range[1]).padStart(3, '0')}`;
  const moduleIds = moduleChallenges.map((challenge) => challenge.id);
  assert(moduleIds[0] === firstExpected, `${module.id} range starts at ${firstExpected}, found ${moduleIds[0]}`);
  assert(moduleIds[moduleIds.length - 1] === lastExpected, `${module.id} range ends at ${lastExpected}, found ${moduleIds[moduleIds.length - 1]}`);
});

for (const challenge of registry.challenges) {
  assert(/^DSP-\d{3}$/.test(challenge.id), `Invalid challenge ID: ${challenge.id}`);
  assert(challenge.title?.trim(), `${challenge.id} is missing a title`);
  assert(challenge.module?.trim(), `${challenge.id} is missing a module`);
  assert(challenge.source?.trim(), `${challenge.id} is missing a source`);
}

const moduleFiles = [
  'module-01-think-like-a-programmer.md',
  'module-02-javascript-for-problem-solving.md',
  'module-03-arrays-and-strings.md',
  'module-04-searching.md',
  'module-05-sorting.md',
  'module-06-data-structures.md',
  'module-07-big-o-without-the-pain.md',
  'module-08-problem-solving-lab.md'
];

for (const file of moduleFiles) {
  const fullPath = path.join(paidDir, file);
  assert(fs.existsSync(fullPath), `Missing paid module file: ${file}`);
  if (!fs.existsSync(fullPath)) continue;

  const text = fs.readFileSync(fullPath, 'utf8');
  const referenced = registry.challenges.filter((challenge) => challenge.source.endsWith(file));
  const challengeIds = [...text.matchAll(/DSP-(\d{3})/g)].map((match) => `DSP-${match[1]}`);
  const uniqueIds = [...new Set(challengeIds)];

  assert(uniqueIds.length === referenced.length, `${file} contains ${uniqueIds.length} unique challenge IDs; registry expects ${referenced.length}`);

  for (const challenge of referenced) {
    assert(text.includes(challenge.id), `${file} is missing registry challenge ${challenge.id}`);
    assert(text.includes(challenge.title), `${file} is missing registry title for ${challenge.id}: ${challenge.title}`);
  }
}

if (failures.length) {
  console.error(`Paid challenge QA failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Paid challenge QA passed: 60 registry entries, 8 modules, ranges, titles, IDs, and source documents verified.');
