// app/providers/DrawerProvider.tsx
'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DrawerContextType {
  open: boolean;
  content: ReactNode | null;
  openDrawer: (content: ReactNode) => void;
  closeDrawer: () => void;
}

const DrawerContext = createContext<DrawerContextType | undefined>(
  undefined
);

export function DrawerProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState<ReactNode | null>(null);

  const openDrawer = (drawerContent: ReactNode) => {
    setContent(drawerContent);
    setOpen(true);
  };
  const closeDrawer = () => {
    setOpen(false);
    setContent(null);
  };

  return (
    <DrawerContext.Provider
      value={{ open, content, openDrawer, closeDrawer }}
    >
      {children}
    </DrawerContext.Provider>
  );
}

export function useDrawer() {
  const ctx = useContext(DrawerContext);
  if (!ctx) throw new Error('useDrawer must be used within DrawerProvider');
  return ctx;
}
