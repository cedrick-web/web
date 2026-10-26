import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const websiteDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rootDir = path.resolve(websiteDir, '..');
const productDir = path.join(rootDir, 'products', 'javascript-toolkit');
const releaseDir = path.join(productDir, 'release');
const packageName = 'DEVSPRINT-JAVASCRIPT-PROBLEM-SOLVING-DSA-TOOLKIT-V1';
const archivePath = path.join(releaseDir, `${packageName}.zip`);

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

fs.mkdirSync(releaseDir, { recursive: true });
const packageDir = fs.mkdtempSync(path.join(releaseDir, '.package-'));
try {
  for (const [source, destination] of packageFiles) {
    const sourcePath = path.join(productDir, source);
    const destinationPath = path.join(packageDir, destination);
    fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
    fs.copyFileSync(sourcePath, destinationPath);
  }

  if (process.platform === 'win32') {
    const escapePowerShell = (value) => `'${value.replace(/'/g, "''")}'`;
    const command = `Compress-Archive -Path ${escapePowerShell(path.join(packageDir, '*'))} -DestinationPath ${escapePowerShell(archivePath)} -Force`;
    const result = spawnSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', command], { stdio: 'inherit' });
    if (result.error) throw result.error;
    if (result.status !== 0) throw new Error(`Compress-Archive failed with exit code ${result.status}.`);
  } else {
    const result = spawnSync('zip', ['-q', '-r', archivePath, '.'], { cwd: packageDir, stdio: 'inherit' });
    if (result.error) throw result.error;
    if (result.status !== 0) throw new Error(`zip failed with exit code ${result.status}.`);
  }
} finally {
  fs.rmSync(packageDir, { recursive: true, force: true });
}

console.log(`Customer package created: ${archivePath}`);
