// js/lucky.js

import { state } from './state.js';
import { getYearGanZhi, getGanZhiIndex, getGanZhiByIndex } from './ganzi.js';
import { getMonthGanZhi, getDayGanZhi } from './ganzi.js';
import { getSolarTermBoundaries } from './solarTermCache.js';

// 하루 밀리초 상수
const oneDayMs = 24 * 60 * 60 * 1000;

/**
 * 생일부터 120년치 평균 일수/연/월/10년 계산
 */
export function get120YearAverages(birthDate) {
  const endDate = new Date(birthDate.getTime());
  endDate.setFullYear(endDate.getFullYear() + 120);
  const totalDays     = (endDate - birthDate) / oneDayMs;
  const averageYear   = totalDays / 120;
  const averageMonth  = averageYear / 12;
  const averageDecade = averageYear * 10;
  return { totalDays, averageYear, averageMonth, averageDecade };
}

/**
 * 일(day) 단위 값을 연/월/일/시/분/초로 변환
 */
export function convertDaysToYMDHMS(totalDays, avgYear, avgMonth) {
  const years   = Math.floor(totalDays / avgYear);
  let   rem     = totalDays - years * avgYear;
  const months  = Math.floor(rem / avgMonth);
  rem           -= months * avgMonth;
  const days    = Math.floor(rem);
  const fracDay = rem - days;
  const hours   = Math.floor(fracDay * 24);
  const minutes = Math.floor((fracDay * 24 - hours) * 60);
  const seconds = Math.floor((((fracDay * 24) - hours) * 60 - minutes) * 60);
  return { years, months, days, hours, minutes, seconds };
}

/**
 * 윤년 여부
 */
export function isLeapYear(year) {
  return (year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0);
}

/**
 * 해당 연도의 일수 (365 or 366)
 */
export function getDaysInYear(year) {
  return isLeapYear(year) ? 366 : 365;
}

/**
 * 소수점 형태의 출생 연도 (예: 2025.345)
 */
export function getDecimalBirthYear(birthDate) {
  const startOfYear = new Date(birthDate.getFullYear(), 0, 1);
  const diffDays    = (birthDate - startOfYear) / oneDayMs;
  const total       = getDaysInYear(birthDate.getFullYear());
  return birthDate.getFullYear() + diffDays / total;
}

/**
 * 성별·생시 기준 맞춤 월간지 계산
 */
export function computeCustomMonthPillar(correctedDate, gender) {
  const yearPillar = getYearGanZhi(correctedDate, correctedDate.getFullYear());
  const isYang     = ['갑','병','무','경','임'].includes(yearPillar.charAt(0));
  const forward    = (gender === '남' && isYang) || (gender === '여' && !isYang);

  const year  = correctedDate.getFullYear();
  const terms = getSolarTermBoundaries(year, state.selectedLon);

  let pointer = forward
    ? terms.findIndex(t => correctedDate < t.date)
    : terms.slice().reverse().findIndex(t => correctedDate >= t.date);

  if (!forward) {
    pointer = terms.length - 1 - pointer;
  }
  if (pointer < 0) pointer = 0;

  const sDates = terms.map(t => t.date);
  const pads   = [];
  pads[0] = getMonthGanZhi(correctedDate, state.selectedLon);

  for (let i = 1; i < sDates.length; i++) {
    const dt  = sDates[i];
    const hit = forward ? dt >= correctedDate : dt <= correctedDate;

    if (hit) {
      const prevIdx = getGanZhiIndex(pads[i - 1]);
      const nextIdx = forward
        ? (prevIdx + 1) % 60
        : (prevIdx + 59) % 60;
      pads[i] = getGanZhiByIndex(nextIdx);
      pointer = forward ? pointer + 1 : pointer - 1;
      if (pointer < 0) pointer = terms.length - 1;
      if (pointer >= terms.length) pointer = 0;
    } else {
      pads[i] = pads[i - 1];
    }
  }

  return pads[pointer];
}

/**
 * 대운 계산
 */
export function getDaewoonData(gender, originalDate, correctedDate) {
  const inputYear = correctedDate.getFullYear();

  // 세팅에 사용할 입춘 기준 연도 결정
  const ipChunForSet = getSolarTermBoundaries(inputYear, state.selectedLon)
    .find(t => t.name === '입춘').date;
  const effectiveYearForSet = (originalDate < ipChunForSet)
    ? inputYear - 1
    : inputYear;

  const yearPillar  = getYearGanZhi(correctedDate, effectiveYearForSet);
  const monthPillar = getMonthGanZhi(correctedDate, state.selectedLon);
  const isYang    = ['갑','병','무','경','임'].includes(yearPillar.charAt(0));
  const forward   = (gender === '남' && isYang) || (gender === '여' && !isYang);

  // 전후 년도 절기 모두 모아서 정렬
  const collect = y => getSolarTermBoundaries(y, state.selectedLon).map(t => t.date);
  const allDates = [
    ...collect(inputYear - 1),
    ...collect(inputYear),
    ...collect(inputYear + 1)
  ].sort((a, b) => a - b);

  // 대운 시작 경계일
  let boundaryDate;
  if (forward) {
    boundaryDate = allDates.find(d => d > correctedDate) || allDates[0];
  } else {
    const past = allDates.filter(d => d < correctedDate);
    boundaryDate = past[past.length - 1] || allDates[allDates.length - 1];
  }

  const diffDays    = Math.abs(boundaryDate - correctedDate) / oneDayMs;
  const baseDecimal = diffDays / 3;
  const baseYears   = Math.floor(baseDecimal);
  const baseMonths  = Math.floor((baseDecimal - baseYears) * 12);

  const stemChars        = state.Cheongan;
  const branchChars      = state.MONTH_ZHI;
  const monthStemIndex   = stemChars.indexOf(monthPillar.charAt(0));
  const monthBranchIndex = branchChars.indexOf(monthPillar.charAt(1));

  const list = [];
  for (let i = 0; i < 10; i++) {
    const ageOffset = baseYears + i * 10;
    const step      = i + 1;
    const nextStem  = forward
      ? (monthStemIndex   + step) % 10
      : (monthStemIndex   - step + 10) % 10;
    const nextBr    = forward
      ? (monthBranchIndex + step) % 12
      : (monthBranchIndex - step + 12) % 12;
    list.push({
      age:    ageOffset,
      stem:   stemChars[nextStem],
      branch: branchChars[nextBr]
    });
  }

  return {
    baseYears,
    baseMonths,
    baseDecimal,
    list,
    dayStemRef: getDayGanZhi(correctedDate).charAt(0)
  };
}

/**
 * 대운 문자열 포맷
 */
export function getDaewoonDataStr(gender, originalDate, correctedDate) {
  const data = getDaewoonData(gender, originalDate, correctedDate);
  const listStr = data.list
    .map(i => `${i.age}(${i.stem}${i.branch})`)
    .join(', ');
  return `대운수 ${data.baseDecimal.toFixed(2)}, 대운 나이 목록: ${listStr}`;
}
