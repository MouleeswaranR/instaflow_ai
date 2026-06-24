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
    return null;
  } catch (error) {
    console.error("Image generation error:", error);
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
    if (!groq) throw new Error("GROQ_API_KEY not set");
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt + "\n\nRespond ONLY with valid JSON. No markdown, no code blocks, no explanation." }],
      model: "llama-3.3-70b-versatile",
    });
    let result = completion.choices[0]?.message?.content || "{}";
    
    // Strip markdown codeblocks if they exist
    if (result.includes("```")) {
      const match = result.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (match) result = match[1];
    }
    return result;
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
           text = await tryGenerateGroq();
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

export { genAI };
