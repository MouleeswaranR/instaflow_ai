import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getInstagramAuthUrl } from "@/lib/instagram";
import { prisma } from "@/lib/prisma";
import { absoluteUrl } from "@/lib/utils";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accounts = await prisma.instagramAccount.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        username: true,
        profilePictureUrl: true,
        followersCount: true,
        mediaCount: true,
        isActive: true,
        connectedAt: true,
      },
    });

    return NextResponse.json({ accounts });
  } catch (error) {
    console.error("Instagram accounts error:", error);
    return NextResponse.json(
      { error: "Failed to fetch accounts" },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const redirectUri = absoluteUrl("/api/integrations/instagram/callback");
    const authUrl = getInstagramAuthUrl(redirectUri);

    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error("Instagram connect error:", error);
    return NextResponse.json(
      { error: "Failed to initiate connection" },
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

    const { searchParams } = new URL(req.url);
    const accountId = searchParams.get("accountId");

    if (!accountId) {
      return NextResponse.json({ error: "Account ID required" }, { status: 400 });
    }

    await prisma.instagramAccount.delete({
      where: { id: accountId, userId: session.user.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Instagram disconnect error:", error);
    return NextResponse.json(
      { error: "Failed to disconnect" },
      { status: 500 }
    );
  }
}
