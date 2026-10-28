import { useEffect, useMemo, useState } from 'react';
import { freeChallenges } from './challenges';
import { getCompletedChallenges, saveCompletedChallenges } from './challengeUtils';
import { modules, tools, challengeTitles, methodSteps } from './learningData';
import { getModuleContent, markdownBlocks } from './moduleContent';
import { api, checkout } from './api';
import { runChallengeInWorker } from './challengeRunner.js';
import { clearSessionToken, readSessionToken, saveSessionToken } from './session';
import AuthDialog from './AuthDialog';

function buildLesson(module, index) {
  const title = module.lessons[index] || `Lesson ${index + 1}`;
  const detail = module.lessonDetails?.[index] || {};
  return {
    id: detail.id || `${module.id}-L${index + 1}`,
    number: index + 1,
    title,
    objective: detail.objective || `Master “${title}” as part of ${module.title}.`,
    explain: detail.explain || `${title} is a core skill in this module. Learn the rule, apply it to a small example, and verify the result with edge cases.`,
    example: detail.example || `Start with a small input, trace the important steps, then translate the reasoning into JavaScript.`,
    practice: detail.practice || `Create a small example for “${title}”, solve it without copying a solution, and explain why it works.`
  };
}

function getSafeLessons(module) {
  const titles = Array.isArray(module?.lessons) ? module.lessons : [];
  const details = Array.isArray(module?.lessonDetails) ? module.lessonDetails : [];
  const total = Math.max(titles.length, details.length);
  return Array.from({ length: total }, (_, index) => buildLesson(module, index));
}

const nav = [['dashboard','Dashboard'],['modules','Modules'],['challenges','60 Challenges'],['tools','Labs & Tools'],['progress','Progress']];

export default function App() {
  const [view,setView]=useState('dashboard');
  const [module,setModule]=useState(null);
  const [lesson,setLesson]=useState(null);
  const [lessonDone,setLessonDone]=useState(()=>{try{const value=JSON.parse(localStorage.getItem('devsprint.lessonDone')||'[]');return Array.isArray(value)?value:[]}catch{return []}});
  const [tool,setTool]=useState(null);
  const [completed,setCompleted]=useState(getCompletedChallenges);
  const [open,setOpen]=useState({});
  const [token,setToken]=useState(readSessionToken);
  const [user,setUser]=useState(null);
  const [accountOpen,setAccountOpen]=useState(false);
  const [sessionChecking,setSessionChecking]=useState(()=>Boolean(readSessionToken()));
  const [syncError,setSyncError]=useState('');
  const freeById=useMemo(()=>new Map(freeChallenges.map(c=>['DSP-'+String(c.id).padStart(3,'0'),c])),[]);
  useEffect(()=>{
    if(!token){setSessionChecking(false);return undefined;}
    let active=true;
    setSessionChecking(true);
    Promise.all([api.me(token),api.progress(token)]).then(([account,result])=>{
      if(!active) return;
      setUser(account.user);
      setCompleted(result.progress.filter(item=>item.status==='completed').map(item=>item.challenge_id));
      setSyncError('');
    }).catch(error=>{
      if(!active) return;
      setSyncError('Could not sync account progress: '+error.message);
      if(error.message==='Authentication required'||error.message==='Invalid or expired token'){
        clearSessionToken();
        setToken('');
        setUser(null);
      }
    }).finally(()=>{
      if(active) setSessionChecking(false);
    });
    return ()=>{active=false};
  },[token]);
  const done=completed.length;
  const percent=Math.round(done/60*100);
  const go=v=>{setView(v);setModule(null);setTool(null);setLesson(null)};
  const openLesson=(m,l)=>{setModule(m);setLesson(l);setTool(null);setView('lesson')};
  const toggleLesson=id=>{const next=lessonDone.includes(id)?lessonDone.filter(x=>x!==id):[...lessonDone,id];setLessonDone(next);localStorage.setItem('devsprint.lessonDone',JSON.stringify(next))};
  const openModule=m=>{setModule(m);setTool(null);setView('module')};
  const openTool=t=>{setTool(t);setModule(null);setView('tool')};
  const toggle=id=>{
    const next=completed.includes(id)?completed.filter(x=>x!==id):[...completed,id];
    setCompleted(next);
    if(!token){
      saveCompletedChallenges(next);
      return;
    }
    api.saveProgress(token,id,next.includes(id)?'completed':'started').catch(error=>{
      setCompleted(completed);
      setSyncError(`Could not save progress: ${error.message}`);
    });
  };
  const handleAuthenticated=result=>{
    if(!result?.token || !result?.user) {
      setSyncError('The API returned an incomplete sign-in response.');
      return;
    }
    saveSessionToken(result.token);
    setToken(result.token);
    setUser(result.user);
    setSyncError('');
    setAccountOpen(false);
  };
  const handleLogout=()=>{
    clearSessionToken();
    setToken('');
    setUser(null);
    setCompleted(getCompletedChallenges());
    setAccountOpen(false);
  };
  const moduleDone=m=>{const first=Number(m.range.match(/DSP-(\d+)/)?.[1]||1);return Array.from({length:m.count},(_,i)=>`DSP-${String(first+i).padStart(3,'0')}`).filter(id=>completed.includes(id)).length};
  return <div className="app-shell">
    <aside className="sidebar">
      <button className="brand brand-button" onClick={()=>go('dashboard')}><span className="brand-mark">D</span><span>DevSprint</span></button>
      <div className="side-label">LEARNING SPACE</div>
      <nav className="side-nav">{nav.map(([id,label])=><button key={id} className={view===id||(id==='modules'&&view==='module')||(id==='tools'&&view==='tool')?'active':''} onClick={()=>go(id)}>
        <span>{id==='dashboard'?'⌂':id==='modules'?'▦':id==='challenges'?'◇':id==='tools'?'⚙':'◔'}</span>{label}
      </button>)}</nav>
      <button className="account-trigger" type="button" disabled={sessionChecking} onClick={()=>setAccountOpen(true)}>{sessionChecking?'Checking…':user?user.name:'Sign in'}</button>
      <div className="sidebar-progress"><span>Your progress</span><strong>{done}/60</strong>
        <div className="progress-track"><div className="progress-fill" style={{width:`${percent}%`}}/></div><small>{percent}% complete</small>
      </div>
      <div className="sidebar-note">V1 · JavaScript Problem-Solving &amp; DSA Toolkit</div>
      <div className="build-marker">CURRICULUM ENGINE · LIVE</div>
    </aside>
    <main className="learning-main">
      <header className="topbar"><div><span className="mobile-brand">DEVSPRINT</span><span className="breadcrumb">Learning space / {view==='module'?module?.title:view==='lesson'?lesson?.title:view==='tool'?tool?.title:view==='progress'?'Progress':view==='tools'?'Labs & Tools':view==='challenges'?'Challenges':'Dashboard'}</span></div>
        <div className="top-progress"><span>{done} completed</span><div className="mini-progress"><div style={{width:`${percent}%`}}/></div></div>
      </header>
      {syncError&&<div className="sync-alert" role="alert">{syncError}</div>}
      {view==='dashboard'&&<Dashboard modules={modules} tools={tools} done={done} percent={percent} moduleDone={moduleDone} onModule={openModule} onTool={openTool} onView={go}/>}
      {view==='modules'&&<Modules modules={modules} moduleDone={moduleDone} onModule={openModule}/>}
      {view==='module'&&module&&<ModuleDetail module={module} completed={completed} moduleDone={moduleDone(module)} titles={challengeTitles} freeById={freeById} open={open} setOpen={setOpen} back={()=>go('modules')} challenges={()=>go('challenges')} onLesson={openLesson} lessonDone={lessonDone}/>}
      {view==='lesson'&&module&&lesson&&<LessonDetail module={module} lesson={lesson} done={lessonDone.includes(lesson.id)} toggle={()=>toggleLesson(lesson.id)} back={()=>openModule(module)} challenges={()=>go('challenges')} lessonDone={lessonDone}/>}
      {view==='challenges'&&<Challenges titles={challengeTitles} freeById={freeById} completed={completed} open={open} setOpen={setOpen} toggle={toggle}/>}
      {view==='tools'&&<Tools tools={tools} onTool={openTool}/>}
      {view==='tool'&&tool&&<ToolDetail tool={tool} back={()=>go('tools')} project={()=>openModule(modules[7])}/>}
      {view==='progress'&&<Progress modules={modules} moduleDone={moduleDone} done={done} percent={percent} onModule={openModule}/>}
    </main>
    {accountOpen&&<AuthDialog user={user} onClose={()=>setAccountOpen(false)} onAuthenticated={handleAuthenticated} onLogout={handleLogout}/>}
  </div>;
}

function CheckoutCard({compact=false}) {
  const url=checkout.url;
  return <section className={'checkout-card'+(compact?' compact':'')}>
    <div className="checkout-copy">
      <span className="eyebrow">DEVSPRINT V1 TOOLKIT</span>
      <h2>Go beyond the 10 free challenges.</h2>
      <p>Get the eight workbooks, all 60 guided challenge records, reference solutions, debugging lab, assessment simulator, tests and final project in one downloadable toolkit.</p>
      <div className="checkout-tags"><span>8 modules</span><span>60 challenges</span><span>Downloadable product</span></div>
    </div>
    <div className="checkout-action">
      {url
        ? <a className="button primary" href={url} target="_blank" rel="noopener noreferrer">Get the V1 toolkit →</a>
        : <>
            <button className="button secondary" type="button" disabled>Checkout not configured</button>
            <p role="status">Secure checkout will appear here after the real Payhip product URL is configured as VITE_CHECKOUT_URL.</p>
          </>}
    </div>
  </section>;
}

function Dashboard({modules,tools,done,percent,moduleDone,onModule,onTool,onView}){return <Page><section className="welcome"><div><span className="eyebrow">DEVSPRINT LEARNING SPACE</span><h1>Build the habit of <span>solving problems.</span></h1><p>Learn the full loop: understand, break down, design, implement, test, debug, analyze, and improve.</p></div><div className="hero-progress"><div className="ring" style={{background:`conic-gradient(#8fd3ff ${percent}%,#202a38 0)`}}><strong>{percent}%</strong></div><span>course progress</span></div></section><section className="stats-grid"><Stat value="8" label="Modules"/><Stat value="60" label="Challenges"/><Stat value="4" label="Practice tools"/><Stat value={done} label="Completed"/></section><section className="continue-card"><div><span className="section-label">START HERE</span><h2>Module 1 · Think Like a Programmer</h2><p>Start with reasoning before syntax.</p></div><button className="button primary" onClick={()=>onModule(modules[0])}>Start learning →</button></section><CheckoutCard compact/><SectionHeader title="Your curriculum" action="View all modules" onAction={()=>onView('modules')}/><div className="module-grid">{modules.map(m=><ModuleCard key={m.id} module={m} completed={moduleDone(m)} onClick={()=>onModule(m)}/>)}</div><SectionHeader title="Practice tools" action="Open tools" onAction={()=>onView('tools')}/><div className="tool-grid">{tools.map(t=><ToolCard key={t.id} tool={t} onClick={()=>onTool(t)}/>)}</div></Page>}

function Modules({modules,moduleDone,onModule}){return <Page><PageIntro label="CURRICULUM" title="Eight modules. One repeatable system." text="Each module contains a learning roadmap, lessons, challenge range, and practice path."/><div className="method-strip">{methodSteps.map(x=><div key={x[0]}><b>{x[0]}</b><strong>{x[1]}</strong><span>{x[2]}</span></div>)}</div><div className="module-grid large">{modules.map(m=><ModuleCard key={m.id} module={m} completed={moduleDone(m)} onClick={()=>onModule(m)}/>)}</div></Page>}

function MarkdownContent({markdown}) {
  return <div className="markdown-content">{markdownBlocks(markdown).map((block,index)=>{
    if(block.type==='code') return <pre className="markdown-code" key={index}><code>{block.value}</code></pre>;
    if(block.type==='heading') return <h3 key={index}>{block.value}</h3>;
    if(block.type==='list') return <div className="markdown-list" key={index}>• {block.value}</div>;
    if(block.type==='table') return <div className="markdown-table-row" key={index}>{block.value}</div>;
    return <p key={index}>{block.value}</p>;
  })}</div>;
}

function FullCurriculum({module}) {
  const content=getModuleContent(module);
  return <div className="full-curriculum">
    <section className="curriculum-content-card">
      <span className="section-label">CURRICULUM PREVIEW</span>
      <p>Review the learning outcomes and lesson practice here. The complete paid workbook and reference solutions are delivered in the toolkit.</p>
      <ul className="outcome-list">{module.outcomes.map(item=><li key={item}>{item}</li>)}</ul>
    </section>
    <section className="curriculum-content-card">
      <span className="section-label">DEBUGGING LAB</span>
      <MarkdownContent markdown={content.debugging}/>
    </section>
    <section className="curriculum-content-card">
      <span className="section-label">MODULE ASSESSMENT</span>
      <MarkdownContent markdown={content.assessment}/>
    </section>
    <section className="curriculum-content-card">
      <span className="section-label">REVISION CHECKLIST</span>
      <MarkdownContent markdown={content.revision}/>
    </section>
  </div>;
}

function ModuleDetail({module,completed,moduleDone,titles,freeById,open,setOpen,back,challenges,onLesson,lessonDone}){const lessons=getSafeLessons(module);const first=Number(module.range.match(/DSP-(\d+)/)?.[1]||1);const items=titles.slice(first-1,first-1+module.count);const content=getModuleContent(module);return <Page><button className="back-button" onClick={back}>← Back to modules</button><section className="module-hero"><div><span className="module-number">MODULE {module.number}</span><h1>{module.title}</h1><p>{module.description}</p></div><div className="module-score"><strong>{moduleDone}/{module.count}</strong><span>challenges completed</span><div className="progress-track"><div className="progress-fill" style={{width:`${moduleDone/module.count*100}%`}}/></div></div></section><div className="focus-line"><strong>Focus</strong><span>{module.focus}</span><span>{module.range}</span></div><section className="lesson-roadmap"><span className="section-label">LESSONS · {lessons.length} LOADED</span><div className="lesson-grid">{lessons.map((l,i)=><button type="button" className={`lesson-card lesson-button ${lessonDone.includes(l.id)?'lesson-complete':''}`} key={l.id} onClick={()=>onLesson(module,l)}><span>LESSON {i+1} {lessonDone.includes(l.id)?'· ✓':''}</span><strong>{l.title}</strong><p>{l.objective}</p><em>Open lesson →</em></button>)}</div></section><section className="lesson-roadmap"><span className="section-label">LEARNING OUTCOMES</span><ul className="outcome-list">{module.outcomes.map(x=><li key={x}>{x}</li>)}</ul></section><section className="curriculum-source-preview"><div className="curriculum-source-head"><div><span className="section-label">CURRICULUM PREVIEW</span><h2>{lessons.length} lessons · {content.challenges.length} challenge titles</h2><p>Lesson summaries are public previews; full paid challenge walkthroughs remain in the customer toolkit.</p></div><span className="source-badge">READY</span></div><div className="source-lesson-list">{lessons.map(item=><button type="button" key={item.id} className="source-lesson-row" onClick={()=>onLesson(module,item)}><span>Lesson {item.number}</span><strong>{item.title}</strong><em>Open →</em></button>)}</div></section><FullCurriculum module={module}/><section className="lesson-roadmap"><span className="section-label">MODULE WORKFLOW</span><div className="roadmap"><b>Learn</b><i>→</i><b>Attempt</b><i>→</i><b>Test</b><i>→</i><b>Debug</b><i>→</i><b>Analyze</b><i>→</i><b>Improve</b></div><p>Free challenges are interactive here. The complete paid workbook is delivered with the customer product.</p></section><SectionHeader title={`${module.count} challenges`} action="Open challenge browser" onAction={challenges}/><div className="challenge-index">{items.map((challenge)=>{const id=challenge.id,free=freeById.get(id);return <ChallengeRow key={id} id={id} title={challenge.title} completed={completed.includes(id)} free={!!free} onClick={()=>free&&setOpen(x=>({...x,[id]:!x[id]}))}/>})}</div></Page>}

function LessonDetail({module,lesson,done,toggle,back,challenges,lessonDone}){const lessons=getSafeLessons(module);return <Page><button className="back-button" onClick={back}>← Back to module</button><section className="lesson-detail-hero"><span className="module-number">MODULE {module.number} · LESSON</span><h1>{lesson.title}</h1><p>{lesson.objective}</p><div className="lesson-status">{done?'✓ Lesson completed':'In progress'}</div></section><div className="lesson-detail-grid"><section className="lesson-content-card"><span className="section-label">FULL LESSON CONTENT</span><FullLessonContent module={module} lesson={lesson}/><div className="lesson-actions"><button className="button primary" onClick={toggle}>{done?'Mark lesson incomplete':'Mark lesson complete'}</button><button className="button secondary" onClick={challenges}>Practice challenges →</button></div></section><aside className="lesson-sidebar-card"><span className="section-label">MODULE PATH</span><strong>{module.title}</strong><p>{module.focus}</p><div className="lesson-mini-list">{lessons.map(x=><div className={x.id===lesson.id?'current':''} key={x.id}><span>{x.title}</span>{lessonDone.includes(x.id)?' ✓':''}</div>)}</div></aside></div></Page>}

function FullLessonContent({lesson}) {
  return <div className="lesson-source-content">
    <section className="lesson-structured-content">
      <h2>{lesson.title}</h2>
      <p>{lesson.objective}</p>
      <h3>Concept</h3>
      <p>{lesson.explain}</p>
      <h3>Example</h3>
      <pre className="markdown-code"><code>{lesson.example}</code></pre>
      <h3>Practice</h3>
      <p>{lesson.practice}</p>
    </section>
  </div>;
}

function Challenges({titles,freeById,completed,open,setOpen,toggle}){return <Page><PageIntro label="PRACTICE" title="60 challenges. Not 60 decorative boxes." text="The first 10 are interactive on the public site. The remaining 50 are mapped to the paid toolkit so the curriculum structure is visible without publishing the customer workbook."/><CheckoutCard/><div className="challenge-toolbar"><span>{completed.length}/60 completed</span><span>10 interactive</span><span>50 toolkit</span></div><div className="challenge-browser">{titles.map(c=>{const free=freeById.get(c.id),isDone=completed.includes(c.id);return <div key={c.id} className={`browser-row ${open[c.id]?'open':''}`}><button className="browser-main" disabled={!free} onClick={()=>setOpen(x=>({...x,[c.id]:!x[c.id]}))}><span className="browser-id">{c.id}</span><strong>{c.title}</strong><span className={`access-pill ${free?'free':''}`}>{free?'FREE':'TOOLKIT'}</span><span className="completion-state">{isDone?'✓':'○'}</span></button>{open[c.id]&&free&&<FreeChallenge challenge={free} done={isDone} toggle={toggle}/>}</div>})}</div></Page>}

function FreeChallenge({challenge,done,toggle}) {
  const id=`DSP-${String(challenge.id).padStart(3,'0')}`;
  const storageKey=`devsprint.code.${id}`;
  const starter=starterCode(challenge);
  const [code,setCode]=useState(()=>localStorage.getItem(storageKey)||starter);
  const [results,setResults]=useState([]);
  const [showHint,setShowHint]=useState(false);
  const [showPseudo,setShowPseudo]=useState(false);
  const [showSolution,setShowSolution]=useState(false);
  const [running,setRunning]=useState(false);
  const run=async()=>{
    if(running) return;
    try { localStorage.setItem(storageKey,code); } catch { /* Browser storage is optional; execution must still work. */ }
    setRunning(true);
    setResults([]);
    try {
      setResults(await runChallengeInWorker(challenge,code));
    } catch(error) {
      setResults([{pass:false,message:'Runner error: '+(error?.message||'Unable to execute challenge.')}]);
    } finally {
      setRunning(false);
    }
  };
  const allPassed=results.length>0&&results.every(x=>x.pass);
  return <div className="free-challenge-detail interactive-workspace">
    <div className="challenge-header"><div><span className="section-label">{challenge.difficulty}</span><h3>{challenge.title}</h3><p>{challenge.skill}</p></div><span className="access-pill free">FREE</span></div>
    <div className="challenge-problem"><b>Problem</b><p>{challenge.prompt}</p><code>{challenge.example}</code></div>
    <div className="learning-disclosure"><button onClick={()=>setShowHint(x=>!x)}>💡 {showHint?'Hide hint':'Show hint'}</button><button onClick={()=>setShowPseudo(x=>!x)}>📝 {showPseudo?'Hide pseudocode':'Show pseudocode'}</button></div>
    {showHint&&<div className="hint-box"><b>Hint</b><p>{challenge.hint}</p></div>}
    {showPseudo&&<div className="hint-box"><b>Pseudocode</b><ol>{challenge.pseudocode.map(step=><li key={step}>{step}</li>)}</ol></div>}
    <label className="editor-label">YOUR JAVASCRIPT</label>
    <textarea className="code-editor" value={code} onChange={e=>setCode(e.target.value)} spellCheck="false" aria-label={`Code editor for ${challenge.title}`}/>
    <div className="challenge-actions"><button className="button primary" onClick={run} disabled={running}>{running?'Running tests…':'▶ Run tests'}</button><button className="button secondary" onClick={()=>{setCode(starter);setResults([]);localStorage.removeItem(storageKey)}}>Reset</button><button className="button secondary" onClick={()=>setShowSolution(x=>!x)}>{showSolution?'Hide solution':'Show solution'}</button>{allPassed&&<button className="button primary" onClick={()=>toggle(id)}>{done?'Completed ✓':'Mark complete'}</button>}</div>
    {results.length>0&&<div className={`test-results ${allPassed?'passed':'failed'}`}><div className="results-head"><strong>{allPassed?'All tests passed':'Keep debugging'}</strong><span>{results.filter(x=>x.pass).length}/{results.length} passed</span></div>{results.map((r,i)=><div className="test-result" key={`${id}-${i}`}><span>{r.pass?'✓':'✗'}</span><div><strong>Test {i+1}</strong><p>{r.message}</p></div></div>)}</div>}
    {showSolution&&<div className="solution-panel"><b>Reference solution</b><pre><code>{challenge.solution}</code></pre><p>Use this only after attempting the problem. The goal is to learn the reasoning, not collect solutions like trading cards.</p></div>}
    <div className="complexity-line"><strong>Complexity</strong><span>{challenge.complexity}</span></div>
  </div>;
}

function starterCode(challenge){const starters={
  1:'function findLargest(numbers) {\n  // Write your solution here\n}',
  2:'function countEven(numbers) {\n  // Write your solution here\n}',
  3:'function reverseString(text) {\n  // Write your solution here\n}',
  4:'function sumPositive(numbers) {\n  // Write your solution here\n}',
  5:'function findFirst(numbers, target) {\n  // Write your solution here\n}',
  6:'function removeDuplicates(numbers) {\n  // Write your solution here\n}',
  7:'function isPalindrome(text) {\n  // Write your solution here\n}',
  8:'function secondLargest(numbers) {\n  // Write your solution here\n}',
  9:'function isBalanced(text) {\n  // Write your solution here\n}',
  10:'function twoSum(numbers, target) {\n  // Write your solution here\n}',
};return starters[challenge.id]||'// Write your solution here';}

function Tools({tools,onTool}){return <Page><PageIntro label="LABS & TOOLS" title="Practice beyond the lesson." text="Open a real workspace instead of staring at a card pretending it is a feature."/><div className="tool-grid large">{tools.map(t=><ToolCard key={t.id} tool={t} onClick={()=>onTool(t)}/>)}</div><section className="tools-method"><span className="section-label">THE FULL LOOP</span><div className="roadmap"><b>Learn</b><i>→</i><b>Attempt</b><i>→</i><b>Test</b><i>→</i><b>Debug</b><i>→</i><b>Explain</b><i>→</i><b>Revise</b></div></section></Page>}

function ToolDetail({tool,back,project}){return <Page><button className="back-button" onClick={back}>← Back to labs &amp; tools</button><PageIntro label={tool.status.toUpperCase()} title={tool.title} text={tool.description}/><section className="lesson-roadmap"><span className="section-label">WORKSPACE</span>{tool.prompt&&<div className="hint-box"><b>Task</b><p>{tool.prompt}</p></div>}{tool.buggyCode&&<div className="code-compare"><div><span className="section-label">BUG</span><pre><code>{tool.buggyCode}</code></pre></div><div><span className="section-label">FIX</span><pre><code>{tool.fix}</code></pre></div></div>}{tool.steps&&<div className="tool-steps">{tool.steps.map((s,i)=><div key={s}><span>{String(i+1).padStart(2,'0')}</span><strong>{s}</strong></div>)}</div>}{tool.id==='project'&&<button className="button primary" onClick={project}>Open Module 8 project →</button>}</section></Page>}

function Progress({modules,moduleDone,done,percent,onModule}){return <Page><PageIntro label="PROGRESS" title="Your learning, in one place." text="Sign in to sync completed challenges with your DevSprint account. Guest progress stays in this browser."/><section className="stats-grid"><Stat value={`${done}/60`} label="Challenges completed"/><Stat value={`${percent}%`} label="Overall progress"/><Stat value={modules.filter(m=>moduleDone(m)===m.count).length} label="Modules finished"/><Stat value={60-done} label="Remaining"/></section><div className="progress-module-list">{modules.map(m=>{const d=moduleDone(m);return <button className="progress-module" key={m.id} onClick={()=>onModule(m)}><div><span>MODULE {m.number}</span><strong>{m.title}</strong></div><div className="progress-module-right"><b>{d}/{m.count}</b><div className="progress-track"><div className="progress-fill" style={{width:`${d/m.count*100}%`}}/></div></div></button>})}</div></Page>}

function Page({children}){return <div className="page">{children}</div>}
function PageIntro({label,title,text}){return <section className="page-intro"><span className="eyebrow">{label}</span><h1>{title}</h1><p>{text}</p></section>}
function SectionHeader({title,action,onAction}){return <div className="section-header"><h2>{title}</h2><button onClick={onAction}>{action} →</button></div>}
function Stat({value,label}){return <div className="stat"><strong>{value}</strong><span>{label}</span></div>}
function ModuleCard({module,completed,onClick}){return <button type="button" className="module-card" onClick={onClick} aria-label={"Open Module "+module.number+": "+module.title}><div className="module-card-top"><span>{module.number}</span><span>{completed}/{module.count}</span></div><h3>{module.title}</h3><p>{module.description}</p><div className="card-meta"><span>{module.count} challenges</span><span>{module.range}</span></div><div className="card-arrow">→</div></button>}
function ToolCard({tool,onClick}){return <button className="tool-card clickable" onClick={onClick}><span className="tool-icon">{tool.icon}</span><div><span className="tool-status">{tool.status}</span><h3>{tool.title}</h3><p>{tool.description}</p></div><span className="card-arrow">→</span></button>}
function ChallengeRow({id,title,completed,free,onClick}){return <button className="challenge-row" onClick={onClick} disabled={!free}><span className="browser-id">{id}</span><strong>{title}</strong><span className={`access-pill ${free?'free':''}`}>{free?'FREE':'TOOLKIT'}</span><span className="completion-state">{completed?'✓':'○'}</span></button>}
