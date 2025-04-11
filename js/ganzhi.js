//
export function 연주_구함(dateObj, year, ipChun, 육십갑자) {
  const actualYear = (dateObj < ipChun) ? year - 1 : year;
  const yearIndex = ((actualYear - 4) % 60 + 60) % 60;
  return 육십갑자[yearIndex];
}

export function 월주_구함(boundaries, dateObj, solarYear, 월_넘버, 연주_구함, 천간, 월_간지, ipChun, 육십갑자) {
  const monthNumber = 월_넘버(dateObj, boundaries);
  const yearGanZhi = 연주_구함(dateObj, solarYear, ipChun, 육십갑자);
  const yearStem = yearGanZhi.charAt(0);
  const yearStemIndex = 천간.indexOf(yearStem) + 1;
  const monthStemIndex = ((yearStemIndex * 2) + monthNumber - 1) % 10;
  const monthStem = 천간[monthStemIndex];
  const monthBranch = 월_간지[monthNumber - 1];
  return monthStem + monthBranch;
}

export function 일주_구함(dateObj, 율리우스, 육십갑자) {
  let d = new Date(dateObj.getTime());
  const jd = Math.floor(율리우스(d.getFullYear(), d.getMonth() + 1, d.getDate()));
  return 육십갑자[(jd + 50) % 60] || "";
}

export function 시지_인덱스_구함(dateObj) {
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


export function 일간_구함(dayGanZhiStr) {
  if (!dayGanZhiStr || typeof dayGanZhiStr !== "string" || dayGanZhiStr.length === 0) {
    console.error("getDayStem: 인자가 유효하지 않습니다. 기본값 '갑' 사용"); return "갑";
  }
  return dayGanZhiStr.charAt(0);
}

// getHourStem 함수
export function 시주_구함(일주, 천간, 시지_인덱스_구함, 월_시두법_인시) {
  const dayStem = 일간_구함(일주);

  const 사용_월시두법 = false;

  if (사용_월시두법 && 월_시두법_인시.hasOwnProperty(dayStem)) {
    const mappedArray = 월_시두법_인시[dayStem];
    if (mappedArray.length === 12 && 시지_인덱스_구함 >= 0 && 시지_인덱스_구함 < 12) {
      return mappedArray[시지_인덱스_구함].charAt(0);
    }
  }

  const 일간_인덱스 = 천간.indexOf(dayStem);
  return (일간_인덱스 % 2 === 0)
    ? 천간[(일간_인덱스 * 2 + 시지_인덱스_구함) % 10]
    : 천간[(일간_인덱스 * 2 + 시지_인덱스_구함 + 2) % 10];
}

