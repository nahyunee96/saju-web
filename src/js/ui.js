// js/ui.js

import {
  getTwelveShinsal,
  getTwelveShinsal2,
  getTwelveShinsal8,
  getTwelveShinsal82
} from './core.js';
import {
  tenGodMappingForStems,
  tenGodMappingForBranches,
  stemMapping,
  branchMapping,
  branchMapping2,
  hiddenStemMapping,
  colorMapping,
  colorMapping2,
  Cheongan,
  Jiji,
  sexagenaryCycle,
  timeRanges
} from './core.js';
import { findSolarTermDate } from './solarTermCache.js';

export function updateEumYangClasses() {
  // 1) .hanja_con 케이스 (한자 엘리먼트와 eum/yang 텍스트 갱신)
  document.querySelectorAll('[id$="Hanja"]').forEach(hanjaEl => {
    // 2) id에서 "Hanja" 부분만 제거해서 접두사 얻기
    const prefix = hanjaEl.id.replace(/Hanja$/, '');
    const eumYangEl = document.getElementById(prefix + 'Eumyang');
    if (!eumYangEl) return;

    // 3) 텍스트(한자) 기준으로 info 찾기
    const char = hanjaEl.textContent.trim();
    let info = null;

    // 3-1) 천간 매핑
    info = Object.values(stemMapping).find(v => v.hanja === char);

    // 3-2) 못 찾으면 지지 매핑
    if (!info) {
      info = Object.values(branchMapping2).find(v => v.hanja === char);
    }
    if (!info) return;

    // 4) 기존 음/양 클래스는 항상 제거
    hanjaEl.classList.remove('eum', 'yang');

    // 5) 새로 붙이기
    const cls = info.eumYang === '양' ? 'yang' : 'eum';
    hanjaEl.classList.add(cls);

    // 6) Eumyang 텍스트 갱신
    eumYangEl.textContent = info.eumYang;
  });

  // 2) 일운 간지(천간/지지) span 케이스 (한글 약호로 매핑)
  document
  .querySelectorAll('li.ilwoon_ganji_cheongan span, li.ilwoon_ganji_jiji span')
  .forEach(el => {
    const isStem = !!el.closest('li.ilwoon_ganji_cheongan');
    const mapping = isStem ? stemMapping : branchMapping2;
    const char = el.textContent.trim();
    if (!char) return;

    const key = Object.keys(mapping).find(k => mapping[k].hanguelShort === char);
    if (!key) return;

    const info = mapping[key];
    el.classList.toggle('yang', info.eumYang === '양');
    el.classList.toggle('eum',  info.eumYang === '음');
  });

  // 3) .ganji_w 케이스 (요소 자체 텍스트 한자 기준)
  document.querySelectorAll('.ganji_w').forEach(el => {
    const char = el.textContent.trim();
    if (!char) return;

    // 우선 천간 매핑, 없으면 지지 매핑
    let info = null;
    let key  = Object.keys(stemMapping).find(k => stemMapping[k].hanja === char);
    if (key) {
      info = stemMapping[key];
    } else {
      key  = Object.keys(branchMapping2).find(k => branchMapping2[k].hanja === char);
      if (key) info = branchMapping2[key];
    }
    if (!info) return;

    el.classList.toggle('yang', info.eumYang === '양');
    el.classList.toggle('eum',  info.eumYang === '음');
  });
}

// --- 2. 설정 토글/체크박스 바인딩 ---
export function setupSettingToggles() {
  const bodyID = document.body;
  const settingMap = [
    {
      checkboxId: "jijangganDisplay",
      key: "showJijanggan",
      suffixes: ["Jj1", "Jj2"],
      toggle: (show) => toggleElementsBySuffix(["Jj1", "Jj2"], show),
    },
    {
      checkboxId: "hanguelDisplay",
      key: "showHanguel",
      suffixes: ["Hanguel"],
      toggle: (show) => {
        toggleElementsBySuffix(["Hanguel"], show);
        bodyID.classList.toggle("no_hanguel", !show);
      },
    },
    {
      checkboxId: "eumyangDisplay",
      key: "eumyangDisplay",
      toggle: (show) => {
        document.querySelectorAll(".eum_yang").forEach(el => {
          el.style.display = show ? "" : "none";
        });
      },
    },
    {
      checkboxId: "wolwoonDisplay",
      key: "showWolwoon",
      toggle: (show) => {
        const targetBox = document.getElementById("wongookLM");
        const wolwoonBox = document.querySelector(".lucky.wolwoon");
        if (targetBox) targetBox.classList.toggle("no_wolwoon", !show);
        if (wolwoonBox) wolwoonBox.style.display = show ? "block" : "none";
      },
    }
  ];

  function toggleElementsBySuffix(suffixes, show) {
    suffixes.forEach(suffix => {
      document.querySelectorAll(`[id$="${suffix}"]`).forEach(el => {
        el.style.display = show ? "block" : "none";
      });
    });
  }

  settingMap.forEach(({ checkboxId, key, toggle }) => {
    const checkbox = document.getElementById(checkboxId);
    if (!checkbox) return;
    const saved = localStorage.getItem(key);
    const shouldShow = saved === null ? true : saved === "true";
    checkbox.checked = shouldShow;
    toggle(shouldShow);

    checkbox.addEventListener("change", function () {
      const isChecked = this.checked;
      localStorage.setItem(key, isChecked.toString());
      toggle(isChecked);
    });
  });
}

// --- 3. 전체 삭제 버튼 바인딩 ---
export function setupClearAllButton() {
  function clearAllMyoStorage() {
    if (confirm('모든 저장된 명식을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      localStorage.clear();
      alert('모든 로컬 스토리지 데이터가 삭제되었습니다. 페이지를 새로고침합니다.');
      location.reload();
    }
  }
  const myeongsikDeleteBtn = document.getElementById('myeongsikDeleteBtn');
  if (myeongsikDeleteBtn) {
    myeongsikDeleteBtn.addEventListener('click', clearAllMyoStorage);
  }
}



/**
 * 동적 십이신살 계산
 */
export function getTwelveShinsalDynamic(dayPillar, yearPillar, targetBranch) {
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

/**
 * 숫자 두 자리 패딩
 */
export function pad(num) {
  return num.toString().padStart(2, '0');
}

/**
 * 십신(간) 가져오기
 */
export function getTenGodForStem(receivingStem, baseDayStem) {
  return tenGodMappingForStems[baseDayStem]?.[receivingStem] || "-";
}

/**
 * 십신(지) 가져오기
 */
export function getTenGodForBranch(receivingBranch, baseStem) {
  return tenGodMappingForBranches[baseStem]?.[receivingBranch] || "-";
}

/**
 * 간지 → 인덱스
 */
export function getGanZhiIndex(gz) {
  return sexagenaryCycle.indexOf(gz);
}

/**
 * 인덱스 → 간지
 */
export function getGanZhiFromIndex(i) {
  const mod = ((i % 60) + 60) % 60;
  return sexagenaryCycle[mod];
}

/**
 * 세운 연간지 계산
 */
export function getYearGanZhiForSewoon(year) {
  const refDate = new Date(year, 3, 1);
  const ipChun = findSolarTermDate(year, 315);
  const effectiveYear = refDate >= ipChun ? year : year - 1;
  const idx = ((effectiveYear - 4) % 60 + 60) % 60;
  return sexagenaryCycle[idx];
}

/**
 * 월운 월간지 계산
 */
export function getMonthGanZhiForWolwoon(year, month) {
  const yearGanZhi      = getYearGanZhiForSewoon(year);
  const yearStem        = yearGanZhi.charAt(0);
  const yearStemIndex   = Cheongan.indexOf(yearStem);
  const monthStemIndex  = (yearStemIndex * 2 + month) % 10;
  const monthBranchIndex = month % 12;
  return Cheongan[monthStemIndex] + Jiji[monthBranchIndex];
}

/**
 * 배경색 클래스 갱신
 */
export function updateColorClasses() {
  const bgColorClasses = ['b_green','b_red','b_yellow','b_white','b_black'];
  const selector = [
    ".ganji_w",
    ".grid_box_1 li b",
    ".ganji b",
    ".ilwoon_ganji_cheongan span",
    ".ilwoon_ganji_jiji span"
  ].join(", ");

  document.querySelectorAll(".ganji_w").forEach(elem => {
    const val = elem.textContent.trim();
    bgColorClasses.forEach(c => elem.classList.remove(c));
    if (colorMapping[val]) elem.classList.add(colorMapping[val].bgColor);
  });

  document.querySelectorAll(selector).forEach(elem => {
    const val = elem.textContent.trim();
    const isSpan = elem.matches(".ilwoon_ganji_cheongan span, .ilwoon_ganji_jiji span");
    const map = isSpan ? colorMapping2 : colorMapping;
    const cls = map[val]?.bgColor;
    if (!cls) return;

    if (isSpan) {
      bgColorClasses.forEach(c => elem.classList.remove(c));
      elem.classList.add(cls);
    } else {
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

/**
 * 십신(span) 요소 추가
 */
export function appendTenGod(id, value, isStem = true) {
  const el = document.getElementById(id);
  if (!el) return;
  const tenGod = (value === '-' || value === '(-)') ? '없음'
    : isStem
      ? getTenGodForStem(value, globalState.baseDayStem)
      : getTenGodForBranch(value, globalState.baseDayStem);

  el.innerHTML = '';
  el.append(document.createTextNode(value));
  const span = document.createElement('span');
  span.className = 'ten-god';
  span.textContent = `(${tenGod})`;
  el.append(' ', span);
}

/**
 * 지장간 갱신
 */
export function updateHiddenStems(SetBranch, prefix) {
  const mapping = hiddenStemMapping[SetBranch] || ["-", "-", "-"];
  mapping.forEach((val, i) => {
    appendTenGod(prefix + "Jj" + (i + 1), val, true);
  });
}

/**
 * 텍스트 설정 헬퍼
 */
export function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.innerText = text;
}

/**
 * 천간 정보 업데이트
 */
export function updateStemInfo(prefix, splitData, baseDayStem, suffix = "") {
  const gan = splitData.gan;
  const info = stemMapping[gan] || {};
  setText(prefix + "Hanja"  + suffix, info.hanja    || "-");
  setText(prefix + "Hanguel"+ suffix, info.hanguel  || "-");
  setText(prefix + "Eumyang"+ suffix, info.eumYang  || "-");
  setText(prefix + "10sin"  + suffix, getTenGodForStem(gan, baseDayStem) || "-");
}

/**
 * 지지 정보 업데이트
 */
export function updateBranchInfo(prefix, branch, baseDayStem, suffix = "") {
  const info = branchMapping[branch] || {};
  setText(prefix + "Hanja"   + suffix, info.hanja    || "-");
  setText(prefix + "Hanguel" + suffix, info.hanguel  || "-");
  setText(prefix + "Eumyang" + suffix, info.eumYang  || "-");
  setText(prefix + "10sin"   + suffix, getTenGodForBranch(branch, baseDayStem) || "-");
  updateHiddenStems(branch, prefix + suffix);
}
