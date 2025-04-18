/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { ModeToggle } from "../mode-toggle";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Avatar } from "../ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import GooeyNav from "@/blocks/Components/GooeyNav/GooeyNav";

const items = [
  { label: " Trang chủ", href: "/" },

  { label: "Blog", href: "/blog" },

  { label: "Tra vé nhanh", href: "/travenhanh" },

  { label: "Khủng long", href: "/dino" },
];

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userLogged, setUserLogged] = useState<any>("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // console.log("User logged:", user);

      setUserLogged(user || "");
      setIsLoggedIn(!!user); // user tồn tại thì isLoggedIn = true
    });
    return () => unsubscribe(); // Cleanup khi component unmount
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login"); // Chuyển hướng sau khi đăng xuất
    } catch (err) {
      console.error("Lỗi đăng xuất:", err);
    }
  };
  return (
    <div>
      <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            {/* <Link href="#" prefetch={false}>
              <Image
                src="/images/Furina_Avatar.webp"
                alt="Mô tả hình ảnh"
                width={32}
                height={32}
              />
              <span className="sr-only">ShadCN</span>
            </Link> */}
            <div className="grid gap-2 py-6">
              <Link
                href="/"
                className="flex w-full items-center py-2 text-lg font-semibold"
                prefetch={false}
              >
                Trang chủ
              </Link>
              <Link
                href="/blog"
                className="flex w-full items-center py-2 text-lg font-semibold"
                prefetch={false}
              >
                Blog
              </Link>
              <Link
                href="/travenhanh"
                className="flex w-full items-center py-2 text-lg font-semibold"
                prefetch={false}
              >
                Tra vé nhanh
              </Link>
              <Link
                href="/dino"
                className="flex w-full items-center py-2 text-lg font-semibold"
                prefetch={false}
              >
                Khủng long
              </Link>
              <Link
                href="#"
                className="flex w-full items-center py-2 text-lg font-semibold"
                prefetch={false}
              >
                Contact
              </Link>
            </div>
          </SheetContent>
        </Sheet>
        {/* <Link href="#" className="mr-6 hidden lg:flex" prefetch={false}>
          <Image
            src="/images/Furina_Avatar.webp"
            alt="Mô tả hình ảnh"
            width={32}
            height={32}
          />
          <span className="sr-only">ShadCN</span>
        </Link> */}
        {/* <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            <NavigationMenuLink asChild>
              <Link
                href="/"
                className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
                prefetch={false}
              >
                Trang chủ
              </Link>
            </NavigationMenuLink>
            <NavigationMenuLink asChild>
              <Link
                href="/blog"
                className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
                prefetch={false}
              >
                Blog
              </Link>
            </NavigationMenuLink>
            <NavigationMenuLink asChild>
              <Link
                href="/travenhanh"
                className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
                prefetch={false}
              >
                Tra vé nhanh
              </Link>
            </NavigationMenuLink>
            <NavigationMenuLink asChild>
              <Link
                href="/dino"
                className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
                prefetch={false}
              >
                Khủng long
              </Link>
            </NavigationMenuLink>
          </NavigationMenuList>
        </NavigationMenu> */}
        <GooeyNav
          items={items}
          animationTime={600}
          pCount={15}
          minDistance={20}
          maxDistance={42}
          maxRotate={75}
          colors={[1, 2, 3, 1, 2, 3, 1, 4]}
          timeVariance={300}
        />
        <div className="ml-auto flex gap-2">
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage
                  src={userLogged.photoURL || "/avatar.jpg"}
                  alt="@shadcn"
                />
              </Avatar>
              {userLogged.displayName}{" "}
              <Button onClick={handleLogout}>Đăng xuất</Button>
            </div>
          ) : (
            <>
              {/* <Button variant="outline" onClick={() => router.push("/signup")}>
                Đăng ký
              </Button> */}
              <Button onClick={() => router.push("/login")}>Đăng nhập</Button>
            </>
          )}
          <ModeToggle />
        </div>
      </header>
    </div>
  );
};

export default Header;

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}
