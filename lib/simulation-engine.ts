import type { SimulationConfig } from "./simulation";

// Content-independent workflow: never pass instructor-only content to a student view.
export function studentView(config: SimulationConfig) {
  return {
    title: config.title, company: config.company, industry: config.industry, background: config.background,
    role: config.studentRole, difficulty: config.difficulty, objectives: config.objectives,
    stakeholders: config.stakeholders.map(({ id, name, role, personality, knownInformation }) => ({ id, name, role, personality, knownInformation })),
    assumptions: config.assumptions,
    documents: config.documents.filter(document => document.audience === "student").map(({ id, title, content }) => ({ id, title, content })),
    decisions: config.decisions, rubric: config.rubric,
  };
}
export function rubricTotal(config: SimulationConfig) { return config.rubric.reduce((total, item) => total + item.points, 0); }
export function validateDecisionResponses(config: SimulationConfig, responses: Record<string, string>) {
  return config.decisions.filter(decision => !responses[decision.id]?.trim()).map(decision => decision.id);
}
export function configurationIssues(config: SimulationConfig): string[] {
  const issues: string[] = [];
  if (!config.title.trim() || !config.company.trim() || !config.background.trim()) issues.push("Add a title, company, and scenario background.");
  if (!config.studentRole.trim() || !config.objectives.trim()) issues.push("Add the student role and learning objectives.");
  if (!config.decisions.length || config.decisions.some(item => !item.prompt.trim())) issues.push("Add at least one required student decision and complete every decision prompt.");
  if (!config.rubric.length || config.rubric.some(item => !item.title.trim()) || rubricTotal(config) <= 0) issues.push("Add named rubric criteria with a positive total score.");
  if (config.stakeholders.some(item => !item.name.trim() || !item.role.trim())) issues.push("Complete names and roles for each stakeholder.");
  if (config.documents.some(item => !item.title.trim() || !item.content.trim())) issues.push("Complete the title and text of each case document.");
  return issues;
}
