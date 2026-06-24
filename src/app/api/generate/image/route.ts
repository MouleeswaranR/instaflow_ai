import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generatePostImage } from "@/services/image.service";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, category, theme, template, width, height, customInstruction, caption, hashtags } = await req.json();

    if (!title || !description || !category) {
      return NextResponse.json(
        { error: "Title, description, and category are required" },
        { status: 400 }
      );
    }

    const image = await generatePostImage({
      title,
      description,
      category,
      theme: theme || "dark",
      template: template || "achievement-post",
      width: width || 1080,
      height: height || 1080,
      customInstruction,
      caption,
      hashtags,
    });

    if (!image) {
      throw new Error("Failed to generate image");
    }

    return NextResponse.json({ image });
  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}
