// app/entry/EntryDrawer.tsx
'use client';
import React from 'react';
import EntryForm from './EntryForm';

interface EntryDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function EntryDrawer({ open, onClose }: EntryDrawerProps) {
  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col justify-end transition-transform duration-300
        ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
    >
      {/* 백드롭 */}
      <div
        className={`absolute inset-0 bg-black bg-opacity-50 transition-opacity
          ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* 드로어 시트 */}
      <div
        className={`relative max-w-3xl w-full mx-auto bg-white rounded-t-2xl py-3 px-2 md:p-4 shadow-xl h-[80vh] overflow-auto
          transform transition-transform duration-300
          ${open ? 'translate-y-0' : 'translate-y-full'}`}
      >
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">새 명식 입력</h2>
          <button onClick={onClose} className="text-lg">✕</button>
        </div>

        {/* 입력 폼 */}
        <EntryForm onSubmit={(data) => {
          // TODO: Next.js API 호출
          console.log(data);
          onClose();
        }} />
      </div>
    </div>
  );
}
