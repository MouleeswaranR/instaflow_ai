import { generateGroqJSON } from "@/lib/gemini";
import type { GeneratedHashtags } from "@/types";

interface HashtagGenerationInput {
  title: string;
  description: string;
  category: string;
  notes?: string;
}

export async function generateHashtags(
  input: HashtagGenerationInput
): Promise<GeneratedHashtags[]> {
 const prompt = `You are an Instagram SEO and hashtag strategist who understands how Instagram's discovery algorithm distributes content based on hashtag competition tiers and topic clustering.

Generate 3 sets of 15 hashtags for the content below. Each set serves a different distribution goal — they should share minimal overlap.

---
CONTENT BRIEF
Title: ${input.title}
Description: ${input.description}
Category: ${input.category}
${input.notes ? `Creator Notes: ${input.notes}` : ""}
---

HASHTAG SET SPECS

SET 1 — TRENDING (Reach)
Goal: Maximum exposure. These hashtags cast the widest net.
- Post volume: 1M–50M posts each
- These are category-level hashtags, not content-specific
- Include 2–3 evergreen mega-tags (e.g. #motivation, #growth) only if genuinely relevant
- Avoid banned or overused spam tags (#follow4follow, #likeforlike, #instagood)
- All 15 must be directly relevant to ${input.category} — no generic filler to hit the count
- Think: what would someone browse when exploring this category broadly?

SET 2 — NICHE (Relevance)
Goal: Reach the exact right audience, not the largest one.
- Post volume: 5K–500K posts each
- These are content-specific and community-specific hashtags
- Include hashtags that reflect the exact topic, format, and audience of this content
- At least 5 must be long-tail compound hashtags (e.g. #indiefounders, #bootcampgrad, #selfhosteddev)
- Think: what does a highly engaged micro-community in ${input.category} actually follow and search?
- Avoid anything that sounds like it was generated — these should feel discovered, not invented

SET 3 — MIXED (Algorithmic balance)
Goal: Optimize for both initial distribution and sustained discovery.
- Composition: exactly 5 from trending tier (1M+ posts) + 5 from mid tier (100K–1M) + 5 from niche tier (under 100K)
- No hashtag should appear in Set 1 or Set 2
- This set should reflect the full content funnel: broad topic → specific topic → exact content
- Think: if Instagram's algorithm uses these to place the post in front of non-followers, which mix maximizes relevance score?

---

GLOBAL RULES
- Every hashtag must start with #, no spaces, no special characters except letters and numbers
- No duplicate hashtags across any of the 3 sets
- No banned hashtags (Instagram shadowbans content using them)
- Do not invent hashtags that don't exist — only use ones with real community usage
- Avoid hashtags with ambiguous meaning outside the ${input.category} context
- Prioritize hashtags in English unless the content or category is region-specific
- Each hashtag must be directly traceable to the title, description, or category — no padding

Return ONLY a valid JSON array, no markdown, no preamble:
[
  { "type": "TRENDING", "hashtags": ["#...", "#...", ...] },
  { "type": "NICHE", "hashtags": ["#...", "#...", ...] },
  { "type": "MIXED", "hashtags": ["#...", "#...", ...] }
]`;

  return generateGroqJSON<GeneratedHashtags[]>(prompt, "llama-3.3-70b-versatile");
}
