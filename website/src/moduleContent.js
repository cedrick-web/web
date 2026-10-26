import { challengeTitles } from './learningData';

export function getModuleContent(module) {
  const firstChallenge = Number(module.range.match(/DSP-(\d+)/)?.[1] || 1);
  const lessons = (module.lessonDetails || []).map((lesson, index) => ({
    id: lesson.id,
    number: index + 1,
    title: lesson.title,
    body: [
      `## ${lesson.title}`,
      '',
      lesson.objective,
      '',
      '**Concept:**',
      lesson.explain,
      '',
      '**Example:**',
      lesson.example,
      '',
      '**Practice:**',
      lesson.practice
    ].join('\n')
  }));
  const challenges = challengeTitles
    .slice(firstChallenge - 1, firstChallenge - 1 + module.count)
    .map((challenge) => ({
      title: challenge.title,
      id: challenge.id,
      difficulty: '',
      body: ''
    }));

  return {
    lessons,
    challenges,
    debugging: 'Reproduce the failure, isolate the smallest case, explain the cause, make one change, and add a regression test.',
    assessment: 'Attempt the module challenges without copying a solution. Explain your algorithm, test edge cases, and state time and space complexity.',
    revision: 'Can I explain the problem? Can I state input and output? Can I write pseudocode? Can I test edge cases? Can I explain complexity?'
  };
}

export function markdownBlocks(markdown) {
  const lines = (markdown || '').replace(/\r/g, '').trim().split('\n');
  const blocks = [];
  let code = null;
  let text = [];
  const fence = String.fromCharCode(96).repeat(3);

  function flushText() {
    const value = text.join('\n').trim();
    if (value) blocks.push({ type: 'text', value });
    text = [];
  }

  for (const line of lines) {
    if (line.trim().startsWith(fence)) {
      if (code) {
        blocks.push({ type: 'code', value: code.join('\n') });
        code = null;
      } else {
        flushText();
        code = [];
      }
    } else if (code) {
      code.push(line);
    } else if (/^#{2,3}\s+/.test(line)) {
      flushText();
      blocks.push({ type: 'heading', value: line.replace(/^#{2,3}\s+/, '') });
    } else if (/^-\s+/.test(line)) {
      flushText();
      blocks.push({ type: 'list', value: line.replace(/^-\s+/, '') });
    } else if (/^\d+\.\s+/.test(line)) {
      flushText();
      blocks.push({ type: 'list', value: line.replace(/^\d+\.\s+/, '') });
    } else if (/^\|/.test(line)) {
      flushText();
      blocks.push({ type: 'table', value: line });
    } else if (line.trim() === '') {
      flushText();
    } else {
      text.push(line);
    }
  }

  if (code) blocks.push({ type: 'code', value: code.join('\n') });
  flushText();
  return blocks;
}
