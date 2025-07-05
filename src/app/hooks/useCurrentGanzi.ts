import { useState, useEffect } from 'react';
import { getFourPillars } from '../lib/ganzi';
import type { Pillar } from '../lib/types/ganzi';

/**
 * 현재 시점의 4기둥(연·월·일·시)을 계산해 반환하는 훅
 */
export function useCurrentGanzi() {
  const [data, setData] = useState<{
    year: Pillar;
    month: Pillar;
    day: Pillar;
    hour: Pillar;
  } | null>(null);

  useEffect(() => {
    const now = new Date();
    setData(getFourPillars(now));
  }, []);

  return data;
}