// [0] 출생지 보정 및 써머타임 함수
const cityLongitudes = {
  "서울특별시": 126.9780, "부산광역시": 129.1, "대구광역시": 128.6,
  "인천광역시": 126.7052, "광주광역시": 126.8530, "대전광역시": 127.3845,
  "울산광역시": 129.3114, "세종특별자치시": 127.2890,
  "수원시": 127.0014, "고양시": 126.83, "용인시": 127.1731,
  "성남시": 127.137, "부천시": 126.766, "안산시": 126.851,
  "안양시": 126.9566, "남양주시": 127.2623, "화성시": 126.831,
  "평택시": 127.1116, "시흥시": 126.79, "김포시": 126.715,
  "파주시": 126.783, "의정부시": 127.0469, "광명시": 126.8826,
  "광주시": 126.666, "군포시": 126.935, "이천시": 127.443,
  "양주시": 127.03, "오산시": 127.079, "구리시": 127.13,
  "안성시": 127.279, "포천시": 127.2, "의왕시": 126.931,
  "하남시": 127.214, "여주시": 127.652, "동두천시": 127.05,
  "과천시": 126.984, "가평군": 127.51, "양평군": 127.5, "연천군": 127.1,
  "춘천시": 127.729, "원주시": 127.93, "강릉시": 128.896, "동해시": 129.113,
  "태백시": 128.986, "속초시": 128.591, "삼척시": 129.168, "홍천군": 127.88,
  "횡성군": 128.425, "영월군": 128.613, "평창군": 128.424, "정선군": 128.7,
  "철원군": 127.415, "화천군": 127.753, "양구군": 128.47, "인제군": 128.116,
  "고성군": 128.467, "양양군": 128.692,
  "청주시": 127.4914, "충주시": 127.9323, "제천시": 128.1926, "보은군": 127.728,
  "옥천군": 127.609, "영동군": 128.382, "진천군": 127.439, "괴산군": 127.731,
  "음성군": 127.674, "단양군": 128.377, "증평군": 127.48,
  "천안시": 127.146, "공주시": 127.098, "보령시": 126.611, "아산시": 127.001,
  "서산시": 126.449, "논산시": 127.074, "계룡시": 127.264, "당진시": 126.621,
  "금산군": 127.386, "부여군": 126.802, "서천군": 126.781, "청양군": 126.856,
  "홍성군": 126.726, "예산군": 126.678, "태안군": 126.325,
  "전주시": 127.108, "군산시": 126.711, "익산시": 126.957, "정읍시": 126.846,
  "남원시": 127.392, "김제시": 126.871, "완주군": 127.062, "진안군": 127.229,
  "무주군": 127.69, "장수군": 127.891, "임실군": 127.409, "순창군": 127.13,
  "고창군": 126.785, "부안군": 126.73,
  "목포시": 126.411, "여수시": 127.643, "순천시": 127.496, "나주시": 126.717,
  "광양시": 127.695, "담양군": 126.984, "곡성군": 127.262, "구례군": 127.392,
  "고흥군": 127.384, "보성군": 127.122, "화순군": 127.04, "장흥군": 126.725,
  "강진군": 126.645, "해남군": 126.531, "영암군": 126.682, "무안군": 126.731,
  "함평군": 126.625, "영광군": 126.509, "장성군": 126.751, "완도군": 126.653,
  "진도군": 126.359, "신안군": 126.361,
  "포항시": 129.366, "경주시": 129.224, "김천시": 128.198, "안동시": 128.723,
  "구미시": 128.344, "영주시": 128.637, "영천시": 128.733, "상주시": 128.159,
  "문경시": 128.185, "경산시": 128.734, "군위군": 128.454, "의성군": 128.181,
  "청송군": 128.218, "영양군": 128.276, "영덕군": 128.703, "청도군": 128.626,
  "고령군": 128.347, "성주군": 128.177, "칠곡군": 128.54, "예천군": 128.245,
  "봉화군": 128.363, "울진군": 129.341, "울릉군": 130.904,
  "창원시": 128.681, "김해시": 128.881, "진주시": 128.092, "양산시": 129.045,
  "거제시": 128.678, "사천시": 128.189, "밀양시": 128.747, "통영시": 128.425,
  "거창군": 128.184, "고성군": 128.373, "남해군": 127.902, "산청군": 127.779,
  "창녕군": 128.415, "하동군": 127.997, "함안군": 128.389, "함양군": 127.81,
  "합천군": 128.175,
  "의령군": 128.29,
  "제주시": 126.5312, "서귀포시": 126.715
};

function getSummerTimeInterval(year) {
  let interval = null;
  switch (year) {
    case 1948: interval = { start: new Date(1948, 4, 31, 0, 0), end: new Date(1948, 8, 22, 0, 0) }; break;
    case 1949: interval = { start: new Date(1949, 2, 31, 0, 0), end: new Date(1949, 8, 30, 0, 0) }; break;
    case 1950: interval = { start: new Date(1950, 3, 1, 0, 0), end: new Date(1950, 8, 10, 0, 0) }; break;
    case 1951: interval = { start: new Date(1951, 4, 6, 0, 0), end: new Date(1951, 8, 9, 0, 0) }; break;
    case 1955: interval = { start: new Date(1955, 3, 6, 0, 0), end: new Date(1955, 8, 22, 0, 0) }; break;
    case 1956: interval = { start: new Date(1956, 4, 20, 0, 0), end: new Date(1956, 8, 30, 0, 0) }; break;
    case 1957: interval = { start: new Date(1957, 4, 5, 0, 0), end: new Date(1957, 8, 22, 0, 0) }; break;
    case 1958: interval = { start: new Date(1958, 4, 4, 0, 0), end: new Date(1958, 8, 21, 0, 0) }; break;
    default: interval = null;
  }
  return interval;
}

function getEquationOfTime(dateObj) {
  const start = new Date(dateObj.getFullYear(), 0, 0);
  const N = Math.floor((dateObj - start) / (1000 * 60 * 60 * 24));
  const B = ((360 / 365) * (N - 81)) * Math.PI / 180;
  return 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
}

function adjustBirthDate(dateObj, birthPlace) {
  const cityLongitude = cityLongitudes[birthPlace] || cityLongitudes["서울특별시"];
  const longitudeCorrection = Math.round((cityLongitude - 135.1) * 4);
  const eqTime = getEquationOfTime(dateObj);
  let correctedTime = new Date(dateObj.getTime() + (longitudeCorrection + eqTime) * 60000);
  const summerInterval = getSummerTimeInterval(correctedTime.getFullYear());
  if (summerInterval && correctedTime >= summerInterval.start && correctedTime < summerInterval.end) {
    correctedTime = new Date(correctedTime.getTime() - 60 * 60000);
  }
  return correctedTime;
}

// [1] 천문/역법 함수
function calendarGregorianToJD(year, month, day) {
  if (month <= 2) { year -= 1; month += 12; }
  const a = Math.floor(year / 100);
  const b = 2 - a + Math.floor(a / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + b - 1524.5;
}

function jdToCalendarGregorian(jd) {
  const z = Math.floor(jd + 0.5), f = jd + 0.5 - z;
  let a = z;
  if (z >= 2299161) {
    const alpha = Math.floor((z - 1867216.25) / 36524.25);
    a = z + 1 + alpha - Math.floor(alpha / 4);
  }
  const b = a + 1524, c = Math.floor((b - 122.1) / 365.25),
        d = Math.floor(365.25 * c), e = Math.floor((b - d) / 30.6001);
  const day = b - d - Math.floor(30.6001 * e) + f;
  let month = e - 1; if (month > 12) month -= 12;
  let year = c - 4715; if (month > 2) year -= 1;
  return [year, month, day];
}

function getSunLongitude(jd) {
  const t = (jd - 2451545.0) / 36525;
  let L0 = (280.46646 + 36000.76983 * t + 0.0003032 * t * t) % 360;
  if (L0 < 0) L0 += 360;
  let M = (357.52911 + 35999.05029 * t - 0.0001537 * t * t) % 360;
  if (M < 0) M += 360;
  const Mrad = M * Math.PI / 180;
  const e = 0.016708634 - 0.000042037 * t - 0.0000001267 * t * t;
  const C = (1.914602 - 0.004817 * t - 0.000014 * t * t) * Math.sin(Mrad)
          + (0.019993 - 0.000101 * t) * Math.sin(2 * Mrad)
          + 0.000289 * Math.sin(3 * Mrad);
  let trueL = (L0 + C) % 360; if (trueL < 0) trueL += 360;
  return trueL;
}

function getJDFromDate(dateObj) {
  const y = dateObj.getFullYear(), m = dateObj.getMonth() + 1;
  const d = dateObj.getDate() + dateObj.getHours() / 24 + dateObj.getMinutes() / (24 * 60);
  return calendarGregorianToJD(y, m, d);
}

// [2] 절기 계산 함수
function findSolarTermDate(year, solarDegree) {
  const target = solarDegree % 360, jd0 = calendarGregorianToJD(year, 1, 1);
  const L0 = getSunLongitude(jd0), dailyMotion = 0.9856;
  let delta = target - L0; if (delta < 0) delta += 360;
  let jd = jd0 + delta / dailyMotion, iteration = 0, maxIter = 100, precision = 0.001;
  while (iteration < maxIter) {
    let L = getSunLongitude(jd), diff = target - L;
    if (diff > 180) diff -= 360; if (diff < -180) diff += 360;
    if (Math.abs(diff) < precision) break;
    jd += diff / dailyMotion; iteration++;
  }
  const [y, m, dFrac] = jdToCalendarGregorian(jd), d = Math.floor(dFrac), frac = dFrac - d;
  const hh = Math.floor(frac * 24), mm = Math.floor((frac * 24 - hh) * 60);
  const dateUTC = new Date(Date.UTC(y, m - 1, d, hh, mm));
  return new Date(dateUTC.getTime() + 9 * 3600 * 1000);
}

function getSolarTermBoundaries(solarYear) {
  let boundaries = [
    { solarDegree: 315, name: "입춘", date: findSolarTermDate(solarYear, 315) },
    { solarDegree: 345, name: "경칩", date: findSolarTermDate(solarYear, 345) },
    { solarDegree: 15,  name: "청명", date: findSolarTermDate(solarYear, 15) },
    { solarDegree: 45,  name: "입하", date: findSolarTermDate(solarYear, 45) },
    { solarDegree: 75,  name: "망종", date: findSolarTermDate(solarYear, 75) },
    { solarDegree: 105, name: "소서", date: findSolarTermDate(solarYear, 105) },
    { solarDegree: 135, name: "입추", date: findSolarTermDate(solarYear, 135) },
    { solarDegree: 165, name: "백로", date: findSolarTermDate(solarYear, 165) },
    { solarDegree: 195, name: "한로", date: findSolarTermDate(solarYear, 195) },
    { solarDegree: 225, name: "입동", date: findSolarTermDate(solarYear, 225) },
    { solarDegree: 255, name: "대설", date: findSolarTermDate(solarYear, 255) },
    { solarDegree: 285, name: "소한", date: findSolarTermDate(solarYear + 1, 285) },
    { name: "다음입춘", date: findSolarTermDate(solarYear + 1, 315) }
  ];
  boundaries.sort((a, b) => a.date - b.date);
  const start = findSolarTermDate(solarYear, 315), end = findSolarTermDate(solarYear + 1, 315);
  boundaries = boundaries.filter(term => term.date >= start && term.date < end);
  const offset = 8.84 * 3600 * 1000;
  return boundaries.map(term => ({ name: term.name, date: new Date(term.date.getTime() - offset) }));
}

function getMonthNumber(dateObj, boundaries) {
  for (let i = 0; i < boundaries.length - 1; i++) {
    if (dateObj >= boundaries[i].date && dateObj < boundaries[i + 1].date) {
      return i + 1;
    }
  }
  return 12;
}

function getYearGanZhi(dateObj, year) {
  const ipChun = findSolarTermDate(year, 315);
  const actualYear = (dateObj < ipChun) ? year - 1 : year;
  const yearIndex = ((actualYear - 4) % 60 + 60) % 60;
  return sexagenaryCycle[yearIndex];
}

function getMonthGanZhi(dateObj, solarYear) {
  const boundaries = getSolarTermBoundaries(solarYear);
  const monthNumber = getMonthNumber(dateObj, boundaries);
  const yearGanZhi = getYearGanZhi(dateObj, solarYear);
  const yearStem = yearGanZhi.charAt(0), yearStemIndex = Cheongan.indexOf(yearStem) + 1;
  const monthStemIndex = ((yearStemIndex * 2) + monthNumber - 1) % 10;
  const monthStem = Cheongan[monthStemIndex], monthBranch = MONTH_ZHI[monthNumber - 1];
  return monthStem + monthBranch;
}

// [3] 전통 간지 상수 및 배열
const MONTH_ZHI = ["인", "묘", "진", "사", "오", "미", "신", "유", "술", "해", "자", "축"];
const Cheongan = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"];
const Jiji = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"];

// [4] 일간 계산
function getDayGanZhi(dateObj) {

  let d = new Date(dateObj.getTime());
  
  const jd = Math.floor(calendarGregorianToJD(d.getFullYear(), d.getMonth() + 1, d.getDate()));
  return sexagenaryCycle[(jd + 50) % 60] || "";
}

// [5] 고정 시주 계산 (참고용)
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


function getHourBranchIndex(dateObj, isSunTime) {
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


function getDayStem(dayGanZhiStr) {
  if (!dayGanZhiStr || typeof dayGanZhiStr !== "string" || dayGanZhiStr.length === 0) {
    console.error("getDayStem: 인자가 유효하지 않습니다. 기본값 '갑' 사용"); return "갑";
  }
  return dayGanZhiStr.charAt(0);
}

// getHourStem 함수
function getHourStem(daySet, hourBranchIndex) {
  const dayStem = getDayStem(daySet);
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


// [8] 최종 사주 및 대운 계산 관련 함수
function splitSet(Set) {
  return (Set && Set.length >= 2) ? { gan: Set.charAt(0), ji: Set.charAt(1) } : { gan: "-", ji: "-" };
}

const sexagenaryCycle = [
  "갑자", "을축", "병인", "정묘", "무진", "기사", "경오", "신미", "임신", "계유",
  "갑술", "을해", "병자", "정축", "무인", "기묘", "경진", "신사", "임오", "계미",
  "갑신", "을유", "병술", "정해", "무자", "기축", "경인", "신묘", "임진", "계사",
  "갑오", "을미", "병신", "정유", "무술", "기해", "경자", "신축", "임인", "계묘",
  "갑진", "을사", "병오", "정미", "무신", "기유", "경술", "신해", "임자", "계축",
  "갑인", "을묘", "병진", "정사", "무오", "기미", "경신", "신유", "임술", "계해"
];

const stemMapping = {
  "갑": { hanja: "甲", hanguel: "갑목", eumYang: "양" },
  "을": { hanja: "乙", hanguel: "을목", eumYang: "음" },
  "병": { hanja: "丙", hanguel: "병화", eumYang: "양" },
  "정": { hanja: "丁", hanguel: "정화", eumYang: "음" },
  "무": { hanja: "戊", hanguel: "무토", eumYang: "양" },
  "기": { hanja: "己", hanguel: "기토", eumYang: "음" },
  "경": { hanja: "庚", hanguel: "경금", eumYang: "양" },
  "신": { hanja: "辛", hanguel: "신금", eumYang: "음" },
  "임": { hanja: "壬", hanguel: "임수", eumYang: "양" },
  "계": { hanja: "癸", hanguel: "계수", eumYang: "음" }
};

const branchMapping = {
  "자": { hanja: "子", hanguel: "자수", eumYang: "양(음)" },
  "축": { hanja: "丑", hanguel: "축토", eumYang: "음" },
  "인": { hanja: "寅", hanguel: "인목", eumYang: "양" },
  "묘": { hanja: "卯", hanguel: "묘목", eumYang: "음" },
  "진": { hanja: "辰", hanguel: "진토", eumYang: "양" },
  "사": { hanja: "巳", hanguel: "사화", eumYang: "음(양)" },
  "오": { hanja: "午", hanguel: "오화", eumYang: "양(음)" },
  "미": { hanja: "未", hanguel: "미토", eumYang: "음" },
  "신": { hanja: "申", hanguel: "신금", eumYang: "양" },
  "유": { hanja: "酉", hanguel: "유금", eumYang: "음" },
  "술": { hanja: "戌", hanguel: "술토", eumYang: "양" },
  "해": { hanja: "亥", hanguel: "해수", eumYang: "음(양)" }
};

function getDaewoonData(birthPlace, gender) {
  const birthDate = globalState.correctedBirthDate;
  const originalDate = new Date(birthDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  const correctedDate = adjustBirthDate(originalDate, birthPlace);
  const inputYear = globalState.correctedBirthDate.getFullYear();
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

function getHourStemArithmetic(daySet, hourBranchIndex) {
  // daySet에서 천간(첫 글자)을 구합니다.
  const dayStem = getDayStem(daySet);  
  const idx = Cheongan.indexOf(dayStem);
  if (idx === -1) return "";
  if ([0, 2, 4, 6, 8].includes(idx)) {
    return Cheongan[((idx * 2) + hourBranchIndex) % 10];
  } else {
    return Cheongan[((idx * 2) + hourBranchIndex + 2) % 10];
  }
}

function getDaewoonDataStr(birthPlace, gender) {
  const data = getDaewoonData(birthPlace, gender);
  const listStr = data.list.map(item => `${item.age}(${item.stem}${item.branch})`).join(", ");
  return `대운수 ${data.base}, 대운 나이 목록: ${listStr}`;
}

const timeRanges = [
  { branch: '자', hanja: '子', start: 23 * 60, end: 1 * 60 },
  { branch: '축', hanja: '丑', start: 1 * 60,  end: 3 * 60 },
  { branch: '인', hanja: '寅', start: 3 * 60,  end: 5 * 60 },
  { branch: '묘', hanja: '卯', start: 5 * 60,  end: 7 * 60 },
  { branch: '진', hanja: '辰', start: 7 * 60,  end: 9 * 60 },
  { branch: '사', hanja: '巳', start: 9 * 60,  end: 11 * 60 },
  { branch: '오', hanja: '午', start: 11 * 60, end: 13 * 60 },
  { branch: '미', hanja: '未', start: 13 * 60, end: 15 * 60 },
  { branch: '신', hanja: '申', start: 15 * 60, end: 17 * 60 },
  { branch: '유', hanja: '酉', start: 17 * 60, end: 19 * 60 },
  { branch: '술', hanja: '戌', start: 19 * 60, end: 21 * 60 },
  { branch: '해', hanja: '亥', start: 21 * 60, end: 23 * 60 }
];

function getHourBranchUsingArray(dateObj) {
  // 총 분 계산
  let totalMinutes = dateObj.getHours() * 60 + dateObj.getMinutes();
  // 각 시(지지)별 시간 범위 설정 (자시는 23:00 ~ 1:00, 나머지는 2시간씩)
  
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

function getFourSetsWithDaewoon(year, month, day, hour, minute, birthPlace, gender) {
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

function debugSolarTermBoundaries(solarYear) {
  return getSolarTermBoundaries(solarYear);
}

let globalState = { birthYear: null, month: null, day: null, birthPlace: null, gender: null, daewoonData: null, sewoonStartYear: null };

const tenGodMappingForStems = {
  "갑": { "갑": "비견", "을": "겁재", "병": "식신", "정": "상관", "무": "편재", "기": "정재", "경": "편관", "신": "정관", "임": "편인", "계": "정인" },
  "을": { "갑": "겁재", "을": "비견", "병": "상관", "정": "식신", "무": "정재", "기": "편재", "경": "정관", "신": "편관", "임": "정인", "계": "편인" },
  "병": { "갑": "편인", "을": "정인", "병": "비견", "정": "겁재", "무": "식신", "기": "상관", "경": "편재", "신": "정재", "임": "편관", "계": "정관" },
  "정": { "갑": "정인", "을": "편인", "병": "겁재", "정": "비견", "무": "상관", "기": "식상", "경": "정재", "신": "편재", "임": "정관", "계": "편관" },
  "무": { "갑": "편관", "을": "정관", "병": "편인", "정": "정인", "무": "비견", "기": "겁재", "경": "식신", "신": "상관", "임": "편재", "계": "정재" },
  "기": { "갑": "정관", "을": "편관", "병": "정인", "정": "편인", "무": "겁재", "기": "비견", "경": "상관", "신": "식신", "임": "정재", "계": "편재" },
  "경": { "갑": "편재", "을": "정재", "병": "편관", "정": "정관", "무": "편인", "기": "정인", "경": "비견", "신": "겁재", "임": "식신", "계": "상관" },
  "신": { "갑": "정재", "을": "편재", "병": "정관", "정": "편관", "무": "정인", "기": "편인", "경": "겁재", "신": "비견", "임": "상관", "계": "식신" },
  "임": { "갑": "식신", "을": "상관", "병": "편재", "정": "정재", "무": "편관", "기": "정관", "경": "편인", "신": "정인", "임": "비견", "계": "겁재" },
  "계": { "갑": "식신", "을": "상관", "병": "편재", "정": "정재", "무": "편관", "기": "정관", "경": "편인", "신": "정인", "임": "비견", "계": "겁재" }
};

const tenGodMappingForBranches = {
  "갑": { "자": "정인", "축": "정재", "인": "비견", "묘": "겁재", "진": "편재", "사": "상관", "오": "식신", "미": "정재", "신": "편관", "유": "정관", "술": "편재", "해": "편인" },
  "을": { "자": "편인", "축": "편재", "인": "겁재", "묘": "비견", "진": "정재", "사": "식신", "오": "상관", "미": "편재", "신": "정관", "유": "편관", "술": "정재", "해": "정인" },
  "병": { "자": "정관", "축": "상관", "인": "편인", "묘": "정인", "진": "식신", "사": "비견", "오": "겁살", "미": "상관", "신": "편재", "유": "정재", "술": "식신", "해": "편인" },
  "정": { "자": "편관", "축": "식신", "인": "정인", "묘": "편인", "진": "상관", "사": "겁재", "오": "비견", "미": "식신", "신": "정재", "유": "편재", "술": "상관", "해": "정인" },
  "무": { "자": "정재", "축": "겁재", "인": "편관", "묘": "정관", "진": "비견", "사": "편인", "오": "정인", "미": "겁재", "신": "식신", "유": "상관", "술": "비견", "해": "편재" },
  "기": { "자": "편재", "축": "비견", "인": "정관", "묘": "편관", "진": "겁재", "사": "정인", "오": "편인", "미": "비견", "신": "상관", "유": "식신", "술": "겁재", "해": "정재" },
  "경": { "자": "상관", "축": "정인", "인": "편재", "묘": "정재", "진": "편인", "사": "편관", "오": "정관", "미": "정인", "신": "비견", "유": "겁재", "술": "편인", "해": "식신" },
  "신": { "자": "식신", "축": "편인", "인": "정재", "묘": "편재", "진": "정인", "사": "정관", "오": "편관", "미": "편인", "신": "겁재", "유": "비견", "술": "정인", "해": "상관" },
  "임": { "자": "겁재", "축": "정관", "인": "식상", "묘": "상관", "진": "편관", "사": "편재", "오": "정재", "미": "정관", "신": "편인", "유": "정인", "술": "편인", "해": "비견" },
  "계": { "자": "비견", "축": "편관", "인": "상관", "묘": "식신", "진": "정관", "사": "정재", "오": "편재", "미": "편관", "신": "정인", "유": "편인", "술": "정인", "해": "겁재" }
};

const colorMapping = {
  "甲": { textColor: 'green', bgColor: 'b_green' },
  "乙": { textColor: 'green', bgColor: 'b_green' },
  "丙": { textColor: 'red', bgColor: 'b_red' },
  "丁": { textColor: 'red', bgColor: 'b_red' },
  "戊": { textColor: 'yellow', bgColor: 'b_yellow' },
  "己": { textColor: 'yellow', bgColor: 'b_yellow' },
  "庚": { textColor: 'white', bgColor: 'b_white' },
  "辛": { textColor: 'white', bgColor: 'b_white' },
  "壬": { textColor: 'black', bgColor: 'b_black' },
  "癸": { textColor: 'black', bgColor: 'b_black' },
  "子": { textColor: 'black', bgColor: 'b_black' },
  "丑": { textColor: 'yellow', bgColor: 'b_yellow' },
  "寅": { textColor: 'green', bgColor: 'b_green' },
  "卯": { textColor: 'green', bgColor: 'b_green' },
  "辰": { textColor: 'yellow', bgColor: 'b_yellow' },
  "巳": { textColor: 'red', bgColor: 'b_red' },
  "午": { textColor: 'red', bgColor: 'b_red' },
  "未": { textColor: 'yellow', bgColor: 'b_yellow' },
  "申": { textColor: 'white', bgColor: 'b_white' },
  "酉": { textColor: 'white', bgColor: 'b_white' },
  "戌": { textColor: 'yellow', bgColor: 'b_yellow' },
  "亥": { textColor: 'black', bgColor: 'b_black' }
};

const hiddenStemMapping = {
  "자": ["(-)", "(-)", "계"],
  "축": ["계", "신", "기"],
  "인": ["(-)", "병", "갑"],
  "묘": ["(-)", "(-)", "을"],
  "진": ["을", "계", "무"],
  "사": ["(-)", "경", "병"],
  "오": ["(-)", "(-)", "정"],
  "미": ["정", "을", "기"],
  "신": ["(-)", "임", "경"],
  "유": ["(-)", "(-)", "신"],
  "술": ["신", "정", "무"],
  "해": ["(-)", "갑", "임"]
};

function getTwelveUnseong(baseDayStem, branch) {
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

function getTwelveShinsal(yearBranch, branch) {
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

function pad(num) { return num.toString().padStart(2, '0'); }
function getTenGodForStem(receivingStem, baseDayStem) {
  return (tenGodMappingForStems[baseDayStem] && tenGodMappingForStems[baseDayStem][receivingStem]) || "-";
}
function getTenGodForBranch(receivingBranch, baseStem) {
  return (tenGodMappingForBranches[baseStem] && tenGodMappingForBranches[baseStem][receivingBranch]) || "-";
}
function getGanZhiIndex(gz) { return sexagenaryCycle.indexOf(gz); }
function getGanZhiFromIndex(i) { const mod = ((i % 60) + 60) % 60; return sexagenaryCycle[mod]; }
function getYearGanZhiForSewoon(year) {
  let refDate = new Date(year, 3, 1);
  let ipChun = findSolarTermDate(year, 315);
  let effectiveYear = (refDate >= ipChun) ? year : (year - 1);
  let index = ((effectiveYear - 4) % 60 + 60) % 60;
  return sexagenaryCycle[index];
}

function updateColorClasses() {
  const bgColorClasses = ['b_green', 'b_red', 'b_yellow', 'b_white', 'b_black'],
        textColorClasses = ['green', 'red', 'yellow', 'white', 'black'];
  document.querySelectorAll(".ganji_w").forEach(elem => {
    const val = elem.innerHTML.trim();
    bgColorClasses.forEach(cls => elem.classList.remove(cls));
    if (colorMapping[val]) elem.classList.add(colorMapping[val].bgColor);
  });
  document.querySelectorAll(".grid_box_1 li b, .ganji b").forEach(bElem => {
    const val = bElem.innerHTML.trim();
    textColorClasses.forEach(cls => bElem.classList.remove(cls));
    if (colorMapping[val]) bElem.classList.add(colorMapping[val].textColor);
  });
}

function updateHiddenStems(SetBranch, prefix) {
  const mapping = hiddenStemMapping[SetBranch] || ["-", "-", "-"];
  document.getElementById(prefix + "Jj1").innerText = mapping[0];
  document.getElementById(prefix + "Jj2").innerText = mapping[1];
  document.getElementById(prefix + "Jj3").innerText = mapping[2];
}

function setText(id, text) {
  const elem = document.getElementById(id);
  if (elem) elem.innerText = text;
}

function updateStemInfo(prefix, Set, baseDayStem) {
  setText(prefix + "Hanja", (stemMapping[Set.gan]?.hanja) || "-");
  setText(prefix + "Hanguel", (stemMapping[Set.gan]?.hanguel) || "-");
  setText(prefix + "Eumyang", (stemMapping[Set.gan]?.eumYang) || "-");
  setText(prefix + "10sin", (prefix === "Dt") ? "본원" : getTenGodForStem(Set.gan, baseDayStem));
}

function updateBranchInfo(prefix, branch, baseDayStem) {
  setText(prefix + "Hanja", (branchMapping[branch]?.hanja) || "-");
  setText(prefix + "Hanguel", (branchMapping[branch]?.hanguel) || "-");
  setText(prefix + "Eumyang", (branchMapping[branch]?.eumYang) || "-");
  setText(prefix + "10sin", getTenGodForBranch(branch, baseDayStem));
  updateHiddenStems(branch, prefix);
}

document.addEventListener("DOMContentLoaded", function () {
  const inputName = document.getElementById("inputName");
  if (inputName) {
    inputName.addEventListener("input", function () {
      if (this.value.length > 10) {
        this.value = this.value.slice(0, 10);
      }
    });
  }

  document.getElementById("calcBtn").addEventListener("click", function () {

    let refDate = new Date();
    const name = document.getElementById("inputName").value.trim() || "-";
    const birthdayStr = document.getElementById("inputBirthday").value.trim();
    const birthtimeStr = document.getElementById("inputBirthtime").value.trim();
    const gender = document.getElementById("genderMan").checked ? "남" 
                  : (document.getElementById("genderWoman").checked ? "여" : "-");
    const birthPlace = document.getElementById("inputBirthPlace").value || "-";

    // 기본 입력 검증
    if (birthdayStr.length < 8) {
      alert("생년월일을 YYYYMMDD 형식으로 입력하세요.");
      return;
    }
    if (birthtimeStr.length !== 4 || isNaN(birthtimeStr)) {
      alert("태어난 시간을 4자리 숫자 (HHMM) 형식으로 입력하세요.");
      return;
    }
    if (gender === "-") {
      alert("성별을 선택하세요.");
      return;
    }
    if (birthPlace === "" || birthPlace === "출생지 선택") {
      alert("출생지를 선택하세요.");
      return;
    }

    // 생년월일, 시간 파싱
    let year   = parseInt(birthdayStr.substring(0, 4));
    let month  = parseInt(birthdayStr.substring(4, 6));
    let day    = parseInt(birthdayStr.substring(6, 8));
    let hour   = parseInt(birthtimeStr.substring(0, 2), 10);
    let minute = parseInt(birthtimeStr.substring(2, 4), 10);
    const birthDate = new Date(year, month - 1, day, hour, minute);

    // 음력/양력 변환
    const monthType = document.getElementById("monthType").value;
    const calendar = new KoreanLunarCalendar();
    let lunarDate = null;
    if (monthType === "음력" || monthType === "음력(윤달)") {
      const isLeap = (monthType === "음력(윤달)");
      if (!calendar.setLunarDate(year, month, day, isLeap)) {
        console.error(`${monthType} 날짜 설정에 실패했습니다.`);
      } else {
        lunarDate = { year, month, day, isLeap };
        const solar = calendar.getSolarCalendar();
        year = solar.year; 
        month = solar.month; 
        day = solar.day;
      }
    } else {
      if (!calendar.setSolarDate(year, month, day)) {
        console.error("양력 날짜 설정에 실패했습니다.");
      } else {
        lunarDate = calendar.getLunarCalendar();
      }
    }

    const originalDate = new Date(year, month - 1, day, hour, minute);
    const correctedDate = adjustBirthDate(originalDate, birthPlace);
    globalState.correctedBirthDate = correctedDate;

    const formattedBirth = `${year}-${pad(month)}-${pad(day)}`;
    setText("resBirth", formattedBirth);
    if (lunarDate) {
      const formattedLunar = `${lunarDate.year}-${pad(lunarDate.month)}-${pad(lunarDate.day)}${lunarDate.isLeap ? " (윤달)" : ""}`;
      setText("resBirth2", formattedLunar);
    } else {
      setText("resBirth2", "-");
    }

    const solarDate = globalState.correctedBirthDate;
    const fullResult = getFourSetsWithDaewoon(
      solarDate.getFullYear(),
      solarDate.getMonth() + 1,
      solarDate.getDate(),
      hour, minute, birthPlace, gender
    );
    // 예: "병자 경인 정묘 무오시, 대운수 ..." 형식의 문자열
    const parts = fullResult.split(", ");
    const pillarsPart = parts[0] || "-";
    const pillars = pillarsPart.split(" ");
    const yearPillar  = pillars[0] || "-";
    const monthPillar = pillars[1] || "-";
    const dayPillar   = pillars[2] || "-";
    const hourPillar  = pillars[3] || "-";

    // 원국 기둥 분리
    const yearSplit  = splitSet(yearPillar);
    const monthSplit = splitSet(monthPillar);
    const daySplit   = splitSet(dayPillar);
    const hourSplit  = splitSet(hourPillar);

    const natalChartData = {
      birthDate: birthDate,
      yearPillar: yearPillar,
      monthPillar: monthPillar,
      dayPillar: dayPillar,   
      hourPillar: hourPillar
    };

    const BirthDateObj = new Date(
      birthDate.getFullYear(),
      birthDate.getMonth(),
      birthDate.getDate(),
      birthDate.getHours(),
      birthDate.getMinutes()
    );

    const adjustedBirthDateObj = new Date(
      birthDate.getFullYear() + 1,
      birthDate.getMonth(),
      birthDate.getDate(),
      birthDate.getHours(),
      birthDate.getMinutes()
    );

    const birthYearPillar = yearPillar;
    const birthMonthPillar = monthPillar;

    const baseDayStem = daySplit.gan; // 원국 일간
    const baseYearBranch = birthYearPillar.charAt(1); // 원국 연지 (예: "병자"에서 "자")

    if (year < 1900 || year > 2099) {
      alert("연도는 1900년부터 2099년 사이로 입력하세요.");
      return;
    }
    if (month < 1 || month > 12) {
      alert("월은 1부터 12 사이의 숫자로 입력하세요.");
      return;
    }
    if (day < 1 || day > 31) {
      alert("일은 1부터 31 사이의 숫자로 입력하세요.");
      return;
    }
    const testDate = new Date(year, month - 1, day);
    if (testDate.getFullYear() !== year || (testDate.getMonth() + 1) !== month || testDate.getDate() !== day) {
      alert("유효한 날짜를 입력하세요.");
      return;
    }
    if (!/^\d{4}$/.test(birthtimeStr)) {
      alert("태어난 시간은 4자리 숫자 (HHMM) 형식으로 입력하세요.");
      return;
    }
    if (hour < 0 || hour > 23) {
      alert("시각은 00부터 23 사이의 숫자로 입력하세요.");
      return;
    }
    if (minute < 0 || minute > 59) {
      alert("분은 00부터 59 사이의 숫자로 입력하세요.");
      return;
    }

    globalState.birthYear = year;
    globalState.month = month;
    globalState.day = day;
    globalState.birthPlace = birthPlace;
    globalState.gender = gender;
    
    const formattedTime = `${pad(hour)}:${pad(minute)}`;
    setText("resName", name);
    setText("resGender", gender);
    setText("resBirth", formattedBirth);
    setText("resTime", formattedTime);
    setText("resAddr", birthPlace);
    const correctedTime = adjustBirthDate(originalDate, birthPlace);
    document.getElementById("resbjTime").innerHTML =
      correctedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    function updateOriginalSetMapping() {
      setText("Hb12ws", getTwelveUnseong(baseDayStem, hourSplit.ji));
      setText("Hb12ss", getTwelveShinsal(baseYearBranch, hourSplit.ji));
      setText("Db12ws", getTwelveUnseong(baseDayStem, daySplit.ji));
      setText("Db12ss", getTwelveShinsal(baseYearBranch, daySplit.ji));
      setText("Mb12ws", getTwelveUnseong(baseDayStem, monthSplit.ji));
      setText("Mb12ss", getTwelveShinsal(baseYearBranch, monthSplit.ji));
      setText("Yb12ws", getTwelveUnseong(baseDayStem, baseYearBranch));
      setText("Yb12ss", getTwelveShinsal(baseYearBranch, baseYearBranch));
    }

    updateStemInfo("Yt", yearSplit, baseDayStem);
    updateStemInfo("Mt", monthSplit, baseDayStem);
    updateStemInfo("Dt", daySplit, baseDayStem);
    updateStemInfo("Ht", hourSplit, baseDayStem);
    updateBranchInfo("Yb", baseYearBranch, baseDayStem);
    updateBranchInfo("Mb", monthSplit.ji, baseDayStem);
    updateBranchInfo("Db", daySplit.ji, baseDayStem);
    updateBranchInfo("Hb", hourSplit.ji, baseDayStem);
    updateOriginalSetMapping();
    updateColorClasses();

    function updateCurrentDaewoon() {
      const birthDateObj = new Date(year, month - 1, day);
      const today = new Date();
      let currentAge = today.getFullYear() - birthDateObj.getFullYear();
      if (today.getMonth() < birthDateObj.getMonth() ||
         (today.getMonth() === birthDateObj.getMonth() && today.getDate() < birthDateObj.getDate())) {
        currentAge--;
      }
      const daewoonData = getDaewoonData(birthPlace, gender);
      let currentDaewoon = null;
      for (let i = 0; i < daewoonData.list.length; i++) {
        if (daewoonData.list[i].age <= currentAge) {
          currentDaewoon = daewoonData.list[i];
        }
      }
      if (!currentDaewoon) {
        currentDaewoon = daewoonData.list[0] || { stem: "-", branch: "-" };
      }
      setText("DwtHanja", stemMapping[currentDaewoon.stem]?.hanja || "-");
      setText("DwtHanguel", stemMapping[currentDaewoon.stem]?.hanguel || "-");
      setText("DwtEumyang", stemMapping[currentDaewoon.stem]?.eumYang || "-");
      setText("Dwt10sin", getTenGodForStem(currentDaewoon.stem, baseDayStem));
      setText("DwbHanja", branchMapping[currentDaewoon.branch]?.hanja || "-");
      setText("DwbHanguel", branchMapping[currentDaewoon.branch]?.hanguel || "-");
      setText("DwbEumyang", branchMapping[currentDaewoon.branch]?.eumYang || "-");
      setText("Dwb10sin", getTenGodForBranch(currentDaewoon.branch, baseDayStem));
      const hiddenArr = hiddenStemMapping[currentDaewoon.branch] || ["-", "-", "-"];
      setText("DwJj1", hiddenArr[0]);
      setText("DwJj2", hiddenArr[1]);
      setText("DwJj3", hiddenArr[2]);
      setText("DWb12ws", getTwelveUnseong(baseDayStem, currentDaewoon.branch));
      setText("DWb12ss", getTwelveShinsal(baseYearBranch, currentDaewoon.branch));
    }
    updateCurrentDaewoon();
    updateMonthlyWoonByToday(new Date());
    globalState.daewoonData = getDaewoonData(birthPlace, gender);

    function updateDaewoonItem(i, item) {
      const forwardGanji = item.stem + item.branch;
      const finalStem = forwardGanji.charAt(0);
      const finalBranch = forwardGanji.charAt(1);
      const idx = i + 1;
      setText("DC_" + idx, stemMapping[finalStem]?.hanja || "-");
      setText("DJ_" + idx, branchMapping[finalBranch]?.hanja || "-");
      setText("dt10sin" + idx, getTenGodForStem(finalStem, baseDayStem) || "-");
      setText("db10sin" + idx, getTenGodForBranch(finalBranch, baseDayStem) || "-");
      setText("DwW" + idx, "-");
      setText("Ds" + idx, "-");
      setText("Da" + idx, item.age);
    }
    for (let i = 0; i < 10; i++) {
      updateDaewoonItem(i, globalState.daewoonData.list[i]);
    }

    const birthDateObj = new Date(year, month - 1, day);
    const todayObj = new Date();
    let currentAge = todayObj.getFullYear() - birthDateObj.getFullYear();
    if (todayObj.getMonth() < birthDateObj.getMonth() ||
       (todayObj.getMonth() === birthDateObj.getMonth() && todayObj.getDate() < birthDateObj.getDate())) {
      currentAge--;
    }
    let currentDaewoonIndex = 0;
    if (globalState.daewoonData?.list) {
      for (let i = 0; i < globalState.daewoonData.list.length; i++) {
        if (globalState.daewoonData.list[i].age <= currentAge) {
          currentDaewoonIndex = i;
        }
      }
    }
    const daewoonLis = document.querySelectorAll("#daewoonList li");
    daewoonLis.forEach(li => li.classList.remove("active"));
    if (daewoonLis[currentDaewoonIndex]) {
      daewoonLis[currentDaewoonIndex].classList.add("active");
    }

    function updateCurrentSewoon(refDate) {
      const ipChun = findSolarTermDate(refDate.getFullYear(), 315);
      const effectiveYear = (refDate >= ipChun) ? refDate.getFullYear() : refDate.getFullYear() - 1;
      const sewoonIndex = ((effectiveYear - 4) % 60 + 60) % 60;
      const sewoonGanZhi = sexagenaryCycle[sewoonIndex];
      const sewoonSplit = splitSet(sewoonGanZhi);

      setText("SwtHanja", stemMapping[sewoonSplit.gan]?.hanja || "-");
      setText("SwtHanguel", stemMapping[sewoonSplit.gan]?.hanguel || "-");
      setText("SwtEumyang", stemMapping[sewoonSplit.gan]?.eumYang || "-");
      setText("Swt10sin", getTenGodForStem(sewoonSplit.gan, baseDayStem));
      setText("SwbHanja", branchMapping[sewoonSplit.ji]?.hanja || "-");
      setText("SwbHanguel", branchMapping[sewoonSplit.ji]?.hanguel || "-");
      setText("SwbEumyang", branchMapping[sewoonSplit.ji]?.eumYang || "-");
      setText("Swb10sin", getTenGodForBranch(sewoonSplit.ji, baseDayStem));
      const sewoonHidden = hiddenStemMapping[sewoonSplit.ji] || ["-", "-", "-"];
      setText("SwJj1", sewoonHidden[0]);
      setText("SwJj2", sewoonHidden[1]);
      setText("SwJj3", sewoonHidden[2]);
      setText("SWb12ws", getTwelveUnseong(baseDayStem, sewoonSplit.ji));
      setText("SWb12ss", getTwelveShinsal(baseYearBranch, sewoonSplit.ji));
      
      setText("WSwtHanja", stemMapping[sewoonSplit.gan]?.hanja || "-");
      setText("WSwtHanguel", stemMapping[sewoonSplit.gan]?.hanguel || "-");
      setText("WSwtEumyang", stemMapping[sewoonSplit.gan]?.eumYang || "-");
      setText("WSwt10sin", getTenGodForStem(sewoonSplit.gan, baseDayStem));
      setText("WSwbHanja", branchMapping[sewoonSplit.ji]?.hanja || "-");
      setText("WSwbHanguel", branchMapping[sewoonSplit.ji]?.hanguel || "-");
      setText("WSwbEumyang", branchMapping[sewoonSplit.ji]?.eumYang || "-");
      setText("WSwb10sin", getTenGodForBranch(sewoonSplit.ji, baseDayStem));
      setText("WSwJj1", sewoonHidden[0]);
      setText("WSwJj2", sewoonHidden[1]);
      setText("WSwJj3", sewoonHidden[2]);
      setText("WSWb12ws", getTwelveUnseong(baseDayStem, sewoonSplit.ji));
      setText("WSWb12ss", getTwelveShinsal(baseYearBranch, sewoonSplit.ji));
    }
    updateCurrentSewoon(refDate);

    document.querySelectorAll("#daewoonList li").forEach(function (li) {
      li.addEventListener("click", function (event) {
        event.stopPropagation();
        document.querySelectorAll("#daewoonList li").forEach(item => item.classList.remove("active"));
        this.classList.add("active");
        const index = this.getAttribute("data-index");
        updateDaewoonDetails(index);
      });
    });

    document.querySelectorAll("#sewoonList li").forEach(function (li) {
      li.addEventListener("click", function (event) {
        event.stopPropagation();
        document.querySelectorAll("#sewoonList li").forEach(item => item.classList.remove("active"));
        this.classList.add("active");
        const index = this.getAttribute("data-index2");
        updateSewoonDetails(index);
        const mowoonListElem = document.getElementById("walwoonArea");
        if (mowoonListElem) { mowoonListElem.style.display = "grid"; }
      });
    });

    function updateDaewoonDetails(index) {
      if (globalState.daewoonData && globalState.daewoonData.list[index - 1]) {
        const data = globalState.daewoonData.list[index - 1];
        setText("daewoonDetail", `${data.age}세 (${data.stem}${data.branch})`);
      }
    }

    function updateSewoonDetails(index) {
      if (globalState.sewoonStartYear) {
        const computedYear = globalState.sewoonStartYear + (index - 1);
        const yearGanZhi = getYearGanZhiForSewoon(computedYear);
        const splitYear = splitSet(yearGanZhi);
        setText("sewoonDetail", `${computedYear}년 (${splitYear.gan}${splitYear.ji})`);
      }
    }

    let activeDaewoonLi = document.querySelector("[id^='daewoon_'].active");
    let daewoonIndex = activeDaewoonLi ? parseInt(activeDaewoonLi.getAttribute("data-index"), 10) : 1;
    if (!globalState.birthYear || !globalState.daewoonData) {
      alert("먼저 계산 버튼을 눌러 출생 정보를 입력하세요.");
      return;
    }
    const selectedDaewoon = globalState.daewoonData.list[daewoonIndex - 1];
    if (!selectedDaewoon) return;
    const daewoonNum = selectedDaewoon.age;
    const sewoonStartYear = globalState.birthYear + (daewoonNum - 1);
    globalState.sewoonStartYear = sewoonStartYear;
    const displayedDayPillar = document.getElementById("DtHanguel").innerText;
    const baseDayStemS = displayedDayPillar ? displayedDayPillar.charAt(0) : "-";
    const sewoonList = [];
    for (let j = 0; j < 10; j++) {
      let sewoonYear = globalState.sewoonStartYear + j;
      let yearGanZhi = getYearGanZhiForSewoon(sewoonYear);
      const splitYear = splitSet(yearGanZhi);
      const tenGod = getTenGodForStem(splitYear.gan, baseDayStemS);
      const tenGodJiji = getTenGodForBranch(splitYear.ji, baseDayStemS);
      sewoonList.push({
        year: sewoonYear,
        gan: splitYear.gan,
        ji: splitYear.ji,
        tenGod: tenGod,
        tenGodJiji: tenGodJiji
      });
    }
    sewoonList.forEach(function (item, index) {
      const idx = index + 1;
      setText("SC_" + idx, stemMapping[item.gan]?.hanja || "-");
      setText("SJ_" + idx, branchMapping[item.ji]?.hanja || "-");
      setText("st10sin" + idx, item.tenGod);
      setText("sb10sin" + idx, item.tenGodJiji);
      setText("SwW" + idx, getTwelveUnseong(baseDayStem, item.ji) || "-");
      setText("Ss" + idx, getTwelveShinsal(baseYearBranch, item.ji) || "-");
      setText("Dy" + idx, item.year);
    });
    updateColorClasses();

    const todayYear = todayObj.getFullYear();
    const ipChun = findSolarTermDate(todayObj.getFullYear(), 315);
    const displayYear = (todayObj < ipChun) ? todayYear - 1 : todayYear;
    const sewoonLis = document.querySelectorAll("#sewoonList li");
    sewoonLis.forEach(li => {
      const dyearElem = li.querySelector(".dyear");
      const currentYear = Number(dyearElem.innerText);
      li.classList.toggle("active", currentYear === displayYear);
      document.getElementById('resultWrapper').style.display = 'block';
      document.getElementById('inputWrap').style.display = 'none';
    });

    function updateListMapping(list, prefixUnseong, prefixShinsal, baseDayStem, baseYearBranch) {
      if (!list || !list.length) {
        console.warn("업데이트할 리스트가 없습니다.");
        return;
      }
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        document.getElementById(prefixUnseong + (i + 1)).innerText = getTwelveUnseong(baseDayStem, item.branch);
        document.getElementById(prefixShinsal + (i + 1)).innerText = getTwelveShinsal(baseYearBranch, item.branch);
      }
    }

    let currentSewoonIndex = displayYear - globalState.sewoonStartYear;
    if (currentSewoonIndex < 0) currentSewoonIndex = 0;
    if (currentSewoonIndex > 9) currentSewoonIndex = 9;
    const computedSewoonYear = globalState.sewoonStartYear + currentSewoonIndex;
    updateMonthlyData(computedSewoonYear);
    const monthlyContainer = document.getElementById("walwoonArea");
    if (monthlyContainer) { monthlyContainer.style.display = "grid"; }
    updateColorClasses();
    updateOriginalSetMapping(yearSplit, monthSplit, daySplit, hourSplit);
    updateListMapping(globalState.daewoonData.list, "DwW", "Ds", baseDayStem, baseYearBranch);
    if (globalState.sewoonList && globalState.sewoonList.length > 0) {
      updateListMapping(globalState.sewoonList, "SwW", "Ss", baseDayStem, baseYearBranch);
    }
    if (globalState.monthWoonList && globalState.monthWoonList.length > 0) {
      updateListMapping(globalState.monthWoonList, "MwW", "Ms", baseDayStem, baseYearBranch);
    }

    function updateMonthlyData() {
      const dayPillarText = document.getElementById("DtHanguel").innerText;
      const baseDayStem = dayPillarText ? dayPillarText.charAt(0) : "-";
      const effectiveYear = (refDate >= ipChun) ? refDate.getFullYear() : refDate.getFullYear() - 1;
      const yearPillar = getYearGanZhi(new Date(birthDate.getFullYear(), birthDate.getMonth(), birthDate.getDate()), effectiveYear);
      const yearStem = yearPillar.charAt(0);
      const yearStemIndex = Cheongan.indexOf(yearStem);
      for (let i = 0; i < 12; i++) {
        const monthNumber = i + 1;
        const monthStemIndex = (((yearStemIndex * 2) + monthNumber - 1) + 4) % 10;
        const monthStem = Cheongan[monthStemIndex];
        const monthBranch = MONTH_ZHI[monthNumber - 1];
        const tenGodStem = getTenGodForStem(monthStem, baseDayStem);
        const tenGodBranch = getTenGodForBranch(monthBranch, baseDayStem);
        const displayMonth = (monthNumber < 12) ? (monthNumber + 1) + "월" : "1월";
        const unseong = getTwelveUnseong(baseDayStem, monthBranch);
        const shinsal = getTwelveShinsal(baseYearBranch, monthBranch);
        setText("MC_" + (i + 1), stemMapping[monthStem]?.hanja || "-");
        setText("MJ_" + (i + 1), branchMapping[monthBranch]?.hanja || "-");
        setText("Mot10sin" + (i + 1), tenGodStem || "-");
        setText("Mob10sin" + (i + 1), tenGodBranch || "-");
        setText("MwW" + (i + 1), unseong || "-");
        setText("Ms" + (i + 1), shinsal || "-");
        setText("Dm" + (i + 1), displayMonth || "-");
      }
    }

    function updateMonthlyWoon(computedYear, currentMonthIndex) {
      const boundaries = getSolarTermBoundaries(computedYear);
      if (!boundaries || boundaries.length === 0) return;
      const cycleStartDate = boundaries[0].date;
      const dayPillarText = document.getElementById("DtHanguel").innerText;
      const baseDayStem = dayPillarText ? dayPillarText.charAt(0) : "-";
      const yearPillar = getYearGanZhi(cycleStartDate, computedYear);
      const yearStem = yearPillar.charAt(0);
      const yearStemIndex = Cheongan.indexOf(yearStem);
      const monthNumber = currentMonthIndex + 1;
      const monthStemIndex = (((yearStemIndex * 2) + monthNumber - 1) + 4) % 10;
      const monthStem = Cheongan[monthStemIndex];
      const monthBranch = MONTH_ZHI[monthNumber - 1];
      const tenGodStem = getTenGodForStem(monthStem, baseDayStem);
      const tenGodBranch = getTenGodForBranch(monthBranch, baseDayStem);
      const unseong = getTwelveUnseong(baseDayStem, monthBranch);
      const shinsal = getTwelveShinsal(baseYearBranch, monthBranch);
      setText("WMtHanja", stemMapping[monthStem]?.hanja || "-");
      setText("WMtHanguel", stemMapping[monthStem]?.hanguel || "-");
      setText("WMtEumyang", stemMapping[monthStem]?.eumYang || "-");
      setText("WMt10sin", tenGodStem || "-");
      setText("WMbHanja", branchMapping[monthBranch]?.hanja || "-");
      setText("WMbHanguel", branchMapping[monthBranch]?.hanguel || "-");
      setText("WMbEumyang", branchMapping[monthBranch]?.eumYang || "-");
      setText("WMb10sin", tenGodBranch || "-");
      updateHiddenStems(monthBranch, "WMb");
      setText("WMb12ws", unseong || "-");
      setText("WMb12ss", shinsal || "-");
      updateColorClasses();
    }

    function updateMonthlyWoonByToday(refDate) {
      const ipChun = findSolarTermDate(refDate.getFullYear(), 315);
      const computedYear = (refDate < ipChun) ? refDate.getFullYear() - 1 : refDate.getFullYear();
      const boundaries = getSolarTermBoundaries(computedYear);
      if (!boundaries || boundaries.length === 0) return;
      let currentMonthIndex = 0;
      for (let i = 0; i < boundaries.length - 1; i++) {
        if (refDate >= boundaries[i].date && refDate < boundaries[i + 1].date) {
          currentMonthIndex = i;
          break;
        }
      }
      if (refDate >= boundaries[boundaries.length - 1].date) {
        currentMonthIndex = boundaries.length - 1;
      }
      updateMonthlyWoon(computedYear, currentMonthIndex);
    }
    updateMonthlyWoonByToday(refDate);

    document.addEventListener("click", function (event) {
      const btn = event.target.closest("#calPrevBtn, #calNextBtn");
      if (!btn) return;
      const solarYear = globalState.solarYear;
      const boundaries = globalState.boundaries;
      const currentIndex = globalState.currentIndex;
      if (solarYear === undefined || !boundaries || currentIndex === undefined) return;
      let newIndex;
      if (btn.id === "calPrevBtn") {
        newIndex = (currentIndex - 1 + boundaries.length) % boundaries.length;
      } else if (btn.id === "calNextBtn") {
        newIndex = (currentIndex + 1) % boundaries.length;
      }
      const newTermName = boundaries[newIndex].name;
      updateMonthlyFortuneCalendar(newTermName, solarYear, newIndex);
      setTimeout(function () {
        const liElements = Array.from(document.querySelectorAll("#mowoonList li"));
        if (!liElements.length) return;
        liElements.forEach(li => li.classList.remove("active"));
        const targetIndex = newIndex % liElements.length;
        liElements[targetIndex].classList.add("active");
      }, 0);
    });

    const currentSolarYear = (todayObj < ipChun) ? todayObj.getFullYear() - 1 : todayObj.getFullYear();
    let boundariesArr = getSolarTermBoundaries(currentSolarYear);
    let currentTerm = boundariesArr.find((term, idx) => {
      let next = boundariesArr[idx + 1] || { date: new Date(term.date.getTime() + 30 * 24 * 60 * 60 * 1000) };
      return todayObj >= term.date && todayObj < next.date;
    });
    if (!currentTerm) { currentTerm = boundariesArr[0]; }
    function generateDailyFortuneCalendar(solarTermName, startDate, endDate, baseDayStem, currentIndex, boundaries, solarYear) {
      let prevTermName, nextTermName;
      if (currentIndex > 0) {
        prevTermName = boundaries[currentIndex - 1].name;
      } else {
        let prevBoundaries = getSolarTermBoundaries(solarYear - 1);
        if (!Array.isArray(prevBoundaries)) prevBoundaries = Array.from(prevBoundaries);
        prevTermName = prevBoundaries[prevBoundaries.length - 1].name;
      }
      if (currentIndex < boundaries.length - 1) {
        nextTermName = boundaries[currentIndex + 1].name;
      } else {
        let nextBoundaries = getSolarTermBoundaries(solarYear + 1);
        if (!Array.isArray(nextBoundaries)) nextBoundaries = Array.from(nextBoundaries);
        nextTermName = nextBoundaries[0].name;
      }
      function normalizeDate(dateObj) {
        return new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
      }
      const normStart = normalizeDate(startDate);
      const normEndNext = normalizeDate(endDate);
      const finalEndDate = normEndNext;
      function formatDate(dateObj) {
        const m = dateObj.getMonth() + 1;
        const d = dateObj.getDate();
        return m + "월 " + d + "일";
      }
      const startDateStr = formatDate(normStart);
      const endDateStr = formatDate(finalEndDate);
      const headerMonth = normStart.getMonth() + 1;
      let html = `<ul class="calender_title" id="calenderTitle">
        <li>
          <button class="cal_btn" id="calPrevBtn">
            <span class="btn_icon">◀</span>
            <span class="jeolgi_prev">${prevTermName}</span>
          </button>
        </li>
        <li>
          <div class="curr_title">
            <span>${solarTermName} ${headerMonth}월 (${startDateStr} ~ ${endDateStr})</span>
          </div>
        </li>
        <li>
          <button class="cal_btn" id="calNextBtn">
            <span class="jeolgi_next">${nextTermName}</span>
            <span class="btn_icon">▶</span>
          </button>
        </li>
      </ul>;
      html += <table class="calander_table">
        <tr>
          <th>일</th>
          <th>월</th>
          <th>화</th>
          <th>수</th>
          <th>목</th>
          <th>금</th>
          <th>토</th>
        </tr>`;
      let days = [];
      for (let d = new Date(normStart); d <= normEndNext; d.setDate(d.getDate() + 1)) {
        days.push(new Date(d.getTime()));
      }
      let currentRow = "<tr>";
      const firstDayWeekday = normStart.getDay();
      for (let i = 0; i < firstDayWeekday; i++) {
        currentRow += "<td></td>";
      }
      days.forEach(function (date, idx) {
        const originalGanji = getDayGanZhi(date);
        const originalIndex = getGanZhiIndex(originalGanji);
        const adjustedIndex = originalIndex % 60;
        const ganji = getGanZhiFromIndex(adjustedIndex);
        const stem = ganji.charAt(0);
        const branch = ganji.charAt(1);
        const tenGodCheongan = getTenGodForStem(stem, baseDayStem);
        const tenGodJiji = getTenGodForBranch(branch, baseDayStem);
        const twelveUnseong = getTwelveUnseong(baseDayStem, branch);
        const twelveShinsal = getTwelveShinsal(baseYearBranch, branch);
        let dailyHtml = `<ul class="ilwoon">
          <li class="ilwoonday"><span>${date.getDate()}일</span></li>
          <li class="ilwoon_ganji_cheongan_10sin"><span>${tenGodCheongan}</span></li>
          <li class="ilwoon_ganji_cheongan"><span>${stem}</span></li>
          <li class="ilwoon_ganji_jiji"><span>${branch}</span></li>
          <li class="ilwoon_ganji_jiji_10sin"><span>${tenGodJiji}</span></li>
          <li class="ilwoon_10woonseong"><span>${twelveUnseong}</span></li>
          <li class="ilwoon_10sinsal"><span>${twelveShinsal}</span></li>
        </ul>`;
        let tdClass = "";
        const today = new Date();
        if (
          date.getFullYear() === today.getFullYear() &&
          date.getMonth() === today.getMonth() &&
          date.getDate() === today.getDate()
        ) {
          tdClass = ' class="active"';
        }
        currentRow += `<td${tdClass}>${dailyHtml}</td>`;
        if ((firstDayWeekday + idx + 1) % 7 === 0) {
          currentRow += "</tr>";
          html += currentRow;
          currentRow = "<tr>";
        }
      });
      const totalCells = firstDayWeekday + days.length;
      const remainder = totalCells % 7;
      if (remainder !== 0) {
        for (let i = remainder; i < 7; i++) {
          currentRow += "<td></td>";
        }
        currentRow += "</tr>";
        html += currentRow;
      }
      html += "</table>";
      return html;
    }

    function updateMonthlyFortuneCalendar(solarTermName, computedYear, newIndexOpt) {
      const today = new Date();
      const solarYear = computedYear || (function () {
        const ipChun = findSolarTermDate(today.getFullYear(), 315);
        return (today < ipChun) ? today.getFullYear() - 1 : today.getFullYear();
      })();
      let boundaries = getSolarTermBoundaries(solarYear);
      if (!Array.isArray(boundaries)) {
        boundaries = Array.from(boundaries);
      }
      let currentIndex = boundaries.findIndex(term => term.name === solarTermName);
      if (currentIndex === -1) {
        currentIndex = 0;
        solarTermName = boundaries[0].name;
      }
      if (newIndexOpt !== undefined) {
        currentIndex = newIndexOpt;
        solarTermName = boundaries[currentIndex].name;
      }
      const currentTerm = boundaries[currentIndex];
      let nextTerm;
      if (currentIndex + 1 < boundaries.length) {
        nextTerm = boundaries[currentIndex + 1];
      } else {
        let nextBoundaries = getSolarTermBoundaries(solarYear + 1);
        if (!Array.isArray(nextBoundaries)) {
          nextBoundaries = Array.from(nextBoundaries);
        }
        nextTerm = nextBoundaries[0];
      }
      function normalizeDate(dateObj) {
        return new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
      }
      const normStart = normalizeDate(currentTerm.date);
      const normNext = normalizeDate(nextTerm.date);
      const finalEndDate = new Date(normNext.getTime() - 24 * 60 * 60 * 1000);
      const calendarHTML = generateDailyFortuneCalendar(
        solarTermName,
        normStart,
        finalEndDate,
        baseDayStem,
        currentIndex,
        boundaries,
        solarYear
      );
      const container = document.getElementById("iljuCalender");
      if (container) {
        container.innerHTML = calendarHTML;
      }
      globalState.solarYear = solarYear;
      globalState.boundaries = boundaries;
      globalState.currentIndex = currentIndex;
      globalState.computedYear = solarYear;
      const now = new Date();
      const activeMonth = globalState.activeMonth || (now.getMonth() + 1);
      document.querySelectorAll("#mowoonList li").forEach(function (li) {
        const liMonth = parseInt(li.getAttribute("data-index3"), 10);
        li.classList.toggle("active", liMonth === activeMonth);
      });
    }

    updateMonthlyFortuneCalendar(currentTerm.name, currentSolarYear);

    document.querySelectorAll("[id^='daewoon_']").forEach(function (daewoonLi) {
      daewoonLi.addEventListener("click", function (event) {
        event.stopPropagation();
        document.getElementById('iljuCalender').style.display = 'none';
        const sewoonBox = document.querySelector(".lucky.sewoon");
        if (sewoonBox) { sewoonBox.style.display = "none"; }
        document.querySelectorAll("#sewoonList li").forEach(li => li.classList.remove("active"));
        const monthlyContainer = document.getElementById("walwoonArea");
        if (monthlyContainer) { monthlyContainer.style.display = "none"; }
        const daewoonIndex = parseInt(this.getAttribute("data-index"), 10);
        if (!globalState.birthYear || !globalState.daewoonData) {
          alert("먼저 계산 버튼을 눌러 출생 정보를 입력하세요.");
          return;
        }
        const selectedDaewoon = globalState.daewoonData.list[daewoonIndex - 1];
        if (!selectedDaewoon) return;
        const daewoonNum = selectedDaewoon.age;
        const sewoonStartYear = globalState.birthYear + (daewoonNum - 1);
        globalState.sewoonStartYear = sewoonStartYear;
        const displayedDayPillar = document.getElementById("DtHanguel").innerText;
        const baseDayStemS = displayedDayPillar ? displayedDayPillar.charAt(0) : "-";
        const sewoonList = [];
        for (let j = 0; j < 10; j++) {
          let sewoonYear = globalState.sewoonStartYear + j;
          let yearGanZhi = getYearGanZhiForSewoon(sewoonYear);
          const splitYear = splitSet(yearGanZhi);
          const tenGod = getTenGodForStem(splitYear.gan, baseDayStemS);
          const tenGodJiji = getTenGodForBranch(splitYear.ji, baseDayStemS);
          sewoonList.push({
            year: sewoonYear,
            gan: splitYear.gan,
            ji: splitYear.ji,
            tenGod: tenGod,
            tenGodJiji: tenGodJiji
          });
        }
        sewoonList.forEach(function (item, index) {
          const idx = index + 1;
          setText("SC_" + idx, stemMapping[item.gan]?.hanja || "-");
          setText("SJ_" + idx, branchMapping[item.ji]?.hanja || "-");
          setText("st10sin" + idx, item.tenGod);
          setText("sb10sin" + idx, item.tenGodJiji);
          setText("SwW" + idx, getTwelveUnseong(baseDayStem, item.ji) || "-");
          setText("Ss" + idx, getTwelveShinsal(baseYearBranch, item.ji) || "-");
          setText("Dy" + idx, item.year);
        });
        function updateDaewoonHTML(selectedDaewoon, baseDayStem) {
          setText("DwtHanja", stemMapping[selectedDaewoon.stem]?.hanja || "-");
          setText("DwtHanguel", stemMapping[selectedDaewoon.stem]?.hanguel || "-");
          setText("DwtEumyang", stemMapping[selectedDaewoon.stem]?.eumYang || "-");
          setText("Dwt10sin", getTenGodForStem(selectedDaewoon.stem, baseDayStem));
          setText("DwbHanja", branchMapping[selectedDaewoon.branch]?.hanja || "-");
          setText("DwbHanguel", branchMapping[selectedDaewoon.branch]?.hanguel || "-");
          setText("DwbEumyang", branchMapping[selectedDaewoon.branch]?.eumYang || "-");
          setText("Dwb10sin", getTenGodForBranch(selectedDaewoon.branch, baseDayStem));
          const daewoonHidden = hiddenStemMapping[selectedDaewoon.branch] || ["-", "-", "-"];
          setText("DwJj1", daewoonHidden[0]);
          setText("DwJj2", daewoonHidden[1]);
          setText("DwJj3", daewoonHidden[2]);
        }
        updateDaewoonHTML(selectedDaewoon, baseDayStemS);
        updateColorClasses();
        const computedYear = globalState.sewoonStartYear;
        const boundariesForSewoon = getSolarTermBoundaries(computedYear);
        const targetSolarTerm = boundariesForSewoon[0].name;
        updateMonthlyFortuneCalendar(targetSolarTerm, computedYear);
        document.querySelectorAll("#mowoonList li").forEach(li => li.classList.remove("active"));
      });
    });

    document.querySelectorAll("[id^='Sewoon_']").forEach(function (sewoonLi) {
      sewoonLi.addEventListener("click", function (event) {
        event.stopPropagation();
        document.getElementById('iljuCalender').style.display = 'none';
        const sewoonBox = document.querySelector(".lucky.sewoon");
        if (sewoonBox) { sewoonBox.style.display = "grid"; }
        const monthlyContainer = document.getElementById("walwoonArea");
        if (monthlyContainer) { monthlyContainer.style.display = "grid"; }
        const sewoonIndex = parseInt(this.getAttribute("data-index2"), 10);
        if (!globalState.sewoonStartYear) {
          alert("먼저 대운을 선택하여 세운 시작연도를 계산하세요.");
          return;
        }
        const computedYear = globalState.sewoonStartYear + (sewoonIndex - 1);
        updateMonthlyData(computedYear);
        const displayedDayPillar = document.getElementById("DtHanguel").innerText;
        const baseDayStemS = displayedDayPillar ? displayedDayPillar.charAt(0) : "-";
        let yearGanZhi = getYearGanZhiForSewoon(computedYear);
        const splitYear = splitSet(yearGanZhi);
        const tenGod = getTenGodForStem(splitYear.gan, baseDayStemS);
        const tenGodJiji = getTenGodForBranch(splitYear.ji, baseDayStemS);
        const selectedSewoon = {
          year: computedYear,
          gan: splitYear.gan,
          ji: splitYear.ji,
          tenGod: tenGod,
          tenGodJiji: tenGodJiji
        };
        function updateSewoonHTML(selectedSewoon, baseDayStem) {
          setText("SwtHanja", stemMapping[selectedSewoon.gan]?.hanja || "-");
          setText("SwtHanguel", stemMapping[selectedSewoon.gan]?.hanguel || "-");
          setText("SwtEumyang", stemMapping[selectedSewoon.gan]?.eumYang || "-");
          setText("Swt10sin", getTenGodForStem(selectedSewoon.gan, baseDayStem));
          setText("SwbHanja", branchMapping[selectedSewoon.ji]?.hanja || "-");
          setText("SwbHanguel", branchMapping[selectedSewoon.ji]?.hanguel || "-");
          setText("SwbEumyang", branchMapping[selectedSewoon.ji]?.eumYang || "-");
          setText("Swb10sin", getTenGodForBranch(selectedSewoon.ji, baseDayStem));
          const sewoonHidden = hiddenStemMapping[selectedSewoon.ji] || ["-", "-", "-"];
          setText("SwJj1", sewoonHidden[0]);
          setText("SwJj2", sewoonHidden[1]);
          setText("SwJj3", sewoonHidden[2]);
          setText("SWb12ws", getTwelveUnseong(baseDayStem, selectedSewoon.ji));
          setText("SWb12ss", getTwelveShinsal(baseYearBranch, selectedSewoon.ji));
          setText("WSwtHanja", stemMapping[selectedSewoon.gan]?.hanja || "-");
          setText("WSwtHanguel", stemMapping[selectedSewoon.gan]?.hanguel || "-");
          setText("WSwtEumyang", stemMapping[selectedSewoon.gan]?.eumYang || "-");
          setText("WSwt10sin", getTenGodForStem(selectedSewoon.gan, baseDayStem));
          setText("WSwbHanja", branchMapping[selectedSewoon.ji]?.hanja || "-");
          setText("WSwbHanguel", branchMapping[selectedSewoon.ji]?.hanguel || "-");
          setText("WSwbEumyang", branchMapping[selectedSewoon.ji]?.eumYang || "-");
          setText("WSwb10sin", getTenGodForBranch(selectedSewoon.ji, baseDayStem));
          setText("WSwJj1", sewoonHidden[0]);
          setText("WSwJj2", sewoonHidden[1]);
          setText("WSwJj3", sewoonHidden[2]);
          setText("WSWb12ws", getTwelveUnseong(baseDayStem, selectedSewoon.ji));
          setText("WSWb12ss", getTwelveShinsal(baseYearBranch, selectedSewoon.ji));
          updateColorClasses();
        }
        updateSewoonHTML(selectedSewoon, baseDayStemS);
        const sewoonLis = document.querySelectorAll("#sewoonList li");
        sewoonLis.forEach(li => li.classList.remove("active"));
        if (sewoonLis[sewoonIndex - 1]) { sewoonLis[sewoonIndex - 1].classList.add("active"); }
        updateColorClasses();
        const boundariesForSewoon = getSolarTermBoundaries(computedYear);
        const targetSolarTerm = boundariesForSewoon[0].name;
        updateMonthlyFortuneCalendar(targetSolarTerm, computedYear);
        document.querySelectorAll("#mowoonList li").forEach(li => li.classList.remove("active"));
      });
    });

    globalState.computedYear = currentSolarYear;
    if (!currentTerm) { currentTerm = boundariesArr[0]; }
    updateMonthlyFortuneCalendar(currentTerm.name, currentSolarYear);
    (function setupMowoonListActive() {
      const displayedMonth = currentTerm.date.getMonth() + 1;
      document.querySelectorAll("#mowoonList li").forEach(function (li) {
        const liMonth = parseInt(li.getAttribute("data-index3"), 10);
        li.classList.toggle("active", liMonth === displayedMonth);
      });
    })();

    document.querySelectorAll("#mowoonList li").forEach(function(li) {
      li.addEventListener("click", function(event) {
        event.stopPropagation();
        document.querySelectorAll("#mowoonList li").forEach(function(item) {
          item.classList.remove("active");
        });
        li.classList.add("active");
        document.getElementById('iljuCalender').style.display = 'grid';
        const termName = li.getAttribute("data-solar-term") || "";
        const computedYear = globalState.computedYear || (function(){
          const today = new Date();
          const ipChun = findSolarTermDate(today.getFullYear(), 315);
          return (today < ipChun) ? today.getFullYear() - 1 : today.getFullYear();
        })();
        globalState.activeMonth = parseInt(li.getAttribute("data-index3"), 10);
        updateMonthlyFortuneCalendar(termName, computedYear);
      });
    });

    function getMyounPillars(birthYearPillar, birthMonthPillar, birthDateObj, refDate, gender) {
      let finalYearPillar = birthYearPillar;
      function getAgeByDate(birthDate) {
        let age = refDate.getFullYear() - birthDate.getFullYear();
        const m = refDate.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && refDate.getDate() < birthDate.getDate())) {
          age--;
        }
        return age;
      }
      const ageOnRef = getAgeByDate(birthDateObj, refDate);
      const firstBirthday = new Date(birthDateObj);
      firstBirthday.setFullYear(firstBirthday.getFullYear() + 1);
      if (refDate < firstBirthday || ageOnRef < 61) {
        finalYearPillar = birthYearPillar;
      } else {
        const originalIndex = getGanZhiIndex(birthYearPillar);
        const correctedDate = adjustBirthDate(birthDateObj, birthPlace);
        const originalYearPillarData = getYearGanZhi(correctedDate, BirthDateObj.getFullYear());
        if (originalIndex >= 0) {
          const isYangStem = ["갑", "병", "무", "경", "임"].includes(originalYearPillarData.charAt(0));
          const direction = ((gender === "남" && isYangStem) || (gender === "여" && !isYangStem)) ? 1 : -1;
          const stepCount = Math.floor((ageOnRef - 60) / someInterval);
          finalYearPillar = getGanZhiFromIndex(originalIndex + direction + 60);
        }
      }

      function getCurrentDaewoonMonthPillar(birthPlace, gender, referenceDate) {
        const currAge = getAgeByDate(birthDate, referenceDate);
        const daewoonData = getDaewoonData(birthPlace, gender);
        for (let i = daewoonData.list.length - 1; i >= 0; i--) {
          if (daewoonData.list[i].age <= currAge) {
            return daewoonData.list[i].stem + daewoonData.list[i].branch;
          }
        }
        return daewoonData.list[0].stem + daewoonData.list[0].branch;
      }
      let finalMonthPillar = birthMonthPillar; // 원국 월주 값(초기값)
      finalMonthPillar = getCurrentDaewoonMonthPillar(birthPlace, gender, refDate);

      let iljuDate = new Date(
        adjustedBirthDateObj.getFullYear(),
        adjustedBirthDateObj.getMonth(),
        adjustedBirthDateObj.getDate(),
        0, 0
      );
      let sijuDate = new Date(
        adjustedBirthDateObj.getFullYear(),
        adjustedBirthDateObj.getMonth(),
        adjustedBirthDateObj.getDate(),
        adjustedBirthDateObj.getHours(),
        adjustedBirthDateObj.getMinutes()
      );
      const originalYearPillarData = getYearGanZhi(correctedDate, adjustedBirthDateObj.getFullYear());
      const isYangStem = ["갑", "병", "무", "경", "임"].includes(originalYearPillarData.charAt(0));
      const direction = ((gender === "남" && isYangStem) || (gender === "여" && !isYangStem)) ? 1 : -1;


      const direction_ilju = direction; 
      const originalIljuIndex = getGanZhiIndex(natalChartData.dayPillar); 
      let iljuIndex = (originalIljuIndex + direction_ilju + 60) % 60;

      const direction_siju = direction;
      const originalSijuIndex = getGanZhiIndex(natalChartData.hourPillar);
      let sijuIndex = (originalSijuIndex + direction_siju + 60) % 60;

      function nextIlju() {
        const nextDate = new Date(iljuDate.getTime());
        nextDate.setDate(nextDate.getDate() + 120);
        const nextIndex = (iljuIndex + direction_ilju + 60) % 60;
        return { date: nextDate, index: nextIndex };
      }
      function nextSiju() {
        const nextDate = new Date(sijuDate.getTime());
        nextDate.setDate(nextDate.getDate() + 10);
        const nextIndex = (sijuIndex + direction_siju + 60) % 60;
        return { date: nextDate, index: nextIndex };
      }

      while (true) {
        const ni = nextIlju();
        const ns = nextSiju();
        let nextEvent, eventType;
        if (ni.date < ns.date) {
          nextEvent = ni;
          eventType = "ilju";
        } else {
          nextEvent = ns;
          eventType = "siju";
        }
        if (nextEvent.date > refDate) break;
        
        if (eventType === "ilju") {
          iljuDate = nextEvent.date;
          iljuIndex = nextEvent.index;
          lastIljuChangeDate = new Date(iljuDate.getTime());
        } else {
          sijuDate = nextEvent.date;
          sijuIndex = nextEvent.index;
          lastSijuChangeDate = new Date(sijuDate.getTime());
        }
      }

      const finalDayPillar = getGanZhiFromIndex(iljuIndex);   
      const finalHourPillar = getGanZhiFromIndex(sijuIndex);    
    
      return {
        yearPillar: finalYearPillar,    
        monthPillar: finalMonthPillar,   
        dayPillar: finalDayPillar,       
        hourPillar: finalHourPillar      
      };
    }

    let myounResult = getMyounPillars(birthYearPillar, birthMonthPillar, birthDateObj, refDate, gender);

    function updateMyowoonSection(myounResult, daySplit, yearSplit) {
      function setText(id, text) {
        const elem = document.getElementById(id);
        if (elem) elem.innerText = text;
      }
      function applyColor(id, key) {
        const elem = document.getElementById(id);
        if (elem && colorMapping && colorMapping[key]) {
          elem.classList.remove("b_green", "b_red", "b_yellow", "b_white", "b_black", "green", "red", "yellow", "white", "black");
          elem.classList.add(colorMapping[key].textColor);
        }
      }

      const yearStem = myounResult.yearPillar.charAt(0), yearBranch = myounResult.yearPillar.charAt(1);
      setText("MyoYtHanja", stemMapping[yearStem] ? stemMapping[yearStem].hanja : yearStem); applyColor("MyoYtHanja", stemMapping[yearStem] ? stemMapping[yearStem].hanja : yearStem);
      setText("MyoYtHanguel", stemMapping[yearStem] ? stemMapping[yearStem].hanguel : yearStem);
      setText("MyoYtEumyang", stemMapping[yearStem] ? stemMapping[yearStem].eumYang : "-");
      setText("MyoYt10sin", getTenGodForStem(yearStem, baseDayStem));
      setText("MyoYbHanja", branchMapping[yearBranch] ? branchMapping[yearBranch].hanja : yearBranch); applyColor("MyoYbHanja", branchMapping[yearBranch] ? branchMapping[yearBranch].hanja : yearBranch);
      setText("MyoYbHanguel", branchMapping[yearBranch] ? branchMapping[yearBranch].hanguel : yearBranch);
      setText("MyoYbEumyang", branchMapping[yearBranch] ? branchMapping[yearBranch].eumYang : "-");
      setText("MyoYb10sin", getTenGodForBranch(yearBranch, baseDayStem));
      const hiddenYear = hiddenStemMapping[yearBranch] || ["-", "-", "-"];
      setText("MyoYbJj1", hiddenYear[0]); setText("MyoYbJj2", hiddenYear[1]); setText("MyoYbJj3", hiddenYear[2]);
      setText("MyoYb12ws", getTwelveUnseong(baseDayStem, yearBranch));
      setText("MyoYb12ss", getTwelveShinsal(baseYearBranch, yearBranch));

      const monthStem = myounResult.monthPillar.charAt(0), monthBranch = myounResult.monthPillar.charAt(1);
      setText("MyoMtHanja", stemMapping[monthStem] ? stemMapping[monthStem].hanja : monthStem); applyColor("MyoMtHanja", stemMapping[monthStem] ? stemMapping[monthStem].hanja : monthStem);
      setText("MyoMtHanguel", stemMapping[monthStem] ? stemMapping[monthStem].hanguel : monthStem);
      setText("MyoMtEumyang", stemMapping[monthStem] ? stemMapping[monthStem].eumYang : "-");
      setText("MyoMt10sin", getTenGodForStem(monthStem, baseDayStem));
      setText("MyoMbHanja", branchMapping[monthBranch] ? branchMapping[monthBranch].hanja : monthBranch); applyColor("MyoMbHanja", branchMapping[monthBranch] ? branchMapping[monthBranch].hanja : monthBranch);
      setText("MyoMbHanguel", branchMapping[monthBranch] ? branchMapping[monthBranch].hanguel : monthBranch);
      setText("MyoMbEumyang", branchMapping[monthBranch] ? branchMapping[monthBranch].eumYang : "-");
      setText("MyoMb10sin", getTenGodForBranch(monthBranch, baseDayStem));
      const hiddenMonth = hiddenStemMapping[monthBranch] || ["-", "-", "-"];
      setText("MyoMbJj1", hiddenMonth[0]); setText("MyoMbJj2", hiddenMonth[1]); setText("MyoMbJj3", hiddenMonth[2]);
      setText("MyoMb12ws", getTwelveUnseong(baseDayStem, monthBranch));
      setText("MyoMb12ss", getTwelveShinsal(baseYearBranch, monthBranch));

      const dayP = myounResult.dayPillar;
      const dayStem = dayP.charAt(0);
      const dayBranch = dayP.slice(1);
      setText("MyoDtHanja", stemMapping[dayStem] ? stemMapping[dayStem].hanja : dayStem);
      applyColor("MyoDtHanja", stemMapping[dayStem] ? stemMapping[dayStem].hanja : dayStem);
      setText("MyoDtHanguel", stemMapping[dayStem] ? stemMapping[dayStem].hanguel : dayStem);
      setText("MyoDtEumyang", stemMapping[dayStem] ? stemMapping[dayStem].eumYang : "-");
      setText("MyoDt10sin", getTenGodForStem(dayStem, baseDayStem));
      setText("MyoDbHanja", branchMapping[dayBranch] ? branchMapping[dayBranch].hanja : dayBranch);
      applyColor("MyoDbHanja", branchMapping[dayBranch] ? branchMapping[dayBranch].hanja : dayBranch);
      setText("MyoDbHanguel", branchMapping[dayBranch] ? branchMapping[dayBranch].hanguel : dayBranch);
      setText("MyoDbEumyang", branchMapping[dayBranch] ? branchMapping[dayBranch].eumYang : "-");
      setText("MyoDb10sin", getTenGodForBranch(dayBranch, baseDayStem));
      const hiddenDay = hiddenStemMapping[dayBranch] || ["-", "-", "-"];
      setText("MyoDbJj1", hiddenDay[0]);
      setText("MyoDbJj2", hiddenDay[1]);
      setText("MyoDbJj3", hiddenDay[2]);
      setText("MyoDb12ws", getTwelveUnseong(baseDayStem, dayBranch));
      setText("MyoDb12ss", getTwelveShinsal(baseYearBranch, dayBranch));

      const hourP = myounResult.hourPillar;
      const hourStem = hourP.charAt(0);
      const hourBranch = hourP.slice(1);
      setText("MyoHtHanja", stemMapping[hourStem] ? stemMapping[hourStem].hanja : hourStem);
      applyColor("MyoHtHanja", stemMapping[hourStem] ? stemMapping[hourStem].hanja : hourStem);
      setText("MyoHtHanguel", stemMapping[hourStem] ? stemMapping[hourStem].hanguel : hourStem);
      setText("MyoHtEumyang", stemMapping[hourStem] ? stemMapping[hourStem].eumYang : "-");
      setText("MyoHt10sin", getTenGodForStem(hourStem, baseDayStem));
      setText("MyoHbHanja", branchMapping[hourBranch] ? branchMapping[hourBranch].hanja : hourBranch);
      applyColor("MyoHbHanja", branchMapping[hourBranch] ? branchMapping[hourBranch].hanja : hourBranch);
      setText("MyoHbHanguel", branchMapping[hourBranch] ? branchMapping[hourBranch].hanguel : hourBranch);
      setText("MyoHbEumyang", branchMapping[hourBranch] ? branchMapping[hourBranch].eumYang : "-");
      setText("MyoHb10sin", getTenGodForBranch(hourBranch, baseDayStem));
      const hiddenHour = hiddenStemMapping[hourBranch] || ["-", "-", "-"];
      setText("MyoHbJj1", hiddenHour[0]);
      setText("MyoHbJj2", hiddenHour[1]);
      setText("MyoHbJj3", hiddenHour[2]);
      setText("MyoHb12ws", getTwelveUnseong(baseDayStem, hourBranch));
      setText("MyoHb12ss", getTwelveShinsal(baseYearBranch, hourBranch));
    }
    updateMyowoonSection(myounResult, daySplit, yearSplit);

    document.getElementById('myowoonMore').addEventListener('click', function(){
      let myowoonMoreElem = document.getElementById('myowoonMore');
      if (myowoonMoreElem.classList.contains("active")) {
        document.getElementById('wongookLM').classList.remove("w100");
        document.getElementById('luckyWrap').style.display = 'block';
        document.getElementById('woonArea').style.display = 'block';
        document.getElementById('woonContainer').style.display = 'none';
        document.getElementById('calArea').style.display = 'none';
        myowoonMoreElem.classList.remove("active");
        myowoonMoreElem.innerText = "묘운력(운 전체) 상세보기";
      } else {
        document.getElementById('wongookLM').classList.add("w100");
        document.getElementById('luckyWrap').style.display = 'none';
        document.getElementById('woonArea').style.display = 'none';
        document.getElementById('woonContainer').style.display = 'flex';
        document.getElementById('calArea').style.display = 'block';
        let daySplit = splitSet(dayPillar), yearSplit = splitSet(yearPillar);
        updateMyowoonSection(myounResult, daySplit, yearSplit);
        myowoonMoreElem.classList.add("active");
        myowoonMoreElem.innerText = "원래 화면으로 가기";
      }
    });

    document.getElementById('backBtn').addEventListener('click', function () {
      window.location.reload();
    });

    document.getElementById('wongookLM').classList.remove("w100");
    document.getElementById('luckyWrap').style.display = 'block';
    document.getElementById('woonArea').style.display = 'block';
    document.getElementById('woonContainer').style.display = 'none';
    document.getElementById('calArea').style.display = 'none';

    function updateDayWoon(refDate) {
      if (!(refDate instanceof Date) || isNaN(refDate.getTime())) { refDate = new Date(); }
      const jasiElem = document.getElementById("jasi");
      const yajojasiElem = document.getElementById("yajojasi");
      const insiElem = document.getElementById("insi");
      let adjustedDate = new Date(refDate.getTime());
      if (jasiElem && jasiElem.checked) {
        adjustedDate = new Date(adjustedDate.getFullYear(), adjustedDate.getMonth(), adjustedDate.getDate(), -1, 23, 0);
      } else if (yajojasiElem && yajojasiElem.checked) {
        adjustedDate = new Date(adjustedDate.getFullYear(), adjustedDate.getMonth(), adjustedDate.getDate() - 1, 23, 0);
      } else if (insiElem && insiElem.checked) {
        adjustedDate = new Date(adjustedDate.getFullYear(), adjustedDate.getMonth(), adjustedDate.getDate(), 3, 0);
      }
      const dayGanZhi = getDayGanZhi(adjustedDate);
      const daySplitFuc = splitSet(dayGanZhi);
      setText("WDtHanja", stemMapping[daySplitFuc.gan]?.hanja || "-");
      setText("WDtHanguel", stemMapping[daySplitFuc.gan]?.hanguel || "-");
      setText("WDtEumyang", stemMapping[daySplitFuc.gan]?.eumYang || "-");
      setText("WDt10sin", getTenGodForStem(daySplitFuc.gan, baseDayStem) || "-");
      setText("WDbHanja", branchMapping[daySplitFuc.ji]?.hanja || "-");
      setText("WDbHanguel", branchMapping[daySplitFuc.ji]?.hanguel || "-");
      setText("WDbEumyang", branchMapping[daySplitFuc.ji]?.eumYang || "-");
      setText("WDb10sin", getTenGodForBranch(daySplitFuc.ji, baseDayStem) || "-");
      updateHiddenStems(daySplitFuc.ji, "WDb");
      setText("WDb12ws", getTwelveUnseong(baseDayStem, daySplitFuc.ji) || "-");
      setText("WDb12ss", getTwelveShinsal(baseYearBranch, daySplitFuc.ji) || "-");
      updateColorClasses();
    }
    updateDayWoon(refDate);

    function getHourBranchUsingArray(dateObj) {
      let totalMinutes = dateObj.getHours() * 60 + dateObj.getMinutes();
      for (let i = 0; i < timeRanges.length; i++) {
        const { branch, start, end } = timeRanges[i];
        if (start < end) {
          if (totalMinutes >= start && totalMinutes < end) {
            return branch;
          }
        } else {
          if (totalMinutes >= start || totalMinutes < end) {
            return branch;
          }
        }
      }
      return null;
    }

    function updateHourWoon(refDate) {
      const date = new Date(refDate);
      const hourBranch = getHourBranchUsingArray(date);
      const hourBranchIndex = Jiji.indexOf(hourBranch);
      const dayGanZhi = getDayGanZhi(date);
      const daySplitFuc = splitSet(dayGanZhi);
      const baseHourStem = getHourStem(daySplitFuc.gan, hourBranchIndex);
      let idx = Cheongan.indexOf(baseHourStem);
      if (idx === -1) idx = 0;
      const correctedFortuneHourStem = Cheongan[(idx - 2 + Cheongan.length) % Cheongan.length];
      setText("WTtHanja", stemMapping[correctedFortuneHourStem]?.hanja || "-");
      setText("WTtHanguel", stemMapping[correctedFortuneHourStem]?.hanguel || "-");
      setText("WTtEumyang", stemMapping[correctedFortuneHourStem]?.eumYang || "-");
      setText("WTt10sin", getTenGodForStem(correctedFortuneHourStem, baseDayStem) || "-");
      setText("WTbHanja", branchMapping[hourBranch]?.hanja || "-");
      setText("WTbHanguel", branchMapping[hourBranch]?.hanguel || "-");
      setText("WTbEumyang", branchMapping[hourBranch]?.eumYang || "-");
      updateHiddenStems(hourBranch, "WTb");
      setText("WTb10sin", getTenGodForBranch(hourBranch, baseDayStem) || "-");
      setText("WTb12ws", getTwelveUnseong(baseDayStem, hourBranch) || "-");
      setText("WTb12ss", getTwelveShinsal(baseYearBranch, hourBranch) || "-");
      updateColorClasses();
    }
    updateHourWoon(refDate);

    const picker = document.getElementById("woonTimeSetPicker");
    if (picker) {
      const now = new Date();
      const yearNow = now.getFullYear();
      const monthNow = pad(now.getMonth() + 1);
      const dayNow = pad(now.getDate());
      const hoursNow = pad(now.getHours());
      const minutesNow = pad(now.getMinutes());
      picker.value = `${yearNow}-${monthNow}-${dayNow}T${hoursNow}:${minutesNow}`;
      const birthInput = document.getElementById("inputBirthday");
      if (birthInput && birthInput.value.length === 8) {
        const bYear = parseInt(birthInput.value.substring(0, 4), 10);
        const bMonth = parseInt(birthInput.value.substring(4, 6), 10) - 1;
        const bDay = parseInt(birthInput.value.substring(6, 8), 10);
        const bDate = new Date(bYear, bMonth, bDay);
        const minSelectable = new Date(bDate.getFullYear() + 1, bDate.getMonth(), bDate.getDate());
        const minYear = minSelectable.getFullYear();
        const minMonth = pad(minSelectable.getMonth() + 1);
        const minDay = pad(minSelectable.getDate());
        picker.min = `${minYear}-${minMonth}-${minDay}T00:00`;
      }
    }

    document.getElementById("woonChangeBtn").addEventListener("click", function () {
      let refDate = (picker && picker.value) ? new Date(picker.value) : new Date();
      updateMyowoonSection(myounResult, daySplit, yearSplit);
      updateCurrentSewoon(refDate);
      updateMonthlyWoonByToday(refDate);
      updateDayWoon(refDate);
      updateHourWoon(refDate);
    });

  
    function collectInputData() {
      const birthdayStr = document.getElementById("inputBirthday").value.trim();
      const birthtimeStr = document.getElementById("inputBirthtime").value.trim();
      const yearVal = parseInt(birthdayStr.substring(0, 4), 10);
      const monthVal = parseInt(birthdayStr.substring(4, 6), 10);
      const dayVal = parseInt(birthdayStr.substring(6, 8), 10);
      const hourVal = parseInt(birthtimeStr.substring(0, 2), 10);
      const minuteVal = parseInt(birthtimeStr.substring(2, 4), 10);
      const genderVal = document.getElementById("genderMan").checked ? "남" :
                        document.getElementById("genderWoman").checked ? "여" : "-";
      const birthPlaceVal = document.getElementById("inputBirthPlace").value || "-";
      const time2 = document.querySelector('input[name="time2"]:checked').value;
      return { year: yearVal, month: monthVal, day: dayVal, hour: hourVal, minute: minuteVal, gender: genderVal, birthPlace: birthPlaceVal, time2: time2 };
    }
    
    function updateFortune() {
      updateStemInfo("Yt", yearSplit, baseDayStem);
      updateStemInfo("Mt", monthSplit, baseDayStem);
      updateStemInfo("Dt", daySplit, baseDayStem);
      updateStemInfo("Ht", hourSplit, baseDayStem);
      updateBranchInfo("Yb", baseYearBranch, baseDayStem);
      updateBranchInfo("Mb", monthSplit.ji, baseDayStem);
      updateBranchInfo("Db", daySplit.ji, baseDayStem);
      updateBranchInfo("Hb", hourSplit.ji, baseDayStem);
      updateOriginalSetMapping();
      updateColorClasses();
    }
    
    const inputData = collectInputData();
    const selectedTime2 = document.querySelector('input[name="time2"]:checked').value;
    if (selectedTime2 === "jasi") {
      document.getElementById("timeChk02_01").checked = true;
    } else if (selectedTime2 === "yajojasi") {
      document.getElementById("timeChk02_02").checked = true;
    } else if (selectedTime2 === "insi") {
      document.getElementById("timeChk02_03").checked = true;
    }
    
    const resultRadios = document.querySelectorAll('#checkOption input[type="radio"]');
    resultRadios.forEach(function(radio) {
      radio.addEventListener("change", function () {
        const selectedTime2 = document.querySelector('input[name="timeChk02"]:checked').value;
        document.querySelectorAll('input[name="time2"]').forEach(el => el.checked = false);
        if (selectedTime2 === "jasi") {
          document.getElementById("jasi").checked = true;
        } else if (selectedTime2 === "yajojasi") {
          document.getElementById("yajojasi").checked = true;
        } else if (selectedTime2 === "insi") {
          document.getElementById("insi").checked = true;
        }
        updateFortune(inputData);
      });
    });
    
    document.getElementById('resultWrapper').style.display = 'block';
    document.getElementById('inputWrap').style.display = 'none';
  });
});