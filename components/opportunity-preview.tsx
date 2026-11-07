"use client";
import Link from "next/link";
import { useState } from "react";
import type { Recommendation } from "@/lib/opportunities";
import { Icon } from "./icon";

export function OpportunityPreview({ recommendation: item, action }: { recommendation: Recommendation; action: "learn" | "build" }) {
  const [title, setTitle] = useState(item.title);
  const [level, setLevel] = useState("Introductory");
  const [focus, setFocus] = useState(item.objectives[0]);
  const [scenario, setScenario] = useState("");
  const learning = action === "learn";
  return <>
    <Link className="text-link preview-back" href="/opportunities">← Back to Opportunity Center</Link>
    <div className="page-heading"><div><p className="eyebrow">{item.discipline.toUpperCase()} · {item.category.toUpperCase()}</p><h1>{item.title}</h1><p>{learning ? 'Learn How: guided workshop preview' : 'Build With Me: customizable foundation preview'}</p></div><span className="badge">Preview only</span></div>
    <div className="notice"><Icon name="bulb" /><div><strong>{learning ? 'Workshop outline · Full instruction is not implemented yet' : 'Planning preview · Builder is not implemented yet'}</strong><p>{learning ? 'Explore the planned learning sequence below. Interactive lessons, progress tracking, and project generation are not connected.' : 'Adjust this planning outline to explore a possible foundation. Changes remain on this page only and are not saved. No simulation, spreadsheet, AI agent, or project is generated.'}</p></div></div>
    <div className="opportunity-preview-layout"><section className="wizard-card"><div className="wizard-heading"><h2>{learning ? 'What you will learn to create' : 'Shape your foundation'}</h2><p>{item.professorCreates}</p></div>
      {learning ? <ol className="workshop-outline">{item.implementation.map((text, index) => <li key={text}><span>0{index + 1}</span><div><h3>{['Frame the learning experience', 'Design and verify the foundation', 'Prepare for classroom use'][index]}</h3><p>{text}</p><small>Planned workshop activity · Not an interactive lesson</small></div></li>)}</ol> : <>
        <div className="form-field"><label htmlFor="foundation-title">Working title</label><input id="foundation-title" maxLength={200} value={title} onChange={event => setTitle(event.target.value)} /></div>
        <div className="form-field"><label htmlFor="foundation-level">Student experience level</label><select id="foundation-level" value={level} onChange={event => setLevel(event.target.value)}><option>Introductory</option><option>Intermediate</option><option>Advanced</option></select></div>
        <div className="form-field"><label htmlFor="foundation-focus">Learning focus</label><textarea id="foundation-focus" rows={3} maxLength={3000} value={focus} onChange={event => setFocus(event.target.value)} /></div>
        <div className="form-field"><label htmlFor="foundation-scenario">Your scenario notes (optional)</label><textarea id="foundation-scenario" rows={4} maxLength={5000} value={scenario} onChange={event => setScenario(event.target.value)} placeholder="Add a fictional company, class activity, or case context you might use." /></div>
        <div className="foundation-outline" aria-label="Live planning outline"><span className="eyebrow">YOUR PLANNING OUTLINE · NOT A GENERATED PROJECT</span><h3>{title.trim() || 'Untitled foundation'}</h3><p><strong>Experience level:</strong> {level}</p><p><strong>Learning focus:</strong> {focus.trim() || 'Add a learning focus above.'}</p>{scenario.trim() && <p><strong>Scenario notes:</strong> {scenario}</p>}<h4>Starting implementation steps</h4><ol>{item.implementation.map(text => <li key={text}>{text}</li>)}</ol></div>
      </>}
      <div className="wizard-actions"><Link href={`/opportunities/${item.id}/${learning ? 'build' : 'learn'}`} className="button primary">{learning ? 'Preview Build With Me' : 'Preview Learn How'}<Icon name="arrow" size={17} /></Link><Link href="/opportunities" className="text-link">Explore other opportunities</Link></div>
    </section><aside className="preview-context-card"><h3>Learning objectives this could support</h3><ul>{item.objectives.map(text => <li key={text}>{text}</li>)}</ul><h3>What students would do</h3><p>{item.studentActivity}</p><h3>Proposed technology</h3><ul>{item.technology.map(text => <li key={text}>{text}</li>)}</ul><h3>Future customization options</h3><ul>{item.customization.map(text => <li key={text}>{text}</li>)}</ul><p className="preview-action-note">Curated library example. No document analysis or personalized AI findings.</p></aside></div>
  </>;
}
