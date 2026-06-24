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
  customInstruction?: string;
  caption?: string;
  hashtags?: string;
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

  const prompt = `You are a senior visual designer specializing in Instagram content design. You create graphics that stop the scroll and communicate the core message within 2 seconds of viewing.

Design a single Instagram post graphic at ${input.width}x${input.height}px for the content below.

---
CONTENT BRIEF
Title: "${input.title}"
Description: "${input.description}"
Category: ${input.category}
Style: ${themeStyle}
Template: ${templateDesc}
${input.caption ? `Caption: "${input.caption}"` : ""}
${input.hashtags ? `Hashtags: ${input.hashtags}` : ""}
${input.customInstruction ? `\nUSER SPECIFIC EDIT/INSTRUCTION (CRITICAL - APPLY THIS):\n${input.customInstruction}\n` : ""}
---

VISUAL DIRECTION

COMPOSITION
- Use a clear visual hierarchy: one dominant element, one supporting element, one accent
- Apply the rule of thirds — avoid centering everything symmetrically
- Leave intentional negative space; do not fill every corner
- The title must be the first thing the eye lands on
- Total text on the graphic should not exceed 12 words (title + subtitle combined)

TYPOGRAPHY
- Title: Large, bold, high-contrast. Font weight 700+. Must be legible at thumbnail size (150x150px).
- Subtitle: 1 line only. Smaller, lighter weight. Serves as context, not repetition of the title.
- No more than 2 typefaces. No decorative scripts unless the category is lifestyle or wellness.
- Letter spacing: slightly wide for titles, normal for body. Never condensed to the point of illegibility.
- Text must clear all edges by at least 48px on all sides (safe zone for Instagram cropping).

COLOR & MOOD
- Style is ${themeStyle} — let this drive the entire color palette decision.
- Use a maximum of 3 colors: one dominant background, one primary text/element color, one accent.
- Background must contrast with text at a ratio of at least 4.5:1 (WCAG AA standard).
- No pure white (#FFFFFF) or pure black (#000000) backgrounds — use off-tones for visual depth.
- Gradients are allowed only if directional and subtle (not rainbow, not radial burst).

VISUAL ELEMENTS
- Include 1–2 graphic elements that reinforce the ${input.category} category (icons, shapes, illustrations).
- Decorative elements must not compete with the title for attention — they support, not distract.
- No stock photo collages. No clip art. No drop shadows that look like MS Word defaults.
- If using geometric shapes, keep them minimal: 1–2 shapes max, used intentionally.
- Patterns (if used) should be subtle — low opacity, behind the content layer, not on top of text.

LAYOUT STRUCTURE (pick the one that best fits the template: ${templateDesc})
- Editorial: large title top-left, small accent bottom-right, clean white or dark background
- Bold centered: full-bleed background color, centered title, thin rule above/below
- Split: 60/40 or 70/30 vertical or horizontal split — one side image/color block, one side text
- Minimal: almost empty canvas, single large word or stat, one small supporting line
- Card: inner bordered container with padding, like a design card sitting on a colored background

CONTENT PLACEMENT
- The exact title text to display prominently: "${input.title}"
- Subtitle: derive a 5–8 word supporting line from the description — do not copy the description verbatim
- Category indicator: a small, subtle ${input.category} label or icon in a corner (not centered, not large)
- No other text elements. No URLs, handles, watermarks, placeholder copy, or lorem ipsum.

---

QUALITY BAR
- This graphic should look indistinguishable from work produced by a professional social media design agency
- If shown alongside 9 other posts in an Instagram grid, it should visually stand out without clashing
- The design should communicate the core idea even if all text were removed
- Every element on the canvas must have a reason to exist — remove anything decorative that doesn't serve the message

Output: A single, complete, production-ready ${input.width}x${input.height}px image. No variations, no mockups, no device frames.`;

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
