// js/app.js
import { state } from './state.js';
import { loadCityLongitudes } from './storage.js';
import { initMapModal } from './map.js';

document.addEventListener('DOMContentLoaded', () => {
  loadCityLongitudes();
  initMapModal({
    placeBtn: document.getElementById('inputBirthPlace'),
    modal: document.getElementById('mapModal'),
    closeBtns: [
      document.getElementById('closeMap'),
      document.getElementById('mapCloseBtn')
    ],
    searchBox: document.getElementById('searchBox'),
    suggList: document.getElementById('suggestions')
  });

  // ...다른 모듈 초기화
});
