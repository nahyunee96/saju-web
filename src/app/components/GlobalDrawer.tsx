// app/components/GlobalDrawer.tsx
'use client';
import React from 'react';
import { useDrawer } from '../providers/DrawerProvider';
import { Drawer } from './Drawer';

export default function GlobalDrawer() {
  const { open, content, closeDrawer } = useDrawer();
  return (
    <Drawer open={open} onClose={closeDrawer}>
      {content}
    </Drawer>
  );
}
