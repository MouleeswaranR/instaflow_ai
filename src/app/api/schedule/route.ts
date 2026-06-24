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
    const { postId, scheduledAt, timezone, frequency } = body;

    const post = await prisma.post.findUnique({
      where: { id: postId, userId: session.user.id },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const scheduled = await prisma.scheduledPost.create({
      data: {
        postId,
        userId: session.user.id,
        scheduledAt: new Date(scheduledAt),
        timezone: timezone || "UTC",
        frequency: frequency || "ONCE",
        nextRunAt: new Date(scheduledAt),
      },
    });

    await prisma.post.update({
      where: { id: postId },
      data: { status: "SCHEDULED" },
    });

    return NextResponse.json({ id: scheduled.id });
  } catch (error) {
    console.error("Schedule error:", error);
    return NextResponse.json(
      { error: "Failed to schedule post" },
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

    const scheduled = await prisma.scheduledPost.findMany({
      where: { userId: session.user.id },
      orderBy: { scheduledAt: "asc" },
      include: {
        post: {
          select: {
            id: true,
            title: true,
            category: true,
            status: true,
          },
        },
      },
    });

    return NextResponse.json({ scheduled });
  } catch (error) {
    console.error("Scheduled posts fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch scheduled posts" },
      { status: 500 }
    );
  }
}
