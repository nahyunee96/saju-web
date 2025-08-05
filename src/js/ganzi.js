// js/ganzi.js

import { findSolarTermDate, getSolarTermBoundaries } from './solarTermCache.js';
import { parseLocalDate } from './dateUtils.js';
import { calendarGregorianToJD } from './astro.js';
import { toKoreanTime } from './timeUtils.js';
import { state } from './state.js';
import {
  Cheongan,
  Jiji,
  MONTH_ZHI,
  sexagenaryCycle,
  fixedDayMapping,
  fixedDayMappingBasic,
  timeRanges
} from './core.js';

/**
 * 연간지(年干支) 계산
 */
export function getYearGanZhi(dateObj, year) {
  const lichun = findSolarTermDate(year, 315, state.selectedLon);
  const actualYear = dateObj < lichun ? year - 1 : year;
  const idx = ((actualYear - 4) % 60 + 60) % 60;
  return sexagenaryCycle[idx];
}

/**
 * 월간지(月干支) 계산
 */
export function getMonthGanZhi(dateInput, cityLon, forceTzMeridian = null) {
  const tzMeridian = forceTzMeridian !== null
    ? forceTzMeridian
    : Math.round(cityLon / 15) * 15;
  let dateObj;
  if (typeof dateInput === 'string' || typeof dateInput === 'number') {
    dateObj = parseLocalDate(dateInput, tzMeridian);
  } else {
    const y = dateInput.getUTCFullYear();
    const M = dateInput.getUTCMonth() + 1;
    const d = dateInput.getUTCDate();
    const h = dateInput.getUTCHours();
    const m = dateInput.getUTCMinutes();
    const s = String(y).padStart(4,'0')
            + String(M).padStart(2,'0')
            + String(d).padStart(2,'0')
            + String(h).padStart(2,'0')
            + String(m).padStart(2,'0');
    dateObj = parseLocalDate(s, tzMeridian);
  }
  const yearNum = dateObj.getFullYear();
  const bounds = getSolarTermBoundaries(yearNum, cityLon);
  const lichun = bounds.find(t => t.name === '입춘');
  const calcYear = dateObj < lichun.date ? yearNum - 1 : yearNum;

  let monthTerms = getSolarTermBoundaries(calcYear, cityLon)
    .slice(getSolarTermBoundaries(calcYear, cityLon)
      .findIndex(t => t.name === '입춘'), 12);
  if (monthTerms.length < 12) {
    monthTerms = monthTerms.concat(
      getSolarTermBoundaries(calcYear + 1, cityLon)
        .slice(0, 12 - monthTerms.length)
    );
  }

  const monthNumber = monthTerms.filter(t => dateObj >= t.date).length || 12;
  const yearGZ = getYearGanZhi(dateObj, calcYear);
  const yStem = yearGZ.charAt(0);
  const yIdx = Cheongan.indexOf(yStem) + 1;
  const mStemIdx = ((yIdx * 2) + monthNumber - 1) % 10;
  const mStem = Cheongan[mStemIdx];
  const mBranch = MONTH_ZHI[monthNumber - 1];

  return mStem + mBranch;
}

/**
 * 일간지(日干支) 계산
 */
export function getDayGanZhi(dateObj) {
  const y = dateObj.getFullYear();
  const M = dateObj.getMonth() + 1;
  const d = dateObj.getDate();
  const h = dateObj.getHours();
  const m = dateObj.getMinutes();
  const jd = calendarGregorianToJD(y, M, d, h, m);
  const idx = Math.floor(jd) + 50;
  return sexagenaryCycle[idx % 60];
}

/**
 * 지지(時支) 인덱스 계산
 */
export function getHourBranchIndex(dateObj) {
  let totalMin = dateObj.getHours() * 60 + dateObj.getMinutes();
  const ZASI_START = 23 * 60;
  if (totalMin < ZASI_START) totalMin += 1440;
  return Math.floor((totalMin - ZASI_START) / 120) % 12;
}

/**
 * 지지(時支) 문자열 계산: timeRanges 배열 사용
 */
export function getHourBranchUsingArray(dateObj) {
  if (!(dateObj instanceof Date)) dateObj = new Date(dateObj);
  const totalMin = dateObj.getHours() * 60 + dateObj.getMinutes();
  for (const { branch, start, end } of timeRanges) {
    if (start < end) {
      if (totalMin >= start && totalMin < end) return branch;
    } else {
      if (totalMin >= start || totalMin < end) return branch;
    }
  }
  return null;
}

/**
 * 시간간(時干) 계산
 */
export function getHourStem(dayPillar, hourBranchIndex) {
  const dayStem = dayPillar.charAt(0);
  if (fixedDayMapping[dayStem]) {
    const arr = fixedDayMapping[dayStem];
    if (arr.length === 12 && hourBranchIndex >= 0 && hourBranchIndex < 12) {
      return arr[hourBranchIndex].charAt(0);
    }
  }
  const stemIdx = Cheongan.indexOf(dayStem);
  const offset = (stemIdx % 2 === 0) ? 0 : 2;
  return Cheongan[(stemIdx * 2 + hourBranchIndex + offset) % 10];
}

/**
 * 천간·지지 분리
 */
export function splitPillar(pillar) {
  return pillar && pillar.length >= 2
    ? { gan: pillar.charAt(0), ji: pillar.charAt(1) }
    : { gan: '-', ji: '-' };
}

/**
 * 유효 세트 기준 연도 계산 (입춘 기준)
 */
export function getEffectiveYearForSet(dateObj) {
  if (!(dateObj instanceof Date)) dateObj = new Date(dateObj);
  const ipChun = findSolarTermDate(dateObj.getFullYear(), 315, state.selectedLon);
  return dateObj < ipChun ? dateObj.getFullYear() - 1 : dateObj.getFullYear();
}

/**
 * 간지 인덱스 ↔ 문자열 변환 헬퍼
 */
export function getGanZhiIndex(ganZhi) {
  return sexagenaryCycle.indexOf(ganZhi);
}
export function getGanZhiByIndex(idx) {
  return sexagenaryCycle[idx % 60];
}

// js/refGanzhi.js

/**
 * 인덱스로 간지 변환
 */
export function toGz(idx) {
  idx = ((idx % 60) + 60) % 60;
  const stem   = Cheongan[idx % 10];
  const branch = Jiji[idx % 12];
  return stem + branch;
}

/**
 * 기준 연간지 계산 (입춘 기준)
 */
export function getYearGanZhiRef(dateObj) {
  const solarYear = dateObj.getFullYear();
  const ipChun    = findSolarTermDate(solarYear, 315);
  const ganZhiYear = dateObj < ipChun ? solarYear - 1 : solarYear;
  const idx = (ganZhiYear - 4) % 60;
  return toGz(idx);
}

/**
 * 기준 월간지 계산 (127° 경도)
 */
export function getMonthGanZhiRef(dateObj) {
  const boundaries = getSolarTermBoundaries(dateObj.getFullYear(), 127);
  const monthNo    = boundaries.findIndex((b, i, arr) => dateObj < arr[i+1]?.date) + 1 || 12;
  const yearIdx    = Cheongan.indexOf(getYearGanZhi(dateObj, dateObj.getFullYear())[0]);
  const branchIdx  = (monthNo + 1) % 12;
  const stemIdx    = (yearIdx * 2 + branchIdx) % 10;
  return Cheongan[stemIdx] + Jiji[branchIdx];
}

/**
 * 기준 일간지 계산 (시기별 경계 적용)
 */
export function getDayGanZhiRef(dateObj) {
  const kstDate = toKoreanTime(dateObj);
  const hour    = kstDate.getHours();
  const adj     = new Date(kstDate);

  if (document.getElementById("jasi").checked) {
    if (hour < 23) adj.setDate(adj.getDate() - 1);
    adj.setHours(23,0,0,0);
  } else if (document.getElementById("yajasi").checked) {
    adj.setHours(0,0,0,0);
  } else if (document.getElementById("insi").checked) {
    if (hour < 3) adj.setDate(adj.getDate() - 1);
    adj.setHours(3,0,0,0);
  }

  const dayGz = getDayGanZhi(adj);
  const { gan, ji } = splitPillar(dayGz);
  return gan + ji;
}

/**
 * 보조 시간간 계산 (기본 매핑 사용)
 */
export function getHourStem2(dayGan, hourBranchIndex) {
  const stemIdx = Cheongan.indexOf(dayGan);
  if (fixedDayMappingBasic[dayGan] && hourBranchIndex < 12) {
    return fixedDayMappingBasic[dayGan][hourBranchIndex].charAt(0);
  }
  const offset = (stemIdx % 2 === 0 ? 0 : 2);
  return Cheongan[(stemIdx * 2 + hourBranchIndex + offset) % 10];
}

/**
 * 기준 시간간지 계산
 */
export function getHourGanZhiRef(dateObj) {
  const branch = getHourBranchUsingArray(dateObj);
  const idx    = Jiji.indexOf(branch);
  const dayGz  = getDayGanZhiRef(dateObj).charAt(0);
  const stem   = getHourStem2(dayGz, idx);
  return stem + branch;
}

/**
 * YYYYMMDDHHmm Date 객체로부터 기준 사주(연·월·일·시) 계산
 */
export function calcGanzhi(dateObj) {
  const kst = toKoreanTime(dateObj);
  return {
    y: getYearGanZhiRef(kst),
    m: getMonthGanZhiRef(kst),
    d: getDayGanZhiRef(kst),
    h: getHourGanZhiRef(dateObj)
  };
}


