import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fetchLeetCodeProfile } from "@/services/leetcode.service";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const integration = await prisma.leetCodeIntegration.findUnique({
      where: { userId: session.user.id },
    });

    return NextResponse.json({ integration });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { username, autoPost } = body;

    if (username) {
      // Fetch profile to validate username if provided
      const profile = await fetchLeetCodeProfile(username);

      const integration = await prisma.leetCodeIntegration.upsert({
        where: { userId: session.user.id },
        create: {
          userId: session.user.id,
          username: profile.username,
          totalSolved: profile.totalSolved,
          easySolved: profile.easySolved,
          mediumSolved: profile.mediumSolved,
          hardSolved: profile.hardSolved,
          contestRating: profile.contestRating,
          streak: profile.streak,
          lastSyncAt: new Date(),
          autoPost: autoPost ?? false,
        },
        update: {
          username: profile.username,
          totalSolved: profile.totalSolved,
          easySolved: profile.easySolved,
          mediumSolved: profile.mediumSolved,
          hardSolved: profile.hardSolved,
          contestRating: profile.contestRating,
          streak: profile.streak,
          lastSyncAt: new Date(),
          ...(autoPost !== undefined && { autoPost }),
        },
      });
      return NextResponse.json({ integration });
    } else if (autoPost !== undefined) {
      // Just update autoPost if username is not provided
      const integration = await prisma.leetCodeIntegration.update({
        where: { userId: session.user.id },
        data: { autoPost },
      });
      return NextResponse.json({ integration });
    } else {
      return NextResponse.json({ error: "Username or autoPost required" }, { status: 400 });
    }
  } catch (error) {
    console.error("LeetCode integration error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to connect" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.leetCodeIntegration.deleteMany({
      where: { userId: session.user.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to disconnect" }, { status: 500 });
  }
}
