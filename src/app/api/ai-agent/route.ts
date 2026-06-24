import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { chatWithAgent } from "@/services/ai-agent.service";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { message, conversationId } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const response = await chatWithAgent({
      userId: session.user.id,
      message,
      conversationId,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("AI Agent error:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}
