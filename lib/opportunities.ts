import type { CourseProfile } from "./course-profile";

export type Discipline = "Finance" | "Accounting";
export type Experience = "Model" | "Simulation" | "Dashboard" | "Teaching agent";
export type Recommendation = {
  id: string; title: string; discipline: Discipline; category: Experience;
  topics: string[]; keywords: string[]; objectives: string[];
  professorCreates: string; studentActivity: string; technology: string[];
  implementation: string[]; customization: string[];
};
export const recommendations: Recommendation[] = [
  {
    id: "capital-budgeting", title: "Capital Budgeting Model", discipline: "Finance", category: "Model",
    topics: ["Capital budgeting", "Cash flows"], keywords: ["capital budgeting", "npv", "net present value", "irr", "internal rate of return", "cash flow", "cash flows", "discount rate"],
    objectives: ["Evaluate projects using NPV and IRR", "Explain how assumptions affect an investment decision"],
    professorCreates: "A spreadsheet-based investment model with scenario inputs and a scaffold for AI-assisted explanations.",
    studentActivity: "Estimate cash flows, calculate NPV and IRR, test discount rates, and defend a project recommendation.",
    technology: ["Spreadsheet software (Excel or a compatible alternative)", "Optional future AI explanation assistant"],
    implementation: ["Define a fictional project and its cash-flow assumptions.", "Build and verify NPV, IRR, and sensitivity calculations.", "Design prompts for explaining assumptions and a rubric for checking reasoning."],
    customization: ["Project scenario", "Investment horizon", "Discount rate", "Assessment rubric"],
  },
  {
    id: "investment-committee", title: "Investment Committee Simulation", discipline: "Finance", category: "Simulation",
    topics: ["Portfolio management", "Risk and return"], keywords: ["investment committee", "portfolio", "portfolio management", "risk", "return", "asset allocation", "investment policy"],
    objectives: ["Compare investment choices under competing constraints", "Defend a portfolio allocation using evidence"],
    professorCreates: "A role-based committee scenario with investor briefs, decision rounds, and a proposed AI stakeholder role.",
    studentActivity: "Take committee roles, debate risk and return, allocate a fictional portfolio, and write a decision memo.",
    technology: ["Browser-based scenario interface (future builder)", "Optional future AI stakeholder agent"],
    implementation: ["Set a fictional investor mandate and candidate investments.", "Create roles, evidence packets, and decision checkpoints.", "Assess the quality of trade-offs and run a structured debrief."],
    customization: ["Investor mandate", "Asset universe", "Role briefs", "Decision rounds"],
  },
  {
    id: "statement-dashboard", title: "Financial Statement Analysis Dashboard", discipline: "Finance", category: "Dashboard",
    topics: ["Financial statements", "Ratio analysis"], keywords: ["financial statement", "financial statements", "ratio analysis", "liquidity", "profitability", "leverage", "financial ratios"],
    objectives: ["Interpret liquidity, profitability, and leverage ratios", "Connect financial trends to a business explanation"],
    professorCreates: "A financial dashboard with checked ratio formulas, comparison charts, and questions for AI-assisted interpretation.",
    studentActivity: "Compare fictional companies, investigate ratio changes, and distinguish numerical observations from unsupported explanations.",
    technology: ["Spreadsheet charts or a future browser dashboard", "Optional future AI interpretation assistant"],
    implementation: ["Prepare a synthetic financial statement dataset.", "Define ratio formulas and check chart calculations.", "Add interpretation questions and require evidence for each conclusion."],
    customization: ["Company dataset", "Ratio selection", "Comparison period", "Interpretation prompts"],
  },
  {
    id: "valuation-model", title: "Financial Valuation Model", discipline: "Finance", category: "Model",
    topics: ["Valuation", "Cash flows"], keywords: ["valuation", "dcf", "discounted cash flow", "wacc", "terminal value", "enterprise value", "equity value"],
    objectives: ["Estimate enterprise and equity value", "Evaluate sensitivity to growth and discount-rate assumptions"],
    professorCreates: "A guided discounted cash-flow model with transparent assumptions and an AI questioning plan.",
    studentActivity: "Forecast cash flows, estimate terminal value, compare valuation scenarios, and critique the model's limitations.",
    technology: ["Spreadsheet software (Excel or a compatible alternative)", "Optional future AI Socratic prompts"],
    implementation: ["Select fictional forecast inputs and a valuation convention.", "Build a checked DCF and enterprise-to-equity bridge.", "Add sensitivity scenarios and a written defense of assumptions."],
    customization: ["Company case", "Forecast horizon", "Terminal growth", "Capital structure"],
  },
  {
    id: "finance-tutor", title: "AI Finance Tutor", discipline: "Finance", category: "Teaching agent",
    topics: ["Time value of money", "Risk and return"], keywords: ["time value of money", "present value", "future value", "compounding", "bonds", "bond pricing", "risk and return", "finance fundamentals"],
    objectives: ["Explain foundational finance concepts in plain language", "Identify and correct errors in financial reasoning"],
    professorCreates: "A tutor specification with approved reference concepts, hints, practice questions, and boundaries on giving answers.",
    studentActivity: "Work through practice problems, explain each step, request hints, and check answers against instructor-approved solutions.",
    technology: ["Future AI teaching-agent interface", "Instructor-approved reference material"],
    implementation: ["Choose concepts and prepare verified example solutions.", "Write hint-first tutor instructions and boundaries.", "Test misconceptions and evaluate responses before classroom use."],
    customization: ["Concept list", "Hint style", "Practice difficulty", "Reference solutions"],
  },
  {
    id: "audit-engagement", title: "Audit Engagement Simulation", discipline: "Accounting", category: "Simulation",
    topics: ["Auditing", "Internal controls"], keywords: ["audit", "auditing", "audit engagement", "materiality", "audit evidence", "internal control", "internal controls", "substantive testing"],
    objectives: ["Link audit risks to evidence-gathering procedures", "Justify an audit conclusion using documented evidence"],
    professorCreates: "A fictional audit case with evidence packets, control weaknesses, and a proposed AI client interview.",
    studentActivity: "Assess risks, plan procedures, interview a simulated client, inspect evidence, and document conclusions.",
    technology: ["Future browser simulation", "Optional future AI client agent"],
    implementation: ["Create a fictional client and scoped audit objective.", "Prepare evidence, risk cues, and interview boundaries.", "Design workpapers and evaluate evidence-based judgments."],
    customization: ["Client industry", "Risk areas", "Evidence packets", "Materiality assumptions"],
  },
  {
    id: "journal-entry-coach", title: "Journal Entry Coach", discipline: "Accounting", category: "Teaching agent",
    topics: ["Journal entries", "Double-entry accounting"], keywords: ["journal entry", "journal entries", "debit", "debits", "credit", "credits", "double entry", "double-entry", "accounting equation", "transaction analysis"],
    objectives: ["Translate business transactions into balanced journal entries", "Explain account classifications and debit-credit effects"],
    professorCreates: "A hint-first journal-entry practice design with verified solutions and a proposed AI feedback coach.",
    studentActivity: "Classify transactions, propose entries, check balances, and explain corrections rather than copy an answer.",
    technology: ["Future practice-form interface", "Optional future AI feedback agent"],
    implementation: ["Create transactions and instructor-verified journal entries.", "Define feedback stages for classification, direction, and amount.", "Test common misconceptions against a scoring rubric."],
    customization: ["Transaction set", "Chart of accounts", "Feedback style", "Difficulty"],
  },
  {
    id: "cost-variance", title: "Cost and Variance Analysis Model", discipline: "Accounting", category: "Model",
    topics: ["Cost accounting", "Variance analysis"], keywords: ["cost accounting", "managerial accounting", "variance", "variance analysis", "standard costing", "flexible budget", "cost behavior", "cost behaviour"],
    objectives: ["Calculate and interpret price and efficiency variances", "Distinguish a variance calculation from its possible causes"],
    professorCreates: "A standard-cost and flexible-budget model with scenario controls and AI-assisted reflection prompts.",
    studentActivity: "Calculate variances, investigate operational assumptions, and propose actions supported by the available data.",
    technology: ["Spreadsheet software (Excel or a compatible alternative)", "Optional future AI reflection assistant"],
    implementation: ["Set standard and actual inputs for a fictional operation.", "Verify price, quantity, and budget calculations.", "Add alternative explanations and require a reasoned management memo."],
    customization: ["Business scenario", "Cost drivers", "Standard and actual inputs", "Variance conventions"],
  },
  {
    id: "reporting-decisions", title: "Financial Reporting Decision Simulation", discipline: "Accounting", category: "Simulation",
    topics: ["Financial reporting", "Revenue recognition"], keywords: ["financial reporting", "revenue recognition", "accounting policy", "disclosure", "disclosures", "gaap", "ifrs", "recognition", "measurement"],
    objectives: ["Apply a specified reporting framework to an ambiguous case", "Explain and document a defensible accounting judgment"],
    professorCreates: "A reporting decision case with policy alternatives, instructor-provided guidance, and proposed AI stakeholder questions.",
    studentActivity: "Review case facts and supplied guidance, choose a treatment, compare reporting effects, and write a judgment memo.",
    technology: ["Future browser scenario interface", "Optional future AI stakeholder agent"],
    implementation: ["Select a reporting issue and supply the applicable guidance.", "Build evidence-based decision branches and consequences.", "Evaluate reasoning against an instructor-reviewed rubric."],
    customization: ["Reporting framework", "Case facts", "Policy alternatives", "Memo rubric"],
  },
  {
    id: "accounting-close", title: "Accounting Close Simulation", discipline: "Accounting", category: "Simulation",
    topics: ["Accounting cycle", "Reconciliation"], keywords: ["accounting close", "month-end", "month end", "closing entries", "adjusting entries", "reconciliation", "trial balance", "accounting cycle", "accruals"],
    objectives: ["Sequence and document a period-end close", "Identify discrepancies and prepare supported adjustments"],
    professorCreates: "A staged close workflow with a synthetic ledger, reconciliation tasks, and proposed AI review questions.",
    studentActivity: "Reconcile balances, resolve exceptions, post adjustments, and explain how the close changes the financial statements.",
    technology: ["Spreadsheet workpapers", "Future browser workflow and optional AI reviewer"],
    implementation: ["Prepare a fictional trial balance and supporting schedules.", "Create close tasks, exceptions, and verified adjustments.", "Assess the audit trail and debrief unresolved differences."],
    customization: ["Ledger dataset", "Close checklist", "Exceptions", "Adjustment complexity"],
  },
];

export type MatchEvidence = { field: "discipline" | "topics" | "objectives" | "description"; keyword: string; points: number };
export type RecommendationMatch = { recommendation: Recommendation; score: number; evidence: MatchEvidence[] };
const aliases: Record<Discipline, string[]> = { Finance: ["finance", "financial management", "investments", "corporate finance"], Accounting: ["accounting", "accountancy", "auditing", "managerial accounting"] };
function contains(text: string, term: string): boolean {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-z0-9])${escaped}($|[^a-z0-9])`, "i").test(text);
}
export function matchRecommendations(profile: CourseProfile): RecommendationMatch[] {
  const explicit = (Object.keys(aliases) as Discipline[]).filter(discipline => aliases[discipline].some(term => contains(profile.discipline, term)));
  // An explicitly unsupported discipline gets the example library, not a fabricated match.
  if (profile.discipline.trim() && explicit.length === 0) return [];
  return recommendations.flatMap(recommendation => {
    if (explicit.length && !explicit.includes(recommendation.discipline)) return [];
    const evidence: MatchEvidence[] = [];
    const alias = aliases[recommendation.discipline].find(term => contains(profile.discipline, term));
    if (alias) evidence.push({ field: "discipline", keyword: alias, points: 1 });
    for (const [field, points] of [["topics", 3], ["objectives", 4], ["description", 2]] as const) {
      for (const keyword of recommendation.keywords) {
        if (contains(profile[field], keyword)) evidence.push({ field, keyword, points });
      }
    }
    const score = evidence.reduce((sum, item) => sum + item.points, 0);
    return score ? [{ recommendation, score, evidence }] : [];
  }).sort((a, b) => b.score - a.score || a.recommendation.id.localeCompare(b.recommendation.id));
}
