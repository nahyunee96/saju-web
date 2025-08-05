// js/fourPillars.js

import { getEffectiveYearForSet } from './ganzi.js';
import { getHourBranchUsingArray, getHourStem } from './ganzi.js';
import { getYearGanZhi, getMonthGanZhi, getDayGanZhi } from './calc.js';
import { getDaewoonDataStr } from './lucky.js';
import { Jiji } from './core.js';
import { state } from './state.js';

export function getFourPillarsWithDaewoon(year, month, day, hour, minute, gender, correctedDate, selectedLon) {
  const originalDate = new Date(year, month - 1, day, hour, minute);
  const effectiveYearForSet = getEffectiveYearForSet(correctedDate);
  const nominalBirthDate = new Date(year, month - 1, day);
  const nominalBirthDate2 = new Date(year, month - 1, day + 1);
  const nominalBirthDatePrev = new Date(year, month - 1, day - 1);

  const yajasiElem = document.getElementById('yajasi');
  const yajasi = yajasiElem && yajasiElem.checked;
  const jasiElem = document.getElementById('jasi');
  const isJasi = jasiElem && jasiElem.checked;
  const insiElem = document.getElementById('insi');
  const isInsi = insiElem && insiElem.checked;

  const boundaries = [
    { hour: 23, minute: 0, dayOffset: -1 },
    { hour: 1,  minute: 0, dayOffset:  0 },
    { hour: 3,  minute: 0, dayOffset:  0 },
    { hour: 5,  minute: 0, dayOffset:  0 },
    { hour: 7,  minute: 0, dayOffset:  0 },
    { hour: 9,  minute: 0, dayOffset:  0 },
    { hour: 11, minute: 0, dayOffset:  0 },
    { hour: 13, minute: 0, dayOffset:  0 },
    { hour: 15, minute: 0, dayOffset:  0 },
    { hour: 17, minute: 0, dayOffset:  0 },
    { hour: 19, minute: 0, dayOffset:  0 },
    { hour: 21, minute: 0, dayOffset:  0 }
  ];

  let hourBranch = getHourBranchUsingArray(correctedDate);
  let hourBranchIndex = Jiji.indexOf(hourBranch);

  const currentBoundary = boundaries[hourBranchIndex];
  const boundaryDate = new Date(nominalBirthDate);
  boundaryDate.setDate(boundaryDate.getDate() + currentBoundary.dayOffset);
  boundaryDate.setHours(currentBoundary.hour, currentBoundary.minute, 0, 0);

  const solarTime = new Date(correctedDate.getTime() + 1 * 60000);
  let hourDayPillar;

  if (hourBranchIndex === 0) {
    if (solarTime < boundaryDate) {
      hourBranchIndex = 11;
    } else {
      hourDayPillar = getDayGanZhi(nominalBirthDate);
    }
  }

  if (hourBranchIndex === 0) {
    hourDayPillar = getDayGanZhi(nominalBirthDate);
  } else {
    hourDayPillar = getDayGanZhi(nominalBirthDatePrev);
  }

  if (
    hourBranchIndex === 0 &&
    ( (yajasi || isJasi || isInsi) && correctedDate.getHours() < 3 )
  ) {
    hourDayPillar = getDayGanZhi(nominalBirthDatePrev);
  }

  const hourStem = getHourStem(hourDayPillar, hourBranchIndex);
  const hourPillar = hourStem + Jiji[hourBranchIndex];

  const yearPillar = getYearGanZhi(correctedDate, effectiveYearForSet);
  const monthPillar = getMonthGanZhi(correctedDate, selectedLon);

  let dayPillar;
  if (
    isJasi && (correctedDate.getHours() >= 23 || correctedDate.getHours() < 3)
  ) {
    dayPillar = correctedDate.getHours() < 3
      ? getDayGanZhi(nominalBirthDate)
      : getDayGanZhi(nominalBirthDate2);
  } else if (
    isInsi && (correctedDate.getHours() < 3 || correctedDate.getHours() >= 23)
  ) {
    if (hourBranchIndex === 0 && correctedDate.getHours() < 3) {
      dayPillar = getDayGanZhi(nominalBirthDatePrev);
    } else {
      dayPillar = hourBranchIndex === 0
        ? getDayGanZhi(nominalBirthDate)
        : getDayGanZhi(nominalBirthDatePrev);
    }
  } else {
    dayPillar = getDayGanZhi(nominalBirthDate);
  }

  return `${yearPillar} ${monthPillar} ${dayPillar} ${hourPillar}, ${getDaewoonDataStr(gender, originalDate, correctedDate)}`;
}
