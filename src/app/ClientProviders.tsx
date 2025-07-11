// app/ClientProviders.tsx
'use client';

import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { DrawerProvider } from './providers/DrawerProvider';
import ClientHeader from './components/ClientHeader';
import EntryDrawer from './entry/EntryDrawer';
import GlobalDrawer from './components/GlobalDrawer';
import Footer from './components/Footer';
import type { EntryData } from './entry/types';

type Props = { children: ReactNode };

export default function ClientProviders({ children }: Props) {
  const [isEntryOpen, setEntryOpen] = useState(false);

  const handleEntrySubmit = async (data: EntryData) => {
    // TODO: Next.js API 호출
    console.log('API로 보낼 데이터:', data);
  };

  return (
    <DrawerProvider>
      <ClientHeader
        onOpenEntry={() => setEntryOpen(true)}
        onOpenUserList={() => {
          /* 유저 리스트 토글 */
        }}
        onOpenSettings={() => {
          /* 설정 창 토글 */
        }}
      />

      <main>{children}</main>

      <EntryDrawer
        open={isEntryOpen}
        onClose={() => setEntryOpen(false)}
        onSubmit={handleEntrySubmit}
      />

      <GlobalDrawer />
      <Footer />
    </DrawerProvider>
  );
}
