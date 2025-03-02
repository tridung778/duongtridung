/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import LeaderBoard from "./leaderboard";

const DinoGame = () => {
  const [score, setScore] = useState(0);

  // Hàm này sẽ được gọi từ iframe để cập nhật điểm số
  const handleMessage = (event: MessageEvent<any>) => {
    console.log("Message received:", event.data);
    if (event.data.type === "UPDATE_SCORE") {
      setScore(event.data.score);
    }
  };

  // Lắng nghe sự kiện message từ iframe
  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <div
      className="min-h-[80vh] flex items-center justify-center"
      suppressHydrationWarning
    >
      <div className="flex flex-col items-center w-full max-w-[800px]">
        <iframe src="/dino.html" className="w-full h-[50vh] border-none" />
        <LeaderBoard />
      </div>
    </div>
  );
};

export default DinoGame;
