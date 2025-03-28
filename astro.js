// astro.js
import { cityLongitudes, Cheongan, MONTH_ZHI, timeRanges, sexagenaryCycle } from './constants.js';

/* 써머타임 보정 관련 함수 */
export function getSummerTimeInterval(year) {
  let interval = null;
  switch (year) {
    case 1948:
      interval = { start: new Date(1948, 4, 31, 0, 0), end: new Date(1948, 8, 22, 0, 0) };
      break;
    case 1949:
      interval = { start: new Date(1949, 2, 31, 0, 0), end: new Date(1949, 8, 30, 0, 0) };
      break;
    case 1950:
      interval = { start: new Date(1950, 3, 1, 0, 0), end: new Date(1950, 8, 10, 0, 0) };
      break;
    case 1951:
      interval = { start: new Date(1951, 4, 6, 0, 0), end: new Date(1951, 8, 9, 0, 0) };
      break;
    case 1955:
      interval = { start: new Date(1955, 3, 6, 0, 0), end: new Date(1955, 8, 22, 0, 0) };
      break;
    case 1956:
      interval = { start: new Date(1956, 4, 20, 0, 0), end: new Date(1956, 8, 30, 0, 0) };
      break;
    case 1957:
      interval = { start: new Date(1957, 4, 5, 0, 0), end: new Date(1957, 8, 22, 0, 0) };
      break;
    case 1958:
      interval = { start: new Date(1958, 4, 4, 0, 0), end: new Date(1958, 8, 21, 0, 0) };
      break;
    default:
      interval = null;
  }
  return interval;
}

export function getEquationOfTime(dateObj) {
  const start = new Date(dateObj.getFullYear(), 0, 0);
  const N = Math.floor((dateObj - start) / (1000 * 60 * 60 * 24));
  const B = ((360 / 365) * (N - 81)) * Math.PI / 180;
  return 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
}

export function adjustBirthDate(dateObj, birthPlace) {
  const cityLongitude = cityLongitudes[birthPlace] || cityLongitudes["서울특별시"];
  const longitudeCorrection = Math.round((cityLongitude - 135.1) * 4);
  const eqTime = getEquationOfTime(dateObj);
  let correctedTime = new Date(dateObj.getTime() + (longitudeCorrection + eqTime) * 60000);
  const summerInterval = getSummerTimeInterval(correctedTime.getFullYear());
  if (summerInterval && correctedTime >= summerInterval.start && correctedTime < summerInterval.end) {
    correctedTime = new Date(correctedTime.getTime() - 60 * 60000);
  }
  return correctedTime;
}

/* 역법(그레고리력 ⇔ 율리우스일) 관련 함수 */
export function calendarGregorianToJD(year, month, day) {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const a = Math.floor(year / 100);
  const b = 2 - a + Math.floor(a / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + b - 1524.5;
}

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

export function getJDFromDate(dateObj) {
  const y = dateObj.getFullYear();
  const m = dateObj.getMonth() + 1;
  const d = dateObj.getDate() + dateObj.getHours() / 24 + dateObj.getMinutes() / (24 * 60);
  return calendarGregorianToJD(y, m, d);
}

/* 절기(태양의 위치) 계산 함수 */
export function findSolarTermDate(year, solarDegree) {
  const target = solarDegree % 360;
  const jd0 = calendarGregorianToJD(year, 1, 1);
  const L0 = getSunLongitude(jd0);
  const dailyMotion = 0.9856;
  let delta = target - L0;
  if (delta < 0) delta += 360;
  let jd = jd0 + delta / dailyMotion;
  let iteration = 0, maxIter = 100, precision = 0.001;
  while (iteration < maxIter) {
    let L = getSunLongitude(jd);
    let diff = target - L;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    if (Math.abs(diff) < precision) break;
    jd += diff / dailyMotion;
    iteration++;
  }
  const [y, m, dFrac] = jdToCalendarGregorian(jd);
  const d = Math.floor(dFrac);
  const frac = dFrac - d;
  const hh = Math.floor(frac * 24);
  const mm = Math.floor((frac * 24 - hh) * 60);
  const dateUTC = new Date(Date.UTC(y, m - 1, d, hh, mm));
  return new Date(dateUTC.getTime() + 9 * 3600 * 1000);
}

export function getSolarTermBoundaries(solarYear) {
  let boundaries = [
    { solarDegree: 315, name: "입춘", date: findSolarTermDate(solarYear, 315) },
    { solarDegree: 345, name: "경칩", date: findSolarTermDate(solarYear, 345) },
    { solarDegree: 15,  name: "청명", date: findSolarTermDate(solarYear, 15) },
    { solarDegree: 45,  name: "입하", date: findSolarTermDate(solarYear, 45) },
    { solarDegree: 75,  name: "망종", date: findSolarTermDate(solarYear, 75) },
    { solarDegree: 105, name: "소서", date: findSolarTermDate(solarYear, 105) },
    { solarDegree: 135, name: "입추", date: findSolarTermDate(solarYear, 135) },
    { solarDegree: 165, name: "백로", date: findSolarTermDate(solarYear, 165) },
    { solarDegree: 195, name: "한로", date: findSolarTermDate(solarYear, 195) },
    { solarDegree: 225, name: "입동", date: findSolarTermDate(solarYear, 225) },
    { solarDegree: 255, name: "대설", date: findSolarTermDate(solarYear, 255) },
    { solarDegree: 285, name: "소한", date: findSolarTermDate(solarYear + 1, 285) },
    { name: "다음입춘", date: findSolarTermDate(solarYear + 1, 315) }
  ];
  boundaries.sort((a, b) => a.date - b.date);
  const start = findSolarTermDate(solarYear, 315);
  const end = findSolarTermDate(solarYear + 1, 315);
  boundaries = boundaries.filter(term => term.date >= start && term.date < end);
  const offset = 8.84 * 3600 * 1000;
  return boundaries.map(term => ({ name: term.name, date: new Date(term.date.getTime() - offset) }));
}

export function getMonthNumber(dateObj, boundaries) {
  for (let i = 0; i < boundaries.length - 1; i++) {
    if (dateObj >= boundaries[i].date && dateObj < boundaries[i + 1].date) {
      return i + 1;
    }
  }
  return 12;
}

export function getYearGanZhi(dateObj, year) {
  const ipChun = findSolarTermDate(year, 315);
  const actualYear = (dateObj < ipChun) ? year - 1 : year;
  const yearIndex = ((actualYear - 4) % 60 + 60) % 60;
  return sexagenaryCycle[yearIndex];
}

export function getMonthGanZhi(dateObj, solarYear) {
  const boundaries = getSolarTermBoundaries(solarYear);
  const monthNumber = getMonthNumber(dateObj, boundaries);
  const yearGanZhi = getYearGanZhi(dateObj, solarYear);
  const yearStem = yearGanZhi.charAt(0), yearStemIndex = Cheongan.indexOf(yearStem) + 1;
  const monthStemIndex = ((yearStemIndex * 2) + monthNumber - 1) % 10;
  const monthStem = Cheongan[monthStemIndex], monthBranch = MONTH_ZHI[monthNumber - 1];
  return monthStem + monthBranch;
}

export function getHourBranchUsingArray(dateObj) {
  // 총 분 계산
  let totalMinutes = dateObj.getHours() * 60 + dateObj.getMinutes();
  // 각 시(지지)별 시간 범위 설정 (자시는 23:00 ~ 1:00, 나머지는 2시간씩)
  
  for (let i = 0; i < timeRanges.length; i++) {
    const { branch, start, end } = timeRanges[i];
    if (start < end) {
      if (totalMinutes >= start && totalMinutes < end) {
        return branch;
      }
    } else {
      // 자시의 경우: 23:00 ~ 24:00 또는 0:00 ~ 1:00
      if (totalMinutes >= start || totalMinutes < end) {
        return branch;
      }
    }
  }
  return null;
}