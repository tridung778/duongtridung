"use client";
import { useEffect, useState } from "react";

const DinoGame = () => {
  const [score, setScore] = useState(0);

  // Hàm này sẽ được gọi từ iframe để cập nhật điểm số
  const handleMessage = (event) => {
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
    <div>
      <h1>Dino Game</h1>
      <iframe
        src="/dino.html" // Đường dẫn đến file HTML trong thư mục public
        className="w-full h-full absolute top-0 left-0 border-none"
      />
      <div className="absolute top-5 left-5 text-2xl z-10">
        Điểm số: {score}
      </div>
    </div>
  );
};

export default DinoGame;
