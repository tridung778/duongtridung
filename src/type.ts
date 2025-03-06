/* eslint-disable @typescript-eslint/no-explicit-any */
export type Post = {
  id: string;
  title: string;
  content: string;
  upvotes: number;
  downvotes: number;
  userId: string;
  avatar: string;
  name: string;
  createdAt: string;
  votes?: Record<string, "up" | "down">; // Lưu userId và loại vote
};

export interface LeaderBoardEntry {
  name: string;
  score: number;
  avatar: string;
  uid: string;
}

export interface LeaderBoardProps {
  currentUser: any; // Người dùng hiện tại
}
