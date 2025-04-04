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
  const longitudeCorrection = (cityLongitude - 135.1) * 4;
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
  //const ipChun = findSolarTermDate(birthDate.getFullYear(), 315);
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
function getHourStem(dayPillar, hourBranchIndex) {
  const dayStem = getDayStem(dayPillar);
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
function splitPillar(Set) {
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

// 120년 평균값을 구하는 함수 (이미 있으신 get120YearAverages)
function get120YearAverages(birthDate) {
  const oneDayMs = 24 * 60 * 60 * 1000;
  const endDate = new Date(birthDate.getTime());
  endDate.setFullYear(endDate.getFullYear() + 120);
  const totalDays = (endDate - birthDate) / oneDayMs;
  const averageYear = totalDays / 120;
  const averageMonth = averageYear / 12;
  const averageDecade = averageYear * 10;
  return { totalDays, averageYear, averageMonth, averageDecade };
}

function convertDaysToYMDHMS(totalDays, avgYear, avgMonth) {
  const years = Math.floor(totalDays / avgYear);
  let remainderDays = totalDays - years * avgYear;
  const months = Math.floor(remainderDays / avgMonth);
  remainderDays -= months * avgMonth;
  const days = Math.floor(remainderDays);
  const fractionDay = remainderDays - days;
  const hours = Math.floor(fractionDay * 24);
  const minutes = Math.floor((fractionDay * 24 - hours) * 60);
  const seconds = Math.floor((((fractionDay * 24) - hours) * 60 - minutes) * 60);
  return { years, months, days, hours, minutes, seconds };
}

// 해당 년도가 윤년인지 판별
function isLeapYear(year) {
  return (year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0);
}

// 해당 년도의 일수를 계산 (윤년이면 366일, 아니면 365일)
function getDaysInYear(year) {
  return isLeapYear(year) ? 366 : 365;
}

const oneDayMs = 24 * 60 * 60 * 1000;

function getDecimalBirthYear(birthDate) {
  const startOfYear = new Date(birthDate.getFullYear(), 0, 1);
  const diffDays = (birthDate - startOfYear) / oneDayMs;
  // 해당 연도의 전체 일수 (윤년 여부 반영)
  const totalDays = isLeapYear(birthDate.getFullYear()) ? 366 : 365;
  return birthDate.getFullYear() + diffDays / totalDays;
}

function getDaewoonData(birthPlace, gender) {
  const birthDate = globalState.correctedBirthDate;
  const originalDate = new Date(birthDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  const correctedDate = adjustBirthDate(originalDate, birthPlace);
  const inputYear = globalState.correctedBirthDate.getFullYear();
  const ipChunForSet = findSolarTermDate(inputYear, 315);
  //const ipChunForSet = findSolarTermDate(birthDate.getFullYear(), 315);
  const effectiveYearForSet = (originalDate < ipChunForSet) ? inputYear - 1 : inputYear;
  const effectiveYearForDaewoon = inputYear;
  const yearPillar = getYearGanZhi(correctedDate, effectiveYearForSet);
  const monthPillar = getMonthGanZhi(correctedDate, effectiveYearForSet);
  const dayStemRef = getDayGanZhi(correctedDate).charAt(0);
  const isYang = ["갑", "병", "무", "경", "임"].includes(yearPillar.charAt(0));
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
  const avgData = get120YearAverages(targetTerm.date);
  let dynamicWoljuCycle = avgData.averageDecade;
  const avgMonthLength = avgData.averageMonth;
  const daysDiff = isForward
    ? Math.round((targetTerm.date - correctedDate) / oneDayMs)
    : Math.round((correctedDate - targetTerm.date) / oneDayMs);

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
  
  let currentMonthIndex = MONTH_ZHI.indexOf(monthPillar.charAt(1));
  let monthStemIndex = Cheongan.indexOf(monthPillar.charAt(0));
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

function getEffectiveYearForSet(dateObj) {
  // 해당 연도의 입춘(315°)을 구합니다.
  const ipChun = findSolarTermDate(dateObj.getFullYear(), 315);
  const year = dateObj.getFullYear();

  if (dateObj < ipChun) {
    return year - 1;
  } else {
    return year;
  }

}

function getFourPillarsWithDaewoon(year, month, day, hour, minute, birthPlace, gender) {
	const originalDate = new Date(year, month - 1, day, hour, minute);
	const correctedDate = adjustBirthDate(originalDate, birthPlace);
  const effectiveYearForSet = getEffectiveYearForSet(correctedDate);
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
  let hourDayPillar;
  if (hourBranchIndex === 0) {
    if (solarTime < boundaryDate) {
      hourBranchIndex = 11;
    } else {
      hourDayPillar = getDayGanZhi(nominalBirthDate);
    }
  } else if(hourBranchIndex === 1) {
    hourBranchIndex = 1;
  }

  if (isInsi && correctedDate.getHours() < 3) {
    hourDayPillar = getDayGanZhi(nominalBirthDatePrev);
  } else if (hourBranchIndex === 0){
    hourDayPillar = getDayGanZhi(nominalBirthDate);
  } else {
    hourDayPillar = getDayGanZhi(nominalBirthDatePrev);
  }

  if (hourBranchIndex === 0 && (yajojasi && correctedDate.getHours() >= 0 && correctedDate.getHours() <= 3) || hourBranchIndex === 0 && (isJasi && correctedDate.getHours() >= 0 && correctedDate.getHours() <= 3)){
    hourDayPillar = getDayGanZhi(nominalBirthDatePrev);
  } else if (hourBranchIndex === 0 && (yajojasi && correctedDate.getHours() < 24) || hourBranchIndex === 0 && (isJasi && correctedDate.getHours() < 24)) {
    hourDayPillar = getDayGanZhi(nominalBirthDate);
  }
  const hourStem = getHourStem(hourDayPillar, hourBranchIndex);
  const hourPillar = hourStem + Jiji[hourBranchIndex];

  const yearPillar = getYearGanZhi(correctedDate, effectiveYearForSet);
  const monthPillar = getMonthGanZhi(correctedDate, effectiveYearForSet);

  if (yajojasi && correctedDate.getHours() >= 24){
    const daypillar = getDayGanZhi(nominalBirthDate);
    return `${yearPillar} ${monthPillar} ${daypillar} ${hourPillar}, ${getDaewoonDataStr(birthPlace, gender)}`;
  } 
    
  if (isJasi && correctedDate.getHours() >= 23){
    const daypillar = getDayGanZhi(nominalBirthDate2);
    return `${yearPillar} ${monthPillar} ${daypillar} ${hourPillar}, ${getDaewoonDataStr(birthPlace, gender)}`;
  } 

  if (isInsi && correctedDate.getHours() < 3){
    const daypillar = getDayGanZhi(nominalBirthDatePrev);
    return `${yearPillar} ${monthPillar} ${daypillar} ${hourPillar}, ${getDaewoonDataStr(birthPlace, gender)}`;
  } else {
    const daypillar = getDayGanZhi(nominalBirthDate);
    return `${yearPillar} ${monthPillar} ${daypillar} ${hourPillar}, ${getDaewoonDataStr(birthPlace, gender)}`;
  }	
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

  // -------------------------
  // Helper 함수들
  // -------------------------
  function calculateAge(birthDate) {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  function formatDate(dateObj) {
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
    const dd = String(dateObj.getDate()).padStart(2, "0");
    return `${yyyy}.${mm}.${dd}`;
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

  // saveBtn 이벤트 리스너
  document.getElementById("saveBtn").addEventListener("click", function () {
    // 입력값 읽어오기
    let birthday = document.getElementById("inputBirthday").value.trim();
    let birthtime = document.getElementById("inputBirthtime").value.trim();
    let gender = document.getElementById("genderMan").checked ? "남" : "여";
    let birthPlace = document.getElementById("inputBirthPlace").value;
    let name = document.getElementById("inputName").value.trim() || "이름없음";

    // 기본 검증
    if (birthday.length !== 8 || birthtime.length !== 4) {
      alert("생년월일은 YYYYMMDD, 태어난 시간은 HHMM 형식이어야 합니다.");
      return;
    }

    // 숫자 파싱
    let year = parseInt(birthday.substring(0, 4), 10);
    let month = parseInt(birthday.substring(4, 6), 10);
    let day = parseInt(birthday.substring(6, 8), 10);
    let hour = parseInt(birthtime.substring(0, 2), 10);
    let minute = parseInt(birthtime.substring(2, 4), 10);

    // 계산 함수 호출
    let computedResult = getFourPillarsWithDaewoon(year, month, day, hour, minute, birthPlace, gender);
    let pillarsPart = computedResult.split(", ")[0]; // 예: "병자 경인 정묘 무오시"
    let pillars = pillarsPart.split(" ");
    let yearPillar = pillars[0] || "";
    let monthPillar = pillars[1] || "";
    let dayPillar = pillars[2] || "";
    let hourPillar = pillars[3] || "";

    let originalDate = new Date(year, month - 1, day, hour, minute);
    let correctedDate = adjustBirthDate(originalDate, birthPlace);
    let age = calculateAge(correctedDate);
    let birthdayTime = formatDate(correctedDate);

    // 저장할 데이터 객체 구성
    let newData = {
      birthday: birthday,
      birthtime: birthtime,
      gender: gender,
      birthPlace: birthPlace,
      name: name,
      result: computedResult,
      yearPillar: yearPillar,
      monthPillar: monthPillar,
      dayPillar: dayPillar,
      hourPillar: hourPillar,
      age: age,
      birthdayTime: birthdayTime
    };

    // 로컬스토리지에서 목록 읽어오기
    let list = JSON.parse(localStorage.getItem("myeongsikList")) || [];
    // 중복 검사 (생년월일, 태어난 시간, 성별, 출생지, 이름 모두 동일한 경우)
    let alreadySaved = list.some(function (item) {
      return item.birthday === newData.birthday &&
              item.birthtime === newData.birthtime &&
              item.gender === newData.gender &&
              item.birthPlace === newData.birthPlace &&
              item.name === newData.name;
    });
    if (alreadySaved) {
      alert("이미 저장된 명식입니다.");
      return;
    }
    // 중복이 아니라면 저장
    list.push(newData);
    localStorage.setItem("myeongsikList", JSON.stringify(list));
    loadSavedMyeongsikList();
    alert("저장이 성공적으로 완료 되었습니다.");
  });

  let savedMyeongsikList = [];

  // loadSavedMyeongsikList 함수 (목록 구성 및 detailView, delete 버튼 이벤트 등록)
  function loadSavedMyeongsikList() {
    const savedList = JSON.parse(localStorage.getItem("myeongsikList")) || [];
    savedMyeongsikList = savedList; 
    const listUl = document.querySelector("aside .list_ul");
    if (!listUl) return;
    listUl.innerHTML = "";
    
    savedList.forEach((item, index) => {
      listUl.innerHTML += `
        <li data-index="${index}">
          <div class="info_btn_zone">
            <button class="drag_btn_zone" id="dragBtn_${index + 1}">
              <div class="line"></div>
              <div class="line"></div>
              <div class="line"></div>
            </button>
            <div class="info">
              <p>
                <span><b id="nameSV_${index + 1}">${item.name}</b></span>
                <span>(만 <b id="ageSV_${index + 1}">${item.age}</b>세, <b id="genderSV_${index + 1}">${item.gender}</b>)</span>
              </p>
              <p>
                <span><b id="yearGZ_${index + 1}">${item.yearPillar}</b>년</span>
                <span><b id="monthGZ_${index + 1}">${item.monthPillar}</b>월</span>
                <span><b id="dayGZ_${index + 1}">${item.dayPillar}</b>일</span>
                <span><b id="timeGZ_${index + 1}">${item.hourPillar}</b>시</span>
              </p>
              <p>
                <span id="birthdaySV_${index + 1}">
                  ${item.birthday.substring(0, 4)}년 
                  ${item.birthday.substring(4, 6)}월 
                  ${item.birthday.substring(6, 8)}일
                </span>
                <span id="birthtimeSV_${index + 1}">
                  ${item.birthtime.substring(0, 2)}시 
                  ${item.birthtime.substring(2, 4)}분
                </span>
              </p>
              <p>
                <span><b id="birthPlaceSV_${index + 1}">${item.birthPlace}</b></span>
              </p>
            </div>
          </div>
          <div class="btn_zone">
            <button class="black_btn detailViewBtn" id="detailViewBtn_${index + 1}" data-index="${index}">명식 보기</button>
            <button button class="black_btn modify_btn" id="modifyBtn_${index + 1}" data-index="${index}">수정</button>
            <button class="black_btn delete_btn" data-index="delete_${index + 1}"><span>&times;</span></button>
          </div>
        </li>
      `;

      const dragNotice = document.querySelector(".pharases");
      const dragBtn = document.querySelector(".drag_btn_zone");
      if (savedList.length >= 2) {
        dragNotice.style.display = "block";
        dragBtn.style.display = "block";
      } else {
        dragNotice.style.display = "none";
        dragBtn.style.display = "none";
      }
    });
    
    // detailViewBtn 이벤트 등록
    document.querySelectorAll(".detailViewBtn").forEach(function (button) {
      button.addEventListener("click", function (e) {
        e.stopPropagation();
        const idx = parseInt(button.getAttribute("data-index"), 10);
        const item = savedList[idx];
        if (item) {
          document.getElementById("inputName").value = item.name;
          document.getElementById("inputBirthday").value = item.birthday;
          document.getElementById("inputBirthtime").value = item.birthtime;
          
          if (item.gender === "남") {
            document.getElementById("genderMan").checked = true;
            document.getElementById("genderWoman").checked = false;
          } else {
            document.getElementById("genderWoman").checked = true;
            document.getElementById("genderMan").checked = false;
          }
          document.getElementById("inputBirthPlace").value = item.birthPlace;
          // 자동 계산 실행 (필요시 setTimeout 추가)
          document.getElementById("calcBtn").click();
        }
        document.getElementById("aside").style.display = "none";
        document.getElementById("inputWrap").style.display = "none";
        document.getElementById("resultWrapper").style.display = "block";
        window.scrollTo(0, 0);
      });
    });
    
    // delete 버튼 이벤트 등록
    document.querySelectorAll(".delete_btn").forEach(function (button) {
      button.addEventListener("click", function (e) {
        e.stopPropagation(); // li 클릭 이벤트 방지
    
        // 삭제 확인 창
        const confirmDelete = confirm("정말로 해당 명식을 삭제하시겠습니까?");
        if (!confirmDelete) return;
    
        const dataIndex = button.getAttribute("data-index");
        const idxStr = dataIndex.replace("delete_", "");
        const idx = parseInt(idxStr, 10) - 1;
        let list = JSON.parse(localStorage.getItem("myeongsikList")) || [];
        if (idx >= 0 && idx < list.length) {
          list.splice(idx, 1);
          localStorage.setItem("myeongsikList", JSON.stringify(list));
          loadSavedMyeongsikList();
          alert("해당 명식이 삭제되었습니다.");
        }
      });
    });
  }

  // aside 열기/닫기 이벤트 등록
  document.getElementById("listViewBtn").addEventListener("click", function () {
    loadSavedMyeongsikList();
    document.getElementById("aside").style.display = "block";
  });
  document.getElementById("closeBtn").addEventListener("click", function () {
    document.getElementById("aside").style.display = "none";
  });
  document.getElementById("backBtnAS").addEventListener("click", function () {
    document.getElementById("aside").style.display = "none";
  });

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
    let birthDate = new Date(year, month - 1, day, hour, minute);

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
    updateBaseDayStem();

    const formattedBirth = `${year}-${pad(month)}-${pad(day)}`;
    setText("resBirth", formattedBirth);
    if (lunarDate) {
      const formattedLunar = `${lunarDate.year}-${pad(lunarDate.month)}-${pad(lunarDate.day)}${lunarDate.isLeap ? " (윤달)" : ""}`;
      setText("resBirth2", formattedLunar);
    } 

    const solarDate = globalState.correctedBirthDate;
    const fullResult = getFourPillarsWithDaewoon(
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
    const yearSplit  = splitPillar(yearPillar);
    const monthSplit = splitPillar(monthPillar);
    const daySplit   = splitPillar(dayPillar);
    const hourSplit  = splitPillar(hourPillar);

    const birthYearPillar = yearPillar;

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

    globalState.daewoonData = getDaewoonData(birthPlace, gender);
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
      
      const displayedDaewoonNum = Math.floor(item.age);
      setText("Da" + idx, displayedDaewoonNum);

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
      //const ipChun = findSolarTermDate(birthDate.getFullYear(), 315);
      const effectiveYear = (refDate >= ipChun) ? refDate.getFullYear() : refDate.getFullYear() - 1;
      const sewoonIndex = ((effectiveYear - 4) % 60 + 60) % 60;
      const sewoonGanZhi = sexagenaryCycle[sewoonIndex];
      const sewoonSplit = splitPillar(sewoonGanZhi);

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
        const splitYear = splitPillar(yearGanZhi);
        setText("sewoonDetail", `${computedYear}년 (${splitYear.gan}${splitYear.ji})`);
      }
    }

    let activeDaewoonLi = document.querySelector("[id^='daewoon_'].active");
    let daewoonIndex = activeDaewoonLi ? parseInt(activeDaewoonLi.getAttribute("data-index"), 10) : 1;
    if (!globalState.birthYear || !globalState.daewoonData) {
      alert("먼저 계산 버튼을 눌러 출생 정보를 입력하세요.");
      return;
    }

    const decimalBirthYear = getDecimalBirthYear(globalState.correctedBirthDate);
    const originalYearPillarData = getYearGanZhi(correctedDate, birthDate.getFullYear());
    const isYangStem = ["갑", "병", "무", "경", "임"].includes(originalYearPillarData.charAt(0));
    const direction = ((gender === "남" && isYangStem) || (gender === "여" && !isYangStem)) ? 1 : -1;
    const selectedDaewoon = globalState.daewoonData.list[daewoonIndex - 1];
    if (!selectedDaewoon) return;
    const daewoonNum = selectedDaewoon.age; 
    const sewoonStartYearDecimal = decimalBirthYear + daewoonNum;
    globalState.sewoonStartYear = Math.floor(sewoonStartYearDecimal);
    const displayedDayPillar = document.getElementById("DtHanguel").innerText;
    const baseDayStemS = displayedDayPillar ? displayedDayPillar.charAt(0) : "-";
    const sewoonList = [];
    for (let j = 0; j < 10; j++) {
      let sewoonYear = globalState.sewoonStartYear + j;
      let yearGanZhi = getYearGanZhiForSewoon(sewoonYear);
      const splitYear = splitPillar(yearGanZhi);
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
    //const ipChun = findSolarTermDate(birthDate.getFullYear(), 315);
    const displayYear = (todayObj < ipChun) ? todayYear - 1 : todayYear;
    const sewoonLis = document.querySelectorAll("#sewoonList li");
    sewoonLis.forEach(li => {
      const dyearElem = li.querySelector(".dyear");
      const currentYear = Number(dyearElem.innerText);
      li.classList.toggle("active", currentYear === displayYear);
      document.getElementById('resultWrapper').style.display = 'block';
      window.scrollTo(0, 0);
      document.getElementById('inputWrap').style.display = 'none';
      document.getElementById("backBtn").style.display = "inline-block";
      document.getElementById("saveBtn").style.display = "inline-block";
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
      //const ipChun = findSolarTermDate(birthDate.getFullYear(), 315);
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
      // 중복 실행 방지를 위한 플래그 검사
      if (globalState.isNavigating) return;
      
      const btn = event.target.closest("#calPrevBtn, #calNextBtn");
      if (!btn) return;
      
      const solarYear = globalState.solarYear;
      const boundaries = globalState.boundaries;
      const currentIndex = globalState.currentIndex;
      if (solarYear === undefined || !boundaries || currentIndex === undefined) return;
      
      // 이벤트 실행 시작: 플래그 true로 설정
      globalState.isNavigating = true;
      
      let newIndex;
      if (btn.id === "calPrevBtn") {
        newIndex = (currentIndex - 1 + boundaries.length) % boundaries.length;
      } else if (btn.id === "calNextBtn") {
        newIndex = (currentIndex + 1) % boundaries.length;
      }
      
      // globalState.currentIndex 업데이트
      globalState.currentIndex = newIndex;
      
      const newTermName = boundaries[newIndex].name;
      updateMonthlyFortuneCalendar(newTermName, solarYear, newIndex);
      
      setTimeout(function () {
        const liElements = Array.from(document.querySelectorAll("#mowoonList li"));
        if (liElements.length) {
          liElements.forEach(li => li.classList.remove("active"));
          const targetIndex = newIndex % liElements.length;
          liElements[targetIndex].classList.add("active");
        }
        // 모든 처리가 끝난 후 플래그 초기화
        globalState.isNavigating = false;
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
      </ul>`;
      html += `<table class="calander_table">
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
        const decimalBirthYear = getDecimalBirthYear(globalState.correctedBirthDate);
        const selectedDaewoon = globalState.daewoonData.list[daewoonIndex - 1];
        if (!selectedDaewoon) return;
        const daewoonNum = selectedDaewoon.age; 
        const sewoonStartYearDecimal = decimalBirthYear + daewoonNum;
        globalState.sewoonStartYear = Math.floor(sewoonStartYearDecimal);
        const displayedDayPillar = document.getElementById("DtHanguel").innerText;
        const baseDayStemS = displayedDayPillar ? displayedDayPillar.charAt(0) : "-";
        const sewoonList = [];
        for (let j = 0; j < 10; j++) {
          let sewoonYear = globalState.sewoonStartYear + j;
          let yearGanZhi = getYearGanZhiForSewoon(sewoonYear);
          const splitYear = splitPillar(yearGanZhi);
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
        const splitYear = splitPillar(yearGanZhi);
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


    // 상수 및 날짜 관련 함수
    

    function getSolarYearSpanInDays(birthDate, years) {
      const endDate = new Date(birthDate);
      endDate.setFullYear(endDate.getFullYear() + years);
      return (endDate - birthDate) / oneDayMs;
    }

    function getSolarMonthSpanInDays(birthDate, months) {
      const endDate = new Date(birthDate);
      endDate.setMonth(endDate.getMonth() + months);
      return (endDate - birthDate) / oneDayMs;
    }

    function getSolarDaySpanInDays(birthDate, days) {
      const endDate = new Date(birthDate);
      endDate.setDate(endDate.getDate() + days);
      return (endDate - birthDate) / oneDayMs;
    }

    function getDynamicCycles(birthDate) {
      const yeonjuCycle = getSolarYearSpanInDays(birthDate, 60);
      const woljuCycle  = getSolarYearSpanInDays(birthDate, 10);
      const iljuCycle   = getSolarMonthSpanInDays(birthDate, 4);
      const sijuCycle   = getSolarDaySpanInDays(birthDate, 10);
      return { yeonjuCycle, woljuCycle, iljuCycle, sijuCycle };
    }

    const { yeonjuCycle, woljuCycle, iljuCycle, sijuCycle } = getDynamicCycles(birthDate);

    // 모드 결정 (순행/역행)
    // getYearGanZhi, correctedDate, gender는 이미 정의되어 있다고 가정
    const yeonjuMode = direction === 1 ? "순행" : "역행";
    const woljuMode  = direction === 1 ? "순행" : "역행";
    const iljuMode   = direction === 1 ? "순행" : "역행";
    const sijuMode   = direction === 1 ? "순행" : "역행";

    // 보정 및 동적 단계 계산 함수
    function adjustInitial(candidate, cycleDays, baseDate) {
      while (candidate < baseDate) {
        candidate = new Date(candidate.getTime() + cycleDays * oneDayMs);
      }
      return candidate;
    }

    function getDynamicStep(candidateTime, cycleDays, refDate) {
      const now = refDate || new Date();
      const diff = now - candidateTime; // 밀리초 차이
      return diff < 0 ? 0 : Math.floor(diff / (cycleDays * oneDayMs)) + 1;
    }

    // refDate를 인자로 받아 동적 업데이트 이벤트를 생성하도록 수정
    function applyFirstUpdateDynamicWithStep(date, originalIndex, cycleDays, mode, refDate) {
      const steps = getDynamicStep(date, cycleDays, refDate);
      const updatedIndex = mode === "순행"
        ? ((originalIndex + steps) % 60 + 60) % 60
        : ((originalIndex - steps) % 60 + 60) % 60;
      return { date: date, index: updatedIndex, ganji: getGanZhiFromIndex(updatedIndex) };
    }

    // getMyounPillars: 원국(출생)과 동적 운세(묘운)를 분리하여 계산
    function getMyounPillars(gender, refDate) {
      // staticBirth: 원국 계산용(출생일), dynamicBirth: picker에서 선택한 날짜가 있으면 사용
      const staticBirth = correctedDate;
      
      // 동적 계산 기준: dynamicBirth 사용;
      const jeolgi = getSolarTermBoundaries(staticBirth.getFullYear());
      let targetSolarTerm;
      if (woljuMode === "역행") {
        const pastTerms = jeolgi.filter(term => term.date <= staticBirth);
        targetSolarTerm = pastTerms.length ? pastTerms[pastTerms.length - 1] : jeolgi[0];
      } else {
        targetSolarTerm = jeolgi.find(term => term.date > staticBirth);
        if (!targetSolarTerm) {
          targetSolarTerm = getSolarTermBoundaries(staticBirth.getFullYear() + 1)[0];
        }
      }

      // ============== 시주/일주/월주/연주 오프셋 계산 함수들 수정 ==============
      birthDate = globalState.correctedBirthDate;
      // (A) 시주 동적 오프셋 계산 함수 (보정시(corrected)를 기준으로)
      function round4(num) {
        return Math.round((num * 10000)) / 10000;
      }
      
      function calculateSijuOffsetDynamic(birthDate, mode) {
        const sijuCycle = 10;         // 시주 주기 (10일)
        const totalMinutes = 1440;     // 하루 전체 분 (1440분)
        const blockLength = 120;       // 각 2시간 블록의 분 (120분)
        
        // 생시의 분 단위 값 계산
        const birthMinutes = birthDate.getHours() * 60 + birthDate.getMinutes();
        
        // 2시간 단위 블록 배열 (자정을 넘는 블록 포함)
        const blocks = [
          { start: 23 * 60, end: 1 * 60 },   // 23:00 ~ 01:00
          { start: 1 * 60,  end: 3 * 60 },    // 01:00 ~ 03:00
          { start: 3 * 60,  end: 5 * 60 },    // 03:00 ~ 05:00
          { start: 5 * 60,  end: 7 * 60 },    // 05:00 ~ 07:00
          { start: 7 * 60,  end: 9 * 60 },    // 07:00 ~ 09:00
          { start: 9 * 60,  end: 11 * 60 },   // 09:00 ~ 11:00
          { start: 11 * 60, end: 13 * 60 },   // 11:00 ~ 13:00
          { start: 13 * 60, end: 15 * 60 },   // 13:00 ~ 15:00
          { start: 15 * 60, end: 17 * 60 },   // 15:00 ~ 17:00
          { start: 17 * 60, end: 19 * 60 },   // 17:00 ~ 19:00
          { start: 19 * 60, end: 21 * 60 },   // 19:00 ~ 21:00
          { start: 21 * 60, end: 23 * 60 }    // 21:00 ~ 23:00
        ];
        
        // 현재 생시가 속한 블록 찾기
        let block = null;
        for (let i = 0; i < blocks.length; i++) {
          const b = blocks[i];
          if (b.start < b.end) {
            if (birthMinutes >= b.start && birthMinutes < b.end) {
              block = b;
              break;
            }
          } else {
            // 자정을 넘는 경우
            if (birthMinutes >= b.start || birthMinutes < b.end) {
              block = b;
              break;
            }
          }
        }
        if (!block) block = blocks[0];
        
        let ratio;
        if (mode === "순행") {
          // 순행: 생시부터 블록 끝까지 남은 분 차이
          let diff = block.end - birthMinutes;
          if (diff < 0) diff += totalMinutes;
          ratio = diff / blockLength;
        } else { // 역행 모드
          // 역행: 블록 시작부터 생시까지의 분 차이
          let diff = birthMinutes - block.start;
          if (diff < 0) diff += totalMinutes;
          ratio = diff / blockLength;
        }
        
        // 내부 계산 단계에서 4자리 반올림 적용
        ratio = round4(ratio);
        const offset = round4(ratio * sijuCycle);
        
        return Number(offset.toFixed(4));
      }

      function getDynamicIljuCycle(birthDate) {
        const startDate = new Date(birthDate);
        const endDate = new Date(birthDate);
        endDate.setFullYear(birthDate.getFullYear() + 120);
        const totalDays = (endDate - startDate) / oneDayMs;
        const totalMonths = 120 * 12; // 1440개월
        const avgMonthLength = totalDays / totalMonths;
        const cycle = avgMonthLength * 4;
        return cycle;
      }
      
      
      // 일주 오프셋(일수)을 동적으로 산출하는 함수
      // mode: "순행" 또는 "역행"
      function calculateIljuOffsetDynamic(birthDate, mode) {
        // 1. baseTime 결정: 체크박스 상태에 따라 당일 목표 시각 설정
        let baseTime = new Date(birthDate);  
        const jasiElem = document.getElementById("jasi");
        const yajojasiElem = document.getElementById("yajojasi");
        const insiElem = document.getElementById("insi");
      
        if (jasiElem && jasiElem.checked) {
          baseTime.setHours(23, 0, 0, 0);
        } else if (yajojasiElem && yajojasiElem.checked) {
          baseTime.setHours(0, 0, 0, 0);
        } else if (insiElem && insiElem.checked) {
          baseTime.setHours(3, 0, 0, 0);
        }
      
        // 2. 동적 일주 주기 계산 (출생월부터 4개월간의 총 일수)
        let dynamicIljuCycle = getDynamicIljuCycle(birthDate);
      
        // 3. mode에 따라 목표 시각과 출생 시각 간의 차이를 분 단위로 계산
        let diffMinutes;
        if (mode === "순행") {
          // 순행: 출생 시각이 baseTime보다 같거나 늦으면, 오늘의 baseTime은 이미 지났으므로 다음 날의 baseTime을 목표로 함.
          let targetTime = new Date(baseTime);
          if (birthDate >= baseTime) {
            targetTime.setDate(targetTime.getDate() + 1);
          }
          diffMinutes = (targetTime - birthDate) / oneDayMs;
        } else { // "역행" 모드
          // 역행: 출생 시각이 baseTime보다 이전이면, 그 날의 baseTime이 아직 도달하지 않았으므로 전 날의 baseTime을 목표로 함.
          let targetTime = new Date(baseTime);
          if (birthDate < baseTime) {
            targetTime.setDate(targetTime.getDate() - 1);
          }
          diffMinutes = (birthDate - targetTime) / oneDayMs;
        }
      
        // 4. 분 차이를 일 단위로 변환 (1일 = 24 * 60 분)
        const diffDays = diffMinutes / (24 * 60);
      
        // 5. 최종 오프셋(일수) = diffDays × 동적 일주 주기
        const offset = diffDays * dynamicIljuCycle;
        return offset;
      }
      

      // (C) 월주 동적 오프셋 계산 함수 (보정시 기준)
      function calculateWoljuOffsetDynamic(birthDate, mode) {
        const solarYear = birthDate.getFullYear();
        let solarBoundaries = getSolarTermBoundaries(solarYear);
        if (!solarBoundaries || solarBoundaries.length === 0) {
          console.warn("solarBoundaries is empty for solarYear:", solarYear);
          return 0;
        }
        
        let targetBoundary;
        
        if (mode === "순행") {
          // 순행 모드:
          // 만약 출생일이 현재 연도의 첫 절기보다 이전이면, 전년도 절기 배열에서 "소한" 사용.
          if (birthDate < solarBoundaries[0].date) {
            const prevBoundaries = getSolarTermBoundaries(solarYear - 1);
            targetBoundary = prevBoundaries.find(b => b.name === "소한");
            if (!targetBoundary) {
              targetBoundary = { date: findSolarTermDate(solarYear - 1, 285), name: "소한" };
            }
          } else {
            // 현재 연도에서 출생일보다 이후인 첫 번째 절기를 선택.
            targetBoundary = solarBoundaries.find(b => b.date > birthDate);
            if (!targetBoundary) {
              // 없다면, 다음 연도의 첫 절기를 사용.
              const nextBoundaries = getSolarTermBoundaries(solarYear + 1);
              targetBoundary = nextBoundaries[0];
            }
          }
        } else if (mode === "역행") {
          // 역행 모드:
          if (birthDate < solarBoundaries[0].date) {
            const prevBoundaries = getSolarTermBoundaries(solarYear - 1);
            targetBoundary = prevBoundaries.find(b => b.name === "소한");
            if (!targetBoundary) {
              targetBoundary = { date: findSolarTermDate(solarYear - 1, 285), name: "소한" };
            }
          } else {
            const candidates = solarBoundaries.filter(b => b.date <= birthDate);
            if (candidates.length > 0) {
              targetBoundary = candidates[candidates.length - 1];
            } else {
              const prevBoundaries = getSolarTermBoundaries(solarYear - 1);
              targetBoundary = prevBoundaries[prevBoundaries.length - 1];
            }
          }
        }
        
        // get120YearAverages를 사용하여 120년 동안의 평균 데이터를 구합니다.
        const avgData = get120YearAverages(targetBoundary.date);
        // dynamicWoljuCycle은 평균 10년 길이 (일수)로 설정합니다.
        let dynamicWoljuCycle = avgData.averageDecade;
        // 평균 월 길이 (일수)도 avgData.averageMonth를 사용합니다.
        const avgMonthLength = avgData.averageMonth;
        
        // 두 날짜 사이의 차이를 일 단위로 계산합니다.
        const oneDayMs = 24 * 60 * 60 * 1000;
        let diffDays;
        if (mode === "순행") {
          diffDays = (targetBoundary.date.getTime() - birthDate.getTime()) / oneDayMs;
        } else {
          diffDays = (birthDate.getTime() - targetBoundary.date.getTime()) / oneDayMs;
        }
        
        let ratio = diffDays / avgMonthLength;
        const offset = ratio * dynamicWoljuCycle;
        
        return Number(offset.toFixed(4));
      }
      

      function getAverageYearLength(dateFrom) {
        const startDate = new Date(dateFrom.getTime());
        const endDate = new Date(dateFrom.getTime());
        endDate.setFullYear(dateFrom.getFullYear() + 120);
        const totalDays = (endDate - startDate) / oneDayMs;
        const avgYearLength = totalDays / 120;
        return avgYearLength;
      }
      
      // (D) 연주 동적 오프셋 계산 함수 (보정시 기준)
      function calculateYeonjuOffsetDynamic(birthDate, mode) {
        // 입춘 정보를 getSolarTermBoundaries에서 받아옵니다.
        const boundariesThisYear = getSolarTermBoundaries(birthDate.getFullYear());
        let thisYearIpchun = boundariesThisYear.find(b => b.name === "입춘");
        if (!thisYearIpchun) {
          // 만약 없으면 fallback으로 findSolarTermDate 사용
          thisYearIpchun = { date: findSolarTermDate(birthDate.getFullYear(), 315) };
        }
        
        let targetIpchun;
        
        if (mode === "순행") {
          if (birthDate < thisYearIpchun.date) {
            targetIpchun = thisYearIpchun.date;
          } else {
            // 생일 이후이면 다음 해 입춘 사용
            const boundariesNextYear = getSolarTermBoundaries(birthDate.getFullYear() + 1);
            let nextYearIpchun = boundariesNextYear.find(b => b.name === "입춘");
            if (!nextYearIpchun) {
              nextYearIpchun = { date: findSolarTermDate(birthDate.getFullYear() + 1, 315) };
            }
            targetIpchun = nextYearIpchun.date;
          }
        } else { // mode === "역행"
          if (birthDate < thisYearIpchun.date) {
            // 생일 이전이면 지난 해 입춘 사용
            const boundariesPrevYear = getSolarTermBoundaries(birthDate.getFullYear() - 1);
            let prevYearIpchun = boundariesPrevYear.find(b => b.name === "입춘");
            if (!prevYearIpchun) {
              prevYearIpchun = { date: findSolarTermDate(birthDate.getFullYear() - 1, 315) };
            }
            targetIpchun = prevYearIpchun.date;
          } else {
            targetIpchun = thisYearIpchun.date;
          }
        }
        
        const diffDays = Math.abs(targetIpchun - birthDate) / oneDayMs;
        const avgYearLength = getAverageYearLength(targetIpchun);
        const ratio = diffDays / avgYearLength;
        const finalOffset = Math.round(ratio * yeonjuCycle * 1000) / 1000;
        return finalOffset;
      }

      
      // 동적 후보 시각 계산 (모든 계산에 dynamicBirth 사용)
      let newSijuFirst  = new Date(staticBirth.getTime() + calculateSijuOffsetDynamic(staticBirth, sijuMode) * oneDayMs);
      let newIljuFirst  = new Date(staticBirth.getTime() + calculateIljuOffsetDynamic(staticBirth, iljuMode) * oneDayMs);
      let newWoljuFirst = new Date(staticBirth.getTime() + calculateWoljuOffsetDynamic(staticBirth, woljuMode) * oneDayMs);
      let newYeonjuFirst = new Date(staticBirth.getTime() + calculateYeonjuOffsetDynamic(staticBirth, yeonjuMode) * oneDayMs);
      
      // 보정: dynamicBirth 기준
      newSijuFirst  = adjustInitial(newSijuFirst, sijuCycle, staticBirth);
      newIljuFirst  = adjustInitial(newIljuFirst, iljuCycle, staticBirth);
      newWoljuFirst = adjustInitial(newWoljuFirst, woljuCycle, staticBirth);
      newYeonjuFirst= adjustInitial(newYeonjuFirst, yeonjuCycle, staticBirth);
      
      // [5] 원래 사주(4기둥) 계산 → staticBirth 기준 (원국은 변경되지 않음)
      const fullResult = getFourPillarsWithDaewoon(
        staticBirth.getFullYear(),
        staticBirth.getMonth() + 1,
        staticBirth.getDate(),
        staticBirth.getHours(),
        staticBirth.getMinutes(),
        birthPlace,
        gender
      );
      const pillars = fullResult.split(", ")[0].split(" ");
      const originalYeonjuPillar = pillars[0]; // 연주
      const originalWoljuPillar  = pillars[1]; // 월주
      const originalIljuPillar   = pillars[2]; // 일주
      const originalSijuPillar   = pillars[3]; // 시주

      // [6] 원래 간지 인덱스 계산
      const sijuOriginalIndex  = getGanZhiIndex(originalSijuPillar);
      const iljuOriginalIndex  = getGanZhiIndex(originalIljuPillar);
      const woljuOriginalIndex = getGanZhiIndex(originalWoljuPillar);
      const yeonjuOriginalIndex= getGanZhiIndex(originalYeonjuPillar);

      // [7] 동적 업데이트 이벤트 생성 (refDate 전달)
      const sijuEvent  = applyFirstUpdateDynamicWithStep(newSijuFirst,  sijuOriginalIndex,  sijuCycle,  sijuMode, refDate);
      const iljuEvent  = applyFirstUpdateDynamicWithStep(newIljuFirst,  iljuOriginalIndex,  iljuCycle,  iljuMode, refDate);
      const woljuEvent = applyFirstUpdateDynamicWithStep(newWoljuFirst, woljuOriginalIndex, woljuCycle, woljuMode, refDate);
      const yeonjuEvent= applyFirstUpdateDynamicWithStep(newYeonjuFirst, yeonjuOriginalIndex, yeonjuCycle, yeonjuMode, refDate);

      return {
        fullResult: fullResult,
        newSijuFirst: newSijuFirst,
        newIljuFirst: newIljuFirst,
        newWoljuFirst: newWoljuFirst,
        newYeonjuFirst: newYeonjuFirst,
        // 원국(4기둥) 간지
        hourPillar: originalSijuPillar,
        dayPillar: originalIljuPillar,
        monthPillar: originalWoljuPillar,
        yearPillar: originalYeonjuPillar,
        // 동적 업데이트 이벤트 결과
        hourEvent: sijuEvent,
        dayEvent: iljuEvent,
        monthEvent: woljuEvent,
        yearEvent: yeonjuEvent,
        candidateTimes: {
          siju: newSijuFirst,
          ilju: newIljuFirst,
          wolju: newWoljuFirst,
          yeonju: newYeonjuFirst
        },
        dynamicSteps: {
          siju: getDynamicStep(newSijuFirst, sijuCycle, refDate),
          ilju: getDynamicStep(newIljuFirst, iljuCycle, refDate),
          wolju: getDynamicStep(newWoljuFirst, woljuCycle, refDate),
          yeonju: getDynamicStep(newYeonjuFirst, yeonjuCycle, refDate)
        }
      };
    }

    // UI 업데이트 예시: updateMyowoonSection
    function updateMyowoonSection(myowoonResult) {
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
      
      // 연주 업데이트 (원국 기반, static)
      const yp = myowoonResult.yearEvent.ganji;
      setText("MyoYtHanja", stemMapping[yp.charAt(0)]?.hanja || yp.charAt(0));
      applyColor("MyoYtHanja", yp.charAt(0));
      setText("MyoYtHanguel", stemMapping[yp.charAt(0)]?.hanguel || yp.charAt(0));
      setText("MyoYtEumyang", stemMapping[yp.charAt(0)]?.eumYang || "-");
      setText("MyoYt10sin", getTenGodForStem(yp.charAt(0), baseDayStem));
      setText("MyoYbHanja", branchMapping[yp.charAt(1)]?.hanja || yp.charAt(1));
      applyColor("MyoYbHanja", branchMapping[yp.charAt(1)]?.hanja || yp.charAt(1));
      setText("MyoYbHanguel", branchMapping[yp.charAt(1)]?.hanguel || yp.charAt(1));
      setText("MyoYbEumyang", branchMapping[yp.charAt(1)]?.eumYang || "-");
      setText("MyoYb10sin", getTenGodForBranch(yp.charAt(1), baseDayStem));
      setText("MyoYbJj1", (hiddenStemMapping[yp.charAt(1)] || ["-", "-", "-"])[0]);
      setText("MyoYbJj2", (hiddenStemMapping[yp.charAt(1)] || ["-", "-", "-"])[1]);
      setText("MyoYbJj3", (hiddenStemMapping[yp.charAt(1)] || ["-", "-", "-"])[2]);
      setText("MyoYb12ws", getTwelveUnseong(baseDayStem, yp.charAt(1)));
      setText("MyoYb12ss", getTwelveShinsal(baseYearBranch, yp.charAt(1)));

      // 월주 업데이트 (원국 기반)
      const mp = myowoonResult.monthEvent.ganji;
      setText("MyoMtHanja", stemMapping[mp.charAt(0)]?.hanja || mp.charAt(0));
      applyColor("MyoMtHanja", mp.charAt(0));
      setText("MyoMtHanguel", stemMapping[mp.charAt(0)]?.hanguel || mp.charAt(0));
      setText("MyoMtEumyang", stemMapping[mp.charAt(0)]?.eumYang || "-");
      setText("MyoMt10sin", getTenGodForStem(mp.charAt(0), baseDayStem));
      setText("MyoMbHanja", branchMapping[mp.charAt(1)]?.hanja || mp.charAt(1));
      applyColor("MyoMbHanja", branchMapping[mp.charAt(1)]?.hanja || mp.charAt(1));
      setText("MyoMbHanguel", branchMapping[mp.charAt(1)]?.hanguel || mp.charAt(1));
      setText("MyoMbEumyang", branchMapping[mp.charAt(1)]?.eumYang || "-");
      setText("MyoMb10sin", getTenGodForBranch(mp.charAt(1), baseDayStem));
      setText("MyoMbJj1", (hiddenStemMapping[mp.charAt(1)] || ["-", "-", "-"])[0]);
      setText("MyoMbJj2", (hiddenStemMapping[mp.charAt(1)] || ["-", "-", "-"])[1]);
      setText("MyoMbJj3", (hiddenStemMapping[mp.charAt(1)] || ["-", "-", "-"])[2]);
      setText("MyoMb12ws", getTwelveUnseong(baseDayStem, mp.charAt(1)));
      setText("MyoMb12ss", getTwelveShinsal(baseYearBranch, mp.charAt(1)));

      // 일주 업데이트 – 동적 이벤트 사용
      const dp = myowoonResult.dayEvent.ganji;
      const dayStem = dp[0];
      const dayBranch = dp[1];
      setText("MyoDtHanja", stemMapping[dayStem]?.hanja || dayStem);
      applyColor("MyoDtHanja", dayStem);
      setText("MyoDtHanguel", stemMapping[dayStem]?.hanguel || dayStem);
      setText("MyoDtEumyang", stemMapping[dayStem]?.eumYang || "-");
      setText("MyoDt10sin", getTenGodForStem(dayStem, baseDayStem));
      setText("MyoDbHanja", branchMapping[dayBranch]?.hanja || dayBranch);
      applyColor("MyoDbHanja", branchMapping[dayBranch]?.hanja || dayBranch);
      setText("MyoDbHanguel", branchMapping[dayBranch]?.hanguel || dayBranch);
      setText("MyoDbEumyang", branchMapping[dayBranch]?.eumYang || "-");
      setText("MyoDb10sin", getTenGodForBranch(dayBranch, baseDayStem));
      setText("MyoDbJj1", (hiddenStemMapping[dayBranch] || ["-", "-", "-"])[0]);
      setText("MyoDbJj2", (hiddenStemMapping[dayBranch] || ["-", "-", "-"])[1]);
      setText("MyoDbJj3", (hiddenStemMapping[dayBranch] || ["-", "-", "-"])[2]);
      setText("MyoDb12ws", getTwelveUnseong(baseDayStem, dayBranch));
      setText("MyoDb12ss", getTwelveShinsal(baseYearBranch, dayBranch));

      // 시주 업데이트 – 동적 이벤트 사용
      const hp = myowoonResult.hourEvent.ganji;
      setText("MyoHtHanja", stemMapping[hp[0]]?.hanja || hp[0]);
      applyColor("MyoHtHanja", hp[0]);
      setText("MyoHtHanguel", stemMapping[hp[0]]?.hanguel || hp[0]);
      setText("MyoHtEumyang", stemMapping[hp[0]]?.eumYang || "-");
      setText("MyoHt10sin", getTenGodForStem(hp[0], baseDayStem));
      setText("MyoHbHanja", branchMapping[hp[1]]?.hanja || hp[1]);
      applyColor("MyoHbHanja", branchMapping[hp[1]]?.hanja || hp[1]);
      setText("MyoHbHanguel", branchMapping[hp[1]]?.hanguel || hp[1]);
      setText("MyoHbEumyang", branchMapping[hp[1]]?.eumYang || "-");
      setText("MyoHb10sin", getTenGodForBranch(hp[1], baseDayStem));
      setText("MyoHbJj1", (hiddenStemMapping[hp[1]] || ["-", "-", "-"])[0]);
      setText("MyoHbJj2", (hiddenStemMapping[hp[1]] || ["-", "-", "-"])[1]);
      setText("MyoHbJj3", (hiddenStemMapping[hp[1]] || ["-", "-", "-"])[2]);
      setText("MyoHb12ws", getTwelveUnseong(baseDayStem, hp[1]));
      setText("MyoHb12ss", getTwelveShinsal(baseYearBranch, hp[1]));

      updateColorClasses();
    }

    // ========== 최종 실행 ==========
    const myowoonResult = getMyounPillars(gender, refDate);
    updateMyowoonSection(myowoonResult);

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
        updateMyowoonSection(myowoonResult);    
        myowoonMoreElem.classList.add("active");
        myowoonMoreElem.innerText = "원래 화면으로 가기";
      }
    });

    document.querySelectorAll('.back_btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        window.location.reload();
      });
    });

    document.getElementById('wongookLM').classList.remove("w100");
    document.getElementById('luckyWrap').style.display = 'block';
    document.getElementById('woonArea').style.display = 'block';
    document.getElementById('woonContainer').style.display = 'none';
    document.getElementById('calArea').style.display = 'none';

    // globalState.originalDayStem을 업데이트하는 함수
    function updateBaseDayStem() {
      // 이미 globalState.correctedBirthDate가 계산되어 있다고 가정합니다.
      const corrected = globalState.correctedBirthDate;
      const jasiElem = document.getElementById("jasi");
      const yajojasiElem = document.getElementById("yajojasi");
      const insiElem = document.getElementById("insi");
      let adjusted = new Date(corrected.getTime());
      if (jasiElem && jasiElem.checked) {
        adjusted.setHours(23, 0, 0, 0);
      } else if (yajojasiElem && yajojasiElem.checked) {
        adjusted.setHours(0, 0, 0, 0);
      } else if (insiElem && insiElem.checked) {
        adjusted.setHours(3, 0, 0, 0);
      }
      const dayGanZhi = getDayGanZhi(adjusted);
      // 만약 dayGanZhi가 빈 문자열이라면, 문제의 원인이 getDayGanZhi 함수일 수 있으므로 확인
      globalState.originalDayStem = dayGanZhi.charAt(0);
    }    

    // updateDayWoon 함수 수정
    function updateDayWoon(refDate) {
      if (!(refDate instanceof Date) || isNaN(refDate.getTime())) { refDate = new Date(); }
      const jasiElem = document.getElementById("jasi");
      const yajojasiElem = document.getElementById("yajojasi");
      const insiElem = document.getElementById("insi");
      let adjustedDate = new Date(refDate.getTime());
      if (jasiElem && jasiElem.checked) {
        adjustedDate = new Date(adjustedDate.getFullYear(), adjustedDate.getMonth(), adjustedDate.getDate(), 23, 0, 0, 0);
      } else if (yajojasiElem && yajojasiElem.checked) {
        adjustedDate = new Date(adjustedDate.getFullYear(), adjustedDate.getMonth(), adjustedDate.getDate(), 0, 0, 0, 0);
      } else if (insiElem && insiElem.checked) {
        adjustedDate = new Date(adjustedDate.getFullYear(), adjustedDate.getMonth(), adjustedDate.getDate(), 3, 0, 0, 0);
      }
      
      const dayGanZhi = getDayGanZhi(adjustedDate);
      const daySplitFuc = splitPillar(dayGanZhi);
      // globalState.originalDayStem를 사용하여 업데이트
      setText("WDtHanja", stemMapping[daySplitFuc.gan]?.hanja || "-");
      setText("WDtHanguel", stemMapping[daySplitFuc.gan]?.hanguel || "-");
      setText("WDtEumyang", stemMapping[daySplitFuc.gan]?.eumYang || "-");
      setText("WDt10sin", getTenGodForStem(daySplitFuc.gan, globalState.originalDayStem) || "-");
      setText("WDbHanja", branchMapping[daySplitFuc.ji]?.hanja || "-");
      setText("WDbHanguel", branchMapping[daySplitFuc.ji]?.hanguel || "-");
      setText("WDbEumyang", branchMapping[daySplitFuc.ji]?.eumYang || "-");
      setText("WDb10sin", getTenGodForBranch(daySplitFuc.ji, globalState.originalDayStem) || "-");
      updateHiddenStems(daySplitFuc.ji, "WDb");
      setText("WDb12ws", getTwelveUnseong(globalState.originalDayStem, daySplitFuc.ji) || "-");
      setText("WDb12ss", getTwelveShinsal(baseYearBranch, daySplitFuc.ji) || "-");
      updateColorClasses();
    }

    updateDayWoon(refDate);

    // 체크박스 이벤트 리스너 등록 (체크박스 값 변경 시 재계산)
    document.getElementById("jasi").addEventListener("change", function(){
      updateBaseDayStem();
      updateDayWoon(new Date());
    });
    document.getElementById("yajojasi").addEventListener("change", function(){
      updateBaseDayStem();
      updateDayWoon(new Date());
    });
    document.getElementById("insi").addEventListener("change", function(){
      updateBaseDayStem();
      updateDayWoon(new Date());
    });
    
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
      const daySplitFuc = splitPillar(dayGanZhi);
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
 
     // 원국 간지 기반 업데이트값을 변수에 저장 (예: firstUpdateGanjiSiju)
     const firstUpdateGanjiSiju = myowoonResult.hourPillar;  // 원국의 시주 간지
     const firstUpdateGanjiIlju = myowoonResult.dayPillar;    // 원국의 일주 간지
     const firstUpdateGanjiWolju = myowoonResult.monthPillar; // 원국의 월주 간지
     const firstUpdateGanjiYeonju = myowoonResult.yearPillar;  // 원국의 연주 간지
 
     // 타임라인 이벤트 객체 생성 – "후보 시각"은 그대로 사용하지만 간지값은 원국 업데이트값으로 설정
     const sijuFirstTimelineEvent = {
       date: myowoonResult.candidateTimes.siju,
       index: getGanZhiIndex(firstUpdateGanjiSiju) + direction + 60,
       ganji: firstUpdateGanjiSiju + direction + 60
     };
     const iljuFirstTimelineEvent = {
       date: myowoonResult.candidateTimes.ilju,
       index: getGanZhiIndex(firstUpdateGanjiIlju) + direction + 60,
       ganji: firstUpdateGanjiIlju + direction + 60
     };
     const woljuFirstTimelineEvent = {
       date: myowoonResult.candidateTimes.wolju,
       index: getGanZhiIndex(firstUpdateGanjiWolju) + direction + 60,
       ganji: firstUpdateGanjiWolju + direction + 60
     };
     const yeonjuFirstTimelineEvent = {
       date: myowoonResult.candidateTimes.yeonju,
       index: getGanZhiIndex(firstUpdateGanjiYeonju) + direction + 60,
       ganji: firstUpdateGanjiYeonju + direction + 60
     };

     // 타임라인 생성 (콘솔 출력)
     const sijuTimeline  = generateTimeline(sijuFirstTimelineEvent, sijuCycle, sijuMode, "시주", refDate);
     const iljuTimeline  = generateTimeline(iljuFirstTimelineEvent, iljuCycle, iljuMode, "일주", refDate);
     const woljuTimeline = generateTimeline(woljuFirstTimelineEvent, woljuCycle, woljuMode, "월주", refDate);
     const yeonjuTimeline = generateTimeline(yeonjuFirstTimelineEvent, yeonjuCycle, yeonjuMode, "연주", refDate);
 
     // ========== 타임라인 관련 함수 ==========
     function nextEvent(date, index, cycle, mode) {
      // 날짜는 항상 cycle만큼 더해서 진행 (피커 날짜까지 늘어남)
      const nextDate = new Date(date.getTime() + cycle * oneDayMs);
      // 인덱스는 mode에 따라 달라짐: "순행"이면 +1, "역행"이면 -1
      const nextIndex = mode === "순행" ? ((index + 1) % 60) : ((index - 1 + 60) % 60);
      return { date: nextDate, index: nextIndex };
    }
 
     function formatDateTime(dateObj) {
       const yyyy = dateObj.getFullYear();
       const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
       const dd = String(dateObj.getDate()).padStart(2, '0');
       const hh = String(dateObj.getHours()).padStart(2, '0');
       const mi = String(dateObj.getMinutes()).padStart(2, '0');
       return `${yyyy}.${mm}.${dd} ${hh}:${mi}`;
     }

     function generateTimeline(firstEvent, cycle, mode, label, refDate) {
      let timeline = [];
      let currentEvent = firstEvent;
      
      // 첫 이벤트부터 refDate까지 계속 nextEvent로 진행
      while (currentEvent && currentEvent.date.getTime() <= refDate && refDate.getTime()) {
        timeline.push(currentEvent);
        let next = nextEvent(currentEvent.date, currentEvent.index, cycle, mode);
        // 안전장치: 날짜 변화가 없으면 종료
        if (!next || next.date.getTime() === currentEvent.date.getTime()) break;
        currentEvent = next;
      }
      return timeline;
    }

    function logTimelineWindow(label, timeline, windowSize = 10) {
      const total = timeline.length;
      if (total === 0) {
        console.log(`${label}: 타임라인이 비어 있습니다.`);
        return;
      }
      if (total <= windowSize * 2) {
        console.log(`=== ${label} 타임라인 (전체 ${total}개) ===`);
        timeline.forEach(evt => {
          console.log(`${formatDateTime(evt.date)} → ${label}: ${getGanZhiFromIndex(evt.index)}`);
        });
      } else {
        console.log(`=== ${label} 타임라인 (앞 ${windowSize}개) ===`);
        for (let i = 0; i < windowSize; i++) {
          const evt = timeline[i];
          console.log(`${formatDateTime(evt.date)} → ${label}: ${getGanZhiFromIndex(evt.index)}`);
        }
        console.log("... 생략 ...");
        console.log(`=== ${label} 타임라인 (뒤 ${windowSize}개) ===`);
        for (let i = total - windowSize; i < total; i++) {
          const evt = timeline[i];
          console.log(`${formatDateTime(evt.date)} → ${label}: ${getGanZhiFromIndex(evt.index)}`);
        }
      }
    }
    console.log("=== 최종 운세 결과 ===");
    logTimelineWindow("시주", sijuTimeline);
    logTimelineWindow("일주", iljuTimeline);
    logTimelineWindow("월주", woljuTimeline);
    logTimelineWindow("연주", yeonjuTimeline);
    console.log("후보 시각:", myowoonResult.candidateTimes);
    console.log("동적 단계:", myowoonResult.dynamicSteps);
    
    

    // 버튼 클릭 이벤트: picker 날짜(refDate)를 사용하여 동적 운세(묘운)를 업데이트
    document.getElementById("woonChangeBtn").addEventListener("click", function () {
      // 피커에서 기준 날짜(refDate)를 가져옴
      const picker = document.getElementById('woonTimeSetPicker');
      let refDate = (picker && picker.value) ? new Date(picker.value) : new Date();
    
      // 먼저 묘운 결과를 최신 refDate 기준으로 재계산
      const myowoonResult = getMyounPillars(gender, refDate);
      
      // 타임라인 업데이트 (콘솔 출력) — refDate를 인자로 추가하고 반환값을 저장
      const sijuTimeline  = generateTimeline(sijuFirstTimelineEvent, sijuCycle, sijuMode, "시주", refDate);
      const iljuTimeline  = generateTimeline(iljuFirstTimelineEvent, iljuCycle, iljuMode, "일주", refDate);
      const woljuTimeline = generateTimeline(woljuFirstTimelineEvent, woljuCycle, woljuMode, "월주", refDate);
      const yeonjuTimeline= generateTimeline(yeonjuFirstTimelineEvent, yeonjuCycle, yeonjuMode, "연주", refDate);
    
      // 다른 운세 업데이트 함수 호출 (refDate 기준 업데이트)
      updateCurrentSewoon(refDate);
      updateMonthlyWoonByToday(refDate);
      updateDayWoon(refDate);
      updateHourWoon(refDate);
      updateMyowoonSection(myowoonResult);
    
      console.log("=== 최종 운세 결과 ===");
      logTimelineWindow("시주", sijuTimeline);
      logTimelineWindow("일주", iljuTimeline);
      logTimelineWindow("월주", woljuTimeline);
      logTimelineWindow("연주", yeonjuTimeline);
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
      const { year, month, day, hour, minute, gender, birthPlace, time2 } = inputData;
      const originalDate = new Date(year, month - 1, day, hour, minute);
      const correctedDate = adjustBirthDate(originalDate, birthPlace);
      // globalState.correctedBirthDate 대신 로컬 변수 correctedDate를 사용하거나,
      // 필요하다면 globalState에 저장할 수도 있음.
      
      // 원국(사주) 계산 실행
      const fullResult = getFourPillarsWithDaewoon(
        correctedDate.getFullYear(),
        correctedDate.getMonth() + 1,
        correctedDate.getDate(),
        hour, minute,
        birthPlace,
        gender
      );
      
      // fullResult에서 각 기둥 분리
      const parts = fullResult.split(", ");
      const pillarsPart = parts[0] || "-";
      const pillars = pillarsPart.split(" ");
      const yearPillar  = pillars[0] || "-";
      const monthPillar = pillars[1] || "-";
      const dayPillar   = pillars[2] || "-";
      const hourPillar  = pillars[3] || "-";
      
      // 각 기둥을 분리
      const yearSplit  = splitPillar(yearPillar);
      const monthSplit = splitPillar(monthPillar);
      const daySplit   = splitPillar(dayPillar);
      const hourSplit  = splitPillar(hourPillar);
      const baseDayStem = globalState.originalDayStem;
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
        const myowoonResult = getMyounPillars(gender, refDate);
        updateMyowoonSection(myowoonResult);
        logTimelineWindow(label, timeline, windowSize = 10);
      });
    });
    
    document.getElementById('resultWrapper').style.display = 'block';
    window.scrollTo(0, 0);
    document.getElementById('inputWrap').style.display = 'none';
    document.getElementById("saveBtn").style.display = "inline-block";

  });

  document.addEventListener("click", function (event) {
    const modifyBtn = event.target.closest(".modify_btn");
    if (!modifyBtn) return;
  
    const index = parseInt(modifyBtn.getAttribute("data-index"), 10);
    const savedList = JSON.parse(localStorage.getItem("myeongsikList")) || [];
    const selected = savedList[index];
    if (!selected) return;
  
    document.getElementById("inputWrap").style.display = "block";
    document.getElementById("resultWrapper").style.display = "none";
    document.getElementById("aside").style.display = "none";
  
    document.getElementById("inputName").value = selected.name;
    document.getElementById("inputBirthday").value = selected.birthday;
    document.getElementById("inputBirthtime").value = selected.birthtime;
    document.getElementById("inputBirthPlace").value = selected.birthPlace;
  
    if (selected.gender === "남") {
      document.getElementById("genderMan").checked = true;
    } else {
      document.getElementById("genderWoman").checked = true;
    }
  
    // 수정 모드용 인덱스를 전역에 저장
    window.currentModifyIndex = index;
  
    // 버튼 텍스트를 "수정하기"로 변경
    const calcBtn = document.getElementById("calcBtn");
    calcBtn.textContent = "수정하기";

    const nameInput = document.getElementById("inputName");
    nameInput.focus();
    nameInput.setSelectionRange(nameInput.value.length, nameInput.value.length);
  });

  document.getElementById("calcBtn").addEventListener("click", function () {
    const birthday = document.getElementById("inputBirthday").value.trim();
    const birthtime = document.getElementById("inputBirthtime").value.trim();
    const gender = document.getElementById("genderMan").checked ? "남" : "여";
    const birthPlace = document.getElementById("inputBirthPlace").value;
    const name = document.getElementById("inputName").value.trim() || "이름없음";

    if (birthday.length !== 8 || birthtime.length !== 4) {
      alert("생년월일은 YYYYMMDD, 태어난 시간은 HHMM 형식이어야 합니다.");
      return;
    }

    const year = parseInt(birthday.substring(0, 4), 10);
    const month = parseInt(birthday.substring(4, 6), 10);
    const day = parseInt(birthday.substring(6, 8), 10);
    const hour = parseInt(birthtime.substring(0, 2), 10);
    const minute = parseInt(birthtime.substring(2, 4), 10);

    const result = getFourPillarsWithDaewoon(year, month, day, hour, minute, birthPlace, gender);
    const pillars = result.split(", ")[0].split(" ");

    const correctedDate = adjustBirthDate(new Date(year, month - 1, day, hour, minute), birthPlace);
    const age = calculateAge(correctedDate);
    const birthdayTime = formatDate(correctedDate);

    const newData = {
      birthday, birthtime, gender, birthPlace, name,
      result,
      yearPillar: pillars[0] || "",
      monthPillar: pillars[1] || "",
      dayPillar: pillars[2] || "",
      hourPillar: pillars[3] || "",
      age, birthdayTime
    };

    const list = JSON.parse(localStorage.getItem("myeongsikList")) || [];

    // 수정 모드인 경우 기존 값 업데이트
    if (typeof window.currentModifyIndex === "number") {
      list[window.currentModifyIndex] = newData;
      localStorage.setItem("myeongsikList", JSON.stringify(list));
      alert("명식이 수정되었습니다.");
      delete window.currentModifyIndex;
    }

    // 목록 재갱신 및 화면 전환
    loadSavedMyeongsikList();
    document.getElementById("inputWrap").style.display = "none";
    document.getElementById("resultWrapper").style.display = "block";
  });



  new Sortable(document.querySelector(".list_ul"), {
    handle: ".drag_btn_zone", // 요 버튼 누르고 있어야 드래그 가능
    animation: 150,
    onEnd: function (evt) {
      // 드래그 후 순서 바뀔 때 로컬스토리지도 업데이트
      const newOrder = [];
      const items = document.querySelectorAll(".list_ul li");
      const originalList = JSON.parse(localStorage.getItem("myeongsikList")) || [];

      items.forEach((li) => {
        const index = parseInt(li.getAttribute("data-index"), 10);
        if (!isNaN(index)) {
          newOrder.push(originalList[index]);
        }
      });

      localStorage.setItem("myeongsikList", JSON.stringify(newOrder));
      loadSavedMyeongsikList(); // 재렌더링하여 인덱스 재정렬
    }
  });
});