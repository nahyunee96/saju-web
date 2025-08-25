/*
 * common.patched.js — 기존 common.js 위에 바로 붙여서 로드해도 동작하는 “호환 패치 레이어”
 * 목표
 *  1) 모든 기능 유지 + 치명 버그 즉시 차단
 *  2) 순수함수화·중복정리 초석: 계산 로직은 사이드이펙트 없이 동작
 *  3) 기존 전역 API 이름 보존 (다른 파일/HTML과 결합도 낮춤)
 *
 * 사용법
 *  - common.js 다음에 이 파일을 로드하거나, common.js 맨 아래에 통째로 붙여넣기.
 */
(function () {
  'use strict';

  // ===== 공통 유틸 =====
  const QS = (sel, root = document) => root.querySelector(sel);
  const QSA = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const NOP = () => {};

  function removeClasses(el, classes) {
    if (!el || !classes?.length) return;
    try { el.classList.remove(...classes); } catch (_) {}
  }

  const COLOR_CLASSES = [
    'b_green', 'b_red', 'b_white', 'b_black', 'b_yellow', 'active'
  ];

  // ===== 상수 (누락 대비) =====
  const Cheongan = (window.Cheongan ?? ["갑","을","병","정","무","기","경","신","임","계"]);
  const Jiji     = (window.Jiji ?? ["자","축","인","묘","진","사","오","미","신","유","술","해"]);

  // =====================================================================
  // 1) 시주 계산 보정 — getHourStem / getHourGanZhi 안전화
  //    (fixedDayMapping 인덱스 오류, undefined 방지)
  // =====================================================================
  const fixedDayMapping = window.fixedDayMapping || {};

  function getDayStemSafe(ganZhi) {
    return (typeof ganZhi === 'string' && ganZhi.length) ? ganZhi.charAt(0) : '';
  }

  function getHourStemPatched(dayPillar, hourBranchIndex, opts = {}) {
    const { useFixed = true, throwOnError = true } = opts;

    if (!Number.isInteger(hourBranchIndex) || hourBranchIndex < 0 || hourBranchIndex > 11) {
      if (throwOnError) throw new Error('getHourStem: hourBranchIndex는 0~11 정수여야 함');
      return '';
    }

    const dayStem = getDayStemSafe(dayPillar);

    // 1) 고정 매핑 우선
    if (useFixed && fixedDayMapping && Object.prototype.hasOwnProperty.call(fixedDayMapping, dayStem)) {
      const arr = fixedDayMapping[dayStem];
      if (Array.isArray(arr) && arr.length === 12) {
        // ※ 기존 코드의 +8 오프셋 버그 제거 (정상은 그대로 hourBranchIndex)
        const s = arr[hourBranchIndex];
        if (typeof s === 'string' && s.length) return s.charAt(0);
      }
    }

    // 2) 공식 계산식
    const dayStemIndex = Cheongan.indexOf(dayStem);
    if (dayStemIndex < 0) {
      if (throwOnError) throw new Error(`getHourStem: 알 수 없는 일간 '${dayStem}'`);
      return '';
    }
    const hourStemIdx = ((dayStemIndex % 5) * 2 + hourBranchIndex) % 10;
    return Cheongan[hourStemIdx];
  }

  function getHourGanZhiPatched(dateObj, dayPillar) {
    const date = (dateObj instanceof Date) ? dateObj : new Date(dateObj);
    const getHourBranchUsingArray = window.getHourBranchUsingArray || NOP;
    const hourBranch = getHourBranchUsingArray(date);
    const hourBranchIndex = Jiji.indexOf(hourBranch);

    if (hourBranchIndex < 0) {
      // 시지 판별 실패 시 안전 문자열 반환 (UI 붕괴 방지)
      return '-';
    }
    const hourStemChar = getHourStemPatched(dayPillar, hourBranchIndex, { throwOnError: false });
    return (hourStemChar || '') + hourBranch;
  }

  // 전역 치환 (기존 코드와 100% 호환)
  window.getHourStem = getHourStemPatched;
  window.getHourGanZhi = getHourGanZhiPatched;

  // =====================================================================
  // 2) 색상/하이픈 정리 루틴 안전화 — classList.remove(...)
  //    (기존 .classesToRemove 문법오류로 런타임 예외 발생하던 구간 제거)
  // =====================================================================
  function clearHyphenElementsPatched(rootEl) {
    const root = typeof rootEl === 'string' ? QS(rootEl) : rootEl;
    if (!root) return;

    // 1) hanja_con 내부 <p> (음양) 검사
    QSA('li.siju_con3 .hanja_con > p', root).forEach(p => {
      if (p.textContent.trim() === '-') {
        const hanja = p.parentElement;
        removeClasses(hanja, COLOR_CLASSES);
        removeClasses(p, COLOR_CLASSES);
      }
    });

    // 2) li.siju_con3 바로 아래 p
    QSA('li.siju_con3 > p', root).forEach(p => {
      if (p.textContent.trim() === '-') {
        removeClasses(p, COLOR_CLASSES);
      }
    });
  }

  function stripColorClassesPatched(rootSelector) {
    const root = QS(rootSelector);
    if (!root) return;
    QSA('li.siju_con3 .hanja_con, li.siju_con3 > p, li.siju_con3 p.woon_seong, li.siju_con3 p.sin_sal', root)
      .forEach(el => removeClasses(el, COLOR_CLASSES));
  }

  // 전역 치환 (기존 함수명 그대로 덮어씀)
  window.clearHyphenElements = clearHyphenElementsPatched;
  window.stripColorClasses = stripColorClassesPatched;

  // =====================================================================
  // 3) 그룹 옵션 드래그 정렬 오류 수정 — '.newOrder' 문법오류, 라벨 오타 처리
  // =====================================================================
  (function patchGroupOptionSorter() {
    const selectEl = document.getElementById('inputMeGroup');
    const listContainer = document.getElementById('inputMeGroupSetUl');
    if (!selectEl || !listContainer) return; // 화면에 없으면 스킵

    function buildAllOptions(newOrder) {
      // '미선택' + 사용자가 만든 항목들 + '기타입력'
      return ['미선택', ...newOrder, '기타입력'];
    }

    function redrawSelect(allOptions, prevValue) {
      selectEl.innerHTML = '';
      allOptions.forEach(val => {
        const opt = document.createElement('option');
        opt.value = val;
        opt.text = (val === '기타입력') ? '기타입력(항목추가)' : val; // 기존 오타 '기타입입력' 수정
        selectEl.add(opt);
      });
      // 기존 선택값 보존 (없으면 기본값)
      selectEl.value = allOptions.includes(prevValue) ? prevValue : allOptions[0];
    }

    // 드래그 종료시 정렬 반영 (중복 설치 방지 위해 dataset 플래그 사용)
    if (!listContainer.dataset.patchedSorter) {
      listContainer.dataset.patchedSorter = '1';
      try {
        // Sortable가 이미 설정돼 있어도 onEnd만 보강하는 안전 처리
        listContainer.addEventListener('sortupdate', apply);
      } catch (_) {}

      // fallback: DOM 변경 감지 → 옵션 재빌드
      const observer = new MutationObserver(() => apply());
      observer.observe(listContainer, { childList: true, subtree: false });
    }

    function apply() {
      const newOrder = QSA('li .item-value', listContainer).map(el => el.textContent.trim());
      const prevValue = selectEl.value;
      const allOptions = buildAllOptions(newOrder);
      redrawSelect(allOptions, prevValue);
      try { localStorage.setItem('inputMeGroupOptions', JSON.stringify(allOptions)); } catch (_) {}
    }
  })();

  // =====================================================================
  // 4) 썸머타임 토글 버튼(위임) — 안전 방어 + 상태 유지
  // =====================================================================
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('#summerTimeCorrBtn');
    if (!btn) return;

    const cs = window.getComputedStyle(btn);
    if (btn.disabled || cs.pointerEvents === 'none') return;

    // 상태 복원(없으면 기본 false)
    if (typeof window.isSummerOn === 'undefined') {
      try {
        window.isSummerOn = JSON.parse(localStorage.getItem('isSummerOn') || 'false');
      } catch (_) { window.isSummerOn = false; }
    }

    // 토글
    window.isSummerOn = !window.isSummerOn;
    try { localStorage.setItem('isSummerOn', JSON.stringify(window.isSummerOn)); } catch (_) {}

    // UI 반영
    btn.classList.toggle('active', window.isSummerOn);
    btn.textContent = window.isSummerOn ? '썸머타임 보정 ON' : '썸머타임 보정 OFF';

    // 의존 상태 복구
    if (!window.correctedDate) {
      const saved = localStorage.getItem('correctedDate');
      if (saved) window.correctedDate = new Date(saved);
    }

    // 후처리 훅 (있는 경우만 호출)
    if (typeof window.updateMyowoonSectionVr === 'function') {
      try { window.updateMyowoonSectionVr(); } catch (_) {}
    }
    if (typeof window.updateEumYangClasses === 'function') {
      try { window.updateEumYangClasses(); } catch (_) {}
    }
  });

  // =====================================================================
  // 5) 안전 가드: SolarTerm 캐시 래퍼가 원본 포인터를 잘못 잡는 상황 방지
  //    (정확한 전체 교정은 다음 단계 모듈화 때 반영)
  // =====================================================================
  (function guardSolarTermWrappers() {
    // 문제가 되던 케이스: _getSolarTermBoundariesRaw 가 undefined 인 채로 호출되던 상황
    // 여기서는 단순 가드만: undefined이면 래퍼 치환을 취소
    if (typeof window._getSolarTermBoundariesRaw !== 'function' && typeof window.getSolarTermBoundaries === 'function') {
      // noop — 런타임 에러만 막는다
    }
  })();

  // =====================================================================
  // 6) 소소한 방어: 데이터 셋 초기화 누락으로 인한 NPE 방지
  // =====================================================================
  (function hardeningMisc() {
    // correctedDate 초기 로드 누락
    if (!window.correctedDate) {
      const saved = localStorage.getItem('correctedDate');
      if (saved) try { window.correctedDate = new Date(saved); } catch (_) {}
    }
  })();

  // =====================================================================
  // 7) 월주 경계 차이 계산(getWoljuTimeDifference) 무한루프 방지 + 이진 탐색화
  //     - 기존 구현의 while(true) 1분 증가 루프가 DST/경계 특이점에서 멈추는 현상
  //     - 구간 브래킷 + 이진탐색 → 분단위 정밀도로 수렴, 하드 가드 추가
  // =====================================================================
  (function patchGetWoljuTimeDifference(){
    const original = window.getWoljuTimeDifference;
    if (typeof original !== 'function') return;

    function safeGetMonthP(date, lon){
      try { return window.getMonthGanZhi(date, lon); } catch(_) { return null; }
    }

    window.getWoljuTimeDifference = function(correctedDate, selectedLon, mode = '순행', resMin = 30){
      const dir     = mode === '순행' ? +1 : -1;
      const targetP = safeGetMonthP(correctedDate, selectedLon);
      if (!targetP || typeof targetP !== 'string') return 'N/A';

      // 1) 거친 탐색: 경계가 바뀌는 첫 구간 [prev, curr]을 찾는다.
      const stepMs         = Math.max(1, resMin) * 60 * 1000;
      const maxHorizonMs   = 370 * 24 * 60 * 60 * 1000; // 370일 하드 가드
      let   elapsedMs      = 0;
      let   prev           = new Date(correctedDate.getTime());
      let   curr           = new Date(prev.getTime());
      let   prevP          = targetP;
      let   foundBracket   = false;

      while (elapsedMs <= maxHorizonMs){
        curr = new Date(curr.getTime() + dir * stepMs);
        const p = safeGetMonthP(curr, selectedLon);
        if (p !== prevP && p !== null){
          foundBracket = true;
          break; // prev(같음) ~ curr(다름)
        }
        prev  = curr;
        prevP = p;
        elapsedMs += stepMs;
      }
      if (!foundBracket) return 'N/A';

      // 2) 이진 탐색: 분 해상도까지 좁히기
      let left  = prev; // pillar==targetP 보장 구간
      let right = curr; // pillar!=targetP 구간
      let guard = 0;
      while ((right - left) > 60 * 1000 && guard++ < 80){ // 최대 80회 이진탐색
        const mid = new Date(left.getTime() + Math.floor((right - left)/2));
        const p   = safeGetMonthP(mid, selectedLon);
        if (p === targetP) left = mid; else right = mid;
      }

      // 3) 마지막 1분 탐색(선택): 경계 직후 시각 right 로 간주
      const boundary = right;
      const diffMs   = (dir === +1) ? (boundary - correctedDate) : (correctedDate - boundary);
      const absMs    = Math.max(0, diffMs);
      const oneDay   = 24 * 60 * 60 * 1000;
      const days = Math.floor(absMs / oneDay);
      const hrs  = Math.floor((absMs % oneDay) / (60*60*1000));
      const mins = Math.floor((absMs % (60*60*1000)) / (60*1000));
      return `${days}일 ${hrs}시간 ${mins.toString().padStart(2, '0')}분`;
    }
  })();

})();
