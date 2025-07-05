// lib/ganzi.ts
import { getJDFromDate } from './astronomy';
import { getSunLongitude } from './astronomy';
import type { Pillar } from './types/ganzi';

// 천간(10)과 지지(12) 상수 정의
const HEAVENLY_STEMS: Array<{ hanja: string; hanguel: string }> = [
  { hanja: '甲', hanguel: '갑목' },
  { hanja: '乙', hanguel: '을목' },
  { hanja: '丙', hanguel: '병화' },
  { hanja: '丁', hanguel: '정화' },
  { hanja: '戊', hanguel: '무토' },
  { hanja: '己', hanguel: '기토' },
  { hanja: '庚', hanguel: '경금' },
  { hanja: '辛', hanguel: '신금' },
  { hanja: '壬', hanguel: '임수' },
  { hanja: '癸', hanguel: '계수' },
];
const EARTHLY_BRANCHES: Array<{ hanja: string; hanguel: string }> = [
  { hanja: '子', hanguel: '자수' },
  { hanja: '丑', hanguel: '축토' },
  { hanja: '寅', hanguel: '인목' },
  { hanja: '卯', hanguel: '묘목' },
  { hanja: '辰', hanguel: '진토' },
  { hanja: '巳', hanguel: '사화' },
  { hanja: '午', hanguel: '오화' },
  { hanja: '未', hanguel: '미토' },
  { hanja: '申', hanguel: '신금' },
  { hanja: '酉', hanguel: '유금' },
  { hanja: '戌', hanguel: '술토' },
  { hanja: '亥', hanguel: '해수' },
];

// 시각(시간)→지지 매핑 (24시간제)
const HOUR_BRANCH_MAP: Array<{ from: number; to: number; idx: number }> = [
  { from: 23, to: 1, idx: 0 },   // 子
  { from: 1, to: 3, idx: 1 },    // 丑
  { from: 3, to: 5, idx: 2 },    // 寅
  { from: 5, to: 7, idx: 3 },    // 卯
  { from: 7, to: 9, idx: 4 },    // 辰
  { from: 9, to: 11, idx: 5 },   // 巳
  { from: 11, to: 13, idx: 6 },  // 午
  { from: 13, to: 15, idx: 7 },  // 未
  { from: 15, to: 17, idx: 8 },  // 申
  { from: 17, to: 19, idx: 9 },  // 酉
  { from: 19, to: 21, idx: 10 }, // 戌
  { from: 21, to: 23, idx: 11 }, // 亥
];
function getHourBranchIndex(hour: number): number {
  for (const m of HOUR_BRANCH_MAP) {
    if (m.from > m.to) {
      if (hour >= m.from || hour < m.to) return m.idx;
    } else {
      if (hour >= m.from && hour < m.to) return m.idx;
    }
  }
  return 0;
}

/**
 * 연기둥 계산
 * 연도 - 4를 기준으로 10간/12지 순환
 */
export function getYearPillar(date: Date): Pillar {
  const y = date.getFullYear();
  const stemIdx = ((y - 4) % 10 + 10) % 10;
  const branchIdx = ((y - 4) % 12 + 12) % 12;
  return {
    stem: HEAVENLY_STEMS[stemIdx],
    branch: EARTHLY_BRANCHES[branchIdx],
  };
}

/**
 * 월기둥 계산
 * 절기 기준 태양 황경을 이용해 0~11월 매핑
 */
export function getMonthPillar(date: Date): Pillar {
  const jd = getJDFromDate(date);
  const lon = getSunLongitude(jd);
  // solar longitude +30도 → 0~360 매핑 후 30도로 나눠 월 번호(0~11)
  const monthNo = Math.floor(((lon + 30) % 360) / 30);
  // 지지: 寅=2번 인덱스부터 시작 → 오프셋 +2
  const branchIdx = (monthNo + 2) % 12;
  // 연간 기둥 스템 인덱스
  const yearStemIdx = ((date.getFullYear() - 4) % 10 + 10) % 10;
  // 월 스템: 연간*2 + 지지 인덱스
  const stemIdx = (yearStemIdx * 2 + branchIdx) % 10;
  return {
    stem: HEAVENLY_STEMS[stemIdx],
    branch: EARTHLY_BRANCHES[branchIdx],
  };
}

/**
 * 일기둥 계산
 * JD+0.5 → 정수일 기준 甲子 기준점 오프셋 +49 사용
 */
export function getDayPillar(date: Date): Pillar {
  const jd = getJDFromDate(date);
  const dayCount = Math.floor(jd + 0.5);
  const idx60 = (dayCount + 49) % 60;
  const stemIdx = idx60 % 10;
  const branchIdx = idx60 % 12;
  return {
    stem: HEAVENLY_STEMS[stemIdx],
    branch: EARTHLY_BRANCHES[branchIdx],
  };
}

/**
 * 시기둥 계산
 * 일간 스템과 시간 지지 인덱스 사용
 */
export function getHourPillar(date: Date): Pillar {
  const day = getDayPillar(date);
  const dayStemIdx = HEAVENLY_STEMS.findIndex(
    s => s.hanja === day.stem.hanja
  );
  const hrIdx = getHourBranchIndex(date.getHours());
  const stemIdx = (dayStemIdx * 2 + hrIdx) % 10;
  return {
    stem: HEAVENLY_STEMS[stemIdx],
    branch: EARTHLY_BRANCHES[hrIdx],
  };
}

/**
 * 네 기둥(연·월·일·시) 한꺼번에 반환
 */
export function getFourPillars(date: Date): {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar;
} {
  return {
    year: getYearPillar(date),
    month: getMonthPillar(date),
    day: getDayPillar(date),
    hour: getHourPillar(date),
  };
}
