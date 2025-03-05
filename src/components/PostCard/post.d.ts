export type Post = {
  id: string;
  title: string;
  content: string;
  upvotes: number;
  downvotes: number;
  userId: string;
  email: string;
  createdAt: string;
  votes?: Record<string, "up" | "down">; // Lưu userId và loại vote
};
