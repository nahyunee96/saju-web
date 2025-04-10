// solarTerm.js = 태양의 고도로 절기를 계산하는 창고
import { 그레고리력_to_율리우스일, 율리우스일_to_그레고리력, 태양의_황경 } from "./astroUtils.js"; 
import { mjInfo } from "../info.js"; 

// 태양의 고도로 절기를 계산하는 함수
export function 태양의_고도를_절기로(year, solarDegree) {
  const target = solarDegree % 360, jd0 = 그레고리력_to_율리우스일(year, 1, 1);
  const L0 = 태양의_황경(jd0), dailyMotion = 0.9856;
  let delta = target - L0; if (delta < 0) delta += 360;
  let jd = jd0 + delta / dailyMotion, iteration = 0, maxIter = 100, precision = 0.001;
  while (iteration < maxIter) {
    let L = 태양의_황경(jd), diff = target - L;
    if (diff > 180) diff -= 360; if (diff < -180) diff += 360;
    if (Math.abs(diff) < precision) break;
    jd += diff / dailyMotion; iteration++;
  }
  const [y, m, dFrac] = 율리우스일_to_그레고리력(jd), d = Math.floor(dFrac), frac = dFrac - d;
  const hh = Math.floor(frac * 24), mm = Math.floor((frac * 24 - hh) * 60);
  const dateUTC = new Date(Date.UTC(y, m - 1, d, hh, mm));
  return new Date(dateUTC.getTime() + 9 * 3600 * 1000);
}

// 입춘 날짜 구하기
export const ipChun = 태양의_고도를_절기로(mjInfo.year, 315);

// solarRange.js = 절기 기준 범위를 구하는 고도화된 절기 유틸 함수 창고
export function 절기_기준_범위(solarYear) {
  let boundaries = [
    { solarDegree: 315, name: "입춘", date: 태양의_고도를_절기로(solarYear, 315) },
    { solarDegree: 345, name: "경칩", date: 태양의_고도를_절기로(solarYear, 345) },
    { solarDegree: 15,  name: "청명", date: 태양의_고도를_절기로(solarYear, 15) },
    { solarDegree: 45,  name: "입하", date: 태양의_고도를_절기로(solarYear, 45) },
    { solarDegree: 75,  name: "망종", date: 태양의_고도를_절기로(solarYear, 75) },
    { solarDegree: 105, name: "소서", date: 태양의_고도를_절기로(solarYear, 105) },
    { solarDegree: 135, name: "입추", date: 태양의_고도를_절기로(solarYear, 135) },
    { solarDegree: 165, name: "백로", date: 태양의_고도를_절기로(solarYear, 165) },
    { solarDegree: 195, name: "한로", date: 태양의_고도를_절기로(solarYear, 195) },
    { solarDegree: 225, name: "입동", date: 태양의_고도를_절기로(solarYear, 225) },
    { solarDegree: 255, name: "대설", date: 태양의_고도를_절기로(solarYear, 255) },
    { solarDegree: 285, name: "소한", date: 태양의_고도를_절기로(solarYear + 1, 285) },
    { name: "다음입춘", date: 태양의_고도를_절기로(solarYear + 1, 315) }
  ];

  boundaries.sort((a, b) => a.date - b.date);

  const start = 태양의_고도를_절기로(solarYear, 315);
  const end = 태양의_고도를_절기로(solarYear + 1, 315);

  boundaries = boundaries.filter(term => term.date >= start && term.date < end);

  const offset = 8.84 * 3600 * 1000; // UTC+8.84 기준
  return boundaries.map(term => ({
    name: term.name,
    date: new Date(term.date.getTime() - offset)
  }));
}

// 절기 경계내에서 해당날짜가 몇번째인지 구하는 함수
export function 이_절기가_몇번째_인가요(dateObj, boundaries) {
  for (let i = 0; i < boundaries.length - 1; i++) {
    if (dateObj >= boundaries[i].date && dateObj < boundaries[i + 1].date) {
      return i + 1;
    }
  }
  return 12;
}

// 균시차 계산 함수
export function 균시차_계산(dateObj) {
  const start = new Date(dateObj.getFullYear(), 0, 0);
  const N = Math.floor((dateObj - start) / (1000 * 60 * 60 * 24));
  const B = ((360 / 365) * (N - 81)) * Math.PI / 180;
  return 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
}