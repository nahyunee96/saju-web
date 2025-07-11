// app/components/ClientHeader.tsx
'use client';
import React from 'react';
import { SquareMenu, UserPlus, Settings } from 'lucide-react';

export interface ClientHeaderProps {
  onOpenEntry: () => void;
  onOpenUserList: () => void;
  onOpenSettings: () => void;
}

export default function ClientHeader({
  onOpenEntry,
  onOpenUserList,
  onOpenSettings,
}: ClientHeaderProps) {
  return (
    <header className="fixed w-full h-12 md:h-16 z-50 bg-[#011627] border-b border-[#EED36C]">
      <div className="max-w-3xl mx-auto h-full flex justify-between items-center px-2 md:px-4">
        <button
          id="userListViewBtn"
          className="cursor-pointer"
          onClick={onOpenUserList}
        >
          <SquareMenu color="#EED36C" />
        </button>
        <div className="flex items-center gap-2">
          <button
            id="newUserPlusBtn"
            className="cursor-pointer"
            onClick={onOpenEntry}
          >
            <UserPlus color="#EED36C" />
          </button>
          <button
            id="settingViewBtn"
            className="cursor-pointer"
            onClick={onOpenSettings}
          >
            <Settings color="#EED36C" />
          </button>
        </div>
      </div>
    </header>
  );
}
