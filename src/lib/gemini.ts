import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

export async function generateText(prompt: string): Promise<string> {
  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text ?? "";
  } catch (err: unknown) {
    const error = err as any;
    if ((error?.status === 503 || error?.status === 429 || error?.status === 404) && groq) {
      console.warn("Gemini unavailable, falling back to Groq for text...");
      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.3-70b-versatile",
      });
      return completion.choices[0]?.message?.content || "";
    }
    throw error;
  }
}

export async function generateImage(prompt: string): Promise<Buffer | null> {
  try {
    // Try Gemini first
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.startsWith("AIza")) {
      const response = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseModalities: ["image", "text"],
        },
      });

      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData?.data) {
            return Buffer.from(part.inlineData.data, "base64");
          }
        }
      }
    }
  } catch (error) {
    console.warn("Gemini Image generation failed or invalid key, falling back to Pollinations API");
  }

  // Fallback to free Pollinations API
  try {
    console.log("Using Pollinations API for image generation...");
    // Extract specific fields for Pollinations to prevent text hallucination
    const titleMatch = prompt.match(/Title: "(.*?)"/);
    const descMatch = prompt.match(/Description: "(.*?)"/);
    const styleMatch = prompt.match(/Style: (.*?)\n/);
    
    const title = titleMatch ? titleMatch[1] : "";
    const desc = descMatch ? descMatch[1].substring(0, 60) : ""; // Keep it short
    const style = styleMatch ? styleMatch[1] : "modern minimal";

    let simplePrompt = `A highly aesthetic Instagram post graphic. The image contains exactly one large, bold title written in English saying "${title}". There is a smaller subtitle written in English saying "${desc}". Visual style: ${style}. High quality, photorealistic, digital art, strict English typography only. Do not add any other text.`;

    // Use a random seed to ensure different results for regeneration
    const seed = Math.floor(Math.random() * 1000000);
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(simplePrompt)}?width=1080&height=1080&nologo=true&seed=${seed}&model=flux`;
    
    const response = await fetch(pollinationsUrl);
    if (!response.ok) {
      throw new Error(`Pollinations API returned ${response.status}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (fallbackError) {
    console.error("Image generation (both Gemini and Fallback) failed:", fallbackError);
    return null;
  }
}

export async function generateJSON<T>(prompt: string): Promise<T> {
  const tryGenerate = async (modelName: string) => {
    const response = await genAI.models.generateContent({
      model: modelName,
      contents: prompt + "\n\nRespond ONLY with valid JSON. No markdown, no code blocks, no explanation.",
      config: {
        responseMimeType: "application/json",
      },
    });
    return response.text ?? "{}";
  };

  const tryGenerateGroq = async () => {
    return generateGroqJSON<T>(prompt, "llama-3.3-70b-versatile");
  };

  let text = "{}";
  try {
    text = await tryGenerate("gemini-2.5-flash");
  } catch (err: unknown) {
    const error = err as any;
    if (error?.status === 503 || error?.status === 429 || error?.status === 404) {
      console.warn("gemini-2.5-flash unavailable, falling back to gemini-2.0-flash...");
      try {
        text = await tryGenerate("gemini-2.0-flash");
      } catch (err: unknown) {
        const err2 = err as any;
        if (err2?.status === 503 || err2?.status === 429 || err2?.status === 404) {
           console.warn("gemini-2.0-flash unavailable, falling back to Groq...");
           const result = await tryGenerateGroq();
           return result; // Groq returns the parsed object, not string
        } else {
           throw err2;
        }
      }
    } else {
      throw error;
    }
  }

  return JSON.parse(text) as T;
}

export async function generateGroqJSON<T>(prompt: string, modelName: string = "llama-3.3-70b-versatile"): Promise<T> {
  if (!groq) throw new Error("GROQ_API_KEY not set in environment variables");
  
  const completion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: "You are a helpful assistant that strictly outputs JSON. Respond ONLY with valid JSON. No markdown formatting like ```json. IMPORTANT: You must properly escape all newlines as \\n within string values. Do not use raw newlines inside strings." },
      { role: "user", content: prompt }
    ],
    model: modelName,
    temperature: 0.7,
    response_format: { type: "json_object" },
  });
  
  let result = completion.choices[0]?.message?.content || "{}";
  
  // Strip markdown codeblocks if they exist
  if (result.includes("```")) {
    const match = result.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (match) result = match[1];
  }
  
  try {
    return JSON.parse(result) as T;
  } catch (err) {
    console.warn("JSON Parse failed, attempting to sanitize control characters...");
    // Replace unescaped literal newlines/tabs inside the JSON string as a last resort
    const sanitized = result
      .replace(/[\u0000-\u0009\u000B-\u001F]/g, "") // Remove bad control characters except newline
      .replace(/\n/g, "\\n"); // Escape all newlines
    
    return JSON.parse(sanitized) as T;
  }
}

export { genAI };
