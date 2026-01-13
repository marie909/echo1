import {
  API_KEY,
  API_URL,
  AVATAR_ID,
  VOICE_ID,
  CONTEXT_ID,
  LANGUAGE,
} from "../secrets";

export async function POST() {
  let session_token = "";
  let session_id = "";
  try {
    console.log("Requesting session token with:", {
      url: `${API_URL}/v1/sessions/token`,
      avatar_id: AVATAR_ID,
      voice_id: VOICE_ID,
      context_id: CONTEXT_ID,
    });

    const res = await fetch(`${API_URL}/v1/sessions/token`, {
      method: "POST",
      headers: {
        "X-API-KEY": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mode: "FULL",
        avatar_id: AVATAR_ID,
        avatar_persona: {
          voice_id: VOICE_ID,
          context_id: CONTEXT_ID,
          language: LANGUAGE,
        },
      }),
    });
    
    console.log("API Response status:", res.status);
    
    if (!res.ok) {
      let errorMessage = "Failed to retrieve session token";
      try {
        const resp = await res.json();
        console.error("API Error response:", resp);
        // Try different error response formats
        if (resp.data && Array.isArray(resp.data) && resp.data[0]?.message) {
          errorMessage = resp.data[0].message;
        } else if (resp.message) {
          errorMessage = resp.message;
        } else if (resp.error) {
          errorMessage = resp.error;
        }
      } catch (parseError) {
        // If JSON parsing fails, use default error message
        console.error("Failed to parse error response:", parseError);
      }
      return new Response(JSON.stringify({ error: errorMessage }), {
        status: res.status,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    const data = await res.json();
    console.log("API Success response:", data);

    session_token = data.data.session_token;
    session_id = data.data.session_id;
  } catch (error) {
    console.error("Error retrieving session token:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  if (!session_token) {
    console.error("No session token received from API");
    return new Response(JSON.stringify({ error: "Failed to retrieve session token" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  return new Response(JSON.stringify({ session_token, session_id }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
