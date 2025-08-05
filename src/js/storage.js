// js/storage.js
import { state } from './state.js';

/**
 * 로컬스토리지에서 cityLongitudes를 불러와 state에 설정
 */
export function loadCityLongitudes() {
  state.cityLongitudes = JSON.parse(
    localStorage.getItem('cityLongitudes') || '{}'
  );
}

/**
 * state.cityLongitudes를 로컬스토리지에 저장
 */
export function saveCityLongitudes() {
  localStorage.setItem(
    'cityLongitudes',
    JSON.stringify(state.cityLongitudes)
  );
}

/**
 * 저장된 항목(item)에서 출생지 매핑과 보정일시를 state에 복원
 * @param {{ birthPlaceFull?: string, birthPlaceLongitude?: number, correctedDate?: string }} item
 */
export function restoreCurrentPlaceMapping(item) {
  if (item.birthPlaceFull && item.birthPlaceLongitude != null) {
    state.cityLongitudes[item.birthPlaceFull] = item.birthPlaceLongitude;
  }
  if (item.correctedDate) {
    state.fixedCorrectedDate = new Date(item.correctedDate);
  }
}
