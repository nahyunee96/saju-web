// calendar.js
import { setText } from './utilities.js';
import { getSolarTermBoundaries, findSolarTermDate } from './astro.js';
import { Cheongan, MONTH_ZHI, stemMapping, branchMapping, updateHiddenStems } from './constants.js';
import { getGanZhiIndex, getGanZhiFromIndex, getTenGodForStem, getTenGodForBranch, getTwelveUnseong, getTwelveShinsal, getDayGanZhi } from './fortune.js';
import { updateColorClasses } from './dom.js';

/**
 * 절기 기간에 해당하는 일간 운세 달력을 생성합니다.
 * @param {string} solarTermName - 현재 절기의 이름
 * @param {Date} startDate - 현재 절기의 시작 날짜
 * @param {Date} endDate - 현재 절기의 끝 날짜
 * @param {string} baseDayStem - 기준 일간 (천간)
 * @param {number} currentIndex - boundaries 배열 내의 현재 절기의 인덱스
 * @param {Array} boundaries - 해당 절기에 해당하는 경계 배열
 * @param {number} solarYear - 해당 태양년
 * @param {string} baseYearBranch - 기준 연지 (지지)
 * @returns {string} - 생성된 캘린더 HTML 문자열
 */

 export function updateStemInfo(prefix, Set, baseDayStem) {
  setText(prefix + "Hanja", (stemMapping[Set.gan]?.hanja) || "-");
  setText(prefix + "Hanguel", (stemMapping[Set.gan]?.hanguel) || "-");
  setText(prefix + "Eumyang", (stemMapping[Set.gan]?.eumYang) || "-");
  setText(prefix + "10sin", (prefix === "Dt") ? "본원" : getTenGodForStem(Set.gan, baseDayStem));
}

export function updateBranchInfo(prefix, branch, baseDayStem) {
  setText(prefix + "Hanja", (branchMapping[branch]?.hanja) || "-");
  setText(prefix + "Hanguel", (branchMapping[branch]?.hanguel) || "-");
  setText(prefix + "Eumyang", (branchMapping[branch]?.eumYang) || "-");
  setText(prefix + "10sin", getTenGodForBranch(branch, baseDayStem));
  updateHiddenStems(branch, prefix);
}

export function generateDailyFortuneCalendar(solarTermName, startDate, endDate, baseDayStem, currentIndex, boundaries, solarYear, baseYearBranch) {
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
    let dailyHtml = `<ul class="ilwoon">
      <li class="ilwoonday"><span>${date.getDate()}일</span></li>
      <li class="ilwoon_ganji_cheongan_10sin"><span>${tenGodCheongan}</span></li>
      <li class="ilwoon_ganji_cheongan"><span>${stem}</span></li>
      <li class="ilwoon_ganji_jiji"><span>${branch}</span></li>
      <li class="ilwoon_ganji_jiji_10sin"><span>${tenGodJiji}</span></li>
      <li class="ilwoon_10woonseong"><span>${twelveUnseong}</span></li>
      <li class="ilwoon_10sinsal"><span>${twelveShinsal}</span></li>
    </ul>`;
    let tdClass = "";
    const today = new Date();
    if (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
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

/**
 * 현재 절기에 따른 월간 운세 달력을 업데이트합니다.
 * @param {string} solarTermName - 현재 절기의 이름
 * @param {number} computedYear - 계산된 태양년
 * @param {number} [newIndexOpt] - 선택된 절기의 인덱스 (옵션)
 * @param {string} baseDayStem - 기준 일간 (천간)
 * @param {string} baseYearBranch - 기준 연지 (지지)
 */
export function updateMonthlyFortuneCalendar(solarTermName, computedYear, newIndexOpt, baseDayStem, baseYearBranch) {
  const today = new Date();
  const solarYear = computedYear || (function () {
    const ipChun = findSolarTermDate(today.getFullYear(), 315);
    return (today < ipChun) ? today.getFullYear() - 1 : today.getFullYear();
  })();
  let boundaries = getSolarTermBoundaries(solarYear);
  if (!Array.isArray(boundaries)) boundaries = Array.from(boundaries);
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
    if (!Array.isArray(nextBoundaries)) nextBoundaries = Array.from(nextBoundaries);
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
    baseDayStem,
    currentIndex,
    boundaries,
    solarYear,
    baseYearBranch
  );
  const container = document.getElementById("iljuCalender");
  if (container) {
    container.innerHTML = calendarHTML;
  }
  window.globalState = window.globalState || {};
  window.globalState.solarYear = solarYear;
  window.globalState.boundaries = boundaries;
  window.globalState.currentIndex = currentIndex;
  window.globalState.computedYear = solarYear;
}

/**
 * 월간 운세 정보를 업데이트합니다.
 * @param {number} computedYear - 계산된 태양년
 * @param {number} currentMonthIndex - 현재 월의 인덱스 (0부터 시작)
 */
export function updateMonthlyWoon(computedYear, currentMonthIndex) {
  const boundaries = getSolarTermBoundaries(computedYear);
  if (!boundaries || boundaries.length === 0) return;
  const baseDayStem = window.globalState.baseDayStem || "";
  const yearPillar = window.globalState.yearPillar || "";
  const baseYearBranch = yearPillar.charAt(1) || "";
  const yearStem = yearPillar.charAt(0) || "";
  const yearStemIndex = Cheongan.indexOf(yearStem);
  const monthNumber = currentMonthIndex + 1;
  const monthStemIndex = (((yearStemIndex * 2) + monthNumber - 1) + 4) % 10;
  const monthStem = Cheongan[monthStemIndex];
  const monthBranch = MONTH_ZHI[monthNumber - 1];
  const tenGodStem = getTenGodForStem(monthStem, baseDayStem);
  const tenGodBranch = getTenGodForBranch(monthBranch, baseDayStem);
  const unseong = getTwelveUnseong(baseDayStem, monthBranch);
  const shinsal = getTwelveShinsal(baseYearBranch, monthBranch);
  setText("WMtHanja", monthStem);
  setText("WMtHanguel", monthStem);
  setText("WMtEumyang", monthStem);
  setText("WMt10sin", tenGodStem);
  setText("WMbHanja", monthBranch);
  setText("WMbHanguel", monthBranch);
  setText("WMbEumyang", monthBranch);
  setText("WMb10sin", tenGodBranch);
  setText("WMb12ws", unseong);
  setText("WMb12ss", shinsal);
  updateColorClasses();
}

/**
 * 오늘 날짜 기준으로 월간 운세 정보를 업데이트합니다.
 * @param {Date} refDate - 참조 날짜
 */
export function updateMonthlyWoonByToday(refDate) {
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
  updateMonthlyWoon(computedYear, currentMonthIndex);
}



