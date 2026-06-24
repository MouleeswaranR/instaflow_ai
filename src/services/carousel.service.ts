import { generateGroqJSON } from "@/lib/gemini";
import type { CarouselSlide } from "@/types";

interface CarouselGenerationInput {
  title: string;
  description: string;
  category: string;
  notes?: string;
}

export async function generateCarouselContent(
  input: CarouselGenerationInput
): Promise<CarouselSlide[]> {
  const prompt = `You are an Instagram carousel strategist who understands that carousels live or die by their first slide and that every swipe must be earned.

Create a 5-slide Instagram carousel for the content below. Each slide is a visual unit — the title is the headline, the content is the body. Both must work together at a glance.

---
CONTENT BRIEF
Title: ${input.title}
Description: ${input.description}
Category: ${input.category}
${input.notes ? `Creator Notes: ${input.notes}` : ""}
---

SLIDE SPECS

SLIDE 1 — HOOK
Goal: Make them swipe. This is the only slide that matters if they don't.
- Title: Bold, specific, curiosity-driven. Under 40 chars.
- Use a number, a contrast, or a provocative statement ("I failed 3 times before this worked")
- Content: 1 sentence that intensifies the hook or adds stakes. Under 80 chars.
- No emojis in the title. One strong emoji in content max.
- Ask yourself: would someone screenshot this slide alone?

SLIDE 2 — KEY LEARNINGS
Goal: Deliver insight. Make them feel smarter for swiping.
- Title: Under 40 chars. Frame it as a reveal ("What actually changed everything")
- Content: Exactly 3 bullet points. Each bullet = one sharp insight, not a vague lesson.
- Format: • [Insight] — [Why it matters in 5 words or less]
- Each bullet under 60 chars. No fluff. No "I realized that..."
- 1 emoji per bullet, placed at the start.

SLIDE 3 — CHALLENGES
Goal: Build trust through honesty. Vulnerability earns saves.
- Title: Under 40 chars. Make it real ("The part nobody talks about")
- Content: Exactly 3 bullet points. Real, specific struggles — not vague hardship.
- Format: • [The actual problem] → [How it was solved or reframed]
- Each bullet under 70 chars. Name the emotion or the mistake directly.
- 1 emoji per bullet, placed at the start.

SLIDE 4 — RESULTS
Goal: Prove it worked. Specificity builds credibility.
- Title: Under 40 chars. Lead with the biggest win ("From X to Y in Z days")
- Content: Exactly 3 bullet points. Use real numbers, percentages, or before/after comparisons.
- If no hard metrics exist, use qualitative outcomes framed concretely ("0 rejections after revising approach")
- Format: • [Metric or outcome] — [Context in 4 words]
- Each bullet under 65 chars. No vague words like "significant" or "improved greatly".
- 1 emoji per bullet, placed at the start.

SLIDE 5 — CTA
Goal: Convert passive viewers into engaged followers or savers.
- Title: Under 40 chars. Direct and warm ("Your turn 👇" / "Tell me below")
- Content: 2 parts:
  Part 1: A specific, easy-to-answer question tied to the content topic (not "what do you think?")
  Part 2: A save/share nudge with a reason ("Save this before your next attempt at X")
- Total content under 150 chars.
- 2–3 emojis max. End with an action emoji (👇💾🔁).

---

GLOBAL RULES
- Titles and content must feel like a visual pair — not redundant, not disconnected
- No slide should feel like it could be cut without losing something
- Never use: "excited", "journey", "blessed", "game-changer", "unlock"
- Write for the ${input.category} niche — use the vocabulary, references, and pain points of that audience
- Slide 1 title is the most important line in the entire carousel — revise it last

Return ONLY a valid JSON array, no markdown, no preamble:
[
  { "slideNumber": 1, "title": "...", "content": "..." },
  { "slideNumber": 2, "title": "...", "content": "..." },
  { "slideNumber": 3, "title": "...", "content": "..." },
  { "slideNumber": 4, "title": "...", "content": "..." },
  { "slideNumber": 5, "title": "...", "content": "..." }
]`;

  return generateGroqJSON<CarouselSlide[]>(prompt, "llama-3.3-70b-versatile");
}
