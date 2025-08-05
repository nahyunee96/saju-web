// js/dateUtils.js
import { getEquationOfTime } from './astro.js';

/**
 * UTC 기준으로 Date 객체 생성
 * @param {number} Y - 연도
 * @param {number} M - 월 (1~12)
 * @param {number} D - 일
 * @param {number} h - 시
 * @param {number} m - 분
 * @returns {Date}
 */
export function parseBirthAsUTC(Y, M, D, h, m) {
  return new Date(Date.UTC(Y, M - 1, D, h, m));
}

/**
 * 현지 시각 문자열/숫자를 Date 객체로 변환
 * @param {string|number} input - 'yyyyMMddHHmm' 형식
 * @param {number} regionLon    - 표준경도 (deg)
 * @returns {Date}
 */
export function parseLocalDate(input, regionLon = 135) {
  const s = input.toString().padStart(12, '0');
  const y = +s.slice(0, 4),
        M = +s.slice(4, 6),
        d = +s.slice(6, 8),
        h = +s.slice(8, 10),
        m = +s.slice(10, 12);
  const tzMs = (regionLon / 15) * 3600 * 1000;
  const utcTs = Date.UTC(y, M - 1, d, h, m);
  return new Date(utcTs - tzMs);
}

/**
 * 경도(cityLon) 및 균시차 보정 적용한 출생 일시 계산
 * @param {Date} dateObj 
 * @param {number|null} cityLon 
 * @param {boolean} isPlaceUnknown 
 * @returns {Date}
 */
export function adjustBirthDateWithLon(dateObj, cityLon, isPlaceUnknown = false) {
  if (isPlaceUnknown || cityLon == null) {
    return new Date(dateObj.getTime() - 30 * 60_000);
  }
  const stdLon = (cityLon >= 120 && cityLon <= 135)
    ? 135
    : Math.round(cityLon / 15) * 15;
  const lonCorrMin = (cityLon - stdLon) * 4;
  const eqTimeMin  = getEquationOfTime(dateObj);
  return new Date(dateObj.getTime() + (lonCorrMin + eqTimeMin) * 60_000);
}
