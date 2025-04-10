// 절기 관련

//import {  } from "";

export function 절기_찾는_함수(year, solarDegree, calendarGregorianToJD, jdToCalendarGregorian, getSunLongitude) {
  const target = solarDegree % 360, jd0 = calendarGregorianToJD(year, 1, 1);
  const L0 = getSunLongitude(jd0), dailyMotion = 0.9856;
  let delta = target - L0; if (delta < 0) delta += 360;
  let jd = jd0 + delta / dailyMotion, iteration = 0, maxIter = 100, precision = 0.001;
  while (iteration < maxIter) {
    let L = getSunLongitude(jd), diff = target - L;
    if (diff > 180) diff -= 360; if (diff < -180) diff += 360;
    if (Math.abs(diff) < precision) break;
    jd += diff / dailyMotion; iteration++;
  }
  const [y, m, dFrac] = jdToCalendarGregorian(jd), d = Math.floor(dFrac), frac = dFrac - d;
  const hh = Math.floor(frac * 24), mm = Math.floor((frac * 24 - hh) * 60);
  const dateUTC = new Date(Date.UTC(y, m - 1, d, hh, mm));
  return new Date(dateUTC.getTime() + 9 * 3600 * 1000);
}

export function 태양의_절기_get(solarYear, 절기_찾는_함수, calendarGregorianToJD, jdToCalendarGregorian, getSunLongitude) {
  let boundaries = [
    { solarDegree: 315, name: "입춘", date: 절기_찾는_함수(solarYear, 315, calendarGregorianToJD, jdToCalendarGregorian, getSunLongitude) },
    { solarDegree: 345, name: "경칩", date: 절기_찾는_함수(solarYear, 345, calendarGregorianToJD, jdToCalendarGregorian, getSunLongitude) },
    { solarDegree: 15,  name: "청명", date: 절기_찾는_함수(solarYear, 15, calendarGregorianToJD, jdToCalendarGregorian, getSunLongitude) },
    { solarDegree: 45,  name: "입하", date: 절기_찾는_함수(solarYear, 45, calendarGregorianToJD, jdToCalendarGregorian, getSunLongitude) },
    { solarDegree: 75,  name: "망종", date: 절기_찾는_함수(solarYear, 75, calendarGregorianToJD, jdToCalendarGregorian, getSunLongitude) },
    { solarDegree: 105, name: "소서", date: 절기_찾는_함수(solarYear, 105, calendarGregorianToJD, jdToCalendarGregorian, getSunLongitude) },
    { solarDegree: 135, name: "입추", date: 절기_찾는_함수(solarYear, 135, calendarGregorianToJD, jdToCalendarGregorian, getSunLongitude) },
    { solarDegree: 165, name: "백로", date: 절기_찾는_함수(solarYear, 165, calendarGregorianToJD, jdToCalendarGregorian, getSunLongitude) },
    { solarDegree: 195, name: "한로", date: 절기_찾는_함수(solarYear, 195, calendarGregorianToJD, jdToCalendarGregorian, getSunLongitude) },
    { solarDegree: 225, name: "입동", date: 절기_찾는_함수(solarYear, 225, calendarGregorianToJD, jdToCalendarGregorian, getSunLongitude) },
    { solarDegree: 255, name: "대설", date: 절기_찾는_함수(solarYear, 255, calendarGregorianToJD, jdToCalendarGregorian, getSunLongitude) },
    { solarDegree: 285, name: "소한", date: 절기_찾는_함수(solarYear + 1, 285, calendarGregorianToJD, jdToCalendarGregorian, getSunLongitude) },
    { name: "다음입춘", date: 절기_찾는_함수(solarYear + 1, 315, calendarGregorianToJD, jdToCalendarGregorian, getSunLongitude) }
  ];
  boundaries.sort((a, b) => a.date - b.date);
  const start = 절기_찾는_함수(solarYear, 315, calendarGregorianToJD, jdToCalendarGregorian, getSunLongitude), 
  end = 절기_찾는_함수(solarYear + 1, 315, calendarGregorianToJD, jdToCalendarGregorian, getSunLongitude);
  boundaries = boundaries.filter(term => term.date >= start && term.date < end);
  const offset = 8.84 * 3600 * 1000;
  return boundaries.map(term => ({ name: term.name, date: new Date(term.date.getTime() - offset) }));
}