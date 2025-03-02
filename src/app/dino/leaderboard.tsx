/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { db } from "@/lib/firebase";
import maskEmail from "@/utils/maskEmail";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";

interface LeaderBoardEntry {
  email: string;
  score: number;
  uid: string;
}

interface LeaderBoardProps {
  currentUser: any; // Người dùng hiện tại
}

export default function LeaderBoard({ currentUser }: LeaderBoardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderBoardEntry[]>([]);

  // Lắng nghe thay đổi realtime từ Firestore
  useEffect(() => {
    const q = query(
      collection(db, "leaderboard"),
      orderBy("score", "desc"), // Sắp xếp theo điểm giảm dần
      limit(10) // Giới hạn 10 người chơi hàng đầu
    );

    // Sử dụng onSnapshot để lắng nghe thay đổi
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const leaderboardData: LeaderBoardEntry[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          leaderboardData.push({
            uid: doc.id,
            email: data.email,
            score: data.score,
          });
        });
        setLeaderboard(leaderboardData);
      },
      (error) => {
        console.error("Lỗi khi lấy bảng xếp hạng:", error);
      }
    );

    // Cleanup khi component unmount
    return () => unsubscribe();
  }, []); // Chạy một lần khi mount, nhưng lắng nghe liên tục

  return (
    <Table className="w-full mt-4">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[40px] text-center">Hạng</TableHead>
          <TableHead className="w-[200px]">Email</TableHead>
          <TableHead className="w-[50px] text-center">Điểm</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leaderboard.map((entry, index) => (
          <TableRow
            key={entry.uid}
            className={`hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors ${
              entry.uid === currentUser?.uid
                ? "bg-lime-100 dark:bg-green-900"
                : ""
            }`}
          >
            <TableCell className="text-center font-medium">
              {index + 1}
            </TableCell>
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                <Link
                  href={`#${entry.uid}`}
                  className=" hover:underline"
                  prefetch={false}
                >
                  {maskEmail(entry.email)}
                </Link>
              </div>
            </TableCell>
            <TableCell className="text-center">{entry.score}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
