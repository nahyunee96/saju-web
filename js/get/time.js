// time과 관련

export function 년도_세팅_get(dateObj, ipChun) {  
  const year = dateObj.getFullYear();
  if (dateObj < ipChun) {
    return year - 1;
  } else {
    return year;
  }
}

export function 연_간지_get(dateObj, year, ipchun, sexagenaryCycle) {
  //const ipChun = findSolarTermDate(birthDate.getFullYear(), 315);
  const actualYear = (dateObj < ipchun) ? year - 1 : year;
  const yearIndex = ((actualYear - 4) % 60 + 60) % 60;
  return sexagenaryCycle[yearIndex];
}

export function 월_넘버_get(dateObj, boundaries) {
  for (let i = 0; i < boundaries.length - 1; i++) {
    if (dateObj >= boundaries[i].date && dateObj < boundaries[i + 1].date) {
      return i + 1;
    }
  }
  return 12;
}

export function 월_간지_get(
  dateObj, 
  year,  
  today,
  Cheongan, monthZhi, 
  태양의_절기_get, 
  월_넘버_get, 
  연_간지_get, 
  절기_찾는_함수, 
  그래고리력_to_율리우스일, 
  jdToCalendarGregorian, 
  getSunLongitude, 
  ipchun, 
  sexagenaryCycle, 
) {
  const boundaries = 태양의_절기_get(year, 절기_찾는_함수, 그래고리력_to_율리우스일, jdToCalendarGregorian, getSunLongitude);
  const monthNumber = 월_넘버_get(dateObj, boundaries);
  const yearGanZhi = 연_간지_get(today, year, ipchun, sexagenaryCycle);
  const yearStem = yearGanZhi.charAt(0), yearStemIndex = Cheongan.indexOf(yearStem) + 1;
  const monthStemIndex = ((yearStemIndex * 2) + monthNumber - 1) % 10;
  const monthStem = Cheongan[monthStemIndex], monthBranch = monthZhi[monthNumber - 1];
  return monthStem + monthBranch;
}

export function 일_간지_get(dateObj, sexagenaryCycle, 그래고리력_to_율리우스일) {

  let d = new Date(dateObj.getTime());
  
  const jd = Math.floor(그래고리력_to_율리우스일(d.getFullYear(), d.getMonth() + 1, d.getDate()));
  return sexagenaryCycle[(jd + 50) % 60] || "";
}


export function 일간_get(dayGanZhiStr) {
  return dayGanZhiStr.charAt(0);
}

export function 사용할_시간_get(dateObj, timeRanges) {
  let totalMinutes = dateObj.getHours() * 60 + dateObj.getMinutes();
  for (let i = 0; i < timeRanges.length; i++) {
    const { branch, start, end } = timeRanges[i];
    if (start < end) {
      if (totalMinutes >= start && totalMinutes < end) {
        return branch;
      }
    } else {
      // 자시의 경우: 23:00 ~ 24:00 또는 0:00 ~ 1:00
      if (totalMinutes >= start || totalMinutes < end) {
        return branch;
      }
    }
  }
  return null;
}

export function 시간_get(dayPillar, hourBranchIndex, 일간_get, fixedDayMapping, Cheongan) {
  const dayStem = 일간_get(dayPillar);
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