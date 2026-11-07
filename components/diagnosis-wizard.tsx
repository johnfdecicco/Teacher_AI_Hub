"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { Icon } from "./icon";
import { useCourseDraft } from "./use-course-draft";
import { emptyProfile, formatFileSize, validateSyllabus, type CourseDraft, type CourseProfile } from "@/lib/course-profile";

type Analysis =
  | { status: "idle" }
  | { status: "analyzing" }
  | { status: "done"; fileName: string; filled: number }
  | { status: "error"; message: string };

// Fill only fields the teacher left blank, so their own entries always win.
function mergeProfile(current: CourseProfile, extracted: Partial<CourseProfile>) {
  const next = { ...current };
  let filled = 0;
  for (const key of Object.keys(emptyProfile) as (keyof CourseProfile)[]) {
    const value = typeof extracted[key] === "string" ? extracted[key].trim() : "";
    if (value && !current[key].trim()) { next[key] = value; filled++; }
  }
  return { profile: next, filled };
}

async function analyzeSyllabus(file: File, context: string): Promise<Partial<CourseProfile>> {
  if (process.env.NEXT_PUBLIC_STATIC_EXPORT === "true") {
    throw new Error("AI syllabus analysis needs the server version of Teacher Hub AI and isn't available on this hosted demo.");
  }
  const body = new FormData();
  body.append("syllabus", file);
  if (context.trim()) body.append("context", context);
  const res = await fetch("/api/analyze-syllabus", { method: "POST", body });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.profile) throw new Error(data?.error ?? `Analysis failed (HTTP ${res.status}).`);
  return data.profile;
}

export function DiagnosisWizard() {
  const { draft, ready, storageError, saveDraft } = useCourseDraft();
  const [step, setStep] = useState<0 | 1>(0);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [formError, setFormError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis>({ status: "idle" });
  const analyzing = analysis.status === "analyzing";
  const analyzed = analysis.status === "done" && analysis.fileName === draft.syllabus?.name;
  const picker = useRef<HTMLInputElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);

  function updateProfile(field: keyof CourseProfile, value: string) {
    saveDraft({ ...draft, profile: { ...draft.profile, [field]: value } });
  }
  function go(next: 0 | 1) {
    setStep(next);
    setFormError("");
    requestAnimationFrame(() => heading.current?.focus());
  }
  function selectFile(files: File[]) {
    if (files.length !== 1) { setFileError("Please select one syllabus at a time."); return; }
    const selected = files[0];
    const error = validateSyllabus(selected);
    if (error) { setFileError(error); return; }
    setFile(selected);
    setAnalysis({ status: "idle" });
    setFileError("");
    setFormError("");
    saveDraft({ ...draft, syllabus: { name: selected.name, size: selected.size, type: selected.type } });
  }
  function field(label: string, name: keyof CourseProfile, placeholder: string, multiline = false, required = false) {
    const props = { id: `profile-${name}`, name, value: draft.profile[name], required, maxLength: multiline ? 20000 : 200, placeholder, onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => updateProfile(name, event.target.value) };
    return <div className="form-field"><label htmlFor={props.id}>{label}{required ? <span> *</span> : <span className="optional-label"> (optional)</span>}</label>{multiline ? <textarea {...props} rows={name === "description" && step === 0 ? 8 : 4} /> : <input {...props} />}</div>;
  }

  return <>
    <div className="page-heading"><div><p className="eyebrow">DISCOVER WHAT&apos;S POSSIBLE</p><h1>Let&apos;s get to know your course.</h1><p>Upload your syllabus or tell us about your course. We&apos;ll help you discover how AI can enhance your teaching.</p></div></div>
    <div className="diagnosis-layout"><div>
      <ol className="wizard-steps diagnosis-progress" aria-label="Course diagnosis progress">{["Share your course", "Review Course Profile", "AI Opportunity Center"].map((label, index) => <li key={label} className={index <= step ? "current" : ""} aria-current={index === step ? "step" : undefined}><span>{index < step ? <Icon name="check" size={16} /> : index + 1}</span><small>{label}</small></li>)}</ol>
      <section className="wizard-card">
        <div className="wizard-heading"><span className="eyebrow">STEP {step + 1} OF 3</span><h2 ref={heading} tabIndex={-1}>{step === 0 ? "Start in the way that works for you" : "Your Course Profile"}</h2><p>{step === 0 ? "Choose a starting point. You can switch at any time without losing your work." : "Review, correct, or add details below. Every field is editable."}</p></div>
        {!ready ? <p role="status">Opening your saved draft...</p> : <form aria-busy={analyzing} onSubmit={async event => {
          event.preventDefault();
          if (step !== 0 || analyzing) return;
          if (draft.method === "manual" && (!draft.profile.name.trim() || !draft.profile.description.trim())) { setFormError("Please enter a course name and a short description."); return; }
          if (draft.method === "upload" && !draft.syllabus) { setFormError("Choose a PDF or DOCX syllabus, or switch to Describe My Course."); return; }
          let next: CourseDraft = draft;
          if (draft.method === "upload" && file && !analyzed) {
            setFormError("");
            setAnalysis({ status: "analyzing" });
            try {
              const { profile, filled } = mergeProfile(draft.profile, await analyzeSyllabus(file, draft.context));
              next = { ...draft, profile };
              setAnalysis({ status: "done", fileName: file.name, filled });
            } catch (err) {
              setAnalysis({ status: "error", message: err instanceof Error ? err.message : "Analysis failed." });
            }
          }
          saveDraft(next);
          go(1);
        }}>
          {step === 0 ? <>
            <div className="diagnosis-methods" role="group" aria-label="Choose how to share your course">
              {([['upload', 'Upload Syllabus', 'Start with a PDF or DOCX you already have.', 'upload'], ['manual', 'Describe My Course', 'Tell us about your course in your own words.', 'studio']] as const).map(([method, label, text, icon]) => <button key={method} type="button" aria-pressed={draft.method === method} className={`method-choice ${draft.method === method ? 'selected' : ''}`} onClick={() => { saveDraft({ ...draft, method }); setFormError(""); }}><span className="method-choice-title"><Icon name={icon} /><strong>{label}</strong><span className="method-indicator">{draft.method === method && <Icon name="check" size={12} />}</span></span><span>{text}</span></button>)}
            </div>
            {draft.method === "upload" ? <>
              <div className={`file-picker syllabus-dropzone ${dragging ? 'is-dragging' : ''}`} onDragOver={event => { event.preventDefault(); setDragging(true); }} onDragLeave={event => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setDragging(false); }} onDrop={event => { event.preventDefault(); setDragging(false); selectFile(Array.from(event.dataTransfer.files)); }}>
                <span className="empty-icon"><Icon name="upload" size={28} /></span><label htmlFor="syllabus">Choose a syllabus or drop it here</label><p id="syllabus-hint">PDF or DOCX only · Up to 20 MB · One file</p>
                <input ref={picker} id="syllabus" type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" aria-describedby={`syllabus-hint${fileError ? ' syllabus-error' : ''}`} aria-invalid={!!fileError} onChange={event => { if (event.target.files?.length) selectFile(Array.from(event.target.files)); event.target.value = ""; }} />
              </div>
              {fileError && <p className="form-error" id="syllabus-error" role="alert">{fileError}</p>}
              {draft.syllabus && <div className="file-details" role="status"><Icon name="book" /><div><strong>{draft.syllabus.name}</strong><p>{formatFileSize(draft.syllabus.size)} · {analyzed ? "Analyzed" : "Ready to analyze"}</p><p>{file ? "Selected in this session. It will be sent to the AI for analysis when you continue." : "Saved metadata only. Reselect the file to analyze it."}</p></div><div className="file-controls"><button type="button" className="text-link" disabled={analyzing} onClick={() => picker.current?.click()}>Replace</button><button type="button" className="text-link" disabled={analyzing} onClick={() => { setFile(null); setFileError(""); setAnalysis({ status: "idle" }); saveDraft({ ...draft, syllabus: null }); }}>Remove</button></div></div>}
              <div className="notice"><Icon name="bulb" /><div><strong>AI-assisted syllabus analysis</strong><p>When you continue, Claude reads your syllabus and drafts your course objectives, curriculum topics, assignments, and assessment methods for your review. It only fills fields you have left blank, and you can edit everything afterward. The file itself is not stored.</p></div></div>
              <div className="context-field form-field"><label htmlFor="course-context">Anything else we should know about your course? <span className="optional-label">(optional)</span></label><p>Add context about your students, teaching goals, or anything your syllabus might not cover.</p><textarea id="course-context" rows={5} maxLength={20000} value={draft.context} onChange={event => saveDraft({ ...draft, context: event.target.value })} placeholder="For example, my students come from different majors, and I would like to make class discussions more engaging." /></div>
            </> : <>
              {field("Course name", "name", "e.g., Introduction to Environmental Science", false, true)}
              {field("Tell us about your course", "description", "What do you teach? Who are your students? What do you want them to learn? You can also describe activities, assignments, or anything you would like to improve.", true, true)}
              <details className="optional-details"><summary>Add more detail <span>Learning objectives, assignments, and teaching challenges</span></summary><div>{field("Learning objectives", "objectives", "What should students know or be able to do?", true)}{field("Assignments", "assignments", "What do students work on?", true)}{field("Teaching challenges", "challenges", "Where could you or your students use more support?", true)}</div></details>
              {draft.syllabus && <p className="retained-context"><Icon name="book" size={16} /> Your syllabus selection is also included: {draft.syllabus.name}. Switch to Upload Syllabus to analyze it.</p>}
              {!!draft.context && <p className="retained-context">Your additional written context is saved and will appear in the Course Profile.</p>}
            </>}
          </> : <>
            {analysis.status === "error" ? <div className="notice profile-notice" role="alert"><Icon name="scan" /><div><strong>Syllabus analysis didn&apos;t complete</strong><p>{analysis.message} Your entries are safe. You can go back and try again, or fill in the fields yourself.</p></div></div>
            : analyzed ? <div className="notice profile-notice" role="status"><Icon name="scan" /><div><strong>Draft profile · Analyzed by AI — please review</strong><p>{analysis.filled > 0 ? `Claude filled ${analysis.filled} field${analysis.filled === 1 ? "" : "s"} from “${analysis.fileName}”. ` : `Claude found nothing new in “${analysis.fileName}” for the fields you left blank. `}AI can make mistakes, so check each field and correct anything that doesn&apos;t match your course. Fields you had already filled in were left unchanged.</p></div></div>
            : <div className="notice profile-notice"><Icon name="scan" /><div><strong>Draft profile · From your entries</strong><p>{draft.syllabus && draft.method === "upload" ? `The syllabus “${draft.syllabus.name}” hasn't been analyzed in this session. Go back and reselect it to analyze it. ` : ""}These details come from what you entered. Leave unknown fields blank or complete them yourself.</p></div></div>}
            {draft.syllabus && <div className="profile-source"><Icon name="book" size={17} /><span>{draft.syllabus.name} · {formatFileSize(draft.syllabus.size)}<small>{analyzed ? "Analyzed by AI · file not stored" : file ? "File selected for this session only · Not analyzed" : "File metadata restored; bytes not saved · Not analyzed"}</small></span></div>}
            {field("Course name", "name", "Add a name when you are ready")}
            {field("Academic discipline", "discipline", "e.g., Environmental Science")}
            {field("Course description", "description", "Describe the course in your own words", true)}
            {field("Learning objectives", "objectives", "What should students know or be able to do?", true)}
            {field("Curriculum topics", "topics", "Which subjects or themes does the course cover?", true)}
            {field("Assignments", "assignments", "What do students work on?", true)}
            {field("Assessment methods", "assessments", "How do you assess student learning?", true)}
            {field("Teaching methods", "methods", "e.g., Discussions, lectures, projects, or lab work", true)}
            {field("Teaching challenges", "challenges", "Where would you like more support?", true)}
            <div className="form-field"><label htmlFor="review-context">Additional written context <span className="optional-label">(optional)</span></label><textarea id="review-context" value={draft.context} maxLength={20000} rows={4} onChange={event => saveDraft({ ...draft, context: event.target.value })} /></div>
          </>}
          {formError && <p className="form-error" role="alert">{formError}</p>}
          <div className="wizard-actions">{step === 0 ? <span className="wizard-action-hint">Your work stays in this browser.</span> : <button className="button secondary" type="button" onClick={() => go(0)}>Back to course details</button>}{step === 0 ? <button className="button primary" type="submit" disabled={analyzing}>{analyzing ? "Analyzing your syllabus…" : <>Review Course Profile <Icon name="arrow" size={17} /></>}</button> : <Link href="/opportunities" className="button primary">AI Opportunity Center <Icon name="arrow" size={17} /></Link>}</div>
        </form>}
      </section><p className={`save-status ${storageError ? 'save-error' : ''}`} role="status">{storageError ? "Browser storage is unavailable. Changes may not survive navigation or a refresh." : ready ? analyzing ? "Claude is reading your syllabus. This can take up to a minute." : "Text and profile drafts save in this browser. File bytes are never saved in localStorage." : "Loading your draft..."}</p>
    </div><aside className="diagnosis-aside"><span className="tile-icon purple"><Icon name="bulb" /></span><h3>Your expertise comes first</h3><p>Start with what you already have. Upload a syllabus, describe your course, or combine a syllabus with written context.</p><hr /><h4>A simple path forward</h4><ul><li>Share your course</li><li>Review an editable Course Profile</li><li>Visit the AI Opportunity Center</li></ul><div className="aside-footnote"><Icon name="scan" size={18} /><p>Uploaded syllabi are analyzed by Claude to draft your Course Profile. You review and approve every detail.</p></div></aside></div>
  </>;
}
