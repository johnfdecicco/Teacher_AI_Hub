import Link from "next/link";
import type { Recommendation } from "@/lib/opportunities";
import { Icon } from "../icon";
export function SimulationTemplatePending({ recommendation }: { recommendation: Recommendation }) {
  return <><Link href="/opportunities" className="text-link preview-back">← Back to Opportunity Center</Link><div className="page-heading"><div><p className="eyebrow">SIMULATION STUDIO · BUILD & CUSTOMIZE</p><h1>{recommendation.title}</h1><p>A future configurable scenario using the shared simulation framework.</p></div></div><section className="empty-state"><span className="empty-icon"><Icon name="studio" size={32} /></span><span className="badge">Template coming soon</span><h2>This scenario is not ready to configure yet.</h2><p>The Investment Committee Simulation is the first functional configuration template. You can customize its scenario, stakeholders, decisions, and rubric now.</p><Link className="button primary" href="/studio/investment-committee">Open Investment Committee Studio<Icon name="arrow" size={17} /></Link><Link href="/opportunities" className="text-link">Explore other opportunities</Link></section></>;
}
