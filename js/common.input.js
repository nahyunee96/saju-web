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

let isSummerOn = false;

let cityLongitudes = {};

let selectedLon = null;

window.__calcBusy = false;
window.__openDetailProgram = false;

const placeBtn  = document.getElementById('inputBirthPlace');
const modal = document.getElementById('mapModal');
const closeMap = document.getElementById('closeMap');
const mapCloseBtn = document.getElementById('mapCloseBtn');
const searchBox = document.getElementById('searchBox');
const suggList = document.getElementById('suggestions');
let map, marker, debounceTimer;

placeBtn.addEventListener('click', () => {
  modal.style.display = 'block';
  if (!map) {
    map = L.map('map').setView([37.5665, 126.9780], 11);
    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      { subdomains: 'abcd', attribution: '&copy; OSM &copy; CARTO' }
    ).addTo(map);
    
    setTimeout(() => map.invalidateSize(), 0); // 필수!
  } else {
    setTimeout(() => {
      map.invalidateSize();
      map.setView([37.5665, 126.9780], 11);
    }, 0);
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

mapCloseBtn.addEventListener('click', () => {
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
  placeBtn.dataset.lon = lon;
  selectedLon = parseFloat(placeBtn.dataset.lon);
});

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

