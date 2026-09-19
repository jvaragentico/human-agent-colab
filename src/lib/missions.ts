export type Style = "balanced" | "concise" | "evidence" | "questions";
export type Metric = "trust" | "communication" | "complementarity" | "efficiency";
export type Scores = Record<Metric, number>;
export type Fact = { id: string; label: string; detail: string };
export type Option = { id: string; title: string; description: string; fit: number; reason: string };
export type Mission = {
  id: string; title: string; category: string; tagline: string; brief: string;
  color: string; humanRole: string; agentRole: string; human: Fact[]; evidence: Fact[];
  options: Option[]; initial: string; informed: string; question: string;
  caveat: string; recommended: string; lesson: string;
};
export const metricLabels: Record<Metric, string> = {
  trust: "Calibrated trust", communication: "Communication",
  complementarity: "Complementarity", efficiency: "Task efficiency"
};
export const styles: Record<Style, {label:string; description:string}> = {
  balanced: {label:"Keep it balanced",description:"A recommendation, with the key reason."},
  concise: {label:"Keep it brief",description:"Lead with the answer; trim the explanation."},
  evidence: {label:"Show your reasoning",description:"Surface the evidence before the recommendation."},
  questions: {label:"Ask before advising",description:"Check my priorities before proposing a plan."}
};
export const missions: Mission[] = [
  {
    id:"lost-tourist",title:"The perfect detour",category:"PLAN TOGETHER",tagline:"A good route needs more than a map.",
    color:"peach",brief:"Alex has one afternoon in a new city. Find a place that works for the person, not just the itinerary. You know Alex. Your agent knows the city.",
    humanRole:"Read the person",agentRole:"Read the possibilities",
    human:[
      {id:"energy",label:"Low energy",detail:"Alex has been walking all morning. Another long walk would spoil the afternoon."},
      {id:"atmosphere",label:"Quiet connection",detail:"This is a reunion with an old friend. Somewhere quiet matters more than a famous landmark."},
      {id:"budget",label:"A €20 ceiling",detail:"Alex can spend at most €20, including getting there."}
    ],
    evidence:[
      {id:"routes",label:"Route & cost check",detail:"Skyline: 25-minute uphill walk, €18. Riverside: 5-minute shuttle (€4) + café (€12). Gallery: 10-minute walk, €8 entry."},
      {id:"crowds",label:"Crowd forecast",detail:"Skyline is crowded today. Riverside has a quiet courtyard. The gallery is hosting a busy school workshop."},
      {id:"hours",label:"Opening hours",detail:"All three are open until 18:00. The riverside shuttle runs every 10 minutes. These are fictional scenario facts."}
    ],
    options:[
      {id:"skyline",title:"Skyline lookout",description:"Iconic views · uphill walk · €18",fit:25,reason:"The view is lovely, but the uphill walk and crowds conflict with Alex’s energy and need to talk."},
      {id:"riverside",title:"Riverside courtyard",description:"Quiet café · short shuttle · €16 total",fit:100,reason:"The shuttle saves energy, the courtyard makes conversation easy, and the total stays below €20."},
      {id:"gallery",title:"Small city gallery",description:"Art & discovery · 10-minute walk · €8",fit:55,reason:"Affordable, but the school workshop undermines the quiet atmosphere Alex needs."}
    ],
    initial:"Skyline is the most distinctive stop on the map. That is only a starting point: I do not know Alex’s energy, preferences, or spending limit yet.",
    informed:"With Alex’s low energy, preference for quiet, and €20 ceiling, Riverside looks strongest. The €16 shuttle-and-café plan fits all three.",
    question:"What would make this afternoon feel successful for Alex: a landmark, or time to reconnect?",
    caveat:"Popularity is not suitability. My first suggestion used location data without Alex’s personal context.",
    recommended:"riverside",lesson:"Sharing human context changed the agent’s recommendation."
  },
  {
    id:"community-studio",title:"Make room for everyone",category:"CREATE TOGETHER",tagline:"Turn a clever idea into a welcoming one.",
    color:"lavender",brief:"Design a small community evening. You bring the people’s needs; the agent brings venue and format constraints. Choose an experience that welcomes the whole group.",
    humanRole:"Bring empathy & taste",agentRole:"Check feasibility",
    human:[
      {id:"access",label:"Step-free access",detail:"One participant uses a wheelchair. A fully step-free venue is essential."},
      {id:"voices",label:"Space for quiet voices",detail:"Several first-time attendees dislike public speaking. Participation should never require a performance."},
      {id:"making",label:"Make something together",detail:"The group wants to leave with a shared creation, not only watch a presentation."}
    ],
    evidence:[
      {id:"venues",label:"Venue constraints",detail:"Rooftop: stairs only. Ground-floor studio: step-free, accessible restroom. Lecture hall: step-free, fixed forward-facing seats."},
      {id:"materials",label:"Materials & budget",detail:"Budget: €120. Studio collage materials cost €75. Rooftop music setup costs €110. Lecture projection costs €40."},
      {id:"formats",label:"Format check",detail:"Collage supports seated making and optional written contributions. Open-mic asks people to perform. A lecture is mostly passive."}
    ],
    options:[
      {id:"rooftop",title:"Rooftop open-mic",description:"Music & stories · €110 · stairs only",fit:15,reason:"Stairs exclude a participant, and an open-mic puts pressure on people who dislike public speaking."},
      {id:"collage",title:"Community collage studio",description:"Shared artwork · €75 · step-free",fit:100,reason:"A seated collage with optional written contributions supports access, quieter voices, and a shared creation."},
      {id:"lecture",title:"Inspiration screening",description:"Watch & discuss · €40 · step-free",fit:50,reason:"The hall meets the access requirement, but watching a screening does not deliver the shared making the group asked for."}
    ],
    initial:"The rooftop open-mic has a memorable atmosphere and fits the budget. I need the group’s needs before calling it a good fit.",
    informed:"The collage studio fits all three needs. Offer seated workstations and optional written contributions so no one has to speak publicly.",
    question:"Which needs are non-negotiable for this group, even if another format sounds more exciting?",
    caveat:"A low price or exciting format does not compensate for excluding someone. Access is a requirement, not a bonus.",
    recommended:"collage",lesson:"Human priorities turned feasibility into an inclusive design."
  },
  {
    id:"signal-check",title:"Beyond the headline",category:"DECIDE TOGETHER",tagline:"Sometimes the best teammate challenges you.",
    color:"mint",brief:"A small community café tested an ordering kiosk. Decide what to do next. The agent has the pilot numbers; you have observations that the headline misses.",
    humanRole:"Notice what data misses",agentRole:"Inspect the evidence",
    human:[
      {id:"help",label:"Hidden staff help",detail:"You watched staff guide most kiosk users. Those minutes were not included in the timing report."},
      {id:"exclusion",label:"Some people left",detail:"Two customers who struggled with the interface left before ordering. Their experience is absent from the completion data."},
      {id:"choice",label:"Keep a human option",detail:"The café’s owner values personal service and wants customers to retain a staffed ordering option."}
    ],
    evidence:[
      {id:"sample",label:"Inspect the sample",detail:"Only 12 completed kiosk orders were timed, during one quiet afternoon. There was no randomized comparison."},
      {id:"headline",label:"Inspect the headline",detail:"Completed kiosk orders averaged 3 minutes versus a historical 5-minute average. The apparent 40% gain excludes staff assistance and abandoned orders."},
      {id:"next",label:"Design a better test",detail:"A one-week hybrid trial can count all arrivals, record assistance time and abandonment, and ask customers about accessibility."}
    ],
    options:[
      {id:"replace",title:"Go all-in on kiosks",description:"Roll out immediately · remove staffed ordering",fit:10,reason:"The headline is based on a small, biased sample and overlooks assistance, abandonment, and the café’s service priorities."},
      {id:"hybrid",title:"Run a supported hybrid trial",description:"Keep human service · measure the whole experience",fit:100,reason:"A longer hybrid trial preserves customer choice while collecting missing evidence about assistance, abandonment, and accessibility."},
      {id:"scrap",title:"Drop the idea entirely",description:"Stop testing · retain the current setup",fit:45,reason:"The pilot is insufficient for rollout, but also insufficient to conclude the idea cannot help. A supported test can reduce uncertainty."}
    ],
    initial:"The headline shows orders were 40% faster. That suggests potential, but it does not establish a reliable benefit. I need your observations and a sample check.",
    informed:"Your observations explain why the headline overstates the evidence. Keep staffed ordering and run a one-week hybrid trial that records assistance and abandonment.",
    question:"Who is missing from the completed-order numbers, and what happened to them?",
    caveat:"The 40% figure is arithmetic, not causal proof. Twelve completed orders cannot establish that kiosks improve the whole customer experience.",
    recommended:"hybrid",lesson:"Calibrated trust means checking an agent’s evidence, not automatically agreeing."
  }
];
export type Draft = { shared:string[]; inspected:string[]; challenged:boolean; choice:string; rationale:string; confidence:number };
export type Result = Draft & { missionId:string; scores:Scores; outcome:number; reflection:string; style:Style };
export type Session = { version:1; results:Result[]; draft:Draft; style:Style; note:string; stage:"mission"|"reflection"|"report" };
export const blankDraft = ():Draft => ({shared:[],inspected:[],challenged:false,choice:"",rationale:"",confidence:60});
export const newSession = ():Session => ({version:1,results:[],draft:blankDraft(),style:"balanced",note:"",stage:"mission"});
export function scoreMission(m:Mission,d:Draft):Scores {
  const shared = m.human.filter(f=>d.shared.includes(f.id)).length;
  const inspected = m.evidence.filter(f=>d.inspected.includes(f.id)).length;
  const fit = m.options.find(o=>o.id===d.choice)?.fit ?? 0;
  // Confidence is a self-report, not a claim about correctness. High certainty
  // with little evidence reduces calibrated trust; agreement alone never earns it.
  const overconfidence = d.confidence>80 && inspected<2 ? 20 : 0;
  return {
    trust:Math.max(0,Math.min(100,inspected*20+(d.challenged?40:0)-overconfidence)),
    communication:Math.round(shared/3*75)+(d.rationale.trim().length>=20?25:0),
    complementarity:Math.round((shared/3*40)+(inspected/3*30)+(fit/100*30)),
    efficiency:Math.round(fit*.7+(shared>=2&&inspected>=2?30:15))
  };
}
export function averageScores(results:Result[]):Scores {
  const scores:Scores={trust:0,communication:0,complementarity:0,efficiency:0};
  for(const key of Object.keys(scores) as Metric[]) scores[key]=results.length?Math.round(results.reduce((sum,r)=>sum+r.scores[key],0)/results.length):0;
  return scores;
}
export function agentReply(m:Mission,d:Draft,style:Style):string {
  const enough=m.human.every(f=>d.shared.includes(f.id));
  const recommendation=enough?m.informed:m.initial;
  if(style==="questions"&&!enough) return m.question+" Share your context cards so I can use those priorities.";
  if(style==="concise") return enough?"My pick: "+m.options.find(o=>o.id===m.recommended)?.title+". It fits the priorities you shared.":"I need your context before making a confident recommendation.";
  if(style==="evidence") return (d.inspected.length?m.evidence.filter(f=>d.inspected.includes(f.id)).map(f=>f.detail).join(" "):"Open an evidence card to inspect my sources.")+" "+recommendation;
  return recommendation;
}
const isObject=(v:unknown):v is Record<string,unknown>=>typeof v==="object"&&v!==null&&!Array.isArray(v);
const isStyle=(v:unknown):v is Style=>typeof v==="string"&&Object.hasOwn(styles,v);
function validDraft(v:unknown,m:Mission):v is Draft {
  if(!isObject(v))return false;
  return Array.isArray(v.shared)&&v.shared.length<=3&&new Set(v.shared).size===v.shared.length&&v.shared.every(x=>m.human.some(f=>f.id===x))
    &&Array.isArray(v.inspected)&&v.inspected.length<=3&&new Set(v.inspected).size===v.inspected.length&&v.inspected.every(x=>m.evidence.some(f=>f.id===x))
    &&typeof v.challenged==="boolean"&&typeof v.choice==="string"&&(v.choice===""||m.options.some(o=>o.id===v.choice))
    &&typeof v.rationale==="string"&&v.rationale.length<=600&&typeof v.confidence==="number"&&Number.isFinite(v.confidence)&&v.confidence>=0&&v.confidence<=100;
}
export function restoreSession(raw:string):Session|null {
  try {
    const v:unknown=JSON.parse(raw);
    if(!isObject(v)||v.version!==1||!Array.isArray(v.results)||v.results.length>3||!isStyle(v.style)||typeof v.note!=="string"||v.note.length>400)return null;
    const results:Result[]=[];
    for(let i=0;i<v.results.length;i++){
      const r:unknown=v.results[i];const m=missions[i];
      if(!isObject(r)||r.missionId!==m.id||typeof r.reflection!=="string"||r.reflection.length>400||!isStyle(r.style))return null;
      const reflection=r.reflection, style=r.style;
      if(!validDraft(r,m)||!r.choice||r.rationale.trim().length<20)return null;
      results.push({...r,missionId:m.id,scores:scoreMission(m,r),outcome:m.options.find(o=>o.id===r.choice)!.fit,reflection,style});
    }
    if(v.stage!=="mission"&&v.stage!=="reflection"&&v.stage!=="report")return null;
    if(v.stage==="report"&&results.length!==3||v.stage==="reflection"&&!results.length||v.stage==="mission"&&results.length===3)return null;
    if(!validDraft(v.draft,missions[Math.min(results.length,2)]))return null;
    return {version:1,results,draft:v.draft,style:v.style,note:v.note,stage:v.stage};
  }catch{return null;}
}
export const storageKey="human-agent-colab:v1";
