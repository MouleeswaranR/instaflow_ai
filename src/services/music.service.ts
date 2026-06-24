import { generateGroqJSON } from "@/lib/gemini";
import type { MusicRecommendation } from "@/types";

interface MusicRecommendationInput {
  title: string;
  description: string;
  category: string;
  mood?: string;
}

export async function generateMusicRecommendations(
  input: MusicRecommendationInput
): Promise<MusicRecommendation[]> {
  const prompt = `Recommend 5 songs for an Instagram post with the following details:

Title: ${input.title}
Description: ${input.description}
Category: ${input.category}
${input.mood ? `Desired Mood: ${input.mood}` : ""}

Use this category guidance to match the right sound:
- Coding       → Motivational lo-fi, tech beats, electronic ambient, productive vibes
- Fitness      → High-energy workout music, pump-up tracks, electronic/EDM
- Startup      → Inspirational corporate, upbeat motivational, cinematic
- Study        → Lo-fi chill beats, ambient focus music, calm instrumentals
- Achievement  → Victory anthems, celebration songs, triumphant music
- Quote        → Emotional piano, inspiring orchestral, reflective ambient
- Product      → Modern corporate, sleek electronic, commercial-ready

Rules:
1. Only recommend real, well-known songs verified to be in Instagram's music library
2. Include a mix of popular and trending tracks
3. Every song must match the post's mood and energy
4. Popularity score: 1–100 (100 = most popular on Instagram)
5. Mood: one descriptive word per song

Return ONLY a JSON array in this exact format:
[
  { "songName": "...", "artist": "...", "mood": "...", "popularityScore": 85 },
  { "songName": "...", "artist": "...", "mood": "...", "popularityScore": 72 },
  { "songName": "...", "artist": "...", "mood": "...", "popularityScore": 90 },
  { "songName": "...", "artist": "...", "mood": "...", "popularityScore": 65 },
  { "songName": "...", "artist": "...", "mood": "...", "popularityScore": 78 }
]`;

  return generateGroqJSON<MusicRecommendation[]>(prompt, "llama-3.3-70b-versatile");
}
