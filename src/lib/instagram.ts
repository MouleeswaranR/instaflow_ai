if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const INSTAGRAM_API_BASE = "https://graph.instagram.com";
const FACEBOOK_OAUTH_BASE = "https://www.facebook.com/v18.0/dialog/oauth";
const FACEBOOK_GRAPH_BASE = "https://graph.facebook.com/v18.0";

export interface InstagramTokenResponse {
  access_token: string;
  user_id: string;
}

export interface InstagramLongLivedToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface InstagramProfile {
  id: string;
  username: string;
  name: string;
  profile_picture_url?: string;
  followers_count: number;
  follows_count: number;
  media_count: number;
}

export function getInstagramAuthUrl(redirectUri: string): string {
  const params = new URLSearchParams({
    client_id: process.env.INSTAGRAM_APP_ID!,
    redirect_uri: redirectUri,
    scope: "instagram_basic,instagram_content_publish,pages_show_list,pages_read_engagement",
    response_type: "code",
  });
  return `${FACEBOOK_OAUTH_BASE}?${params.toString()}`;
}

export async function exchangeCodeForToken(
  code: string,
  redirectUri: string
): Promise<InstagramTokenResponse> {
  const formData = new URLSearchParams({
    client_id: process.env.INSTAGRAM_APP_ID!,
    client_secret: process.env.INSTAGRAM_APP_SECRET!,
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
    code,
  });

  const response = await fetch(`${FACEBOOK_GRAPH_BASE}/oauth/access_token?${formData.toString()}`, {
    method: "GET",
  });

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    const errMsg = errBody?.error?.message || response.statusText;
    throw new Error(`Token exchange failed: ${errMsg}`);
  }

  return response.json();
}

export async function getLongLivedToken(
  shortLivedToken: string
): Promise<InstagramLongLivedToken> {
  const params = new URLSearchParams({
    grant_type: "fb_exchange_token",
    client_id: process.env.INSTAGRAM_APP_ID!,
    client_secret: process.env.INSTAGRAM_APP_SECRET!,
    fb_exchange_token: shortLivedToken,
  });

  const response = await fetch(
    `${FACEBOOK_GRAPH_BASE}/oauth/access_token?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error(`Failed to get long-lived token: ${response.statusText}`);
  }

  return response.json();
}

export async function refreshToken(
  token: string
): Promise<InstagramLongLivedToken> {
  const params = new URLSearchParams({
    grant_type: "ig_refresh_token",
    access_token: token,
  });

  const response = await fetch(
    `${INSTAGRAM_API_BASE}/refresh_access_token?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error(`Failed to refresh token: ${response.statusText}`);
  }

  return response.json();
}

export async function getProfile(
  accessToken: string
): Promise<InstagramProfile> {
  // 1. Get Facebook Pages
  const pagesResponse = await fetch(`${FACEBOOK_GRAPH_BASE}/me/accounts?access_token=${accessToken}`);
  if (!pagesResponse.ok) throw new Error("Failed to fetch FB Pages");
  const pagesData = await pagesResponse.json();

  if (!pagesData.data || pagesData.data.length === 0) {
    throw new Error("No Facebook Pages found");
  }

  let igAccountId = null;

  // 2. Find a page with an Instagram Business Account
  for (const page of pagesData.data) {
    const pageResponse = await fetch(`${FACEBOOK_GRAPH_BASE}/${page.id}?fields=instagram_business_account&access_token=${accessToken}`);
    if (pageResponse.ok) {
      const pageDetails = await pageResponse.json();
      if (pageDetails.instagram_business_account?.id) {
        igAccountId = pageDetails.instagram_business_account.id;
        break;
      }
    }
  }

  if (!igAccountId) {
    throw new Error("No Instagram Business Account linked to your Facebook Pages");
  }

  // 3. Fetch Instagram Profile details
  const params = new URLSearchParams({
    fields: "id,username,name,profile_picture_url,followers_count,follows_count,media_count",
    access_token: accessToken,
  });

  const response = await fetch(
    `${FACEBOOK_GRAPH_BASE}/${igAccountId}?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error(`Failed to get profile: ${response.statusText}`);
  }

  return response.json();
}

export async function createMediaContainer(
  accessToken: string,
  userId: string,
  options: {
    imageUrl: string;
    caption?: string;
    mediaType?: "IMAGE" | "CAROUSEL";
  }
): Promise<string> {
  const body: Record<string, string> = {
    image_url: options.imageUrl,
    access_token: accessToken,
  };

  if (options.caption) body.caption = options.caption;
  if (options.mediaType) body.media_type = options.mediaType;

  const response = await fetch(`${FACEBOOK_GRAPH_BASE}/${userId}/media`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to create media container: ${JSON.stringify(error)}`);
  }

  const data = await response.json();
  return data.id;
}

export async function createCarouselContainer(
  accessToken: string,
  userId: string,
  children: string[],
  caption?: string
): Promise<string> {
  const body: Record<string, unknown> = {
    media_type: "CAROUSEL",
    children: children,
    access_token: accessToken,
  };

  if (caption) body.caption = caption;

  const response = await fetch(`${FACEBOOK_GRAPH_BASE}/${userId}/media`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Failed to create carousel: ${response.statusText}`);
  }

  const data = await response.json();
  return data.id;
}

export async function publishMedia(
  accessToken: string,
  userId: string,
  containerId: string
): Promise<string> {
  const response = await fetch(
    `${FACEBOOK_GRAPH_BASE}/${userId}/media_publish`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        creation_id: containerId,
        access_token: accessToken,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to publish media: ${response.statusText}`);
  }

  const data = await response.json();
  return data.id;
}

export async function getMediaInsights(
  accessToken: string,
  mediaId: string
): Promise<Record<string, number>> {
  // We use the fields endpoint because the /insights edge requires 'instagram_manage_insights' 
  // permission which may not be granted by default for basic accounts.
  const params = new URLSearchParams({
    fields: "like_count,comments_count",
    access_token: accessToken,
  });

  const response = await fetch(
    `${FACEBOOK_GRAPH_BASE}/${mediaId}?${params.toString()}`
  );

  if (!response.ok) {
    return {};
  }

  const data = await response.json();
  
  return {
    likes: data.like_count ?? 0,
    comments: data.comments_count ?? 0,
    reach: 0,
    impressions: 0,
    saved: 0,
    shares: 0,
  };
}
