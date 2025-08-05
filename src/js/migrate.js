// js/migrate.js

import { adjustBirthDateWithLon } from './dateUtils.js';
import { getDaewoonData } from './lucky.js';
import { state } from './state.js';
import { getTenGodForBranch } from './core.js';
import { getYearGanZhi, getMonthGanZhi, getDayGanZhi, getHourGanZhi } from './calc.js';
import KoreanLunarCalendar from 'korean-lunar-calendar';

// 마이그레이션을 위한 상수
const CURRENT_SCHEMA_VERSION = 2;
const STORAGE_KEY21 = 'savedMyeongSikList';

/**
 * 로컬스토리지에 저장된 프로필 스키마를 최신 버전으로 마이그레이션
 */
export function migrateAllProfiles() {
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
      // 최신 스키마면 건너뜀
      if (profile.schemaVersion === CURRENT_SCHEMA_VERSION) return;

      // 원본 및 보정된 생년월일을 계산
      const originalDate  = new Date(profile.birthDate);
      const correctedDate = adjustBirthDateWithLon(
        originalDate,
        profile.birthPlaceLongitude,
        profile.isPlaceUnknown
      );
      // 대운 데이터 재계산
      const daewoonData = getDaewoonData(
        profile.gender,
        originalDate,
        correctedDate
      );

      // 프로필에 업데이트
      profile.correctedDate  = correctedDate.toISOString();
      profile.daewoonData    = daewoonData;
      profile.schemaVersion  = CURRENT_SCHEMA_VERSION;

      localStorage.setItem(key, JSON.stringify(profile));
    });
}

/**
 * 저장된 명식 목록에 누락된 경도를 보강하는 마이그레이션
 */
export function migrateStoredRecords() {
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
    if (typeof rec.lon === 'number' && !isNaN(rec.lon)) return rec;

    const nameKey  = rec.placeName;
    const shortKey = nameKey.split(' ')[0];
    const lon = state.cityLongitudes[nameKey] ?? state.cityLongitudes[shortKey];
    if (typeof lon === 'number') {
      rec.lon = lon;
      updated = true;
    }
    return rec;
  });

  if (updated) {
    localStorage.setItem(STORAGE_KEY21, JSON.stringify(migrated));
    console.info('명식 목록 마이그레이션 완료: lon 속성 보강');
  }
}

/**
 * 프로필의 tenGods 및 간지 속성을 보강하는 마이그레이션
 */
export function migrateTenGods() {
  const KEY = 'myProfiles';
  const data = JSON.parse(localStorage.getItem(KEY) || '[]');
  let touched = false;
  const calendar = new KoreanLunarCalendar();

  data.forEach(p => {
    // 십신 데이터 업데이트
    ['yearPillar','monthPillar','dayPillar','hourPillar'].forEach(k => {
      const ganji = p[k];
      if (!ganji) return;
      const stem   = ganji.charAt(0);
      const branch = ganji.charAt(1);
      const newTG  = getTenGodForBranch(branch, stem);
      if (!p.tenGods) p.tenGods = {};
      if (p.tenGods[k] !== newTG) {
        p.tenGods[k] = newTG;
        touched = true;
      }
    });

    // 보정 일시 계산
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

    // 간지 재계산
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

      p.yearPillar  = getYearGanZhi(corrDate, corrDate.getFullYear());
      p.monthPillar = getMonthGanZhi(corrDate, state.selectedLon);
      p.dayPillar   = getDayGanZhi(corrDate);
      p.hourPillar  = getHourGanZhi(corrDate);

      if (p.isLunar) {
        p.lunarYearPillar  = getYearGanZhi(originalDate, originalDate.getFullYear());
        p.lunarMonthPillar = getMonthGanZhi(originalDate, state.selectedLon);
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

// 앱 초기화 시 자동 마이그레이션 실행
migrateAllProfiles();
migrateStoredRecords();
migrateTenGods();
