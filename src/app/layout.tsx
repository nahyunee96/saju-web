// app/layout.tsx
import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import './globals.css';
import ClientProviders from './ClientProviders';  // 새로 만든 클라이언트 컴포넌트

const notoSansKR = Noto_Sans_KR({
  variable: '--font-noto-sans-kr',
  subsets: ['latin'],
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: '묘운만세력',
  description: '당신의 운명을 찾아드립니다.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={notoSansKR.variable}>
      <body>
        {/* 클라이언트 전용 로직은 이 안으로 */}
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
