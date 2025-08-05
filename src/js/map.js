// js/map.js
import { state } from './state.js';
import { saveCityLongitudes } from './storage.js';
import * as L from 'https://unpkg.com/leaflet@1.9.3/dist/leaflet.esm.js';

/**
 * 지도 모달(initMapModal) 초기화
 * @param {{
 *   placeBtn: HTMLElement,
 *   modal: HTMLElement,
 *   closeBtns: HTMLElement[],
 *   searchBox: HTMLInputElement,
 *   suggList: HTMLElement
 * }} elems
 */

export function initMapModal({
  placeBtn, modal, closeBtns, searchBox, suggList
}) {
  placeBtn.addEventListener('click', () => {
    modal.style.display = 'block';
    if (!map) {
      map = L.map('map').setView([37.5665, 126.9780], 11);
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        { subdomains: 'abcd', attribution: '&copy; OSM &copy; CARTO' }
      ).addTo(map);
      setTimeout(() => map.invalidateSize(), 0);
    } else {
      setTimeout(() => {
        map.invalidateSize();
        map.setView([37.5665, 126.9780], 11);
      }, 0);
    }
    searchBox.focus();
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (!placeBtn.value || placeBtn.value === "출생지선택") {
        alert('도시를 입력하여 선택해주세요.');
        return;
      }
      modal.style.display = 'none';
      searchBox.value = '';
      suggList.innerHTML = '';
    });
  });

  // 검색창 입력 처리 (디바운스)
  searchBox.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    const q = searchBox.value.trim();
    if (!q) {
      suggList.innerHTML = '';
      return;
    }
    debounceTimer = setTimeout(fetchSuggestions, 500);
  });

  // OpenStreetMap Nominatim API 호출
  async function fetchSuggestions() {
    try {
      const url = new URL('https://nominatim.openstreetmap.org/search');
      url.search = new URLSearchParams({
        format: 'json',
        limit: '10',
        'accept-language': 'ko',
        viewbox: '-180,90,180,0',
        bounded: '1',
        q: searchBox.value.trim()
      });
      const res = await fetch(url);
      const data = await res.json();
      suggList.innerHTML = data.map(renderSuggestion).join('');
    } catch (err) {
      console.error(err);
      suggList.innerHTML = '<li>검색 중 오류 발생</li>';
    }
  }

  // 각 검색 결과 항목 렌더링
  function renderSuggestion(item) {
    const parts = item.display_name.split(',').map(s => s.trim());
    const fullName = (parts[0].match(/구$|군$/) && parts[1]?.match(/시$/))
      ? `${parts[1]} ${parts[0]}`
      : parts[0];
    return `
      <li
        data-name="${fullName}"
        data-lon="${item.lon}"
        data-lat="${item.lat}"
        style="padding:6px 8px;cursor:pointer;"
      >${fullName}</li>`;
  }

  // 결과 클릭 시 마커 표시 및 state 저장
  suggList.addEventListener('click', (e) => {
    if (e.target.tagName !== 'LI') return;
    const name = e.target.dataset.name;
    const lat  = parseFloat(e.target.dataset.lat);
    const lon  = parseFloat(e.target.dataset.lon);

    if (!marker) {
      marker = L.marker([lat, lon]).addTo(map);
    } else {
      marker.setLatLng([lat, lon]);
    }

    map.flyTo([lat, lon], 14, { duration: 0.5 });

    // state 업데이트
    state.cityLongitudes[name] = lon;
    state.cityLongitudes[name.split(' ')[0]] = lon;
    state.selectedLon = lon;
    state.fixedCorrectedDate = null;
    saveCityLongitudes();

    // UI 업데이트
    placeBtn.value = name;
    placeBtn.textContent = name;
    placeBtn.dataset.lon = lon;
    modal.style.display = 'none';
    searchBox.value = '';
    suggList.innerHTML = '';
  });
}
