import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import mammoth from "mammoth";
import { z } from "zod";
import { MAX_FILE_SIZE, validateSyllabus, type CourseProfile } from "@/lib/course-profile";

// Runs on the server only: the API key in .env.local never reaches the browser.
const client = new Anthropic(); // reads ANTHROPIC_API_KEY from the environment

const ProfileSchema = z.object({
  name: z.string().describe("Official course title, including course code if shown"),
  discipline: z.string().describe("Academic discipline or department"),
  description: z.string().describe("Short course description, in the syllabus's own terms"),
  objectives: z.string().describe("Learning objectives / outcomes, one per line"),
  topics: z.string().describe("Curriculum topics or units, one per line"),
  assignments: z.string().describe("Assignments and projects students complete, one per line"),
  assessments: z.string().describe("How learning is assessed, including grading weights if given, one per line"),
  methods: z.string().describe("Teaching methods (lectures, labs, discussion, etc.)"),
  challenges: z.string().describe("Teaching challenges the instructor explicitly mentions; usually empty"),
}) satisfies z.ZodType<CourseProfile>;

const SYSTEM = `You extract a Course Profile from a teacher's syllabus for a tool that helps teachers find uses for AI.
Use only information stated in the syllabus or the teacher's added context. Do not invent or infer details that are not there.
If a field is not covered, return an empty string for it. Use plain text; for list-like fields put one item per line, without bullets or numbering.
Keep wording close to the source and concise.`;

function error(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return error("The server has no ANTHROPIC_API_KEY. Add it to .env.local and restart the dev server.", 500);
  }

  let form: FormData;
  try { form = await request.formData(); } catch { return error("Expected a file upload.", 400); }
  const file = form.get("syllabus");
  const context = typeof form.get("context") === "string" ? String(form.get("context")).slice(0, 20000) : "";
  if (!(file instanceof File)) return error("No syllabus file was received.", 400);
  const invalid = validateSyllabus(file);
  if (invalid) return error(invalid, 400);
  if (file.size > MAX_FILE_SIZE) return error("This file is too large.", 413);

  const bytes = Buffer.from(await file.arrayBuffer());
  const isPdf = /\.pdf$/i.test(file.name);
  let documentBlock: Anthropic.Beta.BetaContentBlockParam;
  if (isPdf) {
    documentBlock = {
      type: "document",
      source: { type: "base64", media_type: "application/pdf", data: bytes.toString("base64") },
      title: file.name,
    };
  } else {
    let text: string;
    try { text = (await mammoth.extractRawText({ buffer: bytes })).value.trim(); }
    catch { return error("This DOCX file could not be read. Try saving it again or exporting it as PDF.", 422); }
    if (!text) return error("No text was found in this DOCX file.", 422);
    documentBlock = { type: "document", source: { type: "text", media_type: "text/plain", data: text }, title: file.name };
  }

  try {
    const response = await client.beta.messages.parse({
      model: "claude-opus-5-5",
      max_tokens: 16000,
      output_config: { effort: "low", format: betaZodOutputFormat(ProfileSchema) },
      // If a safety classifier declines, the API retries on a fallback model in the same call.
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: SYSTEM,
      messages: [{
        role: "user",
        content: [
          documentBlock,
          { type: "text", text: context ? `Additional context from the teacher:\n${context}\n\nExtract the Course Profile from the syllabus above.` : "Extract the Course Profile from the syllabus above." },
        ],
      }],
    });

    if (response.stop_reason === "refusal") return error("The AI declined to analyze this document.", 422);
    if (response.stop_reason === "max_tokens") return error("The syllabus was too long to analyze completely.", 422);
    const profile = response.parsed_output;
    if (!profile) return error("The AI response could not be read. Please try again.", 502);

    return Response.json({ profile, model: response.model });
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) return error("The API key was rejected. Check ANTHROPIC_API_KEY in .env.local.", 500);
    if (err instanceof Anthropic.RateLimitError) return error("Too many requests right now. Please wait a moment and try again.", 429);
    if (err instanceof Anthropic.BadRequestError) return error(`The document could not be processed: ${err.message}`, 400);
    if (err instanceof Anthropic.APIConnectionError) return error("Could not reach the AI service. Check your internet connection.", 502);
    if (err instanceof Anthropic.APIError) return error(`The AI service returned an error (${err.status}). Please try again.`, 502);
    throw err;
  }
}
