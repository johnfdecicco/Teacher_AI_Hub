"use client";
import { useEffect, useState } from "react";
import { DRAFT_KEY, LEGACY_KEY, newDraft, restoreDraft, type CourseDraft } from "@/lib/course-profile";

// Development only: mirror the draft to .dev/course-profile.json via a local route.
let mirrorTimer: number | undefined;
function mirrorToDevFile(draft: CourseDraft) {
  if (process.env.NODE_ENV !== "development") return;
  window.clearTimeout(mirrorTimer);
  mirrorTimer = window.setTimeout(() => {
    fetch("/api/dev/course-profile", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(draft) }).catch(() => {});
  }, 500);
}

export function useCourseDraft() {
  const [draft, setDraft] = useState<CourseDraft>(newDraft);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = localStorage.getItem(DRAFT_KEY);
        const legacy = saved ? null : localStorage.getItem(LEGACY_KEY);
        if (saved || legacy) {
          const restored = restoreDraft(JSON.parse(saved || legacy!), !saved);
          setDraft(restored);
          mirrorToDevFile(restored);
        }
      } catch { setStorageError(true); }
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  function saveDraft(next: CourseDraft) {
    setDraft(next);
    mirrorToDevFile(next);
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(next)); setStorageError(false); }
    catch { setStorageError(true); }
  }
  return { draft, ready, storageError, saveDraft };
}
