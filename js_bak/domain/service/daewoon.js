// daewoon.js = 대운에 대한 함수 창고

import { 남녀_음양으로_구분, mjInfo } from "../info.js";
import { 연의_간지를_출력함, 월의_간지를_출력함, 연_간지_출력_상수, 월_간지_출력_상수 } from "../ganzhi/ganzhiUtil.js";
import { ipChun } from "../solar/solarTerm.js";

// 대운리스트 세워주는 함수
export function 대운리스트_세움(baseNumber, monthPillar, 남녀_음양으로_구분, 간지_월_순서_매핑, 천간_매핑) {
  const list = [];
  const currentMonthIndex = 간지_월_순서_매핑.indexOf(monthPillar.charAt(1));
  const monthStemIndex = 천간_매핑.indexOf(monthPillar.charAt(0));

  for (let i = 0; i < 10; i++) {
    const age = baseNumber + i * 10;
    const nextMonthIndex = 남녀_음양으로_구분
      ? (currentMonthIndex + i + 1) % 12
      : (currentMonthIndex - (i + 1) + 12) % 12;

    const nextStemIndex = 남녀_음양으로_구분
      ? (monthStemIndex + i + 1) % 10
      : (monthStemIndex - (i + 1) + 10) % 10;

    list.push({
      age,
      stem: 천간_매핑[nextStemIndex],
      branch: 간지_월_순서_매핑[nextMonthIndex]
    });
  }

  return list;
}

export function 대운_데이터(
  birthdayInfo,
  gender,
  일_간지를_구함,
  평균_120년값_계산,
  썸머타임_계산,
  oneDayMs,
  간지_월_순서_매핑,
  천간_매핑
) {
  
  
  const originalDate = new Date(mjInfo.year, mjInfo.month, mjInfo.day);
  let birthDate = new Date(mjInfo.year, mjInfo.month - 1, mjInfo.day, mjInfo.hour, mjInfo.minute);
  const inputYear = mjInfo.year;
  const effectiveYear = (originalDate < ipChun)
    ? inputYear - 1 : inputYear;

  연의_간지를_출력함(birthDate, effectiveYear);
  월의_간지를_출력함(birthDate, effectiveYear);

  남녀_음양으로_구분(gender, 연_간지_출력_상수);

  const dayStemRef = 일_간지를_구함(birthDate).charAt(0);

  const targetTerm = findTargetSolarTerm(
    birthDate,
    effectiveYear,
    남녀_음양으로_구분,
    썸머타임_계산
  );

  const avgData = 평균_120년값_계산(targetTerm.date);
  const diffDays = getDiffDays(남녀_음양으로_구분, targetTerm.date, birthDate, oneDayMs);
  const baseNumber = Number(((diffDays / avgData.averageMonth) * 10).toFixed(4));

  const list = 대운리스트_세움(
    baseNumber,
    월_간지_출력_상수,
    남녀_음양으로_구분,
    간지_월_순서_매핑,
    천간_매핑
  );

  return { base: baseNumber, list, dayStemRef };
}

// 절기를 찾는 함수
export function 타겟절기_찾음(birthDate, year, 남녀_음양으로_구분, 절기_기준_범위) {
  const allTerms = [
    ...절기_기준_범위(year - 1),
    ...절기_기준_범위(year),
    ...절기_기준_범위(year + 1)
  ].sort((a, b) => a.date - b.date);

  if (남녀_음양으로_구분) {
    return allTerms.find(term => term.date > birthDate) || allTerms[0];
  } else {
    const pastTerms = allTerms.filter(term => term.date <= birthDate);
    return pastTerms[pastTerms.length - 1] || allTerms[allTerms.length - 1];
  }
}

// 순행, 역행 구분
export function 순행_역행_구분_절기(남녀_음양으로_구분, targetDate, birthDate, oneDayMs) {
  return 남녀_음양으로_구분
    ? (targetDate - birthDate) / oneDayMs
    : (birthDate - targetDate) / oneDayMs;
}

