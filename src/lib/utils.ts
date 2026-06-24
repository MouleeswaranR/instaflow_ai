import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function absoluteUrl(path: string): string {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
}

export const CATEGORIES = [
  { value: "CODING", label: "Coding", emoji: "💻" },
  { value: "FITNESS", label: "Fitness", emoji: "💪" },
  { value: "STARTUP", label: "Startup", emoji: "🚀" },
  { value: "STUDY", label: "Study", emoji: "📚" },
  { value: "ACHIEVEMENT", label: "Achievement", emoji: "🏆" },
  { value: "QUOTE", label: "Quote", emoji: "💬" },
  { value: "PRODUCT", label: "Product", emoji: "📦" },
  { value: "OTHER", label: "Other", emoji: "✨" },
] as const;

export const THEMES = [
  { value: "dark", label: "Dark", preview: "#0a0a0a" },
  { value: "light", label: "Light", preview: "#ffffff" },
  { value: "minimal", label: "Minimal", preview: "#f5f5f5" },
  { value: "neon", label: "Neon", preview: "#0f0f23" },
  { value: "cyberpunk", label: "Cyberpunk", preview: "#1a0a2e" },
  { value: "apple", label: "Apple Style", preview: "#fbfbfd" },
  { value: "developer", label: "Developer", preview: "#1e1e2e" },
] as const;

export const FONTS = [
  { value: "modern", label: "Modern", family: "Inter" },
  { value: "professional", label: "Professional", family: "Playfair Display" },
  { value: "startup", label: "Startup", family: "Space Grotesk" },
  { value: "minimal", label: "Minimal", family: "DM Sans" },
] as const;

export const LAYOUTS = [
  { value: "SINGLE", label: "Single Card", icon: "square" },
  { value: "CAROUSEL", label: "Carousel", icon: "layers" },
  { value: "STORY", label: "Story", icon: "smartphone" },
] as const;
