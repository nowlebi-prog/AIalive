import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/shared/Providers";

export const metadata: Metadata = {
  title: "Clover Desk | AI 시대에서 살아남기",
  description:
    "내 일에 맞는 네잎클로버를 찾는 여정. 무섭게 따라가기보다, 내 일에 맞는 작은 해결책을 하나씩 발견하는 AI 활용 아카이브.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full bg-mint-bg text-text-dark">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
