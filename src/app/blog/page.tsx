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
import { ArrowUp, FileText } from "lucide-react";
import { Post } from "@/type";
import MiniLeaderBoard from "@/components/MiniLeaderBoard/MiniLeaderBoard";
import Sidebar from "@/components/Sidebar";

const BlogPage = () => {
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
        setHasMore(false);
      }

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

  useEffect(() => {
    fetchPosts(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleUpvote = async (id: string) => {
    if (!user) {
      Swal.fire({
        title: "Cần đăng nhập",
        text: "Bạn cần đăng nhập để vote bài viết",
        icon: "warning",
        confirmButtonText: "Đăng nhập",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/login");
        }
      });
      return;
    }

    try {
      const postRef = doc(db, "posts", id);
      const post = posts.find((p) => p.id === id);
      if (!post) return;

      const newUpvotes = (post.upvotes || 0) + 1;
      await updateDoc(postRef, { upvotes: newUpvotes });

      setPosts((prevPosts) =>
        prevPosts.map((p) => (p.id === id ? { ...p, upvotes: newUpvotes } : p)),
      );
    } catch (error) {
      console.error("Lỗi khi vote:", error);
    }
  };

  const handleDownvote = async (id: string) => {
    if (!user) {
      Swal.fire({
        title: "Cần đăng nhập",
        text: "Bạn cần đăng nhập để vote bài viết",
        icon: "warning",
        confirmButtonText: "Đăng nhập",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/login");
        }
      });
      return;
    }

    try {
      const postRef = doc(db, "posts", id);
      const post = posts.find((p) => p.id === id);
      if (!post) return;

      const newDownvotes = (post.downvotes || 0) + 1;
      await updateDoc(postRef, { downvotes: newDownvotes });

      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.id === id ? { ...p, downvotes: newDownvotes } : p,
        ),
      );
    } catch (error) {
      console.error("Lỗi khi vote:", error);
    }
  };

  const handleDelete = (id: string) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
    fetchPosts(true);
  };

  const handleUpdate = (id: string, updatedPost: Partial<Post>) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === id ? { ...post, ...updatedPost } : post,
      ),
    );
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const BlogContent = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 transition-colors duration-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Blog
            </h1>
          </div>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            Chia sẻ kiến thức, kinh nghiệm và những điều thú vị về công nghệ
          </p>
        </div>

        {/* Create Post Button */}
        <div className="mb-8 flex justify-center">
          {user && <CreatePostModal onCreate={fetchPosts} />}
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Posts Section */}
          <div className="lg:col-span-3">
            <div className="rounded-lg border-0 bg-white/80 p-6 shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80">
              <InfiniteScroll
                dataLength={posts.length}
                next={() => fetchPosts(false)}
                hasMore={hasMore}
                loader={
                  <div className="py-4 text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                  </div>
                }
                endMessage={
                  <div className="py-4 text-center text-gray-500 dark:text-gray-400">
                    <p>Đã tải hết bài viết!</p>
                  </div>
                }
                className="space-y-6"
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
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <MiniLeaderBoard currentUser={user} />
            </div>
          </div>
        </div>

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <Button
            onClick={scrollToTop}
            className="fixed right-8 bottom-8 z-50 rounded-full bg-blue-600 p-3 shadow-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            size="icon"
          >
            <ArrowUp className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <Sidebar>
      <BlogContent />
    </Sidebar>
  );
};

export default BlogPage;
