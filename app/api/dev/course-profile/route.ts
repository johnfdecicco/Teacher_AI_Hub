import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { restoreDraft } from "@/lib/course-profile";

// Development only: mirrors the browser's saved Course Profile to a local file
// (.dev/course-profile.json, git-ignored) so local tooling can read it.
// Disabled outside `next dev`; nothing leaves this machine.
const FILE = path.join(process.cwd(), ".dev", "course-profile.json");

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") return new Response(null, { status: 404 });
  let body: unknown;
  try { body = await request.json(); } catch { return Response.json({ error: "Expected JSON." }, { status: 400 }); }
  const draft = restoreDraft(body); // keeps only known fields
  await mkdir(path.dirname(FILE), { recursive: true });
  await writeFile(FILE, JSON.stringify({ savedAt: new Date().toISOString(), ...draft }, null, 2), "utf8");
  return new Response(null, { status: 204 });
}
