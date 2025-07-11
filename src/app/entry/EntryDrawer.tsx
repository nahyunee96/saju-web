// app/entry/EntryDrawer.tsx
'use client';
import React from 'react';
import { Drawer } from '../components/Drawer';
import EntryForm from './EntryForm';
import type { EntryData } from './types';

export interface EntryDrawerProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: EntryData) => void;
}

export default function EntryDrawer({
  open,
  onClose,
  onSubmit,
}: EntryDrawerProps) {
  const handleFormSubmit = (form: Parameters<typeof EntryForm>[0]['onSubmit'][0]) => {
    // EntryFormValues → EntryData 매핑
    const data: EntryData = {
      ...form,
      isTimeUnknown: form.birthTime === '',
      isPlaceUnknown: form.birthPlace === '',
    };
    onSubmit(data);
    onClose();
  };

  return (
    <Drawer open={open} onClose={onClose}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">새 명식 입력</h2>
        <button onClick={onClose} className="text-lg">
          ✕
        </button>
      </div>
      <EntryForm onSubmit={handleFormSubmit} />
    </Drawer>
  );
}
