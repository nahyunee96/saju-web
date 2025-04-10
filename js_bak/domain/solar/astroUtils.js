// astroUtiles.js = JD 계산, 태양황경 계산, 절기 기준 계산 등 창고

// 그레고리력 날짜 → 율리우스일(Julian Day, JD) 변환 함수
export function 그레고리력_to_율리우스일(year, month, day) {
  if (month <= 2) { year -= 1; month += 12; }
  const a = Math.floor(year / 100);
  const b = 2 - a + Math.floor(a / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + b - 1524.5;
}

// 율리우스일(JD) → 그레고리력 날짜 변환 함수
export function 율리우스일_to_그레고리력(jd) {
  const z = Math.floor(jd + 0.5), f = jd + 0.5 - z;
  let a = z;
  if (z >= 2299161) {
    const alpha = Math.floor((z - 1867216.25) / 36524.25);
    a = z + 1 + alpha - Math.floor(alpha / 4);
  }
  const b = a + 1524, c = Math.floor((b - 122.1) / 365.25),
        d = Math.floor(365.25 * c), e = Math.floor((b - d) / 30.6001);
  const day = b - d - Math.floor(30.6001 * e) + f;
  let month = e - 1; if (month > 12) month -= 12;
  let year = c - 4715; if (month > 2) year -= 1;
  return [year, month, day];
}

// JD 기준으로 태양의 황경(黃經, ecliptic longitude) 을 구함
export function 태양의_황경(jd) {
  const t = (jd - 2451545.0) / 36525;
  let L0 = (280.46646 + 36000.76983 * t + 0.0003032 * t * t) % 360;
  if (L0 < 0) L0 += 360;
  let M = (357.52911 + 35999.05029 * t - 0.0001537 * t * t) % 360;
  if (M < 0) M += 360;
  const Mrad = M * Math.PI / 180;
  const C = (1.914602 - 0.004817 * t - 0.000014 * t * t) * Math.sin(Mrad)
          + (0.019993 - 0.000101 * t) * Math.sin(2 * Mrad)
          + 0.000289 * Math.sin(3 * Mrad);
  let trueL = (L0 + C) % 360; if (trueL < 0) trueL += 360;
  return trueL;
}

// 윤년 판별 함수
export function 윤년_판별_함수(year) {
  return (year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0);
}

// 윤년 판별후 윤년이면 366일 평년이면 365일
export function 윤년_평년_구분(year, 윤년_판별_함수) {
  return 윤년_판별_함수(year) ? 366 : 365;
}