// lib/astronomy.ts
// 천문(astronomy) 관련 순수 함수 모듈

/**
 * 그레고리력 날짜 -> 율리우스일(JD) 변환
 * @param year 4자리 연도
 * @param month 월 (1-12)
 * @param day 일 + 시간(소수일)
 * @returns Julian Day
 */
export function calendarGregorianToJD(
  year: number,
  month: number,
  day: number
): number {
  let Y = year;
  let M = month;
  if (M <= 2) {
    Y -= 1;
    M += 12;
  }
  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4);
  const JD =
    Math.floor(365.25 * (Y + 4716)) +
    Math.floor(30.6001 * (M + 1)) +
    day +
    B -
    1524.5;
  return JD;
}

/**
 * JavaScript Date 객체 -> 율리우스일(JD) 변환 (UTC 기준)
 * @param date JS Date 객체
 * @returns Julian Day
 */
export function getJDFromDate(date: Date): number {
  // UTC로 변환: 일 + 시/24 + 분/1440 + 초/86400
  const dayFraction =
    date.getUTCHours() / 24 +
    date.getUTCMinutes() / 1440 +
    date.getUTCSeconds() / 86400 +
    date.getUTCMilliseconds() / 86400000;
  return calendarGregorianToJD(
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate() + dayFraction
  );
}

/**
 * 율리우스일(JD) -> 그레고리력 날짜 변환
 * @param jd Julian Day
 * @returns { year, month, day }
 */
export function jdToCalendarGregorian(
  jd: number
): { year: number; month: number; day: number } {
  const Z = Math.floor(jd + 0.5);
  const F = jd + 0.5 - Z;
  let A = Z;
  if (Z >= 2299161) {
    const alpha = Math.floor((Z - 1867216.25) / 36524.25);
    A += 1 + alpha - Math.floor(alpha / 4);
  }
  const B = A + 1524;
  const C = Math.floor((B - 122.1) / 365.25);
  const D = Math.floor(365.25 * C);
  const E = Math.floor((B - D) / 30.6001);

  const day = B - D - Math.floor(30.6001 * E) + F;
  const month = E < 14 ? E - 1 : E - 13;
  const year = month > 2 ? C - 4716 : C - 4715;

  return { year, month, day };
}

/**
 * 태양 황경(ecliptic longitude) 계산
 * 근사 공식: Meeus "Astronomical Algorithms"
 * @param jd Julian Day
 * @returns 태양 황경 (0~360도)
 */
export function getSunLongitude(jd: number): number {
  const D = jd - 2451545.0;
  // 평균 태양황경
  const L = 280.46061837 + 0.98564736629 * D;
  // 평균 근일점 이심각
  const g = 357.52772333 + 0.98560028307 * D;

  // 라디안 변환
  const toRad = (x: number) => (x * Math.PI) / 180;

  // 수차 보정
  const Lcorr =
    L +
    1.914602 * Math.sin(toRad(g)) +
    0.019993 * Math.sin(toRad(2 * g)) +
    0.000289 * Math.sin(toRad(3 * g));

  // 정규화 (0~360)
  const lon = ((Lcorr % 360) + 360) % 360;
  return lon;
}
