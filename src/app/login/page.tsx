/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
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
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import Swal from "sweetalert2";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Lưu thông tin người dùng vào Firestore
      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          email: user.email,
          lastLogin: new Date().toISOString(),
        },
        { merge: true }
      ); // merge: true để không ghi đè dữ liệu cũ nếu đã tồn tại
      router.push("/");
    } catch (err: any) {
      if (err.code === "auth/invalid-credential") {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Tài khoản hoặc mật khẩu không đúng",
        });
      }
    }
  };

  return (
    <div
      className="flex items-center justify-center h-[80vh]"
      suppressHydrationWarning
    >
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Đăng nhập</CardTitle>
          <CardDescription>Nhập thông tin tài khoản của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="text">Tài khoản</Label>
              <Input
                id="username"
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              Chưa có tài khoản?{" "}
              <Link href={"/signup"} className="text-blue-400">
                Đăng ký
              </Link>
            </div>
            <Button type="submit" className="w-full" onClick={handleLogin}>
              Đăng nhập
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
