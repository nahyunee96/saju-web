// app/components/Drawer.tsx
'use client';
import React from 'react';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Drawer({ open, onClose, children }: DrawerProps) {
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
        onClick={onClose}
      />
      {/* 드로어 시트 */}
      <div
        className={`relative bg-white rounded-t-2xl p-4 shadow-xl transition-transform duration-300 ${
          open ? 'translate-y-0' : 'translate-y-full'
        } h-9/10 overflow-auto`}
      >
        {children}
      </div>
    </div>
  );
}
