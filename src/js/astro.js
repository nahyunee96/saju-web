// js/solarTerm.js

/**
 * 한국의 과거 서머타임(Daylight Saving Time) 적용 구간 반환
 * @param {number} year - 연도 (예: 1950)
 * @returns {{ start: Date, end: Date } | null}
 */
export function getSummerTimeInterval(year) {
  switch (year) {
    case 1948:
      return { start: new Date(1948, 5, 1, 0, 0), end: new Date(1948, 8, 13, 0, 0) };
    case 1949:
      return { start: new Date(1949, 3, 3, 0, 0), end: new Date(1949, 8, 11, 0, 0) };
    case 1950:
      return { start: new Date(1950, 3, 1, 0, 0), end: new Date(1950, 8, 10, 0, 0) };
    case 1951:
      return { start: new Date(1951, 4, 6, 0, 0), end: new Date(1951, 8, 9, 0, 0) };
    case 1955:
      return { start: new Date(1955, 4, 5, 0, 0), end: new Date(1955, 8, 9, 0, 0) };
    case 1956:
      return { start: new Date(1956, 4, 20, 0, 0), end: new Date(1956, 8, 30, 0, 0) };
    case 1957:
      return { start: new Date(1957, 4, 5, 0, 0), end: new Date(1957, 8, 22, 0, 0) };
    case 1958:
      return { start: new Date(1958, 4, 4, 0, 0), end: new Date(1958, 8, 21, 0, 0) };
    case 1959:
      return { start: new Date(1959, 4, 3, 0, 0), end: new Date(1959, 8, 20, 0, 0) };
    case 1960:
      return { start: new Date(1960, 4, 1, 0, 0), end: new Date(1960, 8, 18, 0, 0) };
    case 1987:
      return { start: new Date(1987, 4, 10, 0, 0), end: new Date(1987, 9, 11, 0, 0) };
    case 1988:
      return { start: new Date(1988, 4, 8, 0, 0), end: new Date(1988, 9, 9, 0, 0) };
    default:
      return null;
  }
}

/**
 * 균시차(Equation of Time) 계산
 * @param {Date} dateObj - 대상 날짜
 * @returns {number} 보정 분(minute) 값
 */
export function getEquationOfTime(dateObj) {
  const start = new Date(dateObj.getFullYear(), 0, 0);
  const N = Math.floor((dateObj - start) / (1000 * 60 * 60 * 24));
  const B = ((360 / 365) * (N - 81)) * Math.PI / 180;
  return 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
}

/**
 * 그레고리력 날짜를 율리우스 일수(JD)로 변환
 * @param {number} year - 연도
 * @param {number} month - 월 (1~12)
 * @param {number} day - 일
 * @param {number} [hour=0] - 시
 * @param {number} [minute=0] - 분
 * @returns {number} 율리우스 일수
 */
export function calendarGregorianToJD(year, month, day, hour = 0, minute = 0) {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const a = Math.floor(year / 100);
  const b = 2 - a + Math.floor(a / 4);
  const fractionalDay = day + (hour + minute / 60) / 24;
  return Math.floor(365.25 * (year + 4716))
       + Math.floor(30.6001 * (month + 1))
       + fractionalDay + b - 1524.5;
}

/**
 * 율리우스 일수(JD)를 그레고리력 날짜로 변환
 * @param {number} jd - 율리우스 일수
 * @returns {[number, number, number]} [연도, 월, 일.소수]
 */
export function jdToCalendarGregorian(jd) {
  const z = Math.floor(jd + 0.5);
  const f = jd + 0.5 - z;
  let a = z;
  if (z >= 2299161) {
    const alpha = Math.floor((z - 1867216.25) / 36524.25);
    a = z + 1 + alpha - Math.floor(alpha / 4);
  }
  const b = a + 1524;
  const c = Math.floor((b - 122.1) / 365.25);
  const d = Math.floor(365.25 * c);
  const e = Math.floor((b - d) / 30.6001);

  const day = b - d - Math.floor(30.6001 * e) + f;
  let month = e - 1;
  if (month > 12) month -= 12;
  let year = c - 4715;
  if (month > 2) year -= 1;

  return [year, month, day];
}

/**
 * Date 객체로부터 JD 계산 (그레고리력 변환 래퍼)
 * @param {Date} dateObj
 * @returns {number}
 */
export function getJDFromDate(dateObj) {
  return calendarGregorianToJD(
    dateObj.getFullYear(),
    dateObj.getMonth() + 1,
    dateObj.getDate(),
    dateObj.getHours(),
    dateObj.getMinutes()
  );
}

/**
 * 태양의 황경(Longitude) 계산 (deg)
 * @param {number} jd - 율리우스 일수
 * @returns {number} 태양 황경 (0~360)
 */
export function getSunLongitude(jd) {
  const t = (jd - 2451545.0) / 36525;
  let L0 = (280.46646 + 36000.76983 * t + 0.0003032 * t * t) % 360;
  if (L0 < 0) L0 += 360;

  let M = (357.52911 + 35999.05029 * t - 0.0001537 * t * t) % 360;
  if (M < 0) M += 360;

  const Mrad = M * Math.PI / 180;
  const e = 0.016708634 - 0.000042037 * t - 0.0000001267 * t * t;
  const C = (1.914602 - 0.004817 * t - 0.000014 * t * t) * Math.sin(Mrad)
          + (0.019993 - 0.000101 * t) * Math.sin(2 * Mrad)
          + 0.000289 * Math.sin(3 * Mrad);

  let trueL = (L0 + C) % 360;
  if (trueL < 0) trueL += 360;
  return trueL;
}

/**
 * 특정 절기(date) 계산
 * @param {number} year - 연도
 * @param {number} solarDegree - 절기 각도 (0, 15, ..., 345)
 * @param {number} [regionLon=135] - 표준경도 (deg)
 * @returns {Date} 지역시(Date)
 */
export function findSolarTermDate(year, solarDegree, regionLon = 135) {
  const target = solarDegree % 360;
  const jd0 = calendarGregorianToJD(year, 1, 1);
  const L0 = getSunLongitude(jd0);
  const dailyMotion = 0.9856;

  let delta = target - L0;
  if (delta < 0) delta += 360;

  let jd = jd0 + delta / dailyMotion;
  let iteration = 0;
  const maxIter = 100;
  const precision = 0.001;

  while (iteration < maxIter) {
    const L = getSunLongitude(jd);
    let diff = target - L;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    if (Math.abs(diff) < precision) break
    jd += diff / dailyMotion;
    iteration++;
  }

  const [y, m, dFrac] = jdToCalendarGregorian(jd);
  const d = Math.floor(dFrac);
  const frac = dFrac - d;
  const hh = Math.floor(frac * 24);
  const mm = Math.floor((frac * 24 - hh) * 60);
  const dateUTC = new Date(Date.UTC(y, m - 1, d, hh, mm));

  // 표준경도(regionLon) 기준 시간대 보정(ms)
  const tzMs = (regionLon / 15) * 3600 * 1000;
  return new Date(dateUTC.getTime() + tzMs);
}

/**
 * 특정 절기(date) 계산
 * @param {number} solarYear - 연도
 * @param {number} [regionLon=135] - 표준경도 (deg)
 */
export function getSolarTermBoundaries(solarYear, regionLon = 135) {
  const terms = [
    { deg: 315, name: "입춘" }, { deg: 345, name: "경칩" },
    { deg: 15,  name: "청명" }, { deg: 45,  name: "입하"   },
    { deg: 75,  name: "망종" }, { deg: 105, name: "소서"   },
    { deg: 135, name: "입추" }, { deg: 165, name: "백로"   },
    { deg: 195, name: "한로" }, { deg: 225, name: "입동"   },
    { deg: 255, name: "대설" }, { deg: 285, name: "소한"   },
  ];

  // 다음입춘(년+1)
  const next = { deg: 315, name: "다음입춘" };

  // 올해/내년 절기 모두 계산
  const arr = terms
    .map(t => ({
      name: t.name,
      date: findSolarTermDate(solarYear, t.deg, regionLon)
    }))
    .concat([
      { name: next.name, date: findSolarTermDate(solarYear+1, next.deg, regionLon) },
      { name: "소한", date: findSolarTermDate(solarYear+1, 285, regionLon) }
    ]);

  // 입춘(올해) 부터 다음 입춘(내년) 직전까지 필터
  const start = findSolarTermDate(solarYear, 315, regionLon),
        end   = findSolarTermDate(solarYear+1, 315, regionLon);

  return arr
    .filter(t => t.date >= start && t.date < end)
    .sort((a, b) => a.date - b.date);
}
