// app/components/GlobalDrawer.tsx
'use client';
import React from 'react';
import { useDrawer } from '../providers/DrawerProvider';

export default function GlobalDrawer() {
  const { open, content, closeDrawer } = useDrawer();
  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col justify-end transition-all ${
        open ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      {/* 백드롭 */}
      <div
        className={`absolute inset-0 bg-black bg-opacity-50 transition-opacity ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={closeDrawer}
      />

      {/* 드로어 시트 */}
      <div
        className={`relative bg-white rounded-t-2xl p-4 shadow-xl transition-transform duration-300 ${
          open ? 'translate-y-0' : 'translate-y-full'
        } h-4/5 overflow-auto`}
      >
        {content}
      </div>
    </div>
  );
}
