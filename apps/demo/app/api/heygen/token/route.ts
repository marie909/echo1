import { API_KEY, AVATAR_ID } from "../../secrets";

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json().catch(() => ({}));
    const avatarId = body.avatarId || AVATAR_ID;

    // Validate API key
    if (!API_KEY) {
      return new Response(
        JSON.stringify({ error: "API_KEY not configured" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Prepare request body for HeyGen API
    const heygenBody = avatarId ? { avatar_id: avatarId } : {};

    // Call HeyGen token endpoint
    const response = await fetch("https://api.heygen.com/v1/live/tokens", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(heygenBody),
    });

    // Handle HeyGen API errors
    if (!response.ok) {
      const errorText = await response.text();
      console.error("HeyGen API error:", response.status, errorText);
      return new Response(
        JSON.stringify({
          error: "Failed to retrieve token from HeyGen API",
        }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Parse HeyGen response
    const data = await response.json();

    // Extract token from response (handle different response shapes)
    let token: string | undefined;
    if (typeof data === "string") {
      token = data;
    } else if (data.token) {
      token = data.token;
    } else if (data.data?.token) {
      token = data.data.token;
    } else if (data.access_token) {
      token = data.access_token;
    }

    if (!token) {
      console.error("Unexpected HeyGen response shape:", data);
      return new Response(
        JSON.stringify({ error: "Invalid token response from HeyGen API" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Return token to client
    return new Response(JSON.stringify({ token }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in /api/heygen/token:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal server error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
