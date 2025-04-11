import {율리우스, 율리우스_역변환, 태양의_황경} from './solar.js'

export function 절기_날짜_찾음(year, solarDegree) {
  const target = solarDegree % 360, jd0 = 율리우스(year, 1, 1);
  const L0 = 태양의_황경(jd0), dailyMotion = 0.9856;
  let delta = target - L0; if (delta < 0) delta += 360;
  let jd = jd0 + delta / dailyMotion, iteration = 0, maxIter = 100, precision = 0.001;
  while (iteration < maxIter) {
    let L = 태양의_황경(jd), diff = target - L;
    if (diff > 180) diff -= 360; if (diff < -180) diff += 360;
    if (Math.abs(diff) < precision) break;
    jd += diff / dailyMotion; iteration++;
  }
  const [y, m, dFrac] = 율리우스_역변환(jd), d = Math.floor(dFrac), frac = dFrac - d;
  const hh = Math.floor(frac * 24), mm = Math.floor((frac * 24 - hh) * 60);
  const dateUTC = new Date(Date.UTC(y, m - 1, d, hh, mm));
  return new Date(dateUTC.getTime() + 9 * 3600 * 1000);
}

export function 절기_경계(solarYear, 절기_날짜_찾음, 율리우스, 율리우스_역변환, 태양의_황경) {
  let boundaries = [
    { solarDegree: 315, name: "입춘", date: 절기_날짜_찾음(solarYear, 315, 율리우스, 율리우스_역변환, 태양의_황경) },
    { solarDegree: 345, name: "경칩", date: 절기_날짜_찾음(solarYear, 345, 율리우스, 율리우스_역변환, 태양의_황경) },
    { solarDegree: 15,  name: "청명", date: 절기_날짜_찾음(solarYear, 15, 율리우스, 율리우스_역변환, 태양의_황경) },
    { solarDegree: 45,  name: "입하", date: 절기_날짜_찾음(solarYear, 45, 율리우스, 율리우스_역변환, 태양의_황경) },
    { solarDegree: 75,  name: "망종", date: 절기_날짜_찾음(solarYear, 75, 율리우스, 율리우스_역변환, 태양의_황경) },
    { solarDegree: 105, name: "소서", date: 절기_날짜_찾음(solarYear, 105, 율리우스, 율리우스_역변환, 태양의_황경) },
    { solarDegree: 135, name: "입추", date: 절기_날짜_찾음(solarYear, 135, 율리우스, 율리우스_역변환, 태양의_황경) },
    { solarDegree: 165, name: "백로", date: 절기_날짜_찾음(solarYear, 165, 율리우스, 율리우스_역변환, 태양의_황경) },
    { solarDegree: 195, name: "한로", date: 절기_날짜_찾음(solarYear, 195, 율리우스, 율리우스_역변환, 태양의_황경) },
    { solarDegree: 225, name: "입동", date: 절기_날짜_찾음(solarYear, 225, 율리우스, 율리우스_역변환, 태양의_황경) },
    { solarDegree: 255, name: "대설", date: 절기_날짜_찾음(solarYear, 255, 율리우스, 율리우스_역변환, 태양의_황경) },
    { solarDegree: 285, name: "소한", date: 절기_날짜_찾음(solarYear + 1, 285, 율리우스, 율리우스_역변환, 태양의_황경) },
    { name: "다음입춘", date: 절기_날짜_찾음(solarYear + 1, 315, 율리우스, 율리우스_역변환, 태양의_황경) }
  ];
  boundaries.sort((a, b) => a.date - b.date);
  const start = 절기_날짜_찾음(solarYear, 315), end = 절기_날짜_찾음(solarYear + 1, 315);
  boundaries = boundaries.filter(term => term.date >= start && term.date < end);
  const offset = 8.84 * 3600 * 1000;
  return boundaries.map(term => ({ name: term.name, date: new Date(term.date.getTime() - offset) }));
}

export function 월_넘버(dateObj, boundaries) {
  for (let i = 0; i < boundaries.length - 1; i++) {
    if (dateObj >= boundaries[i].date && dateObj < boundaries[i + 1].date) {
      return i + 1;
    }
  }
  return 12;
}