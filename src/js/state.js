// state.js
export const state = {
  // 사주·운 계산 관련 인덱스
  currentModifyIndex: null,
  currentDetailIndex: null,
  partnerIndex: null,
  modifyIndex: null,

  // 모드·플래그
  currentMode: null,
  isTimeUnknown: false,
  isPlaceUnknown: false,
  isCoupleMode: false,
  manualOverride: false,
  isPickerVer2: false,
  // …필요한 플래그 계속

  // 저장·원본 데이터 스냅샷
  originalDataSnapshot: null,
  originalDate: null,
  correctedDate: null,

  // 기저값
  baseDayStem: null,
  baseDayBranch: null,
  baseYearBranch: null,
  // …복사본 변형값들

  // 사용자 선택 출생지 위치
  cityLongitudes: {},
  selectedLon: null,
  fixedCorrectedDate: null,
  
  // 기타
  isSummerOn: false,
  savedMyeongsikList: [],
  myData: null,
  partnerData: null,
  currentMyeongsik: null,
  latestMyeongsik: null,
};

export const globalState = {
  birthYear: null,
  month: null,
  day: null,
  birthPlace: null,
  gender: null,
  daewoonData: null,
  sewoonStartYear: null,
  originalDayStem: null
};