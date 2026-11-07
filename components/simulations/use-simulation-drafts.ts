"use client";
import { useEffect, useState } from "react";
import { ACTIVE_SIMULATION_KEY, SIMULATION_PREFIX, duplicateSimulation, isSimulationDraft, newSimulationId, type SimulationConfig, type SimulationDraft } from "@/lib/simulation";
import { investmentCommitteeTemplate } from "@/lib/investment-committee-template";

export function useSimulationDrafts() {
  const [config, setConfig] = useState<SimulationConfig>(() => investmentCommitteeTemplate("initial"));
  const [stage, setStage] = useState(0);
  const [drafts, setDrafts] = useState<SimulationDraft[]>([]);
  const [ready, setReady] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    const timer = window.setTimeout(() => {
      let next = investmentCommitteeTemplate(newSimulationId());
      try {
        const saved: SimulationDraft[] = [];
        let skipped = 0;
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (!key?.startsWith(SIMULATION_PREFIX)) continue;
          try {
            const value: unknown = JSON.parse(localStorage.getItem(key) || "null");
            if (isSimulationDraft(value) && key === SIMULATION_PREFIX + value.config.id && value.config.templateId === "investment-committee") saved.push(value);
            else skipped++;
          } catch { skipped++; }
        }
        saved.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
        setDrafts(saved);
        const active = saved.find(item => item.config.id === localStorage.getItem(ACTIVE_SIMULATION_KEY));
        if (active) { next = active.config; setStage(active.stage); }
        setStatus(active ? "Resumed your last saved simulation." : "New template. Select Save to keep your draft.");
        if (skipped) setError("Some saved drafts could not be read and were skipped. Valid drafts remain available.");
      } catch { setError("Browser storage is unavailable. You can configure and test, but drafts cannot be saved or resumed."); }
      setConfig(next);
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  function update(next: SimulationConfig) { setConfig(next); setDirty(true); setStatus("Unsaved changes. Select Save to keep them."); }
  function move(next: number) { setStage(next); setDirty(true); setStatus("Step changed. Select Save to resume here later."); }
  function persist(next: SimulationConfig, nextStage: number, message: string) {
    try {
      const draft: SimulationDraft = { config: next, stage: nextStage, updatedAt: new Date().toISOString() };
      localStorage.setItem(SIMULATION_PREFIX + next.id, JSON.stringify(draft));
      localStorage.setItem(ACTIVE_SIMULATION_KEY, next.id);
      setDrafts(current => [draft, ...current.filter(item => item.config.id !== next.id)]);
      setConfig(next); setStage(nextStage); setDirty(false); setError(""); setStatus(message);
    } catch { setError("Save failed. Browser storage may be blocked or full. Your current configuration remains open; do not refresh before trying again."); }
  }
  function resume(id: string) {
    if (dirty && !window.confirm("Discard unsaved changes and resume the selected saved simulation?")) return;
    try {
      const value: unknown = JSON.parse(localStorage.getItem(SIMULATION_PREFIX + id) || "null");
      if (!isSimulationDraft(value) || value.config.id !== id || value.config.templateId !== "investment-committee") throw new Error("Invalid draft");
      localStorage.setItem(ACTIVE_SIMULATION_KEY, id);
      setConfig(value.config); setStage(value.stage); setDirty(false); setError(""); setStatus("Saved simulation resumed.");
    } catch { setError("This saved simulation could not be resumed. Your current configuration has been kept."); }
  }
  function reset() {
    if (!window.confirm("Reset this simulation to the original template? This replaces its saved configuration. Other simulations will be kept.")) return;
    persist(investmentCommitteeTemplate(config.id), 0, "This simulation was reset and saved. Other drafts were kept.");
  }
  return { config, stage, drafts, ready, dirty, status, error, update, move, resume, reset,
    save: () => persist(config, stage, "Simulation saved in this browser."),
    duplicate: () => persist(duplicateSimulation(config, newSimulationId()), stage, "Separate copy created and saved. The original saved draft was kept."),
  };
}
