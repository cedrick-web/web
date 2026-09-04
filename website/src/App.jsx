import { useMemo, useState } from 'react';
import { freeChallenges } from './challenges';
import { getCompletedChallenges, saveCompletedChallenges } from './challengeUtils';
import { modules, tools, challengeTitles, methodSteps } from './learningData';

const navItems = [
  ['dashboard', 'Dashboard'],
  ['modules', 'Modules'],
  ['challenges', '60 Challenges'],
  ['tools', 'Labs & Tools'],
];

function App() {
  const [view, setView] = useState('dashboard');
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [completed, setCompleted] = useState(getCompletedChallenges);
  const [revealed, setRevealed] = useState({});

  const completedCount = completed.length;
  const progressPercent = Math.round((completedCount / 60) * 100);
  const freeCompleted = freeChallenges.filter((challenge) => completed.includes(`DSP-${String(challenge.id).padStart(3, '0')}`)).length;

  const freeById = useMemo(() => new Map(freeChallenges.map((challenge) => [`DSP-${String(challenge.id).padStart(3, '0')}`, challenge])), []);

  const toggleComplete = (id) => {
    const next = completed.includes(id)
      ? completed.filter((challengeId) => challengeId !== id)
      : [...completed, id];
    setCompleted(next);
    saveCompletedChallenges(next);
  };

  const openModule = (module) => {
    setSelectedModule(module);
    setView('module');
  };

  const go = (nextView) => {
    setSelectedModule(null);
    setSelectedChallenge(null);
    setView(nextView);
  };

  const moduleCompleted = (module) => {
    const start = module.range.match(/DSP-(\d+)/)?.[1];
    if (!start) return 0;
    const first = Number(start);
    return Array.from({ length: module.count }, (_, i) => `DSP-${String(first + i).padStart(3, '0')}`)
      .filter((id) => completed.includes(id)).length;
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <button className="brand brand-button" onClick={() => go('dashboard')} aria-label="Open DevSprint dashboard">
          <span className="brand-mark">D</span>
          <span>DevSprint</span>
        </button>
        <div className="side-label">LEARNING SPACE</div>
        <nav className="side-nav">
          {navItems.map(([id, label]) => (
            <button key={id} className={view === id || (id === 'modules' && view === 'module') ? 'active' : ''} onClick={() => go(id)}>
              <span>{id === 'dashboard' ? '⌂' : id === 'modules' ? '▦' : id === 'challenges' ? '◇' : '⚙'}</span>
              {label}
            </button>
          ))}
        </nav>
        <div className="sidebar-progress">
          <span>Your progress</span>
          <strong>{completedCount}/60</strong>
          <div className="progress-track"><div className="progress-fill" style={{ width: `${progressPercent}%` }} /></div>
          <small>{progressPercent}% complete</small>
        </div>
        <div className="sidebar-note">V1 · JavaScript Problem-Solving &amp; DSA Toolkit</div>
      </aside>

      <main className="learning-main">
        <header className="topbar">
          <div><span className="mobile-brand">DEVSPRINT</span><span className="breadcrumb">Learning space / {view === 'dashboard' ? 'Dashboard' : view === 'module' ? selectedModule?.title : view === 'tools' ? 'Labs & Tools' : 'Challenges'}</span></div>
          <div className="top-progress"><span>{completedCount} completed</span><div className="mini-progress"><div style={{ width: `${progressPercent}%` }} /></div></div>
        </header>

        {view === 'dashboard' && (
          <Dashboard
            modules={modules}
            tools={tools}
            completedCount={completedCount}
            freeCompleted={freeCompleted}
            progressPercent={progressPercent}
            onModule={openModule}
            onView={go}
          />
        )}

        {view === 'modules' && (
          <ModulesView modules={modules} moduleCompleted={moduleCompleted} onModule={openModule} />
        )}

        {view === 'module' && selectedModule && (
          <ModuleDetail
            module={selectedModule}
            completed={completed}
            moduleCompleted={moduleCompleted(selectedModule)}
            challengeTitles={challengeTitles}
            freeById={freeById}
            revealed={revealed}
            setRevealed={setRevealed}
            toggleComplete={toggleComplete}
            onBack={() => go('modules')}
            onChallenges={() => go('challenges')}
            onChallenge={setSelectedChallenge}
          />
        )}

        {view === 'challenges' && (
          <ChallengesView
            challengeTitles={challengeTitles}
            freeById={freeById}
            completed={completed}
            revealed={revealed}
            setRevealed={setRevealed}
            toggleComplete={toggleComplete}
            selectedChallenge={selectedChallenge}
            setSelectedChallenge={setSelectedChallenge}
          />
        )}

        {view === 'tools' && <ToolsView tools={tools} onProject={() => openModule(modules[7])} />}
      </main>
    </div>
  );
}

function Dashboard({ modules, tools, completedCount, freeCompleted, progressPercent, onModule, onView }) {
  return (
    <div className="page dashboard-page">
      <section className="welcome">
        <div>
          <span className="eyebrow">DEVSPRINT LEARNING SPACE</span>
          <h1>Build the habit of <span>solving problems.</span></h1>
          <p>Work through the system in order. Understand the problem, design the algorithm, implement it, test it, debug it, and analyze it.</p>
        </div>
        <div className="hero-progress"><div className="ring"><strong>{progressPercent}%</strong></div><span>course progress</span></div>
      </section>

      <section className="stats-grid">
        <Stat value="8" label="Modules" />
        <Stat value="60" label="Challenges" />
        <Stat value="4" label="Practice tools" />
        <Stat value={`${completedCount}`} label="Completed" />
      </section>

      <section className="continue-card">
        <div><span className="section-label">START HERE</span><h2>Module 1 · Think Like a Programmer</h2><p>Learn the reasoning loop before the syntax gets in the way.</p></div>
        <button className="button primary" onClick={() => onModule(modules[0])}>{completedCount ? 'Continue Module 1' : 'Start Module 1'} →</button>
      </section>

      <SectionHeader title="Your curriculum" action="View all modules" onAction={() => onView('modules')} />
      <div className="module-grid">
        {modules.map((module) => <ModuleCard key={module.id} module={module} completed={0} onClick={() => onModule(module)} />)}
      </div>

      <SectionHeader title="Practice tools" action="Open tools" onAction={() => onView('tools')} />
      <div className="tool-grid">
        {tools.map((tool) => <ToolCard key={tool.id} tool={tool} />)}
      </div>

      <div className="dashboard-footer-note">Free starter progress: <strong>{freeCompleted}/10</strong>. The public site exposes the starter practice; the complete paid curriculum remains part of the customer product.</div>
    </div>
  );
}

function ModulesView({ modules, moduleCompleted, onModule }) {
  return (
    <div className="page">
      <PageIntro label="CURRICULUM" title="Eight modules. One repeatable system." text="The toolkit moves from reasoning fundamentals to realistic problem-solving. Each module builds on the previous one." />
      <div className="method-strip">
        {methodSteps.map(([number, title, description]) => <div key={number}><b>{number}</b><strong>{title}</strong><span>{description}</span></div>)}
      </div>
      <div className="module-grid large">
        {modules.map((module) => <ModuleCard key={module.id} module={module} completed={moduleCompleted(module)} onClick={() => onModule(module)} />)}
      </div>
    </div>
  );
}

function ModuleDetail({ module, completed, moduleCompleted, challengeTitles, freeById, revealed, setRevealed, toggleComplete, onBack, onChallenges }) {
  const first = Number(module.range.match(/DSP-(\d+)/)?.[1] || 1);
  const items = challengeTitles.slice(first - 1, first - 1 + module.count);

  return (
    <div className="page">
      <button className="back-button" onClick={onBack}>← Back to modules</button>
      <section className="module-hero">
        <div><span className="module-number">MODULE {module.number}</span><h1>{module.title}</h1><p>{module.description}</p></div>
        <div className="module-score"><strong>{moduleCompleted}/{module.count}</strong><span>challenges completed</span><div className="progress-track"><div className="progress-fill" style={{ width: `${(moduleCompleted / module.count) * 100}%` }} /></div></div>
      </section>
      <div className="focus-line"><strong>Focus</strong><span>{module.focus}</span><span>{module.range}</span></div>

      <section className="lesson-roadmap">
        <span className="section-label">MODULE WORKFLOW</span>
        <div className="roadmap"><b>Mission</b><i>→</i><b>Lessons</b><i>→</i><b>Challenges</b><i>→</i><b>Tests</b><i>→</i><b>Complexity</b></div>
        <p>The complete module is included in the paid toolkit. The website shows the curriculum structure and free-access material without publishing the full customer workbook.</p>
      </section>

      <SectionHeader title={`${module.count} challenges`} action="Open challenge browser" onAction={onChallenges} />
      <div className="challenge-index">
        {items.map((title, index) => {
          const number = first + index;
          const id = `DSP-${String(number).padStart(3, '0')}`;
          const free = freeById.get(id);
          const isCompleted = completed.includes(id);
          return <ChallengeRow key={id} id={id} title={title} completed={isCompleted} free={Boolean(free)} onClick={() => free && setRevealed((current) => ({ ...current, [`open-${id}`]: !current[`open-${id}`] }))} />;
        })}
      </div>
    </div>
  );
}

function ChallengesView({ challengeTitles, freeById, completed, revealed, setRevealed, toggleComplete }) {
  return (
    <div className="page">
      <PageIntro label="PRACTICE" title="60 challenges, from first principles to realistic problems." text="Browse the complete challenge map. The 10 starter challenges are interactive on the public site; the remaining challenges are delivered inside the paid toolkit." />
      <div className="challenge-toolbar"><span>{completed.length}/60 completed</span><span>Free interactive: 10</span><span>Paid curriculum: 50</span></div>
      <div className="challenge-browser">
        {challengeTitles.map((challenge) => {
          const free = freeById.get(challenge.id);
          const isCompleted = completed.includes(challenge.id);
          const open = revealed[challenge.id];
          return (
            <div key={challenge.id} className={`browser-row ${open ? 'open' : ''} ${isCompleted ? 'done' : ''}`}>
              <button className="browser-main" onClick={() => free && setRevealed((current) => ({ ...current, [challenge.id]: !current[challenge.id] }))} disabled={!free}>
                <span className="browser-id">{challenge.id}</span><strong>{challenge.title}</strong><span className={`access-pill ${free ? 'free' : ''}`}>{free ? 'FREE' : 'TOOLKIT'}</span><span className="completion-state">{isCompleted ? '✓' : '○'}</span>
              </button>
              {open && free && <FreeChallenge challenge={free} isCompleted={isCompleted} toggleComplete={toggleComplete} revealed={revealed} setRevealed={setRevealed} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FreeChallenge({ challenge, isCompleted, toggleComplete, revealed, setRevealed }) {
  const solutionOpen = revealed[`solution-${challenge.id}`];
  const id = `DSP-${String(challenge.id).padStart(3, '0')}`;
  return <div className="free-challenge-detail"><p><b>Problem:</b> {challenge.prompt}</p><code>{challenge.example}</code><div className="hint-box"><b>Hint:</b> {challenge.hint}</div><div className="challenge-actions"><button className="button secondary" onClick={() => setRevealed((current) => ({ ...current, [`solution-${challenge.id}`]: !current[`solution-${challenge.id}`] }))}>{solutionOpen ? 'Hide solution' : 'Show solution'}</button><button className="button primary" onClick={() => toggleComplete(id)}>{isCompleted ? 'Mark incomplete' : 'Mark complete'}</button></div>{solutionOpen && <div className="solution-panel"><b>Pseudocode</b><ol>{challenge.pseudocode.map((step) => <li key={step}>{step}</li>)}</ol><b>JavaScript solution</b><pre><code>{challenge.solution}</code></pre><b>Tests</b><ul>{challenge.tests.map((test) => <li key={test}><code>{test}</code></li>)}</ul><div className="complexity"><b>Complexity:</b> {challenge.complexity}</div></div>}</div>;
}

function ToolsView({ tools, onProject }) {
  return <div className="page"><PageIntro label="LABS & TOOLS" title="Practice beyond the lesson." text="These tools turn the curriculum into deliberate practice: debug broken logic, simulate assessments, build the final project, and revise weak areas." /><div className="tool-grid large">{tools.map((tool) => <ToolCard key={tool.id} tool={tool} onClick={tool.id === 'project' ? onProject : undefined} />)}</div><section className="tools-method"><span className="section-label">THE FULL LOOP</span><div className="roadmap"><b>Learn</b><i>→</i><b>Attempt</b><i>→</i><b>Test</b><i>→</i><b>Debug</b><i>→</i><b>Explain</b><i>→</i><b>Revise</b></div></section></div>;
}

function ModuleCard({ module, completed, onClick }) {
  return <button className="module-card" onClick={onClick}><div className="module-card-top"><span>{module.number}</span><span>{completed}/{module.count}</span></div><h3>{module.title}</h3><p>{module.description}</p><div className="card-meta"><span>{module.count} challenges</span><span>{module.range}</span></div><div className="card-arrow">→</div></button>;
}

function ToolCard({ tool, onClick }) {
  return <button className={`tool-card ${onClick ? 'clickable' : ''}`} onClick={onClick}><span className="tool-icon">{tool.icon}</span><div><span className="tool-status">{tool.status}</span><h3>{tool.title}</h3><p>{tool.description}</p></div><span className="card-arrow">→</span></button>;
}

function ChallengeRow({ id, title, completed, free, onClick }) {
  return <button className="challenge-row" onClick={onClick} disabled={!free}><span className="browser-id">{id}</span><strong>{title}</strong><span className={`access-pill ${free ? 'free' : ''}`}>{free ? 'FREE' : 'TOOLKIT'}</span><span className="completion-state">{completed ? '✓' : '○'}</span></button>;
}

function PageIntro({ label, title, text }) { return <section className="page-intro"><span className="eyebrow">{label}</span><h1>{title}</h1><p>{text}</p></section>; }
function SectionHeader({ title, action, onAction }) { return <div className="section-header"><h2>{title}</h2><button onClick={onAction}>{action} →</button></div>; }
function Stat({ value, label }) { return <div className="stat"><strong>{value}</strong><span>{label}</span></div>; }

export default App;
