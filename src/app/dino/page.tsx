/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useRef, useState } from "react";
import LeaderBoard from "./leaderboard";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Zap, Trophy, Gamepad2 } from "lucide-react";
import Sidebar from "@/components/Sidebar";

const DinoGame = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
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

  useEffect(() => {
    if (user) {
      // Lấy điểm từ Firestore
      const docRef = doc(db, "leaderboard", user.uid);
      onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          getScore({ type: "GET_SCORE", score: data.score });
        }
      });
    }
  }, [user]);

  const getScore = async (responseData: any) => {
    if (iframeRef.current) {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(responseData, "*");
      }
    }
  };

  // Hàm này sẽ được gọi từ iframe để cập nhật điểm số
  const handleMessage = async (event: MessageEvent<any>) => {
    if (event.data.type === "UPDATE_SCORE" && user) {
      const newScore = event.data.score;
      setScore(newScore);

      // Gửi điểm lên Firestore
      try {
        await setDoc(
          doc(db, "leaderboard", user.uid),
          {
            name: user.displayName,
            avatar: user.photoURL,
            score: newScore,
            timestamp: new Date().toISOString(),
          },
          { merge: true }, // Giữ lại dữ liệu cũ nếu đã có
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

  const DinoContent = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 transition-colors duration-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <Zap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Game Khủng Long
            </h1>
          </div>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            Chạy, nhảy và tránh chướng ngại vật để đạt điểm cao nhất!
          </p>
        </div>

        {/* Game Container */}
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Game Section */}
          <div className="lg:col-span-3">
            <div className="rounded-lg border-0 bg-white/80 p-6 shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gamepad2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    Game
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    Điểm: {score}
                  </span>
                </div>
              </div>

              <div
                className="flex min-h-[600px] items-center justify-center"
                suppressHydrationWarning
              >
                <div className="flex w-full max-w-[800px] flex-col items-center">
                  <iframe
                    ref={iframeRef}
                    src="/dino-game/index.html"
                    className="h-[600px] w-full rounded-lg border-0 bg-white dark:bg-gray-900"
                    title="Dino Game"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Leaderboard Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="rounded-lg border-0 bg-white/80 p-6 shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80">
                <div className="mb-4 flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Bảng Xếp Hạng
                  </h3>
                </div>
                <LeaderBoard />
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 text-center">
          <div className="mx-auto max-w-2xl rounded-lg bg-blue-50 p-6 dark:bg-blue-900/20">
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              Hướng Dẫn Chơi
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Sử dụng phím <strong>Space</strong> hoặc <strong>Up Arrow</strong>{" "}
              để nhảy, tránh các chướng ngại vật và cố gắng đạt điểm cao nhất!
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Sidebar>
      <DinoContent />
    </Sidebar>
  );
};

export default DinoGame;
