// app/providers/DrawerProvider.tsx
'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DrawerContextValue {
  open: boolean;
  content: ReactNode | null;
  openDrawer: (node: ReactNode) => void;
  closeDrawer: () => void;
}

const DrawerContext = createContext<DrawerContextValue | null>(null);

export function DrawerProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState<ReactNode | null>(null);

  const openDrawer = (node: ReactNode) => {
    setContent(node);
    setOpen(true);
  };
  const closeDrawer = () => {
    setOpen(false);
    // optional: setContent(null);
  };

  return (
    <DrawerContext.Provider value={{ open, content, openDrawer, closeDrawer }}>
      {children}
    </DrawerContext.Provider>
  );
}

// 훅으로 꺼내쓰기
export function useDrawer() {
  const ctx = useContext(DrawerContext);
  if (!ctx) {
    throw new Error('useDrawer must be used within DrawerProvider');
  }
  return ctx;
}
