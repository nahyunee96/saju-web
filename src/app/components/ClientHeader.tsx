'use client';
import React, { useState } from 'react';
import { SquareMenu, UserPlus, Settings } from 'lucide-react';
import EntryDrawer from '../entry/EntryDrawer';

export default function ClientHeader() {
  const [isEntryOpen, setEntryOpen] = useState(false);

  return (
    <>
      <header className="fixed w-full h-12 md:h-16 z-50 bg-[#011627] border-b border-[#EED36C]">
        <div className="max-w-3xl mx-auto h-full flex justify-between items-center px-2 md:px-4">
          <button id="userListViewBtn" className="cursor-pointer">
            <SquareMenu color="#EED36C" />
          </button>
          <div className="flex items-center gap-2">
            <button
              id="newUserPlusBtn"
              className="cursor-pointer"
              onClick={() => setEntryOpen(true)}
            >
              <UserPlus color="#EED36C" />
            </button>
            <button id="settingViewBtn" className="cursor-pointer">
              <Settings color="#EED36C" />
            </button>
          </div>
        </div>
      </header>

      {/* 하단 드로어 */}
      <EntryDrawer open={isEntryOpen} onClose={() => setEntryOpen(false)} />
    </>
  );
}