import { generateJSON } from "@/lib/gemini";
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
  const prompt = `You are an expert Instagram carousel content creator.

Create a 5-slide Instagram carousel for this content:

Title: ${input.title}
Description: ${input.description}
Category: ${input.category}
${input.notes ? `Notes: ${input.notes}` : ""}

Structure each slide as follows:

Slide 1 - HOOK: The main achievement/topic. A bold, attention-grabbing title that makes people swipe. Keep it short and impactful.

Slide 2 - WHAT I LEARNED: Key learnings, insights, or knowledge gained. 3-4 bullet points.

Slide 3 - CHALLENGES: Challenges faced and how they were overcome. Real, authentic struggles. 3-4 bullet points.

Slide 4 - RESULTS: Concrete results, metrics, or outcomes. Numbers and data if possible. 3-4 bullet points.

Slide 5 - CTA: Call to action. Engage the audience. Ask a question. Encourage saves and shares.

Requirements:
- Each slide title should be concise (under 50 chars)
- Each slide content should be under 200 chars
- Use emojis strategically
- Make it educational and value-packed
- Tailor content to ${input.category} niche

Return as JSON array:
[
  { "slideNumber": 1, "title": "...", "content": "..." },
  { "slideNumber": 2, "title": "...", "content": "..." },
  { "slideNumber": 3, "title": "...", "content": "..." },
  { "slideNumber": 4, "title": "...", "content": "..." },
  { "slideNumber": 5, "title": "...", "content": "..." }
]`;

  return generateJSON<CarouselSlide[]>(prompt);
}
