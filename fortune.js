// fortune.js
import { Cheongan, Jiji, MONTH_ZHI, sexagenaryCycle, tenGodMappingForStems, tenGodMappingForBranches } from './constants.js';
import { findSolarTermDate, calendarGregorianToJD, adjustBirthDate, getSolarTermBoundaries, getYearGanZhi, getMonthGanZhi, getHourBranchUsingArray } from './astro.js';

export function getDayGanZhi(dateObj) {
  const jd = Math.floor(calendarGregorianToJD(dateObj.getFullYear(), dateObj.getMonth() + 1, dateObj.getDate()));
  return sexagenaryCycle[(jd + 50) % 60] || "";
}

export function getDaewoonData(birthPlace, gender) {
  // 원본 로직 그대로 (globalState.correctedBirthDate 등 전역 변수를 사용)
  const birthDate = window.globalState.correctedBirthDate;
  const originalDate = new Date(birthDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  const correctedDate = adjustBirthDate(originalDate, birthPlace);
  const inputYear = window.globalState.correctedBirthDate.getFullYear();
  const ipChunForSet = findSolarTermDate(inputYear, 315);
  const effectiveYearForSet = (originalDate < ipChunForSet) ? inputYear - 1 : inputYear;
  const effectiveYearForDaewoon = inputYear;
  const yearSet = getYearGanZhi(correctedDate, effectiveYearForSet);
  const monthSet = getMonthGanZhi(correctedDate, effectiveYearForSet);
  const dayStemRef = getDayGanZhi(correctedDate).charAt(0);
  const isYang = ["갑", "병", "무", "경", "임"].includes(yearSet.charAt(0));
  const isForward = (gender === "남" && isYang) || (gender === "여" && !isYang);
  const currentSolarTerms = getSolarTermBoundaries(effectiveYearForDaewoon);
  const previousSolarTerms = getSolarTermBoundaries(effectiveYearForDaewoon - 1);
  const nextSolarTerms = getSolarTermBoundaries(effectiveYearForDaewoon + 1);
  const allTerms = [...previousSolarTerms, ...currentSolarTerms, ...nextSolarTerms].sort((a, b) => a.date - b.date);
  
  let targetTerm;
  if (isForward) {
    targetTerm = allTerms.find(term => term.date > correctedDate);
  } else {
    const pastTerms = allTerms.filter(term => term.date <= correctedDate);
    targetTerm = pastTerms[pastTerms.length - 1];
  }
  if (!targetTerm) {
    targetTerm = isForward ? allTerms[0] : allTerms[allTerms.length - 1];
  }
  
  const daysDiff = isForward
    ? Math.round((targetTerm.date - correctedDate) / (1000 * 60 * 60 * 24))
    : Math.round((correctedDate - targetTerm.date) / (1000 * 60 * 60 * 24));
  
  const baseNumber = Math.max(1, Math.round(daysDiff / 3));
  
  let currentMonthIndex = MONTH_ZHI.indexOf(monthSet.charAt(1));
  let monthStemIndex = Cheongan.indexOf(monthSet.charAt(0));
  const list = [];
  for (let i = 0; i < 10; i++) {
    const age = baseNumber + i * 10;
    const nextMonthIndex = isForward
      ? (currentMonthIndex + i + 1) % 12
      : (currentMonthIndex - (i + 1) + 12) % 12;
  
    const nextStemIndex = isForward
      ? (monthStemIndex + i + 1) % 10
      : (monthStemIndex - (i + 1) + 10) % 10;
    list.push({
      age: age,
      stem: Cheongan[nextStemIndex],
      branch: MONTH_ZHI[nextMonthIndex]
    });
  }
  
  return { base: baseNumber, list: list, dayStemRef: dayStemRef };
}


export function getDaewoonDataStr(birthPlace, gender) {
  const data = getDaewoonData(birthPlace, gender);
  const listStr = data.list.map(item => `${item.age}(${item.stem}${item.branch})`).join(", ");
  return `대운수 ${data.base}, 대운 나이 목록: ${listStr}`;
}

export function getFourSetsWithDaewoon(year, month, day, hour, minute, birthPlace, gender) {
	const originalDate = new Date(year, month - 1, day, hour, minute);
	const correctedDate = adjustBirthDate(originalDate, birthPlace);
	const nominalBirthDate = new Date(year, month - 1, day);
  const nominalBirthDate2 = new Date(year, month - 1, day + 1);
	const nominalBirthDatePrev = new Date(year, month - 1, day - 1);
	
	const yajojasiElem = document.getElementById('yajojasi');
	const yajojasi = yajojasiElem && yajojasiElem.checked;
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

  const currentBoundary = boundaries[ hourBranchIndex ];
  const boundaryDate = new Date(nominalBirthDate);
  boundaryDate.setDate(boundaryDate.getDate() + currentBoundary.dayOffset);
  boundaryDate.setHours(currentBoundary.hour, currentBoundary.minute, 0, 0);

  const solarTime = new Date(correctedDate.getTime() + 1 * 60000);
  let hourDaySet;
  if (hourBranchIndex === 0) {
    if (solarTime < boundaryDate) {
    hourBranchIndex = 11;
    } else {
      hourDaySet = getDayGanZhi(nominalBirthDate);
    }
  } else if(hourBranchIndex === 1) {
    hourBranchIndex = 1;
  }

  if (isInsi && correctedDate.getHours() < 3) {
    hourDaySet = getDayGanZhi(nominalBirthDatePrev);
  } else if (hourBranchIndex === 0){
      hourDaySet = getDayGanZhi(nominalBirthDate);
  } else {
    hourDaySet = getDayGanZhi(nominalBirthDatePrev);
  }

  if (hourBranchIndex === 0 && (yajojasi && correctedDate.getHours() >= 0 && correctedDate.getHours() <= 3) || hourBranchIndex === 0 && (isJasi && correctedDate.getHours() >= 0 && correctedDate.getHours() <= 3)){
      hourDaySet = getDayGanZhi(nominalBirthDatePrev);
  } else if (hourBranchIndex === 0 && (yajojasi && correctedDate.getHours() < 24) || hourBranchIndex === 0 && (isJasi && correctedDate.getHours() < 24)) {
    hourDaySet = getDayGanZhi(nominalBirthDate);
  }
  const hourStem = getHourStem(hourDaySet, hourBranchIndex);
  const hourSet = hourStem + Jiji[hourBranchIndex];

  const yearSet = getYearGanZhi(correctedDate, year);
  const monthSet = getMonthGanZhi(correctedDate, year);

  if (yajojasi && correctedDate.getHours() >= 24){
    const daySet = getDayGanZhi(nominalBirthDate);
    return `${yearSet} ${monthSet} ${daySet} ${hourSet}, ${getDaewoonDataStr(birthPlace, gender)}`;
  } 
    
  if (isJasi && correctedDate.getHours() >= 23){
    const daySet = getDayGanZhi(nominalBirthDate2);
    return `${yearSet} ${monthSet} ${daySet} ${hourSet}, ${getDaewoonDataStr(birthPlace, gender)}`;
  } 

  if (isInsi && correctedDate.getHours() < 3){
    const daySet = getDayGanZhi(nominalBirthDatePrev);
    return `${yearSet} ${monthSet} ${daySet} ${hourSet}, ${getDaewoonDataStr(birthPlace, gender)}`;
  } else {
    const daySet = getDayGanZhi(nominalBirthDate);
    return `${yearSet} ${monthSet} ${daySet} ${hourSet}, ${getDaewoonDataStr(birthPlace, gender)}`;
  }	
}

export function getHourBranchIndex(dateObj, isSunTime) {
  let totalMinutes = dateObj.getHours() * 60 + dateObj.getMinutes();
  const ZASI_START = 23 * 60; // 자시 시작: 23:00 (1380분)
  let adjustedMinutes = totalMinutes;
  if (adjustedMinutes < ZASI_START) {
    adjustedMinutes += 1440; // 하루(1440분) 보정
  }
  const diff = adjustedMinutes - ZASI_START;
  const index = Math.floor(diff / 120) % 12;
  return index;
}

export function splitSet(Set) {
  return (Set && Set.length >= 2) ? { gan: Set.charAt(0), ji: Set.charAt(1) } : { gan: "-", ji: "-" };
}

export function getGanZhiIndex(gz) {
  return sexagenaryCycle.indexOf(gz);
}

export function getGanZhiFromIndex(i) {
  const mod = ((i % 60) + 60) % 60;
  return sexagenaryCycle[mod];
}

export function getTenGodForStem(receivingStem, baseDayStem) {
  return (tenGodMappingForStems[baseDayStem] && tenGodMappingForStems[baseDayStem][receivingStem]) || "-";
}

export function getTenGodForBranch(receivingBranch, baseStem) {
  return (tenGodMappingForBranches[baseStem] && tenGodMappingForBranches[baseStem][receivingBranch]) || "-";
}

export function getYearGanZhiForSewoon(year) {
  let refDate = new Date(year, 3, 1);
  let ipChun = findSolarTermDate(year, 315);
  let effectiveYear = (refDate >= ipChun) ? year : (year - 1);
  let index = ((effectiveYear - 4) % 60 + 60) % 60;
  return sexagenaryCycle[index];
}

export function getTwelveUnseong(baseDayStem, branch) {
  const mapping = {
    "갑": { "자": "목욕", "축": "관대", "인": "건록", "묘": "제왕", "진": "쇠", "사": "병", "오": "사", "미": "묘", "신": "절", "유": "태", "술": "양", "해": "장생" },
    "을": { "자": "병", "축": "쇠", "인": "제왕", "묘": "건록", "진": "관대", "사": "목욕", "오": "장생", "미": "양", "신": "태", "유": "절", "술": "묘", "해": "사" },
    "병": { "자": "태", "축": "양", "인": "장생", "묘": "목욕", "진": "관대", "사": "건록", "오": "제왕", "미": "쇠", "신": "병", "유": "사", "술": "묘", "해": "절" },
    "정": { "자": "절", "축": "묘", "인": "사", "묘": "병", "진": "쇠", "사": "제왕", "오": "건록", "미": "관대", "신": "목욕", "유": "장생", "술": "양", "해": "태" },
    "무": { "자": "태", "축": "양", "인": "장생", "묘": "목욕", "진": "관대", "사": "건록", "오": "제왕", "미": "쇠", "신": "병", "유": "사", "술": "묘", "해": "절" },
    "기": { "자": "절", "축": "묘", "인": "사", "묘": "병", "진": "쇠", "사": "제왕", "오": "건록", "미": "관대", "신": "목욕", "유": "장생", "술": "양", "해": "태" },
    "경": { "자": "사", "축": "묘", "인": "절", "묘": "태", "진": "양", "사": "장생", "오": "목욕", "미": "관대", "신": "건록", "유": "제왕", "술": "쇠", "해": "병" },
    "신": { "자": "장생", "축": "양", "인": "태", "묘": "절", "진": "묘", "사": "사", "오": "병", "미": "쇠", "신": "제왕", "유": "건록", "술": "관대", "해": "목욕" },
    "임": { "자": "제왕", "축": "쇠", "인": "병", "묘": "사", "진": "묘", "사": "절", "오": "태", "미": "양", "신": "장생", "유": "목욕", "술": "관대", "해": "건록" },
    "계": { "자": "건록", "축": "관대", "인": "목욕", "묘": "장생", "진": "양", "사": "태", "오": "절", "미": "묘", "신": "사", "유": "병", "술": "쇠", "해": "제왕" }
  };
  return mapping[baseDayStem] ? mapping[baseDayStem][branch] || "" : "";
}

export function getTwelveShinsal(yearBranch, branch) {
  const mapping = {
    "자": { "자": "장성", "축": "반안", "인": "역마", "묘": "육해", "진": "화개", "사": "겁살", "오": "재살", "미": "천살", "신": "지살", "유": "년살", "술": "월살", "해": "망신" },
    "축": { "자": "망신", "축": "장성", "인": "반안", "묘": "역마", "진": "육해", "사": "화개", "오": "겁살", "미": "재살", "신": "천살", "유": "지살", "술": "년살", "해": "월살" },
    "인": { "자": "월살", "축": "망신", "인": "장성", "묘": "반안", "진": "역마", "사": "육해", "오": "화개", "미": "겁살", "신": "재살", "유": "천살", "술": "지살", "해": "년살" },
    "묘": { "자": "년살", "축": "월살", "인": "망신", "묘": "장성", "진": "반안", "사": "역마", "오": "육해", "미": "화개", "신": "겁살", "유": "재살", "술": "천살", "해": "지살" },
    "진": { "자": "지살", "축": "년살", "인": "월살", "묘": "망신", "진": "장성", "사": "반안", "오": "역마", "미": "육해", "신": "화개", "유": "겁살", "술": "재살", "해": "천살" },
    "사": { "자": "천살", "축": "지살", "인": "년살", "묘": "월살", "진": "망신", "사": "장성", "오": "반안", "미": "역마", "신": "육해", "유": "화개", "술": "겁살", "해": "재살" },
    "오": { "자": "재살", "축": "천살", "인": "지살", "묘": "년살", "진": "월살", "사": "망신", "오": "장성", "미": "반안", "신": "역마", "유": "육해", "술": "화개", "해": "겁살" },
    "미": { "자": "겁살", "축": "재살", "인": "천살", "묘": "지살", "진": "년살", "사": "월살", "오": "망신", "미": "장성", "신": "반안", "유": "역마", "술": "육해", "해": "화개" },
    "신": { "자": "화개", "축": "겁살", "인": "재살", "묘": "천살", "진": "지살", "사": "년살", "오": "월살", "미": "망신", "신": "장성", "유": "반안", "술": "역마", "해": "육해" },
    "유": { "자": "육해", "축": "화개", "인": "겁살", "묘": "재살", "진": "천살", "사": "지살", "오": "년살", "미": "월살", "신": "망신", "유": "장성", "술": "반안", "해": "역마" },
    "술": { "자": "역마", "축": "육해", "인": "화개", "묘": "겁살", "진": "재살", "사": "천살", "오": "지살", "미": "년살", "신": "월살", "유": "망신", "술": "장성", "해": "반안" },
    "해": { "자": "반안", "축": "역마", "인": "육해", "묘": "화개", "진": "겁살", "사": "재살", "오": "천살", "미": "지살", "신": "년살", "유": "월살", "술": "망신", "해": "장성" }
  };
  return mapping[yearBranch] ? mapping[yearBranch][branch] || "" : "";
}

export function getHourStemArithmetic(daySet, hourBranchIndex) {
  const dayStem = getDayStem(daySet);
  const idx = Cheongan.indexOf(dayStem);
  if (idx === -1) return "";
  if ([0, 2, 4, 6, 8].includes(idx)) {
    return Cheongan[((idx * 2) + hourBranchIndex) % 10];
  } else {
    return Cheongan[((idx * 2) + hourBranchIndex + 2) % 10];
  }
}

export function getDayStem(dayGanZhiStr) {
  if (!dayGanZhiStr || typeof dayGanZhiStr !== "string" || dayGanZhiStr.length === 0) {
    console.error("getDayStem: 인자가 유효하지 않습니다. 기본값 '갑' 사용");
    return "갑";
  }
  return dayGanZhiStr.charAt(0);
}

export function getHourStem(daySet, hourBranchIndex) {
  const dayStem = getDayStem(daySet);
  const fixedDayMapping = {
    "갑": ["병인", "정묘", "무진", "기사", "경오", "신미", "임신", "계유", "갑술", "을해", "병자", "정축"],
    "을": ["무인", "기묘", "경진", "신사", "임오", "계미", "갑신", "을유", "병술", "정해", "무자", "기축"],
    "병": ["경인", "신묘", "임진", "계사", "갑오", "을미", "병신", "정유", "무술", "기해", "경자", "신축"],
    "정": ["임인", "계묘", "갑진", "을사", "병오", "정미", "무신", "기유", "경술", "신해", "임자", "계축"],
    "무": ["갑인", "을묘", "병진", "정사", "무오", "기미", "경신", "신유", "임술", "계해", "갑자", "을축"],
    "기": ["병인", "정묘", "무진", "기사", "경오", "신미", "임신", "계유", "갑술", "을해", "병자", "정축"],
    "경": ["무인", "기묘", "경진", "신사", "임오", "계미", "갑신", "을유", "병술", "정해", "무자", "기축"],
    "신": ["경인", "신묘", "임진", "계사", "갑오", "을미", "병신", "정유", "무술", "기해", "경자", "신축"],
    "임": ["임인", "계묘", "갑진", "을사", "병오", "정미", "무신", "기유", "경술", "신해", "임자", "계축"],
    "계": ["갑인", "을묘", "병진", "정사", "무오", "기미", "경신", "신유", "임술", "계해", "갑자", "을축"]
  };
  if (fixedDayMapping.hasOwnProperty(dayStem)) {
    const mappedArray = fixedDayMapping[dayStem];
    if (mappedArray.length === 12 && hourBranchIndex >= 0 && hourBranchIndex < 12) {
      return mappedArray[hourBranchIndex].charAt(0);
    }
  }
  const dayStemIndex = Cheongan.indexOf(dayStem);
  return (dayStemIndex % 2 === 0)
    ? Cheongan[(dayStemIndex * 2 + hourBranchIndex) % 10]
    : Cheongan[(dayStemIndex * 2 + hourBranchIndex + 2) % 10];
}
