import { useState } from 'react';
import { freeChallenges } from './challenges';
import { getCompletedChallenges, saveCompletedChallenges } from './challengeUtils';

const methodSteps = [
  ['01', 'Understand', 'Clarify the problem before touching code.'],
  ['02', 'Break down', 'Separate the task into smaller decisions.'],
  ['03', 'Design', 'Choose an algorithm and data structure.'],
  ['04', 'Pseudocode', 'Describe the solution in plain logic.'],
  ['05', 'Implement', 'Translate the plan into JavaScript.'],
  ['06', 'Test + debug', 'Attack normal cases and edge cases.'],
  ['07', 'Analyze', 'Measure time and space complexity.'],
  ['08', 'Improve', 'Find a cleaner or faster approach.'],
];

function App() {
  const [selected, setSelected] = useState(null);
  const [completed, setCompleted] = useState(getCompletedChallenges);
  const [revealed, setRevealed] = useState({});

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const toggleComplete = (id) => {
    const next = completed.includes(id)
      ? completed.filter((challengeId) => challengeId !== id)
      : [...completed, id];

    setCompleted(next);
    saveCompletedChallenges(next);
  };

  const toggleSolution = (id) => {
    setRevealed((current) => ({ ...current, [id]: !current[id] }));
  };

  const completedCount = completed.length;
  const progressPercent = Math.round((completedCount / freeChallenges.length) * 100);

  return (
    <main>
      <nav className="nav shell">
        <button className="brand brand-button" onClick={() => scrollTo('top')} aria-label="Go to top">
          <span className="brand-mark">D</span> DevSprint
        </button>
        <div className="nav-links">
          <button onClick={() => scrollTo('method')}>Method</button>
          <button onClick={() => scrollTo('product')}>Toolkit</button>
          <button onClick={() => scrollTo('free')}>Free challenges</button>
        </div>
      </nav>

      <section id="top" className="hero shell">
        <div className="eyebrow">PRACTICAL DEVELOPER EDUCATION</div>
        <h1>Stop memorizing code.<br /><span>Start solving problems.</span></h1>
        <p className="hero-copy">
          DevSprint teaches you how to turn unfamiliar programming problems into clear algorithms,
          working JavaScript, reliable tests, and solutions you can explain.
        </p>
        <div className="actions">
          <button className="button primary" onClick={() => scrollTo('free')}>Start 10 free challenges</button>
          <button className="button secondary" onClick={() => scrollTo('product')}>Explore the toolkit</button>
        </div>
        <div className="proof-row">
          <span>✓ Problem-solving first</span>
          <span>✓ JavaScript focused</span>
          <span>✓ Tests + debugging + Big-O</span>
        </div>
      </section>

      <section id="method" className="method-section">
        <div className="shell">
          <div className="section-label">THE DEVSPRINT METHOD</div>
          <h2>A repeatable system, not another pile of tutorials.</h2>
          <div className="method-grid">
            {methodSteps.map(([number, title, description]) => (
              <article className="step" key={number}>
                <b>{number}</b>
                <strong>{title}</strong>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="product" className="product-section shell">
        <div className="section-label">FIRST PRODUCT</div>
        <div className="product-card">
          <div>
            <span className="tag">COMING FIRST</span>
            <h2>JavaScript Problem-Solving &amp; DSA Toolkit</h2>
            <p>
              A focused practice system with 60 original problems covering arrays, strings, searching,
              sorting, data structures, complexity, debugging, and practical assessment.
            </p>
            <ul>
              <li>Every problem uses the same thinking framework</li>
              <li>Hints → pseudocode → solution → tests → edge cases</li>
              <li>Debugging lab and assessment simulator</li>
              <li>Final project: Student Performance Analyzer</li>
            </ul>
          </div>
          <aside className="price-box">
            <span>Launch target</span>
            <strong>$9–19</strong>
            <small>Price will be validated with real buyers.</small>
            <button className="button primary" onClick={() => scrollTo('free')}>Try the free pack</button>
          </aside>
        </div>
      </section>

      <section id="free" className="free-section">
        <div className="shell">
          <div className="section-label">FREE STARTER</div>
          <div className="free-heading">
            <div>
              <h2>10 problems designed to expose weak problem-solving habits.</h2>
              <p>No giant textbook. No 47-hour lecture marathon. Solve, think, test, improve.</p>
            </div>
            <div className="progress-card" aria-label={`${completedCount} of ${freeChallenges.length} challenges completed`}>
              <strong>{completedCount}/{freeChallenges.length}</strong>
              <span>challenges completed</span>
              <div className="progress-track" aria-hidden="true">
                <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
              </div>
              <small>{progressPercent}% progress · saved on this device</small>
            </div>
          </div>

          <div className="challenge-list">
            {freeChallenges.map((challenge) => {
              const isCompleted = completed.includes(challenge.id);
              const isRevealed = revealed[challenge.id];

              return (
                <article className={`challenge ${selected === challenge.id ? 'active' : ''} ${isCompleted ? 'completed' : ''}`} key={challenge.id}>
                  <button className="challenge-main" onClick={() => setSelected(selected === challenge.id ? null : challenge.id)} aria-expanded={selected === challenge.id}>
                    <span className="challenge-number">{String(challenge.id).padStart(2, '0')}</span>
                    <span className="challenge-info">
                      <strong>{challenge.title}</strong>
                      <small>{challenge.skill} · {challenge.difficulty}</small>
                    </span>
                    <span className="completion-state" aria-label={isCompleted ? 'Completed' : 'Not completed'}>{isCompleted ? '✓' : '○'}</span>
                    <span className="chevron">{selected === challenge.id ? '−' : '+'}</span>
                  </button>

                  {selected === challenge.id && (
                    <div className="challenge-detail">
                      <p><b>Problem:</b> {challenge.prompt}</p>
                      <code>{challenge.example}</code>

                      <div className="hint-box"><b>Hint:</b> {challenge.hint}</div>

                      <div className="challenge-actions">
                        <button className="button secondary" onClick={() => toggleSolution(challenge.id)}>
                          {isRevealed ? 'Hide solution' : 'Show solution'}
                        </button>
                        <button className="button primary" onClick={() => toggleComplete(challenge.id)}>
                          {isCompleted ? 'Mark incomplete' : 'Mark complete'}
                        </button>
                      </div>

                      {isRevealed && (
                        <div className="solution-panel">
                          <div className="solution-block">
                            <b>Pseudocode</b>
                            <ol>{challenge.pseudocode.map((step) => <li key={step}>{step}</li>)}</ol>
                          </div>
                          <div className="solution-block">
                            <b>JavaScript solution</b>
                            <pre><code>{challenge.solution}</code></pre>
                          </div>
                          <div className="solution-block">
                            <b>Tests</b>
                            <ul>{challenge.tests.map((test) => <li key={test}><code>{test}</code></li>)}</ul>
                          </div>
                          <div className="complexity"><b>Complexity:</b> {challenge.complexity}</div>
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="cta-section shell">
        <div className="cta-card">
          <div className="section-label">THE GOAL</div>
          <h2>{completedCount === freeChallenges.length ? 'You finished the starter pack.' : 'From “I don\'t know how to start” to “I know exactly what to do next.”'}</h2>
          <p>
            {completedCount === freeChallenges.length
              ? 'You now have a complete beginner practice loop: understand, design, implement, test, and analyze.'
              : 'DevSprint is being built around practice, feedback, and measurable progress, not content for content\'s sake.'}
          </p>
          <button className="button primary" onClick={() => scrollTo('free')}>
            {completedCount === freeChallenges.length ? 'Review the challenges' : 'Begin with Challenge 01'}
          </button>
        </div>
      </section>

      <footer className="footer shell">
        <div><div className="brand"><span className="brand-mark">D</span> DevSprint</div><p>Practical skills for developers who want to actually solve things.</p></div>
        <span>© 2026 DevSprint</span>
      </footer>
    </main>
  );
}

export default App;
