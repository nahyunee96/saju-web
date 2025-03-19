//─────────────────────────────
// [0] 출생지 보정 데이터 및 써머타임 보정 함수
//─────────────────────────────
const cityLongitudes = {
  "서울특별시": 126.9780,
  "부산광역시": 129.1,
  "대구광역시": 128.6,
  "인천광역시": 126.7052,
  "광주광역시": 126.8530,
  "대전광역시": 127.3845,
  "울산광역시": 129.3114,
  "세종특별자치시": 127.2890,
  // 경기도
  "수원시": 127.0014,
  "고양시": 126.83,
  "용인시": 127.1731,
  "성남시": 127.137,
  "부천시": 126.766,
  "안산시": 126.851,
  "안양시": 126.9566,
  "남양주시": 127.2623,
  "화성시": 126.831,
  "평택시": 127.1116,
  "시흥시": 126.79,
  "김포시": 126.715,
  "파주시": 126.783,
  "의정부시": 127.0469,
  "광명시": 126.8826,
  "광주시": 126.666,
  "군포시": 126.935,
  "이천시": 127.443,
  "양주시": 127.03,
  "오산시": 127.079,
  "구리시": 127.13,
  "안성시": 127.279,
  "포천시": 127.2,
  "의왕시": 126.931,
  "하남시": 127.214,
  "여주시": 127.652,
  "동두천시": 127.05,
  "과천시": 126.984,
  "가평군": 127.51,
  "양평군": 127.5,
  "연천군": 127.1,
  // 강원도
  "춘천시": 127.729,
  "원주시": 127.93,
  "강릉시": 128.896,
  "동해시": 129.113,
  "태백시": 128.986,
  "속초시": 128.591,
  "삼척시": 129.168,
  "홍천군": 127.88,
  "횡성군": 128.425,
  "영월군": 128.613,
  "평창군": 128.424,
  "정선군": 128.7,
  "철원군": 127.415,
  "화천군": 127.753,
  "양구군": 128.47,
  "인제군": 128.116,
  "고성군": 128.467,
  "양양군": 128.692,
  // 충청북도
  "청주시": 127.4914,
  "충주시": 127.9323,
  "제천시": 128.1926,
  "보은군": 127.728,
  "옥천군": 127.609,
  "영동군": 128.382,
  "진천군": 127.439,
  "괴산군": 127.731,
  "음성군": 127.674,
  "단양군": 128.377,
  "증평군": 127.48,
  // 충청남도
  "천안시": 127.146,
  "공주시": 127.098,
  "보령시": 126.611,
  "아산시": 127.001,
  "서산시": 126.449,
  "논산시": 127.074,
  "계룡시": 127.264,
  "당진시": 126.621,
  "금산군": 127.386,
  "부여군": 126.802,
  "서천군": 126.781,
  "청양군": 126.856,
  "홍성군": 126.726,
  "예산군": 126.678,
  "태안군": 126.325,
  // 전라북도
  "전주시": 127.108,
  "군산시": 126.711,
  "익산시": 126.957,
  "정읍시": 126.846,
  "남원시": 127.392,
  "김제시": 126.871,
  "완주군": 127.062,
  "진안군": 127.229,
  "무주군": 127.69,
  "장수군": 127.891,
  "임실군": 127.409,
  "순창군": 127.13,
  "고창군": 126.785,
  "부안군": 126.73,
  // 전라남도
  "목포시": 126.411,
  "여수시": 127.643,
  "순천시": 127.496,
  "나주시": 126.717,
  "광양시": 127.695,
  "담양군": 126.984,
  "곡성군": 127.262,
  "구례군": 127.392,
  "고흥군": 127.384,
  "보성군": 127.122,
  "화순군": 127.04,
  "장흥군": 126.725,
  "강진군": 126.645,
  "해남군": 126.531,
  "영암군": 126.682,
  "무안군": 126.731,
  "함평군": 126.625,
  "영광군": 126.509,
  "장성군": 126.751,
  "완도군": 126.653,
  "진도군": 126.359,
  "신안군": 126.361,
  // 경상북도
  "포항시": 129.366,
  "경주시": 129.224,
  "김천시": 128.198,
  "안동시": 128.723,
  "구미시": 128.344,
  "영주시": 128.637,
  "영천시": 128.733,
  "상주시": 128.159,
  "문경시": 128.185,
  "경산시": 128.734,
  "군위군": 128.454,
  "의성군": 128.181,
  "청송군": 128.218,
  "영양군": 128.276,
  "영덕군": 128.703,
  "청도군": 128.626,
  "고령군": 128.347,
  "성주군": 128.177,
  "칠곡군": 128.54,
  "예천군": 128.245,
  "봉화군": 128.363,
  "울진군": 129.341,
  "울릉군": 130.904,
  // 경상남도
  "창원시": 128.681,
  "김해시": 128.881,
  "진주시": 128.092,
  "양산시": 129.045,
  "거제시": 128.678,
  "사천시": 128.189,
  "밀양시": 128.747,
  "통영시": 128.425,
  "거창군": 128.184,
  "고성군": 128.373,
  "남해군": 127.902,
  "산청군": 127.779,
  "창녕군": 128.415,
  "하동군": 127.997,
  "함안군": 128.389,
  "함양군": 127.81,
  "합천군": 128.175,
  "의령군": 128.29,
  // 제주특별자치도
  "제주시": 126.5312,
  "서귀포시": 126.715
};

function getSummerTimeInterval(year) {
  let interval = null;
  switch (year) {
    case 1948:
      interval = { start: new Date(1948, 4, 31, 0, 0), end: new Date(1948, 8, 22, 0, 0) };
      break;
    case 1949:
      interval = { start: new Date(1949, 2, 31, 0, 0), end: new Date(1949, 8, 30, 0, 0) };
      break;
    case 1950:
      interval = { start: new Date(1950, 3, 1, 0, 0), end: new Date(1950, 8, 10, 0, 0) };
      break;
    case 1951:
      interval = { start: new Date(1951, 4, 6, 0, 0), end: new Date(1951, 8, 9, 0, 0) };
      break;
    case 1955:
      interval = { start: new Date(1955, 3, 6, 0, 0), end: new Date(1955, 8, 22, 0, 0) };
      break;
    case 1956:
      interval = { start: new Date(1956, 4, 20, 0, 0), end: new Date(1956, 8, 30, 0, 0) };
      break;
    case 1957:
      interval = { start: new Date(1957, 4, 5, 0, 0), end: new Date(1957, 8, 22, 0, 0) };
      break;
    case 1958:
      interval = { start: new Date(1958, 4, 4, 0, 0), end: new Date(1958, 8, 21, 0, 0) };
      break;
    default:
      interval = null;
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
  // 올바른 일반 하이픈(-) 사용
  const longitudeCorrection = Math.round((cityLongitude - 135.1) * 4);
  const eqTime = getEquationOfTime(dateObj);
  let correctedTime = new Date(dateObj.getTime() + (longitudeCorrection + eqTime) * 60000);
  const summerInterval = getSummerTimeInterval(correctedTime.getFullYear());
  if (summerInterval && correctedTime >= summerInterval.start && correctedTime < summerInterval.end) {
    correctedTime = new Date(correctedTime.getTime() - 60 * 60000);
  }
  return correctedTime;
}

//─────────────────────────────
// [1] 천문/역법 기본 함수들 (JD 변환, 황경 계산)
//─────────────────────────────
function calendarGregorianToJD(year, month, day) {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const a = Math.floor(year / 100);
  const b = 2 - a + Math.floor(a / 4);
  return Math.floor(365.25 * (year + 4716)) +
         Math.floor(30.6001 * (month + 1)) +
         day + b - 1524.5;
}

function jdToCalendarGregorian(jd) {
  const z = Math.floor(jd + 0.5);
  const f = jd + 0.5 - z;
  let a = z;
  if (z >= 2299161) {
    const alpha = Math.floor((z - 1867216.25) / 36524.25);
    a = z + 1 + alpha - Math.floor(alpha / 4);
  }
  const b = a + 1524;
  const c = Math.floor((b - 122.1) / 365.25);
  const d = Math.floor(365.25 * c);
  const e = Math.floor((b - d) / 30.6001);
  const day = b - d - Math.floor(30.6001 * e) + f;
  let month = e - 1;
  if (month > 12) month -= 12;
  let year = c - 4715;
  if (month > 2) year -= 1;
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
  let trueL = (L0 + C) % 360;
  if (trueL < 0) trueL += 360;
  return trueL;
}

function getJDFromDate(dateObj) {
  const y = dateObj.getFullYear();
  const m = dateObj.getMonth() + 1;
  const d = dateObj.getDate() + dateObj.getHours() / 24 + dateObj.getMinutes() / (24 * 60);
  return calendarGregorianToJD(y, m, d);
}

//─────────────────────────────
// [2] 절기 계산 (KST 보정)
//─────────────────────────────
function findSolarTermDate(year, solarDegree) {
  const target = solarDegree % 360;
  const jd0 = calendarGregorianToJD(year, 1, 1);
  const L0 = getSunLongitude(jd0);
  const dailyMotion = 0.9856;
  let delta = target - L0;
  if (delta < 0) delta += 360;
  let jd = jd0 + delta / dailyMotion;
  let iteration = 0, maxIter = 100, precision = 0.001;
  while (iteration < maxIter) {
    let L = getSunLongitude(jd);
    let diff = target - L;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    if (Math.abs(diff) < precision) break;
    jd += diff / dailyMotion;
    iteration++;
  }
  const [y, m, dFrac] = jdToCalendarGregorian(jd);
  const d = Math.floor(dFrac);
  const frac = dFrac - d;
  const hh = Math.floor(frac * 24);
  const mm = Math.floor((frac * 24 - hh) * 60);
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
  const start = findSolarTermDate(solarYear, 315);
  const end = findSolarTermDate(solarYear + 1, 315);
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
  const yearStem = yearGanZhi.charAt(0);
  const yearStemIndex = Cheongan.indexOf(yearStem) + 1;
  const monthStemIndex = ((yearStemIndex * 2) + monthNumber - 1) % 10;
  const monthStem = Cheongan[monthStemIndex];
  const monthBranch = MONTH_ZHI[monthNumber - 1];
  return monthStem + monthBranch;
}

//─────────────────────────────
// [3] 전통 간지 상수 및 시(時) 지지 배열
//─────────────────────────────
const MONTH_ZHI = ["인", "묘", "진", "사", "오", "미", "신", "유", "술", "해", "자", "축"];
const Cheongan = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"];
const Jiji = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"];
// (이미 위에서 정의된 sexagenaryCycle을 그대로 사용)

//─────────────────────────────
// [4] 일간(일주) 계산
//─────────────────────────────
function getDayGanZhi(dateObj) {
  if (!dateObj || isNaN(dateObj.getTime())) {
    console.error("getDayGanZhi: 유효하지 않은 dateObj", dateObj);
    return "갑자";
  }
  let d = new Date(dateObj.getTime());
  let thresholdTime;
  const jasiElem = document.getElementById('jojasi');
  const yajasiElem = document.getElementById('yajasi');
  const insiElem = document.getElementById('insi');
  if (jasiElem && jasiElem.checked) {
    thresholdTime = { hour: 0, minute: 0 };
    if (d < new Date(d.getFullYear(), d.getMonth(), d.getDate(), thresholdTime.hour, thresholdTime.minute)) {
      d = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1, thresholdTime.hour, thresholdTime.minute);
    } else {
      d = new Date(d.getFullYear(), d.getMonth(), d.getDate(), thresholdTime.hour, thresholdTime.minute);
    }
  } else if (yajasiElem && yajasiElem.checked) {
    thresholdTime = { hour: 23, minute: 30 };
    if (d > new Date(d.getFullYear(), d.getMonth(), d.getDate(), thresholdTime.hour, thresholdTime.minute)) {
      d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1, thresholdTime.hour, thresholdTime.minute);
    } else {
      d = new Date(d.getFullYear(), d.getMonth(), d.getDate(), thresholdTime.hour, thresholdTime.minute);
    }
  } else if (insiElem && insiElem.checked) {
    thresholdTime = { hour: 3, minute: 30 };
    if (d < new Date(d.getFullYear(), d.getMonth(), d.getDate(), thresholdTime.hour, thresholdTime.minute)) {
      d = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1, thresholdTime.hour, thresholdTime.minute);
    } else {
      d = new Date(d.getFullYear(), d.getMonth(), d.getDate(), thresholdTime.hour, thresholdTime.minute);
    }
  } else {
    thresholdTime = { hour: 3, minute: 30 };
    if (d < new Date(d.getFullYear(), d.getMonth(), d.getDate(), thresholdTime.hour, thresholdTime.minute)) {
      d = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1, thresholdTime.hour, thresholdTime.minute);
    } else {
      d = new Date(d.getFullYear(), d.getMonth(), d.getDate(), thresholdTime.hour, thresholdTime.minute);
    }
  }
  const jd = Math.floor(calendarGregorianToJD(d.getFullYear(), d.getMonth() + 1, d.getDate()));
  return sexagenaryCycle[(jd + 50) % 60] || "갑자";
}

//─────────────────────────────
// [5] 고정 시주 계산을 위한 fixedDayMapping (참고용)
//─────────────────────────────
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

//─────────────────────────────
// [6] 시(時) 계산을 위한 함수
//─────────────────────────────
function getHourBranchIndex(dateObj) {
  let totalMinutes = dateObj.getHours() * 60 + dateObj.getMinutes();
  let threshold, offset;
  if (document.getElementById('jojasi') && document.getElementById('jojasi').checked) {
    threshold = 23 * 60;
    offset = 0;
  } else if (document.getElementById('yajasi') && document.getElementById('yajasi').checked) {
    threshold = 23 * 60 + 30;
    offset = 0;
  } else if (document.getElementById('insi') && document.getElementById('insi').checked) {
    threshold = 3 * 60 + 30;
    offset = 2;
  }
  if (totalMinutes < threshold) {
    totalMinutes += 1440;
  }
  let diff = totalMinutes - threshold;
  let index = Math.floor(diff / 120) % 12;
  index = (index + offset) % 12;
  return index;
}

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

function getDayStem(dayGanZhiStr) {
  if (!dayGanZhiStr || typeof dayGanZhiStr !== "string" || dayGanZhiStr.length === 0) {
    console.error("getDayStem: 인자가 유효하지 않습니다. 기본값 '갑' 사용");
    return "갑";
  }
  return dayGanZhiStr.charAt(0);
}

function getHourStem(dayPillar, hourBranchIndex) {
  const dayStem = getDayStem(dayPillar);
  const hourBranch = Jiji[hourBranchIndex];
  if (fixedDayMapping.hasOwnProperty(dayStem)) {
    const mappedArray = fixedDayMapping[dayStem];
    if (mappedArray.length === 12 && hourBranchIndex >= 0 && hourBranchIndex < 12) {
      for (let i = 0; i < 12; i++) {
        if (mappedArray[i].endsWith(hourBranch)) {
          return mappedArray[i].slice(0, 1);
        }
      }
      //console.warn(⚠️ [매칭 오류] 예상 지지(${hourBranch}), fixedDayMapping 값(${mappedArray[hourBranchIndex]}));
    }
  }
  const dayStemIndex = Cheongan.indexOf(dayStem);
  return (dayStemIndex % 2 === 0)
         ? Cheongan[(dayStemIndex * 2 + hourBranchIndex) % 10]
         : Cheongan[(dayStemIndex * 2 + hourBranchIndex + 2) % 10];
}

//─────────────────────────────
// [8] 최종 함수: 사주 및 대운 계산
//─────────────────────────────
function splitPillar(pillar) { 
  if (pillar && pillar.length >= 2) {
    return { gan: pillar.charAt(0), ji: pillar.charAt(1) };
  } else {
    return { gan: "-", ji: "-" };
  }
}

const sexagenaryCycle = [
	"갑자","을축","병인","정묘","무진","기사","경오","신미","임신","계유",
	"갑술","을해","병자","정축","무인","기묘","경진","신사","임오","계미",
	"갑신","을유","병술","정해","무자","기축","경인","신묘","임진","계사",
	"갑오","을미","병신","정유","무술","기해","경자","신축","임인","계묘",
	"갑진","을사","병오","정미","무신","기유","경술","신해","임자","계축",
	"갑인","을묘","병진","정사","무오","기미","경신","신유","임술","계해"
];

const stemMapping = {
  "갑": { hanja: "甲", hanguel: "갑목", eumYang: "양", hanguelshorts: '갑' },
  "을": { hanja: "乙", hanguel: "을목", eumYang: "음", hanguelshorts: '을' },
  "병": { hanja: "丙", hanguel: "병화", eumYang: "양", hanguelshorts: '병' },
  "정": { hanja: "丁", hanguel: "정화", eumYang: "음", hanguelshorts: '정' },
  "무": { hanja: "戊", hanguel: "무토", eumYang: "양", hanguelshorts: '무' },
  "기": { hanja: "己", hanguel: "기토", eumYang: "음", hanguelshorts: '기' },
  "경": { hanja: "庚", hanguel: "경금", eumYang: "양", hanguelshorts: '경' },
  "신": { hanja: "辛", hanguel: "신금", eumYang: "음", hanguelshorts: '신' },
  "임": { hanja: "壬", hanguel: "임수", eumYang: "양", hanguelshorts: '임' },
  "계": { hanja: "癸", hanguel: "계수", eumYang: "음", hanguelshorts: '계' }
};

const branchMapping = {
  "자": { hanja: "子", hanguel: "자수", eumYang: "양(음)", hanguelshorts: '자' },
  "축": { hanja: "丑", hanguel: "축토", eumYang: "음", hanguelshorts: '축' },
  "인": { hanja: "寅", hanguel: "인목", eumYang: "양", hanguelshorts: '인' },
  "묘": { hanja: "卯", hanguel: "묘목", eumYang: "음", hanguelshorts: '묘' },
  "진": { hanja: "辰", hanguel: "진토", eumYang: "양", hanguelshorts: '진' },
  "사": { hanja: "巳", hanguel: "사화", eumYang: "음(양)", hanguelshorts: '사' },
  "오": { hanja: "午", hanguel: "오화", eumYang: "양(음)", hanguelshorts: '오' },
  "미": { hanja: "未", hanguel: "미토", eumYang: "음", hanguelshorts: '미' },
  "신": { hanja: "申", hanguel: "신금", eumYang: "양", hanguelshorts: '신' },
  "유": { hanja: "酉", hanguel: "유금", eumYang: "음", hanguelshorts: '유' },
  "술": { hanja: "戌", hanguel: "술토", eumYang: "양", hanguelshorts: '술' },
  "해": { hanja: "亥", hanguel: "해수", eumYang: "음(양)", hanguelshorts: '해' }
};

function getDaewoonData(inputYear, month, day, birthPlace, gender) {
  // 원래 입력 날짜와 보정된 출생시간 계산
  const originalDate = new Date(inputYear, month - 1, day);
  const correctedDate = adjustBirthDate(originalDate, birthPlace);
  
  // 명식 계산용 effectiveYear: 원래 입력한 연도와 해당 연도의 입춘(315°) 날짜를 비교
  // 전통적으로 생일(원래 입력 날짜)이 입춘보다 이전이면 명식은 전년도 기준
  const ipChunForPillar = findSolarTermDate(inputYear, 315);
  const effectiveYearForPillar = (originalDate < ipChunForPillar) ? inputYear - 1 : inputYear;
  
  // 대운/세운 계산용 effectiveYear는 입력 연도를 그대로 사용
  const effectiveYearForDaewoon = inputYear;
  
  console.log("originalDate:", originalDate, "correctedDate:", correctedDate);
  console.log("effectiveYearForPillar:", effectiveYearForPillar, "effectiveYearForDaewoon:", effectiveYearForDaewoon);
  
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
  
  return { base: baseNumber, list: list, dayStemRef: dayStemRef };
}



function getDaewoonData(year, month, day, birthPlace, gender) {
  const originalDate = new Date(year, month - 1, day);
  let correctedDate = adjustBirthDate(originalDate, birthPlace);

  // 입력 날짜와 보정된 날짜의 차이가 60분 미만이면,
  // 날짜 부분을 원래 입력 날짜로 강제 보정합니다.
  const diffMs = originalDate.getTime() - correctedDate.getTime();
  if (Math.abs(diffMs) < 60 * 60000) {
    // correctedDate의 연,월,일을 원래 입력값으로 대체
    correctedDate = new Date(year, month - 1, day, correctedDate.getHours(), correctedDate.getMinutes(), correctedDate.getSeconds());
  }

  const ipChun = findSolarTermDate(correctedDate.getFullYear(), 315);
  // 전통 방식: correctedDate가 입춘 이전이면 effectiveYear는 전년도
  const effectiveYear = (correctedDate < ipChun) ? correctedDate.getFullYear() - 1 : correctedDate.getFullYear();
  console.log("correctedDate:", correctedDate, "effectiveYear:", effectiveYear);

  // 이후 모든 명식 및 대운 계산에 effectiveYear를 일관되게 사용
  const yearPillar = getYearGanZhi(correctedDate, effectiveYear);
  const monthPillar = getMonthGanZhi(correctedDate, effectiveYear);
  const dayStemRef = getDayGanZhi(correctedDate).charAt(0);
  const isYang = ["갑", "병", "무", "경", "임"].includes(yearPillar.charAt(0));
  const isForward = (gender === "남" && isYang) || (gender === "여" && !isYang);

  const currentSolarTerms = getSolarTermBoundaries(effectiveYear);
  const previousSolarTerms = getSolarTermBoundaries(effectiveYear - 1);
  const nextSolarTerms = getSolarTermBoundaries(effectiveYear + 1);
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



function getDaewoonDataStr(year, month, day, birthPlace, gender) {
  const data = getDaewoonData(year, month, day, birthPlace, gender);
  const listStr = data.list.map(item => ${item.age}(${item.stem}${item.branch})).join(", ");
  return 대운수 ${data.base}, 대운 나이 목록: ${listStr};
}

function getFourPillarsWithDaewoon(year, month, day, hour, minute, birthPlace, gender) {
  const originalDate = new Date(year, month - 1, day, hour, minute);
  const correctedDate = adjustBirthDate(originalDate, birthPlace);
  const yearPillar = getYearGanZhi(correctedDate, year);
  const monthPillar = getMonthGanZhi(correctedDate, year);
  const dayPillar = getDayGanZhi(correctedDate);
  const hourBranchIndex = getHourBranchIndex(correctedDate);
  const hourPillar = getHourStem(dayPillar, hourBranchIndex) + Jiji[hourBranchIndex];
  return ${yearPillar} ${monthPillar} ${dayPillar} ${hourPillar}시, ${getDaewoonDataStr(year, month, day, birthPlace, gender)};
}

function debugSolarTermBoundaries(solarYear) {
  return getSolarTermBoundaries(solarYear);
}

// Global state object
let globalState = {
  birthYear: null,
  month: null,
  day: null,
  birthPlace: null,
  gender: null,
  daewoonData: null,
  sewoonStartYear: null
};

// ★ 십신(十神) 천간 매핑 (본원 기준 갑목일 때)
const tenGodMappingForStems = {
  "갑": {
    "갑": "비견",
    "을": "겁재",
    "병": "식신",
    "정": "상관",
    "무": "편재",
    "기": "정재",
    "경": "편관",
    "신": "정관",
    "임": "편인",
    "계": "정인"
  },
  "을": {
    "갑": "겁재",
    "을": "비견",
    "병": "상관",
    "정": "식신",
    "무": "정재",
    "기": "편재",
    "경": "정관",
    "신": "편관",
    "임": "정인",
    "계": "편인"
  },
  "병": {
    "갑": "편인",
    "을": "정인",
    "병": "비견",
    "정": "겁재",
    "무": "식신",
    "기": "상관",
    "경": "편재",
    "신": "정재",
    "임": "편관",
    "계": "정관"
  },
  "정": {
    "갑": "정인",
    "을": "편인",
    "병": "겁재",
    "정": "비견",
    "무": "상관",
    "기": "식상",
    "경": "정재",
    "신": "편재",
    "임": "정관",
    "계": "편관"
  },
  "무": {
    "갑": "편관",
    "을": "정관",
    "병": "편인",
    "정": "정인",
    "무": "비견",
    "기": "겁재",
    "경": "식신",
    "신": "상관",
    "임": "편재",
    "계": "정재"
  },
  "기": {
    "갑": "정관",
    "을": "편관",
    "병": "정인",
    "정": "편인",
    "무": "겁재",
    "기": "비견",
    "경": "상관",
    "신": "식신",
    "임": "정재",
    "계": "편재"
  },
  "경": {
    "갑": "편재",
    "을": "정재",
    "병": "편관",
    "정": "정관",
    "무": "편인",
    "기": "정인",
    "경": "비견",
    "신": "겁재",
    "임": "식신",
    "계": "상관"
  },
  "신": {
    "갑": "정재",
    "을": "편재",
    "병": "정관",
    "정": "편관",
    "무": "정인",
    "기": "편인",
    "경": "겁재",
    "신": "비견",
    "임": "상관",
    "계": "식신"
  },
  "임": {
    "갑": "식신",
    "을": "상관",
    "병": "편재",
    "정": "정재",
    "무": "편관",
    "기": "정관",
    "경": "편인",
    "신": "정인",
    "임": "비견",
    "계": "겁재"
  },
  "계": {
    "갑": "식신",
    "을": "상관",
    "병": "편재",
    "정": "정재",
    "무": "편관",
    "기": "정관",
    "경": "편인",
    "신": "정인",
    "임": "비견",
    "계": "겁재"
  }
};

const tenGodMappingForBranches = {
  "갑": {
    "자": "정인",
    "축": "정재",
    "인": "비견",
    "묘": "겁재",
    "진": "편재",
    "사": "상관",
    "오": "식신",
    "미": "정재",
    "신": "편관",
    "유": "정관",
    "술": "편재",
    "해": "편인"
  },
  "을": {
    "자": "편인",
    "축": "편재",
    "인": "겁재",
    "묘": "비견",
    "진": "정재",
    "사": "식신",
    "오": "상관",
    "미": "편재",
    "신": "정관",
    "유": "편관",
    "술": "정재",
    "해": "정인"
  },
  "병": {
    "자": "정관",
    "축": "상관",
    "인": "편인",
    "묘": "정인",
    "진": "식신",
    "사": "비견",
    "오": "겁살",
    "미": "상관",
    "신": "편재",
    "유": "정재",
    "술": "식신",
    "해": "편인"
  },
  "정": {
    "자": "편관",
    "축": "식신",
    "인": "정인",
    "묘": "편인",
    "진": "상관",
    "사": "겁재",
    "오": "비견",
    "미": "식신",
    "신": "정재",
    "유": "편재",
    "술": "상관",
    "해": "정인"
  },
  "무": {
    "자": "정재",
    "축": "겁재",
    "인": "편관",
    "묘": "정관",
    "진": "비견",
    "사": "편인",
    "오": "정인",
    "미": "겁재",
    "신": "식신",
    "유": "상관",
    "술": "비견",
    "해": "편재"
  },
  "기": {
    "자": "편재",
    "축": "비견",
    "인": "정관",
    "묘": "편관",
    "진": "겁재",
    "사": "정인",
    "오": "편인",
    "미": "비견",
    "신": "상관",
    "유": "식신",
    "술": "겁재",
    "해": "정재"
  },
  "경": {
    "자": "상관",
    "축": "정인",
    "인": "편재",
    "묘": "정재",
    "진": "편인",
    "사": "편관",
    "오": "정관",
    "미": "정인",
    "신": "비견",
    "유": "겁재",
    "술": "편인",
    "해": "식신"
  },
  "신": {
    "자": "식신",
    "축": "편인",
    "인": "정재",
    "묘": "편재",
    "진": "정인",
    "사": "정관",
    "오": "편관",
    "미": "편인",
    "신": "겁재",
    "유": "비견",
    "술": "정인",
    "해": "상관"
  },
  "임": {
    "자": "겁재",
    "축": "정관",
    "인": "식상",
    "묘": "상관",
    "진": "편관",
    "사": "편재",
    "오": "정재",
    "미": "정관",
    "신": "편인",
    "유": "정인",
    "술": "편인",
    "해": "비견"
  },
  "계": {
    "자": "비견",
    "축": "편관",
    "인": "상관",
    "묘": "식신",
    "진": "정관",
    "사": "정재",
    "오": "편재",
    "미": "편관",
    "신": "정인",
    "유": "편인",
    "술": "정인",
    "해": "겁재"
  }
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
  "자": ["❤", "❤", "계"],
  "축": ["계", "신", "기"],
  "인": ["❤", "병", "갑"],
  "묘": ["❤", "❤", "을"],
  "진": ["을", "계", "무"],
  "사": ["❤", "경", "병"],
  "오": ["❤", "❤", "정"],
  "미": ["정", "을", "기"],
  "신": ["❤", "임", "경"],
  "유": ["❤", "❤", "신"],
  "술": ["신", "정", "무"],
  "해": ["❤", "갑", "임"]
};

function getTwelveUnseong(baseDayStem, branch) {
  const mapping = {
    "갑": {
      "자": "목욕",
      "축": "관대",
      "인": "건록",
      "묘": "제왕",
      "진": "쇠",
      "사": "병",
      "오": "사",
      "미": "묘",
      "신": "절",
      "유": "태",
      "술": "양",
      "해": "장생"
    },
    "을": {
      "자": "병",
      "축": "쇠",
      "인": "제왕",
      "묘": "건록",
      "진": "관대",
      "사": "목욕",
      "오": "장생",
      "미": "양",
      "신": "태",
      "유": "절",
      "술": "묘",
      "해": "사"
    },
    "병": {
      "자": "태",
      "축": "양",
      "인": "장생",
      "묘": "목욕",
      "진": "건록",
      "사": "제왕",
      "오": "쇠",
      "미": "병",
      "신": "사",
      "유": "묘",
      "술": "절",
      "해": "사"
    },
    "정": {
      "자": "절",
      "축": "묘",
      "인": "사",
      "묘": "병",
      "진": "쇠",
      "사": "제왕",
      "오": "건록",
      "미": "관대",
      "신": "목욕",
      "유": "장생",
      "술": "양",
      "해": "태"
    },
    "무": {
      "자": "태",
      "축": "양",
      "인": "장생",
      "묘": "목욕",
      "진": "건록",
      "사": "제왕",
      "오": "쇠",
      "미": "병",
      "신": "사",
      "유": "묘",
      "술": "절",
      "해": "사"
    },
    "기": {
      "자": "절",
      "축": "묘",
      "인": "사",
      "묘": "병",
      "진": "쇠",
      "사": "제왕",
      "오": "건록",
      "미": "관대",
      "신": "목욕",
      "유": "장생",
      "술": "양",
      "해": "태"
    },
    "경": {
      "자": "사",
      "축": "묘",
      "인": "절",
      "묘": "태",
      "진": "양",
      "사": "장생",
      "오": "목욕",
      "미": "관대",
      "신": "건록",
      "유": "제왕",
      "술": "쇠",
      "해": "병"
    },
    "신": {
      "자": "장생",
      "축": "양",
      "인": "태",
      "묘": "절",
      "진": "묘",
      "사": "사",
      "오": "병",
      "미": "쇠",
      "신": "제왕",
      "유": "건록",
      "술": "관대",
      "해": "목욕"
    },
    "임": {
      "자": "제왕",
      "축": "쇠",
      "인": "병",
      "묘": "사",
      "진": "묘",
      "사": "절",
      "오": "태",
      "미": "양",
      "신": "장생",
      "유": "목욕",
      "술": "관대",
      "해": "건록"
    },
    "계": {
      "자": "건록",
      "축": "관대",
      "인": "목욕",
      "묘": "장생",
      "진": "양",
      "사": "태",
      "오": "절",
      "미": "묘",
      "신": "사",
      "유": "병",
      "술": "쇠",
      "해": "제왕"
    }
  };
  return mapping[baseDayStem] ? mapping[baseDayStem][branch] || "" : "";
}

function getTwelveShinsal(yearBranch, branch) {
  const mapping = {
    "자": {
      "자": "장성",
      "축": "반안",
      "인": "역마",
      "묘": "육해",
      "진": "화개",
      "사": "겁살",
      "오": "재살",
      "미": "천살",
      "신": "지살",
      "유": "년살",
      "술": "월살",
      "해": "망신"
    },
    "축": {
      "자": "망신",
      "축": "장성",
      "인": "반안",
      "묘": "역마",
      "진": "육해",
      "사": "화개",
      "오": "겁살",
      "미": "재살",
      "신": "천살",
      "유": "지살",
      "술": "년살",
      "해": "월살"
    },
    "인": {
      "자": "월살",
      "축": "망신",
      "인": "장성",
      "묘": "반안",
      "진": "역마",
      "사": "육해",
      "오": "화개",
      "미": "겁살",
      "신": "재살",
      "유": "천살",
      "술": "지살",
      "해": "년살"
    },
    "묘": {
      "자": "년살",
      "축": "월살",
      "인": "망신",
      "묘": "장성",
      "진": "반안",
      "사": "역마",
      "오": "육해",
      "미": "화개",
      "신": "겁살",
      "유": "재살",
      "술": "천살",
      "해": "지살"
    },
    "진": {
      "자": "지살",
      "축": "년살",
      "인": "월살",
      "묘": "망신",
      "진": "장성",
      "사": "반안",
      "오": "역마",
      "미": "육해",
      "신": "화개",
      "유": "겁살",
      "술": "재살",
      "해": "천살"
    },
    "사": {
      "자": "천살",
      "축": "지살",
      "인": "년살",
      "묘": "월살",
      "진": "망신",
      "사": "장성",
      "오": "반안",
      "미": "역마",
      "신": "육해",
      "유": "화개",
      "술": "겁살",
      "해": "재살"
    },
    "오": {
      "자": "재살",
      "축": "천살",
      "인": "지살",
      "묘": "년살",
      "진": "월살",
      "사": "망신",
      "오": "장성",
      "미": "반안",
      "신": "역마",
      "유": "육해",
      "술": "화개",
      "해": "겁살"
    },
    "미": {
      "자": "겁살",
      "축": "재살",
      "인": "천살",
      "묘": "지살",
      "진": "년살",
      "사": "월살",
      "오": "망신",
      "미": "장성",
      "신": "반안",
      "유": "역마",
      "술": "육해",
      "해": "화개"
    },
    "신": {
      "자": "화개",
      "축": "겁살",
      "인": "재살",
      "묘": "천살",
      "진": "지살",
      "사": "년살",
      "오": "월살",
      "미": "망신",
      "신": "장성",
      "유": "반안",
      "술": "역마",
      "해": "육해"
    },
    "유": {
      "자": "육해",
      "축": "화개",
      "인": "겁살",
      "묘": "재살",
      "진": "천살",
      "사": "지살",
      "오": "년살",
      "미": "월살",
      "신": "망신",
      "유": "장성",
      "술": "반안",
      "해": "역마"
    },
    "술": {
      "자": "역마",
      "축": "육해",
      "인": "화개",
      "묘": "겁살",
      "진": "재살",
      "사": "천살",
      "오": "지살",
      "미": "년살",
      "신": "월살",
      "유": "망신",
      "술": "장성",
      "해": "반안"
    },
    "해": {
      "자": "반안",
      "축": "역마",
      "인": "육해",
      "묘": "화개",
      "진": "겁살",
      "사": "재살",
      "오": "천살",
      "미": "지살",
      "신": "년살",
      "유": "월살",
      "술": "망신",
      "해": "장성"
    }
  };
  return mapping[yearBranch] ? mapping[yearBranch][branch] || "" : "";
}

// Global helper: pad
function pad(num) {
  return num.toString().padStart(2, '0');
}

// 헬퍼 함수: 천간(받은 간지) 십신을 구함 (기준일간의 천간이 갑일 경우)
function getTenGodForStem(receivingStem, baseDayStem) {
  if (tenGodMappingForStems[baseDayStem] && tenGodMappingForStems[baseDayStem][receivingStem]) {
    return tenGodMappingForStems[baseDayStem][receivingStem];
  }
  return "-";
}

// 헬퍼 함수: 지지(받은 지지) 십신을 구함 (기준일간이 갑목일 경우)
function getTenGodForBranch(receivingBranch, baseStem) {
  if (tenGodMappingForBranches[baseStem] && tenGodMappingForBranches[baseStem][receivingBranch]) {
    return tenGodMappingForBranches[baseStem][receivingBranch];
  }
  return "-";
}

function getGanZhiIndex(gz) {
  return sexagenaryCycle.indexOf(gz);
}

function getGanZhiFromIndex(i) {
  const mod = ((i % 60) + 60) % 60;
  return sexagenaryCycle[mod];
}

function getYearGanZhiForSewoon(year) {
  let refDate = new Date(year, 3, 1);
  let ipChun = findSolarTermDate(year, 315);
  let effectiveYear = (refDate >= ipChun) ? year : (year - 1);
  let index = ((effectiveYear - 4) % 60 + 60) % 60;
  return sexagenaryCycle[index];
}

//─────────────────────────────
// UI 업데이트 및 헬퍼 함수
//─────────────────────────────
function updateColorClasses() {
  const bgColorClasses = ['b_green', 'b_red', 'b_yellow', 'b_white', 'b_black'];
  document.querySelectorAll(".ganji_w").forEach(function(elem) {
    const val = elem.innerHTML.trim();
    bgColorClasses.forEach(cls => elem.classList.remove(cls));
    if (colorMapping[val]) {
      elem.classList.add(colorMapping[val].bgColor);
    }
  });
  const textColorClasses = ['green', 'red', 'yellow', 'white', 'black'];
  document.querySelectorAll(".grid_box_1 li b").forEach(function(bElem) {
    const val = bElem.innerHTML.trim();
    textColorClasses.forEach(cls => bElem.classList.remove(cls));
    if (colorMapping[val]) {
      bElem.classList.add(colorMapping[val].textColor);
    }
  });
  document.querySelectorAll(".ganji b").forEach(function(bElem) {
    const val = bElem.innerHTML.trim();
    textColorClasses.forEach(cls => bElem.classList.remove(cls));
    if (colorMapping[val]) {
      bElem.classList.add(colorMapping[val].textColor);
    }
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
  setText(prefix + "Hanja", (stemMapping[pillar.gan] && stemMapping[pillar.gan].hanja) || "-");
  setText(prefix + "Hanguel", (stemMapping[pillar.gan] && stemMapping[pillar.gan].hanguel) || "-");
  setText(prefix + "Eumyang", (stemMapping[pillar.gan] && stemMapping[pillar.gan].eumYang) || "-");
  setText(prefix + "10sin", (prefix === "Dt") ? "본원" : getTenGodForStem(pillar.gan, baseDayStem));
}

function updateBranchInfo(prefix, branch, baseDayStem) {
  setText(prefix + "Hanja", (branchMapping[branch] && branchMapping[branch].hanja) || "-");
  setText(prefix + "Hanguel", (branchMapping[branch] && branchMapping[branch].hanguel) || "-");
  setText(prefix + "Eumyang", (branchMapping[branch] && branchMapping[branch].eumYang) || "-");
  setText(prefix + "10sin", getTenGodForBranch(branch, baseDayStem));
  updateHiddenStems(branch, prefix);
}

function updateOriginalPillarMapping(yearPillar, monthPillar, dayPillar, hourPillar) {
  document.getElementById("Hb12ws").innerText = getTwelveUnseong(dayPillar.gan, hourPillar.ji);
  document.getElementById("Hb12ss").innerText = getTwelveShinsal(yearPillar.ji, hourPillar.ji);
  document.getElementById("Db12ws").innerText = getTwelveUnseong(dayPillar.gan, dayPillar.ji);
  document.getElementById("Db12ss").innerText = getTwelveShinsal(yearPillar.ji, dayPillar.ji);
  document.getElementById("Mb12ws").innerText = getTwelveUnseong(dayPillar.gan, monthPillar.ji);
  document.getElementById("Mb12ss").innerText = getTwelveShinsal(yearPillar.ji, monthPillar.ji);
  document.getElementById("Yb12ws").innerText = getTwelveUnseong(dayPillar.gan, yearPillar.ji);
  document.getElementById("Yb12ss").innerText = getTwelveShinsal(yearPillar.ji, yearPillar.ji);
}

//─────────────────────────────
// UI 이벤트 핸들러 및 초기화
//─────────────────────────────
document.addEventListener("DOMContentLoaded", function() {
  const picker = document.getElementById("woonTimeSetPicker");
  if (picker) {
    const now = new Date();
    const year = now.getFullYear();
    const month = pad(now.getMonth() + 1);
    const day = pad(now.getDate());
    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());
    picker.value = ${year}-${month}-${day}T${hours}:${minutes};
  }
});

document.getElementById("calcBtn").addEventListener("click", function() {
  let refDate = new Date();
  const name = document.getElementById("inputName").value.trim() || "-";
  const birthdayStr = document.getElementById("inputBirthday").value.trim();
  const birthtimeStr = document.getElementById("inputBirthtime").value.trim();
  const gender = document.getElementById("genderMan").checked ? "남" : (document.getElementById("genderWoman").checked ? "여" : "-");
  const birthPlace = document.getElementById("inputBirthPlace").value || "-";
  if (birthdayStr.length < 8) { alert("생년월일을 YYYYMMDD 형식으로 입력하세요."); return; }
  if (birthtimeStr.length < 4) { alert("태어난 시간을 HHMM 형식으로 입력하세요."); return; }
  let year = parseInt(birthdayStr.substring(0,4));
  let month = parseInt(birthdayStr.substring(4,6));
  let day = parseInt(birthdayStr.substring(6,8));
  const hour = parseInt(birthtimeStr.substring(0,2));
  const minute = parseInt(birthtimeStr.substring(2,4));
  const fullResult = getFourPillarsWithDaewoon(year, month, day, hour, minute, birthPlace, gender);
  const parts = fullResult.split(", ");
  const pillarsPart = parts[0] || "-";
  const pillars = pillarsPart.split(" ");
  const yearPillar = pillars[0] || "-";
  const monthPillar = pillars[1] || "-";
  const dayPillar = pillars[2] || "-";
  const hourPillar = (pillars.length >= 4) ? pillars[3].replace("시", "") : "-";
  const yearSplit = splitPillar(yearPillar);
  const monthSplit = splitPillar(monthPillar);
  const daySplit = splitPillar(dayPillar);
  const hourSplit = splitPillar(hourPillar);
  const baseDayStem = daySplit.gan;
  if (year < 1900 || year > 2099) { alert("연도는 1900년부터 2099년 사이로 입력하세요."); return; }
  if (month < 1 || month > 12) { alert("월은 1부터 12 사이의 숫자로 입력하세요."); return; }
  if (day < 1 || day > 31) { alert("일은 1부터 31 사이의 숫자로 입력하세요."); return; }
  const testDate = new Date(year, month - 1, day);
  if (testDate.getFullYear() !== year || (testDate.getMonth() + 1) !== month || testDate.getDate() !== day) {
    alert("유효한 날짜를 입력하세요."); return;
  }
  if (!/^\d{4}$/.test(birthtimeStr)) { alert("태어난 시간은 4자리 숫자 (HHMM) 형식으로 입력하세요."); return; }
  if (hour < 0 || hour > 23) { alert("시각은 00부터 23 사이의 숫자로 입력하세요."); return; }
  if (minute < 0 || minute > 59) { alert("분은 00부터 59 사이의 숫자로 입력하세요."); return; }
  const monthType = document.getElementById("monthType").value;
  if (monthType === "음력" || monthType === "음력(윤달)") {
    const calendar = new KoreanLunarCalendar();
    const isLeap = (monthType === "음력(윤달)");
    if (!calendar.setLunarDate(year, month, day, isLeap)) {
      console.error(${monthType} 날짜 설정에 실패했습니다.);
    } else {
      const solar = calendar.getSolarCalendar();
      year = solar.year; month = solar.month; day = solar.day;
    }
  }
  globalState.birthYear = year;
  globalState.month = month;
  globalState.day = day;
  globalState.birthPlace = birthPlace;
  globalState.gender = gender;
  const formattedBirth = ${year}-${pad(month)}-${pad(day)};
  const formattedTime = ${pad(hour)}:${pad(minute)};
  setText("resName", name);
  setText("resGender", gender);
  setText("resBirth", formattedBirth);
  setText("resTime", formattedTime);
  setText("resAddr", birthPlace);
  const originalDate = new Date(year, month - 1, day, hour, minute);
  const correctedTime = adjustBirthDate(originalDate, birthPlace);
  document.getElementById("resbjTime").innerHTML = correctedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  updatePillarInfo("Yt", yearSplit, baseDayStem);
  updatePillarInfo("Mt", monthSplit, baseDayStem);
  updatePillarInfo("Dt", daySplit, baseDayStem);
  updatePillarInfo("Ht", hourSplit, baseDayStem);
  updateBranchInfo("Yb", yearSplit.ji, baseDayStem);
  updateBranchInfo("Mb", monthSplit.ji, baseDayStem);
  updateBranchInfo("Db", daySplit.ji, baseDayStem);
  updateBranchInfo("Hb", hourSplit.ji, baseDayStem);
  document.getElementById('resultWrapper').style.display = 'block';
  document.getElementById('inputWrap').style.display = 'none';
  updateOriginalPillarMapping(yearSplit, monthSplit, daySplit, hourSplit);
function updateCurrentDaewoon() {
  // 전역 변수에 저장된 출생정보 활용
  const birthYear    = year;
  const birthMonth   = month;
  const birthDay     = day;
  const _birthPlace  = birthPlace;
  const _gender      = gender;
  
  // 현재 나이 계산 (생일 기준)
  const today = new Date();
  const birthDate = new Date(birthYear, birthMonth - 1, birthDay);
  let currentAge = today.getFullYear() - birthDate.getFullYear();
  if (
	today.getMonth() < birthDate.getMonth() ||
	(today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
  ) {
	currentAge--;
  }
  
  // 기준일간(본원) 계산 (계산된 사주 결과의 일간 사용)
  const fullResult = getFourPillarsWithDaewoon(birthYear, birthMonth, birthDay, hour, minute, _birthPlace, _gender);
  const pillarsPart = fullResult.split(", ")[0];
  const pillars = pillarsPart.split(" ");
  const yearPillar = pillars[0] || "-";
  const baseYearStem = splitPillar(yearPillar).gan;
  
  // 대운 데이터 계산
  const daewoonData = getDaewoonData(birthYear, birthMonth, birthDay, _birthPlace, _gender);
  
  // 현재 대운: 현재 나이에 가장 가까운(<= 현재 나이) 항목 선택
  let currentDaewoon = null;
  for (let i = 0; i < daewoonData.list.length; i++) {
	if (daewoonData.list[i].age <= currentAge) {
	  currentDaewoon = daewoonData.list[i];
	}
  }
  if (!currentDaewoon) {
	currentDaewoon = daewoonData.list[0] || { stem: "-", branch: "-" };
  }
  
  // 순행/역행 조건: 기준 일주의 천간(baseDayStem)을 기준으로 판단
  // "양남" (남자 + 양) 또는 "음녀" (여자 + 음)이면 순행, 그렇지 않으면 역행
  const isForward = (( _gender === "남" && ["갑","병","무","경","임"].includes(baseYearStem)) ||
					  ( _gender === "여" && !["갑","병","무","경","임"].includes(baseYearStem)));
  
  // 만약 역행인 경우, 대운 간지를 미러링해서 표시
  let displayDaewoon = currentDaewoon;
  if (isForward) {
	// 기준 대운: 리스트의 첫 항목의 간지(두 글자)
	const baseDaewoonGanji = daewoonData.list[0].stem + daewoonData.list[0].branch;
	const baseIndex = getGanZhiIndex(baseDaewoonGanji);
	// 현재 선택된 대운 간지
	const currentGanji = currentDaewoon.stem + currentDaewoon.branch;
	const currentIndex = getGanZhiIndex(currentGanji);
	// 차이를 미러링: delta를 반대로 적용
	const delta = currentIndex - baseIndex;
	const mirroredIndex = baseIndex - delta;
	const mirroredGanji = getGanZhiFromIndex(mirroredIndex);
	// 새 객체로 업데이트 (나이는 그대로)
	displayDaewoon = {
	  stem: mirroredGanji.charAt(0),
	  branch: mirroredGanji.charAt(1),
	  age: currentDaewoon.age
	};
  }
  
  // 대운 천간 업데이트
  setText("DwtHanja", stemMapping[displayDaewoon.stem] ? stemMapping[displayDaewoon.stem].hanja : "-");
  setText("DwtHanguel", stemMapping[displayDaewoon.stem] ? stemMapping[displayDaewoon.stem].hanguel : "-");
  setText("DwtEumyang", stemMapping[displayDaewoon.stem] ? stemMapping[displayDaewoon.stem].eumYang : "-");
  setText("Dwt10sin", getTenGodForStem(displayDaewoon.stem, baseDayStem));
  
  // 대운 지지 업데이트
  setText("DwbHanja", branchMapping[displayDaewoon.branch] ? branchMapping[displayDaewoon.branch].hanja : "-");
  setText("DwbHanguel", branchMapping[displayDaewoon.branch] ? branchMapping[displayDaewoon.branch].hanguel : "-");
  setText("DwbEumyang", branchMapping[displayDaewoon.branch] ? branchMapping[displayDaewoon.branch].eumYang : "-");
  setText("Dwb10sin", getTenGodForBranch(displayDaewoon.branch, baseDayStem));
  
  // 대운 지장간 업데이트
  const daewoonHidden = hiddenStemMapping[displayDaewoon.branch] || ["-", "-", "-"];
  setText("DwJj1", daewoonHidden[0]);
  setText("DwJj2", daewoonHidden[1]);
  setText("DwJj3", daewoonHidden[2]);
  
  setText("DWb12ws", getTwelveUnseong(daySplit.gan, displayDaewoon.branch));
  setText("DWb12ss", getTwelveShinsal(yearSplit.ji, displayDaewoon.branch));
}
  updateCurrentDaewoon();
  updateMonthlyWoonByToday(new Date());
  globalState.daewoonData = getDaewoonData(year, month, day, birthPlace, gender);
  var _yearSplit = splitPillar(yearPillar);
  const _baseYearStem = _yearSplit.gan;
  const _basedaytem = daySplit.gan;
  const isForward = ((gender === "남" && ["갑","병","무","경","임"].includes(_baseYearStem)) ||
                      (gender === "여" && !["갑","병","무","경","임"].includes(_baseYearStem)));
  function updateDaewoonItem(i, item, baseDayStem, isForward) {
  // forwardGanji: 원래 daewoon 항목의 간지 (두 글자)
  const forwardGanji = item.stem + item.branch;
  
  // 기준 대운 간지: daewoon 리스트의 첫 항목(앞에서부터 순행일 때)의 간지
  const baseDaewoon = globalState.daewoonData.list[0].stem + globalState.daewoonData.list[0].branch;
  const baseIndex = getGanZhiIndex(baseDaewoon);
  
  let finalGanji = forwardGanji;
  if (isForward) {
    // 순행인 경우: forward 진행에서의 차이(delta)를 기준으로 미러링함.
    const forwardIndex = getGanZhiIndex(forwardGanji);
    const delta = forwardIndex - baseIndex;
    const reversedIndex = baseIndex - delta;
    finalGanji = getGanZhiFromIndex(reversedIndex);
  }
  
  // 최종 결과를 천간과 지지로 분리
  const finalStem = finalGanji.charAt(0);
  const finalBranch = finalGanji.charAt(1);
  
  const idx = i + 1;
  setText("DC_" + idx, (stemMapping[finalStem] && stemMapping[finalStem].hanja) || "-");
  setText("DJ_" + idx, (branchMapping[finalBranch] && branchMapping[finalBranch].hanja) || "-");
  setText("dt10sin" + idx, getTenGodForStem(finalStem, baseDayStem) || "-");
  setText("db10sin" + idx, getTenGodForBranch(finalBranch, baseDayStem) || "-");
  setText("DwW" + idx, "-");
  setText("Ds" + idx, "-");
  setText("Da" + idx, item.age);
}
  for (let i = 0; i < 10; i++) {
    updateDaewoonItem(i, globalState.daewoonData.list[i], _basedaytem, isForward);
  }
  const birthDateObj = new Date(year, month - 1, day);
  const today = new Date();
  let currentAge = today.getFullYear() - birthDateObj.getFullYear();
  if (today.getMonth() < birthDateObj.getMonth() || (today.getMonth() === birthDateObj.getMonth() && today.getDate() < birthDateObj.getDate())) {
    currentAge--;
  }
  let currentDaewoonIndex = 0;
  if (globalState.daewoonData && globalState.daewoonData.list) {
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
    const sewoonSplit = splitPillar(sewoonGanZhi);
    let baseDayStem = daySplit.gan;
    setText("SwtHanja", stemMapping[sewoonSplit.gan] ? stemMapping[sewoonSplit.gan].hanja : "-");
    setText("SwtHanguel", stemMapping[sewoonSplit.gan] ? stemMapping[sewoonSplit.gan].hanguel : "-");
    setText("SwtEumyang", stemMapping[sewoonSplit.gan] ? stemMapping[sewoonSplit.gan].eumYang : "-");
    setText("Swt10sin", getTenGodForStem(sewoonSplit.gan, baseDayStem));
    setText("SwbHanja", branchMapping[sewoonSplit.ji] ? branchMapping[sewoonSplit.ji].hanja : "-");
    setText("SwbHanguel", branchMapping[sewoonSplit.ji] ? branchMapping[sewoonSplit.ji].hanguel : "-");
    setText("SwbEumyang", branchMapping[sewoonSplit.ji] ? branchMapping[sewoonSplit.ji].eumYang : "-");
    setText("Swb10sin", getTenGodForBranch(sewoonSplit.ji, baseDayStem));
    const sewoonHidden = hiddenStemMapping[sewoonSplit.ji] || ["-", "-", "-"];
    setText("SwJj1", sewoonHidden[0]);
    setText("SwJj2", sewoonHidden[1]);
    setText("SwJj3", sewoonHidden[2]);
    setText("SWb12ws", getTwelveUnseong(sewoonSplit.gan, sewoonSplit.ji));
    setText("SWb12ss", getTwelveShinsal(sewoonSplit.ji, sewoonSplit.ji));
    setText("WSwtHanja", stemMapping[sewoonSplit.gan] ? stemMapping[sewoonSplit.gan].hanja : "-");
    setText("WSwtHanguel", stemMapping[sewoonSplit.gan] ? stemMapping[sewoonSplit.gan].hanguel : "-");
    setText("WSwtEumyang", stemMapping[sewoonSplit.gan] ? stemMapping[sewoonSplit.gan].eumYang : "-");
    setText("WSwt10sin", getTenGodForStem(sewoonSplit.gan, baseDayStem));
    setText("WSwbHanja", branchMapping[sewoonSplit.ji] ? branchMapping[sewoonSplit.ji].hanja : "-");
    setText("WSwbHanguel", branchMapping[sewoonSplit.ji] ? branchMapping[sewoonSplit.ji].hanguel : "-");
    setText("WSwbEumyang", branchMapping[sewoonSplit.ji] ? branchMapping[sewoonSplit.ji].eumYang : "-");
    setText("WSwb10sin", getTenGodForBranch(sewoonSplit.ji, baseDayStem));
    setText("WSwJj1", sewoonHidden[0]);
    setText("WSwJj2", sewoonHidden[1]);
    setText("WSwJj3", sewoonHidden[2]);
    setText("WSWb12ws", getTwelveUnseong(sewoonSplit.gan, sewoonSplit.ji));
    setText("WSWb12ss", getTwelveShinsal(sewoonSplit.ji, sewoonSplit.ji));
  }
  updateCurrentSewoon(refDate);
  document.querySelectorAll("#daewoonList li").forEach(function(li) {
    li.addEventListener("click", function(event) {
      event.stopPropagation();
      document.querySelectorAll("#daewoonList li").forEach(item => item.classList.remove("active"));
      this.classList.add("active");
      const index = this.getAttribute("data-index");
      updateDaewoonDetails(index);
    });
  });
  document.querySelectorAll("#sewoonList li").forEach(function(li) {
    li.addEventListener("click", function(event) {
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
      setText("daewoonDetail", ${data.age}세 (${data.stem}${data.branch}));
    }
  }
  function updateSewoonDetails(index) {
    if (globalState.sewoonStartYear) {
      const computedYear = globalState.sewoonStartYear + (index - 1);
      const yearGanZhi = getYearGanZhiForSewoon(computedYear);
      const splitYear = splitPillar(yearGanZhi);
      setText("sewoonDetail", ${computedYear}년 (${splitYear.gan}${splitYear.ji}));
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
  sewoonList.forEach(function(item, index) {
    const idx = index + 1;
    setText("SC_" + idx, (stemMapping[item.gan] && stemMapping[item.gan].hanja) || "-");
    setText("SJ_" + idx, (branchMapping[item.ji] && branchMapping[item.ji].hanja) || "-");
    setText("st10sin" + idx, item.tenGod);
    setText("sb10sin" + idx, item.tenGodJiji);
    setText("SwW" + idx, getTwelveUnseong(daySplit.gan, item.ji) || "-");
    setText("Ss" + idx, getTwelveShinsal(yearSplit.ji, item.ji) || "-");
    setText("Dy" + idx, item.year);
  });
  updateColorClasses();
  const todayYear = today.getFullYear();
  const ipChun = findSolarTermDate(today.getFullYear(), 315);
  const displayYear = (today < ipChun) ? todayYear - 1 : todayYear;
  const sewoonLis = document.querySelectorAll("#sewoonList li");
  sewoonLis.forEach((li) => {
    const dyearElem = li.querySelector(".dyear");
    const currentYear = Number(dyearElem.innerText);
    if (currentYear === displayYear) {
      li.classList.add("active");
    } else {
      li.classList.remove("active");
    }
    document.getElementById('resultWrapper').style.display = 'block';
    document.getElementById('inputWrap').style.display = 'none';
  });
  let currentSewoonIndex = displayYear - globalState.sewoonStartYear;
  if (currentSewoonIndex < 0) currentSewoonIndex = 0;
  if (currentSewoonIndex > 9) currentSewoonIndex = 9;
  const computedSewoonYear = globalState.sewoonStartYear + currentSewoonIndex;
  updateMonthlyData(computedSewoonYear);
  const monthlyContainer = document.getElementById("walwoonArea");
  if (monthlyContainer) { monthlyContainer.style.display = "grid"; }
  updateColorClasses();
  updateOriginalPillarMapping(yearSplit, monthSplit, daySplit, hourSplit);
  updateListMapping(globalState.daewoonData.list, "DwW", "Ds", daySplit.gan, yearSplit.ji);
  if (globalState.sewoonList && globalState.sewoonList.length > 0) {
    updateListMapping(globalState.sewoonList, "SwW", "Ss", daySplit.gan, yearSplit.ji);
  }
  if (globalState.monthWoonList && globalState.monthWoonList.length > 0) {
    updateListMapping(globalState.monthWoonList, "MwW", "Ms", daySplit.gan, yearSplit.ji);
  }
  function updateMonthlyData(computedYear) {
    const boundaries = getSolarTermBoundaries(computedYear);
    const dayPillarText = document.getElementById("DtHanguel").innerText;
    const baseDayStem = dayPillarText ? dayPillarText.charAt(0) : "-";
    const cycleStartDate = boundaries[0].date;
    const yearPillar = getYearGanZhi(cycleStartDate, computedYear);
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
      const unseong = getTwelveUnseong(daySplit.gan, monthBranch);
      const shinsal = getTwelveShinsal(yearSplit.ji, monthBranch);
      setText("MC_" + (i + 1), (stemMapping[monthStem] && stemMapping[monthStem].hanja) || "-");
      setText("MJ_" + (i + 1), (branchMapping[monthBranch] && branchMapping[monthBranch].hanja) || "-");
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
    if (!yearPillar) { console.error("updateMonthlyWoon: getYearGanZhi returned undefined"); return; }
    const yearStem = yearPillar.charAt(0);
    const yearStemIndex = Cheongan.indexOf(yearStem);
    const monthNumber = currentMonthIndex + 1;
    const monthStemIndex = (((yearStemIndex * 2) + monthNumber - 1) + 4) % 10;
    const monthStem = Cheongan[monthStemIndex];
    const monthBranch = MONTH_ZHI[monthNumber - 1];
    const tenGodStem = getTenGodForStem(monthStem, baseDayStem);
    const tenGodBranch = getTenGodForBranch(monthBranch, baseDayStem);
    const displayMonth = (monthNumber < 12) ? (monthNumber + 1) + "월" : "1월";
    const unseong = getTwelveUnseong(daySplit.gan, monthBranch);
    const shinsal = getTwelveShinsal(yearSplit.ji, monthBranch);
    setText("WMtHanja", stemMapping[monthStem] ? stemMapping[monthStem].hanja : "-");
    setText("WMtHanguel", stemMapping[monthStem] ? stemMapping[monthStem].hanguel : "-");
    setText("WMtEumyang", stemMapping[monthStem] ? stemMapping[monthStem].eumYang : "-");
    setText("WMt10sin", tenGodStem || "-");
    setText("WMbHanja", branchMapping[monthBranch] ? branchMapping[monthBranch].hanja : "-");
    setText("WMbHanguel", branchMapping[monthBranch] ? branchMapping[monthBranch].hanguel : "-");
    setText("WMbEumyang", branchMapping[monthBranch] ? branchMapping[monthBranch].eumYang : "-");
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
  document.querySelectorAll("#calPrevBtn, #calNextBtn").forEach(function(btn) {
    btn.addEventListener("click", function(event) {
      if (btn.dataset.handled) return;
      btn.dataset.handled = "true";
      setTimeout(() => { delete btn.dataset.handled; }, 0);
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
      setTimeout(function() {
        const liElements = Array.from(document.querySelectorAll("#mowoonList li"));
        if (!liElements.length) return;
        liElements.forEach(li => li.classList.remove("active"));
        const targetIndex = newIndex % liElements.length;
        liElements[targetIndex].classList.add("active");
      }, 0);
    });
  });
  const currentSolarYear = (today < ipChun) ? today.getFullYear() - 1 : today.getFullYear();
  let boundariesArr = getSolarTermBoundaries(currentSolarYear);
  let currentTerm = boundariesArr.find((term, idx) => {
    let next = boundariesArr[idx + 1];
    if (!next) { next = { date: new Date(term.date.getTime() + 30 * 24 * 60 * 60 * 1000) }; }
    return today >= term.date && today < next.date;
  });
  if (!currentTerm) { currentTerm = boundariesArr[0]; }
   function generateDailyFortuneCalendar(solarTermName, startDate, endDate, baseDayStem, currentIndex, boundaries, solarYear) {
      // 이전, 다음 절기 이름은 boundaries 배열에서 현재 index를 기준으로 결정합니다.
      let prevTermName, nextTermName;
      if (currentIndex > 0) {
        prevTermName = boundaries[currentIndex - 1].name;
      } else {
        // 전년도: 해당 연도의 마지막 절기 이름 (전년도 boundaries)
        let prevBoundaries = getSolarTermBoundaries(solarYear - 1);
        if (!Array.isArray(prevBoundaries)) prevBoundaries = Array.from(prevBoundaries);
        prevTermName = prevBoundaries[prevBoundaries.length - 1].name;
      }
      if (currentIndex < boundaries.length - 1) {
        nextTermName = boundaries[currentIndex + 1].name;
      } else {
        // 다음년도: 해당 연도의 첫 절기 이름
        let nextBoundaries = getSolarTermBoundaries(solarYear + 1);
        if (!Array.isArray(nextBoundaries)) nextBoundaries = Array.from(nextBoundaries);
        nextTermName = nextBoundaries[0].name;
      }
      
      // 날짜 정규화: 자정 기준으로 (시간 정보 제거)
      function normalizeDate(dateObj) {
        return new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
      }
      const normStart = normalizeDate(startDate);
      const normEndNext = normalizeDate(endDate);
      // 종료일: 다음 절기의 시작일(정규화된)에서 하루 빼기
      const finalEndDate = new Date(normEndNext.getTime() - 24 * 60 * 60 * 1000);
      
      // 날짜를 "월 일" 형식으로 변환하는 함수
      function formatDate(dateObj) {
        const m = dateObj.getMonth() + 1;
        const d = dateObj.getDate();
        return m + "월 " + d + "일";
      }
      
      const startDateStr = formatDate(normStart);
      const endDateStr = formatDate(finalEndDate);
      
      // headerMonth는 normStart의 월 (숫자)
      const headerMonth = normStart.getMonth() + 1;
      
      let html = '<ul class="calender_title">';
      html += '  <li>';
      html += '    <button class="cal_btn" id="calPrevBtn">';
      html += '      <span class="btn_icon">◀</span>';
      html += '      <span class="jeolgi_prev">' + prevTermName + '</span>';
      html += '    </button>';
      html += '  </li>';
      html += '  <li>';
      html += '    <div class="curr_title"><span>' + solarTermName + ' ' + headerMonth + '월 (' + startDateStr + ' ~ ' + endDateStr + ')</span></div>';
      html += '  </li>';
      html += '  <li>';
      html += '    <button class="cal_btn" id="calNextBtn">';
      html += '      <span class="jeolgi_next">' + nextTermName + '</span>';
      html += '      <span class="btn_icon">▶</span>';
      html += '    </button>';
      html += '  </li>';
      html += '</ul>';
      
      // 달력 테이블 헤더 (일~토) 생성
      html += '<table class="calander_table">';
      html += '  <tr>';
      html += '    <th>일</th>';
      html += '    <th>월</th>';
      html += '    <th>화</th>';
      html += '    <th>수</th>';
      html += '    <th>목</th>';
      html += '    <th>금</th>';
      html += '    <th>토</th>';
      html += '  </tr>';
      
      // 날짜 배열 생성 (normStart ~ finalEndDate + 1일)
      let days = [];
      for (let d = new Date(normStart); d < new Date(normEndNext.getTime()); d.setDate(d.getDate() + 1)) {
        days.push(new Date(d.getTime()));
      }
      
      // 첫 행: 시작일의 요일만큼 빈 td 채우기
      let currentRow = '<tr>';
      const firstDayWeekday = normStart.getDay();
      for (let i = 0; i < firstDayWeekday; i++) {
        currentRow += '<td></td>';
      }
      
      // 각 날짜별 td 생성
      days.forEach(function(date, idx) {
        const originalGanji = getDayGanZhi(date);
		  // 원래 간지의 인덱스 계산
		  const originalIndex = getGanZhiIndex(originalGanji);
		  // 원하는 보정: 인덱스를 +1 (즉, 다음 간지로 이동) 
		  const adjustedIndex = (originalIndex + 1) % 60;
		  // 보정된 간지를 구함 (예: "계유")
		  const ganji = getGanZhiFromIndex(adjustedIndex);
		  const stem = ganji.charAt(0);
		  const branch = ganji.charAt(1);
        const tenGodCheongan = getTenGodForStem(stem, baseDayStem);
        const tenGodJiji = getTenGodForBranch(branch, baseDayStem);
        const twelveUnseong = getTwelveUnseong(baseDayStem, branch);
        const twelveShinsal = getTwelveShinsal(branch, branch);
        
        let dailyHtml = '<ul class="ilwoon">';
        dailyHtml += '  <li class="ilwoonday"><span>' + date.getDate() + '일</span></li>';
        dailyHtml += '  <li class="ilwoon_ganji_cheongan_10sin"><span>' + tenGodCheongan + '</span></li>';
        dailyHtml += '  <li class="ilwoon_ganji_cheongan"><span>' + stem + '</span></li>';
        dailyHtml += '  <li class="ilwoon_ganji_jiji"><span>' + branch + '</span></li>';
        dailyHtml += '  <li class="ilwoon_ganji_jiji_10sin"><span>' + tenGodJiji + '</span></li>';
        dailyHtml += '  <li class="ilwoon_10woonseong"><span>' + twelveUnseong + '</span></li>';
        dailyHtml += '  <li class="ilwoon_10sinsal"><span>' + twelveShinsal + '</span></li>';
        dailyHtml += '</ul>';
        
        const today = new Date();
        let tdClass = "";
        if (
          date.getFullYear() === today.getFullYear() &&
          date.getMonth() === today.getMonth() &&
          date.getDate() === today.getDate()
        ) {
          tdClass = ' class="active"';
        }
        
        currentRow += '<td' + tdClass + '>' + dailyHtml + '</td>';
        
        if ((firstDayWeekday + idx + 1) % 7 === 0) {
          currentRow += '</tr>';
          html += currentRow;
          currentRow = '<tr>';
        }
      });
      
      const totalCells = firstDayWeekday + days.length;
      const remainder = totalCells % 7;
      if (remainder !== 0) {
        for (let i = remainder; i < 7; i++) {
          currentRow += '<td></td>';
        }
        currentRow += '</tr>';
        html += currentRow;
      }
      
      html += '</table>';
      return html;
    }
    
    function updateMonthlyFortuneCalendar(solarTermName, computedYear, newIndexOpt) {
      const today = new Date();
      const solarYear = computedYear || (() => {
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
      
      // 날짜 정규화: 자정 기준 (시,분,초,밀리초 제거)
      function normalizeDate(dateObj) {
        return new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
      }
      const normStart = normalizeDate(currentTerm.date);
      const normNext = normalizeDate(nextTerm.date);
      // 종료일은 normNext에서 하루(24시간)를 빼서 계산
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
      
      // 전역 상태 업데이트 (이후 이벤트 리스너에서 참조)
      globalState.solarYear = solarYear;
      globalState.boundaries = boundaries;
      globalState.currentIndex = currentIndex;
      globalState.computedYear = solarYear;

      const now = new Date();
      const activeMonth = globalState.activeMonth || (now.getMonth() + 1);
      document.querySelectorAll("#mowoonList li").forEach(function(li) {
        const liMonth = parseInt(li.getAttribute("data-index3"), 10);
        if (liMonth === activeMonth) {
          li.classList.add("active");
        } else {
          li.classList.remove("active");
        }
      });
    }
  updateMonthlyFortuneCalendar(currentTerm.name, currentSolarYear);
  document.querySelectorAll("[id^='daewoon_']").forEach(function(daewoonLi) {
    daewoonLi.addEventListener("click", function(event) {
      event.stopPropagation();
      document.getElementById('iljuCalender').style.display = 'none';
      const sewoonBox = document.querySelector(".lucky.sewoon");
      if (sewoonBox) { sewoonBox.style.display = "none"; }
      document.querySelectorAll("#sewoonList li").forEach(li => li.classList.remove("active"));
      const monthlyContainer = document.getElementById("walwoonArea");
      if (monthlyContainer) { monthlyContainer.style.display = "none"; }
      const daewoonIndex = parseInt(this.getAttribute("data-index"), 10);
      if (!globalState.birthYear || !globalState.daewoonData) { alert("먼저 계산 버튼을 눌러 출생 정보를 입력하세요."); return; }
      const selectedDaewoon = globalState.daewoonData.list[daewoonIndex - 1];
      if (!selectedDaewoon) return;
      const daewoonNum = selectedDaewoon.age;
      const sewoonStartYear = globalState.birthYear + (daewoonNum - 1);
      globalState.sewoonStartYear = sewoonStartYear;
      const displayedDayPillar = document.getElementById("DtHanguel").innerText;
      const baseDayStemS = displayedDayPillar ? displayedDayPillar.charAt(0) : "-";
      const sewoonList = [];
      for (let j = 0; j < 10; j++) {
        let sewoonYear = sewoonStartYear + j;
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
      sewoonList.forEach(function(item, index) {
        const idx = index + 1;
        setText("SC_" + idx, (stemMapping[item.gan] && stemMapping[item.gan].hanja) || "-");
        setText("SJ_" + idx, (branchMapping[item.ji] && branchMapping[item.ji].hanja) || "-");
        setText("st10sin" + idx, item.tenGod);
        setText("sb10sin" + idx, item.tenGodJiji);
        setText("SwW" + idx, getTwelveUnseong(daySplit.gan, item.ji) || "-");
        setText("Ss" + idx, getTwelveShinsal(yearSplit.ji, item.ji) || "-");
        setText("Dy" + idx, item.year);
      });
	   function updateDaewoonHTML(selectedDaewoon, baseDayStem) {
      // 대운 천간 업데이트
      setText("DwtHanja", stemMapping[selectedDaewoon.stem] ? stemMapping[selectedDaewoon.stem].hanja : "-");
      setText("DwtHanguel", stemMapping[selectedDaewoon.stem] ? stemMapping[selectedDaewoon.stem].hanguel : "-");
      setText("DwtEumyang", stemMapping[selectedDaewoon.stem] ? stemMapping[selectedDaewoon.stem].eumYang : "-");
      setText("Dwt10sin", getTenGodForStem(selectedDaewoon.stem, baseDayStem));
      
      // 대운 지지 업데이트
      setText("DwbHanja", branchMapping[selectedDaewoon.branch] ? branchMapping[selectedDaewoon.branch].hanja : "-");
      setText("DwbHanguel", branchMapping[selectedDaewoon.branch] ? branchMapping[selectedDaewoon.branch].hanguel : "-");
      setText("DwbEumyang", branchMapping[selectedDaewoon.branch] ? branchMapping[selectedDaewoon.branch].eumYang : "-");
      setText("Dwb10sin", getTenGodForBranch(selectedDaewoon.branch, baseDayStem));
      
      // 대운 지장간 업데이트 (hiddenStemMapping 사용)
      const daewoonHidden = hiddenStemMapping[selectedDaewoon.branch] || ["-", "-", "-"];
      setText("DwJj1", daewoonHidden[0]);
      setText("DwJj2", daewoonHidden[1]);
      setText("DwJj3", daewoonHidden[2]);

      //setText("DwJj1", getTwelveUnseong(daySplit.gan, selectedDaewoon.branch) || "-");
      //setText("DwJj2", getTwelveShinsal(yearSplit.ji, selectedDaewoon.branch) || "-");
    }

    // 세운 데이터를 lucky_box 세운 영역에 업데이트하는 함수
    
      updateDaewoonHTML(selectedDaewoon, baseDayStemS);
      updateColorClasses();
      const computedYear = globalState.sewoonStartYear;
      const boundariesForSewoon = getSolarTermBoundaries(computedYear);
      const targetSolarTerm = boundariesForSewoon[0].name;
      updateMonthlyFortuneCalendar(targetSolarTerm, computedYear);
    });
  });
  document.querySelectorAll("[id^='Sewoon_']").forEach(function(sewoonLi) {
    sewoonLi.addEventListener("click", function(event) {
      event.stopPropagation();
      document.getElementById('iljuCalender').style.display = 'none';
      const sewoonBox = document.querySelector(".lucky.sewoon");
      if (sewoonBox) { sewoonBox.style.display = "grid"; }
      const monthlyContainer = document.getElementById("walwoonArea");
      if (monthlyContainer) { monthlyContainer.style.display = "grid"; }
      const sewoonIndex = parseInt(this.getAttribute("data-index2"), 10);
      if (!globalState.sewoonStartYear) { alert("먼저 대운을 선택하여 세운 시작연도를 계산하세요."); return; }
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
      // 세운 천간 업데이트
      setText("SwtHanja", stemMapping[selectedSewoon.gan] ? stemMapping[selectedSewoon.gan].hanja : "-");
      setText("SwtHanguel", stemMapping[selectedSewoon.gan] ? stemMapping[selectedSewoon.gan].hanguel : "-");
      setText("SwtEumyang", stemMapping[selectedSewoon.gan] ? stemMapping[selectedSewoon.gan].eumYang : "-");
      setText("Swt10sin", getTenGodForStem(selectedSewoon.gan, baseDayStem));
      
      // 세운 지지 업데이트
      setText("SwbHanja", branchMapping[selectedSewoon.ji] ? branchMapping[selectedSewoon.ji].hanja : "-");
      setText("SwbHanguel", branchMapping[selectedSewoon.ji] ? branchMapping[selectedSewoon.ji].hanguel : "-");
      setText("SwbEumyang", branchMapping[selectedSewoon.ji] ? branchMapping[selectedSewoon.ji].eumYang : "-");
      setText("Swb10sin", getTenGodForBranch(selectedSewoon.ji, baseDayStem));
      
      // 세운 지장간 업데이트 (hiddenStemMapping 사용)
      const sewoonHidden = hiddenStemMapping[selectedSewoon.ji] || ["-", "-", "-"];
      setText("SwJj1", sewoonHidden[0]);
      setText("SwJj2", sewoonHidden[1]);
      setText("SwJj3", sewoonHidden[2]);

      setText("SWb12ws", getTwelveUnseong(daySplit.gan, selectedSewoon.ji));
      setText("SWb12ss", getTwelveShinsal(yearSplit.ji, selectedSewoon.ji));

      //setText("SwJj1", getTwelveUnseong(daySplit.gan, selectedSewoon.ji) || "-");
      //setText("SwJj2", getTwelveShinsal(yearSplit.ji, selectedSewoon.ji) || "-");

      setText("WSwtHanja", stemMapping[selectedSewoon.gan] ? stemMapping[selectedSewoon.gan].hanja : "-");
      setText("WSwtHanguel", stemMapping[selectedSewoon.gan] ? stemMapping[selectedSewoon.gan].hanguel : "-");
      setText("WSwtEumyang", stemMapping[selectedSewoon.gan] ? stemMapping[selectedSewoon.gan].eumYang : "-");
      setText("WSwt10sin", getTenGodForStem(selectedSewoon.gan, baseDayStem));
      
      // 세운 지지 업데이트
      setText("WSwbHanja", branchMapping[selectedSewoon.ji] ? branchMapping[selectedSewoon.ji].hanja : "-");
      setText("WSwbHanguel", branchMapping[selectedSewoon.ji] ? branchMapping[selectedSewoon.ji].hanguel : "-");
      setText("WSwbEumyang", branchMapping[selectedSewoon.ji] ? branchMapping[selectedSewoon.ji].eumYang : "-");
      setText("WSwb10sin", getTenGodForBranch(selectedSewoon.ji, baseDayStem));
      
      // 세운 지장간 업데이트 (hiddenStemMapping 사용)
      setText("WSwJj1", sewoonHidden[0]);
      setText("WSwJj2", sewoonHidden[1]);
      setText("WSwJj3", sewoonHidden[2]);

      setText("WSWb12ws", getTwelveUnseong(daySplit.gan, selectedSewoon.ji));
      setText("WSWb12ss", getTwelveShinsal(yearSplit.ji, selectedSewoon.ji));

      updateColorClasses();
    }function updateSewoonHTML(selectedSewoon, baseDayStem) {
      // 세운 천간 업데이트
      setText("SwtHanja", stemMapping[selectedSewoon.gan] ? stemMapping[selectedSewoon.gan].hanja : "-");
      setText("SwtHanguel", stemMapping[selectedSewoon.gan] ? stemMapping[selectedSewoon.gan].hanguel : "-");
      setText("SwtEumyang", stemMapping[selectedSewoon.gan] ? stemMapping[selectedSewoon.gan].eumYang : "-");
      setText("Swt10sin", getTenGodForStem(selectedSewoon.gan, baseDayStem));
      
      // 세운 지지 업데이트
      setText("SwbHanja", branchMapping[selectedSewoon.ji] ? branchMapping[selectedSewoon.ji].hanja : "-");
      setText("SwbHanguel", branchMapping[selectedSewoon.ji] ? branchMapping[selectedSewoon.ji].hanguel : "-");
      setText("SwbEumyang", branchMapping[selectedSewoon.ji] ? branchMapping[selectedSewoon.ji].eumYang : "-");
      setText("Swb10sin", getTenGodForBranch(selectedSewoon.ji, baseDayStem));
      
      // 세운 지장간 업데이트 (hiddenStemMapping 사용)
      const sewoonHidden = hiddenStemMapping[selectedSewoon.ji] || ["-", "-", "-"];
      setText("SwJj1", sewoonHidden[0]);
      setText("SwJj2", sewoonHidden[1]);
      setText("SwJj3", sewoonHidden[2]);

      setText("SWb12ws", getTwelveUnseong(daySplit.gan, selectedSewoon.ji));
      setText("SWb12ss", getTwelveShinsal(yearSplit.ji, selectedSewoon.ji));

      //setText("SwJj1", getTwelveUnseong(daySplit.gan, selectedSewoon.ji) || "-");
      //setText("SwJj2", getTwelveShinsal(yearSplit.ji, selectedSewoon.ji) || "-");

      setText("WSwtHanja", stemMapping[selectedSewoon.gan] ? stemMapping[selectedSewoon.gan].hanja : "-");
      setText("WSwtHanguel", stemMapping[selectedSewoon.gan] ? stemMapping[selectedSewoon.gan].hanguel : "-");
      setText("WSwtEumyang", stemMapping[selectedSewoon.gan] ? stemMapping[selectedSewoon.gan].eumYang : "-");
      setText("WSwt10sin", getTenGodForStem(selectedSewoon.gan, baseDayStem));
      
      // 세운 지지 업데이트
      setText("WSwbHanja", branchMapping[selectedSewoon.ji] ? branchMapping[selectedSewoon.ji].hanja : "-");
      setText("WSwbHanguel", branchMapping[selectedSewoon.ji] ? branchMapping[selectedSewoon.ji].hanguel : "-");
      setText("WSwbEumyang", branchMapping[selectedSewoon.ji] ? branchMapping[selectedSewoon.ji].eumYang : "-");
      setText("WSwb10sin", getTenGodForBranch(selectedSewoon.ji, baseDayStem));
      
      // 세운 지장간 업데이트 (hiddenStemMapping 사용)
      setText("WSwJj1", sewoonHidden[0]);
      setText("WSwJj2", sewoonHidden[1]);
      setText("WSwJj3", sewoonHidden[2]);

      setText("WSWb12ws", getTwelveUnseong(daySplit.gan, selectedSewoon.ji));
      setText("WSWb12ss", getTwelveShinsal(yearSplit.ji, selectedSewoon.ji));

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
      document.querySelectorAll("#mowoonList li").forEach(function(li) { li.classList.remove("active"); });
    });
  });
  document.querySelectorAll("#mowoonList li").forEach(function(li) {
    li.addEventListener("click", function(event) {
      event.stopPropagation();
      document.querySelectorAll("#mowoonList li").forEach(function(item) { item.classList.remove("active"); });
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
  globalState.computedYear = currentSolarYear;
  if (!currentTerm) { currentTerm = boundariesArr[0]; }
  updateMonthlyFortuneCalendar(currentTerm.name, currentSolarYear);
  (function setupMowoonListActive() {
    const displayedMonth = currentTerm.date.getMonth() + 1;
    document.querySelectorAll("#mowoonList li").forEach(function(li) {
      const liMonth = parseInt(li.getAttribute("data-index3"), 10);
      if (liMonth === displayedMonth) { li.classList.add("active"); }
      else { li.classList.remove("active"); }
    });
  })();
  document.getElementById('myowoonMore').addEventListener('click', function(){
    var myowoonMoreElem = document.getElementById('myowoonMore');
    if(myowoonMoreElem.classList.contains("active")) {
      document.getElementById('wongookLM').classList.remove("w100");
      document.getElementById('luckyWrap').style.display = 'block';
      document.getElementById('woonArea').style.display = 'block';
      document.getElementById('woonContainer').style.display = 'none';
      document.getElementById('calArea').style.display = 'none';
      myowoonMoreElem.classList.remove("active");
      myowoonMoreElem.innerText = "묘운력 상세보기";
    } else {
      document.getElementById('wongookLM').classList.add("w100");
      document.getElementById('luckyWrap').style.display = 'none';
      document.getElementById('woonArea').style.display = 'none';
      document.getElementById('woonContainer').style.display = 'block';
      document.getElementById('calArea').style.display = 'block';
      var myounResult = getMyounPillars(birthYearP, birthMonthP, birthDayP, birthHourP, birthDate, refDate, gender);
      var daySplit = splitPillar(dayPillar);
      var yearSplit = splitPillar(yearPillar);
      updateMyowoonSection(myounResult, daySplit, yearSplit);
      myowoonMoreElem.classList.add("active");
      myowoonMoreElem.innerText = "원래 화면으로 가기";
    }
  });
  function myowoonMoreClickHandler() {
    var myowoonMoreElem = document.getElementById('myowoonMore');
    if (myowoonMoreElem.classList.contains("active")) {
      document.getElementById('wongookLM').classList.remove("w100");
      document.getElementById('luckyWrap').style.display = 'block';
      document.getElementById('woonArea').style.display = 'block';
      document.getElementById('woonContainer').style.display = 'none';
      document.getElementById('calArea').style.display = 'none';
      myowoonMoreElem.classList.remove("active");
      myowoonMoreElem.innerText = "묘운력 상세보기";
    } else {
      document.getElementById('wongookLM').classList.add("w100");
      document.getElementById('luckyWrap').style.display = 'none';
      document.getElementById('woonArea').style.display = 'none';
      document.getElementById('woonContainer').style.display = 'flex';
      document.getElementById('calArea').style.display = 'block';
      myowoonMoreElem.classList.add("active");
      myowoonMoreElem.innerText = "원래 화면으로 가기";
    }
  }
  document.getElementById('backBtn').addEventListener('click', function(){
    document.getElementById('resultWrapper').style.display = 'none'; 
    document.getElementById('inputWrap').style.display = 'block';
    var myowoonMoreElem = document.getElementById('myowoonMore');
    if (myowoonMoreElem) {
      myowoonMoreElem.classList.remove("active");
      myowoonMoreElem.innerText = "묘운력 상세보기";
      myowoonMoreElem.replaceWith(myowoonMoreElem.cloneNode(true));
      myowoonMoreElem = document.getElementById('myowoonMore');
      myowoonMoreElem.addEventListener('click', myowoonMoreClickHandler);
    }
    const liElements = Array.from(document.querySelectorAll("#mowoonList li"));
    liElements.forEach(li => li.classList.remove("active"));
    if (liElements.length) { liElements[0].classList.add("active"); }
    globalState.currentIndex = 0;
  });
  document.getElementById('wongookLM').classList.remove("w100");
  document.getElementById('luckyWrap').style.display = 'block';
  document.getElementById('woonArea').style.display = 'block';
  document.getElementById('woonContainer').style.display = 'none';
  document.getElementById('calArea').style.display = 'none';
  var myowoonToggle = false;
  document.getElementById('myowoonMore').addEventListener('click', function(){
    myowoonToggle = !myowoonToggle;
    if(myowoonToggle) {
      document.getElementById('wongookLM').classList.add("w100");
      document.getElementById('luckyWrap').style.display = 'none';
      document.getElementById('woonArea').style.display = 'none';
      document.getElementById('woonContainer').style.display = 'flex';
      document.getElementById('calArea').style.display = 'block';
      var myounResult = getMyounPillars(birthYearP, birthMonthP, birthDayP, birthHourP, birthDate, refDate, gender);
      var daySplit = splitPillar(dayPillar);
      var yearSplit = splitPillar(yearPillar);
      updateMyowoonSection(myounResult, daySplit, yearSplit);
      this.innerText = "원래 화면으로 돌아가기";
    } else {
      document.getElementById('wongookLM').classList.remove("w100");
      document.getElementById('luckyWrap').style.display = 'block';
      document.getElementById('woonArea').style.display = 'block';
      document.getElementById('woonContainer').style.display = 'none';
      document.getElementById('calArea').style.display = 'none';
      this.innerText = "묘운력 상세보기";
    }
  });
  function updateDayWoon(refDate) {
    if (!(refDate instanceof Date) || isNaN(refDate.getTime())) { refDate = new Date(); }
    const jasiElem = document.getElementById("jojasi");
    const yajasiElem = document.getElementById("yajasi");
    const insiElem  = document.getElementById("insi");
    let adjustedDate = new Date(refDate.getTime());
    if (jasiElem && jasiElem.checked) {
      adjustedDate = new Date(adjustedDate.getFullYear(), adjustedDate.getMonth(), adjustedDate.getDate(), 0, 0);
    } else if (yajasiElem && yajasiElem.checked) {
      adjustedDate = new Date(adjustedDate.getFullYear(), adjustedDate.getMonth(), adjustedDate.getDate() - 1, 23, 30);
    } else if (insiElem && insiElem.checked) {
      adjustedDate = new Date(adjustedDate.getFullYear(), adjustedDate.getMonth(), adjustedDate.getDate(), 3, 30);
    } else {
      adjustedDate = new Date(adjustedDate.getFullYear(), adjustedDate.getMonth(), adjustedDate.getDate(), 3, 30);
    }
    console.log("Adjusted Date for Day GanZhi:", adjustedDate);
    const dayGanZhi = getDayGanZhi(adjustedDate);
    const daySplit = splitPillar(dayGanZhi);
    console.log("Calculated Day GanZhi:", dayGanZhi, "->", daySplit);
    const baseDayStem = daySplit.gan;
    setText("WDtHanja", stemMapping[daySplit.gan] ? stemMapping[daySplit.gan].hanja : "-");
    setText("WDtHanguel", stemMapping[daySplit.gan] ? stemMapping[daySplit.gan].hanguel : "-");
    setText("WDtEumyang", stemMapping[daySplit.gan] ? stemMapping[daySplit.gan].eumYang : "-");
    setText("WDt10sin", getTenGodForStem(daySplit.gan, baseDayStem) || "-");
    setText("WDbHanja", branchMapping[daySplit.ji] ? branchMapping[daySplit.ji].hanja : "-");
    setText("WDbHanguel", branchMapping[daySplit.ji] ? branchMapping[daySplit.ji].hanguel : "-");
    setText("WDbEumyang", branchMapping[daySplit.ji] ? branchMapping[daySplit.ji].eumYang : "-");
    setText("WDb10sin", getTenGodForBranch(daySplit.ji, baseDayStem) || "-");
    updateHiddenStems(daySplit.ji, "WDb");
    setText("WDb12ws", getTwelveUnseong(daySplit.gan, daySplit.ji) || "-");
    setText("WDb12ss", getTwelveShinsal(yearSplit.ji, daySplit.ji) || "-");
    updateColorClasses();
  }
  updateDayWoon(refDate);
  function getHourBranchUsingArray(dateObj) {
    let totalMinutes = dateObj.getHours() * 60 + dateObj.getMinutes();
    const timeRanges = [
      { branch: '자', hanja: '子', start: 23 * 60 + 30, end: 1 * 60 + 30 },
      { branch: '축', hanja: '丑', start: 1 * 60 + 30,  end: 3 * 60 + 30 },
      { branch: '인', hanja: '寅', start: 3 * 60 + 30,  end: 5 * 60 + 30 },
      { branch: '묘', hanja: '卯', start: 5 * 60 + 30,  end: 7 * 60 + 30 },
      { branch: '진', hanja: '辰', start: 7 * 60 + 30,  end: 9 * 60 + 30 },
      { branch: '사', hanja: '巳', start: 9 * 60 + 30,  end: 11 * 60 + 30 },
      { branch: '오', hanja: '午', start: 11 * 60 + 30, end: 13 * 60 + 30 },
      { branch: '미', hanja: '未', start: 13 * 60 + 30, end: 15 * 60 + 30 },
      { branch: '신', hanja: '申', start: 15 * 60 + 30, end: 17 * 60 + 30 },
      { branch: '유', hanja: '酉', start: 17 * 60 + 30, end: 19 * 60 + 30 },
      { branch: '술', hanja: '戌', start: 19 * 60 + 30, end: 21 * 60 + 30 },
      { branch: '해', hanja: '亥', start: 21 * 60 + 30, end: 23 * 60 + 30 }
    ];
    for (let i = 0; i < timeRanges.length; i++) {
      let { branch, start, end } = timeRanges[i];
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
    let hourBranch = getHourBranchUsingArray(refDate);
    let hourBranchIndex = Jiji.indexOf(hourBranch);
    let daySplit = window.daySplit;
    if (!daySplit) { daySplit = splitPillar(getDayGanZhi(refDate)); }
    let hourStem = getHourStem(daySplit.gan, hourBranchIndex);
    setText("WTtHanja", stemMapping[hourStem] ? stemMapping[hourStem].hanja : "-");
    setText("WTtHanguel", stemMapping[hourStem] ? stemMapping[hourStem].hanguel : "-");
    setText("WTtEumyang", stemMapping[hourStem] ? stemMapping[hourStem].eumYang : "-");
    setText("WTt10sin", getTenGodForStem(hourStem, daySplit.gan) || "-");
    setText("WTbHanja", branchMapping[hourBranch] ? branchMapping[hourBranch].hanja : "-");
    setText("WTbHanguel", branchMapping[hourBranch] ? branchMapping[hourBranch].hanguel : "-");
    setText("WTbEumyang", branchMapping[hourBranch] ? branchMapping[hourBranch].eumYang : "-");
    setText("WTb10sin", getTenGodForBranch(hourBranch, daySplit.gan) || "-");
    updateHiddenStems(hourBranch, "WTb");
    setText("WTb12ws", getTwelveUnseong(daySplit.gan, hourBranch) || "-");
    setText("WTb12ss", getTwelveShinsal(yearSplit.ji, hourBranch) || "-");
    updateColorClasses();
  }
  updateHourWoon(refDate);
  document.getElementById("woonChangeBtn").addEventListener("click", function() {
    const picker = document.getElementById("woonTimeSetPicker");
    let refDate = (picker && picker.value) ? new Date(picker.value) : new Date();
    var myounResult = getMyounPillars(birthYearP, birthMonthP, birthDayP, birthHourP, birthDate, refDate, gender);
    updateMyowoonSection(myounResult, daySplit, yearSplit);
    updateCurrentSewoon(refDate);
    updateMonthlyWoonByToday(refDate);
    updateDayWoon(refDate);
    updateHourWoon(refDate);
  });

  // ====================묘운================//
	//─────────────────────────────
	// [0] (위 Section 1에 이미 포함된 보정, 천문/역법, 절기 계산, 간지 상수 등은 전역 상수/함수로 정의됨)
	//─────────────────────────────

	// 추가 기능 함수들

	// 헬퍼 함수: 날짜에 n일 더하기
	function addDays(dateObj, n) {
	  const d = new Date(dateObj.getTime());
	  d.setDate(d.getDate() + n);
	  return d;
	}

	// 헬퍼 함수: 년도에 n년 더하기
	function addYears(dateObj, n) {
	  const d = new Date(dateObj.getTime());
	  d.setFullYear(d.getFullYear() + n);
	  return d;
	}

	// 헬퍼 함수: 두 날짜 사이의 일수 차이
	function diffInDays(d1, d2) {
	  const msDiff = d2.getTime() - d1.getTime();
	  return Math.floor(msDiff / (1000 * 60 * 60 * 24));
	}

	// 헬퍼 함수: 윤년 여부 판별
	function isLeapYear(year) {
	  return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
	}

	// 간지 변환: 4글자 일주 → 2글자
	function convertToTwoLetter(pillar) {
	  if (pillar && pillar.length >= 3) {
		return pillar.charAt(0) + pillar.charAt(2);
	  }
	  return pillar;
	}

	// 이미 정의된 getGanZhiIndex, getGanZhiFromIndex (위 Section 1) 재사용

	// --- 묘운력 계산 ---
	// birthYear, birthMonth, birthDay, birthHour, birthMinute, birthPlace 등은
	// 기존 코드에서 얻은 값(원국 계산 시 사용). 여기서는 이미 “원국의 연주‧월주‧일주‧시주”가 있다고 가정
	// (예: yearPillar='병자', monthPillar='경자', dayPillar='경자', hourPillar='갑신' 등)

	// 아래 함수: '묘운력'용으로 대운팔자를 재계산하는 예시
	function getMyounPillars(
	  birthYearPillar,   // 예: "병자"
	  birthMonthPillar, // 예: "경자"  (원래 월주)
	  birthDayPillar,   // 예: "경자"  (원래 일주)
	  birthHourPillar,  // 예: "갑신"  (원래 시주)
	  birthDateObj,     // 출생시각 Date 객체
	  referenceDateObj, // 기준일 Date 객체 (예: 2025-03-08 00:00)
	  gender            // '남' 또는 '여'
	) {
	  //------------------------
	  // [A] 연주(year pillar)
	  //------------------------
	  // 1) 출생 ~ 1년: 그대로
	  // 2) 1년 이후 ~ 61세 전: 그대로
	  // 3) 61세 이후: 60년씩 순행/역행 (사용자 규칙)
	  let finalYearPillar = birthYearPillar;
	  const ageOnRef = getAgeByDate(birthDateObj, referenceDateObj);

	  // 출생 후 1년 시점
	  const firstBirthday = new Date(birthDateObj);
	  firstBirthday.setFullYear(firstBirthday.getFullYear() + 1);

	  if (referenceDateObj < firstBirthday) {
		// (1) 출생 ~ 1년: 그대로
		finalYearPillar = birthYearPillar;
	  } else if (ageOnRef < 61) {
		// (2) 1년 이후 ~ 61세 전: 그대로
		finalYearPillar = birthYearPillar;
	  } else {
		// (3) 61세 이후: 출생연주에서 '1칸' 순행 or 역행
		const originalIndex = getGanZhiIndex(birthYearPillar);
		const correctedDate = adjustBirthDate(birthDate, birthPlace);
		const originalYearPillar = getYearGanZhi(correctedDate, year); // 이미 계산된 연주 문자열 예: "병자"
		if (originalIndex >= 0) {
		  // 양간 & 남자, 음간 & 여자 → 순행(+1), 그 외 역행(-1)
		  const isYangStem = ["갑","병","무","경","임"].includes(originalYearPillar[0]);
		  const direction = ((gender === "남" && isYangStem) || (gender === "여" && !isYangStem))
							? 1 : -1;
		  const newIndex = originalIndex + direction;
		  finalYearPillar = getGanZhiFromIndex(newIndex);
		}
	  }

		/**
	   * 특정 기준일(referenceDate) 시점의 "현재 대운(月柱)" 간지를 반환
	   *   - 예: "정유", "을해" 등
	   */
	  function getCurrentDaewoonMonthPillar(birthY, birthM, birthD, birthPlace, gender, referenceDate) {
		const birthDate = new Date(birthY, birthM - 1, birthD);
		const currAge = getAgeByDate(birthDate, referenceDate);
		const daewoonData = getDaewoonData(birthY, birthM, birthD, birthPlace, gender); 
		let currentItem = daewoonData.list[0];
		for (let i = 1; i < daewoonData.list.length; i++) {
		  if (daewoonData.list[i].age <= currAge) {
			currentItem = daewoonData.list[i]; 
		  }
		}
		return currentItem.stem + currentItem.branch;
	  }


	  function getAgeByDate(birthDate, refDate) {
		let age = refDate.getFullYear() - birthDate.getFullYear();
		const m = refDate.getMonth() - birthDate.getMonth();
		if (m < 0 || (m === 0 && refDate.getDate() < birthDate.getDate())) {
		  age--;
		}
		return age;
	  }

	//------------------------
	// [B] 월주(month pillar)
	//------------------------

		let finalMonthPillar = birthMonthPillar; 
		finalMonthPillar = getCurrentDaewoonMonthPillar(
		  birthDateObj.getFullYear(),
		  birthDateObj.getMonth() + 1,
		  birthDateObj.getDate(),
		  birthPlace,
		  gender,
		  referenceDateObj
		);


	  function convertToTwoLetter(pillar) {
		if (pillar && pillar.length >= 3) {
		  return pillar.charAt(0) + pillar.charAt(2);
		}
		return pillar;
	  }


	  function addYears(dateObj, n) {
		const d = new Date(dateObj.getTime());
		d.setFullYear(d.getFullYear() + n);
		return d;
	  }

	  function getGanZhiIndex(gz) {
		return sexagenaryCycle.indexOf(gz);
	  }
	  function getGanZhiFromIndex(i) {
		const mod = ((i % 60) + 60) % 60;
		return sexagenaryCycle[mod];
	  }


	function addDays(dateObj, n) {
	  const d = new Date(dateObj.getTime());
	  d.setDate(d.getDate() + n);
	  return d;
	}


	function addYears(dateObj, n) {
	  const d = new Date(dateObj.getTime());
	  d.setFullYear(d.getFullYear() + n);
	  return d;
	}

	function diffInDays(d1, d2) {
	  const msDiff = d2.getTime() - d1.getTime();
	  return Math.floor(msDiff / (1000 * 60 * 60 * 24));
	}

	function isLeapYear(year) {
	  return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
	}

	function getGanZhiIndex(gz) {
	  return sexagenaryCycle.indexOf(gz);
	}
	function getGanZhiFromIndex(i) {
	  const mod = ((i % 60) + 60) % 60;
	  return sexagenaryCycle[mod];
	}

	function convertToTwoLetter(pillar) {
	  if (pillar && pillar.length >= 3) {
		return pillar.charAt(0) + pillar.charAt(2);
	  }
	  return pillar;
	}

	// --- 묘운 일주(일간) 계산 ---
	let originalDayPillar = convertToTwoLetter(birthDayPillar); 
	let finalDayPillar = originalDayPillar;

	// 전체 일수 (출생일 포함)
	const diffMs_day = referenceDateObj.getTime() - birthDateObj.getTime();
	const diffDays = Math.floor(diffMs_day / (1000 * 60 * 60 * 24)) + 1; 


	const rawSteps = Math.floor(diffDays / 120);

	const steps_day = rawSteps - 60;

	const originalYearPillar = "병자"; 
	const isYangStem = ["갑","병","무","경","임"].includes(originalYearPillar.charAt(0));

	const direction_day = ((gender === "남" && isYangStem) || (gender === "여" && !isYangStem)) ? +1 : -1;

	const baseIndex_day = getGanZhiIndex(originalDayPillar);


	const newIndex_day = baseIndex_day + direction_day * steps_day;
	finalDayPillar = getGanZhiFromIndex(newIndex_day);

	console.log("최종 묘운 일주(일간):", finalDayPillar);

	// 묘운 시주
	const firstYearDays = isLeapYear(birthDateObj.getFullYear()) ? 366 : 365;

	  const remainingDays = diffDays - firstYearDays;
	  const subtracted = Math.floor(remainingDays / 600) * 600;
	  const rem = remainingDays - subtracted;
	  
	  // 10일마다 한 단계 이동
	  const steps_hour = Math.floor(rem / 10);
	  
	  const _firstBirthday = addYears(birthDateObj, 1);
	  const lastChangeDate = addDays(_firstBirthday, subtracted + steps_hour * 10);
	  
	  // 원국 시주의 인덱스
	  const baseIndex_hour = getGanZhiIndex(birthHourPillar);
	  
	  const isYangStem_hour = ["갑","병","무","경","임"].includes(originalYearPillar.charAt(0));
	  const direction_hour = ((gender === "남" && isYangStem_hour) || (gender === "여" && !isYangStem_hour)) ? +1 : -1;
	  
	  // 기존 코드에 +1 보정
	  const newIndex_hour = baseIndex_hour + direction_hour * steps_hour + 1;

	  
	  const finalHourPillar = getGanZhiFromIndex(newIndex_hour);
	  console.log("최종 묘운 시주:", finalHourPillar);



	  return {
		yearPillar:  finalYearPillar,   
		monthPillar: finalMonthPillar, 
		dayPillar:   finalDayPillar,
		hourPillar:  finalHourPillar
	  };

	  }

	// (4) day 차이 계산 (소수점 없이 일수)
	  function diffInDays(d1, d2) {
		let start = d1 < d2 ? d1 : d2;
		let end   = d1 < d2 ? d2 : d1;
		const msDiff = end.getTime() - start.getTime();
		const dayDiff = Math.floor(msDiff / (1000*60*60*24));
		return (d1<=d2) ? dayDiff : -dayDiff;
	  }

	  // 연주: 천간은 YtHanguel, 지지는 YbHanguel
	  const yearStemElem = document.getElementById("YtHanguel");
	  const yearBranchElem = document.getElementById("YbHanguel");
	  const birthYearP = 
		yearStemElem.innerText.trim().charAt(0) + 
		yearBranchElem.innerText.trim().charAt(0);

	  // 월주: 천간은 MtHanguel, 지지는 MbHanguel
	  const monthStemElem = document.getElementById("MtHanguel");
	  const monthBranchElem = document.getElementById("MbHanguel");
	  const birthMonthP = 
		monthStemElem.innerText.trim().charAt(0) + 
		monthBranchElem.innerText.trim().charAt(0);

	  // 일주: 천간은 DtHanguel, 지지는 DbHanguel
	  const dayStemElem = document.getElementById("DtHanguel");
	  const dayBranchElem = document.getElementById("DbHanguel");
	  const birthDayP = 
		dayStemElem.innerText.trim().charAt(0) + 
		dayBranchElem.innerText.trim().charAt(0);

	  // 시주: 천간은 HtHanguel, 지지는 HbHanguel
	  const hourStemElem = document.getElementById("HtHanguel");
	  const hourBranchElem = document.getElementById("HbHanguel");
	  const birthHourP = 
		hourStemElem.innerText.trim().charAt(0) + 
		hourBranchElem.innerText.trim().charAt(0);

	  // 묘운력 결과 계산
	 // 전역 변수에 저장된 출생정보 활용
	  const birthYear    = year;
	  const birthMonth   = month;
	  const birthDay     = day;
	  const _birthPlace  = birthPlace;
	  const _gender      = gender;
	  
	  // 현재 나이 계산 (생일 기준)
	  const birthDate = new Date(birthYear, birthMonth - 1, birthDay);
	  if (
		today.getMonth() < birthDate.getMonth() ||
		(today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
	  ) {
		currentAge--;
	  }

	  const result = getMyounPillars(
		birthYearP, birthMonthP, birthDayP, birthHourP,
		birthDate, refDate,
		gender
	  );

	  function updateMyowoonSection(myounResult, daySplit, yearSplit) {
		// 헬퍼 함수: 지정된 id의 요소에 innerText 설정
		function setText(id, text) {
		  const elem = document.getElementById(id);
		  if (elem) elem.innerText = text;
		}

		// 헬퍼 함수: 한자 요소에 색상 클래스를 추가 (colorMapping 전역 객체가 정의되어 있어야 함)
		function applyColor(id, key) {
		  const elem = document.getElementById(id);
		  if (elem && colorMapping && colorMapping[key]) {
			// 기존 클래스 제거 (선택 사항)
			elem.classList.remove("b_green", "b_red", "b_yellow", "b_white", "b_black",
								  "green", "red", "yellow", "white", "black");
			//elem.classList.add(colorMapping[key].bgColor);
			elem.classList.add(colorMapping[key].textColor);
		  }
		}
		
		// --- [1] 연간 업데이트 (MyoYt*, MyoYb*) ---
		// 연주 천간: myounResult.yearPillar의 첫 글자 → 예: "병"
		const yearStem = myounResult.yearPillar.charAt(0);
		// 연주 지지: myounResult.yearPillar의 두번째 글자 → 예: "자"
		const yearBranch = myounResult.yearPillar.charAt(1);

		console.log(yearStem, yearBranch);
		
		// 천간 한자, 한글(예: "병목")
		setText("MyoYtHanja", stemMapping[yearStem] ? stemMapping[yearStem].hanja : yearStem);
		applyColor("MyoYtHanja", stemMapping[yearStem] ? stemMapping[yearStem].hanja : yearStem);
		setText("MyoYtHanguel", stemMapping[yearStem] ? stemMapping[yearStem].hanguel : yearStem);
		setText("MyoYtEumyang", stemMapping[yearStem] ? stemMapping[yearStem].eumYang : "-");
		setText("MyoYt10sin", getTenGodForStem(yearStem, daySplit.gan));
		
		// 연주 지지 한자, 한글 (예: "자수")
		setText("MyoYbHanja", branchMapping[yearBranch] ? branchMapping[yearBranch].hanja : yearBranch);
		applyColor("MyoYbHanja", branchMapping[yearBranch] ? branchMapping[yearBranch].hanja : yearBranch);
		setText("MyoYbHanguel", branchMapping[yearBranch] ? branchMapping[yearBranch].hanguel : yearBranch);
		setText("MyoYbEumyang", branchMapping[yearBranch] ? branchMapping[yearBranch].eumYang : "-");
		setText("MyoYb10sin", getTenGodForBranch(yearBranch, daySplit.gan));
		
		// 연지 지장간
		const hiddenYear = hiddenStemMapping[yearBranch] || ["-", "-", "-"];
		setText("MyoYbJj1", hiddenYear[0]);
		setText("MyoYbJj2", hiddenYear[1]);
		setText("MyoYbJj3", hiddenYear[2]);
		// 연지 운성
		setText("MyoYb12ws", getTwelveUnseong(daySplit.gan, yearBranch));
		setText("MyoYb12ss", getTwelveShinsal(yearSplit.ji, yearBranch));
		
		// --- [2] 월간 업데이트 (MyoMt*, MyoMb*) ---
		const monthStem = myounResult.monthPillar.charAt(0);
		const monthBranch = myounResult.monthPillar.charAt(1);
		
		setText("MyoMtHanja", stemMapping[monthStem] ? stemMapping[monthStem].hanja : monthStem);
		applyColor("MyoMtHanja", stemMapping[monthStem] ? stemMapping[monthStem].hanja : monthStem);
		setText("MyoMtHanguel", stemMapping[monthStem] ? stemMapping[monthStem].hanguel : monthStem);
		setText("MyoMtEumyang", stemMapping[monthStem] ? stemMapping[monthStem].eumYang : "-");
		setText("MyoMt10sin", getTenGodForStem(monthStem, daySplit.gan));
		
		setText("MyoMbHanja", branchMapping[monthBranch] ? branchMapping[monthBranch].hanja : monthBranch);
		applyColor("MyoMbHanja", branchMapping[monthBranch] ? branchMapping[monthBranch].hanja : monthBranch);
		setText("MyoMbHanguel", branchMapping[monthBranch] ? branchMapping[monthBranch].hanguel : monthBranch);
		setText("MyoMbEumyang", branchMapping[monthBranch] ? branchMapping[monthBranch].eumYang : "-");
		setText("MyoMb10sin", getTenGodForBranch(monthBranch, daySplit.gan));
		
		const hiddenMonth = hiddenStemMapping[monthBranch] || ["-", "-", "-"];
		setText("MyoMbJj1", hiddenMonth[0]);
		setText("MyoMbJj2", hiddenMonth[1]);
		setText("MyoMbJj3", hiddenMonth[2]);
		
		setText("MyoMb12ws", getTwelveUnseong(daySplit.gan, monthBranch));
		setText("MyoMb12ss", getTwelveShinsal(yearSplit.ji, monthBranch));
		
		// --- [3] 일간 업데이트 (MyoDt*, MyoDb*) ---
		const dayStem = myounResult.dayPillar.charAt(0);
		const dayBranch = myounResult.dayPillar.charAt(1);
		
		setText("MyoDtHanja", stemMapping[dayStem] ? stemMapping[dayStem].hanja : dayStem);
		applyColor("MyoDtHanja", stemMapping[dayStem] ? stemMapping[dayStem].hanja : dayStem);
		setText("MyoDtHanguel", stemMapping[dayStem] ? stemMapping[dayStem].hanguel : dayStem);
		setText("MyoDtEumyang", stemMapping[dayStem] ? stemMapping[dayStem].eumYang : "-");
		setText("MyoDt10sin", getTenGodForStem(dayStem, daySplit.gan));
		
		setText("MyoDbHanja", branchMapping[dayBranch] ? branchMapping[dayBranch].hanja : dayBranch);
		applyColor("MyoDbHanja", branchMapping[dayBranch] ? branchMapping[dayBranch].hanja : dayBranch);
		setText("MyoDbHanguel", branchMapping[dayBranch] ? branchMapping[dayBranch].hanguel : dayBranch);
		setText("MyoDbEumyang", branchMapping[dayBranch] ? branchMapping[dayBranch].eumYang : "-");
		setText("MyoDb10sin", getTenGodForBranch(dayBranch, daySplit.gan));
		
		const hiddenDay = hiddenStemMapping[dayBranch] || ["-", "-", "-"];
		setText("MyoDbJj1", hiddenDay[0]);
		setText("MyoDbJj2", hiddenDay[1]);
		setText("MyoDbJj3", hiddenDay[2]);
		
		setText("MyoDb12ws", getTwelveUnseong(daySplit.gan, dayBranch));
		setText("MyoDb12ss", getTwelveShinsal(yearSplit.ji, dayBranch));
		
		// --- [4] 시주 업데이트 (MyoHt*, MyoHb*) ---
		const hourStem = myounResult.hourPillar.charAt(0);
		const hourBranch = myounResult.hourPillar.charAt(1);
		
		setText("MyoHtHanja", stemMapping[hourStem] ? stemMapping[hourStem].hanja : hourStem);
		applyColor("MyoHtHanja", stemMapping[hourStem] ? stemMapping[hourStem].hanja : hourStem);
		setText("MyoHtHanguel", stemMapping[hourStem] ? stemMapping[hourStem].hanguel : hourStem);
		setText("MyoHtEumyang", stemMapping[hourStem] ? stemMapping[hourStem].eumYang : "-");
		setText("MyoHt10sin", getTenGodForStem(hourStem, daySplit.gan));
		
		setText("MyoHbHanja", branchMapping[hourBranch] ? branchMapping[hourBranch].hanja : hourBranch);
		applyColor("MyoHbHanja", branchMapping[hourBranch] ? branchMapping[hourBranch].hanja : hourBranch);
		setText("MyoHbHanguel", branchMapping[hourBranch] ? branchMapping[hourBranch].hanguel : hourBranch);
		setText("MyoHbEumyang", branchMapping[hourBranch] ? branchMapping[hourBranch].eumYang : "-");
		setText("MyoHb10sin", getTenGodForBranch(hourBranch, daySplit.gan));
		
		const hiddenHour = hiddenStemMapping[hourBranch] || ["-", "-", "-"];
		setText("MyoHbJj1", hiddenHour[0]);
		setText("MyoHbJj2", hiddenHour[1]);
		setText("MyoHbJj3", hiddenHour[2]);
		
		setText("MyoHb12ws", getTwelveUnseong(daySplit.gan, hourBranch));
		setText("MyoHb12ss", getTwelveShinsal(yearSplit.ji, hourBranch));
	  }
	  
	  var myounResult = getMyounPillars(birthYearP, birthMonthP, birthDayP, birthHourP, birthDate, refDate, gender);
	  updateMyowoonSection(myounResult, daySplit, yearSplit);

	  document.getElementById('myowoonMore').addEventListener('click', function(){
		myowoonToggle = !myowoonToggle;  // 상태 토글
		if(myowoonToggle) {
		  // 묘운 상세보기 화면으로 전환
		  document.getElementById('wongookLM').classList.add("w100");
		  document.getElementById('luckyWrap').style.display = 'none';
		  document.getElementById('woonArea').style.display = 'none';
		  document.getElementById('woonContainer').style.display = 'flex';
		  document.getElementById('calArea').style.display = 'block';
		  
		  // 사주원국 및 묘운 계산 결과를 받아와 업데이트
		  var myounResult = getMyounPillars(birthYearP, birthMonthP, birthDayP, birthHourP, birthDate, refDate, gender);
		  var daySplit = splitPillar(dayPillar);
		  var yearSplit = splitPillar(yearPillar);
		  updateMyowoonSection(myounResult, daySplit, yearSplit);
		  
		  // 버튼 텍스트 업데이트
		  this.innerText = "원래 화면으로 돌아가기";
		} else {
		  // 원래 화면으로 전환
		  document.getElementById('wongookLM').classList.remove("w100");
		  document.getElementById('luckyWrap').style.display = 'block';
		  document.getElementById('woonArea').style.display = 'block';
		  document.getElementById('woonContainer').style.display = 'none';
		  document.getElementById('calArea').style.display = 'none';
		  
		  // 버튼 텍스트 업데이트
		  this.innerText = "묘운력 상세보기";
		}
	  });

	  function myowoonMoreClickHandler() {
		var myowoonMoreElem = document.getElementById('myowoonMore');
		if (myowoonMoreElem.classList.contains("active")) {
		  // active 상태: 상세보기 화면에서 원래 화면으로 돌아가기
		  document.getElementById('wongookLM').classList.remove("w100");
		  document.getElementById('luckyWrap').style.display = 'block';
		  document.getElementById('woonArea').style.display = 'block';
		  document.getElementById('woonContainer').style.display = 'none';
		  document.getElementById('calArea').style.display = 'none';
		  myowoonMoreElem.classList.remove("active");
		  myowoonMoreElem.innerText = "묘운력 상세보기";
		} else {
		  // active 상태가 아니면: 원래 화면에서 상세보기 화면으로 전환
		  document.getElementById('wongookLM').classList.add("w100");
		  document.getElementById('luckyWrap').style.display = 'none';
		  document.getElementById('woonArea').style.display = 'none';
		  document.getElementById('woonContainer').style.display = 'flex';
		  document.getElementById('calArea').style.display = 'block';
		  
		  myowoonMoreElem.classList.add("active");
		  myowoonMoreElem.innerText = "원래 화면으로 가기";
		}
	  }
	  
	  document.getElementById('backBtn').addEventListener('click', function(){
		document.getElementById('resultWrapper').style.display = 'none'; 
		document.getElementById('inputWrap').style.display = 'block';
		// myowoonMore 버튼 상태 초기화
		var myowoonMoreElem = document.getElementById('myowoonMore');
		if (myowoonMoreElem) {
		  myowoonMoreElem.classList.remove("active");
		  myowoonMoreElem.innerText = "묘운력 상세보기";
		  // 기존 이벤트 리스너가 제거되었을 수 있으니, 재부착
		  myowoonMoreElem.replaceWith(myowoonMoreElem.cloneNode(true));
		  myowoonMoreElem = document.getElementById('myowoonMore');
		  myowoonMoreElem.addEventListener('click', myowoonMoreClickHandler);
		}

		// #mowoonList li active 초기화: 첫 번째 li에 active 추가
		const liElements = Array.from(document.querySelectorAll("#mowoonList li"));
		liElements.forEach(li => li.classList.remove("active"));
		if (liElements.length) {
		  liElements[0].classList.add("active");
		}
		globalState.currentIndex = 0;
	  });

	  document.getElementById('wongookLM').classList.remove("w100");
	  document.getElementById('luckyWrap').style.display = 'block';
	  document.getElementById('woonArea').style.display = 'block';
	  document.getElementById('woonContainer').style.display = 'none';
	  document.getElementById('calArea').style.display = 'none';
	  
	  // 전역 상태 변수: false면 원래 화면, true면 묘운 상세보기 화면
	  var myowoonToggle = false;

	  document.getElementById('myowoonMore').addEventListener('click', function(){
		myowoonToggle = !myowoonToggle;  // 상태 토글
		if(myowoonToggle) {
		  // 묘운 상세보기 화면으로 전환
		  document.getElementById('wongookLM').classList.add("w100");
		  document.getElementById('luckyWrap').style.display = 'none';
		  document.getElementById('woonArea').style.display = 'none';
		  document.getElementById('woonContainer').style.display = 'flex';
		  document.getElementById('calArea').style.display = 'block';
		  
		  // 사주원국 및 묘운 계산 결과를 받아와 업데이트
		  let myounResult = getMyounPillars(birthYearP, birthMonthP, birthDayP, birthHourP, birthDate, refDate, gender);
		  let daySplit = splitPillar(dayPillar);
		  let yearSplit = splitPillar(yearPillar);
		  console.log(yearSplit);
		  updateMyowoonSection(myounResult, daySplit, yearSplit);
		  
		  // 버튼 텍스트 업데이트
		  this.innerText = "원래 화면으로 돌아가기";
		} else {
		  // 원래 화면으로 전환
		  document.getElementById('wongookLM').classList.remove("w100");
		  document.getElementById('luckyWrap').style.display = 'block';
		  document.getElementById('woonArea').style.display = 'block';
		  document.getElementById('woonContainer').style.display = 'none';
		  document.getElementById('calArea').style.display = 'none';
		  
		  // 버튼 텍스트 업데이트
		  this.innerText = "묘운력 상세보기";
		}
	  });

	  function updateDayWoon(refDate) {
		// 1. 기준 날짜: 예시로 오늘 날짜를 사용 (실제 사용시 출생일 또는 계산 대상 날짜로 변경)
		if (!(refDate instanceof Date) || isNaN(refDate.getTime())) {
		  //console.warn("updateDayWoon: Invalid refDate, using new Date()");
		  refDate = new Date();
		}
	  
		// 2. 라디오 버튼 요소 가져오기 (각각 id="jojasi", "yajasi", "insi" 로 가정)
		const jasiElem = document.getElementById("jojasi");
		const yajasiElem = document.getElementById("yajasi");
		const insiElem  = document.getElementById("insi");
	  
		// 3. 선택된 시각 모드에 따라 기준 시간 조정
		let adjustedDate = new Date(refDate.getTime());
		if (jasiElem && jasiElem.checked) {
		  // 조자시: 기준 0:00 -> 당일 0시 (즉, 일주가 그날 0시부터 시작)
		  adjustedDate = new Date(adjustedDate.getFullYear(), adjustedDate.getMonth(), adjustedDate.getDate(), 0, 0);
		} else if (yajasiElem && yajasiElem.checked) {
		  // 야자시: 기준 전날 23:30 -> 일주가 전날 23:30부터 시작
		  adjustedDate = new Date(adjustedDate.getFullYear(), adjustedDate.getMonth(), adjustedDate.getDate() - 1, 23, 30);
		} else if (insiElem && insiElem.checked) {
		  // 인시: 기준 3:30 -> 일주가 그날 3:30부터 시작
		  adjustedDate = new Date(adjustedDate.getFullYear(), adjustedDate.getMonth(), adjustedDate.getDate(), 3, 30);
		} else {
		  // 기본은 인시
		  adjustedDate = new Date(adjustedDate.getFullYear(), adjustedDate.getMonth(), adjustedDate.getDate(), 3, 30);
		}
		console.log("Adjusted Date for Day GanZhi:", adjustedDate);
	  
		// 4. 조정된 날짜를 기준으로 일운(일주)을 계산
		// getDayGanZhi 함수는 adjustedDate를 받아 두 글자 문자열(예:"갑자")를 반환한다고 가정합니다.
		const dayGanZhi = getDayGanZhi(adjustedDate);
		const daySplit = splitPillar(dayGanZhi);
		console.log("Calculated Day GanZhi:", dayGanZhi, "->", daySplit);
	  
		// 5. 기준 일간 (본원): 여기서는 일운의 천간를 그대로 사용 (또는 이미 계산된 값을 사용)
		const baseDayStem = daySplit.gan; 
	  
		// 6. HTML 업데이트 - 천간 부분 (일운)
		setText("WDtHanja", stemMapping[daySplit.gan] ? stemMapping[daySplit.gan].hanja : "-");
		setText("WDtHanguel", stemMapping[daySplit.gan] ? stemMapping[daySplit.gan].hanguel : "-");
		setText("WDtEumyang", stemMapping[daySplit.gan] ? stemMapping[daySplit.gan].eumYang : "-");
		setText("WDt10sin", getTenGodForStem(daySplit.gan, baseDayStem) || "-");
	  
		// 7. HTML 업데이트 - 지지 부분 (일운)
		setText("WDbHanja", branchMapping[daySplit.ji] ? branchMapping[daySplit.ji].hanja : "-");
		setText("WDbHanguel", branchMapping[daySplit.ji] ? branchMapping[daySplit.ji].hanguel : "-");
		setText("WDbEumyang", branchMapping[daySplit.ji] ? branchMapping[daySplit.ji].eumYang : "-");
		setText("WDb10sin", getTenGodForBranch(daySplit.ji, baseDayStem) || "-");
		updateHiddenStems(daySplit.ji, "WDb"); // 업데이트: WDbJj1, WDbJj2, WDbJj3
	  
		// 8. HTML 업데이트 - 운성 및 신살
		// getTwelveUnseong와 getTwelveShinsal 함수는 보통 기준 일간과 해당 지지를 사용합니다.
		setText("WDb12ws", getTwelveUnseong(daySplit.gan, daySplit.ji) || "-");
		// 일운 신살의 경우, 연운의 지지(yearSplit.ji)가 필요할 수 있으므로, 
		// 여기서는 이미 계산된 연운 결과가 전역 변수 yearSplit에 있다고 가정합니다.
		setText("WDb12ss", getTwelveShinsal(yearSplit.ji, daySplit.ji) || "-");

		updateColorClasses();

	  }

	  updateDayWoon(refDate);

	  function getHourBranchUsingArray(dateObj) {
		// 총 분으로 환산한 현재 시간
		let totalMinutes = dateObj.getHours() * 60 + dateObj.getMinutes();
		
		// 각 시지의 시작/종료 시간 (분 단위) - +30분 적용
		const timeRanges = [
		  { branch: '자', hanja: '子', start: 23 * 60 + 30, end: 1 * 60 + 30 },   // 23:30 ~ 01:30
		  { branch: '축', hanja: '丑', start: 1 * 60 + 30,  end: 3 * 60 + 30 },    // 01:30 ~ 03:30
		  { branch: '인', hanja: '寅', start: 3 * 60 + 30,  end: 5 * 60 + 30 },    // 03:30 ~ 05:30
		  { branch: '묘', hanja: '卯', start: 5 * 60 + 30,  end: 7 * 60 + 30 },    // 05:30 ~ 07:30
		  { branch: '진', hanja: '辰', start: 7 * 60 + 30,  end: 9 * 60 + 30 },    // 07:30 ~ 09:30
		  { branch: '사', hanja: '巳', start: 9 * 60 + 30,  end: 11 * 60 + 30 },   // 09:30 ~ 11:30
		  { branch: '오', hanja: '午', start: 11 * 60 + 30, end: 13 * 60 + 30 },   // 11:30 ~ 13:30
		  { branch: '미', hanja: '未', start: 13 * 60 + 30, end: 15 * 60 + 30 },   // 13:30 ~ 15:30
		  { branch: '신', hanja: '申', start: 15 * 60 + 30, end: 17 * 60 + 30 },   // 15:30 ~ 17:30
		  { branch: '유', hanja: '酉', start: 17 * 60 + 30, end: 19 * 60 + 30 },   // 17:30 ~ 19:30
		  { branch: '술', hanja: '戌', start: 19 * 60 + 30, end: 21 * 60 + 30 },   // 19:30 ~ 21:30
		  { branch: '해', hanja: '亥', start: 21 * 60 + 30, end: 23 * 60 + 30 }    // 21:30 ~ 23:30
		];
		
		// 시간 구간이 자정을 넘는 경우 처리
		for (let i = 0; i < timeRanges.length; i++) {
		  let { branch, start, end } = timeRanges[i];
		  if (start < end) {
			if (totalMinutes >= start && totalMinutes < end) {
			  return branch;
			}
		  } else {
			// 자정을 넘어가는 경우: 예) 자시
			if (totalMinutes >= start || totalMinutes < end) {
			  return branch;
			}
		  }
		}
		return null;
	  }
	  

	  function updateHourWoon(refDate) {
		// 현재 시간 기준 Date 객체 생성
		//let now = new Date();
		
		// getHourBranchUsingArray를 호출하여 시운의 지지(예: "오")를 구함
		let hourBranch = getHourBranchUsingArray(refDate);
		let hourBranchIndex = Jiji.indexOf(hourBranch); // Jiji 배열은 ["자","축","인",...,"해"]로 전역에 선언
		
		// 일운(일주의) 천간은 기준으로 이미 계산된 값을 사용합니다.
		// 예: global 변수 daySplit가 { gan:"병", ji:"자" }라고 가정.
		let daySplit = window.daySplit; // 또는 getDayGanZhi(now) 후 splitPillar() 등으로 구함.
		if (!daySplit) {
		  daySplit = splitPillar(getDayGanZhi(refDate));
		}
		
		// 시운의 천간은 getHourStem 함수를 사용하여 구합니다.
		let hourStem = getHourStem(daySplit.gan, hourBranchIndex);
		//let hourPillar = hourStem + hourBranch;
		
		// HTML 업데이트 (상단 시운)
		setText("WTtHanja", stemMapping[hourStem] ? stemMapping[hourStem].hanja : "-");
		setText("WTtHanguel", stemMapping[hourStem] ? stemMapping[hourStem].hanguel : "-");
		setText("WTtEumyang", stemMapping[hourStem] ? stemMapping[hourStem].eumYang : "-");
		setText("WTt10sin", getTenGodForStem(hourStem, daySplit.gan) || "-");
		
		// HTML 업데이트 (하단 시운 - 지지)
		setText("WTbHanja", branchMapping[hourBranch] ? branchMapping[hourBranch].hanja : "-");
		setText("WTbHanguel", branchMapping[hourBranch] ? branchMapping[hourBranch].hanguel : "-");
		setText("WTbEumyang", branchMapping[hourBranch] ? branchMapping[hourBranch].eumYang : "-");
		setText("WTb10sin", getTenGodForBranch(hourBranch, daySplit.gan) || "-");
		updateHiddenStems(hourBranch, "WTb");
		
		// 운성 및 신살 업데이트 (예: getTwelveUnseong, getTwelveShinsal 사용)
		// 여기서는 연운의 지지(예: global 변수 yearSplit.ji) 가 전역에 존재한다고 가정.
		setText("WTb12ws", getTwelveUnseong(daySplit.gan, hourBranch) || "-");
		setText("WTb12ss", getTwelveShinsal(yearSplit.ji, hourBranch) || "-");

		updateColorClasses();
	  }

	  updateHourWoon(refDate);


	  document.getElementById("woonChangeBtn").addEventListener("click", function() {
		const picker = document.getElementById("woonTimeSetPicker");
		let refDate = (picker && picker.value) ? new Date(picker.value) : new Date();
		
		// 버튼 클릭 시에만 새 기준으로 업데이트
		var myounResult = getMyounPillars(birthYearP, birthMonthP, birthDayP, birthHourP, birthDate, refDate, gender);

		updateMyowoonSection(myounResult, daySplit, yearSplit);
		
		updateCurrentSewoon(refDate);
		updateMonthlyWoonByToday(refDate);
		updateDayWoon(refDate);
		updateHourWoon(refDate);
	  });

	// updateListMapping
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