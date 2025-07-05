'use client';
import React from 'react';
import { useCurrentGanzi } from '../hooks/useCurrentGanzi';
import PillarCard from './pillarCard';

export default function TodayGanziWidget() {
  const data = useCurrentGanzi();
  if (!data) return <p>로딩 중…</p>;

  const labels = ['시주', '일주', '월주', '연주'] as const;
  const keys = ['hour', 'day', 'month', 'year'] as const;

  return (
    <ul className="grid grid-cols-4 gap-2 w-full text-xl">
      {keys.map((k, idx) => (
        <PillarCard
          key={k}
          label={labels[idx]}
          data={data[k]!}
          index={idx + 1}
        />
      ))}
    </ul>
  );
}