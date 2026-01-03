// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css"; // 如果這行報錯，表示你的 css 檔案也不見了，可以先刪掉這行

export const metadata: Metadata = {
  title: "Life OS",
  description: "My Personal System for Growth",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className="bg-black text-slate-200 antialiased">
        {children}
      </body>
    </html>
  );
}