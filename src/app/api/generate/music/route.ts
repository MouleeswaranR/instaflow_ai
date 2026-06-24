import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateMusicRecommendations } from "@/services/music.service";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, category } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    const recommendations = await generateMusicRecommendations({
      title,
      description,
      category: category || "OTHER",
    });

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error("Music recommendation error:", error);
    return NextResponse.json(
      { error: "Failed to generate music recommendations" },
      { status: 500 }
    );
  }
}
