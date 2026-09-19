import test from "node:test";
import assert from "node:assert/strict";
import { missions, blankDraft, scoreMission, agentReply, newSession, restoreSession, averageScores } from "../src/lib/missions.ts";
test("full cooperation earns full scores in all three scenarios",()=>{
  for(const m of missions){
    const d={...blankDraft(),shared:m.human.map(f=>f.id),inspected:m.evidence.map(f=>f.id),challenged:true,choice:m.recommended,rationale:"The human priorities and checked evidence support this plan."};
    assert.deepEqual(scoreMission(m,d),{trust:100,communication:100,complementarity:100,efficiency:100});
  }
});
test("blind agreement does not earn calibrated trust",()=>{
  const m=missions[0],d={...blankDraft(),choice:m.recommended,confidence:100,rationale:"I agreed with the agent without checking any sources."};
  assert.equal(scoreMission(m,d).trust,0);
  assert.ok(scoreMission(m,d).complementarity<40);
});
test("unsupported confidence incurs a penalty, not a speed penalty",()=>{
  const d={...blankDraft(),inspected:["routes"],challenged:true,confidence:90};
  assert.equal(scoreMission(missions[0],d).trust,40);
  assert.equal(scoreMission(missions[0],{...d,confidence:70}).trust,60);
});
test("context and chosen collaboration style change agent behavior",()=>{
  const m=missions[0],d=blankDraft();
  assert.equal(agentReply(m,d,"balanced"),m.initial);
  assert.match(agentReply(m,d,"questions"),/What would/);
  const shared={...d,shared:m.human.map(f=>f.id)};
  assert.equal(agentReply(m,shared,"balanced"),m.informed);
  assert.match(agentReply(m,shared,"concise"),/My pick: Riverside/);
  assert.match(agentReply(m,{...shared,inspected:["routes"]},"evidence"),/25-minute uphill/);
});
test("storage rejects malformed, out-of-order and unknown states",()=>{
  assert.equal(restoreSession("{"),null);
  assert.equal(restoreSession(JSON.stringify({...newSession(),stage:"report"})),null);
  assert.equal(restoreSession(JSON.stringify({...newSession(),style:"unknown"})),null);
  assert.equal(restoreSession(JSON.stringify({...newSession(),draft:{...blankDraft(),shared:["invented"]}})),null);
  assert.equal(restoreSession(JSON.stringify({...newSession(),draft:{...blankDraft(),shared:["energy","energy"]}})),null);
});
test("storage restores legitimate progress and recomputes tampered scores",()=>{
  const m=missions[0],d={...blankDraft(),shared:m.human.map(f=>f.id),choice:m.recommended,rationale:"A quiet courtyard fits Alex's needs and budget."};
  const session={...newSession(),stage:"reflection",results:[{...d,missionId:m.id,scores:{trust:999},outcome:999,reflection:"",style:"concise"}]};
  const restored=restoreSession(JSON.stringify(session));
  assert.ok(restored);assert.equal(restored.results[0].scores.trust,0);assert.equal(restored.results[0].outcome,100);
  assert.deepEqual(averageScores(restored.results),restored.results[0].scores);
});
