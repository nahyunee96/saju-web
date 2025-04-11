// 원국 계산 및 HTML 출력
// 순수 함수화: 모든 의존 함수 및 상수를 외부에서 주입받도록 구성

import { splitPillar } from "./calculration.js";

// 순수 함수: 원국 계산
export function 원국_계산(
  dateObj,
  solarYear,
  율리우스,
  율리우스_역변환,
  태양의_황경,
  {
    절기_날짜_찾음,
    절기_경계,
    월_넘버,
    연주_구함,
    월주_구함,
    일주_구함,
    시지_인덱스_구함,
    시주_구함,
    일간_구함,
    육십갑자,
    천간,
    지지,
    월_간지,
    ipChun,
    월_시두법_인시,
    천간_매핑
  }
) {
  const boundaries = 절기_경계(solarYear, 절기_날짜_찾음, 율리우스, 율리우스_역변환, 태양의_황경);
  const yearPillar = 연주_구함(dateObj, solarYear, ipChun, 육십갑자);
  const monthPillar = 월주_구함(boundaries, dateObj, solarYear, 월_넘버, 연주_구함, 천간, 월_간지, ipChun, 육십갑자);
  const dayPillar = 일주_구함(dateObj, 율리우스, 육십갑자);
  const hourBranchIndex = 시지_인덱스_구함(dateObj);
  const hourStem = 시주_구함(dayPillar, 천간, hourBranchIndex, 월_시두법_인시); 
  const hourBranch = 지지[hourBranchIndex]; 
  const hourPillar = hourStem + hourBranch;
  const baseDayStem = 일간_구함(dayPillar);

  return { yearPillar, monthPillar, dayPillar, hourPillar, baseDayStem };
}

// 비순수 함수: HTML 업데이트
export function 원국_HTML_반영(
  {
    yearPillar,
    monthPillar,
    dayPillar,
    hourPillar,
    baseDayStem
  },
  {
    천간_매핑,
    지지_매핑,
    지장간_매핑,
    십신_천간,
    십신_지지,
    십이운성,
    십이신살
  }
) {
  const pillars = {
    Y: splitPillar(yearPillar),
    M: splitPillar(monthPillar),
    D: splitPillar(dayPillar),
    H: splitPillar(hourPillar)
  };

  const dayStem = pillars.D.gan;

  ["Y", "M", "D", "H"].forEach(pos => {
    const gan = pillars[pos].gan;
    const ji = pillars[pos].ji;

    document.getElementById(`${pos}tEumyang`).textContent = 천간_매핑[gan]?.eumYang || "";
    document.getElementById(`${pos}tHanja`).textContent = 천간_매핑[gan]?.hanja || "";
    document.getElementById(`${pos}tHanguel`).textContent = 천간_매핑[gan]?.hanguel || "";
    document.getElementById(`${pos}t10sin`).textContent = 십신_천간[dayStem]?.[gan] || "";

    document.getElementById(`${pos}bEumyang`).textContent = 지지_매핑[ji]?.eumYang || "";
    document.getElementById(`${pos}bHanja`).textContent = 지지_매핑[ji]?.hanja || "";
    document.getElementById(`${pos}bHanguel`).textContent = 지지_매핑[ji]?.hanguel || "";

    const jj = 지장간_매핑[ji];
    for (let i = 0; i < 3; i++) {
      document.getElementById(`${pos}bJj${i + 1}`).textContent = jj?.[i] || "";
    }

    document.getElementById(`${pos}b10sin`).textContent = 십신_지지[dayStem]?.[ji] || "";
    document.getElementById(`${pos}b12ws`).textContent = 십이운성(dayStem, ji) || "";
    document.getElementById(`${pos}b12ss`).textContent = 십이신살(pillars.Y.ji, ji) || "";
  });

  
}