const challenges = [
  'Find the largest number without sorting',
  'Count even numbers in an array',
  'Reverse a string without built-in reverse',
];

function App() {
  return (
    <main>
      <nav className="nav shell">
        <div className="brand"><span className="brand-mark">D</span> DevSprint</div>
        <div className="nav-links">
          <a href="#method">Method</a>
          <a href="#product">Toolkit</a>
          <a href="#free">Free challenges</a>
        </div>
      </nav>

      <section className="hero shell">
        <div className="eyebrow">PRACTICAL DEVELOPER EDUCATION</div>
        <h1>Stop memorizing code.<br /><span>Start solving problems.</span></h1>
        <p className="hero-copy">
          DevSprint teaches you how to turn an unfamiliar programming problem into a clear algorithm,
          working JavaScript, reliable tests, and an explanation you actually understand.
        </p>
        <div className="actions">
          <a className="button primary" href="#free">Get 10 free challenges</a>
          <a className="button secondary" href="#product">See the toolkit</a>
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
            {['Understand', 'Break down', 'Design algorithm', 'Pseudocode', 'Implement', 'Test + debug', 'Analyze', 'Improve'].map((step, i) => (
              <div className="step" key={step}><b>{String(i + 1).padStart(2, '0')}</b><span>{step}</span></div>
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
            <p>60 original, structured problems covering arrays, strings, searching, sorting, data structures, complexity, debugging, and practical assessment.</p>
            <ul>
              <li>Every problem follows the same thinking framework</li>
              <li>Hints → pseudocode → solution → tests → edge cases</li>
              <li>Final project: Student Performance Analyzer</li>
            </ul>
          </div>
          <div className="price-box">
            <span>Launch target</span>
            <strong>$9–19</strong>
            <small>pricing will be validated with real buyers</small>
            <a className="button primary" href="#free">Start with free challenges</a>
          </div>
        </div>
      </section>

      <section id="free" className="free-section">
        <div className="shell free-grid">
          <div>
            <div className="section-label">FREE STARTER</div>
            <h2>10 problems designed to expose weak problem-solving habits.</h2>
            <p>No giant textbook. No 47-hour lecture marathon. Just problems, thinking, and feedback.</p>
          </div>
          <div className="challenge-list">
            {challenges.map((challenge, i) => <div className="challenge" key={challenge}><span>0{i + 1}</span>{challenge}</div>)}
            <div className="challenge more">+ 7 more challenges in the free pack</div>
          </div>
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
