// components/PostCard.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Trash2, MessageSquare, Edit } from "lucide-react";
import { Label } from "../ui/label";
import { formatReadableDate } from "@/utils/formatReadableDate";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/lib/firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import Swal from "sweetalert2";
import { Post, Comment } from "@/type";
import { Avatar, AvatarImage } from "../ui/avatar";
import { useState } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

interface PostCardProps {
  post: Post;
  onUpvote: (id: string) => void;
  onDownvote: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updatedPost: Partial<Post>) => void;
}

export function PostCard({
  post,
  onUpvote,
  onDownvote,
  onDelete,
  onUpdate,
}: PostCardProps) {
  const [user] = useAuthState(auth); // Lấy thông tin người dùng hiện tại
  const userVote = post.votes?.[user?.uid || ""] || null; // Kiểm tra vote của user
  const isOwner = user?.uid === post.userId; // Kiểm tra xem user có phải chủ bài viết không

  // State cho chỉnh sửa
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(post.title);
  const [editedContent, setEditedContent] = useState(post.content);

  // State cho bình luận
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>(post.comments || []);

  const handleDelete = async () => {
    if (!isOwner) return; // Chỉ chủ sở hữu mới xóa được
    Swal.fire({
      title: "Bạn có chắc muốn xóa bài viết này?",
      showConfirmButton: true,
      confirmButtonText: "Xóa",
      confirmButtonColor: "#2E2E2E",
      showCancelButton: true,
      cancelButtonText: "Hủy",
      cancelButtonColor: "#d33",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteDoc(doc(db, "posts", post.id));
          onDelete(post.id);
          Swal.fire("Đã xóa!", "Bài viết đã được xóa thành công.", "success");
        } catch (error) {
          console.log("Error deleting post:", error);
          Swal.fire("Lỗi!", "Không thể xóa bài viết.", "error");
        }
      }
    });
  };

  // Xử lý chỉnh sửa bài viết
  const handleEdit = async () => {
    if (!isOwner) return;

    if (isEditing) {
      try {
        const updatedPost = {
          title: editedTitle,
          content: editedContent,
          updatedAt: new Date().toISOString(),
        };

        await updateDoc(doc(db, "posts", post.id), updatedPost);
        onUpdate(post.id, updatedPost);
        setIsEditing(false);
        Swal.fire(
          "Đã cập nhật!",
          "Bài viết đã được cập nhật thành công.",
          "success",
        );
      } catch (error) {
        console.log("Error updating post:", error);
        Swal.fire("Lỗi!", "Không thể cập nhật bài viết.", "error");
      }
    } else {
      setIsEditing(true);
    }
  };

  // Xử lý thêm bình luận
  const handleAddComment = async () => {
    if (!user || !newComment.trim()) return;

    try {
      const commentData: Comment = {
        id: Date.now().toString(),
        content: newComment,
        userId: user.uid,
        userName: user.displayName || "Anonymous",
        userAvatar: user.photoURL || "/avatar.jpg",
        createdAt: new Date().toISOString(),
      };

      const updatedComments = [...comments, commentData];
      await updateDoc(doc(db, "posts", post.id), {
        comments: updatedComments,
      });

      setComments(updatedComments);
      setNewComment("");
      onUpdate(post.id, { comments: updatedComments });
    } catch (error) {
      console.log("Error adding comment:", error);
      Swal.fire("Lỗi!", "Không thể thêm bình luận.", "error");
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        {isEditing ? (
          <Input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="mb-2"
          />
        ) : (
          <CardTitle>{post.title}</CardTitle>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="mb-2"
          />
        ) : (
          <p className="text-[16x]">{post.content}</p>
        )}

        <Label className="mt-4 text-[12px] font-thin">
          <Avatar className="size-[24px]">
            <AvatarImage src={post.avatar || "/avatar.jpg"} alt="@shadcn" />
          </Avatar>
          <div>
            {post.name} - {formatReadableDate(post.createdAt)}
          </div>
        </Label>

        <div className="mt-4 flex gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant={userVote === "up" ? "default" : "outline"}
              size="sm"
              onClick={() => onUpvote(post.id)}
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
            <span>{post.upvotes}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={userVote === "down" ? "default" : "outline"}
              size="sm"
              onClick={() => onDownvote(post.id)}
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
            <span>{post.downvotes}</span>
          </div>

          {isOwner && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={isEditing ? "default" : "outline"}
                    size="sm"
                    onClick={handleEdit}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isEditing ? "Lưu chỉnh sửa" : "Chỉnh sửa bài viết"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {isOwner && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Xóa bài viết</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            {comments.length}
          </Button>
        </div>

        {/* Phần bình luận */}
        {showComments && (
          <div className="mt-4">
            <div className="mb-4 space-y-2">
              {comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-2">
                  <Avatar className="size-[24px]">
                    <AvatarImage src={comment.userAvatar} />
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{comment.userName}</p>
                    <p className="text-sm">{comment.content}</p>
                    <p className="text-xs text-gray-500">
                      {formatReadableDate(comment.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {user && (
              <div className="flex gap-2">
                <Input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Viết bình luận..."
                  onKeyPress={(e) => {
                    if (e.key === "Enter") handleAddComment();
                  }}
                />
                <Button onClick={handleAddComment}>Gửi</Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
