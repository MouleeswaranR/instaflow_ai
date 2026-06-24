import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateCarouselContent } from "@/services/carousel.service";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, category, notes } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    const slides = await generateCarouselContent({
      title,
      description,
      category: category || "OTHER",
      notes,
    });

    return NextResponse.json({ slides });
  } catch (error) {
    console.error("Carousel generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate carousel" },
      { status: 500 }
    );
  }
}
