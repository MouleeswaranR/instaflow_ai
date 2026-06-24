import { generateGroqJSON } from "@/lib/gemini";
import type { GeneratedCaption } from "@/types";

interface CaptionGenerationInput {
  title: string;
  description: string;
  category: string;
  achievementType?: string;
  notes?: string;
}

export async function generateCaptions(
  input: CaptionGenerationInput
): Promise<GeneratedCaption[]> {
  const prompt = `You are an elite Instagram growth strategist and copywriter who has helped creators grow from 0 to 100K+ followers. You understand platform algorithms, scroll psychology, and what makes content convert.

Generate 5 Instagram captions for the content below. Each must feel handcrafted — not templated.

---
CONTENT BRIEF
Title: ${input.title}
Description: ${input.description}
Category: ${input.category}
${input.achievementType ? `Achievement Type: ${input.achievementType}` : ""}
${input.notes ? `Creator Notes: ${input.notes}` : ""}
---

CAPTION SPECS

1. SHORT
- 1–2 lines max, under 100 characters
- Format: [Punchy hook] + [One clear value or emotion] + [1–2 emojis]
- No filler words. Every word earns its place.
- Example rhythm: "Did X in Y days. Here's what actually worked. 🧵"

2. PROFESSIONAL
- 3–4 lines. Confident, credible, polished tone.
- Line 1: Bold insight or result (the hook)
- Lines 2–3: Context or key takeaway
- Line 4: Soft CTA (e.g. "Save this for later." / "Thoughts? Drop them below.")
- Subtle emojis only (1–2 max). No hype words like "amazing" or "incredible".

3. VIRAL
- 4–6 lines. Built to stop the scroll and trigger shares.
- Line 1: Provocative or surprising hook (make them stop)
- Lines 2–4: Short punchy sentences. One idea per line. Build tension.
- Line 5: Engagement question that's easy to answer
- Line 6: CTA (Save / Share / Comment)
- Heavy but intentional emoji usage. Mirror the energy of top ${input.category} creators.

4. STORY
- 2–3 lines. Raw, real, conversational — like a voice note turned into text.
- No corporate polish. Use contractions, informal language.
- Should feel like a behind-the-scenes moment, not a broadcast.
- 1–3 emojis that feel natural, not decorative.

5. LINKEDIN
- 5–8 lines. Thought-leadership format optimized for LinkedIn's algorithm.
- Line 1: A counter-intuitive statement or personal truth (hook)
- Lines 2–4: The story, insight, or data behind it
- Lines 5–6: The broader lesson or framework others can apply
- Line 7: A thought-provoking question to spark discussion
- Professional emojis only (→ ✅ 💡). No exclamation spam.
- Write for a ${input.category} professional audience.

---

GLOBAL RULES
- No generic phrases: "excited to share", "humbled", "on this journey", "blessed"
- Every caption must have a distinct voice — they should not feel like variations of the same draft
- Hooks must work as standalone sentences (they appear before "more" in feed)
- CTAs must be specific: not just "comment below" but "comment your biggest struggle with X"
- Emojis enhance meaning — never used as decoration alone

Return ONLY a valid JSON array, no markdown, no preamble:
[
  { "type": "SHORT", "content": "..." },
  { "type": "PROFESSIONAL", "content": "..." },
  { "type": "VIRAL", "content": "..." },
  { "type": "STORY", "content": "..." },
  { "type": "LINKEDIN", "content": "..." }
]`;

  return generateGroqJSON<GeneratedCaption[]>(prompt, "llama-3.3-70b-versatile");
}
