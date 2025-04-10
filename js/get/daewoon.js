// 대운 관련

export function 대운_get(
    gender, 
    ipchun, 
    monthZhi, 
    Cheongan,
    correctedDate, 
    today,
    year, 
    태양의_절기_get, 
    일_간지_get,
    월_넘버_get, 
    연_간지_get,
    월_간지_get, 
    절기_찾는_함수, 
    그래고리력_to_율리우스일, 
    jdToCalendarGregorian, 
    getSunLongitude, 
    육십갑자_매핑,
    get120YearAverages
  ) {
  
  const 연_간지_상수 = 연_간지_get(correctedDate, year, ipchun, 육십갑자_매핑);
  const 월_간지_상수 = 월_간지_get(
    today, 
    year, 
    Cheongan, monthZhi, 
    태양의_절기_get, 
    월_넘버_get, 
    연_간지_get, 
    절기_찾는_함수, 
    그래고리력_to_율리우스일, 
    jdToCalendarGregorian, 
    getSunLongitude, 
    ipchun, 
    육십갑자_매핑
  );
  const dayStemRef = 일_간지_get(correctedDate, 육십갑자_매핑, 그래고리력_to_율리우스일).charAt(0);
  const isYang = ["갑", "병", "무", "경", "임"].includes(연_간지_상수.charAt(0));
  const isForward = (gender === "남" && isYang) || (gender === "여" && !isYang);
  const currentSolarTerms = 태양의_절기_get(year, 절기_찾는_함수, 그래고리력_to_율리우스일, jdToCalendarGregorian, getSunLongitude);
  const previousSolarTerms = 태양의_절기_get(year - 1, 절기_찾는_함수, 그래고리력_to_율리우스일, jdToCalendarGregorian, getSunLongitude);
  const nextSolarTerms = 태양의_절기_get(year + 1, 절기_찾는_함수, 그래고리력_to_율리우스일, jdToCalendarGregorian, getSunLongitude);
  const allTerms = [...previousSolarTerms, ...currentSolarTerms, ...nextSolarTerms]
                    .sort((a, b) => a.date - b.date);
  
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
  const avgData = get120YearAverages(targetTerm.date);
  let dynamicWoljuCycle = avgData.averageDecade;
  const avgMonthLength = avgData.averageMonth;

  let diffDays;
  if (isForward) {
    diffDays = (targetTerm.date.getTime() - birthDate.getTime()) / oneDayMs;
  } else {
    diffDays = (birthDate.getTime() - targetTerm.date.getTime()) / oneDayMs;
  }

  //const baseNumber = (daysDiff / avgData.averageMonth) * 10;
  let ratio = diffDays / avgMonthLength;
  const offset = ratio * 10;
  const baseNumber = Number(offset.toFixed(4));
  
  let currentMonthIndex = monthZhi.indexOf(월_간지_상수.charAt(1));
  let monthStemIndex = Cheongan.indexOf(월_간지_상수.charAt(0));
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

export function 대운_문자열_get(
  birthPlace,
  gender, 
  대운_get,
  ipchun, 
  monthZhi, 
  Cheongan,
  correctedDate, 
  year, 
  태양의_절기_get, 
  일_간지_get,
  월_넘버_get, 
  연_간지_get,
  월_간지_get, 
  절기_찾는_함수, 
  그래고리력_to_율리우스일, 
  jdToCalendarGregorian, 
  getSunLongitude,  
  육십갑자_매핑,
  get120YearAverages,
  today
  ) {
  const data = 대운_get(
    birthPlace, 
    gender, 
    ipchun, 
    monthZhi, 
    Cheongan,
    correctedDate, 
    year, 
    태양의_절기_get, 
    일_간지_get,
    월_넘버_get, 
    연_간지_get,
    월_간지_get, 
    절기_찾는_함수, 
    그래고리력_to_율리우스일, 
    jdToCalendarGregorian, 
    getSunLongitude, 
    육십갑자_매핑,
    get120YearAverages,
    today
  );
  const listStr = data.list.map(item => `${item.age}(${item.stem}${item.branch})`).join(", ");
  return `대운수 ${data.base}, 대운 나이 목록: ${listStr}`;
}

export function 대운_함수(
  year, 
  month, 
  day, 
  birthPlace, 
  gender, 
  yajojasi, 
  isJasi, 
  isInsi,
  correctedDate,
  지지_매핑, 
  지지_정보_매핑,
  ipChun,
  today,
  사용할_시간_get,
  일_간지_get,
  시간_get,
  연_간지_get,
  월_간지_get,
  육십갑자_매핑,
  그래고리력_to_율리우스일,
  일간_get,
  fixedDayMapping,
  Cheongan,
  Jiji,
  태양의_절기_get,
  월_넘버_get,
  절기_찾는_함수,
  jdToCalendarGregorian,
  getSunLongitude,
  monthZhi,
  대운_get,
  대운_문자열_get,
  dayPillar,
  adjustBirthDate,
  get120YearAverages
) {
  const nominalBirthDate2 = new Date(year, month - 1, day + 1);
	const nominalBirthDatePrev = new Date(year, month - 1, day - 1);

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

  let hourBranch = 사용할_시간_get(today, 지지_정보_매핑);
  let hourBranchIndex = 지지_매핑.indexOf(hourBranch);

  const currentBoundary = boundaries[ hourBranchIndex ];
  const boundaryDate = new Date(correctedDate);
  boundaryDate.setDate(boundaryDate.getDate() + currentBoundary.dayOffset);
  boundaryDate.setHours(currentBoundary.hour, currentBoundary.minute, 0, 0);

  const solarTime = new Date(correctedDate.getTime() + 1 * 60000);
  if (hourBranchIndex === 0) {
    if (solarTime < boundaryDate) {
      hourBranchIndex = 11;
    } else {
      dayPillar = 일_간지_get(correctedDate, 육십갑자_매핑, 그래고리력_to_율리우스일);
    }
  } else if(hourBranchIndex === 1) {
    hourBranchIndex = 1;
  }

  if (isInsi && correctedDate.getHours() < 3) {
    dayPillar = 일_간지_get(nominalBirthDatePrev, 육십갑자_매핑, 그래고리력_to_율리우스일);
  } else if (hourBranchIndex === 0){
    dayPillar = 일_간지_get(correctedDate, 육십갑자_매핑, 그래고리력_to_율리우스일);
  } else {
    dayPillar = 일_간지_get(nominalBirthDatePrev, 육십갑자_매핑, 그래고리력_to_율리우스일);
  }

  if (hourBranchIndex === 0 && (yajojasi && correctedDate.getHours() >= 0 && correctedDate.getHours() <= 3) || hourBranchIndex === 0 && (isJasi && correctedDate.getHours() >= 0 && correctedDate.getHours() <= 3)){
    dayPillar = 일_간지_get(nominalBirthDatePrev, 육십갑자_매핑, 그래고리력_to_율리우스일);
  } else if (hourBranchIndex === 0 && (yajojasi && correctedDate.getHours() < 24) || hourBranchIndex === 0 && (isJasi && correctedDate.getHours() < 24)) {
    dayPillar = 일_간지_get(correctedDate, 육십갑자_매핑, 그래고리력_to_율리우스일);
  }
  const hourStem = 시간_get(dayPillar, hourBranchIndex, 일간_get, fixedDayMapping, Cheongan);
  const hourPillar = hourStem + Jiji[hourBranchIndex];

  const yearPillar = 연_간지_get(today, year, ipChun, 육십갑자_매핑);
  const monthPillar = 월_간지_get(
    today, year, today, Cheongan, monthZhi, 태양의_절기_get, 월_넘버_get, 연_간지_get, 
    절기_찾는_함수, 그래고리력_to_율리우스일, jdToCalendarGregorian, getSunLongitude, ipChun, 육십갑자_매핑
  );

  if (yajojasi && correctedDate.getHours() >= 24){
    const daypillar = 일_간지_get(correctedDate, 육십갑자_매핑, 그래고리력_to_율리우스일);
    return `${yearPillar} ${monthPillar} ${daypillar} ${hourPillar}, 
    ${대운_문자열_get(
      birthPlace, 
      gender, 
      대운_get,
      correctedDate, 
      today,
      ipChun, 
      monthZhi, 
      Cheongan,
      correctedDate, 
      year, 
      태양의_절기_get, 
      일_간지_get,
      월_넘버_get, 
      연_간지_get,
      월_간지_get, 
      절기_찾는_함수, 
      그래고리력_to_율리우스일, 
      jdToCalendarGregorian, 
      getSunLongitude,  
      육십갑자_매핑,
      adjustBirthDate,
      get120YearAverages
    )}`;
  } 
    
  if (isJasi && correctedDate.getHours() >= 23){
    const daypillar = 일_간지_get(nominalBirthDate2, 육십갑자_매핑, 그래고리력_to_율리우스일);
    return `${yearPillar} ${monthPillar} ${daypillar} ${hourPillar}, 
    ${대운_문자열_get(
      birthPlace, 
      gender, 
      대운_get,
      correctedDate, 
      today,
      ipChun, 
      monthZhi, 
      Cheongan,
      correctedDate, 
      year, 
      태양의_절기_get, 
      일_간지_get,
      월_넘버_get, 
      연_간지_get,
      월_간지_get, 
      절기_찾는_함수, 
      그래고리력_to_율리우스일, 
      jdToCalendarGregorian, 
      getSunLongitude,  
      육십갑자_매핑,
      adjustBirthDate,
      get120YearAverages
    )}`;
  } 

  if (isInsi && correctedDate.getHours() < 3){
    const daypillar = 일_간지_get(nominalBirthDatePrev, 육십갑자_매핑, 그래고리력_to_율리우스일);
    return `${yearPillar} ${monthPillar} ${daypillar} ${hourPillar}, 
    ${대운_문자열_get(
      birthPlace, 
      gender, 
      대운_get,
      correctedDate, 
      today,
      ipChun, 
      monthZhi, 
      Cheongan,
      correctedDate, 
      year, 
      태양의_절기_get, 
      일_간지_get,
      월_넘버_get, 
      연_간지_get,
      월_간지_get, 
      절기_찾는_함수, 
      그래고리력_to_율리우스일, 
      jdToCalendarGregorian, 
      getSunLongitude,  
      육십갑자_매핑,
      adjustBirthDate,
      get120YearAverages
    ) }`;
  } else {
    const daypillar = 일_간지_get(correctedDate, 육십갑자_매핑, 그래고리력_to_율리우스일);
    return `${yearPillar} ${monthPillar} ${daypillar} ${hourPillar}, 
    ${대운_문자열_get(
      birthPlace, 
      gender, 
      대운_get,
      correctedDate, 
      today,
      ipChun, 
      monthZhi, 
      Cheongan,
      correctedDate, 
      year, 
      태양의_절기_get, 
      일_간지_get,
      월_넘버_get, 
      연_간지_get,
      월_간지_get, 
      절기_찾는_함수, 
      그래고리력_to_율리우스일, 
      jdToCalendarGregorian, 
      getSunLongitude,  
      육십갑자_매핑,
      adjustBirthDate,
      get120YearAverages) }`;
  }	
}