// fourPillars.js =  사주 전체(년월일시 + 대운) 결과 문자열을 리턴하는 고수준 서비스 함수

import { 지지_매핑 } from "../constants.js";
import { mjInfo } from "../info.js";
import { 지지관련_시간에서_문자열로_변환 } from "../util.js";
import { 일_간지를_구함 } from "../ganzhi/ganzhiUtil.js"
import { 대운_데이터_문자열 } from "./daewoonString.js";

export function 대운_고수준_서비스(
  year,
  month,
  day,
  birthPlace,
  gender,
  연_간지_출력_상수,
  월_간지_출력_상수,
  일_간지_출력_상수,
  시_간지_출력_상수
) {

  const nominalBirthDate = new Date(year, month - 1, day);
  const nominalBirthDate2 = new Date(year, month - 1, day + 1);
  const nominalBirthDatePrev = new Date(year, month - 1, day - 1);

  const yajojasi = document.getElementById("yajojasi")?.checked;
  const isJasi = document.getElementById("jasi")?.checked;
  const isInsi = document.getElementById("insi")?.checked;

  const boundaries = [
    { hour: 23, minute: 0, dayOffset: -1 },
    { hour: 1, minute: 0, dayOffset: 0 },
    { hour: 3, minute: 0, dayOffset: 0 },
    { hour: 5, minute: 0, dayOffset: 0 },
    { hour: 7, minute: 0, dayOffset: 0 },
    { hour: 9, minute: 0, dayOffset: 0 },
    { hour: 11, minute: 0, dayOffset: 0 },
    { hour: 13, minute: 0, dayOffset: 0 },
    { hour: 15, minute: 0, dayOffset: 0 },
    { hour: 17, minute: 0, dayOffset: 0 },
    { hour: 19, minute: 0, dayOffset: 0 },
    { hour: 21, minute: 0, dayOffset: 0 }
  ];
  let birthDate = new Date(mjInfo.year, mjInfo.month - 1, mjInfo.day, mjInfo.hour, mjInfo.minute);
  let hourBranch = 지지관련_시간에서_문자열로_변환(birthDate);
  let hourBranchIndex = 지지_매핑.indexOf(hourBranch);
  console.log(hourBranchIndex);
  const currentBoundary = boundaries[hourBranchIndex];
  const boundaryDate = new Date(nominalBirthDate);
  boundaryDate.setDate(boundaryDate.getDate() + currentBoundary.dayOffset);
  boundaryDate.setHours(currentBoundary.hour, currentBoundary.minute, 0, 0);

  const solarTime = new Date(birthDate.getTime() + 1 * 60000);
  let hourDayPillar;
  if (hourBranchIndex === 0) {
    if (solarTime < boundaryDate) {
      hourBranchIndex = 11;
    } else {
      
      hourDayPillar = 일_간지를_구함(nominalBirthDate);
    }
  } else if (hourBranchIndex === 1) {
    hourBranchIndex = 1;
  }

  if (isInsi && birthDate.getHours() < 3) {
    hourDayPillar = 일_간지를_구함(nominalBirthDatePrev);
  } else if (hourBranchIndex === 0) {
    hourDayPillar = 일_간지를_구함(nominalBirthDate);
  } else {
    hourDayPillar = 일_간지를_구함(nominalBirthDatePrev);
  }

  if (
    hourBranchIndex === 0 &&
    ((yajojasi && birthDate.getHours() >= 0 && birthDate.getHours() <= 3) ||
      (isJasi && birthDate.getHours() >= 0 && birthDate.getHours() <= 3))
  ) {
    hourDayPillar = 일_간지를_구함(nominalBirthDatePrev);
  } else if (
    hourBranchIndex === 0 &&
    ((yajojasi && birthDate.getHours() < 24) ||
      (isJasi && birthDate.getHours() < 24))
  ) {
    hourDayPillar = 일_간지를_구함(nominalBirthDate);
  }

  if (yajojasi && birthDate.getHours() >= 24) {
    일_간지_출력_상수 = 일_간지를_구함(nominalBirthDate);
  } else if (isJasi && birthDate.getHours() >= 23) {
    일_간지_출력_상수 = 일_간지를_구함(nominalBirthDate2);
  } else if (isInsi && birthDate.getHours() < 3) {
    일_간지_출력_상수 = 일_간지를_구함(nominalBirthDatePrev);
  } else {
    일_간지_출력_상수 = 일_간지를_구함(nominalBirthDate);
  }

  const daewoonStr = 대운_데이터_문자열(birthPlace, gender);
  return `${연_간지_출력_상수} ${월_간지_출력_상수} ${일_간지_출력_상수} ${시_간지_출력_상수}, ${daewoonStr}`;
}
