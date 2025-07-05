// app/layout.tsx
import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import './globals.css';
import ClientHeader from './components/ClientHeader';
import GlobalDrawer from './components/GlobalDrawer';
import { DrawerProvider } from './providers/DrawerProvider';
import Footer from './components/Footer';

const notoSansKR = Noto_Sans_KR({
  variable: '--font-noto-sans-kr',
  subsets: ['latin'],
  weight: ['400','700'],
});

export const metadata: Metadata = {
  title: "묘운만세력",
  description: "당신의 운명을 찾아드립니다.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={notoSansKR.variable}>
      <body>
        {/* 헤더는 클라이언트 컴포넌트로 분리해서 여기서만 렌더링 */}
        <DrawerProvider>
          <ClientHeader />
          <main>{children}</main>
          <GlobalDrawer />
          <Footer />
        </DrawerProvider>
      </body>
    </html>
  );
}