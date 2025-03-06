/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Comment {
  id: string;
  content: string;
  userId: string;
  userName: string;
  userAvatar: string;
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  userId: string;
  name: string;
  avatar?: string;
  createdAt: string;
  updatedAt?: string;
  upvotes: number;
  downvotes: number;
  votes?: Record<string, "up" | "down">;
  comments?: Comment[];
}
export interface LeaderBoardEntry {
  name: string;
  score: number;
  avatar: string;
  uid: string;
}

export interface LeaderBoardProps {
  currentUser: any; // Người dùng hiện tại
}
