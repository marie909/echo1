"use client";

import { useState } from "react";
import Image from "next/image";
import { LiveAvatarSession } from "./LiveAvatarSession";

export const LiveAvatarDemo = () => {
  const [sessionToken, setSessionToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Fetching session token...");
      const res = await fetch("/api/start-session", {
        method: "POST",
      });
      console.log("Response status:", res.status);
      if (!res.ok) {
        const error = await res.json();
        console.error("API Error:", error);
        setError(error.error);
        return;
      }
      const { session_token } = await res.json();
      console.log("Session token received");
      setSessionToken(session_token);
    } catch (error: unknown) {
      console.error("Fetch error:", error);
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const onSessionStopped = () => {
    // Reset the FE state
    setSessionToken("");
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      {!sessionToken ? (
        <>
          {error && (
            <div className="text-red-500 bg-red-100 border border-red-400 rounded p-4 mb-4 max-w-2xl">
              <strong>Error getting session token:</strong> {error}
            </div>
          )}
          {isLoading && (
            <div className="text-blue-500 bg-blue-100 border border-blue-400 rounded p-4 mb-4">
              Loading session... Please wait.
            </div>
          )}
          <button
            onClick={handleStart}
            disabled={isLoading}
            className="relative w-[800px] h-[800px] overflow-hidden border-0 p-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Image
              src="https://i.postimg.cc/dtzVr981/IMG-6934.jpg"
              alt="Start Avatar Session"
              fill
              className="object-contain"
            />
          </button>
        </>
      ) : (
        <LiveAvatarSession
          mode="FULL"
          sessionAccessToken={sessionToken}
          onSessionStopped={onSessionStopped}
        />
      )}
    </div>
  );
};
