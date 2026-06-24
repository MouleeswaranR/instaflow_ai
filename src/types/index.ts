import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(1, "Description is required").max(2000),
  category: z.enum(["CODING", "FITNESS", "STARTUP", "STUDY", "ACHIEVEMENT", "QUOTE", "PRODUCT", "OTHER"]),
  achievementType: z.string().optional(),
  notes: z.string().max(500).optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;

export interface GeneratedCaption {
  type: "SHORT" | "PROFESSIONAL" | "VIRAL" | "STORY" | "LINKEDIN";
  content: string;
}

export interface GeneratedHashtags {
  type: "TRENDING" | "NICHE" | "MIXED";
  hashtags: string[];
}

export interface GeneratedImage {
  id: string;
  url: string;
  publicId: string;
  template: string;
  theme: string;
  width: number;
  height: number;
}

export interface CarouselSlide {
  slideNumber: number;
  title: string;
  content: string;
  imageUrl?: string;
}

export interface MusicRecommendation {
  songName: string;
  artist: string;
  mood: string;
  popularityScore: number;
}

export interface PostPreview {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  captions: GeneratedCaption[];
  hashtags: GeneratedHashtags[];
  images: GeneratedImage[];
  carouselSlides: CarouselSlide[];
  musicRecommendations: MusicRecommendation[];
  selectedCaption?: GeneratedCaption;
  selectedHashtags?: GeneratedHashtags;
  selectedImage?: GeneratedImage;
  selectedMusic?: MusicRecommendation;
  theme: string;
  font: string;
  layout: string;
}

export interface AnalyticsData {
  date: string;
  likes: number;
  comments: number;
  reach: number;
  impressions: number;
  saves: number;
  shares: number;
  followers: number;
}

export interface ScheduleInput {
  postId: string;
  scheduledAt: string;
  timezone: string;
  frequency: "ONCE" | "DAILY" | "WEEKLY" | "MONTHLY";
}
