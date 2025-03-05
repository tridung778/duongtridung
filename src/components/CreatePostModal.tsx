// components/CreatePostModal.tsx
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { auth, db } from "@/lib/firebase";
import { addDoc, collection } from "firebase/firestore";
import { Plus } from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";

interface CreatePostModalProps {
  onCreate: () => void;
}

export function CreatePostModal({ onCreate }: CreatePostModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [open, setOpen] = useState(false);

  // Giới hạn độ dài
  const TITLE_MAX_LENGTH = 100; // Tiêu đề tối đa 100 ký tự
  const CONTENT_MAX_LENGTH = 1000; // Nội dung tối đa 1000 ký tự

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser; // Lấy thông tin người dùng đã đăng nhập

    if (!user) {
      alert("Vui lòng đăng nhập để tạo bài viết!");
      return;
    }

    // Kiểm tra độ dài trước khi submit
    if (title.length > TITLE_MAX_LENGTH) {
      Swal.fire(
        "Lỗi!",
        `Tiêu đề không được vượt quá ${TITLE_MAX_LENGTH} ký tự!`,
        "error",
      );
      return;
    }

    if (content.length > CONTENT_MAX_LENGTH) {
      Swal.fire(
        "Lỗi!",
        `Nội dung không được vượt quá ${CONTENT_MAX_LENGTH} ký tự!`,
        "error",
      );
      return;
    }

    if (title && content) {
      try {
        await addDoc(collection(db, "posts"), {
          title,
          content,
          upvotes: 0,
          downvotes: 0,
          userId: user.uid,
          email: user.email,
          createdAt: new Date().toISOString(),
          votes: {},
        });
        setTitle("");
        setContent("");
        setOpen(false);
        onCreate(); // Gọi để refresh danh sách bài viết
      } catch (error) {
        console.error("Lỗi khi tạo bài viết:", error);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Tạo bài viết
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo bài viết mới</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium">
              Tiêu đề
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề..."
              required
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium">
              Nội dung
            </label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập nội dung..."
              required
            />
          </div>
          <Button type="submit">Đăng bài</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
