import { generateJSON } from "@/lib/gemini";
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
  const prompt = `You are a music curator specializing in Instagram Reels and Stories background music.

Recommend 5 songs for an Instagram post with this content:

Title: ${input.title}
Description: ${input.description}
Category: ${input.category}
${input.mood ? `Desired Mood: ${input.mood}` : ""}

Category-specific guidance:
- Coding: Motivational lo-fi, tech beats, electronic ambient, productive vibes
- Fitness: High-energy workout music, pump-up tracks, electronic/EDM
- Startup: Inspirational corporate, upbeat motivational, cinematic
- Study: Lo-fi chill beats, ambient focus music, calm instrumentals
- Achievement: Victory anthems, celebration songs, triumphant music
- Quote: Emotional piano, inspiring orchestral, reflective ambient
- Product: Modern corporate, sleek electronic, commercial-ready

Requirements:
- Recommend real, well-known songs that are available on Instagram's music library
- Include a mix of popular and trending tracks
- Each song should match the content's mood and energy
- Popularity score from 1-100 (100 = most popular)
- Mood should be a single descriptive word

Return as JSON array:
[
  { "songName": "...", "artist": "...", "mood": "...", "popularityScore": 85 },
  ...
]`;

  return generateJSON<MusicRecommendation[]>(prompt);
}
