// -------------------------
// Helper 함수들
// -------------------------

function toKoreanTime(date = new Date()) {
  const utcMs     = date.getTime() + date.getTimezoneOffset() * 60_000;
  const kstOffset = 9 * 60 * 60_000;
  return new Date(utcMs + kstOffset);
}

function calculateAge(birthDate) {
  const today = toKoreanTime(new Date());
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

function migrateTenGods() {
  const KEY = "myProfiles";
  const data = JSON.parse(localStorage.getItem(KEY) || "[]");
  let touched = false;
  const calendar = new KoreanLunarCalendar();

  data.forEach(p => {
    ["yearPillar","monthPillar","dayPillar","hourPillar"].forEach(k => {
      const ganji = p[k]; if (!ganji) return;
      const stem   = ganji.charAt(0);
      const branch = ganji.charAt(1);
      const newTG = getTenGodForBranch(branch, stem);
      if (!p.tenGods) p.tenGods = {};
      if (p.tenGods[k] !== newTG) {
        p.tenGods[k] = newTG;
        touched = true;
      }
    });


    if (p.birthday && p.birthdayTime && p.birthPlaceLongitude != null) {
      const Y = Number(p.birthday.slice(0,4));
      const M = Number(p.birthday.slice(4,6));
      const D = Number(p.birthday.slice(6,8));
      const [h, m] = p.birthdayTime.split(':').map(Number);

      const birthUtc = new Date(Date.UTC(Y, M-1, D, h, m));
      const newCorrected = adjustBirthDateWithLon(
        birthUtc,
        p.birthPlaceLongitude,
        p.isPlaceUnknown
      );

      p.correctedDate = newCorrected.toISOString();
      touched = true;
    }

    if (p.birthday && p.birthdayTime) {
      const Y = Number(p.birthday.slice(0,4));
      const M = Number(p.birthday.slice(4,6));
      const D = Number(p.birthday.slice(6,8));
      const [h, m] = p.birthdayTime.split(':').map(Number);

      let originalDate;
      if (p.isLunar) {
        calendar.setLunarDate(Y, M, D, !!p.isLeapMonth);
        const solar = calendar.getSolarCalendar();
        originalDate = new Date(
          solar.year,
          solar.month - 1,
          solar.day,
          h, m
        );
      } else {
        originalDate = new Date(Y, M - 1, D, h, m);
      }

      const corrDate = p.correctedDate
        ? new Date(p.correctedDate)
        : originalDate;

      p.yearPillar  = getYearGanZhi(corrDate);
      p.monthPillar = getMonthGanZhi(corrDate, selectedLon);
      p.dayPillar   = getDayGanZhi(corrDate);
      p.hourPillar  = getHourGanZhi(corrDate, p.dayPillar);

      // 3-c) 음력 입력자만, "원래 음력 기준" 기둥도 별도 저장
      if (p.isLunar) {
        p.lunarYearPillar  = getYearGanZhi(originalDate);
        p.lunarMonthPillar = getMonthGanZhi(originalDate, selectedLon);
        p.lunarDayPillar   = getDayGanZhi(originalDate);
        p.lunarHourPillar  = getHourGanZhi(originalDate, p.lunarDayPillar);
      }

      touched = true;
    }
  });

  if (touched) {
    localStorage.setItem(KEY, JSON.stringify(data));
  }
}


function toGz(idx) {          
  idx = idx % 60;                   
  const stem = Cheongan[idx % 10];      
  const branch = Jiji[idx % 12];   
  return stem + branch;              
}

function getYearGanZhiRef(dateObj) {
  const solarYear = dateObj.getFullYear();
  const ipChun    = findSolarTermDate(solarYear, 315);   // 입춘 날짜

  const ganZhiYear = (dateObj < ipChun) ? solarYear - 1 : solarYear;

  const idx = (ganZhiYear - 4) % 60;

  return toGz(idx);
}

function getMonthGanZhiRef(dateObj) {
  const boundaries = getSolarTermBoundaries(dateObj.getFullYear(), 127);        
  const monthNo    = getMonthNumber(dateObj, boundaries);

  const yearIdx     = Cheongan.indexOf(getYearGanZhi(dateObj, dateObj.getFullYear())[0]);
  const branchIdx   = (monthNo + 1) % 12;           // 立春(1)→寅(2)→branchIdx=2 … 4月(3)→진(4)
  const stemIdx     = (yearIdx * 2 + monthNo + 1) % 10;
  const monthStem   = Cheongan[stemIdx];
  const monthBranch = Jiji[branchIdx];
  return monthStem + monthBranch;  // '경진'
}


function getDayGanZhiRef(dateObj) {
  const kstDate = toKoreanTime(dateObj);
  const hour    = kstDate.getHours();

  const adjustedDate = new Date(kstDate.getTime());

  if (document.getElementById("jasi").checked) {
    if (hour < 23) {
      adjustedDate.setDate(adjustedDate.getDate() - 1);
    }
    adjustedDate.setHours(23, 0, 0, 0);

  } else if (document.getElementById("yajasi").checked) {
    adjustedDate.setHours(0, 0, 0, 0);

  } else if (document.getElementById("insi").checked) {
    if (hour < 3) {
      adjustedDate.setDate(adjustedDate.getDate() - 1);
    }
    adjustedDate.setHours(3, 0, 0, 0);
  }

  const dayGanZhi = getDayGanZhi(adjustedDate);
  const { gan, ji } = splitPillar(dayGanZhi);
  
  return `${gan}${ji}`;
}


function getHourStem2(dayPillar, hourBranchIndex) {
  const dayStem = getDayStem(dayPillar);
  if (fixedDayMapping.hasOwnProperty(dayStem)) {
    const mappedArray = fixedDayMappingBasic[dayStem];
    if (mappedArray.length === 12 && hourBranchIndex >= 0 && hourBranchIndex < 12) {
      return mappedArray[hourBranchIndex].charAt(0);
    }
  }
  const dayStemIndex = Cheongan.indexOf(dayStem);
  return (dayStemIndex % 2 === 0)
    ? Cheongan[(dayStemIndex * 2 + hourBranchIndex) % 10]
    : Cheongan[(dayStemIndex * 2 + hourBranchIndex + 2) % 10];
}

function getHourGanZhiRef(dateObj) {
  const date = new Date(dateObj);
  const hourBranch = getHourBranchUsingArray(date);
  const hourBranchIndex = Jiji.indexOf(hourBranch);
  const dayGanZhiGan = splitPillar(getDayGanZhiRef(date));
  const hourStem = getHourStem2(dayGanZhiGan.gan, hourBranchIndex);

  return `${hourStem}${hourBranch}`;  
}

function calcGanzhi(dateObj) {
  const kstDate = toKoreanTime(dateObj);
  return {
    y: getYearGanZhiRef(kstDate),
    m: getMonthGanZhiRef(kstDate),
    d: getDayGanZhiRef(kstDate),
    h: getHourGanZhiRef(dateObj)  
  };
}

// constants.js 등에 현재 스키마 버전을 정의
const CURRENT_SCHEMA_VERSION = 2;

// 앱 시작 시 호출
function migrateAllProfiles() {
  // localStorage 예시: key 패턴이 'myeongsik_<id>' 라고 가정
  Object.keys(localStorage)
    .filter(key => key.startsWith('myeongsik_'))
    .forEach(key => {
      const raw = localStorage.getItem(key);
      if (!raw) return;

      let profile;
      try {
        profile = JSON.parse(raw);
      } catch {
        console.warn(`Invalid JSON for ${key}`);
        return;
      }

      // 이미 최신 버전이면 스킵
      if (profile.schemaVersion === CURRENT_SCHEMA_VERSION) return;

      // ── 1) 원본 생년월일, 장소, 미상 여부
      const originalDate  = new Date(profile.birthDate);
      const correctedDate = adjustBirthDate(originalDate, profile.birthPlace, profile.isPlaceUnknown);

      // ── 2) 새 대운 데이터 계산
      const daewoonData = getDaewoonData(profile.gender, originalDate, correctedDate);

      // ── 3) 프로필 객체 업데이트
      profile.correctedDate = correctedDate.toISOString();
      profile.daewoonData    = daewoonData;
      profile.schemaVersion  = CURRENT_SCHEMA_VERSION;

      // ── 4) 저장
      localStorage.setItem(key, JSON.stringify(profile));
    });
}

// 호출 위치: main.js 또는 초기화 로직 맨 앞
migrateAllProfiles();

const STORAGE_KEY21 = 'savedMyeongSikList';

// 1) 저장된 명식 목록을 불러와서, lon이 빠진 항목을 채워주는 함수
function migrateStoredRecords() {
  const raw = localStorage.getItem(STORAGE_KEY21);
  if (!raw) return;

  let records;
  try {
    records = JSON.parse(raw);
  } catch (e) {
    console.error('저장된 명식 목록 파싱 에러:', e);
    return;
  }

  let updated = false;
  const migrated = records.map(rec => {
    // 이미 dataset.lon(혹은 rec.lon) 이 있으면 그대로
    if (typeof rec.lon === 'number' && !isNaN(rec.lon)) {
      return rec;
    }

    // placeName 으로부터 longitude 찾아서 rec.lon에 추가
    const nameKey = rec.placeName;
    const shortKey = nameKey.split(' ')[0];
    const lon = cityLongitudes[nameKey] 
              ?? cityLongitudes[shortKey];

    if (typeof lon === 'number') {
      rec.lon = lon;
      updated = true;
    }
    return rec;
  });

  // 변경된 게 있으면 다시 저장
  if (updated) {
    localStorage.setItem(STORAGE_KEY21, JSON.stringify(migrated));
    console.info('명식 목록 마이그레이션 완료: lon 속성 보강');
  }
}

