import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header/header";
import { ThemeProvider } from "@/components/theme-provider";
import Head from "next/head";
import Aurora from "@/blocks/Backgrounds/Aurora/Aurora";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Web của Dũng",
  description: "Làm được gì thì ném lên đây",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Web của Dũng" />
        <meta property="og:description" content="Làm được gì thì ném lên đây" />
        <meta property="og:image" content="/images/thumbnail.png" />{" "}
        {/* Đường dẫn đến ảnh */}
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content="https://duongtridung.vercel.app/" />
        {/* Thay bằng URL thực tế */}
        <meta property="og:type" content="website" />
        {/* Twitter Card (tùy chọn) */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="/images/thumbnail.png" />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="fixed top-0 left-0 h-full w-full">
            <Aurora
              // colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
              blend={0.5}
              amplitude={0.3}
              speed={0.5}
            />
          </div>
          <div className="relative z-10">
            <Header />
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
