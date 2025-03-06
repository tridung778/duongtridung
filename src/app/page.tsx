/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { CreatePostModal } from "@/components/CreatePostModal";

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
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { Post } from "@/type";
import MiniLeaderBoard from "@/components/MiniLeaderBoard/MiniLeaderBoard";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const router = useRouter();
  const POSTS_PER_PAGE = 5;

  const user = auth.currentUser;

  const fetchPosts = async (isInitialLoad = false) => {
    try {
      let q;
      if (isInitialLoad || !lastDoc) {
        q = query(
          collection(db, "posts"),
          orderBy("upvotes", "desc"),
          limit(POSTS_PER_PAGE),
        );
      } else {
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

      if (newPosts.length === 0 || newPosts.length < POSTS_PER_PAGE) {
        setHasMore(false); // Không còn dữ liệu để tải
      }

      // Loại bỏ trùng lặp dựa trên id
      setPosts((prevPosts) => {
        const existingIds = new Set(prevPosts.map((post) => post.id));
        const filteredNewPosts = newPosts.filter(
          (post) => !existingIds.has(post.id),
        );
        return isInitialLoad ? newPosts : [...prevPosts, ...filteredNewPosts];
      });

      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
    } catch (error) {
      console.error("Lỗi khi tải bài viết:", error);
    }
  };
  // Tải lần đầu khi trang được render
  useEffect(() => {
    fetchPosts(true);
  }, []);

  // Theo dõi cuộn để hiển thị nút
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        // Hiển thị nút khi cuộn xuống 300px
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll); // Dọn dẹp
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

  const handleUpdate = (id: string, updatedPost: Partial<Post>) => {
    setPosts(
      posts.map((post) =>
        post.id === id ? { ...post, ...updatedPost } : post,
      ),
    );
  };

  // Hàm cuộn lên trên
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Cuộn mượt mà
    });
  };

  return (
    <main className="grid grid-cols-12 gap-4 px-4">
      {/* Cột trái (có thể để trống hoặc thêm nội dung khác) */}
      <div className="col-span-2 hidden lg:block">
        {/* Có thể thêm sidebar hoặc để trống */}
      </div>

      {/* Cột giữa - Bài viết */}
      <div className="col-span-12 mx-auto w-full max-w-2xl lg:col-span-7">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Bài viết</h1>
          {user && <CreatePostModal onCreate={fetchPosts} />}
        </div>
        <InfiniteScroll
          dataLength={posts.length}
          next={() => fetchPosts(false)}
          hasMore={hasMore}
          loader={<h4 className="text-center">Đang tải...</h4>}
          endMessage={<p className="text-center">Đã tải hết bài viết!</p>}
        >
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onUpvote={handleUpvote}
              onDownvote={handleDownvote}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))}
        </InfiniteScroll>

        {/* Nút cuộn lên trên */}
        {showScrollTop && (
          <Button
            onClick={scrollToTop}
            className="fixed right-4 bottom-4 rounded-full p-2"
            variant="default"
          >
            <ArrowUp className="h-6 w-6" />
          </Button>
        )}
      </div>

      {/* Cột phải - Bảng xếp hạng */}
      <div className="col-span-3 hidden lg:block">
        <div className="sticky top-4">
          <MiniLeaderBoard currentUser={user} />
        </div>
      </div>
    </main>
  );
}
