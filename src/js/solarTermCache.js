import {
  findSolarTermDate as _findSolarTermDateRaw,
  getSolarTermBoundaries as _getSolarTermBoundariesRaw
} from './astro.js';

let solarTermCache = new Map();
let solarBoundariesCache = new Map();

/**
 * 절기 캐시 삭제
 */
export function clearSolarTermCache() {
  solarTermCache.clear();
  solarBoundariesCache.clear();
  console.log('🗑️ 절기 캐시 삭제');
}

/**
 * 캐시 적용된 절기 날짜 계산
 * @param {number} year - 연도
 * @param {number} deg  - 절기 각도
 * @param {number} lon  - 표준경도 (기본 135°)
 * @returns {Date}
 */
export function findSolarTermDate(year, deg, lon = 135) {
  const key = `${year}-${deg}-${Math.round(lon * 10)}`;
  if (solarTermCache.has(key)) {
    return new Date(solarTermCache.get(key));
  }
  const res = _findSolarTermDateRaw(year, deg, lon);
  solarTermCache.set(key, res);
  return new Date(res);
}

/**
 * 캐시 적용된 절기 경계 리스트 계산
 * @param {number} year - 연도
 * @param {number} lon  - 표준경도 (기본 135°)
 * @returns {{ name: string, date: Date }[]}
 */
export function getSolarTermBoundaries(year, lon = 135) {
  const key = `${year}-${Math.round(lon * 10)}`;
  if (solarBoundariesCache.has(key)) {
    return solarBoundariesCache
      .get(key)
      .map(t => ({ name: t.name, date: new Date(t.date) }));
  }
  const res = _getSolarTermBoundariesRaw(year, lon);
  solarBoundariesCache.set(
    key,
    res.map(t => ({ name: t.name, date: t.date }))
  );
  return res.map(t => ({ name: t.name, date: new Date(t.date) }));
}
