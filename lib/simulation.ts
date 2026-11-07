export type Stakeholder = { id: string; name: string; role: string; personality: string; knownInformation: string; hiddenInformation: string };
export type FinancialAssumption = { id: string; label: string; value: string; explanation: string };
export type CaseDocument = { id: string; title: string; content: string; audience: "student" | "instructor" };
export type StudentDecision = { id: string; prompt: string; guidance: string };
export type RubricCriterion = { id: string; title: string; description: string; points: number };
export type SimulationConfig = {
  version: 1; id: string; templateId: string; title: string;
  company: string; industry: string; background: string;
  studentRole: string; difficulty: "Introductory" | "Intermediate" | "Advanced";
  objectives: string; stakeholders: Stakeholder[]; assumptions: FinancialAssumption[];
  documents: CaseDocument[]; decisions: StudentDecision[]; rubric: RubricCriterion[];
};
export type SimulationDraft = { config: SimulationConfig; stage: number; updatedAt: string };
export const SIMULATION_PREFIX = "teacher-hub-simulation-v1:";
export const ACTIVE_SIMULATION_KEY = "teacher-hub-active-simulation-v1";
export const simulationStages = ["Scenario", "Student Experience", "AI Stakeholders", "Decisions and Financial Information", "Assessment", "Preview and Test"];
export function newSimulationId() { return crypto.randomUUID(); }
export function duplicateSimulation(config: SimulationConfig, id: string): SimulationConfig {
  return { ...structuredClone(config), id, title: `${config.title || "Untitled simulation"} (copy)` };
}
// LocalStorage is untrusted: validate every nested collection before rendering.
export function isSimulationDraft(value: unknown): value is SimulationDraft {
  const object = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
  const strings = (v: Record<string, unknown>, keys: string[]) => keys.every(key => typeof v[key] === "string");
  const rows = (v: unknown, keys: string[], extra: (v: Record<string, unknown>) => boolean = () => true) => Array.isArray(v) && v.every(item => object(item) && strings(item, keys) && extra(item));
  if (!object(value) || !object(value.config)) return false;
  const c = value.config;
  return typeof value.stage === "number" && Number.isInteger(value.stage) && value.stage >= 0 && value.stage < 6 && typeof value.updatedAt === "string" &&
    c.version === 1 && strings(c, ["id", "templateId", "title", "company", "industry", "background", "studentRole", "difficulty", "objectives"]) &&
    typeof c.id === "string" && /^[a-zA-Z0-9-]+$/.test(c.id) && ["Introductory", "Intermediate", "Advanced"].includes(c.difficulty as string) &&
    rows(c.stakeholders, ["id", "name", "role", "personality", "knownInformation", "hiddenInformation"]) &&
    rows(c.assumptions, ["id", "label", "value", "explanation"]) &&
    rows(c.documents, ["id", "title", "content", "audience"], item => item.audience === "student" || item.audience === "instructor") &&
    rows(c.decisions, ["id", "prompt", "guidance"]) &&
    rows(c.rubric, ["id", "title", "description"], item => typeof item.points === "number" && Number.isFinite(item.points) && item.points >= 0 && item.points <= 100);
}
