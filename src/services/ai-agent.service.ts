import { generateGroqJSON } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";

interface AgentInput {
  userId: string;
  message: string;
  conversationId?: string;
}

interface AgentResponse {
  message: string;
  suggestions?: string[];
  actions?: Array<{
    type: "generate_post" | "schedule" | "analyze" | "recommend";
    data: Record<string, unknown>;
  }>;
}

export async function chatWithAgent(input: AgentInput): Promise<AgentResponse> {
  // Get user context
  const [recentPosts, analytics, integrations] = await Promise.all([
    prisma.post.findMany({
      where: { userId: input.userId },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        title: true,
        category: true,
        status: true,
        publishedAt: true,
        createdAt: true,
      },
    }),
    prisma.analyticsSnapshot.findMany({
      where: { userId: input.userId },
      orderBy: { date: "desc" },
      take: 7,
    }),
    Promise.all([
      prisma.instagramAccount.findFirst({
        where: { userId: input.userId, isActive: true },
      }),
      prisma.leetCodeIntegration.findFirst({
        where: { userId: input.userId },
      }),
      prisma.gitHubIntegration.findFirst({
        where: { userId: input.userId },
      }),
    ]),
  ]);

  const [igAccount, leetcode, github] = integrations;

  const systemContext = `You are an AI social media manager for InstaFlow AI. You help users grow their Instagram presence.

User's context:
- Recent posts: ${JSON.stringify(recentPosts)}
- Recent analytics: ${JSON.stringify(analytics)}
- Instagram connected: ${!!igAccount}
- LeetCode connected: ${!!leetcode}${leetcode ? ` (${leetcode.totalSolved} problems solved)` : ""}
- GitHub connected: ${!!github}

Your capabilities:
1. Suggest best posting times based on engagement data
2. Generate post ideas based on user's activity
3. Improve captions and hashtags
4. Analyze content performance
5. Recommend content strategies
6. Suggest music for posts

Guidelines:
- Be helpful, concise, and actionable
- Provide specific suggestions, not generic advice
- Use emojis sparingly for friendliness
- If user wants to create a post, provide structured suggestions
- Always back up suggestions with reasoning`;

  const prompt = `${systemContext}

User message: ${input.message}

Respond as JSON:
{
  "message": "Your helpful response here",
  "suggestions": ["Optional suggestion 1", "Optional suggestion 2"],
  "actions": [
    {
      "type": "generate_post | schedule | analyze | recommend",
      "data": {}
    }
  ]
}

Only include suggestions and actions when relevant. The message is always required.`;

  const response = await generateGroqJSON<AgentResponse>(prompt, "llama-3.3-70b-versatile");

  // Save conversation
  let conversationId = input.conversationId;

  if (!conversationId) {
    const conversation = await prisma.aIConversation.create({
      data: { userId: input.userId },
    });
    conversationId = conversation.id;
  }

  await prisma.aIMessage.createMany({
    data: [
      {
        conversationId,
        role: "USER",
        content: input.message,
      },
      {
        conversationId,
        role: "ASSISTANT",
        content: response.message,
        metadata: {
          suggestions: response.suggestions,
          actions: response.actions,
        } as any,
      },
    ],
  });

  return response;
}
