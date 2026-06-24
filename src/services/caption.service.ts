import { generateJSON } from "@/lib/gemini";
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
  const prompt = `You are a top-tier social media content creator specializing in Instagram.

Generate 5 different Instagram captions for the following content:

Title: ${input.title}
Description: ${input.description}
Category: ${input.category}
${input.achievementType ? `Achievement Type: ${input.achievementType}` : ""}
${input.notes ? `Additional Notes: ${input.notes}` : ""}

Generate these 5 caption types:

1. SHORT - A punchy 1-2 line caption with emojis. Hook + value. Under 100 characters.
2. PROFESSIONAL - A polished, LinkedIn-worthy caption. 3-4 lines. Professional tone with subtle emojis. Include a call-to-action.
3. VIRAL - A scroll-stopping caption with a strong hook, storytelling, engagement question, and CTA. 4-6 lines. Heavy emoji usage. Designed to go viral.
4. STORY - A casual, personal, authentic caption. Like talking to a friend. 2-3 lines with emojis.
5. LINKEDIN - A professional long-form caption suitable for LinkedIn cross-posting. Include insights, learnings, and a thought-provoking question. 5-8 lines.

Requirements:
- Each caption must include relevant emojis
- Each caption must have a hook (first line that grabs attention)
- Include engagement questions where appropriate
- Include call-to-actions (Save this, Share with a friend, Drop a comment, etc.)
- Make them authentic and not generic
- Tailor to the ${input.category} niche

Return as JSON array:
[
  { "type": "SHORT", "content": "..." },
  { "type": "PROFESSIONAL", "content": "..." },
  { "type": "VIRAL", "content": "..." },
  { "type": "STORY", "content": "..." },
  { "type": "LINKEDIN", "content": "..." }
]`;

  return generateJSON<GeneratedCaption[]>(prompt);
}
