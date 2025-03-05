/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { CreatePostModal } from "@/components/CreatePostModal";
import { Post } from "@/components/PostCard/post";
import { PostCard } from "@/components/PostCard/PostCard";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [lastDoc, setLastDoc] = useState<any>(null); // Lưu document cuối cùng của lô trước
  const [hasMore, setHasMore] = useState(true); // Kiểm tra còn dữ liệu để tải không
  const router = useRouter();
  const POSTS_PER_PAGE = 5; // Số bài viết tải mỗi lần

  const user = auth.currentUser;

  // Hàm tải bài viết
  const fetchPosts = async (isInitialLoad = false) => {
    try {
      let q;
      if (isInitialLoad || !lastDoc) {
        // Lần tải đầu tiên
        q = query(
          collection(db, "posts"),
          orderBy("upvotes", "desc"), // Sắp xếp theo upvotes giảm dần
          limit(POSTS_PER_PAGE),
        );
      } else {
        // Tải lô tiếp theo
        q = query(
          collection(db, "posts"),
          orderBy("upvotes", "desc"),
          startAfter(lastDoc),
          limit(POSTS_PER_PAGE),
        );
      }

      const querySnapshot = await getDocs(q);
      const newPosts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];

      if (newPosts.length < POSTS_PER_PAGE) setHasMore(false); // Không còn dữ liệu để tải

      setPosts((prevPosts) =>
        isInitialLoad ? newPosts : [...prevPosts, ...newPosts],
      );
      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]); // Lưu document cuối
    } catch (error) {
      console.error("Lỗi khi tải bài viết:", error);
    }
  };

  // Tải lần đầu khi trang được render
  useEffect(() => {
    fetchPosts(true);
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
    fetchPosts(true); // Reset và tải lại từ đầu vì upvotes thay đổi
  };

  const handleUpvote = (id: string) => handleVote(id, "up");
  const handleDownvote = (id: string) => handleVote(id, "down");

  const handleDelete = (id: string) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id)); // Xóa khỏi state ngay lập tức
    fetchPosts(); // Refresh từ Firestore để đảm bảo đồng bộ
  };

  return (
    <main className="mx-auto max-w-2xl p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Bài viết</h1>
        {user && <CreatePostModal onCreate={fetchPosts} />}
      </div>
      <InfiniteScroll
        dataLength={posts.length} // Tổng số bài viết hiện tại
        next={() => fetchPosts(false)} // Hàm tải thêm bài viết
        hasMore={hasMore} // Còn dữ liệu để tải không
        loader={<h4 className="text-center">Đang tải...</h4>} // Hiển thị khi đang tải
        endMessage={<p className="text-center">Đã tải hết bài viết!</p>} // Khi hết dữ liệu
      >
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onUpvote={handleUpvote}
            onDownvote={handleDownvote}
            onDelete={handleDelete}
          />
        ))}
      </InfiniteScroll>
    </main>
  );
}
