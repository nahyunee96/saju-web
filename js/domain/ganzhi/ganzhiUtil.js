
// ganzhiUtil.js = 간지 유틸 함수들 창고
import { ipChun } from "../solar/solarTerm.js";

// 입력된 날짜가 315도 즉, 입춘 전인지 후 해당 년도를 판별하는 함수
export function 연의_간지를_구함(dateObj, year, ipChun, 육십갑자_순서_매핑) {
  const actualYear = (dateObj < ipChun) ? year - 1 : year;
  const yearIndex = ((actualYear - 4) % 60 + 60) % 60;
  return 육십갑자_순서_매핑[yearIndex];
}

// 입력된 날짜 기준으로 해당 월의 간지(천간+지지)를 구하는 함수
export function 월의_간지를_구함(
  dateObj,
  solarYear,
  절기_기준_범위,
  이_절기가_몇번째_인가요,
  연의_간지를_구함,
  간지_월_순서_매핑
) {
  const boundaries = 절기_기준_범위(solarYear);
  const monthNumber = 이_절기가_몇번째_인가요(dateObj, boundaries);
  const yearGanZhi = 연의_간지를_구함(dateObj, solarYear);
  
  const yearStem = yearGanZhi.charAt(0);
  const yearStemIndex = cheongan.indexOf(yearStem) + 1;
  const monthStemIndex = ((yearStemIndex * 2) + monthNumber - 1) % 10;
  
  const monthStem = Cheongan[monthStemIndex];
  const monthBranch = 간지_월_순서_매핑[monthNumber - 1];

  return monthStem + monthBranch;
}

export function 연의_간지를_출력함(getDate, effectiveYear) {
  return 연의_간지를_구함(getDate, effectiveYear);
}

export function 월의_간지를_출력함(getDate, effectiveYear) {
  return 월의_간지를_구함(getDate, effectiveYear);
}

export function 연_간지_출력_상수(getDate, effectiveYear) {
  return 연의_간지를_출력함(getDate, effectiveYear);
}

export function 월_간지_출력_상수(getDate, effectiveYear) {
  return 월의_간지를_출력함(getDate, effectiveYear);
}

// 날짜를 기준으로 율리우스일(JD)로 변환한 뒤, 해당 JD 기준으로 육십갑자 배열에서 일간지를 구하는 함수
export function 일_간지를_구함(dateObj, calendarToJD, 육십갑자_순서_매핑) {
  const d = new Date(dateObj.getTime()); // 원본 보호용
  const jd = Math.floor(calendarToJD(d.getFullYear(), d.getMonth() + 1, d.getDate()));
  return 육십갑자_순서_매핑[(jd + 50) % 60] || "";
}


// 유효성 검사를 포함해 일간의 천간만 추출하는 유틸 함수
export function 일간만_추출함(dayGanZhiStr) {
  if (typeof dayGanZhiStr !== "string" || dayGanZhiStr.length === 0) {
    console.log("인자가 유효하지 않습니다. 기본값 '갑' 사용");
    return "-";
  }
  return dayGanZhiStr[0];
}

// 일간과 시간 지지(인덱스)를 기준으로 시간의 천간을 구하는 함수
export function 시간_천간_구함(dayPillar, hourBranchIndex, 일간만_추출함, 천간_매핑, 월_시_두법_매핑) {
  const dayStem = 일간만_추출함(dayPillar);
  if (월_시_두법_매핑?.hasOwnProperty(dayStem)) {
    const mappedArray = 월_시_두법_매핑[dayStem];
    if (mappedArray?.length === 12 && hourBranchIndex >= 0 && hourBranchIndex < 12) {
      return mappedArray[hourBranchIndex].charAt(0);
    }
  }
  const dayStemIndex = 천간_매핑.indexOf(dayStem);
  const offset = (dayStemIndex % 2 === 0) ? 0 : 2;
  return 천간_매핑[(dayStemIndex * 2 + hourBranchIndex + offset) % 10];
}


// 간지 인덱스 계산 함수
export function 간지_인덱스_구함(육십갑자_순서_매핑, ganzhi) { 
  return 육십갑자_순서_매핑.indexOf(ganzhi); 
}

export function 간지_인덱스_상세히_구함(i) { 
  const mod = ((i % 60) + 60) % 60; return 육십갑자_순서_매핑[mod]; 
}

// 데이터 year을 받아오면 그걸로 입춘을 계산해서 판별한다음 간지 인덱스를 구함
export function 연간_인덱스_구함(birthDate, 육십갑자_순서_매핑) {
  const year = birthDate.getFullYear();
  const effectiveYear = birthDate < ipChun ? year - 1 : year;
  const index = ((effectiveYear - 4) % 60 + 60) % 60;
  return 육십갑자_순서_매핑[index];
}