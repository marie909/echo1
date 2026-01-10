"use client";

import { useState } from "react";
import Image from "next/image";
import { HeygenLiveAvatar } from "./HeygenLiveAvatar";

export const LiveAvatarDemo = () => {
  const [isStarted, setIsStarted] = useState(false);

  const handleStart = () => {
    setIsStarted(true);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      {!isStarted ? (
        <button
          onClick={handleStart}
          className="relative w-[800px] h-[800px] overflow-hidden border-0 p-0 cursor-pointer"
        >
          <Image
            src="https://i.postimg.cc/dtzVr981/IMG-6934.jpg"
            alt="Start Avatar Session"
            fill
            className="object-contain"
          />
        </button>
      ) : (
        <div className="w-full h-full">
          <HeygenLiveAvatar className="w-full h-full" />
        </div>
      )}
    </div>
  );
};
