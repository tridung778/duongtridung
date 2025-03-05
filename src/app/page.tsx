"use client";
import { CreatePostModal } from "@/components/CreatePostModal";
import { Post } from "@/components/PostCard/post";
import { PostCard } from "@/components/PostCard/PostCard";
import { auth, db } from "@/lib/firebase";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const user = auth.currentUser;
  const router = useRouter();

  // Lấy và sắp xếp bài viết từ Firestore
  const fetchPosts = async () => {
    const querySnapshot = await getDocs(collection(db, "posts"));
    const postsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Post[];
    // Sắp xếp theo upvotes giảm dần
    postsData.sort((a, b) => b.upvotes - a.upvotes);
    setPosts(postsData);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleVote = async (id: string, voteType: "up" | "down") => {
    if (!user) {
      Swal.fire({
        title: "Vui lòng đăng nhập để vote!",
        showConfirmButton: true,
        confirmButtonText: "Đăng nhập",
        confirmButtonColor: "#2E2E2E",

        showCancelButton: true,
        cancelButtonText: "Hủy",
        cancelButtonColor: "#d33",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/login");
        }
      });
      return;
    }

    const postRef = doc(db, "posts", id);
    const post = posts.find((p) => p.id === id);
    if (!post) return;

    const currentVote = post.votes?.[user.uid]; // Kiểm tra user đã vote chưa
    let upvotes = post.upvotes;
    let downvotes = post.downvotes;
    const updatedVotes = { ...post.votes };

    if (currentVote) {
      // Nếu đã vote trước đó
      if (currentVote === voteType) return; // Không làm gì nếu vote lại cùng loại
      if (currentVote === "up") upvotes--; // Hủy upvote
      if (currentVote === "down") downvotes--; // Hủy downvote
    }

    // Cập nhật vote mới
    if (voteType === "up") upvotes++;
    if (voteType === "down") downvotes++;
    updatedVotes[user.uid] = voteType;

    await updateDoc(postRef, {
      upvotes,
      downvotes,
      votes: updatedVotes,
    });
    fetchPosts(); // Refresh danh sách
  };

  const handleUpvote = (id: string) => handleVote(id, "up");
  const handleDownvote = (id: string) => handleVote(id, "down");

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Bạn có chắc muốn xoá bài viết này!",
      showConfirmButton: true,
      confirmButtonText: "Xoá",
      confirmButtonColor: "#2E2E2E",

      showCancelButton: true,
      cancelButtonText: "Hủy",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
        fetchPosts();
      }
    });
  };

  return (
    <main className="mx-auto max-w-2xl p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Bài viết</h1>
        {user && <CreatePostModal onCreate={fetchPosts} />}
      </div>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onUpvote={handleUpvote}
          onDownvote={handleDownvote}
          onDelete={handleDelete}
        />
      ))}
    </main>
  );
}
