export type CourseProfile = {
  name: string;
  discipline: string;
  description: string;
  objectives: string;
  topics: string;
  assignments: string;
  assessments: string;
  methods: string;
  challenges: string;
};
export type FileMetadata = { name: string; size: number | null; type: string };
export type CourseDraft = {
  version: 2;
  method: "upload" | "manual";
  context: string;
  profile: CourseProfile;
  syllabus: FileMetadata | null;
};
export const DRAFT_KEY = "teacher-hub-course-profile-v2";
export const LEGACY_KEY = "teacher-hub-diagnosis-v1";
export const MAX_FILE_SIZE = 20 * 1024 * 1024;
export const emptyProfile: CourseProfile = {
  name: "", discipline: "", description: "", objectives: "", topics: "",
  assignments: "", assessments: "", methods: "", challenges: "",
};
export function newDraft(): CourseDraft {
  return { version: 2, method: "upload", context: "", profile: { ...emptyProfile }, syllabus: null };
}
// Restore only known fields. Never restore File objects or inferred AI findings.
export function restoreDraft(value: unknown, legacy = false): CourseDraft {
  const draft = newDraft();
  if (!value || typeof value !== "object") return draft;
  const data = value as Record<string, unknown>;
  const source = legacy ? data : data.profile;
  if (source && typeof source === "object") {
    const fields = source as Record<string, unknown>;
    for (const field of Object.keys(emptyProfile) as (keyof CourseProfile)[]) {
      if (typeof fields[field] === "string") draft.profile[field] = fields[field];
    }
  }
  if (data.method === "manual") draft.method = "manual";
  if (typeof data.context === "string") draft.context = data.context;
  if (legacy && typeof data.filename === "string" && data.filename) {
    draft.syllabus = { name: data.filename, size: null, type: "" };
  } else if (data.syllabus && typeof data.syllabus === "object") {
    const file = data.syllabus as Record<string, unknown>;
    if (typeof file.name === "string" && file.name) draft.syllabus = {
      name: file.name,
      size: typeof file.size === "number" && Number.isFinite(file.size) && file.size >= 0 ? file.size : null,
      type: typeof file.type === "string" ? file.type : "",
    };
  }
  return draft;
}
export function validateSyllabus(file: { name: string; size: number }): string | null {
  if (!/\.(pdf|docx)$/i.test(file.name)) return "Please choose a PDF or DOCX file.";
  if (file.size === 0) return "This file is empty. Please choose another file.";
  if (file.size > MAX_FILE_SIZE) return "This file is too large. Please choose a file smaller than 20 MB.";
  return null;
}
export function formatFileSize(size: number | null): string {
  if (size === null) return "Size unavailable";
  return size < 1024 * 1024 ? `${Math.max(1, Math.round(size / 1024))} KB` : `${(size / (1024 * 1024)).toFixed(1)} MB`;
}
