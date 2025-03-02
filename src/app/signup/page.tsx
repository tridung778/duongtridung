/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"; // Đây là Client Component vì dùng state và Firebase Authentication

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase"; // Đảm bảo bạn đã cấu hình file này
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SignUpPage() {
  const [username, setUsername] = useState(""); // Thay vì username, dùng email cho Firebase
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Reset lỗi

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        username,
        password
      );
      console.log("Đăng ký thành công:", userCredential.user);
      router.push("/"); // Chuyển hướng đến trang đăng nhập sau khi đăng ký
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        setError("Email đã được sử dụng!");
      } else if (err.code === "auth/invalid-email") {
        setError("Email không hợp lệ!");
      } else if (err.code === "auth/weak-password") {
        setError("Mật khẩu phải ít nhất 6 ký tự!");
      } else {
        setError("Đã có lỗi xảy ra: " + err.message);
      }
      console.error("Lỗi:", err.code, err.message);
    }
  };

  return (
    <div
      className="flex items-center justify-center h-[80vh]"
      suppressHydrationWarning
    >
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Đăng ký</CardTitle>
          <CardDescription>Nhập thông tin tài khoản của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Email</Label>
              <Input
                id="username"
                type="email" // Đổi thành email thay vì text
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <div className="space-y-2">
              Quay lại trang{" "}
              <Link href="/login" className="text-blue-400">
                đăng nhập
              </Link>
            </div>
            <Button type="submit" className="w-full">
              Đăng ký
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
