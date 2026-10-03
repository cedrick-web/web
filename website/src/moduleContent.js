import { modules } from './learningData';

const rawModules = import.meta.glob('../../products/javascript-toolkit/paid/*.md', {
  query: '?raw',
  import: 'default',
  eager: true
});

const sourceByNumber = Object.entries(rawModules).reduce((acc, entry) => {
  const path = entry[0];
  const source = entry[1];
  const match = path.match(/module-(\d+)-[^/]+\.md$/);
  if (match) acc[String(Number(match[1]))] = source;
  return acc;
}, {});

function sectionBetween(source, startIndex, nextPattern) {
  const rest = source.slice(startIndex);
  const match = rest.match(nextPattern);
  return match ? rest.slice(0, match.index).trim() : rest.trim();
}

function parseLessons(source) {
  const matches = [...source.matchAll(/^## Lesson\s+(\d+):\s*(.+)$/gm)];
  return matches.map(function(match) {
    return {
      id: 'L' + match[1],
      number: Number(match[1]),
      title: match[2].trim(),
      body: sectionBetween(source, match.index + match[0].length, /^##\s+/gm)
    };
  });
}

function parseChallenges(source) {
  const matches = [...source.matchAll(/^#\s+((?:Guided Challenge\s+\d+)|Independent Challenge[^\n]*)$/gm)];
  return matches.map(function(match) {
    const body = sectionBetween(source, match.index + match[0].length, /^#\s+/gm);
    const idMatch = body.match(/\*\*ID:\*\*\s*(DSP-\d+)/);
    const difficultyMatch = body.match(/\*\*Difficulty:\*\*\s*([^\n]+)/);
    return {
      title: match[1].trim(),
      id: idMatch ? idMatch[1] : '',
      difficulty: difficultyMatch ? difficultyMatch[1].trim() : '',
      body
    };
  });
}

function parseNamedSection(source, heading) {
  const escaped = heading.replace(/[.*+?^()|[\]\\]/g, '\\$&');
  const pattern = new RegExp('^#\\s+' + escaped + '\\s*$', 'm');
  const match = pattern.exec(source);
  if (!match) return '';
  return sectionBetween(source, match.index + match[0].length, /^#\s+/gm);
}

export function getModuleContent(module) {
  const source = sourceByNumber[String(Number(module.number))] || '';
  const parsedLessons = source ? parseLessons(source) : [];
  const parsedChallenges = source ? parseChallenges(source) : [];

  // learningData.js is the canonical website curriculum. Markdown is enrichment,
  // never the single point of failure for the module UI.
  const canonicalLessons = (module.lessonDetails || []).map((lesson, index) => {
    const sourceLesson = parsedLessons[index] || parsedLessons.find(item =>
      item.title.toLowerCase() === String(lesson.title).toLowerCase()
    );
    return {
      id: lesson.id,
      number: index + 1,
      title: lesson.title,
      body: sourceLesson?.body || [
        '## ' + lesson.title,
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
    };
  });

  const firstChallenge = Number(module.range.match(/DSP-(\d+)/)?.[1] || 1);
  const canonicalChallenges = challengeTitles
    .slice(firstChallenge - 1, firstChallenge - 1 + module.count)
    .map((challenge, index) => ({
      title: challenge.title,
      id: challenge.id,
      difficulty: '',
      body: ''
    }));

  return {
    source,
    lessons: canonicalLessons,
    challenges: parsedChallenges.length ? parsedChallenges : canonicalChallenges,
    debugging: parseNamedSection(source, 'Debugging Lab') || 'Use the debugging workflow: reproduce the problem, isolate the smallest failing case, explain the cause, fix it, and test the regression.',
    assessment: parseNamedSection(source, 'Module Assessment') || 'Complete the module challenges without copying a solution. Explain your algorithm, test edge cases, and state time and space complexity.',
    revision: parseNamedSection(source, 'Revision Checklist') || 'Can I explain the problem? Can I state input/output? Can I write pseudocode? Can I test edge cases? Can I explain complexity?'
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
    } else if (/^###\s+/.test(line)) {
      flushText();
      blocks.push({ type: 'heading', value: line.replace(/^###\s+/, '') });
    } else if (/^##\s+/.test(line)) {
      flushText();
      blocks.push({ type: 'heading', value: line.replace(/^##\s+/, '') });
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
