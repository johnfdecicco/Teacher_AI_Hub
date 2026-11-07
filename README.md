# Teacher Hub AI

A curriculum workspace built with Next.js App Router, TypeScript, and Tailwind CSS 4. No authentication, database, document parser, or AI API is connected.

## Run locally

```sh
npm run dev
```

In Windows PowerShell, use `npm.cmd run dev` if execution policy blocks npm.ps1. Open http://localhost:3000 (redirects to /dashboard).

## Test course diagnosis

1. Open /diagnosis. Upload Syllabus is the default for a new draft.
2. Choose or drop a PDF or DOCX. Verify filename, size, replace/remove controls, and validation for unsupported, empty, oversized (over 20 MB), or multiple files.
3. Add optional written context. Switch to Describe My Course and enter a course name and natural-language description. Expand the optional learning objectives, assignments, and teaching challenges fields if useful.
4. Switch methods to confirm your entries and syllabus selection remain intact in the session.
5. Select Review Course Profile. Uploaded files are not parsed: profile fields remain blank unless you entered them. Edit or complete any fields, or leave them blank.
6. Refresh to verify text, structured profile fields, and file metadata are restored. File bytes are never saved in localStorage. Reselect the file after refresh if you need it available in the session.
7. Open /opportunities to see the saved profile and transparent Finance/Accounting library matches. These are deterministic keyword matches, not AI findings.
8. Try keyboard navigation and mobile width. Dashboard and the other navigation pages remain available.

Drafts use browser-local storage (`teacher-hub-course-profile-v2`). Existing v1 diagnosis fields are restored when no v2 draft exists. Clearing site data removes saved drafts. If storage is unavailable, the page reports that changes may not survive navigation or refresh. Files stay in memory during the diagnosis session and are never uploaded.

## Checks

```sh
npm run lint
npm run build
```

## Structure

- `app/layout.tsx`, `components/app-shell.tsx`: shared branding and navigation.
- `app/globals.css`, `postcss.config.mjs`: responsive styles and Tailwind 4 processing.
- `components/diagnosis-wizard.tsx`: upload/manual entry and editable Course Profile review.
- `components/use-course-draft.ts`: shared localStorage hydration and saving.
- `lib/course-profile.ts`: typed profile and metadata model, file validation, legacy draft migration. This is the boundary for future parsing results; current profiles contain only professor-entered data.
- `components/opportunity-center.tsx`: saved profile, deterministic recommendation cards, filters, and workshop/foundation handoffs.
- `app/dashboard/page.tsx`: dashboard and clearly labeled demonstration projects.

Future document parsing and AI processing should be implemented behind a server-side boundary, with extracted data explicitly identified for professor review. The current client does not extract objectives from prose, parse document content, or produce personalized recommendations.


## Finance and Accounting opportunities

The Opportunity Center uses `lib/opportunities.ts` for ten curated definitions and a pure deterministic matcher. It reads the existing browser-local profile. Topics, objectives, and description earn 3, 4, and 2 points per matched keyword respectively; discipline earns 1 point. Matching is case-insensitive with word/phrase boundaries. File metadata, filenames, course titles, and unprocessed documents are excluded. Evidence is displayed per recommendation. Explicit unsupported disciplines show general examples. With no discipline, recognized topic keywords can match either supported subject. A discipline-only match is labeled as a general starting point.

Try these scenarios through Course Diagnosis's editable Course Profile:

- Finance: discipline `Finance`, topics `Capital budgeting, NPV, IRR`, objectives `Evaluate net present value`. Capital Budgeting Model should rank first.
- Finance: topics `DCF, WACC, terminal value`. Financial Valuation Model should rank first.
- Accounting: discipline `Accounting`, topics `Auditing, internal controls, materiality`, objectives `Evaluate audit evidence`. Audit Engagement Simulation should rank first.
- Accounting: topics `Journal entries, debits, credits`. Journal Entry Coach should rank first.
- An empty profile, an upload with no entered details, or a discipline such as Biology should show the general example library. No file contents are inferred.

Use topic, discipline, and experience-type filters; open opportunity details; explore beyond the first three results. Learn How routes to `/opportunities/<id>/learn` and shows a planned workshop outline. Build With Me routes to `/opportunities/<id>/build` and lets you adjust a page-local planning outline. These previews do not generate working models, simulations, AI agents, or saved projects. Reloading the planning preview resets its controls.

Run focused matcher checks with `node tests/opportunity-matching.mjs`. These cover data completeness, Finance and Accounting ranking, evidence/weights, empty and unsupported profiles, word boundaries, repeated keywords, and deterministic ties.

## Simulation Studio

Open `/studio/investment-committee`, or select **Build & Customize** on Investment Committee Simulation in the Opportunity Center. The Creation Studio navigation item also opens this template. Simulation cards use one configuration action; other opportunity types retain Learn How and Build With Me. Previous Investment Committee learn/build links redirect to the studio. Other simulation build routes clearly identify their templates as coming soon, and their old learn routes redirect to build.

The six stages configure Scenario, Student Experience, AI Stakeholders, Decisions and Financial Information, Assessment, and Preview and Test. The seeded case is fictional. Professors can edit all content, add/remove stakeholders, assumptions, text case documents, required decisions, and rubric criteria, and set document visibility. Contextual help explains hidden information and other choices.

- **Save** persists the current configuration and wizard stage. Saving is explicit; unsaved changes are labeled.
- **Resume** opens a selected saved draft. On reopening the studio, the last active saved draft resumes automatically.
- **Duplicate Simulation** deep-copies the current configuration under a new ID and storage key, then saves and opens the copy. Existing saved originals remain unchanged.
- **Reset** confirms before restoring and saving the original template for the current draft only.

Storage uses `teacher-hub-simulation-v1:<draft-id>` per simulation and a separate active-ID marker. These keys are independent of Course Diagnosis data. Drafts stay on the local browser and are not a database or secure student access-control system.

Try changing a title, adding a hidden stakeholder note and an instructor-only document, and opening Preview and Test. Student briefs omit hidden information and instructor-only documents. Enter responses and use Test decision submission to verify that all required decisions are answered. Responses are not persisted, sent, or graded. Chat, financial calculations, automated assessment, and live classroom delivery are not connected; the functional preview reviews configured content and tests required-response completeness only.

Architecture: `lib/simulation.ts` defines the reusable schema and draft validation; `lib/investment-committee-template.ts` holds scenario content; `lib/simulation-engine.ts` provides a content-independent student-view projection and validation workflow. Studio components live in `components/simulations/`.

Run `node tests/simulation-engine.mjs` to verify draft serialization, independent duplicate keys, deep-copy isolation, hidden content exclusion, response validation, and rubric/configuration checks. Existing matching tests remain at `node tests/opportunity-matching.mjs`.
