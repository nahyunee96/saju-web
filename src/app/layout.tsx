import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { SquareMenu } from 'lucide-react';
import { UserPlus } from 'lucide-react';
import { Settings } from "lucide-react";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "묘운만세력",
  description: "당신의 운명을 찾아드립니다.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={notoSansKR.variable}>
      <body>
        <header id="header" className="header fixed w-full h-16 z-99 bg-[#011627] border-b-1 border-[#EED36C]">
          <div id="headerInner" className="inner flex max-w-3xl h-full justify-between items-center mx-auto">
            <div>
              <button className="cursor-pointer">
                <SquareMenu color="#EED36C" />
              </button>
            </div>

            <div>
              <button className="cursor-pointer">
                <UserPlus color="#EED36C" />
              </button>
              <button className="m-2 cursor-pointer">
                <Settings color="#EED36C" />
              </button>
            </div>
          </div>
        </header>
        {children}
        <footer id="footer" className="footer p-8 text-center">
          <div id="footerInner" className="inner">
            <p className="text-sm">Copyright © 2025 Hwarim96. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
