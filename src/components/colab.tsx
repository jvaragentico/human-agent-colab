"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, Check, ChevronLeft, Compass, Download, Eye, Flag, HeartHandshake, Lightbulb, Menu, MessageCircle, RotateCcw, ShieldCheck, Sparkles, Users, X, Zap } from "lucide-react";
import { agentReply, averageScores, blankDraft, metricLabels, missions, newSession, restoreSession, scoreMission, storageKey, styles, type Draft, type Metric, type Session, type Style } from "@/lib/missions";
const icons=[Compass, Sparkles, ShieldCheck];
function Brand(){return <span className="brand"><span className="brand-mark"><i/><i/></span>CoLab<span className="brand-by">HUMAN × AGENT</span></span>}
function MetricBars({scores}:{scores:ReturnType<typeof averageScores>}){
  return <div className="metric-bars">{(Object.keys(scores) as Metric[]).map(key=><div key={key}><div className="metric-label"><span>{metricLabels[key]}</span><strong>{scores[key]}<small>/100</small></strong></div><div className="track"><span style={{width:scores[key]+"%"}}/></div></div>)}</div>;
}
export default function CoLab(){
  const [session,setSession]=useState<Session>(newSession);
  const [screen,setScreen]=useState<"home"|"lab">("home");
  const [ready,setReady]=useState(false);
  const [notice,setNotice]=useState("");
  const [mobileMenu,setMobileMenu]=useState(false);
  const [resetOpen,setResetOpen]=useState(false);
  const [reflection,setReflection]=useState("");
  const heading=useRef<HTMLHeadingElement>(null);
  useEffect(()=>{
    try{
      const raw=localStorage.getItem(storageKey);
      if(raw){const saved=restoreSession(raw);if(saved)setSession(saved);else setNotice("Your previous session could not be restored. A fresh session is ready.");}
    }catch{setNotice("Browser storage is unavailable. You can still play; keep this tab open to retain progress.");}
    setReady(true);
  },[]);
  useEffect(()=>{
    if(!ready)return;
    try{localStorage.setItem(storageKey,JSON.stringify(session));}
    catch{setNotice("Progress cannot be saved in this browser. Keep this tab open and download your report when finished.");}
  },[session,ready]);
  useEffect(()=>{if(screen==="lab"){heading.current?.focus();window.scrollTo({top:0,behavior:"instant"});}},[screen,session.stage,session.results.length]);
  const active=missions[Math.min(session.results.length,2)];
  const draft=session.draft;
  function updateDraft(patch:Partial<Draft>){setSession(s=>({...s,draft:{...s.draft,...patch}}));}
  function enter(){setScreen("lab");setMobileMenu(false);}
  function submit(){
    if(!draft.choice||draft.rationale.trim().length<20)return;
    const outcome=active.options.find(o=>o.id===draft.choice)!.fit;
    setSession(s=>({...s,results:[...s.results,{...s.draft,missionId:active.id,scores:scoreMission(active,s.draft),outcome,reflection:"",style:s.style}],draft:blankDraft(),stage:"reflection"}));
    setReflection("");
  }
  function next(){
    setSession(s=>({...s,note:reflection.trim(),results:s.results.map((r,i)=>i===s.results.length-1?{...r,reflection:reflection.trim(),style:s.style}:r),stage:s.results.length===3?"report":"mission"}));
  }
  function reset(){setSession(newSession());setReflection("");setResetOpen(false);setScreen("lab");}
  function download(){
    const scores=averageScores(session.results);
    const text=["# Human × AI Team Report","", "A local, scripted cooperation experiment. Scores describe in-app behaviors, not validated psychological traits.","",
      ...Object.entries(scores).map(([k,v])=>metricLabels[k as Metric]+": "+v+"/100"),"",
      ...session.results.flatMap((r,i)=>["## "+missions[i].title,"Decision: "+missions[i].options.find(o=>o.id===r.choice)?.title,"Scenario fit: "+r.outcome+"/100","Your reasoning: "+r.rationale,"Reflection: "+(r.reflection||"No written reflection."),"Next collaboration style: "+styles[r.style].label,""]),
      "Memory stays in this browser. No account, external AI service, or API key was used."
    ].join("\n");
    const url=URL.createObjectURL(new Blob([text],{type:"text/markdown;charset=utf-8"}));
    const a=document.createElement("a");a.href=url;a.download="human-ai-team-report.md";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  const hasProgress=session.results.length>0||draft.shared.length>0||draft.inspected.length>0||!!draft.choice||!!draft.rationale;
  const last=session.results.at(-1);
  return <>
    <a href="#main" className="skip-link">Skip to content</a>
    <header className="site-header"><div className="nav-wrap">
      <button className="brand-button" aria-label="CoLab home" onClick={()=>setScreen("home")}><Brand/></button>
      <nav aria-label="Main navigation" className={mobileMenu?"nav open":"nav"}>
        <a href="#how-it-works" onClick={()=>{setScreen("home");setMobileMenu(false);}}>How it works</a>
        <a href="#missions" onClick={()=>{setScreen("home");setMobileMenu(false);}}>The missions</a>
        <a href="https://github.com/jvaragentico/human-agent-colab" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14}/></a>
      </nav>
      <div className="nav-actions"><span className="version">EXPERIMENT / V1</span><button className="button dark small" onClick={enter} disabled={!ready}>{hasProgress?"Resume session":"Enter the lab"}<ArrowUpRight size={15}/></button><button className="menu-button" onClick={()=>setMobileMenu(!mobileMenu)} aria-label="Toggle navigation" aria-expanded={mobileMenu}>{mobileMenu?<X/>:<Menu/>}</button></div>
    </div></header>
    {notice&&<div className="notice" role="status">{notice}<button aria-label="Dismiss notice" onClick={()=>setNotice("")}><X size={16}/></button></div>}
    <main id="main">
      {screen==="home"?<>
        <section className="hero shell">
          <div className="hero-copy"><div className="eyebrow"><span className="live-dot"/>A PLAYGROUND FOR HUMAN–AI COOPERATION</div>
            <h1>Different minds.<br/>Better <span className="serif">together.</span><span className="hero-asterisk" aria-hidden="true">✳</span></h1>
            <p className="hero-description">Your intuition. An agent’s analysis.<br/>Three small missions to discover what happens<br className="desktop-break"/> when you actually work as a team.</p>
            <div className="hero-cta"><button className="button dark" onClick={enter} disabled={!ready}>{hasProgress?"Continue your experiment":"Find your team rhythm"}<ArrowUpRight size={19}/></button><span>About 10 minutes.<br/><strong>A new perspective.</strong></span></div>
            <div className="hero-meta"><span><Check size={14}/> No sign-up</span><span><Check size={14}/> No API keys</span><span><Check size={14}/> Just curiosity</span></div>
          </div>
          <div className="hero-visual" aria-label="Human context and agent analysis combine into a shared plan">
            <div className="visual-grid"/><span className="visual-caption">THE TEAM IS THE INTERFACE.</span>
            <div className="orbit orbit-one"/><div className="orbit orbit-two"/>
            <div className="role-card human-card"><div className="card-top"><span className="avatar human-avatar"><Users size={22}/></span><span className="tiny-label">01 / HUMAN</span></div><strong>You bring<br/>the <em>why.</em></strong><p>Context · Intuition · Care</p><span className="card-tag">“They need a quiet afternoon.”</span></div>
            <div className="join-mark" aria-hidden="true">×</div>
            <div className="role-card agent-card"><div className="card-top"><span className="avatar agent-avatar"><Sparkles size={22}/></span><span className="tiny-label">02 / AGENT</span></div><strong>I find<br/>the <em>way.</em></strong><p>Evidence · Options · Structure</p><span className="card-tag">“Let’s check the possibilities.”</span></div>
            <div className="shared-note"><span className="check-circle"><Check size={18}/></span><div><strong>One plan. Both perspectives.</strong><span>Something neither would choose alone.</span></div><ArrowUpRight size={19}/></div>
            <span className="visual-bottom"><span className="live-dot"/> COMPLEMENTARY BY DESIGN</span>
          </div>
        </section>
        <section className="principle-strip"><div className="shell strip-inner"><span>LESS PROMPTING.<br/><strong>MORE PARTNERING.</strong></span><p>You know things the agent doesn’t.<br/>The agent sees things you don’t.</p><p className="strip-end">The interesting part?<br/><strong>How you bridge the gap.</strong><ArrowUpRight size={23}/></p></div></section>
        <section id="missions" className="shell missions-section"><div className="section-top"><div><div className="eyebrow">THE COOPERATION CIRCUIT</div><h2>Three missions.<br/><span className="serif">A little more in sync.</span></h2></div><p>Plan something thoughtful. Create something inclusive.<br/>Question something that looks certain.<br/>Build a better way of working, one round at a time.</p></div>
          <div className="mission-grid">{missions.map((m,i)=>{const Icon=icons[i];return <article key={m.id} className={"mission-card "+m.color}><div className="mission-card-top"><span className="mission-number">0{i+1}</span><Icon size={25} strokeWidth={1.5}/></div><div className={"mission-art art-"+i} aria-hidden="true">{i===0?<><span className="map-path"/><span className="map-dot dot-a"/><span className="map-dot dot-b"/><span className="map-place">A BETTER DETOUR ↗</span></>:i===1?<><span className="shape shape-one"/><span className="shape shape-two"/><span className="shape shape-three"/><span className="shape shape-four"/></>:<><span className="signal-line"/><span className="signal-circle"/><span className="signal-label">LOOK CLOSER</span></>}</div><div className="tiny-label">{m.category} <span>~3 MIN</span></div><h3>{m.title}</h3><p>{m.tagline}</p><div className="mission-roles"><span><Users size={14}/>{m.humanRole}</span><span><Sparkles size={14}/>{m.agentRole}</span></div></article>})}</div>
          <div className="mission-start"><span>Start with mission 01. Carry what you learn into the next.</span><button className="text-button" onClick={enter} disabled={!ready}>Let’s try it <ArrowRight size={18}/></button></div>
        </section>
        <section id="how-it-works" className="process-section"><div className="shell"><div className="section-top"><div><div className="eyebrow">A RELATIONSHIP, IN MINIATURE</div><h2>The collaboration<br/><span className="serif">gets better with you.</span></h2></div><span className="pill"><HeartHandshake size={16}/> Built around both of you</span></div><div className="process-grid">
          {[["01","Bring your half","Share the context only you have. Inspect the evidence your agent brings."],["02","Make the call, together","Challenge assumptions, weigh the options, and explain your decision."],["03","Reflect. Adapt. Repeat.","Choose how your agent should help next. Your reflections travel with you."]].map(([n,t,p])=><div key={n}><span className="step-number">{n}</span><h3>{t}</h3><p>{p}</p></div>)}
        </div><div className="report-preview"><div><span className="eyebrow">YOUR TAKEAWAY</span><h3>A Human × AI Team Report.</h3><p>See how you shared information, checked evidence, combined strengths, and reached decisions. Take your reflections with you.</p></div><div className="report-pills"><span><ShieldCheck size={16}/> Trust</span><span><MessageCircle size={16}/> Communication</span><span><HeartHandshake size={16}/> Complementarity</span><span><Zap size={16}/> Efficiency</span></div></div></div></section>
        <section className="shell closing"><span className="closing-symbol" aria-hidden="true">✳</span><h2>The future is a<br/><span className="serif">team sport.</span></h2><p>Start small. Stay curious. See what you can do together.</p><button className="button dark" onClick={enter} disabled={!ready}>Meet your other half <ArrowUpRight size={19}/></button></section>
      </>:<div className="shell lab-shell">
        <div className="lab-topline"><button className="text-button muted" onClick={()=>setScreen("home")}><ChevronLeft size={16}/> Back to playground</button><span className="pill"><span className="live-dot"/> Local demo agent · no API keys</span></div>
        <ol className="progress" aria-label="Mission progress">{missions.map((m,i)=><li key={m.id} className={session.results.length>i?"complete":session.results.length===i?"current":""}><span>{session.results.length>i?<Check size={14}/>:i+1}</span><div>{m.title}</div></li>)}<li className={session.stage==="report"?"current":""}><span><Flag size={13}/></span><div>Team report</div></li></ol>
        {session.stage==="mission"?<>
          <div className="lab-heading"><div className="eyebrow">MISSION 0{session.results.length+1} / {active.category}</div><h1 ref={heading} tabIndex={-1}>{active.title}<span className="serif">.</span></h1><p>{active.brief}</p></div>
          {session.results.length>0&&<div className="memory-banner"><Lightbulb size={21}/><div><strong>We’re building on last time.</strong><p>Agent approach: {styles[session.style].label.toLowerCase()}.{session.note&&<> Your reflection: “{session.note}”</>}</p></div></div>}
          <div className="workspace">
            <section className="panel human-panel"><div className="panel-heading"><span className="avatar human-avatar"><Users size={20}/></span><div><span className="tiny-label">YOUR SIDE</span><h2>{active.humanRole}</h2></div><span className="count">{draft.shared.length}/3 shared</span></div><p className="panel-description">Only you have this context. Share the cards you want your teammate to consider.</p>
              <div className="fact-list">{active.human.map(fact=>{const shared=draft.shared.includes(fact.id);return <div className={"fact "+(shared?"is-shared":"")} key={fact.id}><h3>{fact.label}</h3><p>{fact.detail}</p><button className="text-button" disabled={shared} onClick={()=>updateDraft({shared:[...draft.shared,fact.id]})}>{shared?<><Check size={14}/>Shared with agent</>:<>Share with agent <ArrowUpRight size={14}/></>}</button></div>})}</div>
            </section>
            <section className="panel agent-panel"><div className="panel-heading"><span className="avatar agent-avatar"><Sparkles size={20}/></span><div><span className="tiny-label">AGENT SIDE</span><h2>{active.agentRole}</h2></div><span className="count">{draft.inspected.length}/3 checked</span></div><p className="panel-description">Your teammate holds the structured evidence. Open each card to check the details yourself.</p>
              <div className="evidence-list">{active.evidence.map(fact=><details key={fact.id} onToggle={event=>{if(event.currentTarget.open&&!draft.inspected.includes(fact.id))setSession(s=>({...s,draft:{...s.draft,inspected:Array.from(new Set([...s.draft.inspected,fact.id]))}}));}}><summary><Eye size={16}/>{fact.label}<span>{draft.inspected.includes(fact.id)?<Check size={15}/>:"+"}</span></summary><p>{fact.detail}</p></details>)}</div>
              <div className="agent-response" aria-live="polite"><span className="tiny-label"><Sparkles size={13}/> TEAMMATE’S THINKING</span><p>{agentReply(active,draft,session.style)}</p>{draft.shared.length>0&&draft.shared.length<3&&<p className="context-received">Received: {active.human.filter(f=>draft.shared.includes(f.id)).map(f=>f.label).join(", ")}. More context may change my recommendation.</p>}</div>
              <button className="challenge-button" disabled={draft.challenged} onClick={()=>updateDraft({challenged:true})}><ShieldCheck size={16}/>{draft.challenged?"Assumption checked":"Challenge the assumption"}{!draft.challenged&&<ArrowUpRight size={15}/>}</button>
              {draft.challenged&&<p className="challenge-answer" role="status">{active.caveat}</p>}
            </section>
          </div>
          <section className="panel decision-panel"><div className="decision-header"><div><span className="eyebrow">THE SHARED DECISION</span><h2>What’s your team’s move?</h2></div><span className="pill">You make the final call.</span></div><fieldset className="option-grid"><legend className="sr-only">Choose a plan</legend>{active.options.map(option=><label className={"option "+(draft.choice===option.id?"selected":"")} key={option.id}><input type="radio" name="decision" value={option.id} checked={draft.choice===option.id} onChange={()=>updateDraft({choice:option.id})}/><strong>{option.title}</strong><span>{option.description}</span></label>)}</fieldset>
            <label className="field-label" htmlFor="rationale">Connect the dots <span>What human need and agent evidence support your choice?</span></label><textarea id="rationale" maxLength={600} value={draft.rationale} onChange={e=>updateDraft({rationale:e.target.value})} placeholder="We chose this because… (at least 20 characters)" rows={3}/><div className="field-helper">{draft.rationale.trim().length}/600 characters · explain your reasoning in at least 20 characters</div>
            <div className="decision-footer"><div className="confidence"><label htmlFor="confidence">How confident are you? <strong>{draft.confidence}%</strong></label><input id="confidence" type="range" min="0" max="100" step="10" value={draft.confidence} onChange={e=>updateDraft({confidence:Number(e.target.value)})}/><span>Uncertain <span>Certain</span></span></div><button className="button dark" disabled={!draft.choice||draft.rationale.trim().length<20} onClick={submit}>Commit team decision <ArrowRight size={18}/></button></div>
            <p className="quiet-note">Choose a plan and explain it to continue. Checking evidence is encouraged; agreeing with the agent is never required.</p>
          </section>
        </>:session.stage==="reflection"&&last?<>
          <div className="lab-heading"><div className="eyebrow">MISSION 0{session.results.length} / DEBRIEF</div><h1 ref={heading} tabIndex={-1}>A little more <span className="serif">in sync.</span></h1><p>A decision is useful. Understanding how you got there is what makes the next one better.</p></div>
          <div className="reflection-grid"><section className="panel result-panel"><span className="eyebrow">YOUR TEAM’S DECISION</span><h2>{missions[session.results.length-1].options.find(o=>o.id===last.choice)?.title}</h2><div className="fit-score">{last.outcome}<span>/100<br/>scenario fit</span></div><p>{missions[session.results.length-1].options.find(o=>o.id===last.choice)?.reason}</p><div className="lesson"><Lightbulb size={19}/>{missions[session.results.length-1].lesson}</div><MetricBars scores={last.scores}/><p className="quiet-note">Learning signals from your actions, not a judgment of you. View the scoring method in your final report.</p></section>
          <section className="panel reflection-panel"><span className="eyebrow">COLLABORATION MEMORY</span><h2>How should we work next?</h2><p>Your choice changes the agent’s responses in the next mission.</p><fieldset className="style-options"><legend className="sr-only">Agent collaboration style</legend>{(Object.keys(styles) as Style[]).map(key=><label className={session.style===key?"active":""} key={key}><input type="radio" name="style" checked={session.style===key} onChange={()=>setSession(s=>({...s,style:key}))}/><span><strong>{styles[key].label}</strong><small>{styles[key].description}</small></span></label>)}</fieldset><label className="field-label" htmlFor="reflection">One thing to carry forward <span>Optional · kept in this browser</span></label><textarea id="reflection" maxLength={400} value={reflection} onChange={e=>setReflection(e.target.value)} placeholder="Next time, I want to check assumptions before deciding…" rows={3}/><p className="quiet-note">Your note is shown as a reminder. The selected style controls the scripted agent; it does not interpret free text.</p><button className="button dark full" onClick={next}>{session.results.length===3?"Reveal your team report":"Carry this into mission 0"+(session.results.length+1)}<ArrowRight size={18}/></button></section></div>
        </>:session.stage==="report"?<>
          <div className="lab-heading report-heading"><div className="eyebrow">EXPERIMENT COMPLETE / YOUR TAKEAWAY</div><span className="report-flower" aria-hidden="true">✳</span><h1 ref={heading} tabIndex={-1}>Human × AI<br/><span className="serif">Team Report.</span></h1><p>Three decisions. Two perspectives. A clearer picture of how you work together.</p><div className="report-actions"><button className="button dark" onClick={download}><Download size={17}/> Download report</button><button className="button outline" onClick={()=>setResetOpen(true)}><RotateCcw size={16}/> Try a new approach</button></div></div>
          <div className="report-summary"><section className="panel"><span className="eyebrow">YOUR COLLABORATION SIGNALS</span><h2>How you teamed up</h2><MetricBars scores={averageScores(session.results)}/><p className="quiet-note">Averages across three missions. These illustrative scores describe actions inside this demo; they are not validated measures of trust, ability, or personality.</p></section><section className="panel takeaways"><span className="eyebrow">WHAT TO TAKE WITH YOU</span><h2>Your next experiment</h2><div><ShieldCheck/><p><strong>{averageScores(session.results).trust>=70?"Keep making trust evidence-based.":"Try checking more of the evidence."}</strong>{averageScores(session.results).trust>=70?"You inspected sources and challenged assumptions. Carry that habit into higher-stakes decisions.":"Inspect all three source cards and challenge the initial assumption before committing."}</p></div><div><HeartHandshake/><p><strong>{averageScores(session.results).communication>=75?"Keep sharing the human context.":"Make your context visible."}</strong>{averageScores(session.results).communication>=75?"Your teammate can use your priorities only when you share them. That is a team strength.":"A teammate cannot account for needs you keep to yourself. Share the context cards, then connect them to the evidence."}</p></div><div><Lightbulb/><p><strong>Your chosen rhythm: {styles[session.style].label.toLowerCase()}.</strong>{session.note||"Use another run to compare a different collaboration style."}</p></div></section></div>
          <section className="journey-section"><div className="eyebrow">THE PATH YOU TOOK</div><h2>Every mission left a trace.</h2><div className="journey-grid">{session.results.map((r,i)=><article className={"panel "+missions[i].color} key={r.missionId}><span className="tiny-label">0{i+1} / {missions[i].category}</span><h3>{missions[i].title}</h3><strong>{missions[i].options.find(o=>o.id===r.choice)?.title}</strong><p>{r.rationale}</p><div className="journey-stat"><span>Context shared <b>{r.shared.length}/3</b></span><span>Evidence checked <b>{r.inspected.length}/3</b></span><span>Assumption challenged <b>{r.challenged?"Yes":"No"}</b></span><span>Scenario fit <b>{r.outcome}/100</b></span></div><blockquote>{r.reflection||"No written reflection this round."}</blockquote></article>)}</div></section>
          <details className="scoring-details"><summary>How these scores work</summary><div><p><strong>Calibrated trust:</strong> 20 points per evidence card opened, plus 40 for challenging the assumption. Confidence above 80% with fewer than two evidence cards incurs a 20-point deduction.</p><p><strong>Communication:</strong> up to 75 points for sharing three context cards, plus 25 for a rationale of at least 20 characters. Text quality is not evaluated.</p><p><strong>Complementarity:</strong> 40% context sharing, 30% evidence inspection, 30% scenario fit.</p><p><strong>Task efficiency:</strong> 70% scenario fit plus 30 points when at least two context and two evidence cards were used (otherwise 15). This is a useful-process proxy, not a speed measure; no timer penalizes reading or accessibility needs.</p><p>Scenario fit is authored against the fictional needs and constraints. Viewing a card cannot prove understanding. No score is a scientific assessment, and agreement with the agent earns no points on its own.</p></div></details>
        </>:null}
        <div className="lab-bottom"><span><ShieldCheck size={14}/> Your session stays in this browser.</span><button className="text-button muted" onClick={()=>setResetOpen(true)}>Reset session</button></div>
      </div>}
    </main>
    <footer className="shell footer"><Brand/><p>A small experiment in a more collaborative future.</p><a href="https://github.com/jvaragentico/human-agent-colab" target="_blank" rel="noreferrer">Explore the source <ArrowUpRight size={15}/></a><div className="footer-note">Transparent by design: this V1 uses a scripted local agent, not a live language model. No account or API key required.</div></footer>
    {resetOpen&&<div className="modal-backdrop" onClick={()=>setResetOpen(false)}><section className="reset-modal" role="dialog" aria-modal="true" aria-labelledby="reset-title" onClick={e=>e.stopPropagation()} onKeyDown={e=>{if(e.key==="Escape")setResetOpen(false);if(e.key==="Tab"){const buttons=e.currentTarget.querySelectorAll("button");const first=buttons[0],lastButton=buttons[buttons.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();lastButton.focus();}else if(!e.shiftKey&&document.activeElement===lastButton){e.preventDefault();first.focus();}}}}><h2 id="reset-title">Start a fresh experiment?</h2><p>This clears your decisions and reflections from this browser. Download your finished report first if you want to keep it.</p><div><button autoFocus className="button outline" onClick={()=>setResetOpen(false)}>Keep my session</button><button className="button dark" onClick={reset}>Reset and restart</button></div></section></div>}
  </>;
}

