// 계산용

export const oneDayMs = 24 * 60 * 60 * 1000;

export function splitPillar(Set) {
  return (Set && Set.length >= 2) ? { gan: Set.charAt(0), ji: Set.charAt(1) } : { gan: "-", ji: "-" };
}

export function 평균_120(birthDate, oneDayMs) {
  const endDate = new Date(birthDate.getTime());
  endDate.setFullYear(endDate.getFullYear() + 120);
  const totalDays = (endDate - birthDate) / oneDayMs;
  const averageYear = totalDays / 120;
  const averageMonth = averageYear / 12;
  const averageDecade = averageYear * 10;
  return { totalDays, averageYear, averageMonth, averageDecade };
}

export function 년_월_일_시(totalDays, avgYear, avgMonth) {
  const years = Math.floor(totalDays / avgYear);
  let remainderDays = totalDays - years * avgYear;
  const months = Math.floor(remainderDays / avgMonth);
  remainderDays -= months * avgMonth;
  const days = Math.floor(remainderDays);
  const fractionDay = remainderDays - days;
  const hours = Math.floor(fractionDay * 24);
  const minutes = Math.floor((fractionDay * 24 - hours) * 60);
  const seconds = Math.floor((((fractionDay * 24) - hours) * 60 - minutes) * 60);
  return { years, months, days, hours, minutes, seconds };
}

export function isLeapYear(year) {
  return (year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0);
}

export function getDaysInYear(year) {
  return isLeapYear(year) ? 366 : 365;
}

export function getDecimalBirthYear(oneDayMs, birthDate, isLeapYear) {
  const startOfYear = new Date(birthDate.getFullYear(), 0, 1);
  const diffDays = (birthDate - startOfYear) / oneDayMs;
  // 해당 연도의 전체 일수 (윤년 여부 반영)
  const totalDays = isLeapYear(birthDate.getFullYear()) ? 366 : 365;
  return birthDate.getFullYear() + diffDays / totalDays;
}