let currentModifyIndex = null,
    currentDetailIndex = null,
    currentMode,
    partnerIndex = null,
    modifyIndex,
    originalDataSnapshot,
    originalDate,
    correctedDate;

let baseDayStem,
    baseDayBranch,
    baseYearBranch,
    daypillar,
    yearPillar;

let baseDayBranch_copy,
    baseDayBranch_copy2,
    baseYearBranch_copy,
    baseYearBranch_copy2;

let isTimeUnknown = false,
    isPlaceUnknown = false,
    isCoupleMode = false,
    coupleMode = false,
    manualOverride = false,
    manualOverride2 = false,
    isPickerVer2 = false,
    isPickerVer22 = false,
    isPickerVer3 = false,
    isPickerVer23 = false;

let savedMyeongsikList = [];

let getMyounPillarsVr,
    updateMyowoonSectionVr,
    renderSijuButtonsVr,
    handleChangeVr,
    updateGanzhiDisplayVr,
    updateOriginalAndMyowoonVr,
    updateFuncVr,
    updateAllDaewoonItemsVr;

let myData = null,
    partnerData = null,
    currentMyeongsik = null,
    latestMyeongsik = null;

let customRadioTarget = null;

let hourSplitGlobal,
    daySplitGlobal,
    savedCityLon = null,
    initialized,
    lunarDate = null;

let fixedCorrectedDate = null;

let cityLongitudes = {};

const placeBtn  = document.getElementById('inputBirthPlace');
const modal     = document.getElementById('mapModal');
const closeMap  = document.getElementById('closeMap');
const searchBox = document.getElementById('searchBox');
const suggList  = document.getElementById('suggestions');
let map, marker, debounceTimer;

placeBtn.addEventListener('click', () => {
  modal.style.display = 'block';
  if (!map) {
    map = L.map('map').setView([37.5665, 126.9780], 11);
    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      { subdomains: 'abcd', attribution: '&copy; OSM &copy; CARTO' }
    ).addTo(map);
  }
  searchBox.focus();
});

closeMap.addEventListener('click', () => {
  if (!placeBtn.value || placeBtn.value === "출생지선택") {
    alert('도시를 입력하여 선택해주세요.');
    return;
  }

  modal.style.display = 'none';
  searchBox.value = '';
  suggList.innerHTML = '';
});

searchBox.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  const q = searchBox.value.trim();
  if (!q) {
    suggList.innerHTML = '';
    return;
  }

  debounceTimer = setTimeout(async () => {
    try {
      const url =
        'https://nominatim.openstreetmap.org/search' +
        '?format=json&limit=10' +
        '&accept-language=ko' +
        '&viewbox=-180,90,180,0&bounded=1' +
        '&q=' + encodeURIComponent(q);
      const res = await fetch(url);
      const data = await res.json();

      suggList.innerHTML = data.map(item => {
        const parts = item.display_name.split(',').map(s => s.trim());
        let fullName;
        if (parts[0].match(/구$|군$/) && parts[1]?.match(/시$/)) {
          fullName = `${parts[1]} ${parts[0]}`;
        } else {
          fullName = parts[0];
        }
        return `
          <li
            data-name="${fullName}"
            data-lon="${item.lon}"
            data-lat="${item.lat}"
            style="padding:6px 8px;cursor:pointer;"
          >${fullName}</li>`;
      }).join('');
    } catch (e) {
      console.error(e);
      suggList.innerHTML = '<li>검색 중 오류 발생</li>';
    }
  }, 500);
});
const birthPlaceFull = placeBtn.value;
let cityLon = null;

suggList.addEventListener('click', e => {
  if (e.target.tagName !== 'LI') return;
  const name = e.target.dataset.name;
  const lat  = parseFloat(e.target.dataset.lat);
  const lon  = parseFloat(e.target.dataset.lon);

  if (!marker) marker = L.marker([lat, lon]).addTo(map);
  else         marker.setLatLng([lat, lon]);

  map.flyTo([lat, lon], 14, { duration: 0.5 });

  const cityKey = name.split(' ')[0];
  cityLongitudes[name]    = lon;
  cityLongitudes[cityKey] = lon;
  localStorage.setItem('cityLongitudes', JSON.stringify(cityLongitudes));
  cityLon = lon;
  fixedCorrectedDate = null;
  placeBtn.value       = name;
  placeBtn.textContent = name;
  suggList.innerHTML  = '';
});


function initializeCorrectedDate(dateObj, cityLon, isPlaceUnknown) {
  if (fixedCorrectedDate) return fixedCorrectedDate; // 이미 고정된 값이 있으면 그걸 반환
  fixedCorrectedDate = adjustBirthDateWithLon(dateObj, cityLon, isPlaceUnknown);
  return fixedCorrectedDate;
}

function loadCityLongitudes() {
  cityLongitudes = JSON.parse(localStorage.getItem('cityLongitudes') || '{}');
}

function restoreCurrentPlaceMapping(item) {
  if (item.birthPlaceFull && item.birthPlaceLongitude != null) {
    cityLongitudes[item.birthPlaceFull] = item.birthPlaceLongitude;
  }

  if (item.correctedDate) {
    fixedCorrectedDate = new Date(item.correctedDate);
  }
}

function parseBirthAsUTC(Y, M, D, h, m) {
  return new Date(Date.UTC(Y, M - 1, D, h, m));
}

function adjustBirthDateWithLon(dateObj, cityLon, isPlaceUnknown = false) {
  if (isPlaceUnknown) {
    return new Date(dateObj.getTime() - 30 * 60 * 1000);
  }
  if (cityLon == null) {
    return dateObj;
  }

  const rawOffset  = cityLon / 15;
  const offsetHours = rawOffset >= 0
    ? Math.ceil(rawOffset)
    : Math.floor(rawOffset);
  const baseLon    = offsetHours * 15;
  const lonCorrMin = (cityLon - baseLon) * 4;
  const eqTimeMin  = getEquationOfTime(dateObj);

  let corrected = new Date(
    dateObj.getTime() 
    + (lonCorrMin + eqTimeMin) * 60 * 1000
  );

  return corrected;
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

const MONTH_ZHI = ["인", "묘", "진", "사", "오", "미", "신", "유", "술", "해", "자", "축"];
const Cheongan = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"];
const Jiji = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"];

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
  let terms      = getSolarTermBoundaries(year);
  let pointer    = isForward
    ? terms.findIndex(t => correctedDate < t.date)
    : terms.slice().reverse().findIndex(t => correctedDate >= t.date);

  if (!isForward) {
    pointer = terms.length - 1 - pointer;
  }
  if (pointer < 0) pointer = 0;

  const sDates = terms.map(t => t.date);
  const mPillars = [];
  mPillars[0] = getMonthGanZhi(correctedDate, correctedDate.getFullYear());

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

  const ipChunForSet = findSolarTermDate(inputYear, 315);
  const effectiveYearForSet = (originalDate < ipChunForSet)
    ? inputYear - 1
    : inputYear;

  const yearPillar  = getYearGanZhi(correctedDate, effectiveYearForSet);
  const monthPillar = getMonthGanZhi(correctedDate, effectiveYearForSet);
  const isYang    = ['갑','병','무','경','임'].includes(yearPillar.charAt(0));
  const isForward = (gender === '남' && isYang) || (gender === '여' && !isYang);

  const collectTerms = y => getSolarTermBoundaries(y).map(t => t.date);
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

  const diffMs      = Math.abs(boundaryDate - correctedDate);
  const diffDays    = diffMs / oneDayMs;
  const baseDecimal = diffDays / 3;
  const baseYears  = Math.floor(baseDecimal);
  const baseMonths = Math.floor((baseDecimal - baseYears) * 12);
  const stemChars        = Cheongan;
  const branchChars      = MONTH_ZHI;
  const monthStemIndex   = stemChars.indexOf(monthPillar.charAt(0));
  const monthBranchIndex = branchChars.indexOf(monthPillar.charAt(1));
  const list = [];

  for (let i = 0; i < 10; i++) {
    const ageOffset = baseYears + i * 10;
    const step      = i + 1;
    const nextStem  = isForward
      ? (monthStemIndex   + step) % 10
      : (monthStemIndex   - step + 10) % 10;
    const nextBr    = isForward
      ? (monthBranchIndex + step) % 12
      : (monthBranchIndex - step + 12) % 12;

    list.push({
      age:    ageOffset,
      stem:   stemChars[nextStem],
      branch: branchChars[nextBr]
    });
  }

  return {
    baseYears,      
    baseMonths,     
    baseDecimal,    
    list,           
    dayStemRef:     getDayGanZhi(correctedDate).charAt(0)
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

function getEffectiveYearForSet(dateObj) {
  if (!(dateObj instanceof Date)) {
    dateObj = new Date(dateObj);
  }
  const ipChun = findSolarTermDate(dateObj, 315);
  const year = dateObj.getFullYear();

  if (dateObj < ipChun) {
    return year - 1;
  } else {
    return year;
  }
}

function getFourPillarsWithDaewoon(year, month, day, hour, minute, gender, correctedDate) {
	originalDate = new Date(year, month - 1, day, hour, minute);
  const effectiveYearForSet = getEffectiveYearForSet(correctedDate);
	const nominalBirthDate = new Date(year, month - 1, day);
  const nominalBirthDate2 = new Date(year, month - 1, day + 1);
	const nominalBirthDatePrev = new Date(year, month - 1, day - 1);
	
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

  if (hourBranchIndex === 0){
    hourDayPillar = getDayGanZhi(nominalBirthDate);
  } else {
    hourDayPillar = getDayGanZhi(nominalBirthDatePrev);
  }

  if (hourBranchIndex === 0 && (yajasi && (correctedDate.getHours() >= 0 && correctedDate.getHours() < 3)) 
  || hourBranchIndex === 0 && (isJasi && (correctedDate.getHours() >= 0 && correctedDate.getHours() < 3))
  || hourBranchIndex === 0 && (isInsi && (correctedDate.getHours() >= 0 && correctedDate.getHours() < 3))){
    hourDayPillar = getDayGanZhi(nominalBirthDatePrev);
  } else if (hourBranchIndex === 0 && (yajasi && correctedDate.getHours() < 24) 
  || hourBranchIndex === 0 && (isJasi && correctedDate.getHours() < 24)) {
    hourDayPillar = getDayGanZhi(nominalBirthDate);
  }
  const hourStem = getHourStem(hourDayPillar, hourBranchIndex);
  const hourPillar = hourStem + Jiji[hourBranchIndex];

  const yearPillar = getYearGanZhi(correctedDate, effectiveYearForSet);
  const monthPillar = getMonthGanZhi(correctedDate, effectiveYearForSet);

  if (isJasi && correctedDate.getHours() >= 23 || isJasi && (correctedDate.getHours() < 3)){
    if (correctedDate.getHours() >= 0 && correctedDate.getHours() < 3) {
      const daypillar = getDayGanZhi(nominalBirthDate);
      return `${yearPillar} ${monthPillar} ${daypillar} ${hourPillar}, ${getDaewoonDataStr(gender, originalDate, correctedDate)}`;
    } else {
      const daypillar = getDayGanZhi(nominalBirthDate2);
      return `${yearPillar} ${monthPillar} ${daypillar} ${hourPillar}, ${getDaewoonDataStr(gender, originalDate, correctedDate)}`;
    }
    
  } else if (isInsi && (correctedDate.getHours() < 3 || isInsi && correctedDate.getHours() >= 23)){
    if (hourBranchIndex === 0) {
      if (correctedDate.getHours() >= 0 && correctedDate.getHours() < 3) {
        const daypillar = getDayGanZhi(nominalBirthDatePrev);
        return `${yearPillar} ${monthPillar} ${daypillar} ${hourPillar}, ${getDaewoonDataStr(gender, originalDate, correctedDate)}`;
      } else {
        const daypillar = getDayGanZhi(nominalBirthDate);
        return `${yearPillar} ${monthPillar} ${daypillar} ${hourPillar}, ${getDaewoonDataStr(gender, originalDate, correctedDate)}`;
      }
      
    } else {
      const daypillar = getDayGanZhi(nominalBirthDatePrev);
      return `${yearPillar} ${monthPillar} ${daypillar} ${hourPillar}, ${getDaewoonDataStr(gender, originalDate, correctedDate)}`;
    }
  } else {
    const daypillar = getDayGanZhi(nominalBirthDate);
    return `${yearPillar} ${monthPillar} ${daypillar} ${hourPillar}, ${getDaewoonDataStr(gender, originalDate, correctedDate)}`;
  }	
  
}

let globalState = { birthYear: null, month: null, day: null, birthPlace: null, gender: null, daewoonData: null, sewoonStartYear: null, originalDayStem: null };

const tenGodMappingForStems = {
  "갑": { "갑": "비견", "을": "겁재", "병": "식신", "정": "상관", "무": "편재", "기": "정재", "경": "편관", "신": "정관", "임": "편인", "계": "정인" },
  "을": { "갑": "겁재", "을": "비견", "병": "상관", "정": "식신", "무": "정재", "기": "편재", "경": "정관", "신": "편관", "임": "정인", "계": "편인" },
  "병": { "갑": "편인", "을": "정인", "병": "비견", "정": "겁재", "무": "식신", "기": "상관", "경": "편재", "신": "정재", "임": "편관", "계": "정관" },
  "정": { "갑": "정인", "을": "편인", "병": "겁재", "정": "비견", "무": "상관", "기": "식신", "경": "정재", "신": "편재", "임": "정관", "계": "편관" },
  "무": { "갑": "편관", "을": "정관", "병": "편인", "정": "정인", "무": "비견", "기": "겁재", "경": "식신", "신": "상관", "임": "편재", "계": "정재" },
  "기": { "갑": "정관", "을": "편관", "병": "정인", "정": "편인", "무": "겁재", "기": "비견", "경": "상관", "신": "식신", "임": "정재", "계": "편재" },
  "경": { "갑": "편재", "을": "정재", "병": "편관", "정": "정관", "무": "편인", "기": "정인", "경": "비견", "신": "겁재", "임": "식신", "계": "상관" },
  "신": { "갑": "정재", "을": "편재", "병": "정관", "정": "편관", "무": "정인", "기": "편인", "경": "겁재", "신": "비견", "임": "상관", "계": "식신" },
  "임": { "갑": "식신", "을": "상관", "병": "편재", "정": "정재", "무": "편관", "기": "정관", "경": "편인", "신": "정인", "임": "비견", "계": "겁재" },
  "계": { "갑": "상관", "을": "식신", "병": "정재", "정": "편재", "무": "정관", "기": "편관", "경": "정인", "신": "편인", "임": "계수", "계": "비견" }
};

const tenGodMappingForBranches = {
  "갑": { "자": "정인", "축": "정재", "인": "비견", "묘": "겁재", "진": "편재", "사": "식신", "오": "상관", "미": "정재", "신": "편관", "유": "정관", "술": "편재", "해": "편인" },
  "을": { "자": "편인", "축": "편재", "인": "겁재", "묘": "비견", "진": "정재", "사": "상관", "오": "식신", "미": "편재", "신": "정관", "유": "편관", "술": "정재", "해": "정인" },
  "병": { "자": "정관", "축": "상관", "인": "편인", "묘": "정인", "진": "식신", "사": "비견", "오": "겁재", "미": "상관", "신": "편재", "유": "정재", "술": "식신", "해": "편관" },
  "정": { "자": "편관", "축": "식신", "인": "정인", "묘": "편인", "진": "상관", "사": "겁재", "오": "비견", "미": "식신", "신": "정재", "유": "편재", "술": "상관", "해": "정관" },
  "무": { "자": "정재", "축": "겁재", "인": "편관", "묘": "정관", "진": "비견", "사": "편인", "오": "정인", "미": "겁재", "신": "식신", "유": "상관", "술": "비견", "해": "편재" },
  "기": { "자": "편재", "축": "비견", "인": "정관", "묘": "편관", "진": "겁재", "사": "정인", "오": "편인", "미": "비견", "신": "상관", "유": "식신", "술": "겁재", "해": "정재" },
  "경": { "자": "상관", "축": "정인", "인": "편재", "묘": "정재", "진": "편인", "사": "편관", "오": "정관", "미": "정인", "신": "비견", "유": "겁재", "술": "편인", "해": "식신" },
  "신": { "자": "식신", "축": "편인", "인": "정재", "묘": "편재", "진": "정인", "사": "정관", "오": "편관", "미": "편인", "신": "겁재", "유": "비견", "술": "정인", "해": "상관" },
  "임": { "자": "겁재", "축": "정관", "인": "식신", "묘": "상관", "진": "편관", "사": "편재", "오": "정재", "미": "정관", "신": "편인", "유": "정인", "술": "편관", "해": "비견" },
  "계": { "자": "비견", "축": "편관", "인": "상관", "묘": "식신", "진": "정관", "사": "정재", "오": "편재", "미": "편관", "신": "정인", "유": "편인", "술": "정관", "해": "겁재" }
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

const colorMapping2 = {
  "갑": { textColor: 'green', bgColor: 'b_green' },
  "을": { textColor: 'green', bgColor: 'b_green' },
  "병": { textColor: 'red', bgColor: 'b_red' },
  "정": { textColor: 'red', bgColor: 'b_red' },
  "무": { textColor: 'yellow', bgColor: 'b_yellow' },
  "기": { textColor: 'yellow', bgColor: 'b_yellow' },
  "경": { textColor: 'white', bgColor: 'b_white' },
  "신": { textColor: 'white', bgColor: 'b_white' },
  "임": { textColor: 'black', bgColor: 'b_black' },
  "계": { textColor: 'black', bgColor: 'b_black' },
  "자": { textColor: 'black', bgColor: 'b_black' },
  "축": { textColor: 'yellow', bgColor: 'b_yellow' },
  "인": { textColor: 'green', bgColor: 'b_green' },
  "묘": { textColor: 'green', bgColor: 'b_green' },
  "진": { textColor: 'yellow', bgColor: 'b_yellow' },
  "사": { textColor: 'red', bgColor: 'b_red' },
  "오": { textColor: 'red', bgColor: 'b_red' },
  "미": { textColor: 'yellow', bgColor: 'b_yellow' },
  "신": { textColor: 'white', bgColor: 'b_white' },
  "유": { textColor: 'white', bgColor: 'b_white' },
  "술": { textColor: 'yellow', bgColor: 'b_yellow' },
  "해": { textColor: 'black', bgColor: 'b_black' }
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

function getTwelveShinsal2(yearBranch, branch) {
  const groupMapping = {
    "해": "묘", "묘": "묘", "미": "묘",
    "인": "오", "오": "오", "술": "오",
    "사": "유", "유": "유", "축": "유",
    "신": "자", "자": "자", "진": "자",
  };

  const mapping = {
    "묘": { "자": "년살", "축": "월살", "인": "망신", "묘": "장성", "진": "반안", "사": "역마", "오": "육해", "미": "화개", "신": "겁살", "유": "재살", "술": "천살", "해": "지살" },
    "오": { "자": "재살", "축": "천살", "인": "지살", "묘": "년살", "진": "월살", "사": "망신", "오": "장성", "미": "반안", "신": "역마", "유": "육해", "술": "화개", "해": "겁살" },
    "유": { "자": "육해", "축": "화개", "인": "겁살", "묘": "재살", "진": "천살", "사": "지살", "오": "년살", "미": "월살", "신": "망신", "유": "장성", "술": "반안", "해": "역마" },
    "자": { "자": "장성", "축": "반안", "인": "역마", "묘": "육해", "진": "화개", "사": "겁살", "오": "재살", "미": "천살", "신": "지살", "유": "년살", "술": "월살", "해": "망신" },
  };

  const key = groupMapping[yearBranch];
  return key && mapping[key] ? mapping[key][branch] || "" : "";
}

function getTwelveShinsal8(yearBranch, branch) {
  const mapping = {
    "자": { "자": "장성", "축": "반안", "인": "역마", "묘": "육액", "진": "화개", "사": "겁살", "오": "재살", "미": "천살", "신": "지살", "유": "도화", "술": "월살", "해": "망신" },
    "축": { "자": "망신", "축": "장성", "인": "반안", "묘": "역마", "진": "육액", "사": "화개", "오": "겁살", "미": "재살", "신": "천살", "유": "지살", "술": "도화", "해": "월살" },
    "인": { "자": "월살", "축": "망신", "인": "장성", "묘": "반안", "진": "역마", "사": "육액", "오": "화개", "미": "겁살", "신": "재살", "유": "천살", "술": "지살", "해": "도화" },
    "묘": { "자": "도화", "축": "월살", "인": "망신", "묘": "장성", "진": "반안", "사": "역마", "오": "육액", "미": "화개", "신": "겁살", "유": "재살", "술": "천살", "해": "지살" },
    "진": { "자": "지살", "축": "도화", "인": "월살", "묘": "망신", "진": "장성", "사": "반안", "오": "역마", "미": "육액", "신": "화개", "유": "겁살", "술": "재살", "해": "천살" },
    "사": { "자": "천살", "축": "지살", "인": "도화", "묘": "월살", "진": "망신", "사": "장성", "오": "반안", "미": "역마", "신": "육액", "유": "화개", "술": "겁살", "해": "재살" },
    "오": { "자": "재살", "축": "천살", "인": "지살", "묘": "도화", "진": "월살", "사": "망신", "오": "장성", "미": "반안", "신": "역마", "유": "육액", "술": "화개", "해": "겁살" },
    "미": { "자": "겁살", "축": "재살", "인": "천살", "묘": "지살", "진": "도화", "사": "월살", "오": "망신", "미": "장성", "신": "반안", "유": "역마", "술": "육액", "해": "화개" },
    "신": { "자": "화개", "축": "겁살", "인": "재살", "묘": "천살", "진": "지살", "사": "도화", "오": "월살", "미": "망신", "신": "장성", "유": "반안", "술": "역마", "해": "육액" },
    "유": { "자": "육액", "축": "화개", "인": "겁살", "묘": "재살", "진": "천살", "사": "지살", "오": "도화", "미": "월살", "신": "망신", "유": "장성", "술": "반안", "해": "역마" },
    "술": { "자": "역마", "축": "육액", "인": "화개", "묘": "겁살", "진": "재살", "사": "천살", "오": "지살", "미": "도화", "신": "월살", "유": "망신", "술": "장성", "해": "반안" },
    "해": { "자": "반안", "축": "역마", "인": "육액", "묘": "화개", "진": "겁살", "사": "재살", "오": "천살", "미": "지살", "신": "도화", "유": "월살", "술": "망신", "해": "장성" }
  };
  return mapping[yearBranch] ? mapping[yearBranch][branch] || "" : "";
}

function getTwelveShinsal82(yearBranch, branch) {
  // 각 삼합 그룹을 하나의 기준 지지에 매핑
  const groupMapping = {
    "해": "묘", "묘": "묘", "미": "묘",
    "인": "오", "오": "오", "술": "오",
    "사": "유", "유": "유", "축": "유",
    "신": "자", "자": "자", "진": "자",
  };

  const mapping = {
    "묘": { "자": "도화", "축": "월살", "인": "망신", "묘": "장성", "진": "반안", "사": "역마", "오": "육액", "미": "화개", "신": "겁살", "유": "재살", "술": "천살", "해": "지살" },
    "오": { "자": "재살", "축": "천살", "인": "지살", "묘": "도화", "진": "월살", "사": "망신", "오": "장성", "미": "반안", "신": "역마", "유": "육액", "술": "화개", "해": "겁살" },
    "유": { "자": "육액", "축": "화개", "인": "겁살", "묘": "재살", "진": "천살", "사": "지살", "오": "도화", "미": "월살", "신": "망신", "유": "장성", "술": "반안", "해": "역마" },
    "자": { "자": "장성", "축": "반안", "인": "역마", "묘": "육액", "진": "화개", "사": "겁살", "오": "재살", "미": "천살", "신": "지살", "유": "도화", "술": "월살", "해": "망신" },
  };

  const key = groupMapping[yearBranch];
  return key && mapping[key] ? mapping[key][branch] || "" : "";
}

function getTwelveShinsalDynamic(dayPillar, yearPillar, targetBranch) {
  const isDayBasis  = document.getElementById("s12CtrlType04").checked;
  const referenceBranch = isDayBasis
    ? dayPillar.charAt(1)
    : yearPillar.charAt(1);

  const isModern = document.getElementById("s12CtrlType01").checked;
  const isGaehwa = document.getElementById("s12CtrlType03").checked;

  if (isModern) {
    return isGaehwa
      ? getTwelveShinsal8(referenceBranch, targetBranch)
      : getTwelveShinsal82(referenceBranch, targetBranch);
  } else {
    return isGaehwa
      ? getTwelveShinsal(referenceBranch, targetBranch)
      : getTwelveShinsal2(referenceBranch, targetBranch);
  }
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

function getMonthGanZhiForWolwoon(year, month) {
  const yearGanZhi     = getYearGanZhiForSewoon(year);
  const yearStem       = yearGanZhi.charAt(0);
  const yearStemIndex  = Cheongan.indexOf(yearStem);
  
  const monthStemIndex = (yearStemIndex * 2 + month) % 10;
  const monthBranchIndex = (month) % 12;
  
  return Cheongan[monthStemIndex] + Jiji[monthBranchIndex];
}

function updateColorClasses() {
  const bgColorClasses = ['b_green','b_red','b_yellow','b_white','b_black'];

  document.querySelectorAll(".ganji_w").forEach(elem => {
    const val = elem.innerHTML.trim();
    bgColorClasses.forEach(cls => elem.classList.remove(cls));
    if (colorMapping[val]) elem.classList.add(colorMapping[val].bgColor);
  });

  // 공통 셀렉터
  const selector = [
    ".grid_box_1 li b",
    ".ganji b",
    ".ilwoon_ganji_cheongan span",
    ".ilwoon_ganji_jiji span"
  ].join(", ");

  document.querySelectorAll(selector).forEach(elem => {
    const val = elem.textContent.trim();

    const isSpan = elem.matches(".ilwoon_ganji_cheongan span, .ilwoon_ganji_jiji span");
    if (isSpan) {
      const cls = colorMapping2[val]?.bgColor;
      if (!cls) return;
      bgColorClasses.forEach(c => elem.classList.remove(c));
      elem.classList.add(cls);
    } else {
      const cls = colorMapping[val]?.bgColor;
      if (!cls) return;

      const container = elem.closest('.hanja_con');
      if (!container) return;
      bgColorClasses.forEach(c => container.classList.remove(c));
      container.classList.add(cls);
      const next = container.nextElementSibling;
      if (next?.tagName.toLowerCase() === 'p') {
        bgColorClasses.forEach(c => next.classList.remove(c));
        next.classList.add(cls);
      }
    }
  });
}

function appendTenGod(id, value, isStem = true) {
  const el = document.getElementById(id);
  if (!el) return;

  let tenGod;
  if (value === '-' || value === '(-)') {
    tenGod = '없음';
  } else {
    tenGod = isStem
      ? getTenGodForStem(value, baseDayStem)
      : getTenGodForBranch(value, baseDayStem);
  }

  el.innerHTML = '';
  el.append(document.createTextNode(value));

  const span = document.createElement('span');
  span.className = 'ten-god';
  span.textContent = `(${tenGod})`;
  el.append(document.createTextNode(' '), span);
}      

function updateHiddenStems(SetBranch, prefix) {
  const mapping = hiddenStemMapping[SetBranch] || ["-", "-", "-"];
  mapping.forEach((value, i) => {
    const id = prefix + "Jj" + (i + 1);
    appendTenGod(id, value, true);
  });
}

function setText(id, text) {
  const elem = document.getElementById(id);
  if (elem) elem.innerText = text;
}

function updateStemInfo(prefix, splitData, baseDayStem, suffix = "") {
  const gan = splitData.gan;
  const hanja    = stemMapping[gan]?.hanja    ?? "-";
  const hanguel  = stemMapping[gan]?.hanguel  ?? "-";
  const eumYang  = stemMapping[gan]?.eumYang  ?? "-";
  const tenSin   = (prefix === "Dt")
    ? "본원"
    : (getTenGodForStem(gan, baseDayStem)  ?? "-");

  setText(prefix + "Hanja"  + suffix, hanja);
  setText(prefix + "Hanguel"+ suffix, hanguel);
  setText(prefix + "Eumyang"+ suffix, eumYang);
  setText(prefix + "10sin"  + suffix, tenSin);
}

function updateBranchInfo(prefix, branch, baseDayStem, suffix = "") {
  const hanja   = branchMapping[branch]?.hanja    || "-";
  const hanguel = branchMapping[branch]?.hanguel  || "-";
  const eumYang = branchMapping[branch]?.eumYang  || "-";
  const tenSin  = getTenGodForBranch(branch, baseDayStem) || "-";

  setText(prefix + "Hanja"   + suffix, hanja);
  setText(prefix + "Hanguel" + suffix, hanguel);
  setText(prefix + "Eumyang" + suffix, eumYang);
  setText(prefix + "10sin"   + suffix, tenSin);

  updateHiddenStems(branch, prefix + suffix);
}

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
      p.monthPillar = getMonthGanZhi(corrDate);
      p.dayPillar   = getDayGanZhi(corrDate);
      p.hourPillar  = getHourGanZhi(corrDate);

      // 3-c) 음력 입력자만, "원래 음력 기준" 기둥도 별도 저장
      if (p.isLunar) {
        p.lunarYearPillar  = getYearGanZhi(originalDate);
        p.lunarMonthPillar = getMonthGanZhi(originalDate);
        p.lunarDayPillar   = getDayGanZhi(originalDate);
        p.lunarHourPillar  = getHourGanZhi(originalDate);
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
  const ipChun    = getSolarTermBoundaries(solarYear, 315)[0].date;   // 입춘 날짜

  const ganZhiYear = (dateObj < ipChun) ? solarYear - 1 : solarYear;

  const idx = (ganZhiYear - 4) % 60;

  return toGz(idx);
}

function getMonthGanZhiRef(dateObj) {
  const boundaries = getSolarTermBoundaries(dateObj.getFullYear());        
  const monthNo    = getMonthNumber(dateObj, boundaries);

  const yearIdx     = Cheongan.indexOf(getYearGanZhi(dateObj, dateObj.getFullYear())[0]);
  const branchIdx   = (monthNo + 1) % 12;           // 立春(1)→寅(2)→branchIdx=2 … 4月(3)→진(4)
  const stemIdx     = (yearIdx * 2 + branchIdx) % 10;
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
      console.log(`Migrated profile ${key} to schema v${CURRENT_SCHEMA_VERSION}`);
    });
}

// 호출 위치: main.js 또는 초기화 로직 맨 앞
migrateAllProfiles();

document.addEventListener("DOMContentLoaded", function () {

  migrateTenGods();

  let currentMyeongsik = null;

  window.scrollTo(0, 0);

  const calculateBtn = document.getElementById('calcBtn');

  const exclude = ['db10sin', 'sb10sin', 'Mob10sin'];
  document.querySelectorAll('[id*="b10sin"]').forEach(el => {
    const isExcluded = exclude.some(sub => el.id.includes(sub));
    if (!isExcluded) {
      el.style.display = 'none';
    }
  });

  document.querySelectorAll('[id*="Jj3"]').forEach(el => {
    el.classList.add('jeonggi');
  });

  function updatePickerVisibility2(mode) {
      document.getElementById("woonTimeSetPicker2").style.display = 'none';
      document.getElementById("woonTimeSetPickerVer22").style.display = 'none';
      document.getElementById("woonTimeSetPickerVer23").style.display = 'none';
    
      currentMode = mode;
    
      if (mode === 'ver22') {
        document.getElementById("woonTimeSetPickerVer22").style.display = '';
        isPickerVer22 = true;
        isPickerVer23 = false;
      } else if (mode === 'ver23') {
        document.getElementById("woonTimeSetPickerVer23").style.display = '';
        isPickerVer22 = false;
        isPickerVer23 = true;
      } else if (mode === 'ver21') {
        document.getElementById("woonTimeSetPicker2").style.display = '';
        isPickerVer22 = false;
        isPickerVer23 = false;
      }
    }

  let lastScrollTop = 0;
  const header = document.querySelector('header');
  const checkOption = document.querySelector('#checkOption');

  window.addEventListener("scroll", function () {
    const scrollTop = window.scrollY;
    const headerHeight = header.offsetHeight;
    const checkOptionHeight = checkOption.offsetHeight;

    if (scrollTop <= headerHeight) {
      header.style.top = '0';
      checkOption.style.top = `${headerHeight}px`;
      checkOption.classList.remove("fixed");

    } else {
      // ── headerHeight 이상 스크롤 됐을 때부터만 hide/show 적용
      if (scrollTop > lastScrollTop) {
        header.style.top = `${-(headerHeight + checkOptionHeight)}px`;
        checkOption.style.top = `-${headerHeight}px`;
      } else {
        header.style.top = '0';
        checkOption.style.top = `${headerHeight}px`;
      }
      if (scrollTop >= headerHeight) {
        checkOption.classList.add("fixed");
      }
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  });


  const inputName = document.getElementById("inputName");
  if (inputName) {
    inputName.addEventListener("input", function () {
      if (this.value.length > 10) {
        this.value = this.value.slice(0, 10);
      }
    });
  }

  document.getElementById("bitthPlaceX").addEventListener("change", function () {
    const birthPlaceSelect = document.getElementById("inputBirthPlace");
    if (this.checked) {
      birthPlaceSelect.value = ""; // 혹은 "출생지 선택" 옵션의 실제 value 값
      birthPlaceSelect.disabled = true; // 선택 비활성화도 가능
    } else {
      birthPlaceSelect.disabled = false;
    }
  });

  document.getElementById("bitthTimeX").addEventListener("change", function () {
    const birthTimeSelect = document.getElementById("inputBirthtime");
    if (this.checked) {
      birthTimeSelect.value = ""; // 혹은 "출생지 선택" 옵션의 실제 value 값
      birthTimeSelect.disabled = true; // 선택 비활성화도 가능
    } else {
      birthTimeSelect.disabled = false;
    }
  });

  const coupleModeBtnV = document.getElementById('coupleModeBtn');

  function updateSaveBtn() {
    // 1) localStorage에서 원본 문자열을 꺼낸다
    let raw = localStorage.getItem("myeongsikList");
    // 2) 값이 없거나 "undefined" 문자열이면 빈 배열 문자열로 대체
    if (raw === null || raw === "undefined") {
      raw = "[]";
    }
    // 3) 그 뒤에야 안전하게 파싱
    const savedList = JSON.parse(raw);
  
    const saveBtn = document.getElementById('saveBtn');
    const topPsBtn = document.getElementById('topPs');
  
    // 이제 savedList는 언제나 배열이므로 length 접근해도 안전
    saveBtn.disabled = (savedList.length === 0);
  
    if (currentDetailIndex === null) {
      saveBtn.style.display      = 'none';
      topPsBtn.style.display     = 'none';
      coupleModeBtnV.style.display = 'none';
    } else {
      if (savedList.length <= 1) {
        saveBtn.style.display      = 'none';
        coupleModeBtnV.style.display = 'none';
        topPsBtn.style.display     = '';
      } else {
        saveBtn.style.display      = 'none';
        coupleModeBtnV.style.display = '';
        topPsBtn.style.display     = '';
      }
    }
  }

  updateSaveBtn();

  function updateMeGroupOption(selectedVal = null) {
    const sel = document.getElementById('inputMeGroup');
    if (!sel) return;
  
    const selfOpt = sel.querySelector('option[value="본인"]');
    if (!selfOpt) return;
  
    let raw = localStorage.getItem('myeongsikList');
    if (raw === null || raw === 'undefined') raw = '[]';
    const savedList = JSON.parse(raw);
  
    const hasSelf = savedList.some(v => v.group === '본인');
  
    if (hasSelf && selectedVal !== '본인') {
      selfOpt.style.display = 'none';
    } else {
      selfOpt.style.display = '';
      selfOpt.disabled = false;
    }
  }  

  function ensureGroupOption(value) {
    if (!value || value === '기타입력') return;       // '기타입력' 자체는 건드리지 않음
  
    const sel = document.getElementById('inputMeGroup');
    if (!sel) return;
  
    if ([...sel.options].some(opt => opt.value === value)) return;
  
    const opt = document.createElement('option');
    opt.value = value;
    opt.textContent = value;
  
   
    const etcInputOpt = sel.querySelector('option[value="기타입력"]');
    if (etcInputOpt) {
      sel.insertBefore(opt, etcInputOpt);   
    } else {
      sel.appendChild(opt);               
    }
  }

  const saved = JSON.parse(localStorage.getItem('customGroups') || '[]');
  saved.forEach(ensureGroupOption);
  updateMeGroupOption();

  document.getElementById("saveBtn").addEventListener("click", function () {
    const birthday = document.getElementById("inputBirthday").value.trim();
    const birthtimeRaw = document.getElementById("inputBirthtime").value.trim();
    isTimeUnknown = document.getElementById("bitthTimeX").checked;
    isPlaceUnknown = document.getElementById("bitthPlaceX").checked;
    const gender = document.getElementById("genderMan").checked ? "남" : "여";
    const birthPlaceInput = document.getElementById("inputBirthPlace").value;
    const name = document.getElementById("inputName").value.trim() || "이름없음";
  
    const year = parseInt(birthday.substring(0, 4), 10);
    const month = parseInt(birthday.substring(4, 6), 10);
    const day = parseInt(birthday.substring(6, 8), 10);
    const hour = isTimeUnknown ? 4 : parseInt(birthtimeRaw.substring(0, 2), 10);
    const minute = isTimeUnknown ? 30 : parseInt(birthtimeRaw.substring(2, 4), 10);

    const monthType = document.getElementById('monthType').value.trim() || '양력';

    const savedBirthPlace = isPlaceUnknown ? "기본출생지 : 서울" : birthPlaceInput;
  
    const displayHour = isTimeUnknown ? "-" : birthtimeRaw.substring(0, 2);
    const displayMinute = isTimeUnknown ? "-" : birthtimeRaw.substring(2, 4);
    const displayBirthtimeFormatted = `${displayHour}${displayMinute}`;
  
    const computedResult = getFourPillarsWithDaewoon(year, month, day, hour, minute, gender, correctedDate);
    const pillarsPart = computedResult.split(", ")[0]; 
    const pillars = pillarsPart.split(" ");
    const yearPillar = pillars[0] || "";
    const monthPillar = pillars[1] || "";
    const dayPillar = pillars[2] || "";
    const hourPillar = isTimeUnknown ? "-" : (pillars[3] || "");
  
    function clearHourUI() {
      document.getElementById("inputBirthtime").value = "";
      updateStemInfo("Ht", { gan: "-", ji: "-" }, baseDayStem);
      updateBranchInfo("Hb", "-", baseDayStem);
      ["Hb12ws","Hb12ss"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = "-";
      });
    }

    if (isTimeUnknown) {
      const resbjTimeEl = document.getElementById('resbjTime');
      resbjTimeEl.innerText = '보정시모름';
      correctedDate = new Date(year, month - 1, day, false);
      clearHourUI();
    } 

    function formatTime(date) {
      if (!date) return "-";
      const hours = date.getHours();
      const minutes = date.getMinutes();
      return `${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes}`;
    }
  
    const age = correctedDate ? calculateAge(correctedDate) : "-";
    const birthdayTime = correctedDate ? formatTime(correctedDate) : "?";

    const selectedTime2 = document.querySelector('input[name="time2"]:checked').value || "";

    let groupVal = document.getElementById('inputMeGroup').value;
    ensureGroupOption(groupVal);
    const customGroups = JSON.parse(localStorage.getItem('customGroups') || '[]');
    if (!customGroups.includes(groupVal)) {
      customGroups.push(groupVal);
      localStorage.setItem('customGroups', JSON.stringify(customGroups));
    }
    
    const newData = {
      birthday: birthday,
      monthType: monthType,
      birthtime: displayBirthtimeFormatted,
      year: year,
      month: month,
      day: day,
      hour: hour,
      minute: minute, 
      gender: gender,
      birthPlace: savedBirthPlace,
      name: name,
      result: computedResult,
      yearPillar: yearPillar,
      monthPillar: monthPillar,
      dayPillar: dayPillar,
      hourPillar: hourPillar,
      age: age,
      birthdayTime,
      isTimeUnknown,
      isPlaceUnknown,
      selectedTime2,
      group: groupVal,
      createdAt: Date.now(),
      isFavorite : false,
      birthPlaceFull,
      birthPlaceLongitude: cityLon,
      correctedDate: correctedDate,
    };

    latestMyeongsik = newData;

    // 저장 중복 검사
    const raw = localStorage.getItem('myeongsikList');
    const list = JSON.parse(raw === null || raw === 'undefined' ? '[]' : raw);

    
    const alreadySaved = list.some(function (item) {
      return item.birthday === newData.birthday &&
            item.birthtime === newData.birthtime &&
            item.gender === newData.gender &&
            item.birthPlace === newData.birthPlace &&
            //item.name === newData.name &&
            item.selectedTime2 === newData.selectedTime2;  
    });
    if (alreadySaved) {
      const confirmSave = confirm("이미 같은 정보의 명식이 존재합니다. 한 번 더 저장하시겠습니까?");
      if (!confirmSave) return;
    }
  
    // 저장
    // 이제 list는 항상 배열이므로 안전하게 조작
    list.push(makeNewData());
    localStorage.setItem('myeongsikList', JSON.stringify(list));
    loadSavedMyeongsikList();
    alert("저장이 성공적으로 완료 되었습니다.");

    updateMeGroupOption(selectedVal = null);
    updateSaveBtn();

    const savedList = JSON.parse(localStorage.getItem("myeongsikList")) || [];
    if (savedList.length >= 2) {
      coupleModeBtnV.style.display = '';   
    } else {
      coupleModeBtnV.style.display = 'none'; 
    }
  });

  const inputMeGroupSel = document.getElementById('inputMeGroup');
  const groupEctWrap    = document.getElementById('groupEct');  // div.input_group.group_ect
  const inputMeGroupEct = document.getElementById('inputMeGroupEct');

  function toggleGroupEct () {
    if (inputMeGroupSel.value === '기타입력') {
      groupEctWrap.style.display = 'block';
    } else {
      groupEctWrap.style.display = 'none';
      inputMeGroupEct.value = '';       // ★ 내용 초기화
    }
  }
  inputMeGroupSel.addEventListener('change', toggleGroupEct);
  toggleGroupEct();           

  function loadSavedMyeongsikList() {
    const savedList = JSON.parse(localStorage.getItem("myeongsikList")) || [];
    savedMyeongsikList = savedList;

    const listUl = document.querySelector("aside .list_ul");
    const dragNotice = document.querySelector("#dragNotice");

    if (!listUl) return;
    listUl.innerHTML = "";

    function toggleFavorite(index) {
      let list = JSON.parse(localStorage.getItem('myeongsikList')) || [];
      if (!list[index]) return;
    
      const [item] = list.splice(index, 1);
      item.isFavorite = !item.isFavorite;
    
      if (item.isFavorite) {
        const lastFavIdx = list.reduce((p, c, i) => c.isFavorite ? i : p, -1);
        list.splice(lastFavIdx + 1, 0, item);
      } else {
        const lastFavIdx = list.reduce((p, c, i) => c.isFavorite ? i : p, -1);
        list.splice(lastFavIdx + 1, 0, item);   // 즐겨찾기 블록 바로 뒤
      }
    
      localStorage.setItem('myeongsikList', JSON.stringify(list));
      loadSavedMyeongsikList();
    
      const viewStar = document.getElementById('topPs');
      if (viewStar && currentDetailIndex === index) {
        viewStar.textContent = item.isFavorite ? '★ ON' : '☆ OFF';
      }
    }

    savedList.forEach((item, index) => {
      if (isCoupleMode && index === currentDetailIndex) {
        return;
      }

      const li = document.createElement("li");
      li.setAttribute("data-index", index);

      function formatBirthtime(birthtime) {
        if (!birthtime) return "-";
        const cleaned = birthtime.replace(/\s/g, "").trim();
        if (cleaned.length !== 4 || isNaN(cleaned)) return "-";
        return cleaned.substring(0, 2) + "시" + cleaned.substring(2, 4) + "분";
      }
      const birthtimeDisplay = item.isTimeUnknown ? "시간모름" : formatBirthtime(item.birthtime?.replace(/\s/g, "").trim());
      const birthPlaceDisplay = (item.isPlaceUnknown === true) 
                                ? "출생지無" 
                                : (item.birthPlace?.trim() && item.birthPlace.trim() !== "출생지 선택"
                                    ? item.birthPlace.trim()
                                    : "-");
      const displayTimeLabel = item.isTimeUnknown
        ? "시기준無"
        : (item.selectedTime2 === "jasi"
            ? "자시"
            : item.selectedTime2 === "yajasi"
              ? "야 · 조자시"
              : item.selectedTime2 === "insi"
                ? "인시"
                : "-");

        const formattedBirthday =
        item.birthday.substring(0, 4) + "." +
        item.birthday.substring(4, 6) + "." +
        item.birthday.substring(6, 8) + "";

        // ★ 여기서 monthTypeLabel은 item.monthType 그대로!
        const isLunar = item.monthType === '음력' ? true : false;


        const monthTypeLabel = isLunar ? '음력' : '양력';
      //const monthTypeLabel = item.monthType;

      //const lunarBirthDisplay = item.lunarBirthday || "-";
      // 음력 생일: 값이 있으면 그대로, 없으면 "-"
      //const lunarBirthDisplay = item.lunarBirthday ? item.lunarBirthday : "-";
      // 보정시: item.adjustedTime 값이 있으면, 없으면 "-"
      const { isTimeUnknown, birthdayTime } = item;
      const adjustedTimeDisplay = isTimeUnknown
        ? "보정시 모름"
        : (birthdayTime || "-");

      /////////////////////////
      //${lunarBirthDisplay !== "-" 
      //  ? `<span id="lunarBirthSV_${index+1}">(${lunarBirthDisplay})</span><br>` 
      //  : ""
      //}
      // 1) 네 기둥 변수 선언
      let yearPillar, monthPillar, dayPillar, hourPillar;

      // 2) “음력 + 시간 모름”인 경우에만 변환 & 재계산
      if (item.monthType === '음력' && item.isTimeUnknown) {
        const cal = new KoreanLunarCalendar();
        cal.setLunarDate(item.year, item.month, item.day, false);
        const dateL = new Date(item.year, item.month - 1, item.day, 4, 0);
        yearPillar  = getYearGanZhi(dateL, dateL.getFullYear());
        monthPillar = getMonthGanZhi(dateL, dateL.getFullYear());
        dayPillar   = getDayGanZhi(dateL);
        hourPillar = '-';
      } else {
        // 그 외는 기존에 저장된 값 그대로
        yearPillar  = item.yearPillar  || "-";
        monthPillar = item.monthPillar || "-";
        dayPillar   = item.dayPillar   || "-";
        hourPillar  = item.isTimeUnknown ? "-" : item.hourPillar;
      }

      const starState = item.isFavorite ? '★ ON' : '☆ OFF';

      li.innerHTML += `
        <div class="info_btn_zone">
          <button class="drag_btn_zone" id="dragBtn_${index + 1}">
            <div class="line"></div>
            <div class="line"></div>
            <div class="line"></div>
          </button>
          <ul class="info">
            <li class="name_age" id="nameAge">
              <div class="type_sv_wrap">
                <b class="type_sv" id="typeSV_${index + 1}">${item.group || '미선택'}</b>
                <button class="type_sv star_btn"
                  id="topPs_${index + 1}"
                  data-index="${index}">
                  ${starState}
                </button>
              </div>
              <span><b id="nameSV_${index + 1}">${item.name}</b></span>
              <span>(만 <b id="ageSV_${index + 1}">${item.age}</b>세, <b id="genderSV_${index + 1}">${item.gender}</b>)</span>
            </li>
            <li class="ganzi" id="ganZi_${index+1}">
              <span><b id="yearGZ_${index+1}">${yearPillar}</b>년</span>
              <span><b id="monthGZ_${index+1}">${monthPillar}</b>월</span>
              <span><b id="dayGZ_${index+1}">${dayPillar}</b>일</span>
              <span><b id="timeGZ_${index+1}">${hourPillar}</b>시</span>
            </li>
            <li class="birth_day_time" id="birthDayTime">
              <span id="birthdaySV_${index+1}">
                ${formattedBirthday} (${monthTypeLabel})
                (<b id="selectTime2__${index+1}">${displayTimeLabel}</b>)
              </span><br>
              
              <span id="birthtimeSV_${index+1}">${birthtimeDisplay}</span>
              <span id="adjustedTimeSV_${index+1}">
                (보정시: ${adjustedTimeDisplay})
              </span>
            </li>
            <li>
              <span><b id="birthPlaceSV_${index + 1}">${birthPlaceDisplay}</b></span>
            </li>
          </ul>
        </div>
      `;

      if (isCoupleMode) {
        li.innerHTML += `
          <div class="btn_zone">
            <button class="black_btn couple_btn" data-index="couple_${index}"><span>궁합모드선택</span></button>
          </div>
        `;
      } else {
        li.innerHTML += `
          <div class="btn_zone">
            <button class="black_btn detailViewBtn" id="detailViewBtn_${index + 1}" data-index="${index}">명식 보기</button>
            <button class="black_btn modify_btn" id="modifyBtn_${index + 1}" data-index="${index}">수정</button>
            <button class="black_btn delete_btn" data-index="delete_${index + 1}"><span>&times;</span></button>
          </div>
        `;
      }

      // <button class="black_btn modify_btn" id="modifyBtn_${index + 1}" data-index="${index}">수정</button>

      li.querySelector(`#topPs_${index + 1}`).addEventListener('click', e => {
        e.stopPropagation();
        toggleFavorite(parseInt(e.target.dataset.index, 10));
      });

      li.querySelector(".name_age").dataset.original = li.querySelector(".name_age").innerHTML;
      li.querySelector(".ganzi").dataset.original = li.querySelector(".ganzi").innerHTML;
      li.querySelector(".birth_day_time").dataset.original = li.querySelector(".birth_day_time").innerHTML;

      listUl.appendChild(li);
    });

    const alignTypeSel = document.getElementById('alignType');
    alignTypeSel.addEventListener('change', handleSortChange);

    function handleSortChange () {
      const sortKey = alignTypeSel.value;
      let list      = JSON.parse(localStorage.getItem('myeongsikList')) || [];
    
      // 1) 즐겨찾기 / 일반 분리
      const favs  = list.filter(v => v.isFavorite);
      let others  = list.filter(v => !v.isFavorite);
    
      // 2) others만 정렬
      const sorter = {
        '관계순'   : (a, b) => (a.group   || '').localeCompare(b.group   || ''),
        '관계역순' : (a, b) => (b.group   || '').localeCompare(a.group   || ''),
        '나이순'   : (a, b) => (a.age ?? 0) - (b.age ?? 0),
        '나이역순' : (a, b) => (b.age ?? 0) - (a.age ?? 0),
        '이름순'   : (a, b) => (a.name    || '').localeCompare(b.name    || ''),
        '이름역순' : (a, b) => (b.name    || '').localeCompare(a.name    || ''),
        '등록순'   : (a, b) => (a.createdAt ?? 0) - (b.createdAt ?? 0),
        '등록역순' : (a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0)
      };

      if (sorter[sortKey]) saved.sort(sorter[sortKey]);
      localStorage.setItem('myeongsikList', JSON.stringify(saved)); // 정렬 결과 저장
      loadSavedMyeongsikList();  // 리스트 다시 뿌리기
      if (sorter[sortKey]) others.sort(sorter[sortKey])

      list = [...favs, ...others];

      localStorage.setItem('myeongsikList', JSON.stringify(list));
      loadSavedMyeongsikList();
    }

    if (savedList.length >= 2) {
      dragNotice.style.display = "block";
      document.querySelectorAll(".drag_btn_zone").forEach(btn => {
        btn.style.display = "block";
      });
    } else {
      dragNotice.style.display = "none";
      document.querySelectorAll(".drag_btn_zone").forEach(btn => {
        btn.style.display = "none";
      });
    }


    function handleViewClick() {
      if (isModifyMode) {
        const confirmLeave = confirm("수정된 내용을 저장하지 않았습니다. 정말 이동하시겠습니까?");
        if (!confirmLeave) return; // 사용자가 취소하면 함수 종료
      }
      
      isModifyMode = false;
      originalDataSnapshot = "";
      currentModifyIndex = null;
      updateSaveBtn();
      
    }

    // function resetHourButtons() {
      
    //   const colorZip = ["b_green", "b_red", "b_white", "b_black", "b_yellow"];
    //   const allButtons = document.querySelectorAll("#hourList button");
    //   const useJasiMode = document.getElementById('jasi').checked;
    //   const timeLabels = useJasiMode ? Jiji : MONTH_ZHI;
    //   const mapping = useJasiMode ? fixedDayMappingBasic : fixedDayMapping;
    //   const sijuList = mapping[baseDayStem];
    //   allButtons.forEach((btn, i) => {
    //     btn.classList.remove("active", ...colorZip);
    //     btn.innerHTML = `${timeLabels[i]}시 (${sijuList[i]})`;
    //   });
      
    //   document.getElementById("bitthTimeX").checked = true;
    // }
    
    const backBtn = document.getElementById("backBtn");
    
    document.querySelectorAll(".detailViewBtn").forEach(function (button) {
      button.addEventListener("click", function (e) {
        e.stopPropagation();
        
        backBtn.style.display = '';
        
        handleViewClick();
        
        const saved = localStorage.getItem("fixedCorrectedDate");
        if (saved) fixedCorrectedDate = new Date(saved);
    
        loadCityLongitudes();
        const idx = parseInt(button.getAttribute("data-index"), 10);
        currentDetailIndex = idx;
        const item = savedList[idx];
        currentMyeongsik = item;
        if (!item) return;

        // ── 4) 저장
        localStorage.setItem(idx, JSON.stringify(item));
        console.log(`Migrated profile ${idx} to schema v${CURRENT_SCHEMA_VERSION}`);
    
    
        restoreCurrentPlaceMapping(item);
        new Date(localStorage.getItem('correctedDate'));
    
        document.getElementById('wongookLM').classList.remove("w100");
        document.getElementById('luckyWrap').style.display   = 'block';
        document.getElementById('woonArea').style.display    = 'block';
        document.getElementById('woonContainer').style.display = 'none';
        document.getElementById('calArea').style.display     = 'none';
    
        document.getElementById("inputName").value     = item.name;
        document.getElementById("inputBirthday").value = item.birthday;
    
        if (item.isTimeUnknown) {
          function clearAllColorClasses() {
            const classesToRemove = [
              "b_green","b_red","b_white","b_black","b_yellow","active"
            ];
            document.querySelectorAll('.siju_con .hanja_con, .siju_con p').forEach(el => {
              el.classList.remove(...classesToRemove);
            });
          }
          setTimeout(()=>{
            clearAllColorClasses();
          }, 100)
          document.getElementById("bitthTimeX").checked   = true;
          document.getElementById("inputBirthtime").value = "";
        } else {
          document.getElementById("bitthTimeX").checked   = false;
          document.getElementById("inputBirthtime").value = item.birthtime.replace(/\s/g, "");
        }
    
        if (item.isPlaceUnknown) {
          document.getElementById("bitthPlaceX").checked     = true;
          document.getElementById("inputBirthPlace").value = "출생지 선택";
        } else {
          document.getElementById("bitthPlaceX").checked     = false;
          document.getElementById("inputBirthPlace").value = item.birthPlace;
        }
    
        if (item.gender === "남") {
          document.getElementById("genderMan").checked   = true;
          document.getElementById("genderWoman").checked = false;
        } else {
          document.getElementById("genderWoman").checked = true;
          document.getElementById("genderMan").checked   = false;
        }

        const selTime = item.selectedTime2 || 'insi';
        const r1 = document.querySelector(`input[name="time2"][value="${selTime}"]`);
        const r2 = document.querySelector(`input[name="timeChk02"][value="${selTime}"]`);
        if (r1) r1.checked = true;
        if (r2) r2.checked = true;

        const monthTypeSel = document.getElementById("monthType");
        monthTypeSel.value = item.monthType;
        monthTypeSel.dispatchEvent(new Event("change"));
        
        calculateBtn.click();

        let yearPillar, monthPillar, dayPillar, hourPillar;

        if (item.monthType === '음력' && item.isTimeUnknown) {
          const cal = new KoreanLunarCalendar();
          cal.setLunarDate(item.year, item.month, item.day, false);
          const dateL = new Date(item.year, item.month - 1, item.day, 4, 0);
          yearPillar  = getYearGanZhi(dateL, dateL.getFullYear());
          monthPillar = getMonthGanZhi(dateL, dateL.getFullYear());
          dayPillar = getDayGanZhi(dateL);
          hourPillar = '-';

          const yearSplit  = splitPillar(yearPillar);
          const monthSplit = splitPillar(monthPillar);
          const daySplit   = splitPillar(dayPillar);
          daySplitGlobal = daySplit;
          let hourSplit  = isTimeUnknown ? null : "-";
          hourSplitGlobal = hourSplit;

          baseDayStem = daySplit.gan;
          baseDayBranch = dayPillar.charAt(1);
          baseYearBranch = yearPillar.charAt(1);
          
          setTimeout(()=>{
            function updateOriginalSetMapping(daySplit, hourSplit) {
              if (manualOverride) {
                return;
              }
              setText("Hb12ws", isTimeUnknown ? "-" : getTwelveUnseong(baseDayStem, hourSplit.ji));
              setText("Hb12ss", isTimeUnknown ? "-" : getTwelveShinsalDynamic(dayPillar, yearPillar, hourSplit.ji));
              setText("Db12ws", getTwelveUnseong(baseDayStem, daySplit.ji));
              setText("Db12ss", getTwelveShinsalDynamic(dayPillar, yearPillar, daySplit.ji));
              setText("Mb12ws", getTwelveUnseong(baseDayStem, monthSplit.ji));
              setText("Mb12ss", getTwelveShinsalDynamic(dayPillar, yearPillar, monthSplit.ji));
              setText("Yb12ws", getTwelveUnseong(baseDayStem, baseYearBranch));
              setText("Yb12ss", getTwelveShinsalDynamic(dayPillar, yearPillar, baseYearBranch));
            }
        
            updateStemInfo("Yt", yearSplit, baseDayStem);
            updateStemInfo("Mt", monthSplit, baseDayStem);
            updateStemInfo("Dt", daySplit, baseDayStem);
            updateStemInfo("Ht", isTimeUnknown ? "-" : hourSplit, baseDayStem);
            updateBranchInfo("Yb", baseYearBranch, baseDayStem);
            updateBranchInfo("Mb", monthSplit.ji, baseDayStem);
            updateBranchInfo("Db", daySplit.ji, baseDayStem);
            updateBranchInfo("Hb", isTimeUnknown ? "-" : hourSplit.ji, baseDayStem);
            updateOriginalSetMapping(daySplit, hourSplit);
            updateColorClasses();
          });
        }
        
        const typeSpan = document.getElementById('typeSV');
        if (typeSpan) {
          typeSpan.innerHTML = `<b>${item.group || '미선택'}</b>`;
        }
    
        const viewStar = document.getElementById('topPs');
        if (viewStar) {
          viewStar.textContent = item.isFavorite ? '★ ON' : '☆ OFF';
          viewStar.onclick = () => toggleFavorite(idx);
        }
    
        updateSaveBtn();
        document.getElementById("woonVer1Change").click();
        document.getElementById("woonChangeBtn").click();
        const sewoonBox = document.querySelector(".lucky.sewoon");
        if (sewoonBox) { sewoonBox.style.display = "grid"; }
        const wolwoonBox = document.querySelector(".lucky.wolwoon");
        const wongookLM = document.getElementById("wongookLM");
        if (wolwoonBox && wongookLM && !wongookLM.classList.contains("no_wolwoon")) {
          if (wolwoonBox) { wolwoonBox.style.display = "grid"; }
        }
        
        const iljuCalenderBox = document.getElementById('iljuCalender');
        if (iljuCalenderBox) { iljuCalenderBox.style.display = "block"; }
    
        document.getElementById("aside").style.display      = "none";
        document.getElementById("inputWrap").style.display  = "none";
        document.getElementById("resultWrapper").style.display = "block";
        
        window.scrollTo(0, 0);
      });
    });
  
    document.querySelectorAll(".delete_btn").forEach(function (button) {
      button.addEventListener("click", function (e) {
        e.stopPropagation();
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
        updateSaveBtn();
      });
    });

    function safeSetValue(elementId, value) {
      var el = document.getElementById(elementId);
      if (el) {
        el.textContent = value;
      } else {
        console.warn("요소를 찾을 수 없음:", elementId);
      }
    }

    function updateOriginalAndMyowoon(refDate) {
      const myData = latestMyeongsik;

      const isMyTimeUnknown      = !!myData.isTimeUnknown;
      const isPartnerTimeUnknown = !!partnerData.isTimeUnknown;
      
      const p_yearPillar = myData.yearPillar;
      const p_monthPillar = myData.monthPillar;
      const p_dayPillar = myData.dayPillar;
      const p_hourPillar = myData.isTimeUnknown ? "-" : myData.hourPillar;

      const part_yearPillar = partnerData.yearPillar;
      const part_monthPillar = partnerData.monthPillar;
      const part_dayPillar = partnerData.dayPillar;
      const part_hourPillar = partnerData.isTimeUnknown ? "-" : partnerData.hourPillar;

      const p_yearSplit = splitPillar(p_yearPillar);
      const p_monthSplit = splitPillar(p_monthPillar);
      const p_daySplit = splitPillar(p_dayPillar);
      const p_hourSplit = myData.isTimeUnknown ? "-" : splitPillar(p_hourPillar);
      
      const part_yearSplit = splitPillar(part_yearPillar);
      const part_monthSplit = splitPillar(part_monthPillar);
      const part_daySplit = splitPillar(part_dayPillar);
      const part_hourSplit = partnerData.isTimeUnknown ? "-" : splitPillar(part_hourPillar);

      const baseDayStem_copy = p_daySplit.gan;
      const baseDayStem_copy2 = part_daySplit.gan;

      baseDayBranch_copy = p_daySplit.ji;
      baseDayBranch_copy2 = part_daySplit.ji;

      baseYearBranch_copy = p_yearSplit.ji;
      baseYearBranch_copy2 = part_yearSplit.ji;
      
      setText("CHb12ws", isMyTimeUnknown ? "-" : getTwelveUnseong(baseDayStem_copy, p_hourSplit.ji));
      setText("CHb12ss", isMyTimeUnknown ? "-" : getTwelveShinsalDynamic(p_dayPillar, p_yearPillar, p_hourSplit.ji));
      setText("CDb12ws", getTwelveUnseong(baseDayStem_copy, p_daySplit.ji));
      setText("CDb12ss", getTwelveShinsalDynamic(p_dayPillar, p_yearPillar, p_daySplit.ji));
      setText("CMb12ws", getTwelveUnseong(baseDayStem_copy, p_monthSplit.ji));
      setText("CMb12ss", getTwelveShinsalDynamic(p_dayPillar, p_yearPillar, p_monthSplit.ji));
      setText("CYb12ws", getTwelveUnseong(baseDayStem_copy, baseYearBranch_copy));
      setText("CYb12ss", getTwelveShinsalDynamic(p_dayPillar, p_yearPillar, baseYearBranch_copy));

      setText("CPHb12ws", isPartnerTimeUnknown ? "-" : getTwelveUnseong(baseDayStem_copy2, part_hourSplit.ji));
      setText("CPHb12ss", isPartnerTimeUnknown ? "-" : getTwelveShinsalDynamic(part_dayPillar, part_yearPillar, part_hourSplit.ji));
      setText("CPDb12ws", getTwelveUnseong(baseDayStem_copy2, part_daySplit.ji));
      setText("CPDb12ss", getTwelveShinsalDynamic(part_dayPillar, part_yearPillar, part_daySplit.ji));
      setText("CPMb12ws", getTwelveUnseong(baseDayStem_copy2, part_monthSplit.ji));
      setText("CPMb12ss", getTwelveShinsalDynamic(part_dayPillar, part_yearPillar, part_monthSplit.ji));
      setText("CPYb12ws", getTwelveUnseong(baseDayStem_copy2, baseYearBranch_copy2));
      setText("CPYb12ss", getTwelveShinsalDynamic(part_dayPillar, part_yearPillar, baseYearBranch_copy2));

      updateStemInfo("CYt", p_yearSplit, baseDayStem_copy);
      updateStemInfo("CMt", p_monthSplit, baseDayStem_copy);
      updateStemInfo("CDt", p_daySplit, baseDayStem_copy);
      updateStemInfo("CHt", isMyTimeUnknown ? "-" : p_hourSplit, baseDayStem_copy);
      updateBranchInfo("CYb", baseYearBranch_copy, baseDayStem_copy);
      updateBranchInfo("CMb", p_monthSplit.ji, baseDayStem_copy);
      updateBranchInfo("CDb", p_daySplit.ji, baseDayStem_copy);
      updateBranchInfo("CHb", isMyTimeUnknown ? "-" : p_hourSplit.ji, baseDayStem_copy);

      updateStemInfo("CPYt", part_yearSplit, baseDayStem_copy2);
      updateStemInfo("CPMt", part_monthSplit, baseDayStem_copy2);
      updateStemInfo("CPDt", part_daySplit, baseDayStem_copy2);
      updateStemInfo("CPHt", isPartnerTimeUnknown ? "-" : part_hourSplit, baseDayStem_copy2);
      updateBranchInfo("CPYb", baseYearBranch_copy2, baseDayStem_copy2);
      updateBranchInfo("CPMb", part_monthSplit.ji, baseDayStem_copy2);
      updateBranchInfo("CPDb", part_daySplit.ji, baseDayStem_copy2);
      updateBranchInfo("CPHb", isPartnerTimeUnknown ? "-" : part_hourSplit.ji, baseDayStem_copy2);

      const origMyDate = new Date(
        myData.year, myData.month - 1, myData.day,
        myData.hour, myData.minute
      );
      const recMyDate = adjustBirthDateWithLon(
        origMyDate,
        myData.birthPlaceLongitude,
        myData.isPlaceUnknown
      );

      const origPartDate = new Date(
        partnerData.year, partnerData.month - 1, partnerData.day,
        partnerData.hour, partnerData.minute
      );
      const recPartDate = adjustBirthDateWithLon(
        origPartDate,
        partnerData.birthPlaceLongitude,
        partnerData.isPlaceUnknown
      );

      const p_myo = getMyounPillarsVr(
        { ...myData, correctedDate: recMyDate },
        refDate,
        myData.selectedTime2
      );
      const part_myo = getMyounPillarsVr(
        { ...partnerData, correctedDate: recPartDate },
        refDate,
        partnerData.selectedTime2
      );

      const {
        sijuCurrentPillar:   mySijuCurrent,
        iljuCurrentPillar:   myIljuCurrent,
        woljuCurrentPillar:  myWoljuCurrent,
        yeonjuCurrentPillar: myYeonjuCurrent
      } = p_myo;
      
      const {
        sijuCurrentPillar:   partnerSijuCurrent,
        iljuCurrentPillar:   partnerIljuCurrent,
        woljuCurrentPillar:  partnerWoljuCurrent,
        yeonjuCurrentPillar: partnerYeonjuCurrent
      } = part_myo; 


      const p_myo_yearSplit = splitPillar(myYeonjuCurrent);
      const p_myo_monthSplit = splitPillar(myWoljuCurrent);
      const p_myo_daySplit = splitPillar(myIljuCurrent);
      const p_myo_hourSplit = isMyTimeUnknown ? "-" : splitPillar(mySijuCurrent);
      
      const part_myo_yearSplit = splitPillar(partnerYeonjuCurrent);
      const part_myo_monthSplit = splitPillar(partnerWoljuCurrent);
      const part_myo_daySplit = splitPillar(partnerIljuCurrent);
      const part_myo_hourSplit = isPartnerTimeUnknown ? "-" : splitPillar(partnerSijuCurrent);

      setText("CMyoHb12ws", isMyTimeUnknown || isPickerVer22 || isPickerVer23 ? "-" : getTwelveUnseong(baseDayStem_copy, p_myo_hourSplit.ji));
      setText("CMyoHb12ss", isMyTimeUnknown || isPickerVer22 || isPickerVer23 ? "-" : getTwelveShinsalDynamic(p_dayPillar, p_yearPillar, p_myo_hourSplit.ji));
      setText("CMyoDb12ws", isMyTimeUnknown || isPickerVer23 ? "-" : getTwelveUnseong(baseDayStem_copy, p_myo_daySplit.ji));
      setText("CMyoDb12ss", isMyTimeUnknown || isPickerVer23 ? "-" : getTwelveShinsalDynamic(p_dayPillar, p_yearPillar, p_myo_daySplit.ji));
      setText("CMyoMb12ws", getTwelveUnseong(baseDayStem_copy, p_myo_monthSplit.ji));
      setText("CMyoMb12ss", getTwelveShinsalDynamic(p_dayPillar, p_yearPillar, p_myo_monthSplit.ji));
      setText("CMyoYb12ws", getTwelveUnseong(baseDayStem_copy, p_myo_yearSplit.ji));
      setText("CMyoYb12ss", getTwelveShinsalDynamic(p_dayPillar, p_yearPillar, p_myo_yearSplit.ji));

      setText("CPMyoHb12ws", isPartnerTimeUnknown || isPickerVer22 || isPickerVer23 ? "-" : getTwelveUnseong(baseDayStem_copy2, part_myo_hourSplit.ji));
      setText("CPMyoHb12ss", isPartnerTimeUnknown || isPickerVer22 || isPickerVer23 ? "-" : getTwelveShinsalDynamic(part_dayPillar, part_yearPillar, part_myo_hourSplit.ji));
      setText("CPMyoDb12ws", isPartnerTimeUnknown || isPickerVer23 ? "-" : getTwelveUnseong(baseDayStem_copy2, part_myo_daySplit.ji));
      setText("CPMyoDb12ss", isPartnerTimeUnknown || isPickerVer23 ? "-" : getTwelveShinsalDynamic(part_dayPillar, part_yearPillar, part_myo_daySplit.ji));
      setText("CPMyoMb12ws", getTwelveUnseong(baseDayStem_copy2, part_myo_monthSplit.ji));
      setText("CPMyoMb12ss", getTwelveShinsalDynamic(part_dayPillar, part_yearPillar, part_myo_monthSplit.ji));
      setText("CPMyoYb12ws", getTwelveUnseong(baseDayStem_copy2, part_myo_yearSplit.ji));
      setText("CPMyoYb12ss", getTwelveShinsalDynamic(part_dayPillar, part_yearPillar, part_myo_yearSplit.ji));

      updateStemInfo("CMyoYt", p_myo_yearSplit, baseDayStem_copy);
      updateStemInfo("CMyoMt", p_myo_monthSplit, baseDayStem_copy);
      updateStemInfo("CMyoDt", isMyTimeUnknown || isPickerVer23 ? "-" : p_myo_daySplit, baseDayStem_copy);
      updateStemInfo("CMyoHt", isMyTimeUnknown || isPickerVer22 || isPickerVer23 ? "-" : p_myo_hourSplit, baseDayStem_copy);
      updateBranchInfo("CMyoYb", baseYearBranch_copy, baseDayStem_copy);
      updateBranchInfo("CMyoMb", p_myo_monthSplit.ji, baseDayStem_copy);
      updateBranchInfo("CMyoDb", isMyTimeUnknown || isPickerVer3 ? "-" : p_myo_daySplit.ji, baseDayStem_copy);
      updateBranchInfo("CMyoHb", isMyTimeUnknown || isPickerVer22 || isPickerVer23 ? "-" : p_myo_hourSplit.ji, baseDayStem_copy);

      updateStemInfo("CPMyoYt", part_myo_yearSplit, baseDayStem_copy2);
      updateStemInfo("CPMyoMt", part_myo_monthSplit, baseDayStem_copy2);
      updateStemInfo("CPMyoDt", isPartnerTimeUnknown || isPickerVer23 ? "-" : part_myo_daySplit, baseDayStem_copy2);
      updateStemInfo("CPMyoHt", isPartnerTimeUnknown || isPickerVer22 || isPickerVer23 ? "-" : part_myo_hourSplit, baseDayStem_copy2);
      updateBranchInfo("CPMyoYb", part_myo_yearSplit.ji, baseDayStem_copy2);
      updateBranchInfo("CPMyoMb", part_myo_monthSplit.ji, baseDayStem_copy2);
      updateBranchInfo("CPMyoDb", isPartnerTimeUnknown || isPickerVer23 ? "-" : part_myo_daySplit.ji, baseDayStem_copy2);
      updateBranchInfo("CPMyoHb", isPartnerTimeUnknown || isPickerVer22 || isPickerVer23 ? "-" : part_myo_hourSplit.ji, baseDayStem_copy2);
      
      
      updateColorClasses();
    }

    let currentMode = 'ver21';  // 시간 · 일 · 월 모드
    function todayISO(fmt) {
      const t = toKoreanTime(new Date());
      if (fmt === 'datetime') return t.toISOString().slice(0,16); // YYYY-MM-DDTHH:MM
      if (fmt === 'date')     return t.toISOString().slice(0,10); // YYYY-MM-DD
      if (fmt === 'month')    return t.toISOString().slice(0,7);  // YYYY-MM
    }

    const pickerDt = document.getElementById('woonTimeSetPicker2');
    const pickerD  = document.getElementById('woonTimeSetPickerVer22');
    const pickerM  = document.getElementById('woonTimeSetPickerVer23');
    const spanGanz = document.getElementById('currentGanzhi');
    pickerDt.value = pickerDt.value || todayISO('datetime');
    pickerD .value = pickerD .value || todayISO('date');
    pickerM .value = pickerM .value || todayISO('month');

    function updateGanzhiDisplay(dateObj) {
      if (!dateObj || isNaN(dateObj)) return;
      const { y, m, d, h } = calcGanzhi(dateObj);
      if (currentMode === 'ver21') {
        spanGanz.innerHTML = `<b>${y}</b>년 <b>${m}</b>월 <b>${d}</b>일 <b>${h}</b>시`;
      } else if (currentMode === 'ver22') {
        spanGanz.innerHTML = `<b>${y}</b>년 <b>${m}</b>월 <b>${d}</b>일`;
      } else if (currentMode === 'ver23') {
        spanGanz.innerHTML = `<b>${y}</b>년 <b>${m}</b>월`;
      }
    }

    function parseLocalDateTime(dateStr) {        
      const [y,m,d,h,mm] = dateStr
        .match(/\d+/g)
        .map(n => parseInt(n, 10));
      return new Date(y, m - 1, d, h, mm);
    }

    function parseLocalDate(dateStr) {             
      const [y,m,d] = dateStr.split('-').map(n => parseInt(n, 10));
      return new Date(y, m - 1, d);
    }

    function parseLocalMonth(monthStr) {           
      const [y,m] = monthStr.split('-').map(n => parseInt(n, 10));
      return new Date(y, m - 1, 1);
    }

    document.getElementById('woonVer1Change2').addEventListener('click', () => {
      updatePickerVisibility2('ver21');
    });
    document.getElementById('woonVer2Change22').addEventListener('click', () => {
      updatePickerVisibility2('ver22');
    });
    document.getElementById('woonVer3Change23').addEventListener('click', () => {
      updatePickerVisibility2('ver23');

    });

    function handleChange() {
      let dateObj = null;

      if (currentMode === 'ver21' && pickerDt.value) {
        dateObj = parseLocalDateTime(pickerDt.value);
      }

      if (currentMode === 'ver22' && pickerD.value) {
        dateObj = parseLocalDate(pickerD.value);
      }

      if (currentMode === 'ver23' && pickerM.value) {
        dateObj = parseLocalMonth(pickerM.value);
      }

      if (!dateObj) dateObj = new Date();

      updateGanzhiDisplay(dateObj);
    }
    handleChangeVr = handleChange;

    updateGanzhiDisplay(toKoreanTime(new Date()))

    function formatBirthday(bdayStr) {
      if (!bdayStr || bdayStr.length < 8) return "-";
      return bdayStr.substring(0, 4) + "년 " +
             bdayStr.substring(4, 6) + "월 " +
             bdayStr.substring(6, 8) + "일";
    }

    function fillCoupleModeView(myIndex, partnerIndex) {
      const savedList = JSON.parse(localStorage.getItem("myeongsikList")) || [];
      const me = savedList[myIndex];
      const partner = savedList[partnerIndex];
      if (!me || !partner) {
        console.warn("데이터가 없습니다. myIndex:", myIndex, "partnerIndex:", partnerIndex);
        return;
      }
      // 기본정보 업데이트 (기존 코드)
      const basicMapping = {
        name:         { left: "resName_copy",     right: "resName_copy2" },
        gender:       { left: "resGender_copy",   right: "resGender_copy2" },
        age:          { left: "resAge_copy",      right: "resAge_copy2" },
        birthday:     { left: "resBirth_copy",    right: "resBirth_copy2" },
        birthtime:    { left: "resTime_copy",     right: "resTime_copy2" },
        birthPlace:   { left: "resAddr_copy",     right: "resAddr_copy2" },
        birthdayTime: { left: "resbjTime_copy",   right: "resbjTime_copy2" }
      };
      Object.keys(basicMapping).forEach(function(fieldKey) {
        let leftVal  = (me[fieldKey] !== undefined && me[fieldKey] !== "") ? me[fieldKey] : "-";
        let rightVal = (partner[fieldKey] !== undefined && partner[fieldKey] !== "") ? partner[fieldKey] : "-";
        if (fieldKey === "birthday") {
          leftVal = me[fieldKey] ? formatBirthday(me[fieldKey]) : "-";
          rightVal = partner[fieldKey] ? formatBirthday(partner[fieldKey]) : "-";
        }
        safeSetValue(basicMapping[fieldKey].left, leftVal);
        safeSetValue(basicMapping[fieldKey].right, rightVal);
      });
      const refDate = toKoreanTime(new Date());
      updateOriginalAndMyowoon(refDate);
      updateOriginalAndMyowoonVr = updateOriginalAndMyowoon;
    }

    //updateCoupleModeBtnVisibility();
    updateMeGroupOption();

    document.getElementById("coupleModeBtn").addEventListener("click", function() {
      isCoupleMode = true;
       if (isCoupleMode) {
         document.getElementById("aside").style.display = "block";
         loadSavedMyeongsikList();
       } else {
         document.getElementById("aside").style.display = "block";
         loadSavedMyeongsikList();
      }
    });

    document.querySelectorAll(".couple_btn").forEach(function (button) {
      button.addEventListener("click", function (e) {
        e.stopPropagation();

        const partnerIdx = parseInt(this.value, 10);
        const list = JSON.parse(localStorage.getItem("myeongsikList")) || [];
        partnerData = list[partnerIdx];
        currentMode = "ver21";
        const partnerIndexStr = button.getAttribute("data-index").replace("couple_", "");
        const partnerIndex = parseInt(partnerIndexStr, 10);
        const savedList = JSON.parse(localStorage.getItem("myeongsikList")) || [];
        if (savedList[partnerIndex]) {
          partnerData = savedList[partnerIndex];
        } else {
         
          return;
        }

        const myData = latestMyeongsik;

        let myIndex;
        if (latestMyeongsik.isTimeUnknown) {
          // 시간 모름 명식은 이름+생년월일만 매칭
          myIndex = list.findIndex(item =>
            item.name     === latestMyeongsik.name &&
            item.birthday === latestMyeongsik.birthday &&
            item.isTimeUnknown === true
          );
        } else {
          // 시간 있는 명식은 birthtime 까지 비교
          myIndex = list.findIndex(item =>
            item.name      === latestMyeongsik.name     &&
            item.birthday  === latestMyeongsik.birthday &&
            item.birthtime === latestMyeongsik.birthtime
          );
        }

        currentDetailIndex = myIndex;
        
        if (myData) {
          fillCoupleModeView(myIndex, partnerIndex);
          document.getElementById("aside").style.display = "none";
          document.querySelector(".couple_mode_wrap").style.display = "flex";
          document.querySelector("#woonTimeSetPicker2").style.display = "inline-block";  
        } else {
          console.warn("나의 데이터가 아직 저장되지 않았습니다. 먼저 #coupleModeBtn을 눌러 저장해주세요.");
        }

        if (myIndex >= 0 && partnerIndex >= 0) {
          fillCoupleModeView(myIndex, partnerIndex);
        } else {
          console.warn("인덱스가 유효하지 않습니다.", myIndex, partnerIndex);
        }
        document.getElementById("woonVer1Change2").click();
      });
    });

    
  }

  function exitCoupleMode() {
    isCoupleMode            = false;
    partnerData             = null;
    sessionStorage.removeItem("lastPartnerData");
    const coupleWrap = document.querySelector(".couple_mode_wrap");
    if (coupleWrap) coupleWrap.style.display = "none";
    updatePickerVisibility2('ver21');
    document.getElementById("aside").style.display        = "none";
    document.getElementById("inputWrap").style.display    = "none";
    document.getElementById("resultWrapper").style.display = "block";
  
    const btn = document.querySelector(`.detailViewBtn[data-index="${currentDetailIndex}"]`);
    if (btn) {
      btn.click();
    } 
  }
  
  // 뒤로 가기 버튼에 바인딩
  document.getElementById("coupleBackBtn").addEventListener("click", exitCoupleMode);

  document.getElementById("coupleBackBtn").addEventListener("click", function() {
    isCoupleMode = false;
    partnerData = null;
    sessionStorage.removeItem("lastPartnerData");
  
    document.querySelector(".couple_mode_wrap").style.display = "none";
    document.getElementById("aside").style.display        = "none";
    document.getElementById("inputWrap").style.display    = "none";
    document.getElementById("resultWrapper").style.display = "block";
    updatePickerVisibility2('ver21');
  
    function stripColorClasses(rootSelector) {
      const root = document.querySelector(rootSelector);
      if (!root) return;
      const classesToRemove = [
        "b_green","b_red","b_white","b_black","b_yellow","active"
      ];
      // li.siju_con3 하위의 hanja_con 과 p 태그만 골라서
      root.querySelectorAll(
        'li.siju_con3 .hanja_con, li.siju_con3 > p, li.siju_con3 p.woon_seong, li.siju_con3 p.sin_sal'
      ).forEach(el => el.classList.remove(...classesToRemove));
    }
  
    const btn = document.querySelector(`.detailViewBtn[data-index="${currentDetailIndex}"]`);
    if (btn) {
      btn.click();
      setTimeout(() => {
        stripColorClasses('#people1');
        stripColorClasses('#people2');  
      }, 0);
    }
    
  });
  
  document.getElementById("listViewBtn").addEventListener("click", function () {
    loadSavedMyeongsikList();
    document.getElementById("aside").style.display = "block";
  });
  document.getElementById("closeBtn").addEventListener("click", function () {
    document.getElementById("aside").style.display = "none";
    isCoupleMode = false;
  });
  document.getElementById("backBtnAS").addEventListener("click", function () {
    window.location.reload();
    window.scrollTo(0, 0);
  }); 

  document.getElementById("bitthTimeX").addEventListener("change", function () {
    const timeType = document.getElementById("timeType");
    const birthPlaceTxt = document.getElementById("birthPlaceTxt");

    if (!timeType || !birthPlaceTxt) return;

    if (this.checked) {
      timeType.style.display = "none";
      birthPlaceTxt.style.display = "none";  
    } else {
      timeType.style.display = "block";
      birthPlaceTxt.style.display = "none"; 
    }
  });

  function updateLiChildMargins(ulId) {
    const ul = document.getElementById(ulId);
    if (!ul) return;

    ul.querySelectorAll('li').forEach(li => {
      const divs = Array.from(li.children).filter(el => el.tagName === 'DIV');
      divs.forEach(d => d.style.marginBottom = '');
      const visible = divs.filter(d => {
        const rect = d.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      });
      if (visible.length) {
        visible[visible.length - 1].style.marginBottom = '0px';
      }
    });
  }

  function updateAllMargins() {
    updateLiChildMargins('daewoonList');
    updateLiChildMargins('sewoonList');
    updateLiChildMargins('mowoonList');
  }

  updateAllMargins();
  if (calculateBtn) {
    calculateBtn.addEventListener('click', () => {
      setTimeout(updateAllMargins, 50);
    });
  }

  const setBtnCtrl = document.getElementById('setBtn'); 

  document.getElementById("calcBtn").addEventListener("click", function () {

    let refDate = toKoreanTime(new Date());

    let isTimeUnknown = document.getElementById("bitthTimeX").checked;
    let isPlaceUnknown = document.getElementById("bitthPlaceX").checked;

    const name = document.getElementById("inputName").value.trim() || "-";
    const birthdayStr = document.getElementById("inputBirthday").value.trim();
    const birthtimeStr = isTimeUnknown 
                          ? null 
                          : document.getElementById("inputBirthtime").value.replace(/\s/g, "").trim();
    const gender = document.getElementById("genderMan").checked ? "남" 
                  : (document.getElementById("genderWoman").checked ? "여" : "-");
    const birthPlaceInput = document.getElementById("inputBirthPlace").value || "-";
    const selectTimeValue = document.querySelector('input[name="time2"]:checked')?.value;
    

    // 계산용: 시/분 기본값은 "0000", 출생지 기본값은 "서울특별시"
    let usedBirthtime = isTimeUnknown ? null : birthtimeStr;
    const usedBirthPlace = (isPlaceUnknown)
                            ? "서울특별시" : birthPlaceInput;

    // 저장용은 원래 입력 그대로 유지
    const savedBirthPlace = isPlaceUnknown ? "출생지無" : birthPlaceInput;

    // === 생년월일, 시간 파싱 ===
    let year   = parseInt(birthdayStr.substring(0, 4), 10);
    let month  = parseInt(birthdayStr.substring(4, 6), 10);
    let day    = parseInt(birthdayStr.substring(6, 8), 10);
    let hour = isTimeUnknown ? 4 : parseInt(usedBirthtime.substring(0, 2), 10);
    let minute = isTimeUnknown ? 30 : parseInt(usedBirthtime.substring(2, 4), 10);
    let birthDate = new Date(year, month - 1, day, hour, minute);

    /*if (birthdayStr.length < 8) {
      alert("생년월일을 YYYYMMDD 형식으로 입력하세요.");
      return;
    }

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

    if (!isTimeUnknown) {
      if (birthtimeStr.length !== 4 || isNaN(birthtimeStr)) {
        alert("태어난 시간을 4자리 숫자 (HHMM) 형식으로 입력하세요.");
        return;
      }
      const hour = parseInt(birthtimeStr.substring(0, 2), 10);
      const minute = parseInt(birthtimeStr.substring(2, 4), 10);
      if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
        alert("시각은 00부터 23 사이, 분은 00부터 59 사이로 입력하세요.");
        return;
      }
    }

    if (gender === "-") {
      alert("성별을 선택하세요.");
      return;
    }
    
    if (!isPlaceUnknown) {
      if (birthPlaceInput === "-") {
        alert("출생지를 선택하세요.");
        return;
      }
    }*/

    function updateTypeSpan(groupVal) {
      const typeSpan = document.getElementById('typeSV');
      if (typeSpan) {
        typeSpan.innerHTML = `<b class="type_sv">${groupVal || '미선택'}</b>`;
      }
    }

    let groupVal = document.getElementById('inputMeGroup').value;
    if (groupVal === '기타입력') {
      groupVal = document.getElementById('inputMeGroupEct').value.trim() || '기타';
    }
    updateTypeSpan(groupVal);

    const monthType = document.getElementById("monthType").value;
    const isLunar   = monthType === "음력" || monthType === "음력(윤달)";
    const isLeap    = monthType === "음력(윤달)";

    const calendar = new KoreanLunarCalendar();

    let workYear   = year;
    let workMonth  = month;
    let workDay    = day;
    if (isLunar) {
      const ok = calendar.setLunarDate(year, month, day, isLeap);
      if (!ok) {
        console.error(`음력 ${rawYear}.${rawMonth}.${rawDay} 변환 실패`);
        return;
      }
      const solar = calendar.getSolarCalendar();
        workYear  = solar.year;    
        workMonth = solar.month;   
        workDay   = solar.day;     
    } else {
      if (!calendar.setSolarDate(year, month, day)) {
        console.error("양력 날짜 설정에 실패했습니다.");
      } else {
        lunarDate = calendar.getLunarCalendar();
      }
    }

    const bjTimeTextEl = document.getElementById("bjTimeText");
    const summerTimeBtn = document.getElementById('summerTimeCorrBtn');
    let isSummerOn = true;
    originalDate = new Date(workYear, workMonth - 1, workDay, hour, minute);
    const iv = getSummerTimeInterval(originalDate.getFullYear());
    if (!fixedCorrectedDate) {
      fixedCorrectedDate = adjustBirthDateWithLon(originalDate, cityLon, isPlaceUnknown);
      if (iv && fixedCorrectedDate >= iv.start && fixedCorrectedDate < iv.end && !isTimeUnknown) {
        fixedCorrectedDate = new Date(fixedCorrectedDate.getTime() - 60 * 60 * 1000);
      }
    }
    correctedDate = fixedCorrectedDate;

    if (iv && correctedDate >= iv.start && correctedDate < iv.end && !isTimeUnknown) {
      summerTimeBtn.style.display = 'inline-block';
    } else {
      summerTimeBtn.style.display = 'none';
    }

    if (iv && fixedCorrectedDate >= iv.start && fixedCorrectedDate < iv.end && !isTimeUnknown) {
      bjTimeTextEl.innerHTML = `썸머타임보정시 : <b id="resbjTime">${correctedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</b>`;
    } else if (isPlaceUnknown) {
      bjTimeTextEl.innerHTML = `기본보정 -30분 : <b id="resbjTime">${correctedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</b>`;
    } else {
      bjTimeTextEl.innerHTML = `보정시 : <b id="resbjTime">${correctedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</b>`;
    }
    

    summerTimeBtn.addEventListener('click', function () {
      if (isSummerOn) {
        summerTimeBtn.classList.remove('active');
        summerTimeBtn.textContent = '썸머타임 보정 OFF';
        fixedCorrectedDate = new Date(fixedCorrectedDate.getTime() + 60 * 60 * 1000);
        correctedDate = fixedCorrectedDate;
        bjTimeTextEl.innerHTML = `썸머타임보정시 : <b id="resbjTime">${correctedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</b>`;
        hourPillar  = getHourGanZhiRef(correctedDate);
        hourSplit = splitPillar(hourPillar);
        updateFunc(refDate);
        updateOriginalSetMapping(daySplit, hourSplit);
        myowoonResult = getMyounPillars(myData, refDate, selectTimeValue, hourPillar);
        setTimeout(() => {
          updateMyowoonSection(myowoonResult);
        }, 0);
        updateExplanDetail(myowoonResult, hourPillar);
      } else {
        summerTimeBtn.classList.add('active');
        summerTimeBtn.textContent = '썸머타임 보정 ON';
        fixedCorrectedDate = new Date(fixedCorrectedDate.getTime() - 60 * 60 * 1000);
        correctedDate = fixedCorrectedDate;
        bjTimeTextEl.innerHTML = `썸머타임보정시 : <b id="resbjTime">${correctedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</b>`;
        hourPillar  = getHourGanZhiRef(correctedDate);
        hourSplit = splitPillar(hourPillar);
        updateFunc(refDate);
        updateOriginalSetMapping(daySplit, hourSplit);
        myowoonResult = getMyounPillars(myData, refDate, selectTimeValue, hourPillar);
        setTimeout(() => {
          updateMyowoonSection(myowoonResult);
        }, 0);
        updateExplanDetail(myowoonResult, hourPillar);
        
      }
      correctedDate = fixedCorrectedDate;
      isSummerOn = !isSummerOn;
      
    });
    

    const formattedBirth = `${workYear}-${pad(workMonth)}-${pad(workDay)}`;
    setText("resBirth", formattedBirth);

    if (!calendar.setSolarDate(workYear, workMonth, workDay)) {
      console.error(`양력 ${workYear}.${workMonth}.${workDay} → 음력 변환 실패`);
      setText("resBirth2", "");
    } else {
      const lunar = calendar.getLunarCalendar();
      const formattedLunar =
        `${lunar.year}-${pad(lunar.month)}-${pad(lunar.day)}` +
        (lunar.isLeapMonth ? " (윤달)" : "");
      setText("resBirth2", formattedLunar);
    }

    const fullResult = getFourPillarsWithDaewoon(
      correctedDate.getFullYear(),
      correctedDate.getMonth() + 1,
      correctedDate.getDate(),
      hour, minute, gender, correctedDate
    );

    const parts = fullResult.split(", ");
    const pillarsPart = parts[0] || "-";
    const pillars = pillarsPart.split(" ");
    const yearPillar  = pillars[0] || "-";
    const monthPillar = pillars[1] || "-";
    const dayPillar   = pillars[2] || "-";
    let hourPillar  = isTimeUnknown ? null : pillars[3] || "-";

    const yearSplit  = splitPillar(yearPillar);
    const monthSplit = splitPillar(monthPillar);
    const daySplit   = splitPillar(dayPillar);
    daySplitGlobal = daySplit;
    let hourSplit  = isTimeUnknown ? null : splitPillar(hourPillar);
    hourSplitGlobal = hourSplit;

    baseDayStem = daySplit.gan;
    baseDayBranch = dayPillar.charAt(1);
    baseYearBranch = yearPillar.charAt(1); 

    const branchIndex = getHourBranchIndex(correctedDate);
    const branchName = Jiji[branchIndex];

    if (branchName === "자" || branchName === "축") {
    }

    requestAnimationFrame(() => {
      if (!isTimeUnknown) {
        if (hourSplit.ji === "자" || hourSplit.ji === "축") {
          
          checkOption.style.display = 'block';
        } else {
          checkOption.style.display = 'none';
        }
        document.getElementById('hourListWrap').style.display = 'none';
      } else {
        checkOption.style.display = 'none';
        document.getElementById('hourListWrap').style.display = 'block';
      }
    });

    globalState.birthYear = year;
    globalState.month = month;
    globalState.day = day;
    globalState.birthPlace = usedBirthPlace;
    globalState.gender = gender;

    const age = correctedDate ? calculateAge(correctedDate) : "-";
    
    const formattedTime = `${pad(hour)}:${pad(minute)}`;
    setText("resName", name);
    setText("resGender", gender);
    setText("resAge", age);
    setText("resBirth", formattedBirth);
    setText("resTime", isTimeUnknown ? "시간모름" : formattedTime);
    setText("resAddr", isTimeUnknown ? "출생지모름" : savedBirthPlace);

    function updateOriginalSetMapping(daySplit, hourSplit) {
      if (manualOverride) {
        return;
      }
      setText("Hb12ws", isTimeUnknown ? "-" : getTwelveUnseong(baseDayStem, hourSplit.ji));
      setText("Hb12ss", isTimeUnknown ? "-" : getTwelveShinsalDynamic(dayPillar, yearPillar, hourSplit.ji));
      setText("Db12ws", getTwelveUnseong(baseDayStem, daySplit.ji));
      setText("Db12ss", getTwelveShinsalDynamic(dayPillar, yearPillar, daySplit.ji));
      setText("Mb12ws", getTwelveUnseong(baseDayStem, monthSplit.ji));
      setText("Mb12ss", getTwelveShinsalDynamic(dayPillar, yearPillar, monthSplit.ji));
      setText("Yb12ws", getTwelveUnseong(baseDayStem, baseYearBranch));
      setText("Yb12ss", getTwelveShinsalDynamic(dayPillar, yearPillar, baseYearBranch));
    }

    updateStemInfo("Yt", yearSplit, baseDayStem);
    updateStemInfo("Mt", monthSplit, baseDayStem);
    updateStemInfo("Dt", daySplit, baseDayStem);
    updateStemInfo("Ht", isTimeUnknown ? "-" : hourSplit, baseDayStem);
    updateBranchInfo("Yb", baseYearBranch, baseDayStem);
    updateBranchInfo("Mb", monthSplit.ji, baseDayStem);
    updateBranchInfo("Db", daySplit.ji, baseDayStem);
    updateBranchInfo("Hb", isTimeUnknown ? "-" : hourSplit.ji, baseDayStem);
    updateOriginalSetMapping(daySplit, hourSplit);
    updateColorClasses();

    const daewoonData = getDaewoonData(gender, originalDate, correctedDate);

    function updateCurrentDaewoon(refDate, offset = 0) {

      const ipChunThisYear = findSolarTermDate(refDate.getFullYear(), 315);
      const effectiveYear  = (refDate > ipChunThisYear)
                            ? refDate.getFullYear()
                            : refDate.getFullYear() - 1;

      const birthYear = correctedDate.getFullYear();
      const baseAge   = Math.floor(daewoonData.baseDecimal);

      let idx = 0;
      for (let i = 0; i < daewoonData.list.length; i++) {
        const startYear = birthYear + baseAge + i*10;
        if (startYear <= effectiveYear) {
          idx = i;
        }
      }

      idx = Math.max(0, Math.min(daewoonData.list.length-1, idx + offset));

      const currentDaewoon = daewoonData.list[idx];
      
      function appendTenGod(id, value, isStem = true) {
        const el = document.getElementById(id);
        if (!el) return;
      
        let tenGod;
        if (value === '-' || value === '(-)') {
          tenGod = '없음';
        } else {
          tenGod = isStem
            ? getTenGodForStem(value, baseDayStem)
            : getTenGodForBranch(value, baseDayStem);
        }
      
        el.innerHTML = '';
        el.append(document.createTextNode(value));
      
        const span = document.createElement('span');
        span.className = 'ten-god';
        span.textContent = `(${tenGod})`;
        el.append(document.createTextNode(' '), span);
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
      appendTenGod("DwJj1", hiddenArr[0], true);
      setText("DwJj2", hiddenArr[1]);  // currentTb 같은 값
      appendTenGod("DwJj2", hiddenArr[1], true);
      setText("DwJj3", hiddenArr[2]);  // currentTb 같은 값
      appendTenGod("DwJj3", hiddenArr[2], true);
      setText("DWb12ws", getTwelveUnseong(baseDayStem, currentDaewoon.branch));
      setText("DWb12ss", getTwelveShinsalDynamic(dayPillar, yearPillar, currentDaewoon.branch));
    }
    updateCurrentDaewoon(refDate);
    updateMonthlyWoonByToday(refDate);

    function updateAllDaewoonItems(daewoonList) {
      for (let i = 0; i < daewoonList.length; i++) {
        const item = daewoonList[i];
        const forwardGanji = item.stem + item.branch;
        const finalStem = forwardGanji.charAt(0);
        const finalBranch = forwardGanji.charAt(1);
        const idx = i + 1;
        
        setText("DC_" + idx, stemMapping[finalStem]?.hanja || "-");
        setText("DJ_" + idx, branchMapping[finalBranch]?.hanja || "-");
        setText("dt10sin" + idx, getTenGodForStem(finalStem, baseDayStem) || "-");
        setText("db10sin" + idx, getTenGodForBranch(finalBranch, baseDayStem) || "-");
        
        setText("DwW" + idx, getTwelveUnseong(baseDayStem, finalBranch) || "-");
        setText("Ds" + idx, getTwelveShinsalDynamic(dayPillar, yearPillar, finalBranch) || "-");
        
        const displayedDaewoonNum = Math.floor(item.age);
        setText("Da" + idx, displayedDaewoonNum);
      }
    }

    updateAllDaewoonItemsVr = updateAllDaewoonItems;
    
    updateAllDaewoonItems(daewoonData.list);

    const todayObj = toKoreanTime(new Date());

    let currentDaewoonIndex = 0;
    const ipChunThisYear = findSolarTermDate(refDate.getFullYear(), 315);
    const effectiveYear  = (refDate > ipChunThisYear)
                            ? refDate.getFullYear()
                            : refDate.getFullYear() - 1;
    if (daewoonData?.list) {
      for (let i = 0; i < daewoonData.list.length; i++) {
        const startAge  = Math.floor(daewoonData.baseDecimal) + i * 10;
        const startYear = correctedDate.getFullYear() + startAge;
        if (startYear <= effectiveYear) {
          currentDaewoonIndex = i;
        }
      }
    }

    const daewoonLis = document.querySelectorAll("#daewoonList li");
    daewoonLis.forEach((li, i) => {
      li.classList.toggle("active", i === currentDaewoonIndex);
    });

    function updateCurrentSewoon(refDate) {
      const ipChun = findSolarTermDate(refDate.getFullYear(), 315);
      //const ipChun = findSolarTermDate(birthDate.getFullYear(), 315);
      const effectiveYear = (refDate > ipChun) ? refDate.getFullYear() : refDate.getFullYear() - 1;
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
      appendTenGod("SwJj1", sewoonHidden[0], true);
      
      setText("SwJj2", sewoonHidden[1]);
      appendTenGod("SwJj2", sewoonHidden[1], true);
      
      setText("SwJj3", sewoonHidden[2]);
      appendTenGod("SwJj3", sewoonHidden[2], true);
      setText("SWb12ws", getTwelveUnseong(baseDayStem, sewoonSplit.ji));
      setText("SWb12ss", getTwelveShinsalDynamic(dayPillar, yearPillar, sewoonSplit.ji));
      
      setText("WSwtHanja", stemMapping[sewoonSplit.gan]?.hanja || "-");
      setText("WSwtHanguel", stemMapping[sewoonSplit.gan]?.hanguel || "-");
      setText("WSwtEumyang", stemMapping[sewoonSplit.gan]?.eumYang || "-");
      setText("WSwt10sin", getTenGodForStem(sewoonSplit.gan, baseDayStem));
      setText("WSwbHanja", branchMapping[sewoonSplit.ji]?.hanja || "-");
      setText("WSwbHanguel", branchMapping[sewoonSplit.ji]?.hanguel || "-");
      setText("WSwbEumyang", branchMapping[sewoonSplit.ji]?.eumYang || "-");
      setText("WSwb10sin", getTenGodForBranch(sewoonSplit.ji, baseDayStem));
      setText("WSbJj1", sewoonHidden[0]);
      appendTenGod("WSbJj1", sewoonHidden[0], true);
      
      setText("WSbJj2", sewoonHidden[1]);
      appendTenGod("WSbJj2", sewoonHidden[1], true);
      
      setText("WSbJj3", sewoonHidden[2]);
      appendTenGod("WSbJj3", sewoonHidden[2], true);
      setText("WSWb12ws", getTwelveUnseong(baseDayStem, sewoonSplit.ji));
      setText("WSWb12ss", getTwelveShinsalDynamic(dayPillar, yearPillar, sewoonSplit.ji));
    }
    function updateCurrentSewoonCalendar(refDate) {
      const ipChun = findSolarTermDate(refDate.getFullYear(), 315);
      //const ipChun = findSolarTermDate(birthDate.getFullYear(), 315);
      const effectiveYear = (refDate > ipChun) ? refDate.getFullYear() : refDate.getFullYear() - 1;
      const sewoonIndex = ((effectiveYear - 4) % 60 + 60) % 60;
      const sewoonGanZhi = sexagenaryCycle[sewoonIndex];
      const sewoonSplit = splitPillar(sewoonGanZhi);
      
      setText("WSwtHanja", stemMapping[sewoonSplit.gan]?.hanja || "-");
      setText("WSwtHanguel", stemMapping[sewoonSplit.gan]?.hanguel || "-");
      setText("WSwtEumyang", stemMapping[sewoonSplit.gan]?.eumYang || "-");
      setText("WSwt10sin", getTenGodForStem(sewoonSplit.gan, baseDayStem));
      setText("WSwbHanja", branchMapping[sewoonSplit.ji]?.hanja || "-");
      setText("WSwbHanguel", branchMapping[sewoonSplit.ji]?.hanguel || "-");
      setText("WSwbEumyang", branchMapping[sewoonSplit.ji]?.eumYang || "-");
      setText("WSwb10sin", getTenGodForBranch(sewoonSplit.ji, baseDayStem));
      const sewoonHidden = hiddenStemMapping[sewoonSplit.ji] || ["-", "-", "-"];
      setText("WSwJj1", sewoonHidden[0]);
      appendTenGod("WSwJj1", sewoonHidden[0], true);
      
      setText("WSwJj2", sewoonHidden[1]);
      appendTenGod("WSwJj2", sewoonHidden[1], true);
      
      setText("WSwJj3", sewoonHidden[2]);
      appendTenGod("WSwJj3", sewoonHidden[2], true);
      setText("WSWb12ws", getTwelveUnseong(baseDayStem, sewoonSplit.ji));
      setText("WSWb12ss", getTwelveShinsalDynamic(dayPillar, yearPillar, sewoonSplit.ji));
      updateColorClasses();
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
        const index = this.getAttribute("data-index2");
        updateSewoonDetails(index);
        const mowoonListElem = document.getElementById("walwoonArea");
        if (mowoonListElem) { mowoonListElem.style.display = "grid"; }
        document.querySelectorAll("#sewoonList li").forEach(e => e.classList.remove("active"));
        this.classList.add("active");
        const year = parseInt(this.dataset.year, 10);
      });
    });

    function updateDaewoonDetails(index) {
      if (daewoonData && daewoonData.list[index - 1]) {
        const data = daewoonData.list[index - 1];
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

    function updateSewoonItem(refDate) {
      const ipChun      = findSolarTermDate(refDate.getFullYear(), 315);
      const displayYear = refDate > ipChun
                        ? refDate.getFullYear()
                        : refDate.getFullYear() - 1;
    
      let loopCount = 0;
      while (loopCount < daewoonData.list.length) {
        // 1) 소수점 연도로 변환
        const decimalBirthYear = getDecimalBirthYear(correctedDate);
        const idx          = daewoonIndex - 1;
        const daewoonItem  = daewoonData.list[idx];
        const yearsOffset  = daewoonItem.age;        
        const monthsOffset = daewoonData.baseMonths;
        const sewoonStartDecimal = decimalBirthYear
                                  + yearsOffset
                                  + monthsOffset / 12;
        
        const startYear = Math.floor(sewoonStartDecimal);
        
        globalState.sewoonStartYear = startYear;
    
        const years = Array.from({ length: 10 }, (_, j) => startYear + j);
        const lastYear = years[years.length - 1];
        if (years.includes(displayYear)) {
          if (displayYear === lastYear) {
            updateCurrentDaewoon(refDate, -1);
          }
          break;  
        }
 
        
        if (daewoonIndex > 1) {
          
          daewoonIndex--;
          // daewoonList 상의 active 표시도 옮겨줍니다.
          document
            .querySelectorAll("#daewoonList li")
            .forEach(li => li.classList.remove("active"));
          const selLi = document.querySelector(
            `#daewoonList li[data-index="${daewoonIndex}"]`
          );
          selLi && selLi.classList.add("active");

          updateCurrentDaewoon(refDate, -1);
    
          loopCount++;
          continue;  
        }
        
        break;
      }
    
      const sewoonList = [];
      for (let j = 0; j < 10; j++) {
        const year   = globalState.sewoonStartYear + j;
        const age   = (year - correctedDate.getFullYear()) + 1;
        const ganZhi = getYearGanZhiForSewoon(year); 
        const split  = splitPillar(ganZhi);
        sewoonList.push({
          year,
          age,
          gan:           split.gan,
          ji:            split.ji,
          tenGodGan:     getTenGodForStem(split.gan, baseDayStem),
          tenGodBranch:  getTenGodForBranch(split.ji, baseDayStem)
        });
      }
      globalState.sewoonList = sewoonList;

      sewoonList.forEach((item, i) => {
        const ix = i + 1;
        setText("Dy"       + ix, item.year);
        setText("Sy"       + ix, item.age);
        setText("SC_"      + ix, stemMapping[item.gan]?.hanja     || "-");
        setText("SJ_"      + ix, branchMapping[item.ji]?.hanja    || "-");
        setText("st10sin"  + ix, item.tenGodGan);
        setText("sb10sin"  + ix, item.tenGodBranch);
        setText("SwW"      + ix, getTwelveUnseong(baseDayStem, item.ji));
        setText("Ss"       + ix, getTwelveShinsalDynamic(dayPillar, yearPillar, item.ji));
      });

      updateColorClasses();
    }
    
    updateSewoonItem(refDate);

    function populateSewoonYearAttributes() {
      const startYear = globalState.sewoonStartYear;  // 전역에 세운 시작 연도가 저장되어 있어야 합니다.
    
      document
        .querySelectorAll("#sewoonList li[data-index2]")  // 기존에 data-index3만 있고 data-year가 비어 있는 <li>들
        .forEach(li => {
          const idx = parseInt(li.dataset.index2, 10);    // 1,2,3… 형태
          if (!isNaN(idx)) {
            // data-year = 시작연도 + (인덱스–1)
            li.dataset.year = startYear + (idx - 1);
          }
        });
    }

    populateSewoonYearAttributes();

    const ipChun = findSolarTermDate(refDate.getFullYear(), 315);
    const todayYear = (refDate > ipChun) ? refDate.getFullYear() : refDate.getFullYear() - 1;
    //const ipChun = findSolarTermDate(birthDate.getFullYear(), 315);
    const displayYear = (todayObj < ipChun) ? todayYear - 1 : todayYear;
    const sewoonLis = document.querySelectorAll("#sewoonList li");
    sewoonLis.forEach(li => {
      const dyearElem = li.querySelector(".dyear");
      const currentYear = Number(dyearElem.innerText);
      li.classList.toggle("active", currentYear === displayYear);
      const year = parseInt(li.dataset.year, 10);

    });


    function updateListMapping(list, prefixUnseong, prefixShinsal, baseDayStem) {
      if (!list || !list.length) {
        console.warn("업데이트할 리스트가 없습니다.");
        return;
      }
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        document.getElementById(prefixUnseong + (i + 1)).innerText = getTwelveUnseong(baseDayStem, item.branch);
        document.getElementById(prefixShinsal + (i + 1)).innerText = getTwelveShinsalDynamic(dayPillar, yearPillar, item.branch);
      }
    }

    let currentSewoonIndex = displayYear - globalState.sewoonStartYear;
    if (currentSewoonIndex < 0) currentSewoonIndex = 0;
    if (currentSewoonIndex > 9) currentSewoonIndex = 9;
    const computedSewoonYear = globalState.sewoonStartYear + currentSewoonIndex;
    updateMonthlyData(computedSewoonYear, refDate);
    const monthlyContainer = document.getElementById("walwoonArea");
    if (monthlyContainer) { monthlyContainer.style.display = "grid"; }
    updateColorClasses();
    updateOriginalSetMapping(daySplit, hourSplit);
    updateListMapping(daewoonData.list, "DwW", "Ds", baseDayStem, baseYearBranch);
    if (globalState.sewoonList && globalState.sewoonList.length > 0) {
      updateListMapping(globalState.sewoonList, "SwW", "Ss", baseDayStem, baseYearBranch);
    }
    if (globalState.monthWoonList && globalState.monthWoonList.length > 0) {
      updateListMapping(globalState.monthWoonList, "MwW", "Ms", baseDayStem, baseYearBranch);
    }

    function updateMonthlyData(refDateYear, today) {
      const ipChun = findSolarTermDate(todayObj.getFullYear(), 315);
      const dayPillarText = document.getElementById("DtHanguel").innerText;
      baseDayStem = dayPillarText ? dayPillarText.charAt(0) : "-";
      const effectiveYear = (today >= ipChun) ? refDateYear : refDateYear - 1;
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
        const shinsal = getTwelveShinsalDynamic(dayPillar, yearPillar, monthBranch);
        setText("MC_" + (i + 1), stemMapping[monthStem]?.hanja || "-");
        setText("MJ_" + (i + 1), branchMapping[monthBranch]?.hanja || "-");
        setText("Mot10sin" + (i + 1), tenGodStem || "-");
        setText("Mob10sin" + (i + 1), tenGodBranch || "-");
        setText("MwW" + (i + 1), unseong || "-");
        setText("Ms" + (i + 1), shinsal || "-");
        setText("Dm" + (i + 1), displayMonth || "-");
      }
    }
  
    function updateMonthlyWoon(computedYear, currentMonthIndex, baseDayStem) {
      const boundaries = getSolarTermBoundaries(computedYear);
      if (!boundaries || boundaries.length === 0) return;
      const cycleStartDate = boundaries[0].date;
      const dayPillarText = document.getElementById("DtHanguel").innerText;
      baseDayStem = dayPillarText ? dayPillarText.charAt(0) : "-";
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
      const shinsal = getTwelveShinsalDynamic(dayPillar, yearPillar, monthBranch);
      setText("WMtHanja", stemMapping[monthStem]?.hanja || "-");
      setText("WMtHanguel", stemMapping[monthStem]?.hanguel || "-");
      setText("WMtEumyang", stemMapping[monthStem]?.eumYang || "-");
      setText("WMt10sin", tenGodStem || "-");
      setText("WMbHanja", branchMapping[monthBranch]?.hanja || "-");
      setText("WMbHanguel", branchMapping[monthBranch]?.hanguel || "-");
      setText("WMbEumyang", branchMapping[monthBranch]?.eumYang || "-");
      setText("WMb10sin", tenGodBranch || "-");
      updateHiddenStems(monthBranch, "WMb");
      appendTenGod(monthBranch, "WMb", true);
      setText("WMb12ws", unseong || "-");
      setText("WMb12ss", shinsal || "-");
    }

    function updateMonthlyWoonTop(computedYear, currentMonthIndex, baseDayStem) {
      const boundaries = getSolarTermBoundaries(computedYear);
      if (!boundaries || boundaries.length === 0) return;
      const cycleStartDate = boundaries[0].date;
      const dayPillarText = document.getElementById("DtHanguel").innerText;
      baseDayStem = dayPillarText ? dayPillarText.charAt(0) : "-";
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
      const shinsal = getTwelveShinsalDynamic(dayPillar, yearPillar, monthBranch);

      setText("WwtHanja", stemMapping[monthStem]?.hanja || "-");
      setText("WwtHanguel", stemMapping[monthStem]?.hanguel || "-");
      setText("WwtEumyang", stemMapping[monthStem]?.eumYang || "-");
      setText("Wwt10sin", tenGodStem || "-");
      setText("WwbHanja", branchMapping[monthBranch]?.hanja || "-");
      setText("WwbHanguel", branchMapping[monthBranch]?.hanguel || "-");
      setText("WwbEumyang", branchMapping[monthBranch]?.eumYang || "-");
      setText("Wwb10sin", tenGodBranch || "-");
      updateHiddenStems(monthBranch, "Ww");
      appendTenGod(monthBranch, "Ww", true);
      setText("Wwb12ws", unseong || "-");
      setText("Wwb12ss", shinsal || "-");
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
      updateMonthlyWoon(computedYear, currentMonthIndex, baseDayStem);
    }
    
    updateMonthlyWoonByToday(refDate);

    function updateMonthlyWoonByTodayTop(refDate) {
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
      updateMonthlyWoonTop(computedYear, currentMonthIndex, baseDayStem);
    }

    updateMonthlyWoonByTodayTop(refDate);
    
    document.addEventListener("click", function (event) {
      if (globalState.isNavigating) return;
      
      const btn = event.target.closest("#calPrevBtn, #calNextBtn");
      if (!btn) return;
      
      const solarYear = globalState.solarYear;
      const boundaries = globalState.boundaries;
      const currentIndex = globalState.currentIndex;
      if (solarYear === undefined || !boundaries || currentIndex === undefined) return;
      
      globalState.isNavigating = true;
      
      let newIndex;
      if (btn.id === "calPrevBtn") {
        newIndex = (currentIndex - 1 + boundaries.length) % boundaries.length;
      } else if (btn.id === "calNextBtn") {
        newIndex = (currentIndex + 1) % boundaries.length;
      }
      
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
    function generateDailyFortuneCalendar(solarTermName, startDate, endDate, currentIndex, boundaries, solarYear, today) {
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
        const twelveShinsal = getTwelveShinsalDynamic(dayPillar, yearPillar, branch);
        const STORAGE_KEY = 'b12Visibility';
        const hide12 = localStorage.getItem(STORAGE_KEY) === 'hidden';
        let dailyHtml = `<ul class="ilwoon">
          <li class="ilwoonday"><span>${date.getDate()}일</span></li>
          <li class="ilwoon_ganji_cheongan_10sin"><span>${tenGodCheongan}</span></li>
          <li class="ilwoon_ganji_cheongan"><span>${stem}</span></li>
          <li class="ilwoon_ganji_jiji"><span>${branch}</span></li>
          <li class="ilwoon_ganji_jiji_10sin"><span>${tenGodJiji}</span></li>
          ${!hide12 ? `
            <li class="ilwoon_10woonseong" id="ilwoon10woonseong_${idx}">
              <span>${twelveUnseong}</span>
            </li>
            <li class="ilwoon_10sinsal" id="ilwoon10sinsal_${idx}">
              <span>${twelveShinsal}</span>
            </li>
          ` : ''}
        </ul>`;
        requestAnimationFrame(updateColorClasses);

        function getCycleDateToday() {
          const nowKst = toKoreanTime(new Date());
          const cycleDate = new Date(
            nowKst.getFullYear(),
            nowKst.getMonth(),
            nowKst.getDate(), 
            0, 0, 0, 0
          );
          const hour = nowKst.getHours();

          if (document.getElementById("jasi").checked) {
            if (hour < 23) {
              cycleDate.setDate(cycleDate.getDate() - 1);
            }
          }
          else if (document.getElementById("insi").checked) {
            if (hour < 3) {
              // 3시 이전이면 전날로 이동
              cycleDate.setDate(cycleDate.getDate() - 1);
            }
          }

          return cycleDate;
        }

        // ③ 달력 렌더링 로직에서
        const todayCycle = getCycleDateToday();

        let tdClass = "";
        if (
          date.getFullYear() === todayCycle.getFullYear() &&
          date.getMonth() === todayCycle.getMonth() &&
          date.getDate() === todayCycle.getDate()
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
      const today = toKoreanTime(new Date());
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
        currentIndex,
        boundaries,
        solarYear,
        today
      );
      const container = document.getElementById("iljuCalender");
      if (container) {
        container.innerHTML = calendarHTML;
      }
      globalState.solarYear = solarYear;
      globalState.boundaries = boundaries;
      globalState.currentIndex = currentIndex;
      globalState.computedYear = solarYear;
      const now = toKoreanTime(new Date());
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
        const wolwoonBox = document.querySelector(".lucky.wolwoon");
        if (wolwoonBox) { wolwoonBox.style.display = "none"; }
        document.querySelectorAll("#sewoonList li").forEach(li => li.classList.remove("active"));
        const monthlyContainer = document.getElementById("walwoonArea");
        if (monthlyContainer) { monthlyContainer.style.display = "none"; }
        const daewoonIndex = parseInt(this.getAttribute("data-index"), 10);
        const decimalBirthYear = getDecimalBirthYear(correctedDate);
        const selectedDaewoon = daewoonData.list[daewoonIndex - 1];
        if (!selectedDaewoon) return;

        const daewoonNum = selectedDaewoon.age; 
        const sewoonStartYearDecimal = decimalBirthYear + daewoonNum;
        globalState.sewoonStartYear = Math.floor(sewoonStartYearDecimal + 1);
        
        // 세운(운) 리스트 생성
        const sewoonList = [];
        for (let j = 0; j < 10; j++) {
          const year   = globalState.sewoonStartYear + j;
          const age   = (year - correctedDate.getFullYear()) + 1;
          const ganZhi = getYearGanZhiForSewoon(year); 
          const split  = splitPillar(ganZhi);
          sewoonList.push({
            year,
            age,
            gan:           split.gan,
            ji:            split.ji,
            tenGodGan:     getTenGodForStem(split.gan, baseDayStem),
            tenGodBranch:  getTenGodForBranch(split.ji, baseDayStem)
          });
        }
        globalState.sewoonList = sewoonList;
      
        sewoonList.forEach((item, i) => {
          const ix = i + 1;
          setText("Dy"       + ix, item.year);
          setText("Sy"       + ix, item.age);
          setText("SC_"      + ix, stemMapping[item.gan]?.hanja     || "-");
          setText("SJ_"      + ix, branchMapping[item.ji]?.hanja    || "-");
          setText("st10sin"  + ix, item.tenGodGan);
          setText("sb10sin"  + ix, item.tenGodBranch);
          setText("SwW"      + ix, getTwelveUnseong(baseDayStem, item.ji));
          setText("Ss"       + ix, getTwelveShinsalDynamic(dayPillar, yearPillar, item.ji));
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
          appendTenGod("DwJj1", daewoonHidden[0], true);
          setText("DwJj2", daewoonHidden[1]);
          appendTenGod("DwJj2", daewoonHidden[1], true);
          setText("DwJj3", daewoonHidden[2]);
          appendTenGod("DwJj3", daewoonHidden[2], true);
        }
        updateDaewoonHTML(selectedDaewoon, baseDayStem);
        
        updateColorClasses();

        const computedYear = globalState.sewoonStartYear;
        const boundariesForSewoon = getSolarTermBoundaries(computedYear);
        const targetSolarTerm = boundariesForSewoon[0].name;
        updateMonthlyFortuneCalendar(targetSolarTerm, computedYear);
        document.querySelectorAll("#mowoonList li").forEach(li => li.classList.remove("active"));
        populateSewoonYearAttributes();
      });
    });
  
    document.querySelectorAll("[id^='Sewoon_']").forEach(function (sewoonLi) {
      sewoonLi.addEventListener("click", function () {
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

        updateMonthlyData(computedYear, refDate);
        let yearGanZhi = getYearGanZhiForSewoon(computedYear);
        const splitYear = splitPillar(yearGanZhi);
        const tenGod = getTenGodForStem(splitYear.gan, baseDayStem);
        const tenGodJiji = getTenGodForBranch(splitYear.ji, baseDayStem);
        const selectedSewoon = {
          year: computedYear,
          gan: splitYear.gan,
          ji: splitYear.ji,
          tenGod: tenGod,
          tenGodJiji: tenGodJiji
        };
  
        function updateSewoonHTML(selectedSewoon) {
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
          appendTenGod("SwJj1", sewoonHidden[0], true);
          
          setText("SwJj2", sewoonHidden[1]);
          appendTenGod("SwJj2", sewoonHidden[1], true);
          
          setText("SwJj3", sewoonHidden[2]);
          appendTenGod("SwJj3", sewoonHidden[2], true);
          setText("SWb12ws", getTwelveUnseong(baseDayStem, selectedSewoon.ji));
          setText("SWb12ss", getTwelveShinsalDynamic(dayPillar, yearPillar, selectedSewoon.ji));
          updateColorClasses();
        }
        updateSewoonHTML(selectedSewoon, baseDayStem);
        
        // 선택된 세운 항목에 대해 활성화 클래스 적용
        const sewoonLis = document.querySelectorAll("#sewoonList li");
        sewoonLis.forEach(li => li.classList.remove("active"));
        if (sewoonLis[sewoonIndex - 1]) { 
          sewoonLis[sewoonIndex - 1].classList.add("active"); 
        }
        updateColorClasses();
        
        // 월운(운) 업데이트: 세운 연도에 따른 태양력 경계선 등 계산
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

        const wolwoonBox = document.querySelector(".lucky.wolwoon");
        const wongookLM = document.getElementById("wongookLM");

        if (wolwoonBox && wongookLM && !wongookLM.classList.contains("no_wolwoon")) {
          wolwoonBox.style.display = "block";
        }

        const thisYear = parseInt(document.querySelector('#sewoonList li.active').dataset.year, 10);
        const thisMonth = parseInt(this.dataset.index3, 10);
        const monthGanZhi = getMonthGanZhiForWolwoon(thisYear, thisMonth);
        const splitMonth  = splitPillar(monthGanZhi);
        const tenGod      = getTenGodForStem(splitMonth.gan, baseDayStem);
        const tenGodJiji  = getTenGodForBranch(splitMonth.ji, baseDayStem);

        const selectedWolwoon = {
          month:  thisYear + thisMonth,
          gan:   splitMonth.gan,
          ji:    splitMonth.ji,
          tenGod,
          tenGodJiji
        };
  
        // 내부 함수: 선택된 세운 결과로 UI를 업데이트
        function updateWolwoonHTML(selectedWolwoon) {
          setText("WwtHanja", stemMapping[selectedWolwoon.gan]?.hanja || "-");
          setText("WwtHanguel", stemMapping[selectedWolwoon.gan]?.hanguel || "-");
          setText("WwtEumyang", stemMapping[selectedWolwoon.gan]?.eumYang || "-");
          setText("Wwt10sin", getTenGodForStem(selectedWolwoon.gan, baseDayStem));
          setText("WwbHanja", branchMapping[selectedWolwoon.ji]?.hanja || "-");
          setText("WwbHanguel", branchMapping[selectedWolwoon.ji]?.hanguel || "-");
          setText("WwbEumyang", branchMapping[selectedWolwoon.ji]?.eumYang || "-");
          setText("Wwb10sin", getTenGodForBranch(selectedWolwoon.ji, baseDayStem));
          const wolwoonHidden = hiddenStemMapping[selectedWolwoon.ji] || ["-", "-", "-"];
          setText("WwJj1", wolwoonHidden[0]);
          appendTenGod("SwJj1", wolwoonHidden[0], true);
          
          setText("WwJj2", wolwoonHidden[1]);
          appendTenGod("WwJj2", wolwoonHidden[1], true);
          
          setText("WwJj3", wolwoonHidden[2]);
          appendTenGod("WwJj3", wolwoonHidden[2], true);
          setText("WWb12ws", getTwelveUnseong(baseDayStem, selectedWolwoon.ji));
          setText("WWb12ss", getTwelveShinsalDynamic(dayPillar, yearPillar, selectedWolwoon.ji));
        }

        updateWolwoonHTML(selectedWolwoon);

        document.getElementById('iljuCalender').style.display = 'grid';
        const termName = li.getAttribute("data-solar-term") || "";
        const computedYear = globalState.computedYear || (function(){
          const today = toKoreanTime(new Date());
          const ipChun = findSolarTermDate(today.getFullYear(), 315);
          return (today < ipChun) ? today.getFullYear() - 1 : today.getFullYear();
        })();
        globalState.activeMonth = parseInt(li.getAttribute("data-index3"), 10);
        updateMonthlyFortuneCalendar(termName, computedYear);

        // active
        document.querySelectorAll("#mowoonList li").forEach(e => e.classList.remove("active"));
        this.classList.add("active");
        
      });
    });

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
      const yeonjuCycle = getSolarYearSpanInDays(birthDate, 120);
      const woljuCycle  = getSolarYearSpanInDays(birthDate, 10);
      const iljuCycle   = getSolarMonthSpanInDays(birthDate, 4);
      const sijuCycle   = getSolarDaySpanInDays(birthDate, 10);
      return { yeonjuCycle, woljuCycle, iljuCycle, sijuCycle };
    }

    const { yeonjuCycle, woljuCycle, iljuCycle, sijuCycle } = getDynamicCycles(birthDate);

    // Helper: 주어진 Date에서 시지(地支)를 반환

    function getHourBranchIndex2(date) {
      if (!(date instanceof Date)) {
        date = new Date(date);
      }
      return Math.floor(((date.getHours() + 1) % 24) / 2);
    }

    // backward compatibility alias: updateHourWoon relies on this
    function getHourBranchReturn(date) {
      const branches = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
      return branches[getHourBranchIndex2(date)];
    }

    const GANZHI_60 = Array.from({ length: 60 }, (_, i) =>
      Cheongan[i % 10] + Jiji[i % 12]
    );

    function getGanZhiByIndex(idx) {
      const i = ((idx % 60) + 60) % 60;
      return GANZHI_60[i];
    }


    function getMyounPillars(person, refDate, basisOverride, hourPillar) {
      
      const { year, month, day, hour, minute, gender, correctedDate } = person;

      birthDate = correctedDate
        ? new Date(correctedDate)
        : new Date(year, month - 1, day, hour, minute);
      const basis = basisOverride
        || document.querySelector('input[name="time2"]:checked')?.value;
      const basisMap = { jasi: 23, yajasi: 0, insi: 3 };
      const baseTime = new Date(birthDate);
      if (basisMap[basis] != null) baseTime.setHours(basisMap[basis], 0);

      const fullResult = getFourPillarsWithDaewoon(
        birthDate.getFullYear(),
        birthDate.getMonth() + 1,
        birthDate.getDate(),
        birthDate.getHours(),   
        birthDate.getMinutes(),
        gender,
        birthDate
      );

      const parts = fullResult.split(", ");
      const pillarsPart = parts[0] || "-";
      const pillars = pillarsPart.split(" ");
      const yearPillar  = pillars[0] || "-";
      const monthPillar = pillars[1] || "-";
      const dayPillar   = pillars[2] || "-";
      //const hourPillar  = pillars[3] || "-";

      const isYangStem = ["갑", "병", "무", "경", "임"].includes(yearPillar.charAt(0));
      const direction  = ((gender === '남' && isYangStem) || (gender === '여' && !isYangStem)) ? 1 : -1;
      const dirMode    = direction === 1 ? '순행' : '역행';

      function logDaynamic({
        birthDate,
        refDate,
        dirMode,
        basis,
        yearPillar,
        monthPillar,
        dayPillar,
        hourPillar
      }) {
        const msMin    = 60 * 1000;
        const cycleMin = 120;                          // 2시간
        const cycleMs  = 10 * 24 * 60 * 60 * 1000;     // 10일
      
        function getFirstSijuChange(dt) {
          const branch   = getHourBranchReturn(dt);
          const startMap = { 子:23, 丑:1, 寅:3, 卯:5, 辰:7, 巳:9,
                             午:11, 未:13, 申:15, 酉:17, 戌:19, 亥:21 };
          let bnd = new Date(dt);
          const h0  = startMap[branch];
          const h1  = (h0 + 2) % 24;
          bnd.setHours(dirMode==='순행'? h1 : h0, 0);
          if (dirMode==='순행' && bnd <= dt) bnd.setDate(bnd.getDate()+1);
          if (dirMode==='역행' && bnd >= dt) bnd.setDate(bnd.getDate()-1);
          return bnd;
        }
        
        const iljuTarget = {
          insi:   { 순행:'寅', 역행:'寅' },
          jasi:   { 순행:'子', 역행:'子' },
          yajasi: { 순행:'子', 역행:'子' }
        }[basis][dirMode];
      
        function getFirstIljuChange(dt) {
          const cursor = new Date(dt);
          cursor.setSeconds(0,0);
          while (getHourBranchReturn(cursor) !== iljuTarget) {
            cursor.setMinutes(cursor.getMinutes() + 1);
          }
          return cursor;
        }
      
        
        const maxCycles = 4381; 
        const sDates = [ birthDate, getFirstSijuChange(birthDate) ];
        const iDates = [ birthDate, getFirstIljuChange(birthDate) ];
        for (let i = 2; i < maxCycles; i++) {
          const deltaMs = (dirMode==='순행'?1:-1) * cycleMin * msMin;
          sDates[i] = new Date(sDates[i-1].getTime() + deltaMs);
          iDates[i] = new Date(iDates[i-1].getTime() + deltaMs);
        }
      
        const sPillars = [ hourPillar ];
        for (let i = 1; i < sDates.length; i++) {
          const idx    = getGanZhiIndex(sPillars[i - 1]);
          const nextIx = dirMode === '순행'
            ? (idx + 1) % 60
            : (idx + 59) % 60;
          sPillars[i] = getGanZhiByIndex(nextIx);
        }

        const iPillars = [ dayPillar ];
        for (let i = 1; i < sDates.length; i++) {
          // 현재 시지(branch) 확인
          const branch = getHourBranchReturn(sDates[i]);
          if (branch === iljuTarget) {
            // 지정된 시지에 도달했을 때만 60갑자 순환
            const idx    = getGanZhiIndex(iPillars[i - 1]);
            const nextIx = dirMode === '순행'
              ? (idx + 1) % 60
              : (idx + 59) % 60;
            iPillars[i] = getGanZhiByIndex(nextIx);
          } else {
            // 나머지 구간에서는 이전 일주 유지
            iPillars[i] = iPillars[i - 1];
          }
        }
        
        const mPillars = [ monthPillar ];
        const yPillars = [ yearPillar ];
        let year = correctedDate.getFullYear();

        let allTerms = getSolarTermBoundaries(year)
          .sort((a, b) => a.date - b.date);

        let pointer;
        if (dirMode === '순행') {
          pointer = allTerms.findIndex(t => t.date >= correctedDate);
          if (pointer < 0) {
            year++;
            allTerms = getSolarTermBoundaries(year).sort((a,b) => a.date - b.date);
            pointer = 0;
          }
        } else {  
          const pastTerms = allTerms.filter(t => t.date <= correctedDate);
          pointer = pastTerms.length - 1;
          if (pointer < 0) {
            year--;
            allTerms = getSolarTermBoundaries(year).sort((a,b) => a.date - b.date);
            pointer = allTerms.length - 1;
          }
        }

        const monthZhiMap = {
          insi: {
            순행: ["寅","卯","辰","巳","午","未","申","酉","戌","亥","子","丑"],
            역행: ["丑","子","亥","戌","酉","申","未","午","巳","辰","卯","寅"]
          },
          jasi: {
            순행: ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"],
            역행: ["亥","戌","酉","申","未","午","巳","辰","卯","寅","丑","子"]
          },
          yajasi: {
            순행: ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"],
            역행: ["亥","戌","酉","申","未","午","巳","辰","卯","寅","丑","子"]
          }
        };

        const yeonjuTargetMap = {
          insi:   { 순행: "卯", 역행: "寅" },
          jasi:   { 순행: "卯", 역행: "寅" },
          yajasi: { 순행: "卯", 역행: "寅" }
        };

        const principals = [
          "입춘","경칩","청명","입하",
          "망종","소서","입추","백로",
          "한로","입동","대설","소한"
        ];

        for (let i = 1; i < sDates.length; i++) {
          const dt = sDates[i];
          const term = allTerms[pointer];
          const hit = (dirMode === '순행') ? (dt >= term.date) : (dt <= term.date);

          if (hit) {
            mPillars[i] = getMonthGanZhi(dt, year);

            if (dirMode === '순행') {
              pointer++;
              if (pointer >= allTerms.length) {
                year++;
                allTerms = getSolarTermBoundaries(year).sort((a,b) => a.date - b.date);
                pointer = 0;
              }
            } else {
              pointer--;
              if (pointer < 0) {
                year--;
                allTerms = getSolarTermBoundaries(year).sort((a,b) => a.date - b.date);
                pointer = allTerms.length - 1;
              }
            }

            const termName = allTerms[pointer].name;
            const princIdx = principals.indexOf(termName);

            const mb = monthZhiMap[basis][dirMode][princIdx];
            const prevBranch = mPillars[i - 1].charAt(1);

            let newY = yPillars[i - 1];
            const targetBranch = yeonjuTargetMap[basis][dirMode];
            if (mb === targetBranch && mb !== prevBranch) {
              const idx = getGanZhiIndex(yPillars[i - 1]);
              newY = dirMode === '순행'
                ? getGanZhiByIndex((idx + 1) % 60)
                : getGanZhiByIndex((idx + 59) % 60);
            }
            yPillars[i] = newY;

          } else {
            mPillars[i] = mPillars[i - 1];
            yPillars[i] = yPillars[i - 1];
          }
        }


        const periods = [];
        const realFirstMs = Math.abs(sDates[1] - sDates[0]);
        const firstMapMs  = realFirstMs/(cycleMin*msMin)*cycleMs - msMin;
        periods[0] = {
          start: new Date(sDates[0]),
          end:   new Date(sDates[0].getTime() + firstMapMs)
        };
        // 이후: +10일 -1분
        for (let i = 1; i < sDates.length; i++) {
          const prevEnd = periods[i-1].end.getTime();
          periods[i] = {
            start: new Date(prevEnd + msMin),
            end:   new Date(prevEnd + cycleMs)
          };
        }
      
        //── 콘솔 한 줄 출력 ──
        // console.log('시주\t일주\t월주\t연주\t날짜\t\t\t적용기간(시작 → 끝)');
        // for (let i = 0; i < sDates.length; i++) {
        //   console.log(
        //     `${sPillars[i]}\t` +
        //     `${iPillars[i]}\t` +
        //     `${mPillars[i]}\t` +
        //     `${yPillars[i]}\t` +
        //     `${formatDate(sDates[i])}\t` +
        //     `${formatDate(periods[i].start)} → ${formatDate(periods[i].end)}`
        //   );
        // }
        
        function findFirstChange(pillarsArr) {
          for (let i = 1; i < pillarsArr.length; i++) {
            if (pillarsArr[i] !== pillarsArr[i - 1]) {
              return periods[i].start;
            }
          }
          return null;
        }

        function findLastChange(pillarsArr, periods, refDate) {
          let idx = periods.findIndex(({ start, end }) =>
            refDate >= start && refDate < end
          );
          if (idx < 0) idx = periods.length - 1;
          for (let i = idx; i > 0; i--) {
            if (pillarsArr[i] !== pillarsArr[i - 1]) {
              return periods[i].start;  // ← 여기서 end → start 로 변경
            }
          }
          return null;
        }

        function findNextChangeStart(pillarsArr, periods, refDate) {
          let idx = periods.findIndex(({ start, end }) =>
            refDate >= start && refDate < end
          );
          if (idx < 0) idx = periods.length - 1;
        
          for (let i = idx + 1; i < periods.length; i++) {
            if (pillarsArr[i] !== pillarsArr[i - 1]) {
              return periods[i].start;
            }
          }
          return null;
        }

        const sijuFirstChangeDate = findFirstChange(sPillars);
        const iljuFirstChangeDate = findFirstChange(iPillars);
        const woljuFirstChangeDate  = findFirstChange(mPillars);
        const yeonjuFirstChangeDate = findFirstChange(yPillars);

        const sijuLastChangeDate = findLastChange(sPillars, periods, refDate);
        const iljuLastChangeDate = findLastChange(iPillars, periods, refDate);
        const woljuLastChangeDate  = findLastChange(mPillars, periods, refDate);
        const yeonjuLastChangeDate = findLastChange(yPillars, periods, refDate);

        const sijuLastChangeDateStart = findNextChangeStart(sPillars, periods, refDate);
        const iljuLastChangeDateStart = findNextChangeStart(iPillars, periods, refDate);
        const woljuLastChangeDateStart  = findNextChangeStart(mPillars, periods, refDate);
        const yeonjuLastChangeDateStart = findNextChangeStart(yPillars, periods, refDate);


        const idx = periods.findIndex(({start, end}) =>
          refDate >= start && refDate < end
        );

        const sijuCurrentPillar  = idx >= 0 ? sPillars[idx] : null;
        const iljuCurrentPillar  = idx >= 0 ? iPillars[idx] : null;
        const woljuCurrentPillar = idx >= 0 ? mPillars[idx] : null;
        const yeonjuCurrentPillar= idx >= 0 ? yPillars[idx] : null;

        return {
          sijuCurrentPillar,    
          iljuCurrentPillar,   
          woljuCurrentPillar,   
          yeonjuCurrentPillar, 

          getFirstSijuChange,
          sijuFirstChangeDate,
          iljuFirstChangeDate,
          woljuFirstChangeDate,
          yeonjuFirstChangeDate,

          sijuLastChangeDate,
          iljuLastChangeDate,
          woljuLastChangeDate,
          yeonjuLastChangeDate,

          sijuLastChangeDateStart,
          iljuLastChangeDateStart,
          woljuLastChangeDateStart,
          yeonjuLastChangeDateStart
        };
      }
      
      let {
        sijuCurrentPillar, iljuCurrentPillar,
        woljuCurrentPillar, yeonjuCurrentPillar,
        sijuFirstChangeDate, iljuFirstChangeDate,
        woljuFirstChangeDate, yeonjuFirstChangeDate,
        getFirstSijuChange,
        sijuLastChangeDate,
        iljuLastChangeDate,
        woljuLastChangeDate,
        yeonjuLastChangeDate,
        sijuLastChangeDateStart,
        iljuLastChangeDateStart,
        woljuLastChangeDateStart,
        yeonjuLastChangeDateStart
      } = logDaynamic({
        birthDate,
        refDate,
        dirMode,
        basis,
        yearPillar,
        monthPillar,
        dayPillar,
        hourPillar
      });
    
      updateColorClasses();
    
      return {
        sijuCurrentPillar, iljuCurrentPillar, woljuCurrentPillar, yeonjuCurrentPillar,
        sijuFirstChangeDate, iljuFirstChangeDate, woljuFirstChangeDate, yeonjuFirstChangeDate,
        getFirstSijuChange,
        sijuLastChangeDate,
        iljuLastChangeDate,
        woljuLastChangeDate,
        yeonjuLastChangeDate,
        sijuLastChangeDateStart,
        iljuLastChangeDateStart,
        woljuLastChangeDateStart,
        yeonjuLastChangeDateStart,
        dirMode
      };
    }
     
    const myData = {
      correctedDate: correctedDate, 
      year: year,
      month: month,
      day: day,
      hour: hour,
      minute: minute,
      yearPillar: yearPillar,       
      monthPillar: monthPillar,
      dayPillar: dayPillar,
      hourPillar: hourPillar,
      gender: gender            
    };

    getMyounPillarsVr = getMyounPillars;

    getMyounPillars(myData, refDate);

    let myowoonResult = getMyounPillars(myData, refDate, selectTimeValue, hourPillar);

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

      const yp = myowoonResult.yeonjuCurrentPillar;
      setText("MyoYtHanja", stemMapping[yp[0]]?.hanja || yp[0]);
      applyColor("MyoYtHanja", yp[0]);
      setText("MyoYtHanguel", stemMapping[yp[0]]?.hanguel || yp[0]);
      setText("MyoYtEumyang", stemMapping[yp[0]]?.eumYang || "-");
      setText("MyoYt10sin", getTenGodForStem(yp[0], baseDayStem));
      setText("MyoYbHanja", branchMapping[yp[1]]?.hanja || yp[1]);
      applyColor("MyoYbHanja", yp[1]);
      setText("MyoYbHanguel", branchMapping[yp[1]]?.hanguel || yp[1]);
      setText("MyoYbEumyang", branchMapping[yp[1]]?.eumYang || "-");
      setText("MyoYb10sin", getTenGodForBranch(yp[1], baseDayStem));
      const ybJj = hiddenStemMapping[yp[1]] || ["-", "-", "-"];
      setText("MyoYbJj1", ybJj[0]);
      appendTenGod("MyoYbJj1", ybJj[0], true);
      setText("MyoYbJj2", ybJj[1]);
      appendTenGod("MyoYbJj2", ybJj[1], true);
      setText("MyoYbJj3", ybJj[2]);
      appendTenGod("MyoYbJj3", ybJj[2], true);
      setText("MyoYb12ws", getTwelveUnseong(baseDayStem, yp[1]));
      setText("MyoYb12ss", getTwelveShinsalDynamic(dayPillar, yearPillar, yp[1]));
    
      const mp = myowoonResult.woljuCurrentPillar;
      setText("MyoMtHanja", stemMapping[mp[0]]?.hanja || mp[0]);
      applyColor("MyoMtHanja", mp[0]);
      setText("MyoMtHanguel", stemMapping[mp[0]]?.hanguel || mp[0]);
      setText("MyoMtEumyang", stemMapping[mp[0]]?.eumYang || "-");
      setText("MyoMt10sin", getTenGodForStem(mp[0], baseDayStem));
      setText("MyoMbHanja", branchMapping[mp[1]]?.hanja || mp[1]);
      applyColor("MyoMbHanja", mp[1]);
      setText("MyoMbHanguel", branchMapping[mp[1]]?.hanguel || mp[1]);
      setText("MyoMbEumyang", branchMapping[mp[1]]?.eumYang || "-");
      setText("MyoMb10sin", getTenGodForBranch(mp[1], baseDayStem));
      const mbJj = hiddenStemMapping[mp[1]] || ["-", "-", "-"];
      setText("MyoMbJj1", mbJj[0]);
      appendTenGod("MyoMbJj1", mbJj[0], true);
      setText("MyoMbJj2", mbJj[1]);
      appendTenGod("MyoMbJj2", mbJj[1], true);
      setText("MyoMbJj3", mbJj[2]);
      appendTenGod("MyoMbJj3", mbJj[2], true);
      setText("MyoMb12ws", getTwelveUnseong(baseDayStem, mp[1]));
      setText("MyoMb12ss", getTwelveShinsalDynamic(dayPillar, yearPillar, mp[1]));
    
      if (isTimeUnknown || !myowoonResult.iljuCurrentPillar) {
        ["MyoDtHanja", "MyoDtHanguel", "MyoDtEumyang", "MyoDt10sin",
         "MyoDbHanja", "MyoDbHanguel", "MyoDbEumyang", "MyoDb10sin",
         "MyoDbJj1", "MyoDbJj2", "MyoDbJj3", "MyoDb12ws", "MyoDb12ss"].forEach(id => setText(id, "-"));
      } else {MyoYbJj1
        const dp = myowoonResult.iljuCurrentPillar;
        setText("MyoDtHanja", stemMapping[dp[0]]?.hanja || dp[0]);
        applyColor("MyoDtHanja", dp[0]);
        setText("MyoDtHanguel", stemMapping[dp[0]]?.hanguel || dp[0]);
        setText("MyoDtEumyang", stemMapping[dp[0]]?.eumYang || "-");
        setText("MyoDt10sin", getTenGodForStem(dp[0], baseDayStem));
        setText("MyoDbHanja", branchMapping[dp[1]]?.hanja || dp[1]);
        applyColor("MyoDbHanja", dp[1]);
        setText("MyoDbHanguel", branchMapping[dp[1]]?.hanguel || dp[1]);
        setText("MyoDbEumyang", branchMapping[dp[1]]?.eumYang || "-");
        setText("MyoDb10sin", getTenGodForBranch(dp[1], baseDayStem));
        const dbJj = hiddenStemMapping[dp[1]] || ["-", "-", "-"];
        setText("MyoDbJj1", dbJj[0]);
        appendTenGod("MyoDbJj1", dbJj[0], true);
        setText("MyoDbJj2", dbJj[1]);
        appendTenGod("MyoDbJj2", dbJj[1], true);
        setText("MyoDbJj3", dbJj[2]);
        appendTenGod("MyoDbJj3", dbJj[2], true);
        setText("MyoDb12ws", getTwelveUnseong(baseDayStem, dp[1]));
        setText("MyoDb12ss", getTwelveShinsalDynamic(dayPillar, yearPillar, dp[1]));
      }
    
      if (isTimeUnknown || !myowoonResult.sijuCurrentPillar || isPickerVer3) {
        ["MyoHtHanja", "MyoHtHanguel", "MyoHtEumyang", "MyoHt10sin",
         "MyoHbHanja", "MyoHbHanguel", "MyoHbEumyang", "MyoHb10sin",
         "MyoHbJj1", "MyoHbJj2", "MyoHbJj3", "MyoHb12ws", "MyoHb12ss"].forEach(id => setText(id, "-"));
      } else {
        const hp = myowoonResult.sijuCurrentPillar;
        setText("MyoHtHanja", stemMapping[hp[0]]?.hanja || hp[0]);
        applyColor("MyoHtHanja", hp[0]);
        setText("MyoHtHanguel", stemMapping[hp[0]]?.hanguel || hp[0]);
        setText("MyoHtEumyang", stemMapping[hp[0]]?.eumYang || "-");
        setText("MyoHt10sin", getTenGodForStem(hp[0], baseDayStem));
        setText("MyoHbHanja", branchMapping[hp[1]]?.hanja || hp[1]);
        setText("MyoHbHanguel", branchMapping[hp[1]]?.hanguel || hp[1]);
        setText("MyoHbEumyang", branchMapping[hp[1]]?.eumYang || "-");
        setText("MyoHb10sin", getTenGodForBranch(hp[1], baseDayStem));
        const hbJj = hiddenStemMapping[hp[1]] || ["-", "-", "-"];
        setText("MyoHbJj1", hbJj[0]);
        appendTenGod("MyoHbJj1", hbJj[0], true);
        setText("MyoHbJj2", hbJj[1]);
        appendTenGod("MyoHbJj2", hbJj[1], true);
        setText("MyoHbJj3", hbJj[2]);
        appendTenGod("MyoHbJj3", hbJj[2], true);
        setText("MyoHb12ws", getTwelveUnseong(baseDayStem, hp[1]));
        setText("MyoHb12ss", getTwelveShinsalDynamic(dayPillar, yearPillar, hp[1]));
      }
      updateColorClasses();
    }

    updateMyowoonSectionVr = updateMyowoonSection;

    function initPickers() {
      const today = toKoreanTime(new Date());
    
      const formatDateLocal = (d) => {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
      };
    
      const formatMonthLocal = (d) => {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        return `${yyyy}-${mm}`;
      };

      function toKoreanTime(date) {
        // 1) 현재 객체가 가진 UTC 밀리초(브라우저 기준 local → UTC)
        const utcMs = date.getTime() + date.getTimezoneOffset() * 60_000;
        // 2) 한국 표준시(UTC+9)의 밀리초
        const kstOffsetMs = 9 * 60 * 60_000;
        return new Date(utcMs + kstOffsetMs);
      }

      const kstNow = toKoreanTime(new Date());

      const pad = n => String(n).padStart(2, '0');
      const fyear   = kstNow.getFullYear();
      const fmonth  = pad(kstNow.getMonth() + 1);
      const fday    = pad(kstNow.getDate());
      const fhours  = pad(kstNow.getHours());
      const fmins   = pad(kstNow.getMinutes());
    
      document.getElementById("woonTimeSetPicker").value = `${fyear}-${fmonth}-${fday}T${fhours}:${fmins}`;
      document.getElementById("woonTimeSetPickerVer2").value = formatDateLocal(today);
      document.getElementById("woonTimeSetPickerVer3").value = formatMonthLocal(today);
    
      document.getElementById("woonTimeSetPicker").style.display = '';
      document.getElementById("woonTimeSetPickerVer2").style.display = 'none';
      document.getElementById("woonTimeSetPickerVer3").style.display = 'none';

      document.getElementById("woonTimeSetPicker2").value = `${fyear}-${fmonth}-${fday}T${fhours}:${fmins}`;
      document.getElementById("woonTimeSetPickerVer22").value = formatDateLocal(today);
      document.getElementById("woonTimeSetPickerVer23").value = formatMonthLocal(today);
    
      document.getElementById("woonTimeSetPicker2").style.display = '';
      document.getElementById("woonTimeSetPickerVer22").style.display = 'none';
      document.getElementById("woonTimeSetPickerVer23").style.display = 'none';
    }

    initPickers();

    function updatePickerVisibility(mode) {
      document.getElementById("woonTimeSetPicker").style.display = 'none';
      document.getElementById("woonTimeSetPickerVer2").style.display = 'none';
      document.getElementById("woonTimeSetPickerVer3").style.display = 'none';
    
      currentMode = mode;
    
      if (mode === 'ver2') {
        document.getElementById("woonTimeSetPickerVer2").style.display = '';
        isPickerVer2 = true;
        isPickerVer3 = false;
      } else if (mode === 'ver3') {
        document.getElementById("woonTimeSetPickerVer3").style.display = '';
        isPickerVer2 = false;
        isPickerVer3 = true;
      } else if (mode === 'ver1') {
        document.getElementById("woonTimeSetPicker").style.display = '';
        isPickerVer2 = false;
        isPickerVer3 = false;
      }
    }

    const pickerButtons = document.querySelectorAll('.btn_box .picker_btn');

    pickerButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        pickerButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    const pickerButtons2 = document.querySelectorAll('.btn_box .picker_btn2');

    pickerButtons2.forEach((btn) => {
      btn.addEventListener('click', () => {
        pickerButtons2.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    document.getElementById('woonVer1Change').addEventListener('click', () => {
      updatePickerVisibility('ver1');
    });
    document.getElementById('woonVer2Change').addEventListener('click', () => {
      updatePickerVisibility('ver2');
    });
    document.getElementById('woonVer3Change').addEventListener('click', () => {
      updatePickerVisibility('ver3');
    });

    function getCurrentPicker() {
      if (currentMode === 'ver2') {
        return document.getElementById("woonTimeSetPickerVer2");
      } else if (currentMode === 'ver3') {
        return document.getElementById("woonTimeSetPickerVer3");
      } else if (currentMode === 'ver1') {
        return document.getElementById("woonTimeSetPicker");
      }
    }

    function getCurrentPickerValue() {
      if (currentMode === 'ver2') {
        return document.getElementById("woonTimeSetPickerVer2").value;
      } else if (currentMode === 'ver3') {
        return document.getElementById("woonTimeSetPickerVer3").value;
      } else if (currentMode === 'ver1') {
        return document.getElementById("woonTimeSetPicker").value;
      }
    }

    function getCurrentPicker2() {
      if (currentMode === 'ver22') {
        return document.getElementById("woonTimeSetPickerVer22");
      } else if (currentMode === 'ver23') {
        return document.getElementById("woonTimeSetPickerVer23");
      } else if (currentMode === 'ver21') {
        return document.getElementById("woonTimeSetPicker2");
      }
    }

    function getCurrentPicker2Value() {
      if (currentMode === 'ver22') {
        return document.getElementById("woonTimeSetPickerVer22").value;
      } else if (currentMode === 'ver23') {
        return document.getElementById("woonTimeSetPickerVer23").value;
      } else if (currentMode === 'ver21') {
        return document.getElementById("woonTimeSetPicker2").value;
      }
    }
    
    function registerMyowoonMoreHandler(hourSplit) {
      const btn = document.getElementById("myowoonMore");
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
    
      newBtn.addEventListener("click", function () {
        if (newBtn.classList.contains("active")) {
          document.getElementById('wongookLM').classList.remove("w100");
          document.getElementById('luckyWrap').style.display = 'block';
          document.getElementById('woonArea').style.display = 'block';
          document.getElementById('woonContainer').style.display = 'none';
          document.getElementById('calArea').style.display = 'none';
          if (!isTimeUnknown) {
            if (hourSplit.ji !== "자" && hourSplit.ji !== "축") {
              checkOption.style.display = 'none';
            }
          }
          newBtn.classList.remove("active");
          newBtn.innerText = "묘운력(운 전체) 상세보기";
        } else {
          document.getElementById('wongookLM').classList.add("w100");
          document.getElementById('luckyWrap').style.display = 'none';
          document.getElementById('woonArea').style.display = 'none';
          document.getElementById('woonContainer').style.display = 'flex';
          document.getElementById('calArea').style.display = 'block';
          if (!isTimeUnknown) {
            if (hourSplit.ji !== "자" && hourSplit.ji !== "축") {
            }
          }
          updateMyowoonSection(myowoonResult);
          newBtn.classList.add("active");
          newBtn.innerText = "원래 화면으로 가기";
        }
      });
    }    
  
    registerMyowoonMoreHandler(hourSplit);
    
    document.querySelectorAll('.back_btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        window.location.reload();
        document.getElementById("inputWrap").style.display = "block";
        document.getElementById("resultWrapper").style.display = "none";
        document.getElementById("aside").style.display = "none";
        isCoupleMode = false;
        window.scrollTo(0, 0);
      });
    });

    document.getElementById('wongookLM').classList.remove("w100");
    document.getElementById('luckyWrap').style.display = 'block';
    document.getElementById('woonArea').style.display = 'block';
    document.getElementById('woonContainer').style.display = 'none';
    document.getElementById('calArea').style.display = 'none';

    function updateDayWoon(refDate) {
      const kstDate = toKoreanTime(refDate);
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
    
      if (isPickerVer3) {
        ["WDtHanja", "WDtHanguel", "WDtEumyang", "WDt10sin",
         "WDbHanja", "WDbHanguel", "WDbEumyang", "WDb10sin",
         "WDbJj1", "WDbJj2", "WDbJj3", "WDb12ws", "WDb12ss"].forEach(id => setText(id, "-"));
      } else {
        setText("WDtHanja", stemMapping[gan]?.hanja || "-");
        setText("WDtHanguel", stemMapping[gan]?.hanguel || "-");
        setText("WDtEumyang", stemMapping[gan]?.eumYang || "-");
        setText("WDt10sin", getTenGodForStem(gan, baseDayStem) || "-");
        setText("WDbHanja", branchMapping[ji]?.hanja || "-");
        setText("WDbHanguel", branchMapping[ji]?.hanguel || "-");
        setText("WDbEumyang", branchMapping[ji]?.eumYang || "-");
        setText("WDb10sin", getTenGodForBranch(ji, baseDayStem) || "-");
        updateHiddenStems(ji, "WDb");
        appendTenGod(ji, "WDb", true);
        setText("WDb12ws", getTwelveUnseong(baseDayStem, ji) || "-");
        setText("WDb12ss", getTwelveShinsalDynamic(dayPillar, yearPillar, ji) || "-");
        updateColorClasses();
      }
      return { dayGanZhi, gan, ji };
    }

    updateDayWoon(refDate);

    function getHourBranchUsingArray2(dateObj) {
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

    function updateHourWoon(refDate) {
      const date = new Date(refDate);
      const hourBranch = getHourBranchUsingArray2(date);  // 직접 호출
      const hourBranchIndex = Jiji.indexOf(hourBranch);
      const dayGanZhi = updateDayWoon(refDate).gan;
      const hourStem = getHourStem2(dayGanZhi, hourBranchIndex);
    
      if (isPickerVer2 || isPickerVer3) {
        ["WTtHanja","WTtHanguel","WTtEumyang","WTt10sin",
         "WTbHanja","WTbHanguel","WTbEumyang","WTb10sin",
         "WTbJj1","WTbJj2","WTbJj3","WTb12ws","WTb12ss"].forEach(id => setText(id, "-"));
      } else {
        setText("WTtHanja", stemMapping[hourStem]?.hanja || "-");
        setText("WTtHanguel", stemMapping[hourStem]?.hanguel || "-");
        setText("WTtEumyang", stemMapping[hourStem]?.eumYang || "-");
        setText("WTt10sin", getTenGodForStem(hourStem, baseDayStem) || "-");
        setText("WTbHanja", branchMapping[hourBranch]?.hanja || "-");
        setText("WTbHanguel", branchMapping[hourBranch]?.hanguel || "-");
        setText("WTbEumyang", branchMapping[hourBranch]?.eumYang || "-");
        updateHiddenStems(hourBranch, "WTb");
        appendTenGod(hourBranch, "WTb", true);
        setText("WTb10sin", getTenGodForBranch(hourBranch, baseDayStem) || "-");
        setText("WTb12ws", getTwelveUnseong(baseDayStem, hourBranch) || "-");
        setText("WTb12ss", getTwelveShinsalDynamic(dayPillar, yearPillar, hourBranch) || "-");
        updateColorClasses();
      }
    }
    updateHourWoon(refDate);

    const picker = isCoupleMode ? getCurrentPicker2() : getCurrentPicker();
    refDate = (picker && picker.value) ? toKoreanTime(new Date(picker.value)) : toKoreanTime(new Date());  
    myowoonResult = getMyounPillars(myData, refDate, selectTimeValue, hourPillar);
    if (picker) {
      const now = toKoreanTime(new Date());
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
 
    function collectInputData() {
      const birthdayStr = document.getElementById("inputBirthday").value.trim();
      const yearVal = parseInt(birthdayStr.substring(0, 4), 10);
      const monthVal = parseInt(birthdayStr.substring(4, 6), 10);
      const dayVal = parseInt(birthdayStr.substring(6, 8), 10);
      const genderVal = document.getElementById("genderMan").checked ? "남" :
                        document.getElementById("genderWoman").checked ? "여" : "-";
      const birthPlaceInput = document.getElementById("inputBirthPlace").value || "-";
      return { year: yearVal, month: monthVal, day: dayVal, hour: hour, minute: minute, gender: genderVal, birthPlace: birthPlaceInput };
    }
    
    function updateFortune() {
      const { year, month, hour, minute, gender, cityLon } = inputData;
      
      // 원국(사주) 계산 실행
      const fullResult = getFourPillarsWithDaewoon(
        correctedDate.getFullYear(),
        correctedDate.getMonth() + 1,
        correctedDate.getDate(),
        hour, minute,
        gender, correctedDate
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
      updateStemInfo("Yt", yearSplit, baseDayStem);
      updateStemInfo("Mt", monthSplit, baseDayStem);
      updateStemInfo("Dt", daySplit, baseDayStem);
      updateStemInfo("Ht", isTimeUnknown ? "-" : hourSplit, baseDayStem);
      updateBranchInfo("Yb", baseYearBranch, baseDayStem);
      updateBranchInfo("Mb", monthSplit.ji, baseDayStem);
      updateBranchInfo("Db", daySplit.ji, baseDayStem);
      updateBranchInfo("Hb", isTimeUnknown ? "-" : hourSplit.ji, baseDayStem);
      updateOriginalSetMapping(daySplit, hourSplit);
      updateColorClasses();
    }
    
    const inputData = collectInputData();
    
    function getMonthlyWoonParameters() {
      const today = toKoreanTime(new Date());
      const ipchun = findSolarTermDate(today.getFullYear(), 315);
      const solarYear = (today < ipchun) ? today.getFullYear() - 1 : today.getFullYear();
      const boundaries = getSolarTermBoundaries(solarYear);
      let currentIndex = 0;
      for (let i = 0; i < boundaries.length - 1; i++) {
        if (today >= boundaries[i].date && today < boundaries[i + 1].date) {
          currentIndex = i;
          break;
        }
      }
      if (today >= boundaries[boundaries.length - 1].date) {
        currentIndex = boundaries.length - 1;
      }
    
      const solarTermName = boundaries[currentIndex].name;
      const startDate = boundaries[currentIndex].date;
      const endDate = boundaries[currentIndex + 1]
        ? new Date(boundaries[currentIndex + 1].date.getTime() - 24 * 60 * 60 * 1000)
        : new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);
      const currentMonthIndex = today.getMonth();
    
      return { solarTermName, startDate, endDate, currentIndex, boundaries, solarYear, currentMonthIndex };
    }

    if (isTimeUnknown) {
      document.querySelector("#checkOption").style.display = "none";
    } else {
      document.querySelector("#checkOption").style.display = "block"; // or "block" 등
    }

    function updateExplanDetail(myowoonResult, hourPillar) {
  
      function direction() {
        if (myowoonResult.dirMode === "순행") {
          return '다음';
        } else {
          return '전';
        }
      }

      let timeLabel = "";
        if (document.getElementById("jasi")?.checked) {
          timeLabel = "자시";
        } else if (document.getElementById("yajasi")?.checked) {
          timeLabel = "자시";
        } else if (document.getElementById("insi")?.checked) {
          timeLabel = "인시";
      }

  
      function findNextOrPrevBlock(h, mode) {
        const sortedBlocks = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23];
        if (mode === "순행") {
          const bigger = sortedBlocks.filter(x => x > h);
          return (bigger.length === 0) ? sortedBlocks[0] : bigger[0];
        } else {
          const smaller = sortedBlocks.filter(x => x < h);
          return (smaller.length === 0) ? sortedBlocks[sortedBlocks.length - 1] : smaller[smaller.length - 1];
        }
      }
  
      function getSijuTimeDifference(birthDate, mode) {
        let base = new Date(birthDate); 
        const h = birthDate.getHours();
        const sijuBlock = findNextOrPrevBlock(h, mode);
      
        if (mode === "순행") {
          if (sijuBlock <= h) {
            base.setDate(base.getDate() + 1);
          }
          base.setHours(sijuBlock, 0, 0, 0);
          
        } else { 
          if (sijuBlock > h) {
            base.setDate(base.getDate() - 1);
          }
          base.setHours(sijuBlock, 0, 0, 0);
        }
      
        let diffMs = Math.abs(base.getTime() - birthDate.getTime());
        let diffMinutes = Math.floor(diffMs / (60 * 1000));
      
        if (diffMinutes >= 120) {
          diffMinutes -= 120;
        }
      
        const hours = Math.floor(diffMinutes / 60);
        const minutes = diffMinutes % 60;
        return `${hours}시간 ${minutes}분`;
      }

      function findNearestSolarTerm(correctedDate, mode = "순행") {
        const year = correctedDate.getFullYear();
        let terms = getSolarTermBoundaries(year);
      
        if (mode === "순행") {
          const next = terms.find(t => t.date > correctedDate);
          if (next) return next;
          return getSolarTermBoundaries(year + 1)[0];
        } else {
          const prev = [...terms].reverse().find(t => t.date <= correctedDate);
          if (prev) return prev;
          const lastPrevYear = getSolarTermBoundaries(year - 1);
          return lastPrevYear[lastPrevYear.length - 1];
        }
      }
  
      function getWoljuTimeDifference(correctedDate, mode = "순행") {
        const term = findNearestSolarTerm(correctedDate, mode);
        let woljuBase;
        if (mode === "순행") {
          woljuBase = (correctedDate < term.date)
            ? term.date
            : new Date(
                correctedDate.getFullYear() + 1,
                term.date.getMonth(), term.date.getDate(),
                term.date.getHours(), term.date.getMinutes()
              );
        } else {
          woljuBase = (correctedDate >= term.date)
            ? term.date
            : new Date(
                correctedDate.getFullYear() - 1,
                term.date.getMonth(), term.date.getDate(),
                term.date.getHours(), term.date.getMinutes()
              );
        }
      
        const diffMs    = woljuBase - correctedDate;
        const absMs     = Math.abs(diffMs);
        const oneDayMs  = 24 * 60 * 60 * 1000;
      
        const diffDays  = Math.floor(absMs / oneDayMs);
        const remMs     = absMs % oneDayMs;
        const diffHrs   = Math.floor(remMs / (60 * 60 * 1000));
        const remMs2    = remMs % (60 * 60 * 1000);
        const diffMins  = Math.floor(remMs2 / (60 * 1000));
      
        return `${diffDays}일 ${diffHrs}시간 ${diffMins.toString().padStart(2, "0")}분`;
      }
      
    
      const ul = document.getElementById("explanDetail");
      const pickerValue = isCoupleMode ? getCurrentPicker2Value() : getCurrentPickerValue();

      function formatDateTime(date) {
        if (!(date instanceof Date)) {
          date = new Date(date);
        }
        const y = date.getFullYear();
        const m = (date.getMonth() + 1).toString().padStart(2, "0");
        const d = date.getDate().toString().padStart(2, "0");
        const hh = date.getHours().toString().padStart(2, "0");
        const mm = date.getMinutes().toString().padStart(2, "0");
        return `${y}-${m}-${d} ${hh}:${mm}`;
      }
      
      function formatDateOnly(date) {
        const y = date.getFullYear();
        const m = (date.getMonth() + 1).toString().padStart(2, "0");
        const d = date.getDate().toString().padStart(2, "0");
        return `${y}.${m}.${d}`;
      }

      function formatMonthOnly(date) {
        const y = date.getFullYear();
        const m = (date.getMonth() + 1).toString().padStart(2, "0");
        return `${y}.${m}`;
      }

      function formatByTimeKnown(date) {
        if (isPickerVer3) {
          return formatMonthOnly(date);
        } else if (isTimeUnknown || isPickerVer2) {
          return formatDateOnly(date);
        } else {
          return formatDateTime(date);
        }
      }

      function formatDiffDaysHours(fromDate, toDate) {
        const f = new Date(fromDate), t = new Date(toDate);
        if (isNaN(f.getTime()) || isNaN(t.getTime())) {
          console.warn('✕ 잘못된 날짜 입력:', fromDate, toDate);
          return '';
        }
        const diff = t.getTime() - f.getTime();
        const dayMs = 24*60*60*1000, hourMs = 60*60*1000;
        const days = Math.floor(diff / dayMs);
        const hours = Math.floor((diff - days*dayMs) / hourMs);
        return `${days}일 ${hours}시간`;
      }

      function formatDiffDetailed(fromDate, toDate) {
        const f = new Date(fromDate), t = new Date(toDate);
        if (isNaN(f) || isNaN(t)) {
          console.warn('✕ 잘못된 날짜 입력:', fromDate, toDate);
          return '';
        }
      
        let years  = t.getFullYear() - f.getFullYear();
        let months = t.getMonth()     - f.getMonth();
        let days   = t.getDate()      - f.getDate();
        let hours  = t.getHours()     - f.getHours();
      
        if (hours < 0) {
          hours += 24;
          days--;
        }
        if (days < 0) {
          const prevMonthLastDay = new Date(t.getFullYear(), t.getMonth(), 0).getDate();
          days += prevMonthLastDay;
          months--;
        }
        if (months < 0) {
          months += 12;
          years--;
        }
      
        return `${years}년 ${months}개월 ${days}일 ${hours}시간`;
      }

      const firstSijuRaw = myowoonResult.sijuFirstChangeDate;
      const firstWoljuRaw = myowoonResult.woljuFirstChangeDate;
      const firstSijuDate = firstSijuRaw ? new Date(firstSijuRaw) : null;
      const firstWoljuDate = firstWoljuRaw ? new Date(firstWoljuRaw) : null;
      const durationStr = firstSijuDate
        ? formatDiffDaysHours(correctedDate, firstSijuDate)
        : '';

      const monthStr = firstWoljuDate
        ? formatDiffDetailed(correctedDate, firstWoljuDate)
        : '';

      let html = "";

      html += `
      <li>계산시각 : ${formatByTimeKnown(new Date(pickerValue))}<br>출생(보정)시각 : ${formatDateTime(correctedDate)}</li>
      `;
    
      if (!isTimeUnknown) {
        if (isPickerVer3) {
          html += `
            <li>
              <div class="pillar_title"><strong>시주</strong> </div>
              (측정 일자와 시간이 없어 구할 수 없습니다.)
            </li>
          `;
          html += `
            <li>
              <div class="pillar_title"><strong>일주</strong></div>
              원국 일주 간지: <b>${dayPillar}</b><br>
              보정 후 처음 간지 바뀌는 시간: <b>${formatByTimeKnown(myowoonResult.iljuFirstChangeDate)}</b><br>
              보정 후 오늘까지 마지막으로 바뀐 시간: <b>${formatByTimeKnown(myowoonResult.iljuLastChangeDate)}</b><br>
              다음 간지 바뀌는 날짜 : <b>${formatByTimeKnown(myowoonResult.iljuLastChangeDateStart)}</b><br>
              
              최종 업데이트 이벤트 간지: <b>${myowoonResult.iljuCurrentPillar}</b><br>
              방향: <b>${myowoonResult.dirMode}</b><br><br>
              묘운 일주의 경우, 시주가 일주의 12개의 팔이기 때문에,<br> 자시일수론과 인시일수론에 따라 다르게 나옵니다.<br>
              자시 일수론의 경우, 시주(시지)기준으로,<br> <ins>순행은 자시 역행은 해시(역으로 흐르기 때문에)에 따라 일주가 바뀌며</ins>,<br>
              인시 일수론의 경우, 시주(시지)기준으로,<br> <ins>순행은 인시 역행은 축시(역으로 흐르기 때문에)에 따라 일주가 바뀝니다</ins>.<br>
              현재 [${timeLabel}]일수론 사용중입니다.
            </li>
          `;
         } else {
          html += `
              <li>
                <div class="pillar_title"><strong>시주</strong></div>
                원국 시주 간지: <b>${hourPillar}</b><br>
                보정 후 처음 간지 바뀌는 시간: <b>${formatByTimeKnown(myowoonResult.sijuFirstChangeDate)}</b><br>
                보정 후 오늘까지 마지막으로 바뀐 시간: <b>${formatByTimeKnown(myowoonResult.sijuLastChangeDate)}</b><br>
                다음 간지 바뀌는 날짜 : <b>${formatByTimeKnown(myowoonResult.sijuLastChangeDateStart)}</b><br>
                
                최종 업데이트 이벤트 간지: <b>${myowoonResult.sijuCurrentPillar}</b><br>
                방향: <b>${myowoonResult.dirMode}</b><br><br>
                묘운 시주의 기간은 2시간을 10일로 치환합니다. <br>
                예를 들어, 보정 시각이 <b>${formatDateTime(correctedDate)}</b>인 명식의 경우, <br>
                <b>${myowoonResult.dirMode}</b> 방향으로 계산이 됩니다. <br>
                간지가 바뀌기까지의 시간인, <b>${getSijuTimeDifference(correctedDate, myowoonResult.dirMode)} / 2시간</b>을<br>
                실제 보정 시각과 처음 간지가 전환되는 사이의 차이는 <b>${durationStr} / 10일</b>일로 치환하고, <br>
                보정 시각에서 첫번째 간지 변환일자는 <b>${formatByTimeKnown(myowoonResult.sijuFirstChangeDate)}</b>로 산출됩니다. <br>           
                그 다음부터는 <b>10일</b>의 간격으로 <b>${myowoonResult.dirMode}</b>이 계속 진행됩니다. <br>
                최종적으로 다 더했을 때 마지막으로 간지가 바뀐 시간은 <b>${formatByTimeKnown(myowoonResult.sijuLastChangeDate)}에 (${myowoonResult.sijuCurrentPillar})</b>로 변경되었습니다.
              </li>
            `;
          
          html += `
          <li>
            <div class="pillar_title"><strong>일주</strong></div>
            원국 일주 간지: <b>${dayPillar}</b><br>
            보정 후 처음 간지 바뀌는 시간: <b>${formatByTimeKnown(myowoonResult.iljuFirstChangeDate)}</b><br>
            보정 후 오늘까지 마지막으로 바뀐 시간: <b>${formatByTimeKnown(myowoonResult.iljuLastChangeDate)}</b><br>
            다음 간지 바뀌는 날짜 : <b>${formatByTimeKnown(myowoonResult.iljuLastChangeDateStart)}</b><br>
            
            최종 업데이트 이벤트 간지: <b>${myowoonResult.iljuCurrentPillar}</b><br>
            방향: <b>${myowoonResult.dirMode}</b><br><br>
            묘운 일주의 경우, 시주가 일주의 12개의 팔이기 때문에,<br> 자시일수론과 인시일수론에 따라 다르게 나옵니다.<br>
            자시 일수론의 경우, 시주(시지)기준으로,<br> <ins>순행은 자시 역행은 해시(역으로 흐르기 때문에)에 따라 일주가 바뀌며</ins>,<br>
            인시 일수론의 경우, 시주(시지)기준으로,<br> <ins>순행은 인시 역행은 축시(역으로 흐르기 때문에)에 따라 일주가 바뀝니다</ins>.<br>
            현재 [${timeLabel}]일수론 사용중입니다.
          </li>
          `;
         }
     } else {
      html += `
        <li>
          <div class="pillar_title"><strong>시주</strong> </div>
          (시간이 없어 구할 수 없습니다.)
        </li>
        <li>
          <div class="pillar_title"><strong>일주</strong> </div>
          (시간이 없어 구할 수 없습니다.)
        </li>
      `
     } 
     
      // 동적 업데이트 바뀐 횟수: <b>${getDynamicStep(myowoonResult.woljuFirstChangeDate, woljuCycle, refDate)}</b><br>
      html += `
        <li>
          <div class="pillar_title"><strong>월주</strong></div>
          ${isTimeUnknown ? '(시간이 없어 계산이 정확하지 않습니다.)' : ''}<br>
          원국 월주 간지: <b>${monthPillar}</b><br>
          보정 후 처음 간지 바뀌는 시간: <b>${formatByTimeKnown(myowoonResult.woljuFirstChangeDate)}</b><br>
          보정 후 오늘까지 마지막으로 바뀐 시간: <b>
          ${ myowoonResult.woljuLastChangeDate == null
            ? `변경없음` 
            : `${formatByTimeKnown(myowoonResult.woljuLastChangeDate)}` }
          </b><br>
          다음 간지 바뀌는 날짜 : <b>${formatByTimeKnown(myowoonResult.woljuLastChangeDateStart)}</b><br>
          
          최종 업데이트 이벤트 간지: <b>${myowoonResult.woljuCurrentPillar}</b><br>
          방향: <b>${myowoonResult.dirMode}</b><br><br>
          묘운 월주의 경우, 순행은 생일 기준으로,<br> 다음 절기로, 역행은 전 절기를 보고 구하게 됩니다.<br>
          이 명식은 <b>${myowoonResult.dirMode}</b>이므로, ${direction()} 절기의 까지의 기간을 산출합니다.<br>
          보정시에서 ${direction()} 절기의 기간까지 산출했을 때, <br>
          <b>${getWoljuTimeDifference(correctedDate, myowoonResult.dirMode)}</b> 나오게 되며, <br>
          ${getWoljuTimeDifference(correctedDate, myowoonResult.dirMode)} / 한달을 → <b>${monthStr}</b> / 10년으로 치환하여 구하게 됩니다.<br>
          위에서 구한 년도가 몇년이냐에 따라 대운수가 정해지게 됩니다. <br>
          그 뒤에는 그 뒤의 다음(순행) 혹은 이전(역행) 절기의<br> 날짜와 시간을 보고 시간을 구하게 되는데,<br>
          순행은 절기가 지난 바로 다음절기, 역행은 절기가 지나기 바로 전절기를 보게 됩니다.<br>
          그것을 120년으로 확장하면, 약 10년이라는 시간뒤에 다음 월주가 변하는 것입니다.
        </li>
      `;
      
      html += `
      <li>
        <div class="pillar_title"><strong>연주</strong></div>
        ${isTimeUnknown ? '(시간이 없어 계산이 정확하지 않습니다.)' : ''}<br>
        원국 연주 간지: <b>${yearPillar}</b><br>
        보정 후 처음 간지 바뀌는 시간: <b>${formatByTimeKnown(myowoonResult.yeonjuFirstChangeDate)}</b><br>
        보정 후 오늘까지 마지막으로 바뀐 시간: `;
        if (myowoonResult.yeonjuLastChangeDate == null) {
          html += `<b>변경없음</b><br>
           다음간지 바뀌는 날짜 : <b>${formatByTimeKnown(myowoonResult.yeonjuFirstChangeDate)}</b><br>
           최종 업데이트 이벤트 간지: <b>변경없음</b>
          `;
        } else {
          html +=`<br><b>이미 한번 간지가 바뀌었기때문에 다음 시점이 없습니다.</b><br>
          최종 업데이트 이벤트 간지: <b>${myowoonResult.yeonjuCurrentPillar}</b>
          `;
        }
        html +=`<br>
        방향: <b>${myowoonResult.dirMode}</b><br><br>
        묘운 연주의 경우, 시주가 일주의 12개의 팔이기 때문에, 묘운 인월에 변경됩니다. (역행은 축월)<br>
        월주(월지)기준으로, 순행은 인월 역행은 축월(역으로 흐르기 때문에)에<br> 방향에 따라, 연주가 바뀝니다.
      </li>
    `;
    
      ul.innerHTML = html;
    }
    updateExplanDetail(myowoonResult, hourPillar);

    function getDaySplit(dateObj) {
      const dayGanZhi = getDayGanZhi(dateObj); 
      const dayStem = getDayStem(dayGanZhi);
      const dayBranch = dayGanZhi[1];
      return {
        gan: dayStem,      // 일간
        zhi: dayBranch,    // 일지
        ganZhi: dayGanZhi, // 전체 간지
      };
    }

    function getHourBranchName(date) {
      const hour = date.getHours();
      const index = Math.floor(hour / 2) % 12;
      return ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"][index];
    }
    
    function getHourBranchFromPillar(pillarStr) {
      if (!pillarStr || pillarStr.length < 2) return null;
      return pillarStr.charAt(1);
    }

    function getOriginalDateFromItem(item) {
      const year = parseInt(item.year);
      const month = parseInt(item.month) - 1;
      const day = parseInt(item.day);
    
      let hour = 3, minute = 30;
      if (!item.isTimeUnknown && item.birthtime) {
        const raw = item.birthtime.replace(/\s/g, "");
        if (raw.length === 4) {
          hour = parseInt(raw.substring(0, 2), 10);
          minute = parseInt(raw.substring(2, 4), 10);
        }
      }
    
      return new Date(year, month, day, hour, minute, 0);
    }

    function updateCalenderFunc(refDate) {
      updateCurrentSewoonCalendar(refDate);
      updateMonthlyWoonByToday(refDate);
      updateHourWoon(refDate);
      updateDayWoon(refDate);
      
      myowoonResult = getMyounPillars(myData, refDate, selectTimeValue, hourPillar);
      updateMyowoonSection(myowoonResult);
    }

    function updateFunc(refDate) {
      updateFortune();
      updateOriginalSetMapping(daySplitGlobal, hourSplitGlobal);
      updateColorClasses();
      updateCurrentDaewoon(refDate);
      updateAllDaewoonItems(daewoonData.list);
      updateCurrentSewoon(refDate);
      updateSewoonItem(refDate); 
      const refDateYear = refDate.getFullYear();
      updateMonthlyData(refDateYear, refDate);
      updateMonthlyWoonByToday(refDate);
      
      const {
        solarTermName,
        startDate,
        endDate,
        currentIndex,
        boundaries,
        solarYear,
      } = getMonthlyWoonParameters();

      const calendarHTML = generateDailyFortuneCalendar(
        solarTermName, startDate, endDate, currentIndex, boundaries, solarYear, refDate
      );
      document.getElementById("iljuCalender").innerHTML = calendarHTML;
      
      updateHourWoon(refDate);
      updateDayWoon(refDate);
      myowoonResult = getMyounPillars(myData, refDate, selectTimeValue, hourPillar);
      updateMyowoonSection(myowoonResult);
    }

    updateFuncVr = updateFunc;

    function radioFunc() {

      let originalDate;
      let correctedRadio;

      const savedList = JSON.parse(localStorage.getItem("myeongsikList")) || [];
      const hasSaved = 
        typeof currentModifyIndex === "number" &&
        savedList[currentModifyIndex] !== undefined;

      if (!hasSaved) {
        originalDate = new Date(year, month - 1, day, hour, minute);
        correctedRadio  = adjustBirthDateWithLon(originalDate, usedBirthPlace, isPlaceUnknown);
        const originalBranch = getHourBranchFromPillar(hourPillar); 
        const realBranch = getHourBranchName(originalDate); 
        if (realBranch !== originalBranch) {
          return;
        }
      } else {
        originalDate    = getOriginalDateFromItem(currentMyeongsik);
        correctedRadio  = adjustBirthDateWithLon(originalDate, currentMyeongsik.birthPlace, currentMyeongsik.isPlaceUnknown);

        const originalBranch = getHourBranchFromPillar(currentMyeongsik.hourPillar); 
        const realBranch = getHourBranchName(originalDate); 
        if (realBranch !== originalBranch) {
          return;
        }
        
      }

      function getDateForGanZhiWithRadio(originalDate) {
        const selectedTime = document.querySelector('input[name="timeChk02"]:checked')?.value;
        const adjusted = new Date(originalDate);
      
        if (selectedTime === "jasi") {
          adjusted.setHours(23, 0, 0, 0); 
        } else if (selectedTime === "yajasi") {
          adjusted.setHours(0, 0, 0, 0);  
        } else if (selectedTime === "insi") {
          adjusted.setHours(3, 0, 0, 0); 
        }
      
        return adjusted;
      }
      
      const branchIndex = getHourBranchIndex(correctedRadio);
      const branchName = Jiji[branchIndex];

      if (branchName === "자" || branchName === "축") {
        
        let corrected;
        if (!hasSaved) {
          corrected = adjustBirthDateWithLon(
            originalDate,
            usedBirthPlace,
            isPlaceUnknown
          );
        } else {
          corrected = adjustBirthDateWithLon(
            originalDate,
            currentMyeongsik.birthPlace,
            currentMyeongsik.isPlaceUnknown
          );
        }
      
        const selectedTime01 = document.getElementById("timeChk02_01")?.checked; // 자시
        const selectedTime03 = document.getElementById("timeChk02_03")?.checked; // 인시
      
        let correctedForGanZhi = new Date(corrected); 
        if (selectedTime01 || selectedTime03) {
          correctedForGanZhi.setDate(correctedForGanZhi.getDate() - 1); // 🔥 전날로 수동 보정
        }
      
        const ganZhiDate = getDateForGanZhiWithRadio(correctedForGanZhi);
      
        const __daySplit = getDaySplit(ganZhiDate);
        const newGan = __daySplit.gan;
      
        baseDayStem = newGan;
      }
      
    }
    
    document.getElementById("woonChangeBtn2").addEventListener("click", function () {
      const pickerDt = document.getElementById('woonTimeSetPicker2');
      const pickerD  = document.getElementById('woonTimeSetPickerVer22');
      const pickerM  = document.getElementById('woonTimeSetPickerVer23');

      if (!pickerDt.hidden) {
        currentMode = 'ver21';           
      } else if (!pickerD.hidden) {
        currentMode = 'ver22';           
      } else if (!pickerM.hidden) {
        currentMode = 'ver23';           
      }
      handleChangeVr();                  
      
      const picker = isCoupleMode ? getCurrentPicker2() : getCurrentPicker();
      refDate = (picker && picker.value) ? toKoreanTime(new Date(picker.value)) : toKoreanTime(new Date());

      updateOriginalAndMyowoonVr(refDate);

      function clearHyphenElements(rootEl) {
        const root = typeof rootEl === 'string'
          ? document.querySelector(rootEl)
          : rootEl;
        if (!root) return;
      
        const classesToRemove = [
          "b_green","b_red","b_white","b_black","b_yellow","active"
        ];
      
        // 1) hanja_con 내부 <p> (음양) 검사
        root.querySelectorAll('li.siju_con3 .hanja_con > p')
          .forEach(p => {
            if (p.textContent.trim() === "-") {
              const hanja = p.parentElement;
              hanja.classList.remove(...classesToRemove);
              p.classList.remove(...classesToRemove);
            }
          });
      
        root.querySelectorAll('li.siju_con3 > p')
          .forEach(p => {
            if (p.textContent.trim() === "-") {
              p.classList.remove(...classesToRemove);
            }
          });
      }
      
      document.querySelectorAll('.siju_con3').forEach(root => {
        clearHyphenElements(root);
      });
    });

    document.getElementById("woonChangeBtn").addEventListener("click", function () {
      const picker = isCoupleMode ? getCurrentPicker2() : getCurrentPicker();
      refDate = (picker && picker.value) ? toKoreanTime(new Date(picker.value)) : toKoreanTime(new Date());

      const branchIndex = getHourBranchIndex(correctedDate);
      const branchName = Jiji[branchIndex];

      if (branchName === "자" || branchName === "축") {
        radioFunc();
      }
      updateCalenderFunc(refDate);
      updateExplanDetail(myowoonResult, hourPillar);
      
      function clearHyphenElements(rootEl) {
        const root = typeof rootEl === 'string'
          ? document.querySelector(rootEl)
          : rootEl;
        if (!root) return;
      
        const classesToRemove = [
          "b_green","b_red","b_white","b_black","b_yellow","active"
        ];
      
        root.querySelectorAll('li.siju_con4 .hanja_con > p')
          .forEach(p => {
            if (p.textContent.trim() === "-") {
              const hanja = p.parentElement;
              hanja.classList.remove(...classesToRemove);
              p.classList.remove(...classesToRemove);
            }
          });
      
        root.querySelectorAll('li.siju_con4 > p')
          .forEach(p => {
            if (p.textContent.trim() === "-") {
              p.classList.remove(...classesToRemove);
            }
          });
      }
      
      document.querySelectorAll('.siju_con4').forEach(root => {
        clearHyphenElements(root);
      });
    });

    const pickerIds = [
      'woonTimeSetPicker',
      'woonTimeSetPicker2',
      'woonTimeSetPickerVer2',
      'woonTimeSetPickerVer3',
      'woonTimeSetPickerVer22',
      'woonTimeSetPickerVer23'
    ];
    
    function validatePicker(picker) {
      const selectedDate = new Date(picker.value);
      if (selectedDate <= correctedDate) {
        alert('생일(보정시 + 1분) 전 시간은 계산할 수 없습니다.');
        const now = new Date();
        const localNow = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16);
    
        picker.value = localNow;
        return false;
      }
      return true;
    }
    
    ['woonChangeBtn', 'woonChangeBtn2'].forEach(btnId => {
      const btn = document.getElementById(btnId);
      if (!btn) return;
    
      btn.addEventListener('click', () => {
        pickerIds.forEach(pickerId => {
          const picker = document.getElementById(pickerId);
          if (picker) validatePicker(picker);
        });
      });
    });

    function getRadioBasedDate(baseDate) {
      let d = new Date(baseDate);
      if (document.getElementById("jasi").checked) {
        d.setHours(23, 0, 0, 0);
      } else if (document.getElementById("yajasi").checked) {
        d.setHours(0, 0, 0, 0);
      } else if (document.getElementById("insi").checked) {
        d.setHours(3, 0, 0, 0);
      }
      return d;
    }

    function smoothUpdate(manualSiju) {
      const containers = document.querySelectorAll('.siju_con');
      if (!containers.length) return;
    
      containers.forEach(c => c.style.opacity = '0');
    
      const onEnd = e => {
        if (e.propertyName !== 'opacity') return;
        containers.forEach(c => c.removeEventListener('transitionend', onEnd));
    
        updateFortuneWithManualHour(manualSiju);
        updateFunc(refDate);
    
        setTimeout(() =>
          containers.forEach(c => c.style.opacity = '1')
        );
      };
      containers[0].addEventListener('transitionend', onEnd);
    }
    
    function parseTimeStr(tstr) {
      return {
        hour:   parseInt(tstr.slice(0,2), 10),  // "00"→0, "12"→12
        minute: parseInt(tstr.slice(2),   10),
      };
    }

    function renderSijuButtons() {
      const useJasiMode = document.getElementById('jasi').checked;
      const mapping     = useJasiMode ? fixedDayMappingBasic : fixedDayMapping;
      const sijuList    = mapping[baseDayStem];
      const labels      = useJasiMode ? Jiji : MONTH_ZHI;
      const timeMap     = {
        "자":"0035","축":"0235","인":"0435","묘":"0635",
        "진":"0835","사":"1035","오":"1235","미":"1435",
        "신":"1635","유":"1835","술":"2035","해":"2235"
      };
      const hourListEl  = document.getElementById("hourList");

      {
        hourListEl.innerHTML = "";
        sijuList.forEach((siju, idx) => {
          const lbl = labels[idx];
          // 버튼 생성
          const btn = document.createElement("button");
          btn.id        = `siju-btn-${idx}`;
          btn.className = "black_btn";
          btn.textContent = `${lbl}시 (${siju})`;


          btn.addEventListener("click", () => {
            if (btn.classList.contains("active")) {
              checkOption.style.display = 'none';
              btn.className = "black_btn";
              btn.textContent = `${lbl}시 (${siju})`;
              btn.classList.remove("b_green","b_red","b_white","b_black","b_yellow","active");
              const classesToRemove = [
                "b_green","b_red","b_white","b_black","b_yellow","active"
              ];
              
              document.querySelectorAll('.siju_con, div.hanja_con').forEach(container => {
                container.classList.remove(...classesToRemove);
            
                container.querySelectorAll('p').forEach(p => {
                  p.classList.remove(...classesToRemove);
                });
              });

              isTimeUnknown = true;
              document.getElementById("inputBirthtime").value = "";

              updateStemInfo("Ht", { gan: "-", ji: "-" }, baseDayStem);
              updateBranchInfo("Hb", "-", baseDayStem);
          
              ["Hb12ws","Hb12ss"].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.textContent = "-";
              });

              const birthType = document.getElementById("monthType").value;  // "음력" 또는 "양력"
              let solarY = birthYear,
                  solarM = birthMonth,
                  solarD = birthDay;

              if (birthType === "음력") {
                const cal = new KoreanLunarCalendar();
                cal.setLunarDate(birthYear, birthMonth, birthDay, false);
                const sol = cal.getSolarCalendar();
                solarY = sol.year;
                solarM = sol.month;
                solarD = sol.day;
              }

              const resetData = {
                correctedDate,
                solarY, solarM, solarD,
                hour: null, minute: null,
                yearPillar, monthPillar, dayPillar,
                hourPillar: null,
                gender
              };
              const resetResult = getMyounPillarsVr(resetData, refDate, selectTimeValue, hourPillar);
              updateMyowoonSection(resetResult);
              updateExplanDetail(resetResult, hourPillar);
              registerMyowoonMoreHandler(hourSplit = null);

              function clearHyphenElements(rootEl) {
                const root = typeof rootEl === 'string'
                  ? document.querySelector(rootEl)
                  : rootEl;
                if (!root) return;
              
                const classesToRemove = [
                  "b_green","b_red","b_white","b_black","b_yellow","active"
                ];
              
                root.querySelectorAll('li.siju_con5 .hanja_con > p')
                  .forEach(p => {
                    if (p.textContent.trim() === "-") {
                      // 부모 .hanja_con 에서 클래스 제거
                      const hanja = p.parentElement;
                      hanja.classList.remove(...classesToRemove);
                      // p 자신도 제거
                      p.classList.remove(...classesToRemove);
                    }
                  });
              
                root.querySelectorAll('li.siju_con5 > p')
                  .forEach(p => {
                    if (p.textContent.trim() === "-") {
                      p.classList.remove(...classesToRemove);
                    }
                  });
              }
              
              document.querySelectorAll('.siju_con5').forEach(root => {
                clearHyphenElements(root);
              });
          
              return;
            } else {
              sijuList.forEach((_, i) => {
                const b = document.getElementById(`siju-btn-${i}`);
                if (!b) return;
                b.className = "black_btn";
                b.textContent = `${labels[i]}시 (${sijuList[i]})`;
                b.classList.remove("b_green","b_red","b_white","b_black","b_yellow","active");
              });

              btn.classList.add("active");
              btn.textContent = `${lbl}시 적용중`;
              if (["인","묘"].includes(lbl))      btn.classList.add("b_green");
              else if (["사","오"].includes(lbl)) btn.classList.add("b_red");
              else if (["신","유"].includes(lbl)) btn.classList.add("b_white");
              else if (["자","해"].includes(lbl)) btn.classList.add("b_black");
              else                                 btn.classList.add("b_yellow");

              const birthType = document.getElementById("monthType").value;  // "음력" 또는 "양력"
              let solarY = birthYear,
                  solarM = birthMonth,
                  solarD = birthDay;

              if (birthType === "음력") {
                const cal = new KoreanLunarCalendar();
                cal.setLunarDate(birthYear, birthMonth, birthDay, false);
                const sol = cal.getSolarCalendar();
                solarY = sol.year;
                solarM = sol.month;
                solarD = sol.day;
              }

              const { hour, minute } = parseTimeStr(timeMap[lbl]);
              const orig = new Date(solarY, solarM - 1, solarD, hour, minute);
              const corr = adjustBirthDateWithLon(orig, birthPlaceInput, isPlaceUnknown);
              correctedDate = (corr instanceof Date && !isNaN(corr.getTime())) ? corr : orig;
              document.getElementById("inputBirthtime").value = timeMap[lbl];

              isTimeUnknown = false;
              manualOverride = true;
              const hourSplit2 = splitPillar(siju);
              updateOriginalSetMapping(daySplitGlobal, hourSplit2);
              smoothUpdate(siju);

              const myData2 = {
                correctedDate,
                year, month, day,
                hour, minute,
                yearPillar, monthPillar, dayPillar,
                hourPillar: siju,
                gender
              };
              const myResult = getMyounPillarsVr(myData2, refDate, selectTimeValue, hourPillar);
              setTimeout(()=>{
                updateMyowoonSection(myResult);
                updateExplanDetail(myResult, siju);
                registerMyowoonMoreHandler(hourSplit2)
              }, 180);
              
              hourPillar = siju;
            }
            
          });
          
          hourListEl.appendChild(btn);
        });
        initialized = true;
      }
    }
    
    const birthYear  = year;
    const birthMonth = month;
    const birthDay   = day;

    function updateDayPillarByPrev(baseDate) {
      const d = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
      d.setDate(d.getDate() - 1);

      const dayPillar = getDayGanZhi(d);
      const split     = splitPillar(dayPillar);
      updateStemInfo("Dt", split, split.gan);
      updateBranchInfo("Db", split.ji, split.gan);
      setText("Db12ws", getTwelveUnseong(split.gan, split.ji));
      setText("Db12ss", getTwelveShinsalDynamic(dayPillar, yearPillar, split.ji));
    }


    function updateDayPillarByCurr(baseDate) {
      const d = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());

      const dayPillar = getDayGanZhi(d);
      const split     = splitPillar(dayPillar);

      updateStemInfo("Dt", split, split.gan);
      updateBranchInfo("Db", split.ji, split.gan);
      setText("Db12ws", getTwelveUnseong(split.gan, split.ji));
      setText("Db12ss", getTwelveShinsalDynamic(dayPillar, yearPillar, split.ji));
    }

    function updateDayPillarByNext(baseDate) {
      const d = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
      d.setDate(d.getDate() + 1);

      const dayPillar = getDayGanZhi(d);
      const split     = splitPillar(dayPillar);

      updateStemInfo("Dt", split, split.gan);
      updateBranchInfo("Db", split.ji, split.gan);
      setText("Db12ws", getTwelveUnseong(split.gan, split.ji));
      setText("Db12ss", getTwelveShinsalDynamic(dayPillar, yearPillar, split.ji));
    }
    
    function updateDayPillar(manualSiju) {
      const cd = correctedDate instanceof Date && !isNaN(correctedDate.getTime())
        ? correctedDate
        : new Date(birthYear, birthMonth-1, birthDay);
      const base = new Date(cd.getFullYear(), cd.getMonth(), cd.getDate());
    
      const branch = manualSiju.charAt(1);
      const useInsi = document.getElementById('insi').checked;
      if (["자","축"].includes(branch) && useInsi) {
        base.setDate(base.getDate() - 1);
      }
    
      const dayPillar = getDayGanZhi(base);
      const split     = splitPillar(dayPillar);
      updateStemInfo("Dt", split, baseDayStem);
      updateBranchInfo("Db", split.ji, baseDayStem);
      setText("Db12ws", getTwelveUnseong(baseDayStem, split.ji));
      setText("Db12ss", getTwelveShinsalDynamic(dayPillar, yearPillar, split.ji));
    }
    
    function updateFortuneWithManualHour(manualSiju) {
      manualOverride2 = true;
      const bt   = document.getElementById('inputBirthtime').value;
      const hr   = parseInt(bt.slice(0,2),10);
      const mi   = parseInt(bt.slice(2),10);
      const orig = new Date(birthYear, birthMonth - 1, birthDay, hr, mi);
      const corr = adjustBirthDateWithLon(orig, birthPlaceInput, isPlaceUnknown);
      const newCorrected = (corr instanceof Date && !isNaN(corr.getTime())) ? corr : orig;
      const split = splitPillar(manualSiju);
      updateStemInfo("Ht", split, baseDayStem);
      updateBranchInfo("Hb", split.ji, baseDayStem);
      setText("Hb12ws", getTwelveUnseong(baseDayStem, split.ji));
      setText("Hb12ss", getTwelveShinsalDynamic(dayPillar, yearPillar, split.ji));
    
      const prevCorrectedDate = correctedDate;
      correctedDate = newCorrected;
      const branchName  = manualSiju.charAt(1);
      requestAnimationFrame(() => {
        if (branchName === "자" || branchName === "축") {
          updateDayPillarByPrev(correctedDate); 
        } else {
          updateDayPillarByCurr(correctedDate);
        }
      });
      
      if (!manualOverride2) {
        updateDayPillar(currentHourPillar);
      }
    
      correctedDate = prevCorrectedDate;
    
      updateColorClasses();
      updateFunc(refDate);

      manualOverride2 = false;
    }

    globalState.originalTimeUnknown = isTimeUnknown;
    if (globalState.originalTimeUnknown) {  
      renderSijuButtonsVr = renderSijuButtons();
    }

    document.querySelectorAll('input[name="timeChk02"]').forEach(function(radio) {
      radio.addEventListener("change", function() {
        const selectedValue = this.value;
        const calcRadio = document.querySelector('input[name="time2"][value="' + selectedValue + '"]');
        if (calcRadio) {
          calcRadio.checked = true;
        }

        const picker = isCoupleMode ? getCurrentPicker2() : getCurrentPicker();
        const rawRefDate = (picker && picker.value) ? new Date(picker.value) : new Date();

        const branchIndex = getHourBranchIndex(correctedDate);
        const branchName = Jiji[branchIndex];

        if (branchName === "자" || branchName === "축") {
          const yajasiElem = document.getElementById('yajasi');
          const yajasi = yajasiElem && yajasiElem.checked;
          const jasiElem = document.getElementById('jasi');
          const isJasi = jasiElem && jasiElem.checked;
          const insiElem = document.getElementById('insi');
          const isInsi = insiElem && insiElem.checked;

          if ((isJasi && correctedDate.getHours() >= 23)
          && (yajasi && correctedDate.getHours() >= 0)
          && (isInsi && correctedDate.getHours() > 3)) {
            requestAnimationFrame(()=>{
              updateDayPillarByPrev(correctedDate);
            });
            radioFunc();
          }
        }
        updateFunc(rawRefDate);

        function clearHyphenElements(rootEl) {
          const root = typeof rootEl === 'string'
            ? document.querySelector(rootEl)
            : rootEl;
          if (!root) return;
        
          const classesToRemove = [
            "b_green","b_red","b_white","b_black","b_yellow","active"
          ];
        
          root.querySelectorAll('li.siju_con .hanja_con > p')
            .forEach(p => {
              if (p.textContent.trim() === "-") {
                // 부모 .hanja_con 에서 클래스 제거
                const hanja = p.parentElement;
                hanja.classList.remove(...classesToRemove);
                // p 자신도 제거
                p.classList.remove(...classesToRemove);
              }
            });
        
          root.querySelectorAll('li.siju_con > p')
            .forEach(p => {
              if (p.textContent.trim() === "-") {
                p.classList.remove(...classesToRemove);
              }
            });
        }

        document.querySelectorAll('.siju_con').forEach(root => {
          clearHyphenElements(root);
        });

        setTimeout(function(){
          const newResult = getMyounPillars(myData, rawRefDate, selectedValue, hourPillar);
          updateExplanDetail(newResult, hourPillar);
          updateMyowoonSection(newResult);
        });
        if (globalState.originalTimeUnknown) {  
          requestAnimationFrame(function(){
            renderSijuButtons();
          });
        }
      });
    });    

    document.getElementById("woonVer1Change").click();
    document.getElementById("woonChangeBtn").click();

    function updateAllTwelveShinsal(dayPillar, yearPillar) {
      setText("Hb12ss", isTimeUnknown ? "-" : getTwelveShinsalDynamic(dayPillar, yearPillar, hourSplit.ji));
      setText("Db12ss", getTwelveShinsalDynamic(dayPillar, yearPillar, daySplit.ji));
      setText("Mb12ss", getTwelveShinsalDynamic(dayPillar, yearPillar, monthSplit.ji));
      setText("Yb12ss", getTwelveShinsalDynamic(dayPillar, yearPillar, baseYearBranch));
      updateCurrentDaewoon(refDate);
      updateAllDaewoonItems(daewoonData.list);
      updateCurrentSewoon(refDate)
      updateSewoonItem(refDate);
      updateMonthlyData(computedSewoonYear, refDate);
      const today = toKoreanTime(new Date());
      const currentMonthIndex = today.getMonth();
      updateMonthlyWoon(computedSewoonYear, currentMonthIndex, baseDayStem);
      const {
        solarTermName,
        startDate,
        endDate,
        currentIndex,
        boundaries,
        solarYear,
      } = getMonthlyWoonParameters();

      const calendarHTML = generateDailyFortuneCalendar(
        solarTermName, startDate, endDate, currentIndex, boundaries, solarYear, refDate
      );
      document.getElementById("iljuCalender").innerHTML = calendarHTML;

      const yp = myowoonResult.yeonjuCurrentPillar;
      const mp = myowoonResult.woljuCurrentPillar;
      const dp = myowoonResult.iljuCurrentPillar;
      const hp = myowoonResult.sijuCurrentPillar;

      setText("MyoYb12ss", getTwelveShinsalDynamic(dayPillar, yearPillar, yp[1]));
      setText("MyoMb12ss", getTwelveShinsalDynamic(dayPillar, yearPillar, mp[1]));
      setText("MyoDb12ss", getTwelveShinsalDynamic(dayPillar, yearPillar, dp[1]));
      setText("MyoHb12ss", getTwelveShinsalDynamic(dayPillar, yearPillar, hp[1]));
      const kstDate = toKoreanTime(refDate);
      const adjustedDate = new Date(kstDate.getTime());
      const dayGanZhi = getDayGanZhi(adjustedDate);
      const { gan, ji } = splitPillar(dayGanZhi);
      setText("WDb12ss", getTwelveShinsalDynamic(dayPillar, yearPillar, ji) || "-");
      const date = new Date(refDate);
      const hourBranch = getHourBranchUsingArray2(date);
      setText("WTb12ss", getTwelveShinsalDynamic(dayPillar, yearPillar, hourBranch) || "-");
      requestAnimationFrame(() => {
        updateColorClasses();
      });
    }

    updateAllTwelveShinsal(dayPillar, yearPillar);
    
     const controlIds = [
      's12CtrlType01', // 현대론
      's12CtrlType02', // 고전론
      's12CtrlType03', // 개화론
      's12CtrlType04', // 일지 기준
      's12CtrlType05'  // 연지 기준
    ];

    controlIds.forEach(id => {
      const ctrl = document.getElementById(id);
      if (!ctrl) return;

      const saved = localStorage.getItem(id);
      if (saved !== null) {
        ctrl.checked = (saved === 'true');
      }

      ctrl.addEventListener('change', () => {
        localStorage.setItem(id, ctrl.checked);
        updateAllTwelveShinsal(dayPillar, yearPillar);
      });
    });

    ['s12CtrlType01', 's12CtrlType02'].forEach(id => {
      const radio = document.getElementById(id);
      if (!radio) return;
      radio.addEventListener('change', () => {
        if (radio.checked) {
          localStorage.setItem(RADIO_KEY, id);
        }
      });
    });

    const RADIO_KEY = 's12SelectedShin';
    const savedId   = localStorage.getItem(RADIO_KEY);
    if (savedId) {
      const radio = document.getElementById(savedId);
      if (radio) {
        radio.checked = true;
        radio.dispatchEvent(new Event('change'));
      }
    }

    ['s12CtrlType04', 's12CtrlType05'].forEach(id => {
      const radio2 = document.getElementById(id);
      if (!radio2) return;
      radio2.addEventListener('change', () => {
        if (radio2.checked) {
          localStorage.setItem(RADIO_KEY2, id);
        }
      });
    });

    const RADIO_KEY2 = 's12SelectedShin2';
    const savedId2   = localStorage.getItem(RADIO_KEY2);
    if (savedId) {
      const radio2 = document.getElementById(savedId2);
      if (radio2) {
        radio2.checked = true;
        radio2.dispatchEvent(new Event('change'));
      }
    }

    updateAllTwelveShinsal(dayPillar, yearPillar);

    document.querySelectorAll('#s12CtrlType01, #s12CtrlType02, #s12CtrlType03, #s12CtrlType04, #s12CtrlType05').forEach(el => {
      el.addEventListener('change', function() {
        updateAllTwelveShinsal(dayPillar, yearPillar);
      });
    });

    window.scrollTo(0, 0);
    //document.getElementById('inputWrap').style.display = 'none';
    //document.getElementById('resultWrapper').style.display = 'block';
    //document.getElementById("saveBtn").style.display = "inline-block";
    //setBtnCtrl.style.display = "block";
  });

  let originalBirthPlace = ""; 

  function startModify(index) {
    const savedList = JSON.parse(localStorage.getItem("myeongsikList")) || [];
    const selected = savedList[index];
    if (!selected) return;
    currentModifyIndex = index;
    originalBirthPlace = selected.birthPlace?.trim() || "";
    isModifyMode = true;
    const snapshot = {
      birthday: selected.birthday,
      monthType: selected.monthType,
      birthtime: selected.birthtime,
      birthtimeFormat: selected.birthtimeFormat,
      year: selected.year,
      month: selected.month,
      day: selected.day,
      hour: selected.hour,
      minute: selected.minute, 
      gender: selected.gender,
      birthPlace: selected.birthPlace,
      name: selected.name,
      result: selected.result,
      yearPillar: selected.yearPillar,
      monthPillar: selected.monthPillar,
      dayPillar: selected.dayPillar,
      hourPillar: selected.hourPillar,
      age: selected.age,
      birthdayTime: selected.birthdayTime,
      lunarBirthday: selected.lunarBirthday,
      isTimeUnknown: selected.isTimeUnknown,
      isPlaceUnknown: selected.isPlaceUnknown,
      selectedTime2: selected.selectedTime2 || "",
      group: selected.group,
      birthPlaceFull: selected.birthPlaceFull,
      birthPlaceLongitude: selected.cityLon,
      correctedDate: selected.fixedCorrectedDate
      
    };
    originalDataSnapshot = JSON.stringify(snapshot);
    
  }

  //const ModifyBtn = document.getElementById("ModifyBtn");

  function updateFourPillarsUI(data) {
    if (!(data.correctedDate instanceof Date)) {
      console.warn("updateFourPillarsUI: correctedDate 없음, UI 업데이트 스킵");
      return;
    }

    const cd = data.correctedDate;
    const fullResult = getFourPillarsWithDaewoon(
      cd.getFullYear(),
      cd.getMonth() + 1,
      cd.getDate(),
      data.hour,
      data.minute,
      data.gender,
      cd
    );

    const parts      = fullResult.split(", ");
    const pillars     = (parts[0] || "-").split(" ");
    const yearPillar  = pillars[0] || "-";
    const monthPillar = pillars[1] || "-";
    const dayPillar   = pillars[2] || "-";
    const rawHour     = pillars[3] || "-";
    const hourPillar  = data.isTimeUnknown ? null : rawHour;
  
    const yearSplit  = splitPillar(yearPillar);
    const monthSplit = splitPillar(monthPillar);
    const daySplit   = splitPillar(dayPillar);
    const hourSplit  = data.isTimeUnknown ? null : splitPillar(hourPillar);
  
    baseDayStem    = daySplit.gan;            
    baseDayBranch  = dayPillar.charAt(1);     
    baseYearBranch = yearPillar.charAt(1);    
  
    updateStemInfo  ("Yt", yearSplit,  baseDayStem);
    updateBranchInfo("Yb", yearSplit.ji, baseDayStem);
  
    updateStemInfo  ("Mt", monthSplit, baseDayStem);
    updateBranchInfo("Mb", monthSplit.ji, baseDayStem);
  
    updateStemInfo  ("Dt", daySplit,  baseDayStem);
    updateBranchInfo("Db", daySplit.ji, baseDayStem);
  
    if (!data.isTimeUnknown) {
      updateStemInfo  ("Ht", hourSplit,  baseDayStem);
      updateBranchInfo("Hb", hourSplit.ji, baseDayStem);
    } else {
      clearHourUI();
    }
  }

  function drawResult(data) {
    updateFourPillarsUI(data);
  }

  document.addEventListener("click", function (event) {
    const modifyBtn = event.target.closest(".modify_btn");
    
    if (!modifyBtn) return;
    backBtn.style.display = 'none';
    loadCityLongitudes();

    const index = parseInt(modifyBtn.getAttribute("data-index"), 10);
    const savedList = JSON.parse(localStorage.getItem("myeongsikList")) || [];
    const selected = savedList[index];
    if (!selected) return;

    console.log("👉 선택된 데이터:", selected);
    if (!selected) return;

    restoreCurrentPlaceMapping(selected);

    startModify(index);

    groupEctWrap.style.display = 'none';
    inputMeGroupEct.value = '';
  
    document.getElementById("inputWrap").style.display = "block";
    document.getElementById("resultWrapper").style.display = "none";
    document.getElementById("aside").style.display = "none";
    setBtnCtrl.style.display = "none";
  
    document.getElementById("inputName").value = selected.name;
    document.getElementById("inputBirthday").value = selected.birthday;
    document.getElementById("inputBirthtime").value = selected.birthtime;
    document.getElementById("inputBirthPlace").value = selected.birthPlace;
  
    if (selected.gender === "남") {
      document.getElementById("genderMan").checked = true;
      document.getElementById("genderWoman").checked = false;
    } else {
      document.getElementById("genderMan").checked = false;
      document.getElementById("genderWoman").checked = true;
    }
  
    const timeCheckbox = document.getElementById("bitthTimeX");
    const timeInput = document.getElementById("inputBirthtime");
    isTimeUnknown = selected.isTimeUnknown === true;

    timeCheckbox.checked = isTimeUnknown;

    if (isTimeUnknown) {
      timeInput.value = ""; // 계산용 값 (숨겨져 있음)
      timeInput.disabled = true;
    } else {
      timeInput.value = selected.birthtime || "";
      timeInput.disabled = false;
    }

    const placeCheckbox = document.getElementById("bitthPlaceX");
    const placeInput = document.getElementById("inputBirthPlace");
    const isPlaceUnknown = selected.isPlaceUnknown === true;

    placeCheckbox.checked = isPlaceUnknown;

    if (isPlaceUnknown) {
      placeInput.value = "출생지 선택"; // 사용자 UI 표시용
      placeInput.disabled = true;
    } else {
      placeInput.value = selected.birthPlace || "";
      placeInput.disabled = false;
    }

    if (selected.selectedTime2 === "jasi") {
      document.getElementById("jasi").checked = true;
      document.getElementById("timeChk02_01").checked = true;
    } else if (selected.selectedTime2 === "yajasi") {
      document.getElementById("yajasi").checked = true;
      document.getElementById("timeChk02_02").checked = true;
    } else if (selected.selectedTime2 === "insi") {
      document.getElementById("insi").checked = true;
      document.getElementById("timeChk02_03").checked = true;
    }

    const monthTypeSel = document.getElementById("monthType");
    if (!isTimeUnknown) {
      monthTypeSel.value = selected.monthType;
      //monthTypeSel.dispatchEvent(new Event("change"));
      monthTypeSel.addEventListener("change", () => {
        fixedCorrectedDate = null;           
        const newData = makeNewData();  
        drawResult(newData);            
      });
    }
    ensureGroupOption(selected.group);
    document.getElementById("inputMeGroup").value = selected.group || "미선택";
    updateMeGroupOption(selected.group);   // ← 여기서 selected를 넘겨줍니다

    const myowoonBtn = document.getElementById("myowoonMore");
    myowoonBtn.classList.remove("active");
    myowoonBtn.innerText = "묘운력(운 전체) 상세보기";

    currentModifyIndex = index;

    const nameInput = document.getElementById("inputName");
    nameInput.focus();
    nameInput.setSelectionRange(nameInput.value.length, nameInput.value.length);

    const favCheckbox = document.getElementById('topPs');

    
    
    favCheckbox.checked = !!selected.isFavorite;
    currentModifyIndex = index;
    isModifyMode = true;
    originalDataSnapshot = JSON.stringify(selected);
  });
  
  let isModifyMode = false;
  
  originalDataSnapshot = "";
  
  function formatTime(date) {
    if (!date) return "-";
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes}`;
  }
  
  function makeNewData() {
    const birthday = document.getElementById("inputBirthday").value.trim();
    const birthtimeRaw = document.getElementById("inputBirthtime").value.trim();
    const isTimeUnknown = document.getElementById("bitthTimeX").checked;
    const isPlaceUnknown = document.getElementById("bitthPlaceX").checked;
    const gender = document.getElementById("genderMan").checked ? "남" : "여";
    const birthPlaceInput = document.getElementById("inputBirthPlace").value;
    const name = document.getElementById("inputName").value.trim() || "이름없음";
    const selectedTime2 = document.querySelector('input[name="time2"]:checked')?.value || "";
    const birthPlaceFull = document.getElementById("inputBirthPlace").value || "";
    const cityLon =
      cityLongitudes[birthPlaceFull] || cityLongitudes[birthPlaceFull.split(' ')[0]] || null;

    const monthType = document.getElementById("monthType").value || "";

    let year = parseInt(birthday.substring(0, 4), 10);
    let month = parseInt(birthday.substring(4, 6), 10);
    let day = parseInt(birthday.substring(6, 8), 10);
    const hour = isTimeUnknown ? 4 : parseInt(birthtimeRaw.substring(0, 2), 10);
    const minute = isTimeUnknown ? 30 : parseInt(birthtimeRaw.substring(2, 4), 10);

    const savedBirthPlace = isPlaceUnknown ? "" : birthPlaceInput;

    correctedDate = fixedCorrectedDate;

    const calendar = new KoreanLunarCalendar();
    if (monthType === "음력" || monthType === "음력(윤달)") {
      const isLeap = (monthType === "음력(윤달)");
      if (!calendar.setLunarDate(year, month, day, isLeap)) {
        console.error(`${monthType} 날짜 설정에 실패했습니다.`);
      } else {
        lunarDate = { year: year, month: month, day: day, isLeap: isLeap };
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

    let lunarBirthday = "";
    if (lunarDate) {
      lunarBirthday =
        lunarDate.year + "년 " +
        (lunarDate.month < 10 ? "0" + lunarDate.month : lunarDate.month) + "월 " +
        (lunarDate.day < 10 ? "0" + lunarDate.day : lunarDate.day) + "일";
      if (lunarDate.isLeap) {
        lunarBirthday += " (윤달)";
      }
    }

    const computedResult = getFourPillarsWithDaewoon(year, month, day, hour, minute, gender, correctedDate);
    const pillarsPart = computedResult.split(", ")[0];
    const pillars = pillarsPart.split(" ");

    function clearHourUI() {
      document.getElementById("inputBirthtime").value = "";
      updateStemInfo("Ht", { gan: "-", ji: "-" }, baseDayStem);
      updateBranchInfo("Hb", "-", baseDayStem);
      ["Hb12ws","Hb12ss"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = "-";
      });
    }

    if (isTimeUnknown) {
      const resbjTimeEl = document.getElementById('resbjTime');
      resbjTimeEl.innerText = '보정시모름';
      correctedDate = new Date(year, month - 1, day, 3, 30, 0, 0);
      clearHourUI();
    } 

    const age = correctedDate ? calculateAge(correctedDate) : "-";
    const birthdayTime = correctedDate ? formatTime(correctedDate) : "?";

    let groupVal = inputMeGroupSel.value;
    if (groupVal === '기타입력') {
      groupVal = inputMeGroupEct.value.trim() || '기타';   // 빈칸 방지
    }

    ensureGroupOption(groupVal);
    const customGroups = JSON.parse(localStorage.getItem('customGroups') || '[]');
    if (!customGroups.includes(groupVal)) {
      customGroups.push(groupVal);
      localStorage.setItem('customGroups', JSON.stringify(customGroups));
    }
  
    if (fixedCorrectedDate) {
      localStorage.setItem(
        "fixedCorrectedDate",
        fixedCorrectedDate.toISOString()
      );
    } else {
      localStorage.removeItem("fixedCorrectedDate");
    }

    return {
      birthday: birthday,
      monthType: monthType,
      birthtime: birthtimeRaw,
      year: year,
      month: month,
      day: day,
      hour: hour,
      minute: minute, 
      gender: gender,
      birthPlace: savedBirthPlace,
      name: name,
      result: computedResult,
      yearPillar: pillars[0] || "",
      monthPillar: pillars[1] || "",
      dayPillar: pillars[2] || "",
      hourPillar: isTimeUnknown ? "-" : (pillars[3] || ""),
      age: age,
      birthdayTime: birthdayTime ? formatTime(correctedDate) : "",
      lunarBirthday: lunarBirthday,
      isTimeUnknown: isTimeUnknown,
      isPlaceUnknown: isPlaceUnknown,
      selectedTime2: selectedTime2,
      group: groupVal,       
      createdAt: Date.now(),
      isFavorite : false,
      birthPlaceFull,
      birthPlaceLongitude: cityLon,
      correctedDate: fixedCorrectedDate,
    };
  }

  let isModified = false;

  document.querySelectorAll(`
    .input_group input[type='text'],
    .input_group input[type='tel'],
    .input_group input[type='time'],
    .input_group select,
    .input_group .map,
    .radio_box span input[type='radio']
  `).forEach(el =>
    el.addEventListener('input', () => {
      isModified = true;

      if (el.id === 'inputBirthPlace') {
        const curr = el.value.trim();
        if (curr !== originalBirthPlace) {
          fixedCorrectedDate = null;
          // console.log('출생지 변경 → fixedCorrectedDate 초기화');
        }
      }
    })
  );

  function getHourGanZhi(dayGanZhiStr, hourParam) {
    // 1) 시지 인덱스 결정
    const hourIndex = typeof hourParam === 'number'
      ? hourParam % 12
      : getHourBranchIndex(hourParam);
  
    // 2) 일간 천간 인덱스
    const dayStem = dayGanZhiStr.charAt(0);
    const dayStemIndex = Cheongan.indexOf(dayStem);
    if (dayStemIndex < 0) {
      throw new Error(`Invalid day GanZhi: ${dayGanZhiStr}`);
    }
  
    // 3) 시주의 천간 인덱스 = (일간 * 2 + 시지) mod 10
    const hourStemIndex = (dayStemIndex * 2 + hourIndex) % 10;
  
    // 4) 간지 조합
    return Cheongan[hourStemIndex] + Jiji[hourIndex];
  }

  document.getElementById("calcBtn").addEventListener("click", function(event) {
    const isRealClick = event.isTrusted;
    let newData, list, isEdit;
  
    // 공통: newData 만들고 즐겨찾기 플래그 설정
    newData = makeNewData();
    latestMyeongsik = newData;
    newData.isFavorite = document.getElementById('topPs').checked;
  
    // 로컬리스트 미리 로드
    let raw = localStorage.getItem("myeongsikList");
    if (raw === null || raw === "undefined") raw = "[]";
    list = JSON.parse(raw);
    isEdit = typeof currentModifyIndex === "number";
  
    if (isRealClick) {

      // ── 1) 저장/수정 로직 (실제 클릭일 때만) ──
  
      // 1-a) Validation
      const birthdayStr   = document.getElementById("inputBirthday").value.trim();
      const birthtimeStr  = document.getElementById("inputBirthtime").value.replace(/\s/g,"").trim();
      const isTimeUnknown = document.getElementById("bitthTimeX").checked;
      const gender        = document.getElementById("genderMan").checked
                           ? "남"
                           : (document.getElementById("genderWoman").checked ? "여" : "-");
      const isPlaceUnknown= document.getElementById("bitthPlaceX").checked;
      const birthPlaceIn  = document.getElementById("inputBirthPlace").value;
      let usedBirthtime = isTimeUnknown ? null : birthtimeStr;
  
      if (birthdayStr.length < 8) { alert("생년월일을 YYYYMMDD 형식으로 입력하세요."); return; }
      let year   = parseInt(birthdayStr.substring(0, 4), 10);
      let month  = parseInt(birthdayStr.substring(4, 6), 10);
      let day    = parseInt(birthdayStr.substring(6, 8), 10);
      let hour = isTimeUnknown ? 4 : parseInt(usedBirthtime.substring(0, 2), 10);
      let minute = isTimeUnknown ? 30 : parseInt(usedBirthtime.substring(2, 4), 10);
  
      if (year < 1900 || year > 2099) { alert("연도는 1900년부터 2099년 사이로 입력하세요."); return; }
      if (month < 1 || month > 12)     { alert("월은 1부터 12 사이의 숫자로 입력하세요."); return; }
      if (day < 1 || day > 31)         { alert("일은 1부터 31 사이의 숫자로 입력하세요."); return; }
      const testDate = new Date(year, month - 1, day);
      if (testDate.getFullYear() !== year || (testDate.getMonth() + 1) !== month || testDate.getDate() !== day) {
        alert("유효한 날짜를 입력하세요."); return;
      }
  
      if (!isTimeUnknown) {
        if (birthtimeStr.length !== 4 || isNaN(birthtimeStr)) {
          alert("태어난 시간을 4자리 숫자 (HHMM) 형식으로 입력하세요."); return;
        }
        const hh = parseInt(birthtimeStr.substring(0, 2), 10);
        const mm = parseInt(birthtimeStr.substring(2, 4), 10);
        if (hh < 0 || hh > 23 || mm < 0 || mm > 59) {
          alert("시각은 00부터 23 사이, 분은 00부터 59 사이로 입력하세요."); return;
        }
      }
  
      if (gender === "-")    { alert("성별을 선택하세요."); return; }
      if (!isPlaceUnknown)   {
        if (birthPlaceIn === "-") { alert("출생지를 선택하세요."); return; }
      }
  
      const monthType = document.getElementById("monthType").value;
      const isLunar   = monthType === "음력" || monthType === "음력(윤달)";
      const isLeap    = monthType === "음력(윤달)";
      const calendar  = new KoreanLunarCalendar();
      let workYear = year, workMonth = month, workDay = day;
  
      if (isLunar) {
        const ok = calendar.setLunarDate(year, month, day, isLeap);
        if (!ok) { console.error("음력 변환 실패"); return; }
        const solar = calendar.getSolarCalendar();
        workYear  = solar.year;
        workMonth = solar.month;
        workDay   = solar.day;
      } else {
        calendar.setSolarDate(year, month, day);
      }
  
      const bjTimeTextEl = document.getElementById("bjTimeText");
      const summerTimeBtn = document.getElementById('summerTimeCorrBtn');
      originalDate = new Date(workYear, workMonth - 1, workDay, hour, minute);
  
      fixedCorrectedDate = null;
      const iv = getSummerTimeInterval(originalDate.getFullYear());
      if (!fixedCorrectedDate) {
        fixedCorrectedDate = adjustBirthDateWithLon(originalDate, cityLon, isPlaceUnknown);
        if (iv && fixedCorrectedDate >= iv.start && fixedCorrectedDate < iv.end && !isTimeUnknown) {
          fixedCorrectedDate = new Date(fixedCorrectedDate.getTime() - 3600000);
        }
      }
      correctedDate = fixedCorrectedDate;
  
      if (iv && correctedDate >= iv.start && correctedDate < iv.end && !isTimeUnknown) {
        summerTimeBtn.style.display = 'inline-block';
        bjTimeTextEl.innerHTML = `썸머타임보정시 : <b id="resbjTime">${correctedDate.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit', hour12:false})}</b>`;
      } else if (isPlaceUnknown && isTimeUnknown) {
        summerTimeBtn.style.display = 'none';
        bjTimeTextEl.innerHTML = `보정없음 : <b id="resbjTime">시간모름</b>`;
      } else if (isPlaceUnknown) {
        summerTimeBtn.style.display = 'none';
        bjTimeTextEl.innerHTML = `기본보정 -30분 : <b id="resbjTime">${correctedDate.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit', hour12:false})}</b>`;
      } else {
        summerTimeBtn.style.display = 'none';
        bjTimeTextEl.innerHTML = `보정시 : <b id="resbjTime">${correctedDate.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit', hour12:false})}</b>`;
      }
  
      const fullResult = getFourPillarsWithDaewoon(
        correctedDate.getFullYear(),
        correctedDate.getMonth() + 1,
        correctedDate.getDate(),
        hour, minute,
        gender, correctedDate
      );
  
      const parts = fullResult.split(", ");
      const pillarsPart = parts[0] || "-";
      const pillars = pillarsPart.split(" ");
      const yearPillar  = pillars[0] || "-";
      const monthPillar = pillars[1] || "-";
      const dayPillar   = pillars[2] || "-";
      const hourPillar  = pillars[3] || "-";
  
      const yearSplit  = splitPillar(yearPillar);
      const monthSplit = splitPillar(monthPillar);
      const daySplit   = splitPillar(dayPillar);
      daySplitGlobal = daySplit;
      let hourSplit  = !isTimeUnknown ? splitPillar(hourPillar) : "-";
      hourSplitGlobal = hourSplit;
  
      baseDayStem = daySplit.gan;
      baseDayBranch = dayPillar.charAt(1);
      baseYearBranch = yearPillar.charAt(1);
  
      setTimeout(() => {
        function updateOriginalSetMapping(daySplit, hourSplit) {
          if (manualOverride) return;
          setText("Hb12ws", isTimeUnknown ? "-" : getTwelveUnseong(baseDayStem, hourSplit.ji));
          setText("Hb12ss", isTimeUnknown ? "-" : getTwelveShinsalDynamic(dayPillar, yearPillar, hourSplit.ji));
          setText("Db12ws", getTwelveUnseong(baseDayStem, daySplit.ji));
          setText("Db12ss", getTwelveShinsalDynamic(dayPillar, yearPillar, daySplit.ji));
          setText("Mb12ws", getTwelveUnseong(baseDayStem, monthSplit.ji));
          setText("Mb12ss", getTwelveShinsalDynamic(dayPillar, yearPillar, monthSplit.ji));
          setText("Yb12ws", getTwelveUnseong(baseDayStem, baseYearBranch));
          setText("Yb12ss", getTwelveShinsalDynamic(dayPillar, yearPillar, baseYearBranch));
        }
  
        updateStemInfo("Yt", yearSplit, baseDayStem);
        updateStemInfo("Mt", monthSplit, baseDayStem);
        updateStemInfo("Dt", daySplit, baseDayStem);
        updateStemInfo("Ht", isTimeUnknown ? "-" : hourSplit, baseDayStem);
        updateBranchInfo("Yb", baseYearBranch, baseDayStem);
        updateBranchInfo("Mb", monthSplit.ji, baseDayStem);
        updateBranchInfo("Db", daySplit.ji, baseDayStem);
        updateBranchInfo("Hb", isTimeUnknown ? "-" : hourSplit.ji, baseDayStem);
        updateOriginalSetMapping(daySplit, hourSplit);
        updateColorClasses();

        const daewoonData = getDaewoonData(gender, originalDate, correctedDate);
        updateAllDaewoonItemsVr(daewoonData.list);
        updateColorClasses();
      });
  
      if (isEdit) {
        if (!isModified && !confirm("수정된 부분이 없습니다. 이대로 저장하시겠습니까?")) return;
        list[currentModifyIndex] = newData;
        alert("명식이 수정되었습니다.");
        document.getElementById("bitthTimeX").checked = false;
        document.getElementById("inputBirthtime").disabled = false;
        document.getElementById("inputBirthtime").value = newData.birthtime;
      } else {

        list.push(newData);
        localStorage.setItem("myeongsikList", JSON.stringify(list));
        alert("명식이 저장되었습니다.");
      }

      document.getElementById("inputWrap").style.display     = "none";
      document.getElementById("resultWrapper").style.display = "block";
      backBtn.style.display = "";
      setBtnCtrl.style.display = "inline-block";
    }
  
    localStorage.setItem("myeongsikList", JSON.stringify(list));
    loadSavedMyeongsikList();
    updateSaveBtn();
    coupleModeBtnV.style.display = list.length >= 2 ? "" : "none";
    isModifyMode = false;
    currentModifyIndex = null;
    isModified = false;
    newData = latestMyeongsik;
  
    
  });
  
  
  

  new Sortable(document.querySelector(".list_ul"), {
    handle: ".drag_btn_zone", // 요 버튼 누르고 있어야 드래그 가능
    animation: 150,
    onEnd: function () {
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
      loadSavedMyeongsikList();
    }
  });

  const selectEl       = document.getElementById('inputMeGroup');
  const manageBtn      = document.getElementById('inputMeGroupSet');
  const modalSet       = document.getElementById('inputMeGroupSetModal');
  const modalCloseBtn  = document.getElementById('modalCloseBtn');
  const listContainer  = document.getElementById('inputMeGroupSetUl');
  const ectInput       = document.getElementById('inputMeGroupEct');
  const addBtn         = document.getElementById('inputMeGroupAdd');

  const GROUP_STORAGE_KEY    = 'inputMeGroupOptions';

  function loadOptionsFromStorage() {
    const stored = localStorage.getItem(GROUP_STORAGE_KEY);
    if (!stored) return;
    try {
      const values = JSON.parse(stored);
      selectEl.innerHTML = '';    
      values.forEach(val => {
        const opt = document.createElement('option');
        opt.value = val;
        opt.text  = (val === '기타입력')
                    ? '기타입력(항목추가)'
                    : val;
        selectEl.add(opt);
      });
    } catch (err) {
      console.error('파싱 오류:', err);
    }
  }

  function saveOptionsToStorage() {
    const values = Array.from(selectEl.options).map(o => o.value);
    localStorage.setItem(GROUP_STORAGE_KEY, JSON.stringify(values));
  }

  function populateList() {
    let html = '';
    Array.from(selectEl.options).forEach((opt, idx) => {
      const val = opt.value;
      if (val === '미선택' || val === '기타입력') return;
      html += `
        <li data-index="${idx}">
          <button class="drag_btn_zone2" type="button">
            <div class="line"></div><div class="line"></div><div class="line"></div>
          </button>
          <!-- 여기에 클래스 추가 -->
          <span class="item-value">${val}</span>
          <span>
            <button type="button"
                    class="black_btn set_delete_btn"
                    data-value="${val}">
              삭제
            </button>
          </span>
        </li>`;
    });
    listContainer.innerHTML = html;
  }

  loadOptionsFromStorage();

  manageBtn.addEventListener('click', e => {
    e.preventDefault();
    loadOptionsFromStorage();
    populateList();
    modalSet.style.display = 'block';
  });

  modalCloseBtn.addEventListener('click', e => {
    e.preventDefault();
    modalSet.style.display = 'none';
  });

  addBtn.addEventListener('click', e => {
    e.preventDefault();
    const val = ectInput.value.trim();
    if (!val) {
      alert('관계를 입력해주세요.');
      return;
    }
    if (Array.from(selectEl.options).some(o => o.value === val)) {
      alert('이미 추가된 관계입니다.');
      return;
    }
    const newOpt = document.createElement('option');
    newOpt.value = val;
    newOpt.text  = val;
    const ectOpt = selectEl.querySelector('option[value="기타입력"]');
    selectEl.add(newOpt, ectOpt);
    ectInput.value = '';
    saveOptionsToStorage();
    alert('키워드가 추가되었습니다.');
  });

  listContainer.addEventListener('click', e => {
    if (!e.target.classList.contains('set_delete_btn')) return;
    const val = e.target.dataset.value;
    if (!confirm(`"${val}" 항목을 삭제하시겠습니까?`)) return;
    // 셀렉트박스에서 제거
    const escaped = CSS.escape(val);
    const opt     = selectEl.querySelector(`option[value="${escaped}"]`);
    if (opt) selectEl.removeChild(opt);
    // li 제거
    e.target.closest('li').remove();
    saveOptionsToStorage();
  });

  new Sortable(listContainer, {
    handle: '.drag_btn_zone2',
    animation: 150,
    onEnd: () => {
      const newOrder = Array.from(listContainer.children)
        .map(li => li.children[1].textContent.trim());
  
      const allOptions = ['미선택', ...newOrder, '기타입력'];
      const prevValue = selectEl.value;
  
      selectEl.innerHTML = '';
      allOptions.forEach(val => {
        const opt = document.createElement('option');
        opt.value = val;
        opt.text  = (val === '기타입입력')
                    ? '기타입력(항목추가)'
                    : val;
        selectEl.add(opt);
      });
  
      selectEl.value = prevValue;
  
      saveOptionsToStorage();
      populateList();
    }
  });
  

  function setupSearchFeature() {
    const searchTextInput = document.getElementById("searchText");
    const searchSelect = document.getElementById("searchSelect");
    const searchBtn = document.getElementById("searchBtn");
  
    function filterMyeongsikList(keyword, category) {
      const allItems = document.querySelectorAll("aside .list_ul > li");
  
      allItems.forEach(li => {
        const nameEl = li.querySelector(".name_age");
        const ganziEl = li.querySelector(".ganzi");
        const birthdayEl = li.querySelector(".birth_day_time");
  
        if (nameEl?.dataset.original) nameEl.innerHTML = nameEl.dataset.original;
        if (ganziEl?.dataset.original) ganziEl.innerHTML = ganziEl.dataset.original;
        if (birthdayEl?.dataset.original) birthdayEl.innerHTML = birthdayEl.dataset.original;
  
        let targetText = "";
        if (category === "이름") targetText = nameEl?.innerText || "";
        else if (category === "간지") targetText = ganziEl?.innerText || "";
        else if (category === "생일") targetText = birthdayEl?.innerText || "";
  
        const escapedKeyword = keyword.replace(/[\[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
        const regex = new RegExp(escapedKeyword.replace(/\s+/g, "\\s*"), "gi");
  
        if (regex.test(targetText)) {
          li.style.display = "flex";
  
          const highlighted = targetText.replace(regex, match => `<span style="color:red;">${match}</span>`);
  
          if (category === "이름" && nameEl) nameEl.innerHTML = highlighted;
          else if (category === "간지" && ganziEl) ganziEl.innerHTML = highlighted;
          else if (category === "생일" && birthdayEl) birthdayEl.innerHTML = highlighted;
        } else {
          li.style.display = "none";
        }
      });
    }
  
    function restoreMyeongsikList() {
      const allItems = document.querySelectorAll("aside .list_ul > li");
  
      allItems.forEach(li => {
        li.style.display = "flex";
        const nameEl = li.querySelector(".name_age");
        const ganziEl = li.querySelector(".ganzi");
        const birthdayEl = li.querySelector(".birth_day_time");
  
        if (nameEl?.dataset.original) nameEl.innerHTML = nameEl.dataset.original;
        if (ganziEl?.dataset.original) ganziEl.innerHTML = ganziEl.dataset.original;
        if (birthdayEl?.dataset.original) birthdayEl.innerHTML = birthdayEl.dataset.original;
      });
    }
  
    searchTextInput.addEventListener("input", function () {
      const keyword = this.value.trim();
      const category = searchSelect.value;
  
      if (keyword === "") restoreMyeongsikList();
      else filterMyeongsikList(keyword, category);
    });
  
    searchBtn.addEventListener("click", function (e) {
      e.preventDefault();
      const keyword = searchTextInput.value.trim();
      const category = searchSelect.value;
  
      if (keyword === "") restoreMyeongsikList();
      else filterMyeongsikList(keyword, category);
    });
  
    searchSelect.addEventListener("change", function () {
      const keyword = searchTextInput.value.trim();
      const category = this.value;
  
      if (keyword === "") restoreMyeongsikList();
      else filterMyeongsikList(keyword, category);
    });
  }
  setupSearchFeature();  

  const explanBtn      = document.getElementById("explanViewBtn");
  const explanEl = document.getElementById("explan");
  const explanSTORAGE_KEY = "isExplanVisible";

  function setExplanState(visible) {
    explanEl.style.display = visible ? "block" : "none";
    explanBtn.innerText = visible ? "묘운 설명 접기" : "묘운 설명 보기";
  }

  const explansaved = localStorage.getItem(explanSTORAGE_KEY);
  const isVisible = explansaved === "true";
  setExplanState(isVisible);

  explanBtn.addEventListener("click", function () {
    const currentlyVisible = window.getComputedStyle(explanEl).display === "block";
    const nextVisible = !currentlyVisible;

    setExplanState(nextVisible);
    localStorage.setItem(explanSTORAGE_KEY, nextVisible);
  });

  const STORAGE_KEY = 'b12Visibility';
  const app         = document.getElementById('app');      // wrapper
  const checkbox    = document.getElementById('s12Ctrl');  // 토글 체크박스
  const label       = document.getElementById('s12Label'); // 상태 레이블

  function applyState(hidden) {
    app.classList.toggle('hide-12', hidden);

    label.textContent = hidden
      ? '십이운성 · 십이신살 보이기'
      : '십이운성 · 십이신살 가리기';

    checkbox.checked = hidden;
    localStorage.setItem(STORAGE_KEY, hidden ? 'hidden' : 'visible');
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  applyState(stored === 'hidden');

  checkbox.addEventListener('change', () => {
    applyState(checkbox.checked);
    updateAllMargins();
  });

  Object.defineProperty(window, 'correctedDate', {
    set(val) {
      console.warn("⚠️ correctedDate 변경됨:", val.toISOString());
      this._correctedDate = val;
    },
    get() {
      return this._correctedDate;
    }
  });
});