// components/PostCard.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Trash2 } from "lucide-react";
import { Label } from "../ui/label";
import { formatReadableDate } from "@/utils/formatReadableDate";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/lib/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import Swal from "sweetalert2";
import { Post } from "@/type";
import { Avatar, AvatarImage } from "../ui/avatar";

interface PostCardProps {
  post: Post;
  onUpvote: (id: string) => void;
  onDownvote: (id: string) => void;
  onDelete: (id: string) => void;
}

export function PostCard({
  post,
  onUpvote,
  onDownvote,
  onDelete,
}: PostCardProps) {
  const [user] = useAuthState(auth); // Lấy thông tin người dùng hiện tại
  const userVote = post.votes?.[user?.uid || ""] || null; // Kiểm tra vote của user
  const isOwner = user?.uid === post.userId; // Kiểm tra xem user có phải chủ bài viết không

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

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-[16x]">{post.content}</p>
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
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Xoá bài viết</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
