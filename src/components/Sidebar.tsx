"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ModeToggle } from "./mode-toggle";
import {
  Home,
  FileText,
  Train,
  Zap,
  Calculator,
  Menu,
  X,
  User,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  onAuthStateChanged,
  signOut,
  User as FirebaseUser,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface SidebarProps {
  children: React.ReactNode;
}

const navigationItems = [
  { label: "Trang chủ", href: "/", icon: Home },
  { label: "Blog", href: "/blog", icon: FileText },
  { label: "Tra vé nhanh", href: "/travenhanh", icon: Train },
  { label: "Khủng long", href: "/dino", icon: Zap },
  { label: "BMI", href: "/bmi", icon: Calculator },
];

const Sidebar = ({ children }: SidebarProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userLogged, setUserLogged] = useState<FirebaseUser | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserLogged(user);
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (err) {
      console.error("Lỗi đăng xuất:", err);
    }
  };

  const NavItem = ({
    item,
    isMobile = false,
  }: {
    item: (typeof navigationItems)[0];
    isMobile?: boolean;
  }) => {
    const Icon = item.icon;
    const isActive = pathname === item.href;

    return (
      <Link
        href={item.href}
        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          isActive
            ? "bg-blue-100 text-blue-900 dark:bg-blue-900/20 dark:text-blue-100"
            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
        } ${isMobile ? "text-lg" : ""}`}
        onClick={() => setIsMobileOpen(false)}
      >
        <Icon className="h-4 w-4" />
        {item.label}
      </Link>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col">
        <div className="flex h-full flex-col border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          {/* Logo/Brand */}
          <div className="flex h-16 items-center border-b border-gray-200 px-6 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <span className="text-sm font-bold text-white">D</span>
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                Dũng&apos;s Web
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 px-4 py-6">
            {navigationItems.map((item) => (
              <NavItem key={item.href} item={item} />
            ))}
          </nav>

          {/* User Section */}
          <div className="border-t border-gray-200 p-4 dark:border-gray-700">
            <div className="mb-4 flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={userLogged?.photoURL || "/avatar.jpg"}
                  alt="User"
                />
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                  {userLogged?.displayName || "Khách"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {isLoggedIn ? "Đã đăng nhập" : "Chưa đăng nhập"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isLoggedIn ? (
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="flex-1 dark:border-gray-600 dark:text-gray-200"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Đăng xuất
                </Button>
              ) : (
                <Button
                  onClick={() => router.push("/login")}
                  size="sm"
                  className="flex-1"
                >
                  <User className="mr-2 h-4 w-4" />
                  Đăng nhập
                </Button>
              )}
              <ModeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed top-4 left-4 z-50 lg:hidden dark:border-gray-600"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-full flex-col bg-white dark:bg-gray-800">
            {/* Mobile Header */}
            <div className="flex h-16 items-center justify-between border-b border-gray-200 px-6 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                  <span className="text-sm font-bold text-white">D</span>
                </div>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  Dũng&apos;s Web
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileOpen(false)}
                className="dark:text-gray-300"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex-1 space-y-2 px-4 py-6">
              {navigationItems.map((item) => (
                <NavItem key={item.href} item={item} isMobile />
              ))}
            </nav>

            {/* Mobile User Section */}
            <div className="border-t border-gray-200 p-4 dark:border-gray-700">
              <div className="mb-4 flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={userLogged?.photoURL || "/avatar.jpg"}
                    alt="User"
                  />
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                    {userLogged?.displayName || "Khách"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {isLoggedIn ? "Đã đăng nhập" : "Chưa đăng nhập"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isLoggedIn ? (
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    size="sm"
                    className="flex-1 dark:border-gray-600 dark:text-gray-200"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Đăng xuất
                  </Button>
                ) : (
                  <Button
                    onClick={() => router.push("/login")}
                    size="sm"
                    className="flex-1"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Đăng nhập
                  </Button>
                )}
                <ModeToggle />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-1 flex-col lg:ml-0">
        {/* Mobile Header */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 lg:hidden dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <span className="text-sm font-bold text-white">D</span>
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              Dũng&apos;s Web
            </span>
          </div>
          <ModeToggle />
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default Sidebar;
