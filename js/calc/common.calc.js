function parseBirthAsUTC(Y, M, D, h, m) {
  return new Date(Date.UTC(Y, M - 1, D, h, m));
}

function adjustBirthDateWithLon(dateObj, cityLon, isPlaceUnknown = false) {
  if (isPlaceUnknown || cityLon == null) {
    return new Date(dateObj.getTime() - 30 * 60_000);
  }

  // 1) 한국(동경 120°~135°) 구간엔 E135 고정, 나머진 cityLon 기준 반올림
  let stdLon;
  if (cityLon >= 120 && cityLon <= 135) {
    stdLon = 135;
  } else {
    stdLon = Math.round(cityLon / 15) * 15;
  }

  // 2) 경도 보정(분)
  const lonCorrMin = (cityLon - stdLon) * 4;
  // 3) 균시차 보정(분)
  const eqTimeMin  = getEquationOfTime(dateObj);
  // 4) 최종 보정
  return new Date(
    dateObj.getTime()
    + (lonCorrMin + eqTimeMin) * 60_000
  );
}

function getSummerTimeInterval(year) {
  let interval = null;
  switch (year) {
    case 1948:
      interval = {
        start: new Date(1948, 5, 1, 0, 0),
        end:   new Date(1948, 8, 13, 0, 0)
      };
      break;
    case 1949:
      interval = {
        start: new Date(1949, 3, 3, 0, 0),
        end:   new Date(1949, 8, 11, 0, 0)
      };
      break;
    case 1950:
      interval = {
        start: new Date(1950, 3, 1, 0, 0),
        end:   new Date(1950, 8, 10, 0, 0)
      };
      break;
    case 1951:
      interval = {
        start: new Date(1951, 4, 6, 0, 0),
        end:   new Date(1951, 8, 9, 0, 0)
      };
      break;
    case 1955:
      interval = {
        start: new Date(1955, 4, 5, 0, 0),
        end:   new Date(1955, 8, 9, 0, 0)
      };
      break;
    case 1956:
      interval = {
        start: new Date(1956, 4, 20, 0, 0),
        end:   new Date(1956, 8, 30, 0, 0)
      };
      break;
    case 1957:
      interval = {
        start: new Date(1957, 4, 5, 0, 0),
        end:   new Date(1957, 8, 22, 0, 0)
      };
      break;
    case 1958:
      interval = {
        start: new Date(1958, 4, 4, 0, 0),
        end:   new Date(1958, 8, 21, 0, 0)
      };
      break;
    case 1959:
      interval = {
        start: new Date(1959, 4, 3, 0, 0),
        end:   new Date(1959, 8, 20, 0, 0)
      };
      break;
    case 1960:
      interval = {
        start: new Date(1960, 4, 1, 0, 0),
        end:   new Date(1960, 8, 18, 0, 0)
      };
      break;
    case 1987:
      interval = {
        start: new Date(1987, 4, 10, 0, 0),
        end:   new Date(1987, 9, 11, 0, 0)
      };
      break;
    case 1988:
      interval = {
        start: new Date(1988, 4, 8, 0, 0),
        end:   new Date(1988, 9, 9, 0, 0)
      };
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

function calendarGregorianToJD(year, month, day, hour = 0, minute = 0) {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }

  const a = Math.floor(year / 100);
  const b = 2 - a + Math.floor(a / 4);
  const fractionalDay = day + (hour + minute / 60) / 24;

  return Math.floor(365.25 * (year + 4716)) +
         Math.floor(30.6001 * (month + 1)) +
         fractionalDay + b - 1524.5;
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

// 1) findSolarTermDate: regionLon 추가
function findSolarTermDate(year, solarDegree, regionLon = 135) {
  const target = solarDegree % 360,
        jd0    = calendarGregorianToJD(year, 1, 1),
        L0     = getSunLongitude(jd0),
        dailyMotion = 0.9856;
  let delta = target - L0;
  if (delta < 0) delta += 360;

  let jd = jd0 + delta / dailyMotion,
      iteration = 0, maxIter = 100, precision = 0.001;

  while (iteration < maxIter) {
    const L = getSunLongitude(jd);
    let diff = target - L;
    if (diff > 180)  diff -= 360;
    if (diff < -180) diff += 360;
    if (Math.abs(diff) < precision) break;
    jd += diff / dailyMotion;
    iteration++;
  }

  const [y, m, dFrac] = jdToCalendarGregorian(jd),
        d    = Math.floor(dFrac),
        frac = dFrac - d,
        hh   = Math.floor(frac * 24),
        mm   = Math.floor((frac * 24 - hh) * 60),
        dateUTC = new Date(Date.UTC(y, m - 1, d, hh, mm));

  // 경도/15시간 → ms
  // ① 한국 범위(127°~135°)면 UTC+9 정시로 고정
  if (regionLon >= 127 && regionLon <= 135) {
    return new Date(dateUTC.getTime() - 9 * 3600 * 1000);
  }

  // ② 해외: 가장 가까운 15° × 1 h → 법정 표준시만 반영
  const stdOffsetH = Math.round(regionLon / 15);      // 예) −118.2° → −8
  return new Date(dateUTC.getTime() + stdOffsetH * 3600 * 1000);
}


const MONTH_ZHI = ["인", "묘", "진", "사", "오", "미", "신", "유", "술", "해", "자", "축"];
const Cheongan = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"];
const Jiji = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"];

let solarTermCache       = new Map();
let solarBoundariesCache = new Map();

function clearSolarTermCache() {
  solarTermCache.clear();
  solarBoundariesCache.clear();
  //console.log('🗑️ 절기 캐시 삭제');
}

/* 1) 원본 백업 -------------------------- */
const _findSolarTermDateRaw      = findSolarTermDate;
const _getSolarTermBoundariesRaw = getSolarTermBoundaries;

/* 2) 래퍼 정의 -------------------------- */
function findSolarTermDateWithCache(year, deg, lon = 135) {
  const key = `${year}-${deg}-${Math.round(lon * 10)}`;
  if (solarTermCache.has(key)) {
    return new Date(solarTermCache.get(key));          // 깊은 복사
  }
  const res = _findSolarTermDateRaw(year, deg, lon);   // ★ 원본 호출
  solarTermCache.set(key, res);
  return new Date(res);
}

function getSolarTermBoundariesWithCache(year, lon = 135) {
  const key = `${year}-${Math.round(lon * 10)}`;
  if (solarBoundariesCache.has(key)) {
    return solarBoundariesCache
      .get(key).map(t => ({ name: t.name, date: new Date(t.date) }));
  }
  const res = _getSolarTermBoundariesRaw(year, lon);   // ★ 원본 호출
  solarBoundariesCache.set(
    key, res.map(t => ({ name: t.name, date: t.date }))
  );
  return res.map(t => ({ name: t.name, date: new Date(t.date) }));
}

/* 3) 원본 이름에 래퍼를 할당 ----------- */
findSolarTermDate      = findSolarTermDateWithCache;
getSolarTermBoundaries = getSolarTermBoundariesWithCache;


// 2) getSolarTermBoundaries: regionLon 추가
function getSolarTermBoundaries(solarYear, regionLon = 135) {
  const terms = [
    { deg: 315, name: "입춘" }, { deg: 345, name: "경칩" },
    { deg: 15,  name: "청명" }, { deg: 45,  name: "입하"   },
    { deg: 75,  name: "망종" }, { deg: 105, name: "소서"   },
    { deg: 135, name: "입추" }, { deg: 165, name: "백로"   },
    { deg: 195, name: "한로" }, { deg: 225, name: "입동"   },
    { deg: 255, name: "대설" }, { deg: 285, name: "소한"   },
  ];

  const next = { deg: 315, name: "다음입춘" };

  // UTC → KST (+9h 보정)
  const toKST = (d) => new Date(d.getTime() + 10 * 60 * 1000);

  const arr = terms
    .map(t => ({
      name: t.name,
      date: toKST(findSolarTermDate(solarYear, t.deg, regionLon))
    }))
    .concat([
      { name: next.name, date: toKST(findSolarTermDate(solarYear+1, next.deg, regionLon)) },
      { name: "소한",   date: toKST(findSolarTermDate(solarYear+1, 285, regionLon)) }
    ]);

  const start = toKST(findSolarTermDate(solarYear, 315, regionLon));
  const end   = toKST(findSolarTermDate(solarYear+1, 315, regionLon));

  return arr
    .filter(t => t.date >= start && t.date < end)
    .sort((a, b) => a.date - b.date);
}


// 1) 문자열/숫자 → 현지 Date 로 변환하는 parseLocalDate (tzMeridian 적용)
function parseLocalDate(input, regionLon) {
  const s  = input.toString().padStart(12,'0'),
        y  = +s.slice(0,4),  M = +s.slice(4,6),
        d  = +s.slice(6,8),  h = +s.slice(8,10),
        m  = +s.slice(10,12);
  // regionLon/15시간 → ms
  const tzMs   = (regionLon/15) * 3600 * 1000;
  // Date.UTC 은 'input' 을 **UTC** 시각으로 해석하므로
  // 실제 local 을 UTC 로 바꾸려면 –tzMs
  const utcTs  = Date.UTC(y, M-1, d, h, m);
  return new Date( utcTs - tzMs );
}

const sexagenaryCycle = [
  "갑자", "을축", "병인", "정묘", "무진", "기사", "경오", "신미", "임신", "계유",
  "갑술", "을해", "병자", "정축", "무인", "기묘", "경진", "신사", "임오", "계미",
  "갑신", "을유", "병술", "정해", "무자", "기축", "경인", "신묘", "임진", "계사",
  "갑오", "을미", "병신", "정유", "무술", "기해", "경자", "신축", "임인", "계묘",
  "갑진", "을사", "병오", "정미", "무신", "기유", "경술", "신해", "임자", "계축",
  "갑인", "을묘", "병진", "정사", "무오", "기미", "경신", "신유", "임술", "계해"
];



function getYearGanZhi(dateObj, year) {
  const ipChun = findSolarTermDate(year, 315);
  const actualYear = (dateObj < ipChun) ? year - 1 : year;
  const yearIndex = ((actualYear - 4) % 60 + 60) % 60;
  return sexagenaryCycle[yearIndex];
}

function getMonthNumber(dateObj, boundaries) {
  for (let i = 0; i < boundaries.length - 1; i++) {
    if (dateObj >= boundaries[i].date && dateObj < boundaries[i + 1].date) {
      return i + 1;
    }
  }
  return 12;
}

// 3) 월간지 계산 함수
function getMonthGanZhi(dateInput, cityLon, forceTzMeridian = null) {
  // --- 0) tzMeridian 결정 ---
  const tzMeridian = forceTzMeridian !== null
    ? forceTzMeridian
    : Math.round(cityLon / 15) * 15;
  //console.log("▶︎ tzMeridian (°E):", tzMeridian);

  // --- 1) dateInput → 지역시 Date ---
  let dateObj;
  if (typeof dateInput === 'string' || typeof dateInput === 'number') {
    dateObj = parseLocalDate(dateInput, tzMeridian);
  } else if (dateInput instanceof Date) {
    // 기존 Date → UTC components → parseLocalDate
    const y = dateInput.getUTCFullYear(),
          M = dateInput.getUTCMonth()+1,
          d = dateInput.getUTCDate(),
          h = dateInput.getUTCHours(),
          m = dateInput.getUTCMinutes();
    const s = String(y).padStart(4,'0')
            +String(M).padStart(2,'0')
            +String(d).padStart(2,'0')
            +String(h).padStart(2,'0')
            +String(m).padStart(2,'0');
    dateObj = parseLocalDate(s, tzMeridian);
  } else {
    throw new Error('Invalid dateInput');
  }
  //console.log("▶︎ parsed dateObj:", dateObj.toISOString());

  // --- 2) 입춘 경계 계산 ---
  const year  = dateObj.getFullYear();
  const bounds = getSolarTermBoundaries(year, cityLon);
  //console.log("▶︎ 모든 절기 경계 (년도:", year,"):");
  //bounds.forEach(t => console.log(`   ${t.name.padEnd(6)} → ${t.date.toISOString()}`));

  const lichun = bounds.find(t => t.name === '입춘');
  if (!lichun) throw new Error('입춘 경계가 없습니다');
  const calcYear = dateObj < lichun.date ? year - 1 : year;
  //console.log("▶︎ calcYear:", calcYear, "(dateObj < 입춘 ? 이전년 기준)");

  // --- 3) calcYear 의 12절기(月建)만 뽑기 ---
  let allBounds = getSolarTermBoundaries(calcYear, cityLon);
  const startIdx = allBounds.findIndex(t => t.name === '입춘');
  let monthTerms = allBounds.slice(startIdx, startIdx + 12);
  if (monthTerms.length < 12) {
    monthTerms = monthTerms.concat(
      getSolarTermBoundaries(calcYear+1, cityLon)
        .slice(0, 12 - monthTerms.length)
    );
  }
  //console.log("▶︎ 월건(月建) 절기 경계:");
  //monthTerms.forEach((t,i) => console.log(`   ${i+1}월: ${t.name} → ${t.date.toISOString()}`));

  // --- 4) 월번호 계산 ---
  const monthNumber = monthTerms.filter(t => dateObj >= t.date).length || 12;
  //console.log("▶︎ monthNumber:", monthNumber);

  // --- 5) 간지 공식 & 최종 월간지 ---
  const yearGZ   = getYearGanZhi(dateObj, calcYear);
  const yStem    = yearGZ.charAt(0);
  const yIdx     = Cheongan.indexOf(yStem) + 1;
  const mStemIdx = ((yIdx * 2) + monthNumber - 1) % 10;
  const mStem    = Cheongan[mStemIdx];
  const mBranch  = MONTH_ZHI[monthNumber - 1];
  const monthGZ  = mStem + mBranch;
  //console.log("▶︎ yearGZ:", yearGZ, "→ monthGZ:", monthGZ);

  return monthGZ;
}

function adjustWoljuBoundaryDate(dateObj, cityLon, mode) {
  if (mode !== "역행") return dateObj;
  const year = dateObj.getFullYear();
  const bounds = getSolarTermBoundaries(year, cityLon).sort((a, b) => a.date - b.date);
  let prev = null;
  for (let i = 0; i < bounds.length; i++) {
    if (bounds[i].date <= dateObj) prev = bounds[i];
    else break;
  }
  if (!prev) {
    const prevYearBounds = getSolarTermBoundaries(year - 1, cityLon).sort((a, b) => a.date - b.date);
    prev = prevYearBounds[prevYearBounds.length - 1] || null;
  }
  if (!prev) return dateObj;
  const boundaryHour = prev.date.getHours();
  if (boundaryHour === 21 || boundaryHour === 22) {
    return new Date(dateObj.getTime() + 2 * 60 * 60 * 1000);
  }
  return dateObj;
}

function isWoljuLateBoundary(dateObj, cityLon) {
  const year = dateObj.getFullYear();
  const bounds = getSolarTermBoundaries(year, cityLon).sort((a, b) => a.date - b.date);
  let prev = null;
  for (let i = 0; i < bounds.length; i++) {
    if (bounds[i].date <= dateObj) prev = bounds[i];
    else break;
  }
  if (!prev) {
    const prevYearBounds = getSolarTermBoundaries(year - 1, cityLon).sort((a, b) => a.date - b.date);
    prev = prevYearBounds[prevYearBounds.length - 1] || null;
  }
  if (!prev) return false;
  const boundaryHour = prev.date.getHours();
  return boundaryHour === 21 || boundaryHour === 22;
}

function getDayGanZhi(dateObj) {
  const y = dateObj.getFullYear();
  const m = dateObj.getMonth() + 1;
  const d = dateObj.getDate();
  const h = dateObj.getHours();
  const min = dateObj.getMinutes();

  const jd = calendarGregorianToJD(y, m, d, h, min);
  const index = Math.floor(jd) + 50;

  return sexagenaryCycle[index % 60];
}

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

const fixedDayMappingBasic = {
  "갑": ["갑자", "을축", "병인", "정묘", "무진", "기사", "경오", "신미", "임신", "계유", "갑술", "을해"],
  "을": ["병자", "정축", "무인", "기묘", "경진", "신사", "임오", "계미", "갑신", "을유", "병술", "정해"],
  "병": ["무자", "기축", "경인", "신묘", "임진", "계사", "갑오", "을미", "병신", "정유", "무술", "기해"],
  "정": ["경자", "신축", "임인", "계묘", "갑진", "을사", "병오", "정미", "무신", "기유", "경술", "신해"],
  "무": ["임자", "계축", "갑인", "을묘", "병진", "정사", "무오", "기미", "경신", "신유", "임술", "계해"],
  "기": ["갑자", "을축", "병인", "정묘", "무진", "기사", "경오", "신미", "임신", "계유", "갑술", "을해"],
  "경": ["병자", "정축", "무인", "기묘", "경진", "신사", "임오", "계미", "갑신", "을유", "병술", "정해"],
  "신": ["무자", "기축", "경인", "신묘", "임진", "계사", "갑오", "을미", "병신", "정유", "무술", "기해"],
  "임": ["경자", "신축", "임인", "계묘", "갑진", "을사", "병오", "정미", "무신", "기유", "경술", "신해"],
  "계": ["임자", "계축", "갑인", "을묘", "병진", "정사", "무오", "기미", "경신", "신유", "임술", "계해"]
};


function getHourBranchIndex(dateObj) {
  let totalMinutes = dateObj.getHours() * 60 + dateObj.getMinutes();
  const ZASI_START = 23 * 60;
  let adjustedMinutes = totalMinutes;
  if (adjustedMinutes < ZASI_START) {
    adjustedMinutes += 1440;
  }
  const diff = adjustedMinutes - ZASI_START;
  const index = Math.floor(diff / 120) % 12;
  return index;
}


function getDayStem(ganZhi) {
  return ganZhi.charAt(0);
}

// 표준식: hourStemIdx = ((dayStemIdx % 5) * 2 + hourBranchIndex) % 10
function getHourStem(dayPillar, hourBranchIndex, opts = {}) {
  const { useFixed = true, throwOnError = true } = opts;

  if (!Number.isInteger(hourBranchIndex) || hourBranchIndex < 0 || hourBranchIndex > 11) {
    if (throwOnError) throw new Error('getHourStem: hourBranchIndex는 0~11 정수여야 함');
    return '';
  }

  const dayStem = getDayStem(dayPillar); // '갑자' → '갑'
  // console.log('dayStem', dayStem);

  // 우선: 고정 매핑이 있으면 그걸 사용
  if (
    useFixed &&
    typeof fixedDayMapping === 'object' &&
    fixedDayMapping &&
    Object.prototype.hasOwnProperty.call(fixedDayMapping, dayStem)
  ) {
    const arr = fixedDayMapping[dayStem];
    if (Array.isArray(arr) && arr.length === 12) {
      const s = arr[hourBranchIndex + 8];
      if (typeof s === 'string' && s.length) return s.charAt(0);
    }
  }

  // 표준 공식으로 계산
  const dayStemIndex = Cheongan.indexOf(dayStem);
  if (dayStemIndex < 0) {
    if (throwOnError) throw new Error(`getHourStem: 알 수 없는 일간 '${dayStem}'`);
    return '';
  }
  const hourStemIdx = ((dayStemIndex % 5) * 2 + hourBranchIndex) % 10;
  return Cheongan[hourStemIdx];
}


function getHourBranchUsingArray(dateObj) {
  if (!(dateObj instanceof Date)) {
    dateObj = new Date(dateObj);
  }
  
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

function splitPillar(Set) {
  return (Set && Set.length >= 2) ? { gan: Set.charAt(0), ji: Set.charAt(1) } : { gan: "-", ji: "-" };
}

function getHourGanZhi(dateObj, dayPillar) {
  if (!(dateObj instanceof Date)) dateObj = new Date(dateObj);

  // 1) 시지 인덱스/문자
  //let hourBranchIdx;
  const hourBranch = getHourBranchUsingArray(dateObj);  // 직접 호출
  const hourBranchIndex = Jiji.indexOf(hourBranch);

  // 3) 시간 천간
  const hourStemChar = getHourStem(dayPillar, hourBranchIndex);

  // 4) 시주 조립
  return hourStemChar + hourBranch;
}

const stemMapping = {
  "갑": { hanja: "甲", hanguel: "갑목", hanguelShort: "갑", eumYang: "양" },
  "을": { hanja: "乙", hanguel: "을목", hanguelShort: "을", eumYang: "음" },
  "병": { hanja: "丙", hanguel: "병화", hanguelShort: "병", eumYang: "양" },
  "정": { hanja: "丁", hanguel: "정화", hanguelShort: "정", eumYang: "음" },
  "무": { hanja: "戊", hanguel: "무토", hanguelShort: "무", eumYang: "양" },
  "기": { hanja: "己", hanguel: "기토", hanguelShort: "기", eumYang: "음" },
  "경": { hanja: "庚", hanguel: "경금", hanguelShort: "경", eumYang: "양" },
  "신": { hanja: "辛", hanguel: "신금", hanguelShort: "신", eumYang: "음" },
  "임": { hanja: "壬", hanguel: "임수", hanguelShort: "임", eumYang: "양" },
  "계": { hanja: "癸", hanguel: "계수", hanguelShort: "계", eumYang: "음" }
};

const branchMapping = {
  "자": { hanja: "子", hanguel: "자수", hanguelShort: "자", eumYang: "음" },
  "축": { hanja: "丑", hanguel: "축토", hanguelShort: "축", eumYang: "음" },
  "인": { hanja: "寅", hanguel: "인목", hanguelShort: "인",  eumYang: "양" },
  "묘": { hanja: "卯", hanguel: "묘목", hanguelShort: "묘",  eumYang: "음" },
  "진": { hanja: "辰", hanguel: "진토", hanguelShort: "진",  eumYang: "양" },
  "사": { hanja: "巳", hanguel: "사화", hanguelShort: "사",  eumYang: "양" },
  "오": { hanja: "午", hanguel: "오화", hanguelShort: "오",  eumYang: "음" },
  "미": { hanja: "未", hanguel: "미토", hanguelShort: "미",  eumYang: "음" },
  "신": { hanja: "申", hanguel: "신금", hanguelShort: "신",  eumYang: "양" },
  "유": { hanja: "酉", hanguel: "유금", hanguelShort: "유",  eumYang: "음" },
  "술": { hanja: "戌", hanguel: "술토", hanguelShort: "술",  eumYang: "양" },
  "해": { hanja: "亥", hanguel: "해수", hanguelShort: "해",  eumYang: "양" }
};

const branchMapping2 = {
  "자": { hanja: "子", hanguel: "자수", hanguelShort: "자", eumYang: "양" },
  "축": { hanja: "丑", hanguel: "축토", hanguelShort: "축", eumYang: "음" },
  "인": { hanja: "寅", hanguel: "인목", hanguelShort: "인",  eumYang: "양" },
  "묘": { hanja: "卯", hanguel: "묘목", hanguelShort: "묘",  eumYang: "음" },
  "진": { hanja: "辰", hanguel: "진토", hanguelShort: "진",  eumYang: "양" },
  "사": { hanja: "巳", hanguel: "사화", hanguelShort: "사",  eumYang: "음" },
  "오": { hanja: "午", hanguel: "오화", hanguelShort: "오",  eumYang: "양" },
  "미": { hanja: "未", hanguel: "미토", hanguelShort: "미",  eumYang: "음" },
  "신": { hanja: "申", hanguel: "신금", hanguelShort: "신",  eumYang: "양" },
  "유": { hanja: "酉", hanguel: "유금", hanguelShort: "유",  eumYang: "음" },
  "술": { hanja: "戌", hanguel: "술토", hanguelShort: "술",  eumYang: "양" },
  "해": { hanja: "亥", hanguel: "해수", hanguelShort: "해",  eumYang: "음" }
};

function updateEumYangClasses() {
  // 1) .hanja_con 케이스 (한자 엘리먼트와 eum/yang 텍스트 갱신)
  document.querySelectorAll('[id$="Hanja"]').forEach(hanjaEl => {
    // 2) id에서 "Hanja" 부분만 제거해서 접두사 얻기
    const prefix = hanjaEl.id.replace(/Hanja$/, '');
    const eumYangEl = document.getElementById(prefix + 'Eumyang');
    if (!eumYangEl) return;

    // 3) 텍스트(한자) 기준으로 info 찾기
    const char = hanjaEl.textContent.trim();
    let info = null;

    // 3-1) 천간 매핑
    info = Object.values(stemMapping).find(v => v.hanja === char);

    // 3-2) 못 찾으면 지지 매핑
    if (!info) {
      info = Object.values(branchMapping2).find(v => v.hanja === char);
    }
    if (!info) return;

    // 4) 기존 음/양 클래스는 항상 제거
    hanjaEl.classList.remove('eum', 'yang');

    // 5) 새로 붙이기
    const cls = info.eumYang === '양' ? 'yang' : 'eum';
    hanjaEl.classList.add(cls);

    // 6) Eumyang 텍스트 갱신
    eumYangEl.textContent = info.eumYang;
  });

  // 2) 일운 간지(천간/지지) span 케이스 (한글 약호로 매핑)
  document
  .querySelectorAll('li.ilwoon_ganji_cheongan span, li.ilwoon_ganji_jiji span')
  .forEach(el => {
    const isStem = !!el.closest('li.ilwoon_ganji_cheongan');
    const mapping = isStem ? stemMapping : branchMapping2;
    const char = el.textContent.trim();
    if (!char) return;

    const key = Object.keys(mapping).find(k => mapping[k].hanguelShort === char);
    if (!key) return;

    const info = mapping[key];
    el.classList.toggle('yang', info.eumYang === '양');
    el.classList.toggle('eum',  info.eumYang === '음');
  });

  // 3) .ganji_w 케이스 (요소 자체 텍스트 한자 기준)
  document.querySelectorAll('.ganji_w').forEach(el => {
    const char = el.textContent.trim();
    if (!char) return;

    // 우선 천간 매핑, 없으면 지지 매핑
    let info = null;
    let key  = Object.keys(stemMapping).find(k => stemMapping[k].hanja === char);
    if (key) {
      info = stemMapping[key];
    } else {
      key  = Object.keys(branchMapping2).find(k => branchMapping2[k].hanja === char);
      if (key) info = branchMapping2[key];
    }
    if (!info) return;

    el.classList.toggle('yang', info.eumYang === '양');
    el.classList.toggle('eum',  info.eumYang === '음');
  });
}

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

function isLeapYear(year) {
  return (year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0);
}

function getDaysInYear(year) {
  return isLeapYear(year) ? 366 : 365;
}

const oneDayMs = 24 * 60 * 60 * 1000;

function getDecimalBirthYear(birthDate) {
  const startOfYear = new Date(birthDate.getFullYear(), 0, 1);
  const diffDays = (birthDate - startOfYear) / oneDayMs;
  const totalDays = isLeapYear(birthDate.getFullYear()) ? 366 : 365;
  return birthDate.getFullYear() + diffDays / totalDays;
}

function computeCustomMonthPillar(correctedDate, gender) {
  
  const yearPillar = getYearGanZhi(correctedDate, correctedDate.getFullYear());
  const isYang     = ["갑","병","무","경","임"].includes(yearPillar.charAt(0));
  const isForward  = (gender === "남" && isYang) || (gender === "여" && !isYang);

  let year       = correctedDate.getFullYear();
  let terms      = getSolarTermBoundaries(year, selectedLon);
  let pointer    = isForward
    ? terms.findIndex(t => correctedDate < t.date)
    : terms.slice().reverse().findIndex(t => correctedDate >= t.date);

  if (!isForward) {
    pointer = terms.length - 1 - pointer;
  }
  if (pointer < 0) pointer = 0;

  const sDates = terms.map(t => t.date);
  const mPillars = [];
  mPillars[0] = getMonthGanZhi(correctedDate, selectedLon);

  for (let i = 1; i < sDates.length; i++) {
    const dt  = sDates[i];
    const hit = isForward
      ? dt >= correctedDate
      : dt <= correctedDate;

    if (hit) {
      const prevIdx = getGanZhiIndex(mPillars[i - 1]);
      const nextIdx = isForward
        ? (prevIdx + 1) % 60
        : (prevIdx + 59) % 60;
      mPillars[i] = getGanZhiIndex(nextIdx);
      pointer = isForward ? pointer + 1 : pointer - 1;
      if (pointer < 0) pointer = terms.length - 1;
      if (pointer >= terms.length) pointer = 0;
    } else {
      mPillars[i] = mPillars[i - 1];
    }
  }

  return mPillars[pointer];
}

function getDaewoonData(gender, originalDate, correctedDate) {
  const inputYear = correctedDate.getFullYear();
  const ipChunForSet = findSolarTermDate(inputYear, 315, selectedLon);
  const effectiveYearForSet = (originalDate < ipChunForSet)
    ? inputYear - 1
    : inputYear;
  
  const yearPillar = getYearGanZhi(correctedDate, effectiveYearForSet);
  
  // 원래 경도(한국 기준 127.5)와 보정된 경도로 각각 월주 계산
  const originalMonthPillar = getMonthGanZhi(correctedDate, 127.5); // 한국 기준
  const correctedMonthPillar = getMonthGanZhi(correctedDate, selectedLon); // 보정된 경도
  
  // 절기 경계선 상황 감지 (월주가 다른 경우)
  const isBoundaryCase = originalMonthPillar !== correctedMonthPillar;
  
  // 실제 계산에 사용할 월주 결정
  // 절기가 넘어간 경우, 항상 원래 월주(한국 기준)를 사용
  const monthPillar = isBoundaryCase ? originalMonthPillar : correctedMonthPillar;
  
  const isYang = ['갑','병','무','경','임'].includes(yearPillar.charAt(0));
  const isForward = (gender === '남' && isYang) || (gender === '여' && !isYang);
  
  const collectTerms = y => getSolarTermBoundaries(y, selectedLon).map(t => t.date);
  const allDates = [
    ...collectTerms(inputYear - 1),
    ...collectTerms(inputYear),
    ...collectTerms(inputYear + 1)
  ].sort((a, b) => a - b);
  
  let boundaryDate;
  if (isForward) {
    boundaryDate = allDates.find(d => d > correctedDate) || allDates[0];
  } else {
    const past = allDates.filter(d => d < correctedDate);
    boundaryDate = past[past.length - 1] || allDates[allDates.length - 1];
  }

  if (selectedLon >= 127 && selectedLon <= 135) {
    // 18h = 18 * 3600 * 1000 ms
    boundaryDate = new Date(boundaryDate.getTime() + 18 * 3600 * 1000);
    //console.log("★★ daewoon hack boundaryDate:", boundaryDate.toISOString());
  }
  
  const diffMs = Math.abs(boundaryDate - correctedDate);
  const diffDays = diffMs / oneDayMs;
  let baseDecimal = diffDays / 3;
  
  // 절기 경계선 상황에서 대운수 조정
  if (isBoundaryCase) {
    //console.log('콘솔테스트');
    // 역행이면서 절기가 넘어간 경우, 대운수를 매우 작게 조정
    if (!isForward) {
      baseDecimal = 1 / 12; // 약 1개월 정도로 설정
    } else {
      // 순행인 경우도 비슷하게 조정 (절기 직전이므로)
      baseDecimal = Math.min(baseDecimal, 1 / 12);
    }
  }
  
  let baseYears = Math.floor(baseDecimal);
  const baseMonths = Math.floor((baseDecimal - baseYears) * 12);
  
  const stemChars = Cheongan;
  const branchChars = MONTH_ZHI;
  const monthStemIndex = stemChars.indexOf(monthPillar.charAt(0));
  const monthBranchIndex = branchChars.indexOf(monthPillar.charAt(1));
  
  const list = [];
  baseYears = Math.max(1, baseYears);

  const zeroMonthPillar = isBoundaryCase ? correctedMonthPillar : monthPillar;
  const zeroStemIndex = stemChars.indexOf(zeroMonthPillar.charAt(0));
  const zeroBranchIndex = branchChars.indexOf(zeroMonthPillar.charAt(1));

  list.push({
    age: 0,
    stem: stemChars[zeroStemIndex],
    branch: branchChars[zeroBranchIndex]
  });

  for (let i = 0; i < 10; i++) {
    const ageOffset = isBoundaryCase
      ? (i === 0 ? baseYears : i * 10)
      : baseYears + i * 10;
    const step = isBoundaryCase ? i : i + 1;

    const nextStem = isForward
      ? (monthStemIndex + step) % 10
      : (monthStemIndex - step + 10) % 10;
    const nextBr = isForward
      ? (monthBranchIndex + step) % 12
      : (monthBranchIndex - step + 12) % 12;

    list.push({
      age: ageOffset,
      stem: stemChars[nextStem],
      branch: branchChars[nextBr]
    });
  }

  return {
    baseYears,
    baseMonths,
    baseDecimal,
    list,
    dayStemRef: getDayGanZhi(correctedDate).charAt(0),
    // 디버깅용 추가 정보
    isBoundaryCase,
    originalMonthPillar,
    correctedMonthPillar,
    finalMonthPillar: monthPillar
  };
}



function getDaewoonDataStr(gender, originalDate, correctedDate) {
  const data = getDaewoonData(gender, originalDate, correctedDate);
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

function getEffectiveYearForSet(dateObj) {
  if (!(dateObj instanceof Date)) {
    dateObj = new Date(dateObj);
  }
  const ipChun = findSolarTermDate(dateObj, 31, selectedLon);
  const year = dateObj.getFullYear();

  if (dateObj < ipChun) {
    return year - 1;
  } else {
    return year;
  }
}

function getFourPillarsWithDaewoon(year, month, day, hour, minute, gender, correctedDate, selectedLon) {
	originalDate = new Date(year, month - 1, day, hour, minute);
  const effectiveYearForSet = getEffectiveYearForSet(correctedDate);
	const nominalBirthDate = new Date(year, month - 1, day);
	const nominalBirthDatePrev = new Date(year, month - 1, day - 1, hour, minute);
  const nominalBirthDateNext = new Date(year, month - 1, day + 1, hour, minute);
  const nominalBirthDateTime = adjustBirthDateWithLon(nominalBirthDate, selectedLon, isPlaceUnknown);
  const nominalBirthDatePrevTime = adjustBirthDateWithLon(nominalBirthDatePrev, selectedLon, isPlaceUnknown);
  const nominalBirthDateNextTime = adjustBirthDateWithLon(nominalBirthDateNext, selectedLon, isPlaceUnknown);
	
	const yajasiElem = document.getElementById('yajasi');
	const yajasi = yajasiElem && yajasiElem.checked;
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
  if (!(correctedDate instanceof Date)) {
    correctedDate = new Date(correctedDate);
  }

  //const hourPillar = hourStem + Jiji[hourBranchIndex];

  let dayPillar = getDayGanZhi(nominalBirthDate);
  let hourPillar = getHourGanZhi(correctedDate, dayPillar);
  const yearPillar = getYearGanZhi(correctedDate, effectiveYearForSet);
  const monthPillar = getMonthGanZhi(correctedDate, selectedLon);
  const correctedTime = new Date(correctedDate).getHours();
  const originalTime = new Date(originalDate).getHours();


  if (isJasi && (correctedTime >= 0 && correctedTime < 3)){
    hourPillar = getHourGanZhi(nominalBirthDatePrevTime, dayPillar);
    return `${yearPillar} ${monthPillar} ${dayPillar} ${hourPillar}, ${getDaewoonDataStr(gender, originalDate, correctedDate)}`;
  } else if (yajasi && (correctedTime >= 0 && correctedTime < 3)) {
    dayPillar = getDayGanZhi(nominalBirthDateTime);
    const dayPillars = getDayGanZhi(nominalBirthDateTime);
    //hourPillar = getHourGanZhi(nominalBirthDateTime, dayPillars);
    return `${yearPillar} ${monthPillar} ${dayPillar} ${hourPillar}, ${getDaewoonDataStr(gender, originalDate, correctedDate)}`;
  } else if (isInsi && (correctedTime >= 0 && correctedTime < 3)) {
    dayPillar = getDayGanZhi(nominalBirthDatePrevTime);
    const dayPillars = getDayGanZhi(nominalBirthDateTime);
    //hourPillar = getHourGanZhi(nominalBirthDateTime, dayPillars);
    return `${yearPillar} ${monthPillar} ${dayPillar} ${hourPillar}, ${getDaewoonDataStr(gender, originalDate, correctedDate)}`;
  } else if (yajasi && (correctedTime >= 23 && correctedTime < 24 && originalTime === 0)) {
    const dayPillars = getDayGanZhi(nominalBirthDateNextTime);
    hourPillar = getHourGanZhi(nominalBirthDateNextTime, dayPillars);
    return `${yearPillar} ${monthPillar} ${dayPillar} ${hourPillar}, ${getDaewoonDataStr(gender, originalDate, correctedDate)}`;
  } else if (isInsi && (correctedTime >= 23 && correctedTime < 24 && originalTime === 0)) {
    const dayPillars = getDayGanZhi(nominalBirthDateNextTime);
    hourPillar = getHourGanZhi(nominalBirthDateNextTime, dayPillars);
    return `${yearPillar} ${monthPillar} ${dayPillar} ${hourPillar}, ${getDaewoonDataStr(gender, originalDate, correctedDate)}`;
  } else if (isJasi && (correctedTime >= 23 && correctedTime < 24 && originalTime === 0)) {
    dayPillar = getDayGanZhi(nominalBirthDateNextTime);
    hourPillar = getHourGanZhi(nominalBirthDateTime, dayPillar);
    return `${yearPillar} ${monthPillar} ${dayPillar} ${hourPillar}, ${getDaewoonDataStr(gender, originalDate, correctedDate)}`;
  } else {
    
    return `${yearPillar} ${monthPillar} ${dayPillar} ${hourPillar}, ${getDaewoonDataStr(gender, originalDate, correctedDate)}`;
  }
  
}

