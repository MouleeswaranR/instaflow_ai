import { generateJSON } from "@/lib/gemini";
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
  const prompt = `You are an Instagram hashtag strategy expert.

Generate 3 sets of Instagram hashtags for the following content:

Title: ${input.title}
Description: ${input.description}
Category: ${input.category}
${input.notes ? `Notes: ${input.notes}` : ""}

Generate these 3 hashtag sets:

1. TRENDING - 15 high-volume, trending hashtags related to this content. These should have millions of posts.
2. NICHE - 15 targeted, niche-specific hashtags with lower competition. These are specific to the exact topic.
3. MIXED - 15 hashtags that blend trending and niche for optimal reach. A strategic mix.

Requirements:
- Each hashtag must start with #
- No spaces in hashtags
- Include a mix of broad and specific tags
- For ${input.category} category, include relevant community hashtags
- Include hashtags of varying popularity (some big, some medium, some small)
- Make them relevant and not spammy

Return as JSON array:
[
  { "type": "TRENDING", "hashtags": ["#hashtag1", "#hashtag2", ...] },
  { "type": "NICHE", "hashtags": ["#hashtag1", "#hashtag2", ...] },
  { "type": "MIXED", "hashtags": ["#hashtag1", "#hashtag2", ...] }
]`;

  return generateJSON<GeneratedHashtags[]>(prompt);
}
