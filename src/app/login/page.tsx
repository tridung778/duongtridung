/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const googleProvider = new GoogleAuthProvider();
  const facebookProvider = new FacebookAuthProvider();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
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
        { merge: true },
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

  // Hàm đăng nhập bằng Google
  const signInWithGoogle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;

      // Lưu thông tin người dùng vào Firestore
      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          email: user.email,
          lastLogin: new Date().toISOString(),
        },
        { merge: true },
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

  // Hàm đăng nhập bằng Google
  const signInWithFacebook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithPopup(auth, facebookProvider);
      const user = userCredential.user;

      // Lưu thông tin người dùng vào Firestore
      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          email: user.email,
          lastLogin: new Date().toISOString(),
        },
        { merge: true },
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
      className="flex h-[80vh] items-center justify-center"
      suppressHydrationWarning
    >
      <Card className="mx-auto w-[80%] max-w-md lg:w-full">
        <CardHeader className="flex items-center space-y-1">
          <CardTitle className="text-2xl font-bold">Đăng nhập bằng</CardTitle>
          {/* <CardDescription>Nhập thông tin tài khoản của bạn</CardDescription> */}
        </CardHeader>
        <CardContent className="flex flex-col justify-center space-y-4 lg:flex-row">
          <Button
            onClick={signInWithGoogle}
            className="bg-white lg:me-1"
            variant={"outline"}
          >
            Đăng nhập bằng Google
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="100"
              height="100"
              viewBox="0 0 48 48"
            >
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              ></path>
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              ></path>
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
            </svg>
          </Button>
          <Button
            onClick={signInWithFacebook}
            className="bg-[#4267B2] text-white lg:ms-1"
            variant={"default"}
          >
            Đăng nhập bằng Facebook
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="100"
              height="100"
              viewBox="0,0,256,256"
              style={{ fill: "#FFFFFF" }}
            >
              <g
                fill="#ffffff"
                fillRule="nonzero"
                stroke="none"
                strokeWidth="1"
                strokeLinecap="butt"
                strokeLinejoin="miter"
                strokeMiterlimit="10"
                strokeDasharray=""
                strokeDashoffset="0"
                fontFamily="none"
                fontWeight="none"
                fontSize="none"
                textAnchor="none"
                style={{ mixBlendMode: "normal" }}
              >
                <g transform="scale(5.12,5.12)">
                  <path d="M41,4h-32c-2.76,0 -5,2.24 -5,5v32c0,2.76 2.24,5 5,5h32c2.76,0 5,-2.24 5,-5v-32c0,-2.76 -2.24,-5 -5,-5zM37,19h-2c-2.14,0 -3,0.5 -3,2v3h5l-1,5h-4v15h-5v-15h-4v-5h4v-3c0,-4 2,-7 6,-7c2.9,0 4,1 4,1z"></path>
                </g>
              </g>
            </svg>
          </Button>
          {/* <div className="space-y-4">
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
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
}
