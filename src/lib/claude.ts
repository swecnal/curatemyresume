import Anthropic from "@anthropic-ai/sdk";
import { ATS_RESUME_TEMPLATE } from "./resume-template";

const apiKey = process.env.ANTHROPIC_API_KEY ?? "";

const anthropic = new Anthropic({ apiKey });

const MODEL = "claude-sonnet-4-20250514";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function stripCodeBlock(text: string): string {
  let cleaned = text.trim();
  // Remove ```json ... ``` or ``` ... ```
  const codeBlockRegex = /^```(?:json)?\s*\n?([\s\S]*?)\n?```$/;
  const match = cleaned.match(codeBlockRegex);
  if (match) {
    cleaned = match[1].trim();
  }
  return cleaned;
}

// ---------------------------------------------------------------------------
// 1. analyzeJD
// ---------------------------------------------------------------------------

interface UserPrefs {
  target_salary_min?: number;
  target_salary_max?: number;
  location_preference?: string;
  location_preferences?: string[];
  target_roles?: string[];
  strong_skills?: string[];
  developing_skills?: string[];
  security_clearance?: string;
}

export interface JDAnalysis {
  company_name: string;
  role_title: string;
  seniority_level: string;
  fit_score: number;
  fit_summary: string;
  go_no_go: "go" | "no-go";
  salary_in_jd: boolean;
  salary_min: number | null;
  salary_max: number | null;
  salary_ote: number | null;
  salary_desired: string;
  salary_notes: string;
  matched_strong_skills?: string[];
  matched_developing_skills?: string[];
  missing_skills?: string[];
}

export async function analyzeJD(
  resumeText: string,
  jdText: string,
  userPrefs: UserPrefs
): Promise<JDAnalysis> {
  const salaryContext = buildSalaryContext(userPrefs);
  const locationContext = userPrefs.location_preferences?.length
    ? `The candidate's location preferences are: ${userPrefs.location_preferences.join(', ')}. Factor this into the fit analysis — flag if the role's location conflicts with these preferences.`
    : userPrefs.location_preference
      ? `The candidate's location preference is: ${userPrefs.location_preference}. Factor this into the fit analysis — flag if the role's location conflicts with this preference.`
      : "";

  const targetRolesContext = userPrefs.target_roles?.length
    ? `The candidate is targeting these roles: ${userPrefs.target_roles.join(', ')}. Match the JD against these target roles, but also consider roles that are logically similar or adjacent (e.g., "Customer Success" matches "CSM", "Customer Success Manager", "Client Success"; "Network Engineer" matches "Infrastructure Engineer", "NOC Engineer"). Use judgment on reasonable role matches.`
    : "";

  const skillsContext = (userPrefs.strong_skills?.length || userPrefs.developing_skills?.length)
    ? `\nSKILLS CONTEXT:
The candidate has categorized their skills into two tiers:
- Strong Skills (confident, can defend in interview): ${userPrefs.strong_skills?.join(', ') || 'None specified'}
- Developing Skills (has exposure but not expert): ${userPrefs.developing_skills?.join(', ') || 'None specified'}

When assessing fit, weight Strong Skills more heavily. Note any JD-required skills that are only in the Developing tier, and any that are missing entirely. Include matched_strong_skills, matched_developing_skills, and missing_skills in the response.`
    : "";

  const clearanceContext = userPrefs.security_clearance && userPrefs.security_clearance !== 'none'
    ? `The candidate's security clearance status: ${userPrefs.security_clearance}. If the JD requires a clearance the candidate doesn't have, flag this as a significant gap.`
    : "";

  const systemPrompt = `You are an expert career advisor and job-fit analyst. Your job is to analyze a job description against a candidate's resume and produce a structured fit assessment.

Build the candidate profile entirely from the resume text provided — do not assume anything not stated in the resume.

SCORING RUBRIC (0-10):
- 9-10: Near-perfect match. Candidate exceeds requirements, has direct domain experience, and seniority aligns.
- 7-8: Strong match. Candidate meets most requirements with minor gaps that are easily bridged.
- 5-6: Moderate match. Candidate has transferable skills but notable gaps in required experience or domain.
- 3-4: Weak match. Significant gaps in core requirements; would be a stretch hire.
- 0-2: Poor match. Fundamental misalignment in skills, seniority, or domain.

GO/NO-GO DECISION:
- Score >= 6 = "go" (worth applying)
- Score < 6 = "no-go" (not a strong fit)

SALARY EXTRACTION:
- Extract any salary, compensation, or OTE information from the job description.
- If no salary is listed, set salary_in_jd to false and salary fields to null.
${salaryContext}
${locationContext}
${targetRolesContext}
${skillsContext}
${clearanceContext}

Respond with ONLY valid JSON matching this exact structure (no markdown, no extra text):
{
  "company_name": "string",
  "role_title": "string",
  "seniority_level": "string (e.g. Junior, Mid, Senior, Staff, Lead, Director, VP, C-Level)",
  "fit_score": number,
  "fit_summary": "string (2-4 sentences explaining the score)",
  "go_no_go": "go | no-go",
  "salary_in_jd": boolean,
  "salary_min": number | null,
  "salary_max": number | null,
  "salary_ote": number | null,
  "salary_desired": "string (assessment of salary alignment with candidate expectations)",
  "salary_notes": "string (any additional comp details — equity, bonus, benefits mentioned)",
  "matched_strong_skills": ["string"],
  "matched_developing_skills": ["string"],
  "missing_skills": ["string"]
}`;

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1500,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: `RESUME:\n${resumeText}\n\n---\n\nJOB DESCRIPTION:\n${jdText}`,
      },
    ],
  });

  const raw =
    response.content[0].type === "text" ? response.content[0].text : "";
  const parsed: JDAnalysis = JSON.parse(stripCodeBlock(raw));
  return parsed;
}

function buildSalaryContext(prefs: UserPrefs): string {
  const parts: string[] = [];
  if (prefs.target_salary_min != null || prefs.target_salary_max != null) {
    parts.push("The candidate has specified salary expectations:");
    if (prefs.target_salary_min != null) {
      parts.push(`  Minimum target: $${prefs.target_salary_min.toLocaleString()}`);
    }
    if (prefs.target_salary_max != null) {
      parts.push(`  Maximum target: $${prefs.target_salary_max.toLocaleString()}`);
    }
    parts.push(
      "Compare the JD's salary (if listed) against these targets and note any misalignment in salary_desired."
    );
  }
  return parts.length > 0 ? parts.join("\n") : "";
}

// ---------------------------------------------------------------------------
// 2. parseResume
// ---------------------------------------------------------------------------

export interface ParsedProfile {
  name: string;
  current_title: string;
  years_experience: number;
  city: string;
  state: string;
  skills: string[];
  strong_skills: string[];
  developing_skills: string[];
  experience: {
    title: string;
    company: string;
    location: string;
    start_date: string;
    end_date: string;
    bullets: string[];
  }[];
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
  certifications: string[];
}

export async function parseResume(resumeText: string): Promise<ParsedProfile> {
  const systemPrompt = `You are an expert resume parser. Extract structured data from the provided resume text. Be thorough and accurate — pull every detail available.

For years_experience: estimate total years of professional experience based on employment dates. If dates are ambiguous, make a reasonable estimate.

For city and state: extract from the candidate's contact information header or from the most recent role's location. Use the 2-letter state abbreviation (e.g., "TX", "CA").

For skills categorization:
- "strong_skills": Skills the candidate has demonstrated significantly — listed in a dedicated Skills section, mentioned across multiple roles, or clearly central to their work. These are skills they could confidently discuss in an interview.
- "developing_skills": Skills mentioned only once in passing, used in a minor capacity, or listed as part of education/certifications rather than hands-on work. These are skills the candidate has exposure to but may not be an expert in.
- "skills": The combined flat list of all skills (union of strong + developing) for backward compatibility.

Respond with ONLY valid JSON matching this exact structure (no markdown, no extra text):
{
  "name": "string",
  "current_title": "string (most recent job title)",
  "years_experience": number,
  "city": "string (city from contact info or most recent role)",
  "state": "string (2-letter state abbreviation)",
  "skills": ["string", ...],
  "strong_skills": ["string", ...],
  "developing_skills": ["string", ...],
  "experience": [
    {
      "title": "string",
      "company": "string",
      "location": "string",
      "start_date": "string",
      "end_date": "string (or 'Present')",
      "bullets": ["string", ...]
    }
  ],
  "education": [
    {
      "degree": "string",
      "institution": "string",
      "year": "string"
    }
  ],
  "certifications": ["string", ...]
}`;

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 3000,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: `Parse the following resume and extract all structured data:\n\n${resumeText}`,
      },
    ],
  });

  const raw =
    response.content[0].type === "text" ? response.content[0].text : "";
  const parsed: ParsedProfile = JSON.parse(stripCodeBlock(raw));
  return parsed;
}

// ---------------------------------------------------------------------------
// 3. forgeResume (ATS Formatter)
// ---------------------------------------------------------------------------

export interface ForgedResume {
  formatted_text: string;
}

export async function forgeResume(
  resumeText: string,
  parsedProfile: ParsedProfile
): Promise<ForgedResume> {
  const systemPrompt = `You are ResumeForge, an expert ATS resume formatter. Your job is to reformat the candidate's resume into a clean, ATS-optimized format that will pass automated screening systems.

TEMPLATE STRUCTURE:
${ATS_RESUME_TEMPLATE}

FORMATTING RULES:
1. ALL CAPS for section headers (SUMMARY, PROFESSIONAL EXPERIENCE, SKILLS & TECHNOLOGIES, EDUCATION, CERTIFICATIONS)
2. No tables, columns, graphics, or special characters that break ATS parsers
3. Every achievement bullet must start with a strong action verb and include quantified impact where possible (percentages, dollar amounts, team sizes, timelines)
4. Keep the resume to a maximum of 2 pages worth of content
5. Use bullet points (•) for achievements
6. Use the dot separator (•) for inline lists (contact info, certifications)
7. List experience in reverse chronological order
8. Group skills by category (e.g., Languages, Frameworks, Cloud, Tools)

CONTENT RULES:
- Preserve all factual information from the original resume
- Improve weak bullet points by adding specificity and metrics where the original data supports it
- Do not fabricate achievements, skills, or experiences
- If the original resume has vague bullets, sharpen them using context clues from the role description

Return ONLY the formatted resume text — no commentary, no JSON wrapper, no markdown code blocks.`;

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 4000,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: `Here is the candidate's raw resume text:\n\n${resumeText}\n\nHere is the parsed profile data for reference:\n\n${JSON.stringify(parsedProfile, null, 2)}\n\nPlease reformat this resume into the ATS-optimized template.`,
      },
    ],
  });

  const raw =
    response.content[0].type === "text" ? response.content[0].text : "";
  return { formatted_text: stripCodeBlock(raw) };
}

// ---------------------------------------------------------------------------
// 4. tailorResume (Beast Mode — JD-optimized)
// ---------------------------------------------------------------------------

export interface TailoredResume {
  tailored_text: string;
  changes_summary: string;
}

export async function tailorResume(
  resumeText: string,
  jdText: string,
  fitAnalysis: JDAnalysis,
  skillTiers?: { strong_skills?: string[]; developing_skills?: string[] }
): Promise<TailoredResume> {
  const skillTierRules = (skillTiers?.strong_skills?.length || skillTiers?.developing_skills?.length)
    ? `\nSKILL TIER RULES:
The candidate has categorized their skills:
- Strong Skills (confident): ${skillTiers?.strong_skills?.join(', ') || 'None specified'}
- Developing Skills (has exposure): ${skillTiers?.developing_skills?.join(', ') || 'None specified'}

When tailoring:
- Strong Skills should be placed prominently in the Skills section and woven into experience bullets where natural
- Developing Skills should only be included when the JD specifically requires them, and placed less prominently
- Never present a Developing skill as expert-level — keep the framing honest
- Priority: match JD keywords from Strong Skills first, then fill gaps with Developing Skills`
    : "";

  const systemPrompt = `You are ResumeTailor, an elite career strategist who optimizes resumes for specific job descriptions. You operate in Beast Mode — every word earns its place.

YOUR MISSION:
Take the candidate's resume and rewrite it to maximize fit for the provided job description, informed by the fit analysis.

OPTIMIZATION STRATEGY:
1. REORDER: Lead with the experience and skills most relevant to the JD
2. REFRAME: Reword existing achievements to mirror the JD's language and priorities
3. EMPHASIZE: Expand bullets that align with key JD requirements; condense less relevant ones
4. KEYWORD MATCH: Naturally incorporate keywords and phrases from the JD into the resume
5. SUMMARY REWRITE: Craft a summary that speaks directly to the role's core needs
${skillTierRules}

HARD RULES — DO NOT VIOLATE:
- NEVER fabricate experiences, skills, certifications, or metrics
- NEVER add technologies the candidate hasn't used
- NEVER invent job titles or companies
- Only reframe, reorder, and emphasize what already exists in the resume
- Maintain ATS-friendly formatting: ALL CAPS headers, bullet points, no tables/graphics
- Maximum 2 pages of content

OUTPUT FORMAT:
Respond with ONLY valid JSON (no markdown, no code blocks):
{
  "tailored_text": "string (the full optimized resume text)",
  "changes_summary": "string (bullet-point list of key changes made and why)"
}`;

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 5000,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: `ORIGINAL RESUME:\n${resumeText}\n\n---\n\nJOB DESCRIPTION:\n${jdText}\n\n---\n\nFIT ANALYSIS:\n${JSON.stringify(fitAnalysis, null, 2)}\n\nPlease tailor this resume for maximum fit with the job description.`,
      },
    ],
  });

  const raw =
    response.content[0].type === "text" ? response.content[0].text : "";
  const parsed: TailoredResume = JSON.parse(stripCodeBlock(raw));
  return parsed;
}
