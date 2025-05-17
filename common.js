let currentModifyIndex = null;
let getMyounPillarsVr;
let updateMyowoonSectionVr;
let modifyIndex;           // 현재 수정 중인 명식 인덱스
let originalDataSnapshot;  // 기존 명식 데이터 백업\
let baseDayStem;
let isTimeUnknown, isPlaceUnknown;
let renderSijuButtonsVr;
// 전역 변수
let savedMyeongsikList = [];
// 궁합모드 여부(true이면 aside에 본인 제외, couple_btn 표시)
let isCoupleMode = false;
// 현재 detail view(본인)로 선택된 명식의 인덱스
let currentDetailIndex = null;
let partnerIndex = null;
// 현재 detail view에 표시된 명식 데이터
let currentMyeongsik = null;

let myData = null;
let partnerData = null;
let isPickerVer2, isPickerVer22 = false;
let isPickerVer3, isPickerVer23 = false;
let currentMode = "ver1";

let handleChangeVr, updateGanzhiDisplayVr;

let updateOriginalAndMyowoonVr;

let coupleMode      = false;

let latestMyeongsik = null;

let originalDate;
let correctedDate;

let customRadioTarget = null;

let hourSplitGlobal, daySplitGlobal;
let manualOverride = false;
let manualOverride2 = false;
let savedCityLon = null;
let initialized;

// [0] 출생지 보정 및 써머타임 함수
// const cityLongitudes = {
//   "서울특별시": 126.9780, "부산광역시": 129.1, "대구광역시": 128.6,
//   "인천광역시": 126.7052, "광주광역시": 126.8530, "대전광역시": 127.3845,
//   "울산광역시": 129.3114, "세종특별자치시": 127.2890,
//   "수원시": 127.0014, "고양시": 126.83, "용인시": 127.1731,
//   "성남시": 127.137, "부천시": 126.766, "안산시": 126.851,
//   "안양시": 126.9566, "남양주시": 127.2623, "화성시": 126.831,
//   "평택시": 127.1116, "시흥시": 126.79, "김포시": 126.715,
//   "파주시": 126.783, "의정부시": 127.0469, "광명시": 126.8826,
//   "광주시": 126.666, "군포시": 126.935, "이천시": 127.443,
//   "양주시": 127.03, "오산시": 127.079, "구리시": 127.13,
//   "안성시": 127.279, "포천시": 127.2, "의왕시": 126.931,
//   "하남시": 127.214, "여주시": 127.652, "동두천시": 127.05,
//   "과천시": 126.984, "가평군": 127.51, "양평군": 127.5, "연천군": 127.1,
//   "춘천시": 127.729, "원주시": 127.93, "강릉시": 128.896, "동해시": 129.113,
//   "태백시": 128.986, "속초시": 128.591, "삼척시": 129.168, "홍천군": 127.88,
//   "횡성군": 128.425, "영월군": 128.613, "평창군": 128.424, "정선군": 128.7,
//   "철원군": 127.415, "화천군": 127.753, "양구군": 128.47, "인제군": 128.116,
//   "고성군": 128.467, "양양군": 128.692,
//   "청주시": 127.4914, "충주시": 127.9323, "제천시": 128.1926, "보은군": 127.728,
//   "옥천군": 127.609, "영동군": 128.382, "진천군": 127.439, "괴산군": 127.731,
//   "음성군": 127.674, "단양군": 128.377, "증평군": 127.48,
//   "천안시": 127.146, "공주시": 127.098, "보령시": 126.611, "아산시": 127.001,
//   "서산시": 126.449, "논산시": 127.074, "계룡시": 127.264, "당진시": 126.621,
//   "금산군": 127.386, "부여군": 126.802, "서천군": 126.781, "청양군": 126.856,
//   "홍성군": 126.726, "예산군": 126.678, "태안군": 126.325,
//   "전주시": 127.108, "군산시": 126.711, "익산시": 126.957, "정읍시": 126.846,
//   "남원시": 127.392, "김제시": 126.871, "완주군": 127.062, "진안군": 127.229,
//   "무주군": 127.69, "장수군": 127.891, "임실군": 127.409, "순창군": 127.13,
//   "고창군": 126.785, "부안군": 126.73,
//   "목포시": 126.411, "여수시": 127.643, "순천시": 127.496, "나주시": 126.717,
//   "광양시": 127.695, "담양군": 126.984, "곡성군": 127.262, "구례군": 127.392,
//   "고흥군": 127.384, "보성군": 127.122, "화순군": 127.04, "장흥군": 126.725,
//   "강진군": 126.645, "해남군": 126.531, "영암군": 126.682, "무안군": 126.731,
//   "함평군": 126.625, "영광군": 126.509, "장성군": 126.751, "완도군": 126.653,
//   "진도군": 126.359, "신안군": 126.361,
//   "포항시": 129.366, "경주시": 129.224, "김천시": 128.198, "안동시": 128.723,
//   "구미시": 128.344, "영주시": 128.637, "영천시": 128.733, "상주시": 128.159,
//   "문경시": 128.185, "경산시": 128.734, "군위군": 128.454, "의성군": 128.181,
//   "청송군": 128.218, "영양군": 128.276, "영덕군": 128.703, "청도군": 128.626,
//   "고령군": 128.347, "성주군": 128.177, "칠곡군": 128.54, "예천군": 128.245,
//   "봉화군": 128.363, "울진군": 129.341, "울릉군": 130.904,
//   "창원시": 128.681, "김해시": 128.881, "진주시": 128.092, "양산시": 129.045,
//   "거제시": 128.678, "사천시": 128.189, "밀양시": 128.747, "통영시": 128.425,
//   "거창군": 128.184, "고성군": 128.373, "남해군": 127.902, "산청군": 127.779,
//   "창녕군": 128.415, "하동군": 127.997, "함안군": 128.389, "함양군": 127.81,
//   "합천군": 128.175,
//   "의령군": 128.29,
//   "제주시": 126.5312, "서귀포시": 126.715
// };

// 1) 전역에 빈 객체 선언 (고정 매핑 없음)
let cityLongitudes = {};

const placeBtn       = document.getElementById('inputBirthPlace');
const modal     = document.getElementById('mapModal');
const closeMap  = document.getElementById('closeMap');
const searchBox = document.getElementById('searchBox');
const suggList  = document.getElementById('suggestions');
let map, marker, debounceTimer;

// 2) 버튼 클릭 → 모달 열기 + 지도 초기화
placeBtn.addEventListener('click', () => {
  modal.style.display = 'block';
  if (!map) {
    // 서울 중심, 줌 레벨 11
    map = L.map('map').setView([37.5665, 126.9780], 11);
    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      { subdomains: 'abcd', attribution: '&copy; OSM &copy; CARTO' }
    ).addTo(map);
  }
  searchBox.focus();
});

// 3) 닫기
closeMap.addEventListener('click', () => {
  if (!placeBtn.value || placeBtn.value === "출생지선택") {
    alert('도시를 입력하여 선택해주세요.');
    return;
  }

  modal.style.display = 'none';
  searchBox.value = '';
  suggList.innerHTML = '';
});

// 4) 자동완성: Nominatim + 북반구 viewbox
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
        // parts[0]=행정구, parts[1]=시 혹은 시 단독 등
        let fullName;
        if (parts[0].match(/구$|군$/) && parts[1]?.match(/시$/)) {
          // 시/군/구 조합 → "부산광역시 사하구"
          fullName = `${parts[1]} ${parts[0]}`;
        } else {
          // 그 외(시 단독, 외국 도시 등)
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

// 5) 후보 클릭 시
suggList.addEventListener('click', e => {
  if (e.target.tagName !== 'LI') return;
  const name = e.target.dataset.name;
  const lat  = parseFloat(e.target.dataset.lat);
  const lon  = parseFloat(e.target.dataset.lon);

  // 마커 표시
  if (!marker) marker = L.marker([lat, lon]).addTo(map);
  else         marker.setLatLng([lat, lon]);

  // 부드러운 줌인(flyTo) → 레벨 14로 0.5초 동안
  map.flyTo([lat, lon], 14, { duration: 0.5 });

  // 또는 즉시 줌인만 원하면
  // map.setView([lat, lon], 14);

  // 나머지 기존 로직
  const cityKey = name.split(' ')[0];
  cityLongitudes[name]    = lon;
  cityLongitudes[cityKey] = lon;
  localStorage.setItem('cityLongitudes', JSON.stringify(cityLongitudes));
  cityLon = lon;
  fixedCorrectedDate = null;
  placeBtn.value       = name;
  placeBtn.textContent = name;

  //modal.style.display = 'none';
  //searchBox.value     = '';
  suggList.innerHTML  = '';
});

let fixedCorrectedDate = null;  // 한번만 계산하고, 이 값을 계속 씀

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

  // ✅ 이 시점에서 fixedCorrectedDate를 강제 고정
  if (item.correctedDate) {
    fixedCorrectedDate = new Date(item.correctedDate);
    //console.log("✅ 복원된 correctedDate:", fixedCorrectedDate.toISOString());
  }
}

function adjustBirthDateWithLon(dateObj, cityLon, isPlaceUnknown = false) {
  if (isPlaceUnknown) return new Date(dateObj.getTime() - 30 * 60 * 1000);
  if (cityLon == null) return dateObj;

  const longitudeCorrection = (cityLon - 135.1) * 4;
  const eqTime = getEquationOfTime(dateObj);
  let corrected = new Date(dateObj.getTime() + (longitudeCorrection + eqTime) * 60 * 1000);

  const iv = getSummerTimeInterval(corrected.getFullYear());
  if (iv && corrected >= iv.start && corrected < iv.end) {
    corrected = new Date(corrected.getTime() - 60 * 60 * 1000);
  }

  return corrected;
}

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



//const correctedDate = adjustBirthDateWithLon(dateObj, cityLon, isPlaceUnknown);

// [1] 천문/역법 함수
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
  const y = dateObj.getFullYear();
  const m = dateObj.getMonth() + 1;
  const d = dateObj.getDate();
  const h = dateObj.getHours();
  const min = dateObj.getMinutes();

  const jd = calendarGregorianToJD(y, m, d, h, min);
  const index = Math.floor(jd) + 50;

  return sexagenaryCycle[index % 60];
  
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
  const ZASI_START = 23 * 60; // 자시 시작: 23:00 (1380분)
  let adjustedMinutes = totalMinutes;
  if (adjustedMinutes < ZASI_START) {
    adjustedMinutes += 1440; // 하루(1440분) 보정
  }
  const diff = adjustedMinutes - ZASI_START;
  const index = Math.floor(diff / 120) % 12;
  return index;
}


function getDayStem(ganZhi) {
  return ganZhi.charAt(0);
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

function computeCustomMonthPillar(correctedDate, gender) {
  // 1) 대운 진행 방향 결정 (남은 순행, 여는 역행)
  const yearPillar = getYearGanZhi(correctedDate, correctedDate.getFullYear());
  const isYang     = ["갑","병","무","경","임"].includes(yearPillar.charAt(0));
  const isForward  = (gender === "남" && isYang) || (gender === "여" && !isYang);

  // 2) 기준 절기들 가져오기
  let year       = correctedDate.getFullYear();
  let terms      = getSolarTermBoundaries(year);
  let pointer    = isForward
    ? terms.findIndex(t => correctedDate < t.date)
    : terms.slice().reverse().findIndex(t => correctedDate >= t.date);

  // 포인터 보정 (역행 분기)
  if (!isForward) {
    pointer = terms.length - 1 - pointer;
  }
  if (pointer < 0) pointer = 0;

  // 3) sDates: 절기 기준 날짜 배열
  const sDates = terms.map(t => t.date);

  // 4) mPillars 초기화: 첫 원본 월주
  const mPillars = [];
  mPillars[0] = getMonthGanZhi(correctedDate, correctedDate.getFullYear());

  // 5) 루프 돌며 각 절기마다 다음 GanZhi 계산
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
      // pointer 이동
      pointer = isForward ? pointer + 1 : pointer - 1;
      if (pointer < 0) pointer = terms.length - 1;
      if (pointer >= terms.length) pointer = 0;
    } else {
      // 아직 해당 절기 전이면 전 값 그대로
      mPillars[i] = mPillars[i - 1];
    }
  }

  // 6) 최종 월주 반환 (pointer 위치의 GanZhi)
  return mPillars[pointer];
}

function getDaewoonData(gender, originalDate, correctedDate) {
  const inputYear = correctedDate.getFullYear();
  const ipChunForSet = findSolarTermDate(inputYear, 315);
  const effectiveYearForSet = (originalDate < ipChunForSet) ? inputYear - 1 : inputYear;

  const yearPillar = getYearGanZhi(correctedDate, effectiveYearForSet);
  const monthPillar = getMonthGanZhi(correctedDate, effectiveYearForSet);
  const dayStemRef = getDayGanZhi(correctedDate).charAt(0);

  const isYang = ['갑','병','무','경','임'].includes(yearPillar.charAt(0));
  const isForward = (gender === '남' && isYang) || (gender === '여' && !isYang);

  // Gather previous/current/next year solar terms and sort by date
  const collectTerms = year => getSolarTermBoundaries(year).map(t => ({ name: t.name, date: t.date }));
  const allTerms = [
    ...collectTerms(inputYear - 1),
    ...collectTerms(inputYear),
    ...collectTerms(inputYear + 1)
  ].sort((a, b) => a.date - b.date);

  let targetTerm;
  if (isForward) {
    // include equality so that correctedDate exactly on a term picks that term
    targetTerm = allTerms.find(term => term.date >= correctedDate);
    if (!targetTerm) targetTerm = allTerms[0];
  } else {
    // reverse: include equality so if correctedDate equals, pick that term
    const past = allTerms.filter(term => term.date <= correctedDate);
    targetTerm = past[past.length - 1] || allTerms[allTerms.length - 1];
  }

  const avgData = get120YearAverages(targetTerm.date);
  const avgMonthLength = avgData.averageMonth;

  const diffMs = isForward
    ? targetTerm.date - correctedDate
    : correctedDate - targetTerm.date;
  const diffDays = diffMs / oneDayMs;

  const offset = (diffDays / avgMonthLength) * 10;
  const baseNumber = Math.floor(offset);

  // build 10-year list
  const list = [];
  const stemChars = Cheongan;
  const branchChars = MONTH_ZHI;
  const currentMonthIndex = branchChars.indexOf(monthPillar.charAt(1));
  const monthStemIndex = stemChars.indexOf(monthPillar.charAt(0));

  for (let i = 0; i < 10; i++) {
    const age = baseNumber + i * 10;
    const step = i + 1;
    const nextMonthIndex = isForward
      ? (currentMonthIndex + step) % 12
      : (currentMonthIndex - step + 12) % 12;
    const nextStemIndex = isForward
      ? (monthStemIndex + step) % 10
      : (monthStemIndex - step + 10) % 10;

    list.push({
      age,
      stem: stemChars[nextStemIndex],
      branch: branchChars[nextMonthIndex]
    });
  }

  return { base: baseNumber, list, dayStemRef };
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
  if (!(dateObj instanceof Date)) {
    dateObj = new Date(dateObj);
  }
  // 해당 연도의 입춘(315°)을 구합니다.
  const ipChun = findSolarTermDate(dateObj, 315);
  const year = dateObj.getFullYear();

  if (dateObj < ipChun) {
    return year - 1;
  } else {
    return year;
  }

}

function getFourPillarsWithDaewoon(year, month, day, hour, minute, gender, correctedDate) {
	const originalDate = new Date(year, month - 1, day, hour, minute);
	//const correctedDate = initializeCorrectedDate(originalDate, cityLon, isPlaceUnknown);
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

  if (isInsi && correctedDate.getHours() < 3 || correctedDate.getHours() >= 23) {
    hourDayPillar = getDayGanZhi(nominalBirthDatePrev);
  } else if (hourBranchIndex === 0){
    hourDayPillar = getDayGanZhi(nominalBirthDate);
  } else {
    hourDayPillar = getDayGanZhi(nominalBirthDatePrev);
  }

  if (hourBranchIndex === 0 && (yajasi && correctedDate.getHours() >= 0 && correctedDate.getHours() < 3) 
  || hourBranchIndex === 0 && (isJasi && correctedDate.getHours() >= 0 && correctedDate.getHours() < 3)){
    hourDayPillar = getDayGanZhi(nominalBirthDatePrev);
  } else if (hourBranchIndex === 0 && (yajasi && correctedDate.getHours() < 24) 
  || hourBranchIndex === 0 && (isJasi && correctedDate.getHours() < 24)) {
    hourDayPillar = getDayGanZhi(nominalBirthDate);
  }
  const hourStem = getHourStem(hourDayPillar, hourBranchIndex);
  const hourPillar = hourStem + Jiji[hourBranchIndex];

  const yearPillar = getYearGanZhi(correctedDate, effectiveYearForSet);
  const monthPillar = getMonthGanZhi(correctedDate, effectiveYearForSet);

  if (yajasi && correctedDate.getHours() >= 24){
    const daypillar = getDayGanZhi(nominalBirthDate);
    return `${yearPillar} ${monthPillar} ${daypillar} ${hourPillar}, ${getDaewoonDataStr(gender, originalDate, correctedDate)}`;
  } 
    
  if (isJasi && correctedDate.getHours() >= 23){
    const daypillar = getDayGanZhi(nominalBirthDate2);
    return `${yearPillar} ${monthPillar} ${daypillar} ${hourPillar}, ${getDaewoonDataStr(gender, originalDate, correctedDate)}`;
  } 

  if (isInsi && (correctedDate.getHours() < 3 || correctedDate.getHours() >= 23)){
    const daypillar = getDayGanZhi(nominalBirthDatePrev);
    return `${yearPillar} ${monthPillar} ${daypillar} ${hourPillar}, ${getDaewoonDataStr(gender, originalDate, correctedDate)}`;
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
  "병": { "자": "정관", "축": "상관", "인": "편인", "묘": "정인", "진": "식신", "사": "비견", "오": "겁재", "미": "상관", "신": "편재", "유": "정재", "술": "식신", "해": "편인" },
  "정": { "자": "편관", "축": "식신", "인": "정인", "묘": "편인", "진": "상관", "사": "겁재", "오": "비견", "미": "식신", "신": "정재", "유": "편재", "술": "상관", "해": "정인" },
  "무": { "자": "정재", "축": "겁재", "인": "편관", "묘": "정관", "진": "비견", "사": "편인", "오": "정인", "미": "겁재", "신": "식신", "유": "상관", "술": "비견", "해": "편재" },
  "기": { "자": "편재", "축": "비견", "인": "정관", "묘": "편관", "진": "겁재", "사": "정인", "오": "편인", "미": "비견", "신": "상관", "유": "식신", "술": "겁재", "해": "정재" },
  "경": { "자": "상관", "축": "정인", "인": "편재", "묘": "정재", "진": "편인", "사": "편관", "오": "정관", "미": "정인", "신": "비견", "유": "겁재", "술": "편인", "해": "식신" },
  "신": { "자": "식신", "축": "편인", "인": "정재", "묘": "편재", "진": "정인", "사": "정관", "오": "편관", "미": "편인", "신": "겁재", "유": "비견", "술": "정인", "해": "상관" },
  "임": { "자": "겁재", "축": "정관", "인": "식신", "묘": "상관", "진": "편관", "사": "편재", "오": "정재", "미": "정관", "신": "편인", "유": "정인", "술": "편인", "해": "비견" },
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
  // 처리 대상 셀렉터 확장
  const selector = [
    ".grid_box_1 li b",
    ".ganji b",
    ".ilwoon_ganji_cheongan span",
    ".ilwoon_ganji_jiji span"
  ].join(", ");

  document.querySelectorAll(selector).forEach(elem => {
    const val = elem.textContent.trim();
    const clsToAdd = colorMapping[val]?.bgColor;
    const clsToAdd2 = colorMapping2[val]?.bgColor;
    if (!clsToAdd) return;

    // 1) .hanja_con 내부의 <b>일 때는 부모와 다음 <p>를 처리
    if (elem.matches(".grid_box_1 li b, .ganji b")) {
      const container = elem.closest(".hanja_con");
      if (!container) return;
      // .hanja_con에서 기존 색상 제거
      bgColorClasses.forEach(c => container.classList.remove(c));
      // 새 클래스 추가
      container.classList.add(clsToAdd);
      // 다음 형제 <p>에도 동일 적용
      const next = container.nextElementSibling;
      if (next?.tagName.toLowerCase() === "p") {
        bgColorClasses.forEach(c => next.classList.remove(c));
        next.classList.add(clsToAdd);
      }
    }
    // 2) ilwoon_ganji_cheongan / jiji span은 자기 자신에만 적용
    else if (elem.matches(".ilwoon_ganji_cheongan span, .ilwoon_ganji_jiji span")) {
      // 기존 색상 클래스 제거
      bgColorClasses.forEach(c => elem.classList.remove(c));
      // 새 클래스 추가
      elem.classList.add(clsToAdd2);
    }
  });
}

function appendTenGod(id, value, isStem = true) {
  const el = document.getElementById(id);
  if (!el) return;

  // 1) tenGod 계산 (value가 '-' 또는 '(-)' 이면 '없음')
  let tenGod;
  if (value === '-' || value === '(-)') {
    tenGod = '없음';
  } else {
    tenGod = isStem
      ? getTenGodForStem(value, baseDayStem)
      : getTenGodForBranch(value, baseDayStem);
  }

  // 2) 내용 전체를 value 문자열만 남기고 리셋
  el.innerHTML = '';
  el.append(document.createTextNode(value));

  // 3) span 생성 후 append
  const span = document.createElement('span');
  span.className = 'ten-god';
  span.textContent = `(${tenGod})`;
  el.append(document.createTextNode(' '), span);
}      

function updateHiddenStems(SetBranch, prefix) {
  const mapping = hiddenStemMapping[SetBranch] || ["-", "-", "-"];
  // mapping[0] → prefix+"Jj1", mapping[1] → prefix+"Jj2", mapping[2] → prefix+"Jj3"
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
  // 각 맵에서 꺼내되, 없으면 "-" 처리
  const hanja    = stemMapping[gan]?.hanja    ?? "-";
  const hanguel  = stemMapping[gan]?.hanguel  ?? "-";
  const eumYang  = stemMapping[gan]?.eumYang  ?? "-";
  const tenSin   = (prefix === "Dt")
    ? "본원"
    : (getTenGodForStem(gan, baseDayStem)  ?? "-");

  // ID 뒤에 suffix를 붙여서 setText 호출
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

  // updateHiddenStems 는 idPrefix만 쓰니까, suffix 포함해서 넘겨줍니다
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


document.addEventListener("DOMContentLoaded", function () {

  let currentMyeongsik = null;

  window.scrollTo(0, 0);

  const exclude = ['db10sin', 'sb10sin', 'Mob10sin'];
  document.querySelectorAll('[id*="b10sin"]').forEach(el => {
    // exclude 중 하나라도 el.id에 포함되면 true
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

  //const container = document.querySelector(".container");
  let lastScrollTop = 0;
  const header = document.querySelector('header');        // 실제 셀렉터로 바꿔주세요
  const checkOption = document.querySelector('#checkOption');

  window.addEventListener("scroll", function () {
    const scrollTop = window.scrollY;
    const headerHeight = header.offsetHeight;
    const checkOptionHeight = checkOption.offsetHeight;

    if (scrollTop <= headerHeight) {
      // ── 헤더 전부 보이는 구간: 항상 노출 상태
      header.style.top = '0';
      checkOption.style.top = `${headerHeight}px`;
      checkOption.classList.remove("fixed");

    } else {
      // ── headerHeight 이상 스크롤 됐을 때부터만 hide/show 적용
      if (scrollTop > lastScrollTop) {
        // 스크롤 내림 → 숨기기
        header.style.top = `${-(headerHeight + checkOptionHeight)}px`;
        checkOption.style.top = `-${headerHeight}px`;
      } else {
        // 스크롤 올림 → 보이기
        header.style.top = '0';
        checkOption.style.top = `${headerHeight}px`;
      }
      // 고정(fixed) 클래스 토글
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
    const savedList = JSON.parse(localStorage.getItem("myeongsikList")) || [];
    const saveBtn = document.getElementById('saveBtn');
    const topPsBtn = document.getElementById('topPs');
  
    if (currentDetailIndex === null) {
      saveBtn.style.display = 'none';
      topPsBtn.style.display = 'none'; 
      coupleModeBtnV.style.display = 'none';        
    } else {
      if (savedList.length <= 1) {
        saveBtn.style.display = 'none';  
        coupleModeBtnV.style.display = "none";  
        topPsBtn.style.display = '';    
      } else {
        saveBtn.style.display = 'none'; 
        coupleModeBtnV.style.display = "";
        topPsBtn.style.display = ""; 
      }
    }

     
  }

  updateSaveBtn();

  function updateMeGroupOption(selectedVal = null) {
    const sel       = document.getElementById('inputMeGroup');
    if (!sel) return;
  
    const selfOpt   = sel.querySelector('option[value="본인"]');
    if (!selfOpt) return;
  
    const savedList = JSON.parse(localStorage.getItem('myeongsikList')) || [];
    const hasSelf   = savedList.some(v => v.group === '본인');
  
    // ① 이미 "본인"이 저장돼 있고 ② 이번 폼에서 선택된 값도 "본인"이 아니라면 → 숨김
    if (hasSelf && selectedVal !== '본인') {
      selfOpt.style.display = 'none';   // 완전히 숨기기
      // selfOpt.disabled = true;       // (대신 비활성화만 하고 싶으면 주석 해제)
    } else {
      selfOpt.style.display = '';
      selfOpt.disabled = false;
    }
  }

  function ensureGroupOption(value) {
    if (!value || value === '기타입력') return;       // '기타입력' 자체는 건드리지 않음
  
    const sel = document.getElementById('inputMeGroup');
    if (!sel) return;
  
    // 이미 있으면 패스
    if ([...sel.options].some(opt => opt.value === value)) return;
  
    const opt = document.createElement('option');
    opt.value = value;
    opt.textContent = value;
  
    // ――― ‘기타입력’ 옵션 찾기 ―――
    const etcInputOpt = sel.querySelector('option[value="기타입력"]');
    if (etcInputOpt) {
      sel.insertBefore(opt, etcInputOpt);   // ★ 바로 앞에 끼워 넣기
    } else {
      sel.appendChild(opt);                 // 혹시 없으면 그냥 맨 뒤
    }
  }

  const saved = JSON.parse(localStorage.getItem('customGroups') || '[]');
  saved.forEach(ensureGroupOption);
  updateMeGroupOption();

  // saveBtn 이벤트 리스너
  document.getElementById("saveBtn").addEventListener("click", function () {
    // 입력값 읽어오기
    const birthday = document.getElementById("inputBirthday").value.trim();
    const birthtimeRaw = document.getElementById("inputBirthtime").value.trim();
    isTimeUnknown = document.getElementById("bitthTimeX").checked;
    isPlaceUnknown = document.getElementById("bitthPlaceX").checked;
    const gender = document.getElementById("genderMan").checked ? "남" : "여";
    const birthPlaceInput = document.getElementById("inputBirthPlace").value;
    const name = document.getElementById("inputName").value.trim() || "이름없음";
  
    // 숫자 파싱
    const year = parseInt(birthday.substring(0, 4), 10);
    const month = parseInt(birthday.substring(4, 6), 10);
    const day = parseInt(birthday.substring(6, 8), 10);
    const hour = isTimeUnknown ? 4 : parseInt(birthtimeRaw.substring(0, 2), 10);
    const minute = isTimeUnknown ? 30 : parseInt(birthtimeRaw.substring(2, 4), 10);
  
    // 실제로 사용할 출생지: 모르면 서울특별시
    const usedBirthPlace = (isPlaceUnknown)
                            ? "서울특별시" : birthPlaceInput;

    // 저장용은 원래 입력 그대로 유지
    const savedBirthPlace = isPlaceUnknown ? "기본출생지 : 서울" : birthPlaceInput;
  
    const displayHour = isTimeUnknown ? "-" : birthtimeRaw.substring(0, 2);
    const displayMinute = isTimeUnknown ? "-" : birthtimeRaw.substring(2, 4);
    const displayBirthtimeFormatted = `${displayHour}${displayMinute}`;
  
    // 사주 계산
    const computedResult = getFourPillarsWithDaewoon(year, month, day, hour, minute, gender, correctedDate);
    const pillarsPart = computedResult.split(", ")[0]; // 예: "병자 경인 정묘 무오시"
    const pillars = pillarsPart.split(" ");
    const yearPillar = pillars[0] || "";
    const monthPillar = pillars[1] || "";
    const dayPillar = pillars[2] || "";
    const hourPillar = isTimeUnknown ? "-" : (pillars[3] || "");
  
    // 보정시각 계산
    //const originalDate = new Date(year, month - 1, day, hour, minute);
    //let correctedDate;

    function clearHourUI() {
      // ① 입력창 비우기
      document.getElementById("inputBirthtime").value = "";
      // ② 시주 영역 “–” 로 채우기
      updateStemInfo("Ht", { gan: "-", ji: "-" }, baseDayStem);
      updateBranchInfo("Hb", "-", baseDayStem);
      // ③ 12운성, 12신살도 “–”
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

    function formatTime(date) {
      if (!date) return "-";
      // 이후 기존 코드: date.getHours() 등
      const hours = date.getHours();
      const minutes = date.getMinutes();
      return `${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes}`;
    }
  
    // 나이와 생시 표시 시간
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
    
    // 저장할 데이터 객체 구성
    const newData = {
      birthday: birthday,
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
      birthdayTime: birthdayTime,
      isTimeUnknown: isTimeUnknown,
      isPlaceUnknown: isPlaceUnknown,
      selectedTime2: selectedTime2,
      group: groupVal,
      createdAt: Date.now(),
      isFavorite : false,
      birthPlaceFull,
      birthPlaceLongitude: cityLon,
      correctedDate: correctedDate,
    };

    latestMyeongsik = newData;

    // 저장 중복 검사
    const list = JSON.parse(localStorage.getItem("myeongsikList")) || [];
    const alreadySaved = list.some(function (item) {
      return item.birthday === newData.birthday &&
            item.birthtime === newData.birthtime &&
            item.gender === newData.gender &&
            item.birthPlace === newData.birthPlace &&
            //item.name === newData.name &&
            item.selectedTime2 === newData.selectedTime2;  // ← 라디오 버튼 값 비교 추가
    });
    if (alreadySaved) {
      const confirmSave = confirm("이미 같은 정보의 명식이 존재합니다. 한 번 더 저장하시겠습니까?");
      if (!confirmSave) return;
    }
  
    // 저장
    list.push(newData);
    localStorage.setItem("myeongsikList", JSON.stringify(list));
    loadSavedMyeongsikList();
    alert("저장이 성공적으로 완료 되었습니다.");

    //updateCoupleModeBtnVisibility();
    updateMeGroupOption();
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
    
      // 1) 해당 항목 꺼내서 isFavorite 토글
      const [item] = list.splice(index, 1);
      item.isFavorite = !item.isFavorite;
    
      if (item.isFavorite) {
        // ── ★ ON  →  마지막 즐겨찾기 뒤에 삽입
        const lastFavIdx = list.reduce((p, c, i) => c.isFavorite ? i : p, -1);
        list.splice(lastFavIdx + 1, 0, item);
      } else {
        // ── ☆ OFF →  즐겨찾기 구역 뒤, 일반 리스트 맨 앞에 삽입
        const lastFavIdx = list.reduce((p, c, i) => c.isFavorite ? i : p, -1);
        list.splice(lastFavIdx + 1, 0, item);   // 즐겨찾기 블록 바로 뒤
      }
    
      // 2) 저장 및 재렌더
      localStorage.setItem('myeongsikList', JSON.stringify(list));
      loadSavedMyeongsikList();
    
      // 3) 상세보기 화면과도 동기화
      const viewStar = document.getElementById('topPs');
      if (viewStar && currentDetailIndex === index) {
        viewStar.textContent = item.isFavorite ? '★ ON' : '☆ OFF';
      }
    }

    // savedList의 각 아이템에 대해 li 생성
    savedList.forEach((item, index) => {
      // 궁합모드일 때는 현재 detail(본인) 항목은 aside에 표시하지 않음
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
      const fullPlace = item.birthPlace.trim();
      const birthtimeDisplay = item.isTimeUnknown ? "시간모름" : formatBirthtime(item.birthtime?.replace(/\s/g, "").trim());
      const birthPlaceDisplay = (item.isPlaceUnknown === true) 
                                ? "출생지無" 
                                : (item.birthPlace?.trim() && item.birthPlace.trim() !== "출생지 선택"
                                    ? item.birthPlace.trim()
                                    : "-");
      const displayTimeLabel = item.isTimeUnknown
        ? "시간기준無"
        : (item.selectedTime2 === "jasi"
            ? "자시"
            : item.selectedTime2 === "yajasi"
              ? "야 · 조자시"
              : item.selectedTime2 === "insi"
                ? "인시"
                : "-");

      // 양력 생일은 item.birthday를 YYYYMMDD로 받는다고 가정하고 포맷팅
      const formattedBirthday =
      item.birthday.substring(0, 4) + "." +
      item.birthday.substring(4, 6) + "." +
      item.birthday.substring(6, 8) + "";

      // 음력 생일: 값이 있으면 그대로, 없으면 "-"
      //const lunarBirthDisplay = item.lunarBirthday ? item.lunarBirthday : "-";
      // 보정시: item.adjustedTime 값이 있으면, 없으면 "-"
      const adjustedTimeDisplay = item.birthdayTime ? item.birthdayTime : "-";

      /////////////////////////
      /// <span id="lunarBirthSV_${index + 1}">
      /// (${lunarBirthDisplay})
      /// </span> <br>

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
            <li class="ganzi" id="ganZi">
              <span><b id="yearGZ_${index + 1}">${item.yearPillar}</b>년</span>
              <span><b id="monthGZ_${index + 1}">${item.monthPillar}</b>월</span>
              <span><b id="dayGZ_${index + 1}">${item.dayPillar}</b>일</span>
              <span><b id="timeGZ_${index + 1}">${item.hourPillar}</b>시</span>
            </li>
            <li class="birth_day_time" id="birthDayTime">
              <span id="birthdaySV_${index + 1}">
                ${formattedBirthday} (<b id="selectTime2__${index + 1}">${displayTimeLabel}</b>)
              </span> <br>
              
              <span id="birthtimeSV_${index + 1}">
                ${birthtimeDisplay}
              </span>
              <span id="adjustedTimeSV_${index + 1}">
                (보정시: ${adjustedTimeDisplay})
              </span>
            </li>
            <li>
              <span><b id="birthPlaceSV_${index + 1}">${birthPlaceDisplay}</b></span>
            </li>
          </ul>
        </div>
      `;

      // 버튼 영역 추가 (궁합모드일 때와 아닐 때 다르게)
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
      
      //li.querySelector('.info_btn_zone').insertAdjacentHTML('afterbegin', starBtnHtml);

      li.querySelector(`#topPs_${index + 1}`).addEventListener('click', e => {
        e.stopPropagation();
        toggleFavorite(parseInt(e.target.dataset.index, 10));
      });

      // 원본 HTML 저장 (하이라이트 복원용)
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

    // 드래그 버튼 안내 및 표시 조건
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
      // 만약 수정 모드(isModifyMode)가 true이면,
      // "저장하지 않은 내용이 있습니다. 정말 이동하시겠습니까?"라는 경고창을 띄웁니다.
      if (isModifyMode) {
        const confirmLeave = confirm("수정된 내용을 저장하지 않았습니다. 정말 이동하시겠습니까?");
        if (!confirmLeave) return; // 사용자가 취소하면 함수 종료
      }
      
      // 수정 모드 관련 상태를 초기화합니다.
      isModifyMode = false;
      originalDataSnapshot = "";
      currentModifyIndex = null;
      updateSaveBtn();
      
    }

    function resetHourButtons() {
      // 색상 관련 클래스 배열 (필요에 따라 변경)
      const colorZip = ["b_green", "b_red", "b_white", "b_black", "b_yellow"];
      
      // #hourList 내의 모든 버튼 가져오기
      const allButtons = document.querySelectorAll("#hourList button");
      
      // 자시 모드 사용 여부 (예: 자시, 인시, 야조자시 등)
      const useJasiMode = document.getElementById('jasi').checked;
      
      // 자시 모드면 Jiji 배열, 아니면 MONTH_ZHI 배열을 사용 (각 프로젝트에 맞춰 수정)
      const timeLabels = useJasiMode ? Jiji : MONTH_ZHI;
      
      // 자시 모드이면 기본 매핑 배열(fixedDayMappingBasic), 아니면 일반 매핑(fixedDayMapping)을 사용
      const mapping = useJasiMode ? fixedDayMappingBasic : fixedDayMapping;
      
      // baseDayStem 값에 따라 sijuList(시주의 목록) 가져오기
      const sijuList = mapping[baseDayStem];
      
      // 모든 버튼에서 active와 색상 클래스를 제거하고, 기본 텍스트로 복원
      allButtons.forEach((btn, i) => {
        btn.classList.remove("active", ...colorZip);
        btn.innerHTML = `${timeLabels[i]}시 (${sijuList[i]})`;
      });
      
      // "태어난 시 모름" 체크박스 설정
      document.getElementById("bitthTimeX").checked = true;
      
      // 전역 플래그 isTimeUnknown true 처리
      //isTimeUnknown = true;
    }
    
    

    document.querySelectorAll(".detailViewBtn").forEach(function (button) {
      button.addEventListener("click", function (e) {
        e.stopPropagation();
    
        // ── ① 시·지·묘운·세운 전부 하이픈+클래스 제거 ──
        
        handleViewClick();
    
        const saved = localStorage.getItem("fixedCorrectedDate");
        if (saved) fixedCorrectedDate = new Date(saved);
    
        loadCityLongitudes();
        const idx = parseInt(button.getAttribute("data-index"), 10);
        currentDetailIndex = idx;
        const item = savedList[idx];
        currentMyeongsik = item;
        if (!item) return;
    
        restoreCurrentPlaceMapping(item);
        new Date(localStorage.getItem('correctedDate'));
    
        // 원래 detail view로 전환
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
          //if (isTimeUnknown) {
          setTimeout(()=>{
            clearAllColorClasses();
          }, 100)
          //}
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
    
        requestAnimationFrame(function(){
          const selTime = item.selectedTime2 || 'insi';
          const r1 = document.querySelector(`input[name="time2"][value="${selTime}"]`);
          const r2 = document.querySelector(`input[name="timeChk02"][value="${selTime}"]`);
          if (r1) r1.checked = true;
          if (r2) r2.checked = true;
        });
    
        // 자동 계산
        document.getElementById("calcBtn").click();
    
        const myowoonBtn = document.getElementById("myowoonMore");
        myowoonBtn.classList.remove("active");
        myowoonBtn.innerText = "묘운력(운 전체) 상세보기";
    
        resetHourButtons();
    
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
        if (sewoonBox) { sewoonBox.style.display = "block"; }
        const iljuCalenderBox = document.getElementById('iljuCalender');
        if (iljuCalenderBox) { iljuCalenderBox.style.display = "block"; }
    
        document.getElementById("aside").style.display      = "none";
        document.getElementById("inputWrap").style.display  = "none";
        document.getElementById("resultWrapper").style.display = "block";
        
        window.scrollTo(0, 0);
        // ── 상세뷰 로직 끝 ──
      });
    });
  
    // [c] delete_btn 이벤트
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
        //updateCoupleModeBtnVisibility();
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

      // ── 여기에 추가 ──
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

      const baseYearBranch_copy = p_yearSplit.ji;
      const baseYearBranch_copy2 = part_yearSplit.ji;

      
      
      // 원국
      setText("CHb12ws", isMyTimeUnknown ? "-" : getTwelveUnseong(baseDayStem_copy, p_hourSplit.ji));
      setText("CHb12ss", isMyTimeUnknown ? "-" : getTwelveShinsal(baseYearBranch_copy, p_hourSplit.ji));
      setText("CDb12ws", getTwelveUnseong(baseDayStem_copy, p_daySplit.ji));
      setText("CDb12ss", getTwelveShinsal(baseYearBranch_copy, p_daySplit.ji));
      setText("CMb12ws", getTwelveUnseong(baseDayStem_copy, p_monthSplit.ji));
      setText("CMb12ss", getTwelveShinsal(baseYearBranch_copy, p_monthSplit.ji));
      setText("CYb12ws", getTwelveUnseong(baseDayStem_copy, baseYearBranch_copy));
      setText("CYb12ss", getTwelveShinsal(baseYearBranch_copy, baseYearBranch_copy));

      setText("CPHb12ws", isPartnerTimeUnknown ? "-" : getTwelveUnseong(baseDayStem_copy2, part_hourSplit.ji));
      setText("CPHb12ss", isPartnerTimeUnknown ? "-" : getTwelveShinsal(baseYearBranch_copy2, part_hourSplit.ji));
      setText("CPDb12ws", getTwelveUnseong(baseDayStem_copy2, part_daySplit.ji));
      setText("CPDb12ss", getTwelveShinsal(baseYearBranch_copy2, part_daySplit.ji));
      setText("CPMb12ws", getTwelveUnseong(baseDayStem_copy2, part_monthSplit.ji));
      setText("CPMb12ss", getTwelveShinsal(baseYearBranch_copy2, part_monthSplit.ji));
      setText("CPYb12ws", getTwelveUnseong(baseDayStem_copy2, baseYearBranch_copy2));
      setText("CPYb12ss", getTwelveShinsal(baseYearBranch_copy2, baseYearBranch_copy2));

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

      // 1) 원본 correctedDate 재계산
      const origMyDate = new Date(
        myData.year, myData.month - 1, myData.day,
        myData.hour, myData.minute
      );
      const recMyDate = adjustBirthDateWithLon(
        origMyDate,
        myData.birthPlaceLongitude,
        myData.isPlaceUnknown
      );

      // 2) 파트너 correctedDate 재계산
      const origPartDate = new Date(
        partnerData.year, partnerData.month - 1, partnerData.day,
        partnerData.hour, partnerData.minute
      );
      const recPartDate = adjustBirthDateWithLon(
        origPartDate,
        partnerData.birthPlaceLongitude,
        partnerData.isPlaceUnknown
      );

      // 3) Vr 함수 호출 시, correctedDate를 덮어쓴 새로운 person 객체 사용
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
      setText("CMyoHb12ss", isMyTimeUnknown || isPickerVer22 || isPickerVer23 ? "-" : getTwelveShinsal(baseYearBranch_copy, p_myo_hourSplit.ji));
      setText("CMyoDb12ws", isMyTimeUnknown || isPickerVer23 ? "-" : getTwelveUnseong(baseDayStem_copy, p_myo_daySplit.ji));
      setText("CMyoDb12ss", isMyTimeUnknown || isPickerVer23 ? "-" : getTwelveShinsal(baseYearBranch_copy, p_myo_daySplit.ji));
      setText("CMyoMb12ws", getTwelveUnseong(baseDayStem_copy, p_myo_monthSplit.ji));
      setText("CMyoMb12ss", getTwelveShinsal(baseYearBranch_copy, p_myo_monthSplit.ji));
      setText("CMyoYb12ws", getTwelveUnseong(baseDayStem_copy, p_myo_yearSplit.ji));
      setText("CMyoYb12ss", getTwelveShinsal(baseYearBranch_copy, p_myo_yearSplit.ji));

      setText("CPMyoHb12ws", isPartnerTimeUnknown || isPickerVer22 || isPickerVer23 ? "-" : getTwelveUnseong(baseDayStem_copy2, part_myo_hourSplit.ji));
      setText("CPMyoHb12ss", isPartnerTimeUnknown || isPickerVer22 || isPickerVer23 ? "-" : getTwelveShinsal(baseYearBranch_copy2, part_myo_hourSplit.ji));
      setText("CPMyoDb12ws", isPartnerTimeUnknown || isPickerVer23 ? "-" : getTwelveUnseong(baseDayStem_copy2, part_myo_daySplit.ji));
      setText("CPMyoDb12ss", isPartnerTimeUnknown || isPickerVer23 ? "-" : getTwelveShinsal(baseYearBranch_copy2, part_myo_daySplit.ji));
      setText("CPMyoMb12ws", getTwelveUnseong(baseDayStem_copy2, part_myo_monthSplit.ji));
      setText("CPMyoMb12ss", getTwelveShinsal(baseYearBranch_copy2, part_myo_monthSplit.ji));
      setText("CPMyoYb12ws", getTwelveUnseong(baseDayStem_copy2, part_myo_yearSplit.ji));
      setText("CPMyoYb12ss", getTwelveShinsal(baseYearBranch_copy2, part_myo_yearSplit.ji));

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
      //console.log("커플 모드 - 원국 및 묘운 HTML 업데이트 완료");
      // 1) 범용 색상 제거 함수 (컨테이너 셀렉터를 인자로 받음)
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

      // 입춘 이전이면 전년도 간지
      const ganZhiYear = (dateObj < ipChun) ? solarYear - 1 : solarYear;

      // 4 CE가 '갑자' (60주기 기준점)
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
      // 1) 무조건 KST 기준으로 변환
      const kstDate = toKoreanTime(dateObj);
      const hour    = kstDate.getHours();

      // 2) 복제본 준비
      const adjustedDate = new Date(kstDate.getTime());

      // 3) 자시/야자시/인시 기준으로 “일” 경계 이동
      if (document.getElementById("jasi").checked) {
        // 자시 기준: 23시를 하루의 시작으로 본다 → 23시 이전이면 전날 23시로 이동
        if (hour < 23) {
          adjustedDate.setDate(adjustedDate.getDate() - 1);
        }
        adjustedDate.setHours(23, 0, 0, 0);

      } else if (document.getElementById("yajasi").checked) {
        // 야자시 기준(=0시 기준): 아무 보정 없이 당일 0시로
        adjustedDate.setHours(0, 0, 0, 0);

      } else if (document.getElementById("insi").checked) {
        // 인시 기준(=3시 기준): 3시 이전이면 전날 3시로 이동
        if (hour < 3) {
          adjustedDate.setDate(adjustedDate.getDate() - 1);
        }
        adjustedDate.setHours(3, 0, 0, 0);
      }

      // 4) 이 adjustedDate를 기준으로 일간/지지 계산
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

    // ③ 시주(時柱) 계산 – dateObj만 넘기면 내부에서 모두 KST 변환
    function getHourGanZhiRef(dateObj) {
      const date = new Date(dateObj);
      const hourBranch = getHourBranchUsingArray(date);
      const hourBranchIndex = Jiji.indexOf(hourBranch);
      const dayGanZhi = getDayGanZhiRef(date);
      const dayGanZhiGan = splitPillar(getDayGanZhiRef(date));
      const hourStem = getHourStem2(dayGanZhiGan.gan, hourBranchIndex);

      return `${hourStem}${hourBranch}`;  // ex) "정사"
    }

    function calcGanzhi(dateObj) {
      const kstDate = toKoreanTime(dateObj);
      return {
        y: getYearGanZhiRef(kstDate),
        m: getMonthGanZhiRef(kstDate),
        d: getDayGanZhiRef(kstDate),
        h: getHourGanZhiRef(dateObj)  // 내부에서 다시 toKoreanTime 처리하므로 원본 dateObj로 전달해도 OK
      };
    }

    /* 0. 기본값 세팅 -------------------------------------------------- */
    let currentMode = 'ver21';  // 시간 · 일 · 월 모드
    function todayISO(fmt) {
      const t = toKoreanTime(new Date());
      if (fmt === 'datetime') return t.toISOString().slice(0,16); // YYYY-MM-DDTHH:MM
      if (fmt === 'date')     return t.toISOString().slice(0,10); // YYYY-MM-DD
      if (fmt === 'month')    return t.toISOString().slice(0,7);  // YYYY-MM
    }

    /* 1. 요소 --------------------------------------------------------- */
    const pickerDt = document.getElementById('woonTimeSetPicker2');
    const pickerD  = document.getElementById('woonTimeSetPickerVer22');
    const pickerM  = document.getElementById('woonTimeSetPickerVer23');
    const spanGanz = document.getElementById('currentGanzhi');

    /* 2. 첫 값 지정 ---------------------------------------------------- */
    pickerDt.value = pickerDt.value || todayISO('datetime');
    pickerD .value = pickerD .value || todayISO('date');
    pickerM .value = pickerM .value || todayISO('month');

    /* 3. 간지 출력 ---------------------------------------------------- */
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

    function parseLocalDateTime(dateStr) {          // 'YYYY-MM-DDTHH:MM'
      const [y,m,d,h,mm] = dateStr
        .match(/\d+/g)
        .map(n => parseInt(n, 10));
      return new Date(y, m - 1, d, h, mm);
    }

    function parseLocalDate(dateStr) {              // 'YYYY-MM-DD'
      const [y,m,d] = dateStr.split('-').map(n => parseInt(n, 10));
      return new Date(y, m - 1, d);
    }

    function parseLocalMonth(monthStr) {            // 'YYYY-MM'
      const [y,m] = monthStr.split('-').map(n => parseInt(n, 10));
      return new Date(y, m - 1, 1);
    }

    /* -----------------------------------------------------------
    *  handleChange : 각 모드별로 독립 if 로 처리
    * ----------------------------------------------------------- */

    

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

      // 값이 없으면 오늘 날짜
      if (!dateObj) dateObj = new Date();

      updateGanzhiDisplay(dateObj);
    }
    handleChangeVr = handleChange;

    updateGanzhiDisplay(toKoreanTime(new Date()))



    // ============================================================== //

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
      //console.log("기본정보 업데이트 완료.");
      // Pillars 계산 및 전역 변수 저장
      // 원국 및 묘운 업데이트 실행
      const refDate = toKoreanTime(new Date());
      updateOriginalAndMyowoon(refDate);
      updateOriginalAndMyowoonVr = updateOriginalAndMyowoon;

      
    }

    //updateCoupleModeBtnVisibility();
    updateMeGroupOption();

    document.getElementById("coupleModeBtn").addEventListener("click", function() {
      isCoupleMode = true;
      
       if (isCoupleMode) {
         // 궁합모드이면 aside를 열고, 현재 detail(본인) 인덱스는 그대로 유지
         // aside에 표시되는 목록은 본인 항목을 건너뛰게 됨 (loadSavedMyeongsikList에서 처리)
         document.getElementById("aside").style.display = "block";
         loadSavedMyeongsikList();
       } else {
         // 일반 모드로 돌아가면 aside 전체 목록을 다시 렌더링함
         document.getElementById("aside").style.display = "block";
         loadSavedMyeongsikList();
      }
      
    });

    // 11. 예제: 버튼 클릭 시 couple mode view 업데이트
    document.querySelectorAll(".couple_btn").forEach(function (button) {
      button.addEventListener("click", function (e) {
        e.stopPropagation();

        const partnerIdx = parseInt(this.value, 10);
        const list = JSON.parse(localStorage.getItem("myeongsikList")) || [];
        partnerData = list[partnerIdx];
        // if (partnerData) {
        //   sessionStorage.setItem("lastPartnerData", JSON.stringify(partnerData));
        //   //renderCoupleView();  // 선택할 때마다 뷰 갱신
        //   fillCoupleModeView(myIndex, partnerIndex);
        // }
        
        currentMode = "ver21";
        const partnerIndexStr = button.getAttribute("data-index").replace("couple_", "");
        const partnerIndex = parseInt(partnerIndexStr, 10);
        const savedList = JSON.parse(localStorage.getItem("myeongsikList")) || [];
        if (savedList[partnerIndex]) {
          partnerData = savedList[partnerIndex];
          //console.log("파트너 데이터 저장됨:", partnerData);
        } else {
          //console.warn("파트너 데이터가 존재하지 않습니다. partnerIndex:", partnerIndex);
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
        
        // "나"의 데이터가 미리 저장되어 있어야 두 사람의 데이터를 모두 업데이트할 수 있습니다.
        if (myData) {
          // 두 사람의 데이터를 전달하여 원국 및 묘운 HTML 업데이트 실행
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
        //document.getElementById("woonChangeBtn2").click();
        
      });
    });
    
  }

  function exitCoupleMode() {
    // 1) 플래그 & 데이터 정리
    isCoupleMode            = false;
    partnerData             = null;
    sessionStorage.removeItem("lastPartnerData");
  
    // 2) 커플 전용 UI 감추기
    const coupleWrap = document.querySelector(".couple_mode_wrap");
    if (coupleWrap) coupleWrap.style.display = "none";
  
    // 3) picker 모드도 기본(ver21)으로 돌리고 숨김
    updatePickerVisibility2('ver21');
  
    // 4) 싱글 모드 디테일 뷰 UI 복구
    document.getElementById("aside").style.display        = "none";
    document.getElementById("inputWrap").style.display    = "none";
    document.getElementById("resultWrapper").style.display = "block";
  
    // 5) “나”의 명식 데이터로 다시 렌더링
    //    detailViewBtn 클릭 핸들러를 재활용
    const btn = document.querySelector(`.detailViewBtn[data-index="${currentDetailIndex}"]`);
    if (btn) {
      btn.click();
    } else {
      // 혹시 버튼이 없다면 직접 함수 호출
      //fillDetailView(currentDetailIndex);
    }
  }
  
  // 뒤로 가기 버튼에 바인딩
  document.getElementById("coupleBackBtn").addEventListener("click", exitCoupleMode);


  document.getElementById("coupleBackBtn").addEventListener("click", function() {
    // 1) 커플 모드 해제
    isCoupleMode = false;
    partnerData = null;
    sessionStorage.removeItem("lastPartnerData");
  
    // 2) UI 초기화
    document.querySelector(".couple_mode_wrap").style.display = "none";
    document.getElementById("aside").style.display        = "none";
    document.getElementById("inputWrap").style.display    = "none";
    document.getElementById("resultWrapper").style.display = "block";
    updatePickerVisibility2('ver21');
  
    // 3) strip 함수
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
  
    // 4) 마지막 detail 버튼 강제 클릭 → 클릭 핸들러가 UI를 다시 그리고
    const btn = document.querySelector(`.detailViewBtn[data-index="${currentDetailIndex}"]`);
    if (btn) {
      btn.click();
  
      // 5) 클릭 핸들러 끝난 뒤(다음 이벤트 루프)에 색만 클린업
      setTimeout(() => {
        stripColorClasses('#people1');
        stripColorClasses('#people2');  // 여기서 people2 가 맞는지 id 확인!
      }, 0);
    }
  });
  
  // aside 열기/닫기 이벤트 등록
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
      birthPlaceTxt.style.display = "block";  // 시 모르면 문구 표시
    } else {
      timeType.style.display = "block";
      birthPlaceTxt.style.display = "none";   // 시 입력 가능하면 문구 숨김
    }
  });



  document.getElementById("calcBtn").addEventListener("click", function () {

    let refDate = toKoreanTime(new Date());

    // "태어난 시 모름" 체크 여부
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

    

    // 계산용: 시/분 기본값은 "0000", 출생지 기본값은 "서울특별시"
    let usedBirthtime = isTimeUnknown ? null : birthtimeStr;
    const usedBirthPlace = (isPlaceUnknown)
                            ? "서울특별시" : birthPlaceInput;

    // 저장용은 원래 입력 그대로 유지
    const savedBirthPlace = isPlaceUnknown ? "기본출생지 : 서울" : birthPlaceInput;

    // === 생년월일, 시간 파싱 ===
    let year   = parseInt(birthdayStr.substring(0, 4), 10);
    let month  = parseInt(birthdayStr.substring(4, 6), 10);
    let day    = parseInt(birthdayStr.substring(6, 8), 10);
    let hour = isTimeUnknown ? 4 : parseInt(usedBirthtime.substring(0, 2), 10);
    let minute = isTimeUnknown ? 30 : parseInt(usedBirthtime.substring(2, 4), 10);
    let birthDate = new Date(year, month - 1, day, hour, minute);

    if (birthdayStr.length < 8) {
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

    // 유효성 검사
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
    
    // 출생지 유효성 검사
    if (!isPlaceUnknown) {
      if (birthPlaceInput === "-") {
        alert("출생지를 선택하세요.");
        return;
      }
    }

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

    // 2) lunar → solar 변환
    let workYear   = year;
    let workMonth  = month;
    let workDay    = day;
    let lunarDate = null;
    if (isLunar) {
      const ok = calendar.setLunarDate(year, month, day, isLeap);
      if (!ok) {
        console.error(`음력 ${rawYear}.${rawMonth}.${rawDay} 변환 실패`);
        return;
      }
      const solar = calendar.getSolarCalendar();
        workYear  = solar.year;    // 1967
        workMonth = solar.month;   // 9
        workDay   = solar.day;     // 27
        //console.log(`변환된 양력: ${workYear}.${workMonth}.${workDay}`);
    } else {
      if (!calendar.setSolarDate(year, month, day)) {
        console.error("양력 날짜 설정에 실패했습니다.");
      } else {
        lunarDate = calendar.getLunarCalendar();
      }
    }

    originalDate = new Date(workYear, workMonth - 1, workDay, hour, minute);
    if (!fixedCorrectedDate) {
      fixedCorrectedDate = adjustBirthDateWithLon(originalDate, cityLon, isPlaceUnknown);
    }
    correctedDate = fixedCorrectedDate;


    const formattedBirth = `${workYear}-${pad(workMonth)}-${pad(workDay)}`;
    setText("resBirth", formattedBirth);

    // — 해당 양력을 다시 음력으로 변환해서 표시
    //    (입력 방식 상관없이 항상 이 양력 기준 음력을 보여줌)
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

    document.getElementById('resultWrapper').style.display = 'block';
    window.scrollTo(0, 0);
    document.getElementById('inputWrap').style.display = 'none';
    document.getElementById("saveBtn").style.display = "inline-block";

    // 예: "병자 경인 정묘 무오시, 대운수 ..." 형식의 문자열
    const parts = fullResult.split(", ");
    const pillarsPart = parts[0] || "-";
    const pillars = pillarsPart.split(" ");
    const yearPillar  = pillars[0] || "-";
    const monthPillar = pillars[1] || "-";
    const dayPillar   = pillars[2] || "-";
    let hourPillar  = isTimeUnknown ? null : pillars[3] || "-";

    

    // 원국 기둥 분리
    const yearSplit  = splitPillar(yearPillar);
    const monthSplit = splitPillar(monthPillar);
    const daySplit   = splitPillar(dayPillar);
    daySplitGlobal = daySplit;
    let hourSplit  = isTimeUnknown ? null : splitPillar(hourPillar);
    hourSplitGlobal = hourSplit;

    const birthYearPillar = yearPillar;

    baseDayStem = daySplit.gan; // 원국 일간
    
    const baseYearBranch = birthYearPillar.charAt(1); // 원국 연지 (예: "병자"에서 "자")

    const branchIndex = getHourBranchIndex(correctedDate);
    const branchName = Jiji[branchIndex];

    if (branchName === "자" || branchName === "축") {
    }

    requestAnimationFrame(() => {
      if (!isTimeUnknown) {
        if (hourSplit.ji === "자" || hourSplit.ji === "축") {
          
          checkOption.style.display = 'flex';
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

    // 2) 출생지 모를 때 기본 –30분 추가 보정
    
    const bjTimeTextEl = document.getElementById("bjTimeText");
    if (isPlaceUnknown) {
      bjTimeTextEl.innerHTML = `기본보정 -30분 : <b id="resbjTime">${correctedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</b>`;
    } else {
      bjTimeTextEl.innerHTML = `보정시 : <b id="resbjTime">${correctedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</b>`;
    }

    // const bjTimeText = document.getElementById("bjTimeText");

    // if (isTimeUnknown) {
    //   // 시각 모름이면 보정시간 표시 없앰
    //   bjTimeText.innerHTML = "보정시 알수없음";
    // } else {
    //   const formattedTime = correctedTime.toLocaleTimeString([], {
    //     hour: '2-digit',
    //     minute: '2-digit',
    //     hour12: false
    //   });
    //   const prefix = isPlaceUnknown ? "기본보정 : " : "보정시 : ";
    //   bjTimeText.innerHTML = `${prefix}<b id="resbjTime">${formattedTime}</b>`;
    // }

    

    function updateOriginalSetMapping(daySplit, hourSplit) {
      if (!hourSplit || typeof hourSplit.ji !== 'string') {
        return;
      }
      if (manualOverride) {
        return;
      }
      setText("Hb12ws", isTimeUnknown ? "-" : getTwelveUnseong(baseDayStem, hourSplit.ji));
      setText("Hb12ss", isTimeUnknown ? "-" : getTwelveShinsal(baseYearBranch, hourSplit.ji));
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
    updateStemInfo("Ht", isTimeUnknown ? "-" : hourSplit, baseDayStem);
    updateBranchInfo("Yb", baseYearBranch, baseDayStem);
    updateBranchInfo("Mb", monthSplit.ji, baseDayStem);
    updateBranchInfo("Db", daySplit.ji, baseDayStem);
    updateBranchInfo("Hb", isTimeUnknown ? "-" : hourSplit.ji, baseDayStem);
    updateOriginalSetMapping(daySplit, hourSplit);
    updateColorClasses();

    const daewoonData = getDaewoonData(gender, originalDate, correctedDate);

    function updateCurrentDaewoon(refDate) {

      //console.log(daewoonData, refDate);
      const currentAge = refDate.getFullYear() - correctedDate.getFullYear();
      
      let currentDaewoon = null;
      for (let i = 0; i < daewoonData.list.length; i++) {
        if (daewoonData.list[i].age <= currentAge) {
          currentDaewoon = daewoonData.list[i];
          //console.log(currentDaewoon, currentAge);
        }
      }
      if (!currentDaewoon) {
        currentDaewoon = daewoonData.list[0] || { stem: "-", branch: "-" };
      }

      function appendTenGod(id, value, isStem = true) {
        const el = document.getElementById(id);
        if (!el) return;
      
        // 1) tenGod 계산
        let tenGod;
        if (value === '-' || value === '(-)') {
          tenGod = '없음';
        } else {
          tenGod = isStem
            ? getTenGodForStem(value, baseDayStem)
            : getTenGodForBranch(value, baseDayStem);
        }
      
        // 2) 내부를 완전 초기화: 오로지 원본 value 텍스트만 남김
        el.innerHTML = '';
        el.append(document.createTextNode(value));
      
        // 3) <span>(십신)</span> 붙이기
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
      setText("DWb12ss", getTwelveShinsal(baseYearBranch, currentDaewoon.branch));
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
        
        // 원국 십신 업데이트
        setText("DC_" + idx, stemMapping[finalStem]?.hanja || "-");
        setText("DJ_" + idx, branchMapping[finalBranch]?.hanja || "-");
        setText("dt10sin" + idx, getTenGodForStem(finalStem, baseDayStem) || "-");
        setText("db10sin" + idx, getTenGodForBranch(finalBranch, baseDayStem) || "-");
        
        // 원국 십이운성 업데이트 (신살)
        setText("DwW" + idx, getTwelveUnseong(baseDayStem, finalBranch) || "-");
        setText("Ds" + idx, getTwelveShinsal(baseYearBranch, finalBranch) || "-");
        
        const displayedDaewoonNum = Math.floor(item.age);
        setText("Da" + idx, displayedDaewoonNum);
      }
    }
    
    // 호출 시
    updateAllDaewoonItems(daewoonData.list);

    const todayObj = toKoreanTime(new Date());
    const currentAge = refDate.getFullYear() - correctedDate.getFullYear();
    let currentDaewoonIndex = 0;
    if (daewoonData?.list) {
      for (let i = 0; i < daewoonData.list.length; i++) {
        if (daewoonData.list[i].age <= currentAge) {
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
      // setText("SwJj1", sewoonHidden[0]);
      // setText("SwJj2", sewoonHidden[1]);
      // setText("SwJj3", sewoonHidden[2]);
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
      appendTenGod("WSwJj1", sewoonHidden[0], true);
      
      setText("WSwJj2", sewoonHidden[1]);
      appendTenGod("WSwJj2", sewoonHidden[1], true);
      
      setText("WSwJj3", sewoonHidden[2]);
      appendTenGod("WSwJj3", sewoonHidden[2], true);
      // setText("WSwJj1", sewoonHidden[0]);
      // setText("WSwJj2", sewoonHidden[1]);
      // setText("WSwJj3", sewoonHidden[2]);
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
        //document.querySelectorAll("#sewoonList li").forEach(item => item.classList.remove("active"));
        //this.classList.add("active");
        const index = this.getAttribute("data-index2");
        updateSewoonDetails(index);
        const mowoonListElem = document.getElementById("walwoonArea");
        if (mowoonListElem) { mowoonListElem.style.display = "grid"; }
        document.querySelectorAll("#sewoonList li").forEach(e => e.classList.remove("active"));
        this.classList.add("active");
        
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

    const originalYearPillarData = getYearGanZhi(correctedDate, birthDate.getFullYear());
    const isYangStem = ["갑", "병", "무", "경", "임"].includes(originalYearPillarData.charAt(0));
    let direction = ((gender === "남" && isYangStem) || (gender === "여" && !isYangStem)) ? 1 : -1;

    function updateSewoonItem() {
      const decimalBirthYear = getDecimalBirthYear(correctedDate);
      const selectedDaewoon = daewoonData.list[daewoonIndex - 1];
      if (!selectedDaewoon) return;
      const daewoonNum = selectedDaewoon.age; 
      const sewoonStartYearDecimal = decimalBirthYear + daewoonNum;
      globalState.sewoonStartYear = Math.floor(sewoonStartYearDecimal);
      const sewoonList = [];
      for (let j = 0; j < 10; j++) {
        let sewoonYear = globalState.sewoonStartYear + j;
        let yearGanZhi = getYearGanZhiForSewoon(sewoonYear);
        const splitYear = splitPillar(yearGanZhi);
        const tenGod = getTenGodForStem(splitYear.gan, baseDayStem);
        const tenGodJiji = getTenGodForBranch(splitYear.ji, baseDayStem);
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
    }

    updateSewoonItem();

    const todayYear = todayObj.getFullYear();
    const ipChun = findSolarTermDate(todayObj.getFullYear(), 315);
    //const ipChun = findSolarTermDate(birthDate.getFullYear(), 315);
    const displayYear = (todayObj < ipChun) ? todayYear - 1 : todayYear;
    const sewoonLis = document.querySelectorAll("#sewoonList li");
    sewoonLis.forEach(li => {
      const dyearElem = li.querySelector(".dyear");
      const currentYear = Number(dyearElem.innerText);
      li.classList.toggle("active", currentYear === displayYear);
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
      appendTenGod(monthBranch, "WMb", true);
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
      updateMonthlyWoon(computedYear, currentMonthIndex, baseDayStem);
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
        const twelveShinsal = getTwelveShinsal(baseYearBranch, branch);
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
        updateColorClasses();

        // ② 현재 사이클의 “오늘 날짜” 계산 함수
        function getCycleDateToday() {
          const nowKst = toKoreanTime(new Date());
          // 날짜만 비교할 것이므로 시·분·초는 모두 0으로
          const cycleDate = new Date(
            nowKst.getFullYear(),
            nowKst.getMonth(),
            nowKst.getDate(), 
            0, 0, 0, 0
          );
          const hour = nowKst.getHours();

          // 자시(23:00 기준)
          if (document.getElementById("jasi").checked) {
            if (hour < 23) {
              // 23시 이전이면 전날로 이동
              cycleDate.setDate(cycleDate.getDate() - 1);
            }
          }
          // 야자시(00:00 기준) → 별도 보정 없음

          // 인시(03:00 기준)
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
        
        // UI 숨김/보임 처리
        document.getElementById('iljuCalender').style.display = 'none';
        const sewoonBox = document.querySelector(".lucky.sewoon");
        if (sewoonBox) { sewoonBox.style.display = "none"; }
        document.querySelectorAll("#sewoonList li").forEach(li => li.classList.remove("active"));
        const monthlyContainer = document.getElementById("walwoonArea");
        if (monthlyContainer) { monthlyContainer.style.display = "none"; }
        
        // 대운(daewoon) 관련 업데이트
        const daewoonIndex = parseInt(this.getAttribute("data-index"), 10);
        
        // 출생년도(decimal) 계산
        const decimalBirthYear = getDecimalBirthYear(correctedDate);
        const selectedDaewoon = daewoonData.list[daewoonIndex - 1];
        if (!selectedDaewoon) return;
        const daewoonNum = selectedDaewoon.age; 
        const sewoonStartYearDecimal = decimalBirthYear + daewoonNum;
        globalState.sewoonStartYear = Math.ceil(sewoonStartYearDecimal);
        
        // baseDayStem을 전달받은 인자로 사용 (혹은 "DtHanguel"에서 가져올 수도 있음)
        // const displayedDayPillar = document.getElementById("DtHanguel").innerText;
        // const baseDayStemS = displayedDayPillar ? displayedDayPillar.charAt(0) : "-";
        
        // 세운(운) 리스트 생성
        const sewoonList = [];
        for (let j = 0; j < 10; j++) {
          let sewoonYear = globalState.sewoonStartYear + j;
          let yearGanZhi = getYearGanZhiForSewoon(sewoonYear);
          const splitYear = splitPillar(yearGanZhi);
          const tenGod = getTenGodForStem(splitYear.gan, baseDayStem);
          const tenGodJiji = getTenGodForBranch(splitYear.ji, baseDayStem);
          sewoonList.push({
            year: sewoonYear,
            gan: splitYear.gan,
            ji: splitYear.ji,
            tenGod: tenGod,
            tenGodJiji: tenGodJiji
          });
        }
        
        // 세운 데이터 업데이트 함수
        function updateSewoonData(baseDayStem, baseYearBranch) {
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
        }
        updateSewoonData(baseDayStem, baseYearBranch);
        
        // 원국 대운 HTML 업데이트 함수
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
          // setText("DwJj1", daewoonHidden[0]);
          // setText("DwJj2", daewoonHidden[1]);
          // setText("DwJj3", daewoonHidden[2]);
          setText("DwJj1", daewoonHidden[0]);
          appendTenGod("DwJj1", daewoonHidden[0], true);
          
          setText("DwJj2", daewoonHidden[1]);
          appendTenGod("DwJj2", daewoonHidden[1], true);
          
          setText("DwJj3", daewoonHidden[2]);
          appendTenGod("DwJj3", daewoonHidden[2], true);
        }
        updateDaewoonHTML(selectedDaewoon, baseDayStem);
        
        updateColorClasses();
        
        // 월운(운) 업데이트
        const computedYear = globalState.sewoonStartYear;
        const boundariesForSewoon = getSolarTermBoundaries(computedYear);
        const targetSolarTerm = boundariesForSewoon[0].name;
        updateMonthlyFortuneCalendar(targetSolarTerm, computedYear);
        document.querySelectorAll("#mowoonList li").forEach(li => li.classList.remove("active"));
      });
    });
  


    document.querySelectorAll("[id^='Sewoon_']").forEach(function (sewoonLi) {
      sewoonLi.addEventListener("click", function (event) {
        
        // UI 표시 관련 업데이트
        document.getElementById('iljuCalender').style.display = 'none';
        const sewoonBox = document.querySelector(".lucky.sewoon");
        if (sewoonBox) { sewoonBox.style.display = "grid"; }
        const monthlyContainer = document.getElementById("walwoonArea");
        if (monthlyContainer) { monthlyContainer.style.display = "grid"; }
        
        // 세운 인덱스와 연도를 계산
        const sewoonIndex = parseInt(this.getAttribute("data-index2"), 10);
        if (!globalState.sewoonStartYear) {
          alert("먼저 대운을 선택하여 세운 시작연도를 계산하세요.");
          return;
        }
        const computedYear = globalState.sewoonStartYear + (sewoonIndex - 1);

        updateMonthlyData(computedYear, refDate);
        // baseDayStem을 인자로 받아서 사용합니다.
        // 참고: 만약 "DtHanguel"에서 가져온 값이 필요하다면 주석 처리한 코드를 사용할 수 있습니다.
        // const displayedDayPillar = document.getElementById("DtHanguel").innerText;
        // const baseDayStemS = displayedDayPillar ? displayedDayPillar.charAt(0) : "-";
        
        // 세운 연간(세운) 계산
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
  
        // 내부 함수: 선택된 세운 결과로 UI를 업데이트
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
          // setText("SwJj1", sewoonHidden[0]);
          // setText("SwJj2", sewoonHidden[1]);
          // setText("SwJj3", sewoonHidden[2]);
          setText("SwJj1", sewoonHidden[0]);
          appendTenGod("SwJj1", sewoonHidden[0], true);
          
          setText("SwJj2", sewoonHidden[1]);
          appendTenGod("SwJj2", sewoonHidden[1], true);
          
          setText("SwJj3", sewoonHidden[2]);
          appendTenGod("SwJj3", sewoonHidden[2], true);
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
          // setText("WSwJj1", sewoonHidden[0]);
          // setText("WSwJj2", sewoonHidden[1]);
          // setText("WSwJj3", sewoonHidden[2]);
          setText("WSwJj1", sewoonHidden[0]);
          appendTenGod("WSwJj1", sewoonHidden[0], true);
          
          setText("WSwJj2", sewoonHidden[1]);
          appendTenGod("WSwJj2", sewoonHidden[1], true);
          
          setText("WSwJj3", sewoonHidden[2]);
          appendTenGod("WSwJj3", sewoonHidden[2], true);
          setText("WSWb12ws", getTwelveUnseong(baseDayStem, selectedSewoon.ji));
          setText("WSWb12ss", getTwelveShinsal(baseYearBranch, selectedSewoon.ji));
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
        
        /*document.querySelectorAll("#mowoonList li").forEach(function(item) {
          item.classList.remove("active");
        });
        li.classList.add("active");*/
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
      const yeonjuCycle = getSolarYearSpanInDays(birthDate, 120);
      const woljuCycle  = getSolarYearSpanInDays(birthDate, 10);
      const iljuCycle   = getSolarMonthSpanInDays(birthDate, 4);
      const sijuCycle   = getSolarDaySpanInDays(birthDate, 10);
      return { yeonjuCycle, woljuCycle, iljuCycle, sijuCycle };
    }

    const { yeonjuCycle, woljuCycle, iljuCycle, sijuCycle } = getDynamicCycles(birthDate);

    // 모드 결정 (순행/역행)
    // getYearGanZhi, correctedDate, gender는 이미 정의되어 있다고 가정
    

    // 보정 및 동적 단계 계산 함수
    function adjustInitial(candidate, cycleDays, baseDate) {
      while (candidate < baseDate) {
        candidate = new Date(candidate.getTime() + cycleDays * oneDayMs);
      }
      return candidate;
    }

    function getDynamicStep(candidateTime, cycleDays, refDate) {
      const now = refDate || toKoreanTime(new Date());
      const diff = now - candidateTime; // 밀리초 차이
      return diff < 0 ? 0 : Math.floor(diff / (cycleDays * oneDayMs)) + 1;
    }

    // refDate를 인자로 받아 동적 업데이트 이벤트를 생성하도록 수정
    function applyFirstUpdateDynamicWithStep(date, originalIndex, cycleSteps, mode, refDate) {
      const steps = getDynamicStep(date, cycleSteps, refDate);
      const updatedIndex = mode === "순행"
        ? ((originalIndex + steps) % 60 + 60) % 60
        : ((originalIndex - steps) % 60 + 60) % 60;
      return { date: date, index: updatedIndex, ganji: getGanZhiFromIndex(updatedIndex) };
    }


    // 지지별 시간 범위 (분 단위)
    const timeRanges2 = [
      { branch: '子', start: 1380, end: 60 },
      { branch: '丑', start: 60, end: 180 },
      { branch: '寅', start: 180, end: 300 },
      { branch: '卯', start: 300, end: 420 },
      { branch: '辰', start: 420, end: 540 },
      { branch: '巳', start: 540, end: 660 },
      { branch: '午', start: 660, end: 780 },
      { branch: '未', start: 780, end: 900 },
      { branch: '申', start: 900, end: 1020 },
      { branch: '酉', start: 1020, end: 1140 },
      { branch: '戌', start: 1140, end: 1260 },
      { branch: '亥', start: 1260, end: 1380 }
    ];

    // Helper: 주어진 Date에서 시지(地支)를 반환
    function getHourBranch(date) {
      const minutes = date.getHours() * 60 + date.getMinutes();
      for (const range of timeRanges2) {
        if (range.start < range.end) {
          if (minutes >= range.start && minutes < range.end) return range.branch;
        } else {
          if (minutes >= range.start || minutes < range.end) return range.branch;
        }
      }
      return null;
    }

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

    function nextEvent(prevDate, prevIdx, stepDays, mode) {
      const dir     = mode === '순행' ?  1 : -1;
      const oneDay  = 24 * 60 * 60 * 1000;
      const nextDate = new Date(prevDate.getTime() + dir * stepDays * oneDay);
      const nextIdx  = (prevIdx + dir + 60) % 60;
      return { date: nextDate, index: nextIdx };
    }

    // originalDate = new Date(year, month - 1, day, hour, minute);
    // correctedDate = adjustBirthDateWithLon(originalDate, usedBirthPlace, isPlaceUnknown);

    function getMyounPillars(person, refDate, basisOverride = "insi") {
      
      const { year, month, day, hour, minute, gender, correctedDate } = person;

      birthDate = correctedDate
        ? new Date(correctedDate)
        : new Date(year, month - 1, day, hour, minute);
      // 3) basis 결정 (override 있으면 우선)
      const basis = basisOverride
        || document.querySelector('input[name="time2"]:checked')?.value;
      const basisMap = { jasi: 23, yajasi: 0, insi: 3 };
      const baseTime = new Date(birthDate);
      if (basisMap[basis] != null) baseTime.setHours(basisMap[basis], 0);
      
       // Date 객체(birthDate)를 첫 인자로 넘긴다
       const fullResult = getFourPillarsWithDaewoon(
        birthDate.getFullYear(),
        birthDate.getMonth() + 1,
        birthDate.getDate(),   // Date
         hour,
         minute,
         gender,
         correctedDate     // Date
       );
      // 예: "병자 경인 정묘 무오시, 대운수 ..." 형식의 문자열
      const parts = fullResult.split(", ");
      const pillarsPart = parts[0] || "-";
      const pillars = pillarsPart.split(" ");
      const yearPillar  = pillars[0] || "-";
      const monthPillar = pillars[1] || "-";
      const dayPillar   = pillars[2] || "-";
      const hourPillar  = pillars[3] || "-";

      // 2) 순/역행 판단 (기존 로직 유지)
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
      
        // ── 첫 시주 전환 시점 (분 단위 스캔) ──
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
        

        // ── 첫 일주 전환 시점 (인시/자시 기준 + 순/역행) ──
        //const basis = document.querySelector('input[name="time2"]:checked')?.value || basisOverride; // 'jasi','yajasi','insi'
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
      
        // ── 날짜 배열 생성 ──
        const maxCycles = 4381; // 120년간 2시간 간격 → 4380+1
        const sDates = [ birthDate, getFirstSijuChange(birthDate) ];
        const iDates = [ birthDate, getFirstIljuChange(birthDate) ];
        for (let i = 2; i < maxCycles; i++) {
          const deltaMs = (dirMode==='순행'?1:-1) * cycleMin * msMin;
          sDates[i] = new Date(sDates[i-1].getTime() + deltaMs);
          iDates[i] = new Date(iDates[i-1].getTime() + deltaMs);
        }
      
        // ── 시주 간지 배열 (hourPillars부터 시작) ──
        const sPillars = [ hourPillar ];
        for (let i = 1; i < sDates.length; i++) {
          const idx    = getGanZhiIndex(sPillars[i - 1]);
          const nextIx = dirMode === '순행'
            ? (idx + 1) % 60
            : (idx + 59) % 60;
          sPillars[i] = getGanZhiByIndex(nextIx);
        }

        // ── 일주 간지 배열 (dayPillars부터 시작!) ──
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

        // ── 월주 간지 배열 (monthPillars부터 시작!) ──
        //if (!(correctedDate instanceof Date)) {
          //correctedDate = new Date(correctedDate);
        //}
        let year = birthDate.getFullYear();
        const allTerms = getSolarTermBoundaries(year).sort((a,b) => a.date - b.date);
        let pointer;

        if (dirMode === '순행') {
          pointer = allTerms.findIndex(t => t.date >= correctedDate);
          if (pointer < 0) {
            year++;
            allTerms.length = 0;
            allTerms.push(...getSolarTermBoundaries(year).sort((a,b) => a.date - b.date));
            pointer = 0;
          }
        } else {
          const past = allTerms.filter(t => t.date <= correctedDate);
          pointer = past.length - 1;
          if (pointer < 0) {
            year--;
            allTerms.length = 0;
            allTerms.push(...getSolarTermBoundaries(year).sort((a,b) => a.date - b.date));
            pointer = allTerms.length - 1;
          }
        }

        const mPillars = [ monthPillar ];
        const yPillars = [ yearPillar ];
        const principals = [
          "입춘","경칩","청명","입하",
          "망종","소서","입추","백로",
          "한로","입동","대설","소한"
        ];
        const MONTH_ZHI2 = [
          "寅","卯","辰","巳",
          "午","未","申","酉",
          "戌","亥","子","丑"
        ];
        const yeonjuTargetMap = {
          insi:   { 순행:"寅", 역행:"丑" },
          jasi:   { 순행:"寅", 역행:"丑" },
          yajasi: { 순행:"寅", 역행:"丑" }
        };
        const yeonjuTarget = yeonjuTargetMap[basis][dirMode];
        let lastMb = MONTH_ZHI2[allTerms.findIndex((t, i) => principals[i] === allTerms[pointer].name)];

        for (let i = 1; i < sDates.length; i++) {
          const dt = sDates[i];
          const term = allTerms[pointer];
          const hit = (dirMode === '순행') ? (dt >= term.date) : (dt <= term.date);

          if (hit) {
            mPillars[i] = getMonthGanZhi(dt, year);
            // move pointer
            if (dirMode === '순행') {
              pointer++;
              if (pointer >= allTerms.length) {
                year++;
                allTerms.length = 0;
                allTerms.push(...getSolarTermBoundaries(year).sort((a,b) => a.date - b.date));
                pointer = 0;
              }
            } else {
              pointer--;
              if (pointer < 0) {
                year--;
                allTerms.length = 0;
                allTerms.push(...getSolarTermBoundaries(year).sort((a,b) => a.date - b.date));
                pointer = allTerms.length - 1;
              }
            }

            // 연주 결정
            const termName = allTerms[pointer].name;
            const princIdx = principals.indexOf(termName);
            const mb = princIdx !== -1 ? MONTH_ZHI2[princIdx] : lastMb;
            const prevY = yPillars[i-1];
            let newY = prevY;

            if (princIdx !== -1 && mb === yeonjuTarget && mb !== lastMb) {
              const idx = getGanZhiIndex(prevY);
              newY = dirMode === '순행'
                ? getGanZhiByIndex((idx + 1) % 60)
                : getGanZhiByIndex((idx + 59) % 60);
            }
            yPillars[i] = newY;
            lastMb = mb;
          } else {
            mPillars[i] = mPillars[i-1];
            yPillars[i] = yPillars[i-1];
          }
        }
        
        // ── 적용기간 계산 (시주 기준) ──
        const periods = [];
        // 첫 적용기간: 실제분→10일 매핑 -1분
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
        

        // ── 헬퍼: 첫 변경 시점 찾기 ──
        function findFirstChange(pillarsArr) {
          for (let i = 1; i < pillarsArr.length; i++) {
            if (pillarsArr[i] !== pillarsArr[i - 1]) {
              return periods[i].start;
            }
          }
          return null;
        }

        
        function findLastChange(pillarsArr, periods, refDate) {
          // 1) 오늘 구간 인덱스 찾기
          let idx = periods.findIndex(({ start, end }) =>
            refDate >= start && refDate < end
          );
          if (idx < 0) idx = periods.length - 1;
        
          // 2) 현재 구간부터 뒤로 검색
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

        // ── 각 기둥별 첫 변경 시점 ──
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

        // ── 각 기둥별 현재 간지 ──

        const idx = periods.findIndex(({start, end}) =>
          refDate >= start && refDate < end
        );

        // ── 인덱스가 유효하면 해당 기둥, 아니면 null ──
        const sijuCurrentPillar  = idx >= 0 ? sPillars[idx] : null;
        const iljuCurrentPillar  = idx >= 0 ? iPillars[idx] : null;
        const woljuCurrentPillar = idx >= 0 ? mPillars[idx] : null;
        const yeonjuCurrentPillar= idx >= 0 ? yPillars[idx] : null;

        // ── 최종 리턴 수정 ──
        return {
          // 묘운(오늘 구간)
          sijuCurrentPillar,    // ex: "기사"
          iljuCurrentPillar,    // ex: "갑술"
          woljuCurrentPillar,   // ex: "정유"
          yeonjuCurrentPillar,  // ex: "병자"

          // 첫 변경 시점
          getFirstSijuChange,
          sijuFirstChangeDate,
          iljuFirstChangeDate,
          woljuFirstChangeDate,
          yeonjuFirstChangeDate,

          // 마지막 변경 시점
          sijuLastChangeDate,
          iljuLastChangeDate,
          woljuLastChangeDate,
          yeonjuLastChangeDate,

          // 다음 변경 시점
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
    
      // 첫 변경 이벤트
 
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

    let myowoonResult = getMyounPillars(myData, refDate);


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

      
    
      // === 연주 ===
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
      setText("MyoYb12ss", getTwelveShinsal(baseYearBranch, yp[1]));
    
      // === 월주 ===
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
      setText("MyoMb12ss", getTwelveShinsal(baseYearBranch, mp[1]));
    
      // === 일주 ===
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
        setText("MyoDb12ss", getTwelveShinsal(baseYearBranch, dp[1]));
      }
    
      // === 시주 ===
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
        setText("MyoHb12ss", getTwelveShinsal(baseYearBranch, hp[1]));
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

      // 1) YYYY‑MM‑DDThh:mm 형식으로 맞춰 주기
      const pad = n => String(n).padStart(2, '0');
      const fyear   = kstNow.getFullYear();
      const fmonth  = pad(kstNow.getMonth() + 1);
      const fday    = pad(kstNow.getDate());
      const fhours  = pad(kstNow.getHours());
      const fmins   = pad(kstNow.getMinutes());
    
      // value 세팅
      document.getElementById("woonTimeSetPicker").value = `${fyear}-${fmonth}-${fday}T${fhours}:${fmins}`;
      document.getElementById("woonTimeSetPickerVer2").value = formatDateLocal(today);
      document.getElementById("woonTimeSetPickerVer3").value = formatMonthLocal(today);
    
      // display 초기화
      document.getElementById("woonTimeSetPicker").style.display = '';
      document.getElementById("woonTimeSetPickerVer2").style.display = 'none';
      document.getElementById("woonTimeSetPickerVer3").style.display = 'none';

      // value 세팅
      document.getElementById("woonTimeSetPicker2").value = `${fyear}-${fmonth}-${fday}T${fhours}:${fmins}`;
      document.getElementById("woonTimeSetPickerVer22").value = formatDateLocal(today);
      document.getElementById("woonTimeSetPickerVer23").value = formatMonthLocal(today);
    
      // display 초기화
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
        // 1. 모든 버튼에서 active 제거
        pickerButtons.forEach(b => b.classList.remove('active'));

        // 2. 클릭한 버튼에 active 추가
        btn.classList.add('active');
      });
    });

    const pickerButtons2 = document.querySelectorAll('.btn_box .picker_btn2');

    pickerButtons2.forEach((btn) => {
      btn.addEventListener('click', () => {
        // 1. 모든 버튼에서 active 제거
        pickerButtons2.forEach(b => b.classList.remove('active'));

        // 2. 클릭한 버튼에 active 추가
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
        
        //const picker = isCoupleMode ? getCurrentPicker2() : getCurrentPicker();
        
        //const refDate = (picker && picker.value) ? toKoreanTime(new Date(picker.value)) : toKoreanTime(new Date());
    
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
              checkOption.style.display = 'flex';
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
        

    // updateDayWoon 함수 수정
    function updateDayWoon(refDate) {
      // 1) 무조건 KST 기준으로 변환
      const kstDate = toKoreanTime(refDate);
      const hour    = kstDate.getHours();

      // 2) 복제본 준비
      const adjustedDate = new Date(kstDate.getTime());

      // 3) 자시/야자시/인시 기준으로 “일” 경계 이동
      if (document.getElementById("jasi").checked) {
        // 자시 기준: 23시를 하루의 시작으로 본다 → 23시 이전이면 전날 23시로 이동
        if (hour < 23) {
          adjustedDate.setDate(adjustedDate.getDate() - 1);
        }
        adjustedDate.setHours(23, 0, 0, 0);

      } else if (document.getElementById("yajasi").checked) {
        // 야자시 기준(=0시 기준): 아무 보정 없이 당일 0시로
        adjustedDate.setHours(0, 0, 0, 0);

      } else if (document.getElementById("insi").checked) {
        // 인시 기준(=3시 기준): 3시 이전이면 전날 3시로 이동
        if (hour < 3) {
          adjustedDate.setDate(adjustedDate.getDate() - 1);
        }
        adjustedDate.setHours(3, 0, 0, 0);
      }

      // 4) 이 adjustedDate를 기준으로 일간/지지 계산
      const dayGanZhi = getDayGanZhi(adjustedDate);
      const { gan, ji } = splitPillar(dayGanZhi);
    

      if (isPickerVer3) {
        ["WDtHanja", "WDtHanguel", "WDtEumyang", "WDt10sin",
         "WDbHanja", "WDbHanguel", "WDbEumyang", "WDb10sin",
         "WDbJj1", "WDbJj2", "WDbJj3", "WDb12ws", "WDb12ss"].forEach(id => setText(id, "-"));
      } else {
        // 이후 출력 로직 그대로 유지
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
        setText("WDb12ss", getTwelveShinsal(baseYearBranch, ji) || "-");
        updateColorClasses();
      }

      return { dayGanZhi, gan, ji };
    }

    updateDayWoon(refDate);

    // 체크박스 이벤트 리스너 등록 (체크박스 값 변경 시 재계산)
    
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
        setText("WTb12ss", getTwelveShinsal(baseYearBranch, hourBranch) || "-");
        updateColorClasses();
      }
    }
    updateHourWoon(refDate);

    const picker = isCoupleMode ? getCurrentPicker2() : getCurrentPicker();
    refDate = (picker && picker.value) ? toKoreanTime(new Date(picker.value)) : toKoreanTime(new Date());  
    myowoonResult = getMyounPillars(myData, refDate);
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
      const originalDate = new Date(year, month - 1, day, hour, minute);
      correctedDate = adjustBirthDateWithLon(originalDate, cityLon, isPlaceUnknown);
      
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
      // 오늘 날짜 기준
      const today = toKoreanTime(new Date());
    
      // 입춘 날짜를 구합니다.
      const ipchun = findSolarTermDate(today.getFullYear(), 315);
    
      // 오늘 날짜가 입춘 이전이면 전년을, 아니면 올해를 solarYear로 사용
      const solarYear = (today < ipchun) ? today.getFullYear() - 1 : today.getFullYear();
    
      // 태양절기 경계(boundaries) 배열을 구합니다.
      const boundaries = getSolarTermBoundaries(solarYear);
    
      // boundaries 배열에서 오늘 날짜에 해당하는 인덱스를 찾습니다.
      let currentIndex = 0;
      for (let i = 0; i < boundaries.length - 1; i++) {
        if (today >= boundaries[i].date && today < boundaries[i + 1].date) {
          currentIndex = i;
          break;
        }
      }
      // 오늘 날짜가 마지막 경계 이후면 마지막 인덱스를 사용
      if (today >= boundaries[boundaries.length - 1].date) {
        currentIndex = boundaries.length - 1;
      }
    
      // 현재 태양절기의 이름
      const solarTermName = boundaries[currentIndex].name;
    
      // 현재 경계의 시작 날짜
      const startDate = boundaries[currentIndex].date;
    
      // 다음 경계의 날짜에서 하루(24시간)을 뺀 값을 endDate로 사용.
      // 만약 다음 경계가 없으면, startDate 기준 30일 후로 임의 설정합니다.
      const endDate = boundaries[currentIndex + 1]
        ? new Date(boundaries[currentIndex + 1].date.getTime() - 24 * 60 * 60 * 1000)
        : new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    
      // currentMonthIndex는 현재 달(0부터 시작)로 간단하게 설정합니다.
      const currentMonthIndex = today.getMonth();
    
      return { solarTermName, startDate, endDate, currentIndex, boundaries, solarYear, currentMonthIndex };
    }

    if (isTimeUnknown) {
      document.querySelector(".check_option").style.display = "none";
    } else {
      document.querySelector(".check_option").style.display = ""; // or "block" 등
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
        // birthDate: 보정 시각 (예: correctedDate)
        // mode: "순행" 또는 "역행"
        let base = new Date(birthDate); // 복사본 생성
        const h = birthDate.getHours();
        const sijuBlock = findNextOrPrevBlock(h, mode);
      
        if (mode === "순행") {
          if (sijuBlock <= h) {
            base.setDate(base.getDate() + 1);
          }
          base.setHours(sijuBlock, 0, 0, 0);
          
        } else { // 역행
          if (sijuBlock > h) {
            base.setDate(base.getDate() - 1);
          }
          base.setHours(sijuBlock, 0, 0, 0);
          
        }
      
        let diffMs = Math.abs(base.getTime() - birthDate.getTime());
        let diffMinutes = Math.floor(diffMs / (60 * 1000));
      
        // 기존 계산 결과가 174분(=2시간 54분) 나올 경우, 원하는 값은 54분이므로 120분을 빼줍니다.
        if (diffMinutes >= 120) {
          diffMinutes -= 120;
        }
      
        const hours = Math.floor(diffMinutes / 60);
        const minutes = diffMinutes % 60;
        return `${hours}시간 ${minutes}분`;
      }

      function findNearestSolarTerm(correctedDate, mode = "순행") {
        const year = correctedDate.getFullYear();
        // 올해 절기들 (Date 객체가 term.date 에 들어있다고 가정)
        let terms = getSolarTermBoundaries(year);
      
        if (mode === "순행") {
          // correctedDate 이후의 첫 절기
          const next = terms.find(t => t.date > correctedDate);
          if (next) return next;
          // 없으면 내년 첫 절기
          return getSolarTermBoundaries(year + 1)[0];
        } else {
          // 역행: correctedDate 이전(또는 같은 시각)의 마지막 절기
          const prev = [...terms].reverse().find(t => t.date <= correctedDate);
          if (prev) return prev;
          // 없으면 작년 마지막 절기
          const lastPrevYear = getSolarTermBoundaries(year - 1);
          return lastPrevYear[lastPrevYear.length - 1];
        }
      }
  
      function getWoljuTimeDifference(correctedDate, mode = "순행") {
        // 1) 기준 절기 자동 선택
        const term = findNearestSolarTerm(correctedDate, mode);
      
        // 2) woljuBase: term.date 또는 전/후년 같은 절기
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
      
        // 3) 시간 차 계산
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
      
        // 시간 보정
        if (hours < 0) {
          hours += 24;
          days--;
        }
        // 일 보정 (이전 달의 일수 구하기)
        if (days < 0) {
          const prevMonthLastDay = new Date(t.getFullYear(), t.getMonth(), 0).getDate();
          days += prevMonthLastDay;
          months--;
        }
        // 월 보정
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
          // 동적 업데이트 바뀐 횟수: <b>${getDynamicStep(myowoonResult.iljuFirstChangeDate, sijuCycle, refDate)}</b><br>
          html += `
            <li>
              <div class="pillar_title"><strong>일주</strong></div>
              원국 일주 간지: <b>${dayPillar}</b><br>
              보정 후 처음 간지 바뀌는 시간: <b>${formatByTimeKnown(myowoonResult.iljuFirstChangeDate)}</b><br>
              보정 후 오늘까지 마지막으로 바뀐 시간: <b>${formatByTimeKnown(myowoonResult.iljuLastChangeDate)}</b><br>
              다음 간지 바뀌는 날짜 : <b>${formatByTimeKnown(myowoonResult.iljuLastChangeDateStart)}</b><br>
              
              최종 업데이트 이벤트 간지: <b>${myowoonResult.iljuCurrentPillar}</b><br>
              방향: <b>${myowoonResult.dirMode}</b><br><br>
              묘운 일주의 경우, 시주가 일주의 12개의 팔이기 때문에, 자시일수론과 인시일수론에 따라 다르게 나옵니다.
              자시 일수론의 경우, 시주(시지)기준으로, 순행은 자시 역행은 해시(역으로 흐르기 때문에)에 따라 일주가 바뀌며,
              인시 일수론의 경우, 시주(시지)기준으로, 순행은 인시 역행은 축시(역으로 흐르기 때문에)에 따라 일주가 바뀝니다.
              현재 [${timeLabel}]일수론 사용중입니다.
            </li>
          `;
         } else {
          // 동적 업데이트 바뀐 횟수: <b>${getDynamicStep(myowoonResult.sijuFirstChangeDate, sijuCycle, refDate)}</b><br>
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
          
        
          // ----- 일주 설명 -----
          // 동적 업데이트 바뀐 횟수: <b>${getDynamicStep(myowoonResult.iljuFirstChangeDate, iljuCycle, refDate)}</b><br>
          html += `
            <li>
              <div class="pillar_title"><strong>일주</strong></div>
              원국 시주 간지: <b>${dayPillar}</b><br>
              보정 후 처음 간지 바뀌는 시간: <b>${formatByTimeKnown(myowoonResult.iljuFirstChangeDate)}</b><br>
              보정 후 오늘까지 마지막으로 바뀐 시간: <b>${formatByTimeKnown(myowoonResult.iljuLastChangeDate)}</b><br>
              다음 간지 바뀌는 날짜 : <b>${formatByTimeKnown(myowoonResult.iljuLastChangeDateStart)}</b><br>
              
              최종 업데이트 이벤트 간지: <b>${myowoonResult.iljuCurrentPillar}</b><br>
              방향: <b>${myowoonResult.dirMode}</b><br><br>
              묘운 일주의 경우, 시주가 일주의 12개의 팔이기 때문에, 자시일수론과 인시일수론에 따라 다르게 나옵니다.
              자시 일수론의 경우, 묘운 시주(시지)기준으로, 순행은 자시 역행은 해시(역으로 흐르기 때문에)에 따라 일주가 바뀌며,
              인시 일수론의 경우, 묘운 시주(시지)기준으로, 순행은 인시 역행은 축시(역으로 흐르기 때문에)에 따라 일주가 바뀝니다.
              현재 <b>[${timeLabel}]</b>일수론 사용중입니다.
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
     
     
      //----- 월주 설명 -----
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
          묘운 월주의 경우, 대운수를 구하는 방법과 동일하고,<br> 대운수 구하는 방법으로 구하셔도 됩니다.
          하지만, 대운수의 경우도 만세력마다 차이가 있기 때문에, 분단위로 구해보겠습니다. <br>
          순행은 생일 기준으로, 다음 절기로, 역행은 전 절기를 보고 구하게 됩니다.
          이 명식은 <b>${myowoonResult.dirMode}</b>이므로, ${direction()} 절기의 까지의 기간을 산출합니다.
          보정시에서 ${direction()} 절기의 기간까지 산출했을 때, <br>
          <b>${getWoljuTimeDifference(correctedDate, myowoonResult.dirMode)}</b> 나오게 되며, <br>
          ${getWoljuTimeDifference(correctedDate, myowoonResult.dirMode)} / 한달을 → <b>${monthStr}</b> / 10년으로 치환하여 구하게 됩니다.<br>
          위에서 구한 년도가 몇년이냐에 따라 대운수가 정해지게 됩니다. <br>
          그 뒤에는 그 뒤의 다음(순행) 혹은 이전(역행) 절기의 날짜와 시간을 보고 시간을 구하게 되는데,<br>
          순행은 절기가 지난 바로 다음시간, 역행은 절기가 지나기 바로 전시간을 보게 됩니다.<br>
          그것을 120년으로 확장하면, 약 10년이라는 시간뒤에 다음 월주가 변하는 것입니다.
        </li>
      `;
      
      //----- 연주 설명 -----
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
        묘운 연주의 경우, 시주가 일주의 12개의 팔이기 때문에, 묘운 인월에 변경됩니다.<br>
        월주(월지)기준으로, 순행은 인월 역행은 축월(역으로 흐르기 때문에)에 따라 연주가 바뀝니다.
      </li>
    `;
    
      
      ul.innerHTML = html;
    }
    updateExplanDetail(myowoonResult, hourPillar);

    function getDaySplit(dateObj) {
      // (1) 예: getDayGanZhi(dateObj)가 "경자" 같은 문자열을 리턴한다고 가정
      const dayGanZhi = getDayGanZhi(dateObj); 
        // 예: "경자" (간 = '경', 지 = '자')
    
      // (2) 일간(gan) 추출: getDayStem("경자") -> "경"
      const dayStem = getDayStem(dayGanZhi);
    
      // (3) 일지(zhi) 추출: 비슷한 로직이 있다면 가정. (혹은 dayGanZhi.slice(1)처럼 직접 처리)
      const dayBranch = dayGanZhi[1];
    
      // (4) 필요한 정보들을 객체로 묶어서 반환
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
      return pillarStr.charAt(1); // 두 번째 글자 = 지지
    }

    function getOriginalDateFromItem(item) {
      const year = parseInt(item.birthday.substring(0, 4), 10);
      const month = parseInt(item.birthday.substring(4, 6), 10) - 1;
      const day = parseInt(item.birthday.substring(6, 8), 10);
    
      let hour = 3, minute = 30; // 기본값
      if (!item.isTimeUnknown && item.birthtime) {
        const raw = item.birthtime.replace(/\s/g, "");
        if (raw.length === 4) {
          hour = parseInt(raw.substring(0, 2), 10);
          minute = parseInt(raw.substring(2, 4), 10);
        }
      }
    
      return new Date(year, month, day, hour, minute, 0);
    }

    function updateFunc() {
      // 원국, 묘운, 운 등의 업데이트 함수 호출
      updateFortune();
      updateOriginalSetMapping(daySplitGlobal, hourSplitGlobal);
      updateColorClasses();
      
      // 운(대운) 관련 업데이트: 원국 십신, 십이운성 등
      
      updateCurrentDaewoon(refDate);
      // 예: 전체 대운 리스트 업데이트 (각 항목마다 baseDayStem 필요)
      
      updateAllDaewoonItems(daewoonData.list);
      
      // 세운/월운/일운/시운 업데이트 (대운의 기준이 baseDayStem)
      updateCurrentSewoon(refDate);
      // 예: 각 세운 항목 업데이트
      updateSewoonItem(refDate); // 만약 개별 항목 업데이트 함수가 있다면 호출

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

      // 일간 운세(묘운) 달력 생성 시에도 baseDayStem을 사용
      const calendarHTML = generateDailyFortuneCalendar(
        solarTermName, startDate, endDate, currentIndex, boundaries, solarYear, refDate
      );
      // 캘린더 컨테이너에 반영 (예시)
      document.getElementById("iljuCalender").innerHTML = calendarHTML;
      
      updateHourWoon(refDate);
      updateDayWoon(refDate);
      
      // 묘운 업데이트: getMyounPillars() 호출 시에도 최신 기준값 사용
      myowoonResult = getMyounPillars(myData, refDate);
      updateMyowoonSection(myowoonResult);
    }

    function radioFunc() {

      let originalDate;
      let correctedRadio;

      const savedList = JSON.parse(localStorage.getItem("myeongsikList")) || [];
      const hasSaved = 
        typeof currentModifyIndex === "number" &&
        savedList[currentModifyIndex] !== undefined;

      if (!hasSaved) {
        // 처음모드
        originalDate = new Date(year, month - 1, day, hour, minute);
        correctedRadio  = adjustBirthDateWithLon(originalDate, usedBirthPlace, isPlaceUnknown);
        const originalBranch = getHourBranchFromPillar(hourPillar); 
        const realBranch = getHourBranchName(originalDate); 
        if (realBranch !== originalBranch) {
          return;
        }
      } else {
        // 명식보기 모드
        // savedList[currentModifyIndex] 를 사용해야겠죠?
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
          adjusted.setHours(23, 0, 0, 0); // 자시 기준
        } else if (selectedTime === "yajasi") {
          adjusted.setHours(0, 0, 0, 0);  // 자정 기준 (축시도 포함)
        } else if (selectedTime === "insi") {
          adjusted.setHours(3, 0, 0, 0); // 인시 기준
        }
      
        return adjusted;
      }
      
      const branchIndex = getHourBranchIndex(correctedRadio);
      const branchName = Jiji[branchIndex];

      if (branchName === "자" || branchName === "축") {
        
        let corrected;
        // [2] 보정된 시각
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
      
        // [3] 라디오 기준 시간 적용 (자시/야조자시/인시)
        const selectedTime01 = document.getElementById("timeChk02_01")?.checked; // 자시
        const selectedTime03 = document.getElementById("timeChk02_03")?.checked; // 인시
      
        let correctedForGanZhi = new Date(corrected); // 기본값: 보정된 날짜 그대로
      
        // [4] 축시이면서 자시/인시 선택 시 → 하루 전날로 간주해야 정간지 계산 가능
        if (selectedTime01 || selectedTime03) {
          correctedForGanZhi.setDate(correctedForGanZhi.getDate() - 1); // 🔥 전날로 수동 보정
        }
      
        // [5] 간지 기준 시각
        const ganZhiDate = getDateForGanZhiWithRadio(correctedForGanZhi);
      
        // [6] 간지 계산
        //const ganZhi = getDayGanZhi(ganZhiDate);
        const __daySplit = getDaySplit(ganZhiDate);
        const newGan = __daySplit.gan;
      
        baseDayStem = newGan;
      }
      //updateFunc();
    }
    
    document.getElementById("woonChangeBtn2").addEventListener("click", function () {
      const pickerDt = document.getElementById('woonTimeSetPicker2');
      const pickerD  = document.getElementById('woonTimeSetPickerVer22');
      const pickerM  = document.getElementById('woonTimeSetPickerVer23');

      // 보이는 피커로 모드 결정 (display:none 대신 hidden 속성 써도 무방)
      if (!pickerDt.hidden) {
        currentMode = 'ver21';           // 시간까지
      } else if (!pickerD.hidden) {
        currentMode = 'ver22';           // 일까지
      } else if (!pickerM.hidden) {
        currentMode = 'ver23';           // 월까지
      }
      handleChangeVr();                   // 갱신
      
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
              // 부모 .hanja_con 에서 클래스 제거
              const hanja = p.parentElement;
              hanja.classList.remove(...classesToRemove);
              // p 자신도 제거
              p.classList.remove(...classesToRemove);
            }
          });
      
        // 2) 그 외 direct <p> (한글, 십신, 운성) 검사
        root.querySelectorAll('li.siju_con3 > p')
          .forEach(p => {
            if (p.textContent.trim() === "-") {
              p.classList.remove(...classesToRemove);
            }
          });
      }
      
      // 사용 예시: body 전체 하이픈 요소 초기화
      document.querySelectorAll('.siju_con3').forEach(root => {
        clearHyphenElements(root);
      });
    });

    // 버튼 클릭 이벤트: picker 날짜(refDate)를 사용하여 동적 운세(묘운)를 업데이트
    document.getElementById("woonChangeBtn").addEventListener("click", function () {
      // 피커에서 기준 날짜(refDate)를 가져옴
      //const picker = document.getElementById('woonTimeSetPicker');
      const picker = isCoupleMode ? getCurrentPicker2() : getCurrentPicker();
      refDate = (picker && picker.value) ? toKoreanTime(new Date(picker.value)) : toKoreanTime(new Date());

      const branchIndex = getHourBranchIndex(correctedDate);
      const branchName = Jiji[branchIndex];

      if (branchName === "자" || branchName === "축") {
        radioFunc(refDate);
      }
      updateFunc(refDate);
      updateExplanDetail(myowoonResult, hourPillar);

      // 2-2) "올해 나이" 또는 "refDate" 기준으로 대운리스트 중 현재 대운(active) 찾음
      const currentAge = refDate.getFullYear() - correctedDate.getFullYear();
      let currentDaewoonIndex = 0;
      if (daewoonData?.list) {
        for (let i = 0; i < daewoonData.list.length; i++) {
          if (daewoonData.list[i].age <= currentAge) {
            currentDaewoonIndex = i;
          }
        }
      }
      // 2-3) li에 .active 다시 셋팅
      const daewoonLis = document.querySelectorAll("#daewoonList li");
      daewoonLis.forEach(li => li.classList.remove("active"));
      if (daewoonLis[currentDaewoonIndex]) {
        daewoonLis[currentDaewoonIndex].classList.add("active");
      }

      // 3) 세운 리스트도 다시 그림
      updateSewoonItem(refDate);  // (이미 구현돼 있다고 가정)
      // 3-1) 세운 중 올해(or refDate) 항목에 .active 주기

      const ipChun = findSolarTermDate(refDate.getFullYear(), 315);
      const displayYear = (refDate < ipChun) ? refDate.getFullYear() - 1 : refDate.getFullYear();

      const sewoonLis = document.querySelectorAll("#sewoonList li");
      sewoonLis.forEach(li => {
        li.classList.remove("active");
        // li 안에 있는 ".dyear" 스팬(연도 표기)를 비교해 활성화
        const yearEl = li.querySelector(".dyear");
        if (!yearEl) return;
        const yearNum = Number(yearEl.innerText);
        if (yearNum === displayYear) {
          li.classList.add("active");
        }
      });

      // 4) 월운(절기) 리스트도 다시 그림
      //    (가령 #mowoonList를 12개 절기로 만들어 뒀다면 refDate 기준으로 해당 절기 .active)
      //    아래는 일례일 뿐
      const boundariesArr = getSolarTermBoundaries(displayYear);
      // refDate가 어느 절기에 속하는지 찾는다
      let currentTermIndex = 0;
      for (let i = 0; i < boundariesArr.length - 1; i++) {
        if (refDate >= boundariesArr[i].date && refDate < boundariesArr[i+1].date) {
          currentTermIndex = i;
          break;
        }
      }
      if (refDate >= boundariesArr[boundariesArr.length - 1].date) {
        currentTermIndex = boundariesArr.length - 1;
      }
      // 4-1) li에 .active 다시 셋팅
      const mowoonLis = document.querySelectorAll("#mowoonList li");
      requestAnimationFrame(function(){
      mowoonLis.forEach(li => li.classList.remove("active"));
        if (mowoonLis[currentTermIndex]) {
          mowoonLis[currentTermIndex].classList.add("active");
        }
      });

      // 5) 일운 달력도 다시 만든 뒤, 그 안에서 refDate 날짜를 찾아 .active 하기
      //    (예: generateDailyFortuneCalendar -> #iljuCalender에 html 삽입)
      updateMonthlyFortuneCalendar(boundariesArr[currentTermIndex].name, displayYear);

      // 그리고 방금 생성된 <td>들 중에서 refDate.getDate()가 일치하는 곳에 .active
      const dayCells = document.querySelectorAll("#iljuCalender table td");
      dayCells.forEach(td => {
        td.classList.remove("active");
        // td 안에 있는 날짜(예: <span>15일</span>) 파싱
        const dayEl = td.querySelector(".ilwoonday span");
        if (dayEl) {
          const dayText = dayEl.innerText.replace("일", ""); // "15"라는 숫자만 추출
          const dayNum = parseInt(dayText, 10);
          if (dayNum === refDate.getDate()) {
            td.classList.add("active");
          }
        }
      });
      
      function clearHyphenElements(rootEl) {
        const root = typeof rootEl === 'string'
          ? document.querySelector(rootEl)
          : rootEl;
        if (!root) return;
      
        const classesToRemove = [
          "b_green","b_red","b_white","b_black","b_yellow","active"
        ];
      
        // 1) hanja_con 내부 <p> (음양) 검사
        root.querySelectorAll('li.siju_con4 .hanja_con > p')
          .forEach(p => {
            if (p.textContent.trim() === "-") {
              // 부모 .hanja_con 에서 클래스 제거
              const hanja = p.parentElement;
              hanja.classList.remove(...classesToRemove);
              // p 자신도 제거
              p.classList.remove(...classesToRemove);
            }
          });
      
        // 2) 그 외 direct <p> (한글, 십신, 운성) 검사
        root.querySelectorAll('li.siju_con4 > p')
          .forEach(p => {
            if (p.textContent.trim() === "-") {
              p.classList.remove(...classesToRemove);
            }
          });
      }
      
      // 사용 예시: body 전체 하이픈 요소 초기화
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
    
        // “오늘”의 로컬 날짜·시간 (YYYY-MM-DDTHH:mm) 포맷으로 생성
        const now = new Date();
        const localNow = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16);
    
        picker.value = localNow;
        return false;
      }
      return true;
    }
    
    // 버튼 클릭 시 검증 로직만 실행하면, 잘못된 건 위에서 바로 오늘로 리셋됩니다.
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
    
      // 1-1) 페이드 아웃
      containers.forEach(c => c.style.opacity = '0');
    
      // 1-2) transitionend 이벤트 한 번만 듣고 업데이트
      const onEnd = e => {
        if (e.propertyName !== 'opacity') return;
        containers.forEach(c => c.removeEventListener('transitionend', onEnd));
    
        // 실제 로직
        updateFortuneWithManualHour(manualSiju);

        updateFunc(refDate);
    
        // 1-3) 다음 프레임에 페이드 인
        requestAnimationFrame(() =>
          containers.forEach(c => c.style.opacity = '1')
        );
      };
      // 첫 컨테이너에만 붙이면 충분합니다
      containers[0].addEventListener('transitionend', onEnd);
    }
    
    // 2) renderSijuButtons()에 색상 클래스 다시 추가
    // 1) 최초 버튼 렌더링 한 번만
    

    // 2) 시간 문자열 파싱 유틸
    function parseTimeStr(tstr) {
      return {
        hour:   parseInt(tstr.slice(0,2), 10),  // "00"→0, "12"→12
        minute: parseInt(tstr.slice(2),   10),
      };
    }

    // 4) 버튼 렌더링 & 토글 적용
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

      // innerHTML 클리어는 최초 한 번만
      if (!initialized) {
        hourListEl.innerHTML = "";
        sijuList.forEach((siju, idx) => {
          const lbl = labels[idx];
          // 버튼 생성
          const btn = document.createElement("button");
          btn.id        = `siju-btn-${idx}`;
          btn.className = "black_btn";
          btn.textContent = `${lbl}시 (${siju})`;


          btn.addEventListener("click", () => {
            // ── 토글 로직 시작 ──
            if (btn.classList.contains("active")) {
              // 1) active 해제
              checkOption.style.display = 'none';
              btn.className = "black_btn";
              btn.textContent = `${lbl}시 (${siju})`;
              btn.classList.remove("b_green","b_red","b_white","b_black","b_yellow","active");

              // 2) 각 컨테이너와 그 안의 <p>에 남아있는 b_* 와 active 클래스를 한꺼번에 제거
              const classesToRemove = [
                "b_green","b_red","b_white","b_black","b_yellow","active"
              ];
              
              // .siju_con 와 div.hanja_con 모두 처리
              document.querySelectorAll('.siju_con, div.hanja_con').forEach(container => {
                // 컨테이너 자체에서 클래스 제거
                container.classList.remove(...classesToRemove);
              
                // 내부 <p> 요소들의 클래스 제거
                container.querySelectorAll('p').forEach(p => {
                  p.classList.remove(...classesToRemove);
                });
              });
              
          
              // 2) 시간 미확인 모드 복귀
              isTimeUnknown = true;
              document.getElementById("inputBirthtime").value = "";

              
          
              // 3) 시·지 영역은 업데이트 함수로 클리어
              updateStemInfo("Ht", { gan: "-", ji: "-" }, baseDayStem);
              updateBranchInfo("Hb", "-", baseDayStem);
          
              // 4) 나머지 요소는 하이픈으로 클리어
              ["Hb12ws","Hb12ss"].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.textContent = "-";
              });
          
              // 5) 명운/설명 영역도 기본값 리셋
              const resetData = {
                correctedDate,
                year, month, day,
                hour: null, minute: null,
                yearPillar, monthPillar, dayPillar,
                hourPillar: null,
                gender
              };
              const resetResult = getMyounPillarsVr(resetData, refDate);
              updateMyowoonSection(resetResult);
              updateExplanDetail(resetResult, hourPillar);
              registerMyowoonMoreHandler(hourSplit = null);
          
              return;  // 활성화 로직 생략
            }
            // ── 토글 로직 끝 ──
            checkOption.style.display = 'flex';
            // 2-1) 기타 버튼 모두 리셋
            sijuList.forEach((_, i) => {
              const b = document.getElementById(`siju-btn-${i}`);
              if (!b) return;
              b.className = "black_btn";
              b.textContent = `${labels[i]}시 (${sijuList[i]})`;
              b.classList.remove("b_green","b_red","b_white","b_black","b_yellow","active");
            });

            // 2-2) 이 버튼만 활성화 + 색상
            btn.classList.add("active");
            btn.textContent = `${lbl}시 적용중`;
            if (["인","묘"].includes(lbl))      btn.classList.add("b_green");
            else if (["사","오"].includes(lbl)) btn.classList.add("b_red");
            else if (["신","유"].includes(lbl)) btn.classList.add("b_white");
            else if (["자","해"].includes(lbl)) btn.classList.add("b_black");
            else                                 btn.classList.add("b_yellow");

            // 2-3) 시간 파싱 & correctedDate 세팅
            const { hour, minute } = parseTimeStr(timeMap[lbl]);
            const orig = new Date(birthYear, birthMonth - 1, birthDay, hour, minute);
            const corr = adjustBirthDateWithLon(orig, birthPlaceInput, isPlaceUnknown);
            correctedDate = (corr instanceof Date && !isNaN(corr.getTime())) ? corr : orig;
            document.getElementById("inputBirthtime").value = timeMap[lbl];

            // 2-4) 시간 확인 모드로 전환
            isTimeUnknown = false;

            // 2-5) 명운 예측 & UI 업데이트
            const myData2 = {
              correctedDate,
              year, month, day,
              hour, minute,
              yearPillar, monthPillar, dayPillar,
              hourPillar: siju,
              gender
            };
            const myResult = getMyounPillarsVr(myData2, refDate);
            updateMyowoonSection(myResult);
            updateExplanDetail(myResult, siju);
            manualOverride = true;
            const hourSplit2 = splitPillar(siju);
            updateOriginalSetMapping(daySplitGlobal, hourSplit2);
            registerMyowoonMoreHandler(hourSplit2)
            
            // 2-6) 부드러운 업데이트 (Day Pillar 포함)
            smoothUpdate(siju);
            hourPillar = siju;
            console.log(hourPillar);

            
          });
          
          hourListEl.appendChild(btn);
        });
        initialized = true;
      }
    }
    // updateFunc(refDate);
    // 렌더링 한 번 실행
    //renderSijuButtons();


    const birthYear  = year;
    const birthMonth = month;
    const birthDay   = day;

    // 1) 전날 계산 헬퍼
    function updateDayPillarByPrev(baseDate = correctedDate) {
      // ① baseDate에서 “년·월·일”만 자정(0시)으로 추출
      const d = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
      // ② 전날로 이동
      d.setDate(d.getDate() - 1);

      // ③ 간지 계산
      const dayPillar = getDayGanZhi(d);
      const split     = splitPillar(dayPillar);

      // ④ 화면 업데이트 (split.gan 을 기준으로)
      updateStemInfo("Dt", split, split.gan);
      updateBranchInfo("Db", split.ji, split.gan);
      setText("Db12ws", getTwelveUnseong(split.gan, split.ji));
      setText("Db12ss", getTwelveShinsal(baseYearBranch, split.ji));
    }

    // 2) 같은 날 계산 헬퍼
    function updateDayPillarByCurr(baseDate = correctedDate) {
      // ① baseDate에서 “년·월·일”만 자정(0시)으로 추출
      const d = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());

      // ② 간지 계산
      const dayPillar = getDayGanZhi(d);
      const split     = splitPillar(dayPillar);

      // ③ 화면 업데이트
      updateStemInfo("Dt", split, split.gan);
      updateBranchInfo("Db", split.ji, split.gan);
      setText("Db12ws", getTwelveUnseong(split.gan, split.ji));
      setText("Db12ss", getTwelveShinsal(baseYearBranch, split.ji));
    }
    
    // Day Pillar 계산 (시간 제거, 날짜만)
    function updateDayPillar(manualSiju) {
      // ① correctedDate의 날짜만 추출 (시간 모두 0시로)
      const cd = correctedDate instanceof Date && !isNaN(correctedDate.getTime())
        ? correctedDate
        : new Date(birthYear, birthMonth-1, birthDay);
      const base = new Date(cd.getFullYear(), cd.getMonth(), cd.getDate());
    
      // ② 자·축(子,丑) 시는 전날로
      const branch = manualSiju.charAt(1);
      const useInsi = document.getElementById('insi').checked;
      if (["자","축"].includes(branch) && useInsi) {
        base.setDate(base.getDate() - 1);
      }
    
      // ③ 순수 날짜(base)로 Day GanZhi 계산
      const dayPillar = getDayGanZhi(base);
      const split     = splitPillar(dayPillar);
      updateStemInfo("Dt", split, baseDayStem);
      updateBranchInfo("Db", split.ji, baseDayStem);
      setText("Db12ws", getTwelveUnseong(baseDayStem, split.ji));
      setText("Db12ss", getTwelveShinsal(baseYearBranch, split.ji));
    }
    
    // 2) updateFortuneWithManualHour 내부에서 orig을 넘기도록 변경
    function updateFortuneWithManualHour(manualSiju) {
      manualOverride2 = true;
      // 1) 시간 파싱 & orig 생성
      const bt   = document.getElementById('inputBirthtime').value;
      const hr   = parseInt(bt.slice(0,2),10);
      const mi   = parseInt(bt.slice(2),10);
      const orig = new Date(birthYear, birthMonth - 1, birthDay, hr, mi);
    
      // 2) 시차 보정 (Hour Pillar 용)
      const corr = adjustBirthDateWithLon(orig, birthPlaceInput, isPlaceUnknown);
      const newCorrected = (corr instanceof Date && !isNaN(corr.getTime())) ? corr : orig;
    
      // 3) Hour Pillar 업데이트 (기존 로직)
      const split = splitPillar(manualSiju);
      updateStemInfo("Ht", split, baseDayStem);
      updateBranchInfo("Hb", split.ji, baseDayStem);
      setText("Hb12ws", getTwelveUnseong(baseDayStem, split.ji));
      setText("Hb12ss", getTwelveShinsal(baseYearBranch, split.ji));
    
      // —————————————— 여기서부터 수정된 부분 ——————————————
    
      // 4) Day Pillar 계산에 쓰이는 correctedDate를 잠시 orig으로 덮어쓰기
      const prevCorrectedDate = correctedDate;
      correctedDate = newCorrected;
    
      // 5) 자·축(子,丑) 시는 전날 로직과, 기준 통일된 updateDayPillar 호출
      const useInsiMode = document.getElementById('insi').checked;
      const branchName  = manualSiju.charAt(1);
      if ((branchName === "자" || branchName === "축") && useInsiMode) {
        updateDayPillarByPrev(correctedDate);
      } else {
        updateDayPillarByCurr(correctedDate);
      }
      
      // 6) 마지막에 한번만, 기준이 통일된 updateDayPillar 호출
      if (!manualOverride2) {
        updateDayPillar(manualSiju);
      }
    
      // 7) 원래 correctedDate 복원
      correctedDate = prevCorrectedDate;
    
      // —————————————— 수정 끝 ——————————————
    
      // 8) UI 업데이트
      updateColorClasses();
      updateFunc(newCorrected);

      manualOverride2 = false;
    }

    globalState.originalTimeUnknown = isTimeUnknown;
    if (globalState.originalTimeUnknown) {  
      renderSijuButtonsVr = renderSijuButtons();
    }

    document.querySelectorAll('input[name="timeChk02"]').forEach(function(radio) {
      radio.addEventListener("change", function() {
        // 결과창과 계산용 라디오 동기화
        const selectedValue = this.value;
        const calcRadio = document.querySelector('input[name="time2"][value="' + selectedValue + '"]');
        if (calcRadio) {
          calcRadio.checked = true;
        }

        // 피커에서 기준 날짜(refDate)를 가져옴
        const picker = isCoupleMode ? getCurrentPicker2() : getCurrentPicker();
        const rawRefDate = (picker && picker.value) ? new Date(picker.value) : new Date();

        const radioDate = getRadioBasedDate(rawRefDate);

        const branchIndex = getHourBranchIndex(correctedDate);
        const branchName = Jiji[branchIndex];

        if (branchName === "자" || branchName === "축") {
          radioFunc(radioDate);
        }
        //radioFunc(radioDate);
        updateFunc(rawRefDate);

        function clearHyphenElements(rootEl) {
          const root = typeof rootEl === 'string'
            ? document.querySelector(rootEl)
            : rootEl;
          if (!root) return;
        
          const classesToRemove = [
            "b_green","b_red","b_white","b_black","b_yellow","active"
          ];
        
          // 1) hanja_con 내부 <p> (음양) 검사
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
        
          // 2) 그 외 direct <p> (한글, 십신, 운성) 검사
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
          // 먼저 묘운 결과를 최신 refDate 기준으로 재계산
          const newResult = getMyounPillars(myData, rawRefDate, selectedValue);
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

    
  });

  function startModify(index) {
    const savedList = JSON.parse(localStorage.getItem("myeongsikList")) || [];
    const selected = savedList[index];
    if (!selected) return;
    currentModifyIndex = index;
    isModifyMode = true;
    const snapshot = {
      birthday: selected.birthday,
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
      correctedDate: selected.fixedCorrectedDate,
      //createdAt: selected.Date.now()
      
    };
    originalDataSnapshot = JSON.stringify(snapshot);
    
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

    restoreCurrentPlaceMapping(selected);

    startModify(index);

    groupEctWrap.style.display = 'none';
    inputMeGroupEct.value = '';
  
    // 화면 전환
    document.getElementById("inputWrap").style.display = "block";
    document.getElementById("resultWrapper").style.display = "none";
    document.getElementById("aside").style.display = "none";
  
    // 입력값 채우기
    document.getElementById("inputName").value = selected.name;
    document.getElementById("inputBirthday").value = selected.birthday;
    document.getElementById("inputBirthtime").value = selected.birthtime;
    document.getElementById("inputBirthPlace").value = selected.birthPlace;
  
    // 성별
    if (selected.gender === "남") {
      document.getElementById("genderMan").checked = true;
      document.getElementById("genderWoman").checked = false;
    } else {
      document.getElementById("genderMan").checked = false;
      document.getElementById("genderWoman").checked = true;
    }
  
    // 출생시간 모름 체크박스 복원
    const timeCheckbox = document.getElementById("bitthTimeX");
    const timeInput = document.getElementById("inputBirthtime");
    timeInput.addEventListener('change', () => {
      // 기존 보정시 고정 해제
      //fixedCorrectedDate = null;
    });
    isTimeUnknown = selected.isTimeUnknown === true;

    timeCheckbox.checked = isTimeUnknown;

    if (isTimeUnknown) {
      timeInput.value = ""; // 계산용 값 (숨겨져 있음)
      timeInput.disabled = true;
    } else {
      timeInput.value = selected.birthtime || "";
      timeInput.disabled = false;
    }

    // 출생지 모름 체크박스 복원
    const placeCheckbox = document.getElementById("bitthPlaceX");
    const placeInput = document.getElementById("inputBirthPlace");
    placeInput.addEventListener('change', () => {
      // 사용자가 직접 텍스트를 바꿨다면 보정시 초기화
      //fixedCorrectedDate = null;
    });
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

    ensureGroupOption(selected.group);
    document.getElementById("inputMeGroup").value = selected.group || "미선택";
    updateMeGroupOption(selected.group);   // ← 여기서 selected를 넘겨줍니다


    const myowoonBtn = document.getElementById("myowoonMore");
    myowoonBtn.classList.remove("active");
    myowoonBtn.innerText = "묘운력(운 전체) 상세보기";
  
    // 수정 모드 플래그 설정
    currentModifyIndex = index;

    // 버튼 텍스트 변경
    const calcBtn = document.getElementById("calcBtn");
    calcBtn.textContent = "수정하기";
  
    // 이름 커서 이동
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
    // 이후 기존 코드: date.getHours() 등
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes}`;
  }
  
  function makeNewData() {
    let correctedDate = fixedCorrectedDate;
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

    //console.log('cityLon', cityLon);

    // monthType: "양력", "음력", "음력(윤달)" 등의 값이 있어야 함
    const monthType = document.getElementById("monthType").value;

    let year = parseInt(birthday.substring(0, 4), 10);
    let month = parseInt(birthday.substring(4, 6), 10);
    let day = parseInt(birthday.substring(6, 8), 10);
    const hour = isTimeUnknown ? 4 : parseInt(birthtimeRaw.substring(0, 2), 10);
    const minute = isTimeUnknown ? 30 : parseInt(birthtimeRaw.substring(2, 4), 10);

    const usedBirthPlace = isPlaceUnknown ? "서울특별시" : birthPlaceInput;
    const savedBirthPlace = isPlaceUnknown ? "" : birthPlaceInput;

    const displayHour = isTimeUnknown ? "-" : birthtimeRaw.substring(0, 2);
    const displayMinute = isTimeUnknown ? "-" : birthtimeRaw.substring(2, 4);
    //const displayBirthtime = `${displayHour}:${displayMinute}`;

    // 음력 생일 및 양력/음력 변환
    let lunarDate = null;
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
      // ① 입력창 비우기
      document.getElementById("inputBirthtime").value = "";
      // ② 시주 영역 “–” 로 채우기
      updateStemInfo("Ht", { gan: "-", ji: "-" }, baseDayStem);
      updateBranchInfo("Hb", "-", baseDayStem);
      // ③ 12운성, 12신살도 “–”
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

  // 수정하기 버튼 눌렀을 때
  document.getElementById("calcBtn").addEventListener("click", function () {

    // 1) 새로 수집할 데이터 만들어오기
    const newData = makeNewData();
    latestMyeongsik = newData;

    //console.log('birthPlaceLongitude', newData.birthPlaceLongitude);

    // 2) 즐겨찾기 체크 상태 읽어서 newData에 추가
    const favCheckbox = document.getElementById('topPs');
    newData.isFavorite = favCheckbox.checked;

    // 3) 기존 리스트 불러오기
    const list = JSON.parse(localStorage.getItem("myeongsikList")) || [];

    // 4) 수정 모드인지 확인
    if (typeof currentModifyIndex === "number") {
      // 변경 사항이 없으면 확인창
      const currentDataStr = JSON.stringify(newData);
      if (currentDataStr === originalDataSnapshot) {
        const confirmSave = confirm("수정된 부분이 없습니다. 이대로 저장하시겠습니까?");
        if (!confirmSave) return;
      }

      // 5) 리스트에 덮어쓰기
      list[currentModifyIndex] = newData;

      // 6) 로컬스토리지에 한 번에 저장
      localStorage.setItem("myeongsikList", JSON.stringify(list));

      // 7) UI 갱신
      loadSavedMyeongsikList();
      alert("명식이 수정되었습니다.");

      // 8) 모드 초기화
      isModifyMode = false;
      originalDataSnapshot = "";
      currentModifyIndex = null;
      updateSaveBtn();

      const savedList = JSON.parse(localStorage.getItem("myeongsikList")) || [];
      if (savedList.length >= 2) {
        coupleModeBtnV.style.display = '';   
      } else {
        coupleModeBtnV.style.display = 'none'; 
      }

      // 9) 화면 전환
      document.getElementById("inputWrap").style.display = "none";
      document.getElementById("resultWrapper").style.display = "block";
      backBtn.style.display = '';
    }
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

  const selectEl       = document.getElementById('inputMeGroup');
  const manageBtn      = document.getElementById('inputMeGroupSet');
  const modalSet       = document.getElementById('inputMeGroupSetModal');
  const modalCloseBtn  = document.getElementById('modalCloseBtn');
  const listContainer  = document.getElementById('inputMeGroupSetUl');
  const ectInput       = document.getElementById('inputMeGroupEct');
  const addBtn         = document.getElementById('inputMeGroupAdd');

  const GROUP_STORAGE_KEY    = 'inputMeGroupOptions';

  // 1) 로컬스토리지에서 불러와 <select> 재생성
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

  // 2) 현재 <select> 옵션을 저장
  function saveOptionsToStorage() {
    const values = Array.from(selectEl.options).map(o => o.value);
    localStorage.setItem(GROUP_STORAGE_KEY, JSON.stringify(values));
  }

  // 3) 모달 리스트(<ul>) 렌더링
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

  // 4) 페이지 로드 시 <select> 초기화
  loadOptionsFromStorage();

  // 5) 관리 버튼 → 모달 열기 (최신 <select> 기반으로 리스트 렌더링)
  manageBtn.addEventListener('click', e => {
    e.preventDefault();
    loadOptionsFromStorage();
    populateList();
    modalSet.style.display = 'block';
  });

  // 6) 모달 닫기 버튼 → 모달 숨기기
  modalCloseBtn.addEventListener('click', e => {
    e.preventDefault();
    modalSet.style.display = 'none';
  });

  // 7) 추가 버튼 → 옵션 추가 & 저장 & 알럿
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
    // “기타입력” 옵션 이전에 삽입
    const newOpt = document.createElement('option');
    newOpt.value = val;
    newOpt.text  = val;
    const ectOpt = selectEl.querySelector('option[value="기타입력"]');
    selectEl.add(newOpt, ectOpt);
    ectInput.value = '';
    saveOptionsToStorage();
    alert('키워드가 추가되었습니다.');
  });

  // 8) 삭제 버튼 → confirm → 옵션 & li 제거 & 저장
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

  // 9) Sortable 초기화 (드래그 순서 → <select> 순서 동기화 → 저장 → UI 갱신)
  new Sortable(listContainer, {
    handle: '.drag_btn_zone2',
    animation: 150,
    onEnd: () => {
      // 1) 현재 UL 의 <li> 순서대로 두 번째 자식(span)의 텍스트(값)를 배열로
      const newOrder = Array.from(listContainer.children)
        .map(li => li.children[1].textContent.trim());
  
      // 2) 전체 옵션 재구성 (맨 앞 '미선택', 뒤 '기타입입력' 고정)
      const allOptions = ['미선택', ...newOrder, '기타입력'];
  
      // 3) 선택값 보존
      const prevValue = selectEl.value;
  
      // 4) <select> 재빌드
      selectEl.innerHTML = '';
      allOptions.forEach(val => {
        const opt = document.createElement('option');
        opt.value = val;
        opt.text  = (val === '기타입입력')
                    ? '기타입력(항목추가)'
                    : val;
        selectEl.add(opt);
      });
  
      // 5) 이전 선택값 복원
      selectEl.value = prevValue;
  
      // 6) 저장 & 모달 리스트 갱신
      saveOptionsToStorage();
      populateList();
    }
  });
  

  function setupSearchFeature() {
    const searchTextInput = document.getElementById("searchText");
    const searchSelect = document.getElementById("searchSelect");
    const searchBtn = document.getElementById("searchBtn");
  
    // 🔁 필터링 함수
    function filterMyeongsikList(keyword, category) {
      const allItems = document.querySelectorAll("aside .list_ul > li");
  
      allItems.forEach(li => {
        const nameEl = li.querySelector(".name_age");
        const ganziEl = li.querySelector(".ganzi");
        const birthdayEl = li.querySelector(".birth_day_time");
  
        // 원본 복원
        if (nameEl?.dataset.original) nameEl.innerHTML = nameEl.dataset.original;
        if (ganziEl?.dataset.original) ganziEl.innerHTML = ganziEl.dataset.original;
        if (birthdayEl?.dataset.original) birthdayEl.innerHTML = birthdayEl.dataset.original;
  
        let targetText = "";
        if (category === "이름") targetText = nameEl?.innerText || "";
        else if (category === "간지") targetText = ganziEl?.innerText || "";
        else if (category === "생일") targetText = birthdayEl?.innerText || "";
  
        // 🔥 띄어쓰기 무시 정규식으로 하이라이트 처리
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
  
    // 🔁 전체 복원 함수
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
  
    // 📥 실시간 입력 시 필터링
    searchTextInput.addEventListener("input", function () {
      const keyword = this.value.trim();
      const category = searchSelect.value;
  
      if (keyword === "") restoreMyeongsikList();
      else filterMyeongsikList(keyword, category);
    });
  
    // 🔍 버튼 클릭 시 필터링
    searchBtn.addEventListener("click", function (e) {
      e.preventDefault();
      const keyword = searchTextInput.value.trim();
      const category = searchSelect.value;
  
      if (keyword === "") restoreMyeongsikList();
      else filterMyeongsikList(keyword, category);
    });
  
    // 📌 select 바뀔 때도 필터링 반영
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

  // 상태 세팅 함수
  function setExplanState(visible) {
    explanEl.style.display = visible ? "block" : "none";
    explanBtn.innerText = visible ? "묘운 설명 접기" : "묘운 설명 보기";
  }

  // 1) 초기 로드 시 저장된 값으로 복원 (없으면 숨김)
  const explansaved = localStorage.getItem(explanSTORAGE_KEY);
  const isVisible = explansaved === "true";
  setExplanState(isVisible);

  // 2) 클릭 시 토글 + 저장
  explanBtn.addEventListener("click", function () {
    // 현재 보이는 지 여부 판단
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
    // 1) wrapper 클래스 토글
    app.classList.toggle('hide-12', hidden);

    // 2) 레이블 텍스트 갱신
    label.textContent = hidden
      ? '십이운성 · 십이신살 보이기'
      : '십이운성 · 십이신살 가리기';

    // 3) checkbox 상태 & localStorage 저장
    checkbox.checked = hidden;
    localStorage.setItem(STORAGE_KEY, hidden ? 'hidden' : 'visible');
  }

  // — 초기값 복원
  const stored = localStorage.getItem(STORAGE_KEY);
  applyState(stored === 'hidden');

  // — 토글할 때마다 apply
  checkbox.addEventListener('change', () => {
    applyState(checkbox.checked);
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