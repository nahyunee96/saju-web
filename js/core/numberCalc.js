// numberCalc.js = 숫자 계산식

// 밀리초 환산
export const oneDayMs = 24 * 60 * 60 * 1000;

// 0.51 기준으로 반올림, 반내림 함수
export function 반올림_반내림(value) {
  return (value % 1 >= 0.51) ? Math.ceil(value) : Math.floor(value);
}

// 120년 평균값 구하는 함수
export function 평균_120년값_계산(birthDate, oneDayMs) {
  if (!(birthDate instanceof Date)) {
    console.error("get120YearAverages: 유효한 Date 객체가 필요합니다.");
    return null;
  }
  const endDate = new Date(birthDate.getTime());
  endDate.setFullYear(endDate.getFullYear() + 120);
  const totalDays = (endDate - birthDate) / oneDayMs;
  const averageYear = totalDays / 120;
  const averageMonth = averageYear / 12;
  const averageDecade = averageYear * 10;
  return { totalDays, averageYear, averageMonth, averageDecade };
}

// 만나이 계산 함수
export function 만나이_계산(birthDate) {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const todayMonth = today.getMonth() - birthDate.getMonth();
  if (todayMonth < 0 || (todayMonth === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

// 날짜 포맷 함수
export function 날짜_포맷(dateObj) {
  const yyyy = dateObj.getFullYear();
  const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
  const dd = String(dateObj.getDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}`;
}

// 시간 포맷 함수
export function 시간_포맷(birthtime) {
  if (!birthtime) return "-";
  const cleaned = birthtime.replace(/\s/g, "").trim();
  if (cleaned.length !== 4 || isNaN(cleaned)) return "-";
  return cleaned.slice(0, 2) + "시" + cleaned.slice(2, 4) + "분";
}

// 년/월/일/시/분/초로 환산해주는 함수
// 평균값 기반: 일수 → 년/월/일/시/분/초 단위 변환
export function 년_월_일_시_분_초로_단위_변환(totalDays, avgYear, avgMonth, 반올림_반내림) {
  const years = 반올림_반내림(totalDays / avgYear);
  let remainderDays = totalDays - years * avgYear;

  const months = 반올림_반내림(remainderDays / avgMonth);
  remainderDays -= months * avgMonth;

  const days = 반올림_반내림(remainderDays);
  const fractionDay = remainderDays - days;

  const hours = 반올림_반내림(fractionDay * 24);
  const minutes = 반올림_반내림((fractionDay * 24 - hours) * 60);
  const seconds = 반올림_반내림((((fractionDay * 24) - hours) * 60 - minutes) * 60);

  return { years, months, days, hours, minutes, seconds };
}

// 주어진 생년월일(Date)을 '소수점 형태의 년도'로 환산해주는 함수
export function 생년월일_소숫점_환산(birthDate, oneDayMs, getDaysInYear) {
  const year = birthDate.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const diffDays = (birthDate - startOfYear) / oneDayMs;
  const totalDays = getDaysInYear(year);
  return year + diffDays / totalDays;
}