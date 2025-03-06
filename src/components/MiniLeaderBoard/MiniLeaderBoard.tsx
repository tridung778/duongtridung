"use client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { db } from "@/lib/firebase";
import { LeaderBoardEntry, LeaderBoardProps } from "@/type";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";

export default function MiniLeaderBoard({ currentUser }: LeaderBoardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderBoardEntry[]>([]);

  // Lắng nghe thay đổi realtime từ Firestore
  useEffect(() => {
    const q = query(
      collection(db, "leaderboard"),
      orderBy("score", "desc"),
      limit(5), // Giới hạn top 5
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const leaderboardData: LeaderBoardEntry[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          leaderboardData.push({
            uid: doc.id,
            name: data.name,
            avatar: data.avatar,
            score: data.score,
          });
        });
        setLeaderboard(leaderboardData);
      },
      (error) => {
        console.error("Lỗi khi lấy bảng xếp hạng:", error);
      },
    );

    return () => unsubscribe();
  }, []);

  return (
    <div className="w-full max-w-xs rounded-lg border p-4 shadow-sm">
      <h3 className="mb-2 text-lg font-semibold">Top 5 Người Chơi</h3>
      <div className="space-y-2">
        {leaderboard.map((entry, index) => (
          <div
            key={entry.uid}
            className={`flex items-center justify-between rounded p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
              entry.uid === currentUser?.uid
                ? "bg-lime-100 dark:bg-green-900"
                : ""
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-6 text-center text-sm font-medium">
                {index + 1}
              </span>
              <Avatar className="h-6 w-6">
                <AvatarImage src={entry.avatar} />
              </Avatar>
              <span className="max-w-[150px] truncate text-sm">
                {entry.name}
              </span>
            </div>
            <span className="text-sm font-medium">{entry.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
