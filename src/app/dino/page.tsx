/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import LeaderBoard from "./leaderboard";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

const DinoGame = () => {
  const [score, setScore] = useState(0);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // Kiểm tra trạng thái đăng nhập
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        router.push("/login"); // Chuyển hướng nếu chưa đăng nhập
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Hàm này sẽ được gọi từ iframe để cập nhật điểm số
  const handleMessage = async (event: MessageEvent<any>) => {
    console.log("Message received:", event.data);
    if (event.data.type === "UPDATE_SCORE" && user) {
      const newScore = event.data.score;
      setScore(newScore);

      // Gửi điểm lên Firestore
      try {
        await setDoc(
          doc(db, "leaderboard", user.uid),
          {
            email: user.email,
            score: newScore,
            timestamp: new Date().toISOString(),
          },
          { merge: true } // Giữ lại dữ liệu cũ nếu đã có
        );
        console.log("Điểm đã được gửi lên Firestore!");
      } catch (error) {
        console.error("Lỗi khi gửi điểm:", error);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [user]); // Thêm user vào dependency để cập nhật khi user thay đổi

  if (!user) return null; // Không hiển thị nếu chưa đăng nhập

  return (
    <div
      className="min-h-[80vh] flex items-center justify-center"
      suppressHydrationWarning
    >
      <div className="flex flex-col items-center w-full max-w-[800px]">
        <iframe src="/dino.html" className="w-full h-[50vh] border-none" />
        <LeaderBoard currentUser={user} />
      </div>
    </div>
  );
};

export default DinoGame;
