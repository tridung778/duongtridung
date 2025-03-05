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
import Head from "next/head";

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
          // console.log("Đang lắng nghe điểm số...", data.score);
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
    // console.log("Message received:", event.data);
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

  return (
    <>
      <Head>
        <meta property="og:title" content="Khủng long" />
        <meta property="og:description" content="Chơi game khủng long" />
        <meta property="og:image" content="/images/dino_game.jng" />
      </Head>
      <div
        className="flex min-h-[80vh] items-center justify-center"
        suppressHydrationWarning
      >
        <div className="flex w-full max-w-[800px] flex-col items-center">
          <iframe
            ref={iframeRef}
            src="/dino.html"
            className="h-[30vh] w-full rounded-lg border-none lg:h-[50vh]"
          />
          <LeaderBoard currentUser={user} />
        </div>
      </div>
    </>
  );
};

export default DinoGame;
