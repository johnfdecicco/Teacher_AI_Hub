import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

// Exercise the pure matcher without a browser or any additional test dependency.
const source = readFileSync(new URL("../lib/opportunities.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
const { matchRecommendations, recommendations } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);
const empty = { name: "", discipline: "", description: "", objectives: "", topics: "", assignments: "", assessments: "", methods: "", challenges: "" };
const match = overrides => matchRecommendations({ ...empty, ...overrides });

assert.equal(recommendations.length, 10);
assert.equal(new Set(recommendations.map(r => r.id)).size, 10);
for (const item of recommendations) {
  for (const field of ["title", "category", "professorCreates", "studentActivity"]) assert.ok(item[field]);
  for (const field of ["topics", "keywords", "objectives", "technology", "implementation", "customization"]) assert.ok(item[field].length);
}
assert.deepEqual(match({}), []);
assert.deepEqual(match({ name: "Finance NPV" }), []);
assert.deepEqual(match({ discipline: "Biology", topics: "NPV" }), []);
assert.deepEqual(match({ description: "A creditable presentation about riskiness" }), []);
assert.equal(match({ discipline: "Finance", topics: "capital budgeting NPV IRR", objectives: "Evaluate net present value" })[0].recommendation.id, "capital-budgeting");
assert.equal(match({ discipline: "Accounting", topics: "auditing internal controls materiality", objectives: "Evaluate audit evidence" })[0].recommendation.id, "audit-engagement");
assert.equal(match({ discipline: "Accounting", topics: "journal entries debits credits" })[0].recommendation.id, "journal-entry-coach");
assert.ok(match({ discipline: "Finance", description: "journal entries" }).every(m => m.recommendation.discipline === "Finance"));
assert.ok(match({ discipline: "Finance and Accounting" }).some(m => m.recommendation.discipline === "Accounting"));
assert.ok(match({ topics: "DCF and WACC" }).some(m => m.recommendation.id === "valuation-model"));
const single = match({ topics: "NPV" });
const repeated = match({ topics: "npv NPV npv" });
assert.deepEqual(single, repeated);
assert.deepEqual(single[0].evidence, [{ field: "topics", keyword: "npv", points: 3 }]);
assert.equal(match({ objectives: "NPV" })[0].score, 4);
assert.equal(match({ description: "NPV" })[0].score, 2);
assert.ok(match({ discipline: "Finance" }).every(m => m.score === 1 && m.evidence[0].field === "discipline"));
assert.deepEqual(match({ discipline: "Finance" }), match({ discipline: "Finance" }));
console.log("PASS: 10 complete definitions, Finance/Accounting ranking, field evidence and weights, case/word boundaries, repetition, stable ties, unsupported and empty profile fallbacks.");
