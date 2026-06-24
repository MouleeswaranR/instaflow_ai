import { generateImage as geminiGenerateImage } from "@/lib/gemini";
import { uploadImage } from "@/lib/cloudinary";
import type { GeneratedImage } from "@/types";

interface ImageGenerationInput {
  title: string;
  description: string;
  category: string;
  template: string;
  theme: string;
  width: number;
  height: number;
}

const THEME_STYLES: Record<string, string> = {
  dark: "Dark background (#0a0a0a), white text, subtle gradients, modern minimalist style",
  light: "Clean white background, dark text, soft shadows, Apple-inspired minimal design",
  minimal: "Ultra-clean design, lots of whitespace, simple typography, muted colors",
  neon: "Dark background with neon glow effects, bright cyan/magenta/purple accents, synthwave aesthetic",
  cyberpunk: "Dark purple/blue background, glitch effects, neon yellow/pink accents, futuristic tech style",
  apple: "Premium Apple-style design, SF Pro font aesthetic, subtle gradients, pristine white/gray",
  developer: "Code editor inspired, dark theme like VS Code, monospace fonts, syntax highlighting colors",
};

const TEMPLATE_DESCRIPTIONS: Record<string, string> = {
  "coding-progress": "A coding achievement card showing code snippets, programming icons, and progress metrics",
  "startup-launch": "A startup launch announcement with rocket imagery, bold typography, and excitement",
  "fitness-progress": "A fitness achievement card with strong typography, progress bars, and motivational design",
  "study-progress": "A study/learning achievement card with book/brain imagery and knowledge metrics",
  "achievement-post": "A celebration card with trophy/medal imagery, confetti, and accomplishment text",
  "quote-post": "An elegant quote card with large typography, attribution, and decorative elements",
  "product-launch": "A product showcase card with clean presentation, features, and launch announcement",
};

export async function generatePostImage(
  input: ImageGenerationInput
): Promise<GeneratedImage | null> {
  const themeStyle = THEME_STYLES[input.theme] || THEME_STYLES.dark;
  const templateDesc = TEMPLATE_DESCRIPTIONS[input.template] || TEMPLATE_DESCRIPTIONS["achievement-post"];

  const prompt = `Create a stunning Instagram post image (${input.width}x${input.height} pixels).

Content:
Title: "${input.title}"
Description: "${input.description}"
Category: ${input.category}

Design Requirements:
- Style: ${themeStyle}
- Template: ${templateDesc}
- The text "${input.title}" must be prominently displayed
- Include a brief subtitle or description
- Use professional typography and layout
- Make it visually striking and Instagram-worthy
- Include relevant icons or visual elements for the ${input.category} category
- Add subtle decorative elements (gradients, shapes, patterns)
- Ensure text is readable and well-contrasted
- The image should look like a professional social media graphic

DO NOT include any watermarks, logos of other brands, or placeholder text.
Make it look like it was designed by a professional graphic designer.`;

  const imageBuffer = await geminiGenerateImage(prompt);

  if (!imageBuffer) {
    return null;
  }

  const uploaded = await uploadImage(imageBuffer, {
    width: input.width,
    height: input.height,
  });

  return {
    id: uploaded.publicId,
    url: uploaded.url,
    publicId: uploaded.publicId,
    template: input.template,
    theme: input.theme,
    width: input.width,
    height: input.height,
  };
}

export async function generateMultipleImages(
  input: Omit<ImageGenerationInput, "width" | "height">
): Promise<GeneratedImage[]> {
  const sizes = [
    { width: 1080, height: 1080, label: "Square" },
    { width: 1080, height: 1350, label: "Portrait" },
  ];

  const results: GeneratedImage[] = [];

  for (const size of sizes) {
    const image = await generatePostImage({
      ...input,
      width: size.width,
      height: size.height,
    });
    if (image) {
      results.push(image);
    }
  }

  return results;
}
