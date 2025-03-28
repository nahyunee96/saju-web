// dom.js
import { pad, setText } from './utilities.js';
import { adjustBirthDate, findSolarTermDate, getYearGanZhi } from './astro.js';
import { splitSet, getDaewoonData, getTwelveUnseong, getTwelveShinsal, getTenGodForStem, getTenGodForBranch, getGanZhiIndex, getGanZhiFromIndex, getYearGanZhiForSewoon, getDayGanZhi, getFourSetsWithDaewoon, getHourStem } from './fortune.js';
import { Cheongan, Jiji, MONTH_ZHI, colorMapping, hiddenStemMapping, updateHiddenStems, timeRanges, sexagenaryCycle, stemMapping, branchMapping } from './constants.js';
import { updateStemInfo, updateBranchInfo, updateMonthlyWoonByToday } from './calendar.js';

export function updateColorClasses() {
  const bgColorClasses = ['b_green', 'b_red', 'b_yellow', 'b_white', 'b_black'],
        textColorClasses = ['green', 'red', 'yellow', 'white', 'black'];
  document.querySelectorAll(".ganji_w").forEach(elem => {
    const val = elem.innerHTML.trim();
    bgColorClasses.forEach(cls => elem.classList.remove(cls));
    if (colorMapping[val]) elem.classList.add(colorMapping[val].bgColor);
  });
  document.querySelectorAll(".grid_box_1 li b, .ganji b").forEach(bElem => {
    const val = bElem.innerHTML.trim();
    textColorClasses.forEach(cls => bElem.classList.remove(cls));
    if (colorMapping[val]) bElem.classList.add(colorMapping[val].textColor);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const inputName = document.getElementById("inputName");
  if (inputName) {
    inputName.addEventListener("input", function () {
      if (this.value.length > 10) {
        this.value = this.value.slice(0, 10);
      }
    });
  }

  document.getElementById("calcBtn").addEventListener("click", function () {
    let refDate = new Date();
    const name = document.getElementById("inputName").value.trim() || "-";
    const birthdayStr = document.getElementById("inputBirthday").value.trim();
    const birthtimeStr = document.getElementById("inputBirthtime").value.trim();
    const gender = document.getElementById("genderMan").checked ? "남" 
                  : (document.getElementById("genderWoman").checked ? "여" : "-");
    const birthPlace = document.getElementById("inputBirthPlace").value || "-";

    // 기본 입력 검증
    if (birthdayStr.length < 8) {
      alert("생년월일을 YYYYMMDD 형식으로 입력하세요.");
      return;
    }
    if (birthtimeStr.length !== 4 || isNaN(birthtimeStr)) {
      alert("태어난 시간을 4자리 숫자 (HHMM) 형식으로 입력하세요.");
      return;
    }
    if (gender === "-") {
      alert("성별을 선택하세요.");
      return;
    }
    if (birthPlace === "" || birthPlace === "출생지 선택") {
      alert("출생지를 선택하세요.");
      return;
    }

    // 생년월일, 시간 파싱
    let year   = parseInt(birthdayStr.substring(0, 4));
    let month  = parseInt(birthdayStr.substring(4, 6));
    let day    = parseInt(birthdayStr.substring(6, 8));
    let hour   = parseInt(birthtimeStr.substring(0, 2), 10);
    let minute = parseInt(birthtimeStr.substring(2, 4), 10);
    const birthDate = new Date(year, month - 1, day, hour, minute);

    // 음력/양력 변환
    const monthType = document.getElementById("monthType").value;
    const calendar = new KoreanLunarCalendar();
    let lunarDate = null;
    if (monthType === "음력" || monthType === "음력(윤달)") {
      const isLeap = (monthType === "음력(윤달)");
      if (!calendar.setLunarDate(year, month, day, isLeap)) {
        console.error(`${monthType} 날짜 설정에 실패했습니다.`);
      } else {
        lunarDate = { year, month, day, isLeap };
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

    const originalDate = new Date(year, month - 1, day, hour, minute);
    const correctedDate = adjustBirthDate(originalDate, birthPlace);
    window.globalState = window.globalState || {};
    window.globalState.correctedBirthDate = correctedDate;

    const formattedBirth = `${year}-${pad(month)}-${pad(day)}`;
    setText("resBirth", formattedBirth);
    if (lunarDate) {
      const formattedLunar = `${lunarDate.year}-${pad(lunarDate.month)}-${pad(lunarDate.day)}${lunarDate.isLeap ? " (윤달)" : ""}`;
      setText("resBirth2", formattedLunar);
    } else {
      setText("resBirth2", "-");
    }

    const solarDate = correctedDate;
    const fullResult = getFourSetsWithDaewoon(
      solarDate.getFullYear(),
      solarDate.getMonth() + 1,
      solarDate.getDate(),
      hour, minute, birthPlace, gender
    );
    // 예: "병자 경인 정묘 무오시, 대운수 ..." 형식의 문자열
    const parts = fullResult.split(", ");
    const pillarsPart = parts[0] || "-";
    const pillars = pillarsPart.split(" ");
    const yearPillar  = pillars[0] || "-";
    const monthPillar = pillars[1] || "-";
    const dayPillar   = pillars[2] || "-";
    const hourPillar  = pillars[3] || "-";

    // 원국 기둥 분리
    const yearSplit  = splitSet(yearPillar);
    const monthSplit = splitSet(monthPillar);
    const daySplit   = splitSet(dayPillar);
    const hourSplit  = splitSet(hourPillar);

    const natalChartData = {
      birthDate: birthDate,
      yearPillar: yearPillar,
      monthPillar: monthPillar,
      dayPillar: dayPillar,   
      hourPillar: hourPillar
    };

    const BirthDateObj = new Date(
      birthDate.getFullYear(),
      birthDate.getMonth(),
      birthDate.getDate(),
      birthDate.getHours(),
      birthDate.getMinutes()
    );

    const adjustedBirthDateObj = new Date(
      birthDate.getFullYear() + 1,
      birthDate.getMonth(),
      birthDate.getDate(),
      birthDate.getHours(),
      birthDate.getMinutes()
    );

    const birthYearPillar = yearPillar;
    const birthMonthPillar = monthPillar;

    const baseDayStem = daySplit.gan; // 원국 일간
    const baseYearBranch = birthYearPillar.charAt(1); // 원국 연지

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
    if (!/^\d{4}$/.test(birthtimeStr)) {
      alert("태어난 시간은 4자리 숫자 (HHMM) 형식으로 입력하세요.");
      return;
    }
    if (hour < 0 || hour > 23) {
      alert("시각은 00부터 23 사이의 숫자로 입력하세요.");
      return;
    }
    if (minute < 0 || minute > 59) {
      alert("분은 00부터 59 사이의 숫자로 입력하세요.");
      return;
    }

    window.globalState.birthYear = year;
    window.globalState.month = month;
    window.globalState.day = day;
    window.globalState.birthPlace = birthPlace;
    window.globalState.gender = gender;
    
    const formattedTime = `${pad(hour)}:${pad(minute)}`;
    setText("resName", name);
    setText("resGender", gender);
    setText("resBirth", formattedBirth);
    setText("resTime", formattedTime);
    setText("resAddr", birthPlace);
    const correctedTime = adjustBirthDate(originalDate, birthPlace);
    document.getElementById("resbjTime").innerHTML =
      correctedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    function updateOriginalSetMapping() {
      setText("Hb12ws", getTwelveUnseong(baseDayStem, hourSplit.ji));
      setText("Hb12ss", getTwelveShinsal(baseYearBranch, hourSplit.ji));
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
    updateStemInfo("Ht", hourSplit, baseDayStem);
    updateBranchInfo("Yb", baseYearBranch, baseDayStem);
    updateBranchInfo("Mb", monthSplit.ji, baseDayStem);
    updateBranchInfo("Db", daySplit.ji, baseDayStem);
    updateBranchInfo("Hb", hourSplit.ji, baseDayStem);
    updateOriginalSetMapping();
    updateColorClasses();

    function updateCurrentDaewoon() {
      const birthDateObj = new Date(year, month - 1, day);
      const today = new Date();
      let currentAge = today.getFullYear() - birthDateObj.getFullYear();
      if (today.getMonth() < birthDateObj.getMonth() ||
         (today.getMonth() === birthDateObj.getMonth() && today.getDate() < birthDateObj.getDate())) {
        currentAge--;
      }
      const daewoonData = getDaewoonData(birthPlace, gender);
      let currentDaewoon = null;
      for (let i = 0; i < daewoonData.list.length; i++) {
        if (daewoonData.list[i].age <= currentAge) {
          currentDaewoon = daewoonData.list[i];
        }
      }
      if (!currentDaewoon) {
        currentDaewoon = daewoonData.list[0] || { stem: "-", branch: "-" };
      }
      setText("DwtHanja", typeof stemMapping[currentDaewoon.stem] !== "undefined" ? stemMapping[currentDaewoon.stem].hanja : "-");
      setText("DwtHanguel", typeof stemMapping[currentDaewoon.stem] !== "undefined" ? stemMapping[currentDaewoon.stem].hanguel : "-");
      setText("DwtEumyang", typeof stemMapping[currentDaewoon.stem] !== "undefined" ? stemMapping[currentDaewoon.stem].eumYang : "-");
      setText("Dwt10sin", getTenGodForStem(currentDaewoon.stem, baseDayStem));
      setText("DwbHanja", typeof branchMapping[currentDaewoon.branch] !== "undefined" ? branchMapping[currentDaewoon.branch].hanja : "-");
      setText("DwbHanguel", typeof branchMapping[currentDaewoon.branch] !== "undefined" ? branchMapping[currentDaewoon.branch].hanguel : "-");
      setText("DwbEumyang", typeof branchMapping[currentDaewoon.branch] !== "undefined" ? branchMapping[currentDaewoon.branch].eumYang : "-");
      setText("Dwb10sin", getTenGodForBranch(currentDaewoon.branch, baseDayStem));
      const hiddenArr = hiddenStemMapping[currentDaewoon.branch] || ["-", "-", "-"];
      setText("DwJj1", hiddenArr[0]);
      setText("DwJj2", hiddenArr[1]);
      setText("DwJj3", hiddenArr[2]);
      setText("DWb12ws", getTwelveUnseong(baseDayStem, currentDaewoon.branch));
      setText("DWb12ss", getTwelveShinsal(baseYearBranch, currentDaewoon.branch));
    }
    updateCurrentDaewoon();
    updateMonthlyWoonByToday(new Date());
    window.globalState.daewoonData = getDaewoonData(birthPlace, gender);

    function updateDaewoonItem(i, item) {
      const forwardGanji = item.stem + item.branch;
      const finalStem = forwardGanji.charAt(0);
      const finalBranch = forwardGanji.charAt(1);
      const idx = i + 1;
      setText("DC_" + idx, typeof stemMapping[finalStem] !== "undefined" ? stemMapping[finalStem].hanja : "-");
      setText("DJ_" + idx, typeof branchMapping[finalBranch] !== "undefined" ? branchMapping[finalBranch].hanja : "-");
      setText("dt10sin" + idx, getTenGodForStem(finalStem, baseDayStem) || "-");
      setText("db10sin" + idx, getTenGodForBranch(finalBranch, baseDayStem) || "-");
      setText("DwW" + idx, "-");
      setText("Ds" + idx, "-");
      setText("Da" + idx, item.age);
    }
    for (let i = 0; i < 10; i++) {
      updateDaewoonItem(i, window.globalState.daewoonData.list[i]);
    }

    const birthDateObj = new Date(year, month - 1, day);
    const todayObj = new Date();
    let currentAge = todayObj.getFullYear() - birthDateObj.getFullYear();
    if (todayObj.getMonth() < birthDateObj.getMonth() ||
       (todayObj.getMonth() === birthDateObj.getMonth() && todayObj.getDate() < birthDateObj.getDate())) {
      currentAge--;
    }
    let currentDaewoonIndex = 0;
    if (window.globalState.daewoonData?.list) {
      for (let i = 0; i < window.globalState.daewoonData.list.length; i++) {
        if (window.globalState.daewoonData.list[i].age <= currentAge) {
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
      const effectiveYear = (refDate >= ipChun) ? refDate.getFullYear() : refDate.getFullYear() - 1;
      const sewoonIndex = ((effectiveYear - 4) % 60 + 60) % 60;
      const sewoonGanZhi = sexagenaryCycle[sewoonIndex];
      const sewoonSplit = splitSet(sewoonGanZhi);

      setText("SwtHanja", typeof stemMapping[sewoonSplit.gan] !== "undefined" ? stemMapping[sewoonSplit.gan].hanja : "-");
      setText("SwtHanguel", typeof stemMapping[sewoonSplit.gan] !== "undefined" ? stemMapping[sewoonSplit.gan].hanguel : "-");
      setText("SwtEumyang", typeof stemMapping[sewoonSplit.gan] !== "undefined" ? stemMapping[sewoonSplit.gan].eumYang : "-");
      setText("Swt10sin", getTenGodForStem(sewoonSplit.gan, baseDayStem));
      setText("SwbHanja", typeof branchMapping[sewoonSplit.ji] !== "undefined" ? branchMapping[sewoonSplit.ji].hanja : "-");
      setText("SwbHanguel", typeof branchMapping[sewoonSplit.ji] !== "undefined" ? branchMapping[sewoonSplit.ji].hanguel : "-");
      setText("SwbEumyang", typeof branchMapping[sewoonSplit.ji] !== "undefined" ? branchMapping[sewoonSplit.ji].eumYang : "-");
      setText("Swb10sin", getTenGodForBranch(sewoonSplit.ji, baseDayStem));
      const sewoonHidden = hiddenStemMapping[sewoonSplit.ji] || ["-", "-", "-"];
      setText("SwJj1", sewoonHidden[0]);
      setText("SwJj2", sewoonHidden[1]);
      setText("SwJj3", sewoonHidden[2]);
      setText("SWb12ws", getTwelveUnseong(baseDayStem, sewoonSplit.ji));
      setText("SWb12ss", getTwelveShinsal(baseYearBranch, sewoonSplit.ji));
      
      setText("WSwtHanja", typeof stemMapping[sewoonSplit.gan] !== "undefined" ? stemMapping[sewoonSplit.gan].hanja : "-");
      setText("WSwtHanguel", typeof stemMapping[sewoonSplit.gan] !== "undefined" ? stemMapping[sewoonSplit.gan].hanguel : "-");
      setText("WSwtEumyang", typeof stemMapping[sewoonSplit.gan] !== "undefined" ? stemMapping[sewoonSplit.gan].eumYang : "-");
      setText("WSwt10sin", getTenGodForStem(sewoonSplit.gan, baseDayStem));
      setText("WSwbHanja", typeof branchMapping[sewoonSplit.ji] !== "undefined" ? branchMapping[sewoonSplit.ji].hanja : "-");
      setText("WSwbHanguel", typeof branchMapping[sewoonSplit.ji] !== "undefined" ? branchMapping[sewoonSplit.ji].hanguel : "-");
      setText("WSwbEumyang", typeof branchMapping[sewoonSplit.ji] !== "undefined" ? branchMapping[sewoonSplit.ji].eumYang : "-");
      setText("WSwb10sin", getTenGodForBranch(sewoonSplit.ji, baseDayStem));
      setText("WSwJj1", sewoonHidden[0]);
      setText("WSwJj2", sewoonHidden[1]);
      setText("WSwJj3", sewoonHidden[2]);
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
        document.querySelectorAll("#sewoonList li").forEach(item => item.classList.remove("active"));
        this.classList.add("active");
        const index = this.getAttribute("data-index2");
        updateSewoonDetails(index);
        const mowoonListElem = document.getElementById("walwoonArea");
        if (mowoonListElem) { mowoonListElem.style.display = "grid"; }
      });
    });

    function updateDaewoonDetails(index) {
      if (window.globalState.daewoonData && window.globalState.daewoonData.list[index - 1]) {
        const data = window.globalState.daewoonData.list[index - 1];
        setText("daewoonDetail", `${data.age}세 (${data.stem}${data.branch})`);
      }
    }

    function updateSewoonDetails(index) {
      if (window.globalState.sewoonStartYear) {
        const computedYear = window.globalState.sewoonStartYear + (index - 1);
        const yearGanZhi = getYearGanZhiForSewoon(computedYear);
        const splitYear = splitSet(yearGanZhi);
        setText("sewoonDetail", `${computedYear}년 (${splitYear.gan}${splitYear.ji})`);
      }
    }

    let activeDaewoonLi = document.querySelector("[id^='daewoon_'].active");
    let daewoonIndex = activeDaewoonLi ? parseInt(activeDaewoonLi.getAttribute("data-index"), 10) : 1;
    if (!window.globalState.birthYear || !window.globalState.daewoonData) {
      alert("먼저 계산 버튼을 눌러 출생 정보를 입력하세요.");
      return;
    }
    const selectedDaewoon = window.globalState.daewoonData.list[daewoonIndex - 1];
    if (!selectedDaewoon) return;
    const daewoonNum = selectedDaewoon.age;
    const sewoonStartYear = window.globalState.birthYear + (daewoonNum - 1);
    window.globalState.sewoonStartYear = sewoonStartYear;
    const displayedDayPillar = document.getElementById("DtHanguel").innerText;
    const baseDayStemS = displayedDayPillar ? displayedDayPillar.charAt(0) : "-";
    const sewoonList = [];
    for (let j = 0; j < 10; j++) {
      let sewoonYear = window.globalState.sewoonStartYear + j;
      let yearGanZhi = getYearGanZhiForSewoon(sewoonYear);
      const splitYear = splitSet(yearGanZhi);
      const tenGod = getTenGodForStem(splitYear.gan, baseDayStemS);
      const tenGodJiji = getTenGodForBranch(splitYear.ji, baseDayStemS);
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
      setText("SC_" + idx, typeof stemMapping[item.gan] !== "undefined" ? stemMapping[item.gan].hanja : "-");
      setText("SJ_" + idx, typeof branchMapping[item.ji] !== "undefined" ? branchMapping[item.ji].hanja : "-");
      setText("st10sin" + idx, item.tenGod);
      setText("sb10sin" + idx, item.tenGodJiji);
      setText("SwW" + idx, getTwelveUnseong(baseDayStem, item.ji) || "-");
      setText("Ss" + idx, getTwelveShinsal(baseYearBranch, item.ji) || "-");
      setText("Dy" + idx, item.year);
    });
    updateColorClasses();

    const todayYear = todayObj.getFullYear();
    const ipChun = findSolarTermDate(todayObj.getFullYear(), 315);
    const displayYear = (todayObj < ipChun) ? todayYear - 1 : todayYear;
    const sewoonLis = document.querySelectorAll("#sewoonList li");
    sewoonLis.forEach(li => {
      const dyearElem = li.querySelector(".dyear");
      const currentYear = Number(dyearElem.innerText);
      li.classList.toggle("active", currentYear === displayYear);
      document.getElementById('resultWrapper').style.display = 'block';
      document.getElementById('inputWrap').style.display = 'none';
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

    let currentSewoonIndex = displayYear - window.globalState.sewoonStartYear;
    if (currentSewoonIndex < 0) currentSewoonIndex = 0;
    if (currentSewoonIndex > 9) currentSewoonIndex = 9;
    const computedSewoonYear = window.globalState.sewoonStartYear + currentSewoonIndex;
    updateMonthlyData(computedSewoonYear);
    const monthlyContainer = document.getElementById("walwoonArea");
    if (monthlyContainer) { monthlyContainer.style.display = "grid"; }
    updateColorClasses();
    updateOriginalSetMapping(yearSplit, monthSplit, daySplit, hourSplit);
    updateListMapping(window.globalState.daewoonData.list, "DwW", "Ds", baseDayStem, baseYearBranch);
    if (window.globalState.sewoonList && window.globalState.sewoonList.length > 0) {
      updateListMapping(window.globalState.sewoonList, "SwW", "Ss", baseDayStem, baseYearBranch);
    }
    if (window.globalState.monthWoonList && window.globalState.monthWoonList.length > 0) {
      updateListMapping(window.globalState.monthWoonList, "MwW", "Ms", baseDayStem, baseYearBranch);
    }

    function updateMonthlyData() {
      const dayPillarText = document.getElementById("DtHanguel").innerText;
      const baseDayStem = dayPillarText ? dayPillarText.charAt(0) : "-";
      const effectiveYear = (refDate >= ipChun) ? refDate.getFullYear() : refDate.getFullYear() - 1;
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
        setText("MC_" + (i + 1), monthStem);
        setText("MJ_" + (i + 1), monthBranch);
        setText("Mot10sin" + (i + 1), tenGodStem);
        setText("Mob10sin" + (i + 1), tenGodBranch);
        setText("MwW" + (i + 1), unseong);
        setText("Ms" + (i + 1), shinsal);
        setText("Dm" + (i + 1), displayMonth);
      }
    }
    updateMonthlyData(refDate);

    document.querySelectorAll("#mowoonList li").forEach(function (li) {
      li.addEventListener("click", function (event) {
        event.stopPropagation();
        document.querySelectorAll("#mowoonList li").forEach(function(item) {
          item.classList.remove("active");
        });
        li.classList.add("active");
        document.getElementById('iljuCalender').style.display = 'grid';
        const termName = li.getAttribute("data-solar-term") || "";
        const computedYear = window.globalState.computedYear || (function(){
          const today = new Date();
          const ipChun = findSolarTermDate(today.getFullYear(), 315);
          return (today < ipChun) ? today.getFullYear() - 1 : today.getFullYear();
        })();
        window.globalState.activeMonth = parseInt(li.getAttribute("data-index3"), 10);
        updateMonthlyFortuneCalendar(termName, computedYear, undefined, baseDayStem, baseYearBranch);
      });
    });

    function getMyounPillars(birthYearPillar, birthMonthPillar, birthDateObj, refDate, gender) {
      let finalYearPillar = birthYearPillar;
      function getAgeByDate(birthDate) {
        let age = refDate.getFullYear() - birthDate.getFullYear();
        const m = refDate.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && refDate.getDate() < birthDate.getDate())) {
          age--;
        }
        return age;
      }
      const ageOnRef = getAgeByDate(birthDateObj);
      const firstBirthday = new Date(birthDateObj);
      firstBirthday.setFullYear(firstBirthday.getFullYear() + 1);
      if (refDate < firstBirthday || ageOnRef < 61) {
        finalYearPillar = birthYearPillar;
      } else {
        const originalIndex = getGanZhiIndex(birthYearPillar);
        const correctedDate = adjustBirthDate(birthDateObj, birthPlace);
        const originalYearPillarData = getYearGanZhi(correctedDate, BirthDateObj.getFullYear());
        if (originalIndex >= 0) {
          const isYangStem = ["갑", "병", "무", "경", "임"].includes(originalYearPillarData.charAt(0));
          const direction = ((gender === "남" && isYangStem) || (gender === "여" && !isYangStem)) ? 1 : -1;
          // someInterval 는 추가로 정의되어야 하는 값입니다.
          finalYearPillar = getGanZhiFromIndex(originalIndex + direction + 60);
        }
      }

      function getCurrentDaewoonMonthPillar(birthPlace, gender, referenceDate) {
        const currAge = getAgeByDate(birthDateObj);
        const daewoonData = getDaewoonData(birthPlace, gender);
        for (let i = daewoonData.list.length - 1; i >= 0; i--) {
          if (daewoonData.list[i].age <= currAge) {
            return daewoonData.list[i].stem + daewoonData.list[i].branch;
          }
        }
        return daewoonData.list[0].stem + daewoonData.list[0].branch;
      }
      let finalMonthPillar = birthMonthPillar;
      finalMonthPillar = getCurrentDaewoonMonthPillar(birthPlace, gender, refDate);

      let iljuDate = new Date(
        adjustedBirthDateObj.getFullYear(),
        adjustedBirthDateObj.getMonth(),
        adjustedBirthDateObj.getDate(),
        0, 0
      );
      let sijuDate = new Date(
        adjustedBirthDateObj.getFullYear(),
        adjustedBirthDateObj.getMonth(),
        adjustedBirthDateObj.getDate(),
        adjustedBirthDateObj.getHours(),
        adjustedBirthDateObj.getMinutes()
      );
      const originalYearPillarData = getYearGanZhi(correctedDate, adjustedBirthDateObj.getFullYear());
      const isYangStem = ["갑", "병", "무", "경", "임"].includes(originalYearPillarData.charAt(0));
      const direction = ((gender === "남" && isYangStem) || (gender === "여" && !isYangStem)) ? 1 : -1;

      const direction_ilju = direction; 
      const originalIljuIndex = getGanZhiIndex(natalChartData.dayPillar); 
      let iljuIndex = (originalIljuIndex + direction_ilju + 60) % 60;

      const direction_siju = direction;
      const originalSijuIndex = getGanZhiIndex(natalChartData.hourPillar);
      let sijuIndex = (originalSijuIndex + direction_siju + 60) % 60;

      function nextIlju() {
        const nextDate = new Date(iljuDate.getTime());
        nextDate.setDate(nextDate.getDate() + 120);
        const nextIndex = (iljuIndex + direction_ilju + 60) % 60;
        return { date: nextDate, index: nextIndex };
      }
      function nextSiju() {
        const nextDate = new Date(sijuDate.getTime());
        nextDate.setDate(nextDate.getDate() + 10);
        const nextIndex = (sijuIndex + direction_siju + 60) % 60;
        return { date: nextDate, index: nextIndex };
      }

      while (true) {
        const ni = nextIlju();
        const ns = nextSiju();
        let nextEvent, eventType;
        if (ni.date < ns.date) {
          nextEvent = ni;
          eventType = "ilju";
        } else {
          nextEvent = ns;
          eventType = "siju";
        }
        if (nextEvent.date > refDate) break;
        
        if (eventType === "ilju") {
          iljuDate = nextEvent.date;
          iljuIndex = nextEvent.index;
          // lastIljuChangeDate 는 필요시 전역 또는 로컬 변수로 처리
        } else {
          sijuDate = nextEvent.date;
          sijuIndex = nextEvent.index;
          // lastSijuChangeDate 도 마찬가지 처리
        }
      }

      const finalDayPillar = getGanZhiFromIndex(iljuIndex);   
      const finalHourPillar = getGanZhiFromIndex(sijuIndex);    
      
      return {
        yearPillar: finalYearPillar,    
        monthPillar: finalMonthPillar,   
        dayPillar: finalDayPillar,       
        hourPillar: finalHourPillar      
      };
    }

    let myounResult = getMyounPillars(birthYearPillar, birthMonthPillar, BirthDateObj, refDate, gender);

    function updateMyowoonSection(myounResult, daySplit, yearSplit) {
      function setTextLocal(id, text) {
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

      const yearStem = myounResult.yearPillar.charAt(0), yearBranch = myounResult.yearPillar.charAt(1);
      setTextLocal("MyoYtHanja", typeof stemMapping[yearStem] !== "undefined" ? stemMapping[yearStem].hanja : yearStem); applyColor("MyoYtHanja", typeof stemMapping[yearStem] !== "undefined" ? stemMapping[yearStem].hanja : yearStem);
      setTextLocal("MyoYtHanguel", typeof stemMapping[yearStem] !== "undefined" ? stemMapping[yearStem].hanguel : yearStem);
      setTextLocal("MyoYtEumyang", typeof stemMapping[yearStem] !== "undefined" ? stemMapping[yearStem].eumYang : "-");
      setTextLocal("MyoYt10sin", getTenGodForStem(yearStem, baseDayStem));
      setTextLocal("MyoYbHanja", typeof branchMapping[yearBranch] !== "undefined" ? branchMapping[yearBranch].hanja : yearBranch); applyColor("MyoYbHanja", typeof branchMapping[yearBranch] !== "undefined" ? branchMapping[yearBranch].hanja : yearBranch);
      setTextLocal("MyoYbHanguel", typeof branchMapping[yearBranch] !== "undefined" ? branchMapping[yearBranch].hanguel : yearBranch);
      setTextLocal("MyoYbEumyang", typeof branchMapping[yearBranch] !== "undefined" ? branchMapping[yearBranch].eumYang : "-");
      setTextLocal("MyoYb10sin", getTenGodForBranch(yearBranch, baseDayStem));
      const hiddenYear = hiddenStemMapping[yearBranch] || ["-", "-", "-"];
      setTextLocal("MyoYbJj1", hiddenYear[0]); setTextLocal("MyoYbJj2", hiddenYear[1]); setTextLocal("MyoYbJj3", hiddenYear[2]);
      setTextLocal("MyoYb12ws", getTwelveUnseong(baseDayStem, yearBranch));
      setTextLocal("MyoYb12ss", getTwelveShinsal(baseYearBranch, yearBranch));

      const monthStem = myounResult.monthPillar.charAt(0), monthBranch = myounResult.monthPillar.charAt(1);
      setTextLocal("MyoMtHanja", typeof stemMapping[monthStem] !== "undefined" ? stemMapping[monthStem].hanja : monthStem); applyColor("MyoMtHanja", typeof stemMapping[monthStem] !== "undefined" ? stemMapping[monthStem].hanja : monthStem);
      setTextLocal("MyoMtHanguel", typeof stemMapping[monthStem] !== "undefined" ? stemMapping[monthStem].hanguel : monthStem);
      setTextLocal("MyoMtEumyang", typeof stemMapping[monthStem] !== "undefined" ? stemMapping[monthStem].eumYang : "-");
      setTextLocal("MyoMt10sin", getTenGodForStem(monthStem, baseDayStem));
      setTextLocal("MyoMbHanja", typeof branchMapping[monthBranch] !== "undefined" ? branchMapping[monthBranch].hanja : monthBranch); applyColor("MyoMbHanja", typeof branchMapping[monthBranch] !== "undefined" ? branchMapping[monthBranch].hanja : monthBranch);
      setTextLocal("MyoMbHanguel", typeof branchMapping[monthBranch] !== "undefined" ? branchMapping[monthBranch].hanguel : monthBranch);
      setTextLocal("MyoMbEumyang", typeof branchMapping[monthBranch] !== "undefined" ? branchMapping[monthBranch].eumYang : "-");
      setTextLocal("MyoMb10sin", getTenGodForBranch(monthBranch, baseDayStem));
      const hiddenMonth = hiddenStemMapping[monthBranch] || ["-", "-", "-"];
      setTextLocal("MyoMbJj1", hiddenMonth[0]); setTextLocal("MyoMbJj2", hiddenMonth[1]); setTextLocal("MyoMbJj3", hiddenMonth[2]);
      setTextLocal("MyoMb12ws", getTwelveUnseong(baseDayStem, monthBranch));
      setTextLocal("MyoMb12ss", getTwelveShinsal(baseYearBranch, monthBranch));

      const dayP = myounResult.dayPillar;
      const dayStem = dayP.charAt(0);
      const dayBranch = dayP.slice(1);
      setTextLocal("MyoDtHanja", typeof stemMapping[dayStem] !== "undefined" ? stemMapping[dayStem].hanja : dayStem);
      applyColor("MyoDtHanja", typeof stemMapping[dayStem] !== "undefined" ? stemMapping[dayStem].hanja : dayStem);
      setTextLocal("MyoDtHanguel", typeof stemMapping[dayStem] !== "undefined" ? stemMapping[dayStem].hanguel : dayStem);
      setTextLocal("MyoDtEumyang", typeof stemMapping[dayStem] !== "undefined" ? stemMapping[dayStem].eumYang : "-");
      setTextLocal("MyoDt10sin", getTenGodForStem(dayStem, baseDayStem));
      setTextLocal("MyoDbHanja", typeof branchMapping[dayBranch] !== "undefined" ? branchMapping[dayBranch].hanja : dayBranch);
      applyColor("MyoDbHanja", typeof branchMapping[dayBranch] !== "undefined" ? branchMapping[dayBranch].hanja : dayBranch);
      setTextLocal("MyoDbHanguel", typeof branchMapping[dayBranch] !== "undefined" ? branchMapping[dayBranch].hanguel : dayBranch);
      setTextLocal("MyoDbEumyang", typeof branchMapping[dayBranch] !== "undefined" ? branchMapping[dayBranch].eumYang : "-");
      setTextLocal("MyoDb10sin", getTenGodForBranch(dayBranch, baseDayStem));
      const hiddenDay = hiddenStemMapping[dayBranch] || ["-", "-", "-"];
      setTextLocal("MyoDbJj1", hiddenDay[0]);
      setTextLocal("MyoDbJj2", hiddenDay[1]);
      setTextLocal("MyoDbJj3", hiddenDay[2]);
      setTextLocal("MyoDb12ws", getTwelveUnseong(baseDayStem, dayBranch));
      setTextLocal("MyoDb12ss", getTwelveShinsal(baseYearBranch, dayBranch));

      const hourP = myounResult.hourPillar;
      const hourStem = hourP.charAt(0);
      const hourBranch = hourP.slice(1);
      setTextLocal("MyoHtHanja", typeof stemMapping[hourStem] !== "undefined" ? stemMapping[hourStem].hanja : hourStem);
      applyColor("MyoHtHanja", typeof stemMapping[hourStem] !== "undefined" ? stemMapping[hourStem].hanja : hourStem);
      setTextLocal("MyoHtHanguel", typeof stemMapping[hourStem] !== "undefined" ? stemMapping[hourStem].hanguel : hourStem);
      setTextLocal("MyoHtEumyang", typeof stemMapping[hourStem] !== "undefined" ? stemMapping[hourStem].eumYang : "-");
      setTextLocal("MyoHt10sin", getTenGodForStem(hourStem, baseDayStem));
      setTextLocal("MyoHbHanja", typeof branchMapping[hourBranch] !== "undefined" ? branchMapping[hourBranch].hanja : hourBranch);
      applyColor("MyoHbHanja", typeof branchMapping[hourBranch] !== "undefined" ? branchMapping[hourBranch].hanja : hourBranch);
      setTextLocal("MyoHbHanguel", typeof branchMapping[hourBranch] !== "undefined" ? branchMapping[hourBranch].hanguel : hourBranch);
      setTextLocal("MyoHbEumyang", typeof branchMapping[hourBranch] !== "undefined" ? branchMapping[hourBranch].eumYang : "-");
      setTextLocal("MyoHb10sin", getTenGodForBranch(hourBranch, baseDayStem));
      const hiddenHour = hiddenStemMapping[hourBranch] || ["-", "-", "-"];
      setTextLocal("MyoHbJj1", hiddenHour[0]);
      setTextLocal("MyoHbJj2", hiddenHour[1]);
      setTextLocal("MyoHbJj3", hiddenHour[2]);
      setTextLocal("MyoHb12ws", getTwelveUnseong(baseDayStem, hourBranch));
      setTextLocal("MyoHb12ss", getTwelveShinsal(baseYearBranch, hourBranch));
    }
    updateMyowoonSection(myounResult, daySplit, yearSplit);

    document.getElementById('myowoonMore').addEventListener('click', function(){
      let myowoonMoreElem = document.getElementById('myowoonMore');
      if (myowoonMoreElem.classList.contains("active")) {
        document.getElementById('wongookLM').classList.remove("w100");
        document.getElementById('luckyWrap').style.display = 'block';
        document.getElementById('woonArea').style.display = 'block';
        document.getElementById('woonContainer').style.display = 'none';
        document.getElementById('calArea').style.display = 'none';
        myowoonMoreElem.classList.remove("active");
        myowoonMoreElem.innerText = "묘운력(운 전체) 상세보기";
      } else {
        document.getElementById('wongookLM').classList.add("w100");
        document.getElementById('luckyWrap').style.display = 'none';
        document.getElementById('woonArea').style.display = 'none';
        document.getElementById('woonContainer').style.display = 'flex';
        document.getElementById('calArea').style.display = 'block';
        let daySplitLocal = splitSet(dayPillar), yearSplitLocal = splitSet(yearPillar);
        updateMyowoonSection(myounResult, daySplitLocal, yearSplitLocal);
        myowoonMoreElem.classList.add("active");
        myowoonMoreElem.innerText = "원래 화면으로 가기";
      }
    });

    document.getElementById('backBtn').addEventListener('click', function () {
      window.location.reload();
    });

    document.getElementById('wongookLM').classList.remove("w100");
    document.getElementById('luckyWrap').style.display = 'block';
    document.getElementById('woonArea').style.display = 'block';
    document.getElementById('woonContainer').style.display = 'none';
    document.getElementById('calArea').style.display = 'none';

    function updateDayWoon(refDate) {
      if (!(refDate instanceof Date) || isNaN(refDate.getTime())) { refDate = new Date(); }
      const jasiElem = document.getElementById("jasi");
      const yajojasiElem = document.getElementById("yajojasi");
      const insiElem = document.getElementById("insi");
      let adjustedDate = new Date(refDate.getTime());
      if (jasiElem && jasiElem.checked) {
        adjustedDate = new Date(adjustedDate.getFullYear(), adjustedDate.getMonth(), adjustedDate.getDate(), -1, 23, 0);
      } else if (yajojasiElem && yajojasiElem.checked) {
        adjustedDate = new Date(adjustedDate.getFullYear(), adjustedDate.getMonth(), adjustedDate.getDate() - 1, 23, 0);
      } else if (insiElem && insiElem.checked) {
        adjustedDate = new Date(adjustedDate.getFullYear(), adjustedDate.getMonth(), adjustedDate.getDate(), 3, 0);
      }
      const dayGanZhi = getDayGanZhi(adjustedDate);
      const daySplitFuc = splitSet(dayGanZhi);
      setText("WDtHanja", typeof stemMapping[daySplitFuc.gan] !== "undefined" ? stemMapping[daySplitFuc.gan].hanja : "-");
      setText("WDtHanguel", typeof stemMapping[daySplitFuc.gan] !== "undefined" ? stemMapping[daySplitFuc.gan].hanguel : "-");
      setText("WDtEumyang", typeof stemMapping[daySplitFuc.gan] !== "undefined" ? stemMapping[daySplitFuc.gan].eumYang : "-");
      setText("WDt10sin", getTenGodForStem(daySplitFuc.gan, baseDayStem) || "-");
      setText("WDbHanja", typeof branchMapping[daySplitFuc.ji] !== "undefined" ? branchMapping[daySplitFuc.ji].hanja : "-");
      setText("WDbHanguel", typeof branchMapping[daySplitFuc.ji] !== "undefined" ? branchMapping[daySplitFuc.ji].hanguel : "-");
      setText("WDbEumyang", typeof branchMapping[daySplitFuc.ji] !== "undefined" ? branchMapping[daySplitFuc.ji].eumYang : "-");
      setText("WDb10sin", getTenGodForBranch(daySplitFuc.ji, baseDayStem) || "-");
      updateHiddenStems(daySplitFuc.ji, "WDb");
      setText("WDb12ws", getTwelveUnseong(baseDayStem, daySplitFuc.ji) || "-");
      setText("WDb12ss", getTwelveShinsal(baseYearBranch, daySplitFuc.ji) || "-");
      updateColorClasses();
    }
    updateDayWoon(refDate);

    function getHourBranchUsingArray(dateObj) {
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

    function updateHourWoon(refDate) {
      const date = new Date(refDate);
      const hourBranch = getHourBranchUsingArray(date);
      const hourBranchIndex = Jiji.indexOf(hourBranch);
      const dayGanZhi = getDayGanZhi(date);
      const daySplitFuc = splitSet(dayGanZhi);
      const baseHourStem = getHourStem(daySplitFuc.gan, hourBranchIndex);
      let idx = Cheongan.indexOf(baseHourStem);
      if (idx === -1) idx = 0;
      const correctedFortuneHourStem = Cheongan[(idx - 2 + Cheongan.length) % Cheongan.length];
      setText("WTtHanja", typeof stemMapping[correctedFortuneHourStem] !== "undefined" ? stemMapping[correctedFortuneHourStem].hanja : "-");
      setText("WTtHanguel", typeof stemMapping[correctedFortuneHourStem] !== "undefined" ? stemMapping[correctedFortuneHourStem].hanguel : "-");
      setText("WTtEumyang", typeof stemMapping[correctedFortuneHourStem] !== "undefined" ? stemMapping[correctedFortuneHourStem].eumYang : "-");
      setText("WTt10sin", getTenGodForStem(correctedFortuneHourStem, baseDayStem) || "-");
      setText("WTbHanja", typeof branchMapping[hourBranch] !== "undefined" ? branchMapping[hourBranch].hanja : "-");
      setText("WTbHanguel", typeof branchMapping[hourBranch] !== "undefined" ? branchMapping[hourBranch].hanguel : "-");
      setText("WTbEumyang", typeof branchMapping[hourBranch] !== "undefined" ? branchMapping[hourBranch].eumYang : "-");
      updateHiddenStems(hourBranch, "WTb");
      setText("WTb10sin", getTenGodForBranch(hourBranch, baseDayStem) || "-");
      setText("WTb12ws", getTwelveUnseong(baseDayStem, hourBranch) || "-");
      setText("WTb12ss", getTwelveShinsal(baseYearBranch, hourBranch) || "-");
      updateColorClasses();
    }
    updateHourWoon(refDate);

    const picker = document.getElementById("woonTimeSetPicker");
    if (picker) {
      const now = new Date();
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

    function updateFortune() {
      const { year, month, day, hour, minute, gender, birthPlace, time2 } = inputData;
      const originalDate = new Date(year, month - 1, day, hour, minute);
      const correctedDate = adjustBirthDate(originalDate, birthPlace);
      // globalState.correctedBirthDate 대신 로컬 변수 correctedDate를 사용하거나,
      // 필요하다면 globalState에 저장할 수도 있음.
      
      // 원국(사주) 계산 실행
      const fullResult = getFourPillarsWithDaewoon(
        correctedDate.getFullYear(),
        correctedDate.getMonth() + 1,
        correctedDate.getDate(),
        hour, minute,
        birthPlace,
        gender
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
      const baseDayStem = globalState.originalDayStem;
      updateStemInfo("Yt", yearSplit, baseDayStem);
      updateStemInfo("Mt", monthSplit, baseDayStem);
      updateStemInfo("Dt", daySplit, baseDayStem);
      updateStemInfo("Ht", hourSplit, baseDayStem);
      updateBranchInfo("Yb", baseYearBranch, baseDayStem);
      updateBranchInfo("Mb", monthSplit.ji, baseDayStem);
      updateBranchInfo("Db", daySplit.ji, baseDayStem);
      updateBranchInfo("Hb", hourSplit.ji, baseDayStem);
      updateOriginalSetMapping();
      updateColorClasses();
    }

    document.getElementById("woonChangeBtn").addEventListener("click", function () {
      let refDate = (picker && picker.value) ? new Date(picker.value) : new Date();
      updateMyowoonSection(myounResult, daySplit, yearSplit);
      updateCurrentSewoon(refDate);
      updateMonthlyWoonByToday(refDate);
      updateDayWoon(refDate);
      updateHourWoon(refDate);
    });

    function collectInputData() {
      const birthdayStr = document.getElementById("inputBirthday").value.trim();
      const birthtimeStr = document.getElementById("inputBirthtime").value.trim();
      const yearVal = parseInt(birthdayStr.substring(0, 4), 10);
      const monthVal = parseInt(birthdayStr.substring(4, 6), 10);
      const dayVal = parseInt(birthdayStr.substring(6, 8), 10);
      const hourVal = parseInt(birthtimeStr.substring(0, 2), 10);
      const minuteVal = parseInt(birthtimeStr.substring(2, 4), 10);
      const genderVal = document.getElementById("genderMan").checked ? "남" :
                        document.getElementById("genderWoman").checked ? "여" : "-";
      const birthPlaceVal = document.getElementById("inputBirthPlace").value || "-";
      const time2 = document.querySelector('input[name="time2"]:checked').value;
      return { year: yearVal, month: monthVal, day: dayVal, hour: hourVal, minute: minuteVal, gender: genderVal, birthPlace: birthPlaceVal, time2: time2 };
    }
    
    const inputData = collectInputData();
    const selectedTime2 = document.querySelector('input[name="time2"]:checked').value;
    if (selectedTime2 === "jasi") {
      document.getElementById("timeChk02_01").checked = true;
    } else if (selectedTime2 === "yajojasi") {
      document.getElementById("timeChk02_02").checked = true;
    } else if (selectedTime2 === "insi") {
      document.getElementById("timeChk02_03").checked = true;
    }
    
    const resultRadios = document.querySelectorAll('#checkOption input[type="radio"]');
    resultRadios.forEach(function(radio) {
      radio.addEventListener("change", function () {
        const selectedTime2 = document.querySelector('input[name="timeChk02"]:checked').value;
        document.querySelectorAll('input[name="time2"]').forEach(el => el.checked = false);
        if (selectedTime2 === "jasi") {
          document.getElementById("jasi").checked = true;
        } else if (selectedTime2 === "yajojasi") {
          document.getElementById("yajojasi").checked = true;
        } else if (selectedTime2 === "insi") {
          document.getElementById("insi").checked = true;
        }
        updateFortune(inputData);
      });
    });
    
    document.getElementById('resultWrapper').style.display = 'block';
    document.getElementById('inputWrap').style.display = 'none';
  });
});