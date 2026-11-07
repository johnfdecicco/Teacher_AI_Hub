import type { SimulationConfig } from "./simulation";

export function investmentCommitteeTemplate(id: string): SimulationConfig {
  return {
    version: 1, id, templateId: "investment-committee", title: "Investment Committee Simulation",
    company: "Northstar University Endowment", industry: "Institutional investment management",
    background: "Fictional teaching case: Northstar must allocate a $10 million investment pool for the next five years. The committee must balance growth, liquidity, and downside risk while supporting annual university spending. Use the supplied assumptions to propose an allocation and explain the trade-offs. All figures are illustrative, not market forecasts.",
    studentRole: "Investment committee analyst", difficulty: "Intermediate",
    objectives: "Evaluate risk and return across competing investments.\nDefend an allocation using evidence and explicit assumptions.\nExplain the effects of liquidity needs on an investment decision.",
    stakeholders: [
      { id: "cfo", name: "Morgan Lee", role: "Chief financial officer", personality: "Practical, cautious, and focused on meeting spending commitments.", knownInformation: "The university needs $400,000 in annual distributions and a reliable liquidity reserve.", hiddenInformation: "Instructor context: an unexpected facilities expense could require an additional $300,000 next year. Reveal only during a future facilitated decision round." },
      { id: "investment-chair", name: "Alex Rivera", role: "Investment committee chair", personality: "Curious, analytical, and willing to accept measured long-term risk.", knownInformation: "The investment horizon is five years. Explain the evidence behind each allocation and discuss downside scenarios.", hiddenInformation: "Instructor context: the chair will challenge recommendations that rely on expected return alone, even if those estimates look attractive." },
    ],
    assumptions: [
      { id: "pool", label: "Investment pool", value: "$10,000,000", explanation: "Illustrative starting capital; allocations should sum to this amount." },
      { id: "equity", label: "Equity fund expected annual return", value: "7%", explanation: "Fictional assumption; stress-test a 20% one-year loss." },
      { id: "bonds", label: "Bond fund expected annual return", value: "4%", explanation: "Fictional assumption; prices may fall when rates rise." },
      { id: "cash", label: "Cash expected annual return", value: "2%", explanation: "Fictional assumption; consider inflation and liquidity." },
    ],
    documents: [
      { id: "mandate", title: "Investment mandate", audience: "student", content: "Allocate the full $10 million among an equity fund, a bond fund, and cash. Hold at least 10% in cash. Plan for annual spending of $400,000. Explain the risk, liquidity, and return implications of your allocation." },
      { id: "brief", title: "Market scenario brief", audience: "student", content: "For this fictional exercise, consider an uncertain year with a possible equity decline and changing interest rates. The provided expected returns are scenario inputs, not guaranteed outcomes." },
      { id: "facilitator", title: "Facilitator notes", audience: "instructor", content: "There is no single optimal allocation. Assess whether students connect their assumptions to their decision and explain trade-offs. Hidden stakeholder information is not shown in the student preview." },
    ],
    decisions: [
      { id: "allocation", prompt: "Recommend an allocation across equities, bonds, and cash.", guidance: "State both percentages and amounts, check the total, and explain how the allocation meets the mandate." },
      { id: "downside", prompt: "Explain how your recommendation handles a downside scenario.", guidance: "Discuss distributions, liquidity, and what would cause you to revise your decision." },
    ],
    rubric: [
      { id: "evidence", title: "Evidence and calculations", description: "Uses the supplied assumptions consistently and checks allocation totals.", points: 40 },
      { id: "reasoning", title: "Risk and liquidity reasoning", description: "Explains trade-offs, uncertainty, and the spending mandate.", points: 40 },
      { id: "communication", title: "Decision communication", description: "Presents a clear, defensible recommendation and its limitations.", points: 20 },
    ],
  };
}
