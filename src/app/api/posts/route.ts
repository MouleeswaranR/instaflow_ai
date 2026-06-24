import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      description,
      category,
      achievementType,
      notes,
      theme,
      font,
      layout,
      captions,
      hashtags,
      carouselSlides,
      musicRecommendations,
      selectedCaptionType,
      selectedHashtagType,
      images,
      selectedImageId,
    } = body;

    const post = await prisma.post.create({
      data: {
        userId: session.user.id,
        title,
        description,
        category: category || "OTHER",
        achievementType,
        notes,
        theme: theme || "dark",
        font: font || "modern",
        layout: layout || "SINGLE",
        status: "GENERATED",
        captions: {
          create: (captions || []).map((c: { type: string; content: string }) => ({
            type: c.type,
            content: c.content,
            selected: c.type === selectedCaptionType,
          })),
        },
        hashtagSets: {
          create: (hashtags || []).map((h: { type: string; hashtags: string[] }) => ({
            type: h.type,
            hashtags: h.hashtags,
            selected: h.type === selectedHashtagType,
          })),
        },
        carouselSlides: {
          create: (carouselSlides || []).map((s: { slideNumber: number; title: string; content: string }) => ({
            slideNumber: s.slideNumber,
            title: s.title,
            content: s.content,
          })),
        },
        musicRecommendations: {
          create: (musicRecommendations || []).map((m: { songName: string; artist: string; mood: string; popularityScore: number }, i: number) => ({
            songName: m.songName,
            artist: m.artist,
            mood: m.mood,
            popularityScore: m.popularityScore,
            selected: i === 0,
          })),
        },
        generatedImages: {
          create: (images || []).map((img: { url?: string; cloudinaryUrl?: string; publicId: string; template?: string; theme?: string; width?: number; height?: number; id: string; isSelected?: boolean }) => ({
            cloudinaryUrl: img.url || img.cloudinaryUrl || "",
            publicId: img.publicId || "",
            template: img.template || "custom",
            theme: img.theme || "custom",
            width: img.width || 1080,
            height: img.height || 1080,
            isSelected: img.id === selectedImageId || img.isSelected || false,
          })),
        },
      },
    });

    return NextResponse.json({ id: post.id });
  } catch (error) {
    console.error("Post creation error:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const posts = await prisma.post.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        captions: { where: { selected: true } },
        hashtagSets: { where: { selected: true } },
        generatedImages: { where: { isSelected: true } },
      },
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Posts fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
