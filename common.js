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
  return sexagenaryCycle[(jd + 50) % 60] || "갑자";
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

// 새로운 함수: 명목 생년월일만으로 일주 계산 (보정 없이)


function getHourBranchIndex(dateObj, isSunTime) {
  // isSunTime 플래그는 여기서 별도의 인덱스 보정에 사용하지 않습니다.
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

// getHourStem 함수 (고정 매핑 사용 – 변경 없음)
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
function splitPillar(pillar) {
  return (pillar && pillar.length >= 2) ? { gan: pillar.charAt(0), ji: pillar.charAt(1) } : { gan: "-", ji: "-" };
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
  
  // 명식 계산용 effectiveYear: 원래 입력한 연도와 해당 연도의 입춘(315°) 날짜를 비교
  // 전통적으로 생일(원래 입력 날짜)이 입춘보다 이전이면 명식은 전년도 기준
  const inputYear = globalState.correctedBirthDate.getFullYear();

const ipChunForPillar = findSolarTermDate(inputYear, 315);
const effectiveYearForPillar = (originalDate < ipChunForPillar) ? inputYear - 1 : inputYear;

// 대운/세운 계산용 effectiveYear는 입력 연도를 그대로 사용
const effectiveYearForDaewoon = inputYear;
  
  // 명식(연,월) 계산은 correctedDate와 effectiveYearForPillar를 사용
  const yearPillar = getYearGanZhi(correctedDate, effectiveYearForPillar);
  const monthPillar = getMonthGanZhi(correctedDate, effectiveYearForPillar);
  const dayStemRef = getDayGanZhi(correctedDate).charAt(0);
  
  const isYang = ["갑", "병", "무", "경", "임"].includes(yearPillar.charAt(0));
  const isForward = (gender === "남" && isYang) || (gender === "여" && !isYang);
  
  // 절기 경계(대운/세운 계산)는 effectiveYearForDaewoon를 기준으로 함
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

  const response = {
	base: baseNumber,
	list,
	dayStemRef,
  };

  
  return { base: baseNumber, list: list, dayStemRef: dayStemRef };
}

function getHourStemArithmetic(dayPillar, hourBranchIndex) {
  // dayPillar에서 천간(첫 글자)을 구합니다.
  const dayStem = getDayStem(dayPillar);  
  // Cheongan 배열: ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"]
  const idx = Cheongan.indexOf(dayStem);
  if (idx === -1) return "";
  // Yang: 갑(0), 병(2), 무(4), 경(6), 임(8)
  // Yin: 을(1), 정(3), 기(5), 신(7), 계(9)
  // 만약 dayStem이 Yang이면 공식: (idx*2 + hourBranchIndex) mod 10
  // 만약 Yin이면 공식: (idx*2 + hourBranchIndex + 2) mod 10
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

function getFourPillarsWithDaewoon(year, month, day, hour, minute, birthPlace, gender) {
	const originalDate = new Date(year, month - 1, day, hour, minute);
	const correctedDate = adjustBirthDate(originalDate, birthPlace);
	const nominalBirthDateM = new Date(year, month - 1, day -1);
	const nominalBirthDate = new Date(year, month - 1, day);
	const nominalBirthDate2 = new Date(year, month - 1, day +1);
	const nominalBirthDatePrev = new Date(nominalBirthDate);
	nominalBirthDatePrev.setDate(nominalBirthDate.getDate() - 1);

	const sunTimeElem = document.getElementById('sunTime');
	const isSunTime = sunTimeElem && sunTimeElem.checked;

	let hourBranchIndex = getHourBranchIndex(correctedDate, isSunTime);
	
	const yajojasiElem = document.getElementById('yajojasi');
	  const yajojasi = yajojasiElem && yajojasiElem.checked;
	const jasiElem = document.getElementById('jasi');
	  const isJasi = jasiElem && jasiElem.checked;
	  const insiElem = document.getElementById('insi');
	  const isInsi = insiElem && insiElem.checked;

	if (isSunTime) {
		const boundaries = [
		  { hour: 23, minute: 30, dayOffset: -1 },  // 자시: 전날 23:30
		  { hour: 1,  minute: 30, dayOffset:  0 },  // 축시: 당일 01:30
		  { hour: 3,  minute: 30, dayOffset:  0 },  // 인시: 당일 03:30
		  { hour: 5,  minute: 30, dayOffset:  0 },
		  { hour: 7,  minute: 30, dayOffset:  0 },
		  { hour: 9,  minute: 30, dayOffset:  0 },
		  { hour: 11, minute: 30, dayOffset:  0 },
		  { hour: 13, minute: 30, dayOffset:  0 },
		  { hour: 15, minute: 30, dayOffset:  0 },
		  { hour: 17, minute: 30, dayOffset:  0 },
		  { hour: 19, minute: 30, dayOffset:  0 },
		  { hour: 21, minute: 30, dayOffset:  0 }
		];

       // 현재 계산된 hourBranchIndex에 해당하는 시주의 경계(하한)를 계산합니다.
	  // 기준 날짜는 명목 생년월일(nominalBirthDate)이며, dayOffset에 따라 전날일 수도 있습니다.
	  const currentBoundary = boundaries[ hourBranchIndex ];
	const boundaryDate = new Date(nominalBirthDate);
	boundaryDate.setDate(boundaryDate.getDate() + currentBoundary.dayOffset);
	boundaryDate.setHours(currentBoundary.hour, currentBoundary.minute, 0, 0);

		
	  
	  // 보정된 시간(correctedDate)에 +30분을 더한 시간을 solarTime으로 구합니다.
	 const solarTime = new Date(correctedDate.getTime() + 1 * 60000);
	 let hourDayPillar;
		if (hourBranchIndex === 0) {
		 if (solarTime < boundaryDate) {
			hourBranchIndex = 11;
		  } else {
			 hourDayPillar = getDayGanZhi(nominalBirthDate);
		  }
		}
		if(hourBranchIndex === 1) {
			hourBranchIndex = 1;
		}
		if (solarTime < boundaryDate) {
			hourBranchIndex = (hourBranchIndex + 11) % 12;
		}

		
		if (isInsi && correctedDate.getHours() < 3) {
		  hourDayPillar = getDayGanZhi(nominalBirthDatePrev);
		} else if (hourBranchIndex === 0){
			  hourDayPillar = getDayGanZhi(nominalBirthDate);
		  } 
		
    if (hourBranchIndex === 0 && (yajojasi && correctedDate.getHours() >= 0 && correctedDate.getHours() <= 3.5) || hourBranchIndex === 0 && (isJasi && correctedDate.getHours() >= 0 && correctedDate.getHours() <= 3.5)){
        hourDayPillar = getDayGanZhi(nominalBirthDatePrev);
    }else if (hourBranchIndex !== 0 && correctedDate.getHours() >= 21.5 && correctedDate.getHours() < 23.5 || hourBranchIndex === 0 && correctedDate.getHours() >= 21.5 && correctedDate.getHours() < 23.5) {
       hourBranchIndex = 11;
       hourDayPillar = getDayGanZhi(nominalBirthDatePrev);
    } else if (hourBranchIndex === 0 && (yajojasi && correctedDate.getHours() < 24) || hourBranchIndex === 0 && (isJasi && correctedDate.getHours() < 24)) {
       hourDayPillar = getDayGanZhi(nominalBirthDate);
    } else {
       hourDayPillar = getDayGanZhi(nominalBirthDatePrev);
    }

		  const hourStem = getHourStem(hourDayPillar, hourBranchIndex);
		  const hourPillar = hourStem + Jiji[hourBranchIndex];

		  const yearPillar = getYearGanZhi(correctedDate, year);
		  const monthPillar = getMonthGanZhi(correctedDate, year);

		   if (yajojasi && correctedDate.getHours() >= 24){
				const dayPillar = getDayGanZhi(nominalBirthDate);
				 return `${yearPillar} ${monthPillar} ${dayPillar} ${hourPillar}시, ${getDaewoonDataStr(birthPlace, gender)}`;
		  } 
			  
		  if (isJasi && correctedDate.getHours() >= 23.5){
			const dayPillar = getDayGanZhi(nominalBirthDate2);
				 return `${yearPillar} ${monthPillar} ${dayPillar} ${hourPillar}시, ${getDaewoonDataStr(birthPlace, gender)}`;
		  } 

		  if (isInsi && correctedDate.getHours() < 3.5){
			const dayPillar = getDayGanZhi(nominalBirthDatePrev);
			return `${yearPillar} ${monthPillar} ${dayPillar} ${hourPillar}시, ${getDaewoonDataStr(birthPlace, gender)}`;
		} else {
			const dayPillar = getDayGanZhi(nominalBirthDate);
			return `${yearPillar} ${monthPillar} ${dayPillar} ${hourPillar}시, ${getDaewoonDataStr(birthPlace, gender)}`;
		}

		  
	 
	} else {
		const boundaries = [
		  { hour: 23, minute: 0, dayOffset: -1 },  // 자시: 전날 23:30
		  { hour: 1,  minute: 0, dayOffset:  0 },  // 축시: 당일 01:30
		  { hour: 3,  minute: 0, dayOffset:  0 },  // 인시: 당일 03:30
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

       // 현재 계산된 hourBranchIndex에 해당하는 시주의 경계(하한)를 계산합니다.
	  // 기준 날짜는 명목 생년월일(nominalBirthDate)이며, dayOffset에 따라 전날일 수도 있습니다.
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

    const yearPillar = getYearGanZhi(correctedDate, year);
    const monthPillar = getMonthGanZhi(correctedDate, year);

      if (yajojasi && correctedDate.getHours() >= 24){
      const dayPillar = getDayGanZhi(nominalBirthDate);
        return `${yearPillar} ${monthPillar} ${dayPillar} ${hourPillar}시, ${getDaewoonDataStr(birthPlace, gender)}`;
    } 
      
    if (isJasi && correctedDate.getHours() >= 23){
    const dayPillar = getDayGanZhi(nominalBirthDate2);
        return `${yearPillar} ${monthPillar} ${dayPillar} ${hourPillar}시, ${getDaewoonDataStr(birthPlace, gender)}`;
    } 

    if (isInsi && correctedDate.getHours() < 3){
    const dayPillar = getDayGanZhi(nominalBirthDatePrev);
    return `${yearPillar} ${monthPillar} ${dayPillar} ${hourPillar}시, ${getDaewoonDataStr(birthPlace, gender)}`;
		} else {
			const dayPillar = getDayGanZhi(nominalBirthDate);
			return `${yearPillar} ${monthPillar} ${dayPillar} ${hourPillar}시, ${getDaewoonDataStr(birthPlace, gender)}`;
		}
		
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
    "병": { "자": "태", "축": "양", "인": "장생", "묘": "목욕", "진": "건록", "사": "제왕", "오": "쇠", "미": "병", "신": "사", "유": "묘", "술": "절", "해": "사" },
    "정": { "자": "절", "축": "묘", "인": "사", "묘": "병", "진": "쇠", "사": "제왕", "오": "건록", "미": "관대", "신": "목욕", "유": "장생", "술": "양", "해": "태" },
    "무": { "자": "태", "축": "양", "인": "장생", "묘": "목욕", "진": "건록", "사": "제왕", "오": "쇠", "미": "병", "신": "사", "유": "묘", "술": "절", "해": "사" },
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

function updateHiddenStems(pillarBranch, prefix) {
  const mapping = hiddenStemMapping[pillarBranch] || ["-", "-", "-"];
  document.getElementById(prefix + "Jj1").innerText = mapping[0];
  document.getElementById(prefix + "Jj2").innerText = mapping[1];
  document.getElementById(prefix + "Jj3").innerText = mapping[2];
}

function setText(id, text) {
  const elem = document.getElementById(id);
  if (elem) elem.innerText = text;
}

function updatePillarInfo(prefix, pillar, baseDayStem) {
  setText(prefix + "Hanja", (stemMapping[pillar.gan]?.hanja) || "-");
  setText(prefix + "Hanguel", (stemMapping[pillar.gan]?.hanguel) || "-");
  setText(prefix + "Eumyang", (stemMapping[pillar.gan]?.eumYang) || "-");
  setText(prefix + "10sin", (prefix === "Dt") ? "본원" : getTenGodForStem(pillar.gan, baseDayStem));
}

function updateBranchInfo(prefix, branch, baseDayStem) {
  setText(prefix + "Hanja", (branchMapping[branch]?.hanja) || "-");
  setText(prefix + "Hanguel", (branchMapping[branch]?.hanguel) || "-");
  setText(prefix + "Eumyang", (branchMapping[branch]?.eumYang) || "-");
  setText(prefix + "10sin", getTenGodForBranch(branch, baseDayStem));
  updateHiddenStems(branch, prefix);
}

function updateOriginalPillarMapping(yearPillar, monthPillar, dayPillar, hourPillar) {
  setText("Hb12ws", getTwelveUnseong(dayPillar.gan, hourPillar.ji));
  setText("Hb12ss", getTwelveShinsal(yearPillar.ji, hourPillar.ji));
  setText("Db12ws", getTwelveUnseong(dayPillar.gan, dayPillar.ji));
  setText("Db12ss", getTwelveShinsal(yearPillar.ji, dayPillar.ji));
  setText("Mb12ws", getTwelveUnseong(dayPillar.gan, monthPillar.ji));
  setText("Mb12ss", getTwelveShinsal(yearPillar.ji, monthPillar.ji));
  setText("Yb12ws", getTwelveUnseong(dayPillar.gan, yearPillar.ji));
  setText("Yb12ss", getTwelveShinsal(yearPillar.ji, yearPillar.ji));
}