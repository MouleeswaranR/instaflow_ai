import { create } from "zustand";
import type {
  GeneratedCaption,
  GeneratedHashtags,
  GeneratedImage,
  CarouselSlide,
  MusicRecommendation,
} from "@/types";

interface CreatePostState {
  // Step tracking
  currentStep: number;
  setCurrentStep: (step: number) => void;

  // Input
  title: string;
  description: string;
  category: string;
  achievementType: string;
  notes: string;
  setInput: (field: string, value: string) => void;

  // Generated content
  captions: GeneratedCaption[];
  setCaptions: (captions: GeneratedCaption[]) => void;
  selectedCaptionType: string;
  setSelectedCaptionType: (type: string) => void;

  hashtags: GeneratedHashtags[];
  setHashtags: (hashtags: GeneratedHashtags[]) => void;
  selectedHashtagType: string;
  setSelectedHashtagType: (type: string) => void;

  images: GeneratedImage[];
  setImages: (images: GeneratedImage[]) => void;
  selectedImageId: string;
  setSelectedImageId: (id: string) => void;

  carouselSlides: CarouselSlide[];
  setCarouselSlides: (slides: CarouselSlide[]) => void;

  musicRecommendations: MusicRecommendation[];
  setMusicRecommendations: (music: MusicRecommendation[]) => void;
  selectedMusicIndex: number;
  setSelectedMusicIndex: (index: number) => void;

  // Design
  theme: string;
  setTheme: (theme: string) => void;
  font: string;
  setFont: (font: string) => void;
  layout: string;
  setLayout: (layout: string) => void;

  // Loading states
  isGeneratingCaptions: boolean;
  isGeneratingHashtags: boolean;
  isGeneratingImages: boolean;
  isGeneratingCarousel: boolean;
  isGeneratingMusic: boolean;
  isPublishing: boolean;
  setLoading: (key: string, value: boolean) => void;

  // Post ID (after saving)
  postId: string | null;
  setPostId: (id: string) => void;

  // Reset
  reset: () => void;
}

const initialState = {
  currentStep: 0,
  title: "",
  description: "",
  category: "CODING",
  achievementType: "",
  notes: "",
  captions: [],
  selectedCaptionType: "VIRAL",
  hashtags: [],
  selectedHashtagType: "MIXED",
  images: [],
  selectedImageId: "",
  carouselSlides: [],
  musicRecommendations: [],
  selectedMusicIndex: 0,
  theme: "dark",
  font: "modern",
  layout: "SINGLE",
  isGeneratingCaptions: false,
  isGeneratingHashtags: false,
  isGeneratingImages: false,
  isGeneratingCarousel: false,
  isGeneratingMusic: false,
  isPublishing: false,
  postId: null,
};

export const useCreatePostStore = create<CreatePostState>((set) => ({
  ...initialState,

  setCurrentStep: (step) => set({ currentStep: step }),

  setInput: (field, value) => set({ [field]: value }),

  setCaptions: (captions) => set({ captions }),
  setSelectedCaptionType: (type) => set({ selectedCaptionType: type }),

  setHashtags: (hashtags) => set({ hashtags }),
  setSelectedHashtagType: (type) => set({ selectedHashtagType: type }),

  setImages: (images) => set({ images }),
  setSelectedImageId: (id) => set({ selectedImageId: id }),

  setCarouselSlides: (slides) => set({ carouselSlides: slides }),

  setMusicRecommendations: (music) => set({ musicRecommendations: music }),
  setSelectedMusicIndex: (index) => set({ selectedMusicIndex: index }),

  setTheme: (theme) => set({ theme }),
  setFont: (font) => set({ font }),
  setLayout: (layout) => set({ layout }),

  setLoading: (key, value) => set({ [`isGenerating${key}`]: value } as Partial<CreatePostState>),

  setPostId: (id) => set({ postId: id }),

  reset: () => set(initialState),
}));
