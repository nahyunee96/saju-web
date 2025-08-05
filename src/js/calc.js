// calc.js
import { getSolarTermBoundaries } from './astro.js';
import { getYearGanZhi, getMonthGanZhi, getGanZhiIndex } from './ganzi.js';
import { sexagenaryCycle } from './core.js';

export function parseBirthAsUTC(Y, M, D, h, m) {
  return new Date(Date.UTC(Y, M - 1, D, h, m));
}

// 날짜 상수
export const ONE_DAY_MS = 24 * 60 * 60 * 1000;

// 1. 120년 평균값 구하기 (총일수, 평균연, 평균월, 평균10년)
export function get120YearAverages(birthDate) {
  const endDate = new Date(birthDate.getTime());
  endDate.setFullYear(endDate.getFullYear() + 120);
  const totalDays = (endDate - birthDate) / ONE_DAY_MS;
  const averageYear = totalDays / 120;
  const averageMonth = averageYear / 12;
  const averageDecade = averageYear * 10;
  return { totalDays, averageYear, averageMonth, averageDecade };
}

// 2. 일수 → 년월일시분초 변환 (평균기준)
export function convertDaysToYMDHMS(totalDays, avgYear, avgMonth) {
  const years = Math.floor(totalDays / avgYear);
  let remainderDays = totalDays - years * avgYear;
  const months = Math.floor(remainderDays / avgMonth);
  remainderDays -= months * avgMonth;
  const days = Math.floor(remainderDays);
  const fractionDay = remainderDays - days;
  const hours = Math.floor(fractionDay * 24);
  const minutes = Math.floor((fractionDay * 24 - hours) * 60);
  const seconds = Math.floor((((fractionDay * 24) - hours) * 60 - minutes) * 60);
  return { years, months, days, hours, minutes, seconds };
}

// 3. 윤년 판별
export function isLeapYear(year) {
  return (year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0);
}

// 4. 해당 연도 총일수
export function getDaysInYear(year) {
  return isLeapYear(year) ? 366 : 365;
}

// 5. 날짜의 소수점 연도 (ex: 1995.56)
export function getDecimalBirthYear(birthDate) {
  const startOfYear = new Date(birthDate.getFullYear(), 0, 1);
  const diffDays = (birthDate - startOfYear) / ONE_DAY_MS;
  const totalDays = getDaysInYear(birthDate.getFullYear());
  return birthDate.getFullYear() + diffDays / totalDays;
}

// 6. 커스텀 월주(월간지) 계산 (실험용, ‘pointer’ 방식)
// 1. 방향 결정 (음양, 성별)
export function isForwardDirection(yearPillar, gender) {
  const isYang = ["갑","병","무","경","임"].includes(yearPillar.charAt(0));
  return (gender === "남" && isYang) || (gender === "여" && !isYang);
}

// 2. 월간지 배열 생성
export function generateMonthPillarsArray(startDate, solarTerms, isForward, getMonthGanZhi, getGanZhiIndex) {
  const mPillars = [];
  mPillars[0] = getMonthGanZhi(startDate);
  const sDates = solarTerms.map(t => t.date);
  for (let i = 1; i < sDates.length; i++) {
    const prevIdx = getGanZhiIndex(mPillars[i - 1]);
    const nextIdx = isForward
      ? (prevIdx + 1) % 60
      : (prevIdx + 59) % 60;
    mPillars[i] = getMonthGanZhiByIndex(nextIdx);
  }
  return mPillars;
}
export function getMonthGanZhiByIndex(idx) {
  return sexagenaryCycle[(idx + 60) % 60];
}

// 3. 포인터 위치 결정
export function getPointerByDirection(correctedDate, solarTerms, isForward) {
  if (isForward) {
    const idx = solarTerms.findIndex(t => t.date >= correctedDate);
    return idx < 0 ? 0 : idx;
  } else {
    const revIdx = solarTerms.slice().reverse().findIndex(t => t.date <= correctedDate);
    const pointer = revIdx < 0 ? 0 : solarTerms.length - 1 - revIdx;
    return pointer;
  }
}

// 4. 최종 컨트롤러
export function computeCustomMonthPillar(
  correctedDate,
  gender,
  selectedLon
) {
  const yearPillar = getYearGanZhi(correctedDate, correctedDate.getFullYear());
  const isForward  = isForwardDirection(yearPillar, gender);

  const solarTerms = getSolarTermBoundaries(correctedDate.getFullYear(), selectedLon);

  const mPillars = generateMonthPillarsArray(
    correctedDate,
    solarTerms,
    isForward,
    getMonthGanZhi,
    getGanZhiIndex
  );
  const pointer = getPointerByDirection(correctedDate, solarTerms, isForward);

  return mPillars[pointer];
}

