import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateCaptions } from "@/services/caption.service";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, category, achievementType, notes } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    const captions = await generateCaptions({
      title,
      description,
      category: category || "OTHER",
      achievementType,
      notes,
    });

    return NextResponse.json({ captions });
  } catch (error) {
    console.error("Caption generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate captions" },
      { status: 500 }
    );
  }
}
