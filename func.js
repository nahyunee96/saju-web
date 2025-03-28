// func.js
import {
  setText,
  pad,
  getTenGodForStem,
  getTenGodForBranch
} from './common.js';


import {
  updatePillarInfo,
  updateBranchInfo,
  updateOriginalSetMapping,
  updateMyowoonSection,
  updateStemInfo,
  updateColorClasses,
  updateHiddenStems
} from './ui.js';

// ====================================================
// [Main DOMContentLoaded Handler]
document.addEventListener("DOMContentLoaded", function () {
  // 이름 글자수 제한
  const inputName = document.getElementById("inputName");
  if (inputName) {
    inputName.addEventListener("input", function () {
      if (this.value.length > 10) {
        this.value = this.value.slice(0, 10);
      }
    });
  }

  // 계산 버튼 이벤트 핸들러
  document.getElementById("calcBtn").addEventListener("click", function () {
    let refDate = new Date();
    const name = document.getElementById("inputName").value.trim() || "-";
    const birthdayStr = document.getElementById("inputBirthday").value.trim();
    const birthtimeStr = document.getElementById("inputBirthtime").value.trim();
    const gender = document.getElementById("genderMan").checked ? "남"
                  : (document.getElementById("genderWoman").checked ? "여" : "-");
    const birthPlace = document.getElementById("inputBirthPlace").value || "-";

    // 입력 검증
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

    // 생년월일 및 시간 파싱
    let year = parseInt(birthdayStr.substring(0, 4), 10);
    let month = parseInt(birthdayStr.substring(4, 6), 10);
    let day = parseInt(birthdayStr.substring(6, 8), 10);
    let hour = parseInt(birthtimeStr.substring(0, 2), 10);
    let minute = parseInt(birthtimeStr.substring(2, 4), 10);
    let birthDate = new Date(year, month - 1, day, hour, minute);

    // 음력/양력 변환 (KoreanLunarCalendar 필요)
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
        birthDate = new Date(year, month - 1, day, hour, minute);
      }
    } else {
      if (!calendar.setSolarDate(year, month, day)) {
        console.error("양력 날짜 설정에 실패했습니다.");
      } else {
        lunarDate = calendar.getLunarCalendar();
      }
    }

    // correctedDate 계산
    const originalDate = new Date(year, month - 1, day, hour, minute);
    const correctedDate = adjustBirthDate(originalDate, birthPlace);
    globalState.correctedBirthDate = correctedDate;
    setText("resBirth", `${year}-${pad(month)}-${pad(day)}`);
    setText("resBirth2", lunarDate ? `${lunarDate.year}-${pad(lunarDate.month)}-${pad(lunarDate.day)}${lunarDate.isLeap ? " (윤달)" : ""}` : "-");

    // 원국 사주 계산
    const solarDate = globalState.correctedBirthDate;
    const fullResult = getFourSetsWithDaewoon(
      solarDate.getFullYear(),
      solarDate.getMonth() + 1,
      solarDate.getDate(),
      hour, minute,
      birthPlace,
      gender
    );
    const parts = fullResult.split(", ");
    const pillarsPart = parts[0] || "-";
    const [yearPillar, monthPillar, dayPillar, hourPillar] = pillarsPart.split(" ");
    const yearSplit = splitSet(yearPillar);
    const monthSplit = splitSet(monthPillar);
    const daySplit = splitSet(dayPillar);
    const hourSplit = splitSet(hourPillar);

    const natalChartData = { birthDate, yearPillar, monthPillar, dayPillar, hourPillar };
    const BirthDateObj = new Date(birthDate.getFullYear(), birthDate.getMonth(), birthDate.getDate(), birthDate.getHours(), birthDate.getMinutes());
    const adjustedBirthDateObj = new Date(birthDate.getFullYear() + 1, birthDate.getMonth(), birthDate.getDate(), birthDate.getHours(), birthDate.getMinutes());

    const birthYearPillar = yearPillar;
    const birthMonthPillar = monthPillar;
    const baseDayStem = daySplit.gan;
    const baseYearBranch = birthYearPillar.charAt(1);

    // 날짜 유효성 검사
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

    globalState.birthYear = year;
    globalState.month = month;
    globalState.day = day;
    globalState.birthPlace = birthPlace;
    globalState.gender = gender;

    setText("resName", name);
    setText("resGender", gender);
    setText("resBirth", `${year}-${pad(month)}-${pad(day)}`);
    setText("resTime", `${pad(hour)}:${pad(minute)}`);
    setText("resAddr", birthPlace);
    document.getElementById("resbjTime").innerHTML =
      correctedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    // 원국 기둥 업데이트
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

    // 대운 업데이트
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
      setText("DwtHanja", stemMapping[currentDaewoon.stem]?.hanja || "-");
      setText("DwtHanguel", stemMapping[currentDaewoon.stem]?.hanguel || "-");
      setText("DwtEumyang", stemMapping[currentDaewoon.stem]?.eumYang || "-");
      setText("Dwt10sin", getTenGodForStem(currentDaewoon.stem, baseDayStem));
      setText("DwbHanja", branchMapping[currentDaewoon.branch]?.hanja || "-");
      setText("DwbHanguel", branchMapping[currentDaewoon.branch]?.hanguel || "-");
      setText("DwbEumyang", branchMapping[currentDaewoon.branch]?.eumYang || "-");
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
    globalState.daewoonData = getDaewoonData(birthPlace, gender);
    for (let i = 0; i < 10; i++) {
      updateDaewoonItem(i, globalState.daewoonData.list[i]);
    }

    const birthDateObj = new Date(year, month - 1, day);
    const todayObj = new Date();
    let currentAgeCalc = todayObj.getFullYear() - birthDateObj.getFullYear();
    if (todayObj.getMonth() < birthDateObj.getMonth() ||
       (todayObj.getMonth() === birthDateObj.getMonth() && todayObj.getDate() < birthDateObj.getDate())) {
      currentAgeCalc--;
    }
    let currentDaewoonIndex = 0;
    if (globalState.daewoonData?.list) {
      for (let i = 0; i < globalState.daewoonData.list.length; i++) {
        if (globalState.daewoonData.list[i].age <= currentAgeCalc) {
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
      setText("SwtHanja", stemMapping[sewoonSplit.gan]?.hanja || "-");
      setText("SwtHanguel", stemMapping[sewoonSplit.gan]?.hanguel || "-");
      setText("SwtEumyang", stemMapping[sewoonSplit.gan]?.eumYang || "-");
      setText("Swt10sin", getTenGodForStem(sewoonSplit.gan, baseDayStem));
      setText("SwbHanja", branchMapping[sewoonSplit.ji]?.hanja || "-");
      setText("SwbHanguel", branchMapping[sewoonSplit.ji]?.hanguel || "-");
      setText("SwbEumyang", branchMapping[sewoonSplit.ji]?.eumYang || "-");
      setText("Swb10sin", getTenGodForBranch(sewoonSplit.ji, baseDayStem));
      const sewoonHidden = hiddenStemMapping[sewoonSplit.ji] || ["-", "-", "-"];
      setText("SwJj1", sewoonHidden[0]);
      setText("SwJj2", sewoonHidden[1]);
      setText("SwJj3", sewoonHidden[2]);
      setText("SWb12ws", getTwelveUnseong(baseDayStem, sewoonSplit.ji));
      setText("SWb12ss", getTwelveShinsal(baseYearBranch, sewoonSplit.ji));
      
      setText("WSwtHanja", stemMapping[sewoonSplit.gan]?.hanja || "-");
      setText("WSwtHanguel", stemMapping[sewoonSplit.gan]?.hanguel || "-");
      setText("WSwtEumyang", stemMapping[sewoonSplit.gan]?.eumYang || "-");
      setText("WSwt10sin", getTenGodForStem(sewoonSplit.gan, baseDayStem));
      setText("WSwbHanja", branchMapping[sewoonSplit.ji]?.hanja || "-");
      setText("WSwbHanguel", branchMapping[sewoonSplit.ji]?.hanguel || "-");
      setText("WSwbEumyang", branchMapping[sewoonSplit.ji]?.eumYang || "-");
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
      if (globalState.daewoonData && globalState.daewoonData.list[index - 1]) {
        const data = globalState.daewoonData.list[index - 1];
        setText("daewoonDetail", `${data.age}세 (${data.stem}${data.branch})`);
      }
    }

    function updateSewoonDetails(index) {
      if (globalState.sewoonStartYear) {
        const computedYear = globalState.sewoonStartYear + (index - 1);
        const yearGanZhi = getYearGanZhiForSewoon(computedYear);
        const splitYear = splitSet(yearGanZhi);
        setText("sewoonDetail", `${computedYear}년 (${splitYear.gan}${splitYear.ji})`);
      }
    }

    let activeDaewoonLi = document.querySelector("[id^='daewoon_'].active");
    let daewoonIndex = activeDaewoonLi ? parseInt(activeDaewoonLi.getAttribute("data-index"), 10) : 1;
    if (!globalState.birthYear || !globalState.daewoonData) {
      alert("먼저 계산 버튼을 눌러 출생 정보를 입력하세요.");
      return;
    }
    const selectedDaewoon = globalState.daewoonData.list[daewoonIndex - 1];
    if (!selectedDaewoon) return;
    const daewoonNum = selectedDaewoon.age;
    const sewoonStartYear = globalState.birthYear + (daewoonNum - 1);
    globalState.sewoonStartYear = sewoonStartYear;
    const displayedDayPillar = document.getElementById("DtHanguel").innerText;
    const baseDayStemS = displayedDayPillar ? displayedDayPillar.charAt(0) : "-";
    const sewoonList = [];
    for (let j = 0; j < 10; j++) {
      let sewoonYear = globalState.sewoonStartYear + j;
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
      setText("SC_" + idx, stemMapping[item.gan]?.hanja || "-");
      setText("SJ_" + idx, branchMapping[item.ji]?.hanja || "-");
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

    let currentSewoonIndex = displayYear - globalState.sewoonStartYear;
    if (currentSewoonIndex < 0) currentSewoonIndex = 0;
    if (currentSewoonIndex > 9) currentSewoonIndex = 9;
    const computedSewoonYear = globalState.sewoonStartYear + currentSewoonIndex;
    updateMonthlyData(computedSewoonYear);
    const monthlyContainer = document.getElementById("walwoonArea");
    if (monthlyContainer) { monthlyContainer.style.display = "grid"; }
    updateColorClasses();
    updateOriginalSetMapping();
    updateListMapping(globalState.daewoonData.list, "DwW", "Ds", baseDayStem, baseYearBranch);
    if (globalState.sewoonList && globalState.sewoonList.length > 0) {
      updateListMapping(globalState.sewoonList, "SwW", "Ss", baseDayStem, baseYearBranch);
    }
    if (globalState.monthWoonList && globalState.monthWoonList.length > 0) {
      updateListMapping(globalState.monthWoonList, "MwW", "Ms", baseDayStem, baseYearBranch);
    }

    function updateMonthlyData(computedYear) {
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
        setText("MC_" + (i + 1), stemMapping[monthStem]?.hanja || "-");
        setText("MJ_" + (i + 1), branchMapping[monthBranch]?.hanja || "-");
        setText("Mot10sin" + (i + 1), tenGodStem || "-");
        setText("Mob10sin" + (i + 1), tenGodBranch || "-");
        setText("MwW_" + (i + 1), unseong || "-");
        setText("Ms_" + (i + 1), shinsal || "-");
        setText("Dm_" + (i + 1), displayMonth || "-");
      }
    }

    function updateMonthlyWoon(computedYear, currentMonthIndex) {
      const boundaries = getSolarTermBoundaries(computedYear);
      if (!boundaries || boundaries.length === 0) return;
      const cycleStartDate = boundaries[0].date;
      const dayPillarText = document.getElementById("DtHanguel").innerText;
      const baseDayStem = dayPillarText ? dayPillarText.charAt(0) : "-";
      const yearPillar = getYearGanZhi(cycleStartDate, computedYear);
      if (!yearPillar) {
        console.error("updateMonthlyWoon: getYearGanZhi returned undefined");
        return;
      }
      const yearStem = yearPillar.charAt(0);
      const yearStemIndex = Cheongan.indexOf(yearStem);
      const monthNumber = currentMonthIndex + 1;
      const monthStemIndex = (((yearStemIndex * 2) + monthNumber - 1) + 4) % 10;
      const monthStem = Cheongan[monthStemIndex];
      const monthBranch = MONTH_ZHI[monthNumber - 1];
      const tenGodStem = getTenGodForStem(monthStem, baseDayStem);
      const tenGodBranch = getTenGodForBranch(monthBranch, baseDayStem);
      const unseong = getTwelveUnseong(baseDayStem, monthBranch);
      const shinsal = getTwelveShinsal(baseYearBranch, monthBranch);
      setText("WMtHanja", stemMapping[monthStem]?.hanja || "-");
      setText("WMtHanguel", stemMapping[monthStem]?.hanguel || "-");
      setText("WMtEumyang", stemMapping[monthStem]?.eumYang || "-");
      setText("WMt10sin", tenGodStem || "-");
      setText("WMbHanja", branchMapping[monthBranch]?.hanja || "-");
      setText("WMbHanguel", branchMapping[monthBranch]?.hanguel || "-");
      setText("WMbEumyang", branchMapping[monthBranch]?.eumYang || "-");
      setText("WMb10sin", tenGodBranch || "-");
      updateHiddenStems(monthBranch, "WMb");
      setText("WMb12ws", unseong || "-");
      setText("WMb12ss", shinsal || "-");
      updateColorClasses();
    }

    function updateMonthlyWoonByToday(refDate) {
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
    updateMonthlyWoonByToday(refDate);

    document.addEventListener("click", function (event) {
      const btn = event.target.closest("#calPrevBtn, #calNextBtn");
      if (!btn) return;
      const solarYear = globalState.solarYear;
      const boundaries = globalState.boundaries;
      const currentIndex = globalState.currentIndex;
      if (solarYear === undefined || !boundaries || currentIndex === undefined) return;
      let newIndex;
      if (btn.id === "calPrevBtn") {
        newIndex = (currentIndex - 1 + boundaries.length) % boundaries.length;
      } else if (btn.id === "calNextBtn") {
        newIndex = (currentIndex + 1) % boundaries.length;
      }
      const newTermName = boundaries[newIndex].name;
      updateMonthlyFortuneCalendar(newTermName, solarYear, newIndex);
      setTimeout(function () {
        const liElements = Array.from(document.querySelectorAll("#mowoonList li"));
        if (!liElements.length) return;
        liElements.forEach(li => li.classList.remove("active"));
        const targetIndex = newIndex % liElements.length;
        liElements[targetIndex].classList.add("active");
      }, 0);
    });

    const currentSolarYear = (todayObj < ipChun) ? todayObj.getFullYear() - 1 : todayObj.getFullYear();
    let boundariesArr = getSolarTermBoundaries(currentSolarYear);
    let currentTerm = boundariesArr.find((term, idx) => {
      let next = boundariesArr[idx + 1] || { date: new Date(term.date.getTime() + 30 * 24 * 60 * 60 * 1000) };
      return todayObj >= term.date && todayObj < next.date;
    });
    if (!currentTerm) { currentTerm = boundariesArr[0]; }
    function generateDailyFortuneCalendar(solarTermName, startDate, endDate, baseDayStem, currentIndex, boundaries, solarYear) {
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
        const tenGodCheongan = getTenGodForStem(stem, globalState.baseDayStem);
        const tenGodJiji = getTenGodForBranch(branch, globalState.baseDayStem);
        const twelveUnseong = getTwelveUnseong(globalState.baseDayStem, branch);
        const twelveShinsal = getTwelveShinsal(globalState.baseYearBranch, branch);
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

    function updateMonthlyFortuneCalendar(solarTermName, computedYear, newIndexOpt) {
      const today = new Date();
      const solarYear = computedYear || (function () {
        const ipChun = findSolarTermDate(today.getFullYear(), 315);
        return (today < ipChun) ? today.getFullYear() - 1 : today.getFullYear();
      })();
      let boundaries = getSolarTermBoundaries(solarYear);
      if (!Array.isArray(boundaries)) {
        boundaries = Array.from(boundaries);
      }
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
        if (!Array.isArray(nextBoundaries)) {
          nextBoundaries = Array.from(nextBoundaries);
        }
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
        globalState.baseDayStem,
        currentIndex,
        boundaries,
        solarYear
      );
      const container = document.getElementById("iljuCalender");
      if (container) {
        container.innerHTML = calendarHTML;
      }
      globalState.solarYear = solarYear;
      globalState.boundaries = boundaries;
      globalState.currentIndex = currentIndex;
      globalState.computedYear = solarYear;
      const now = new Date();
      const activeMonth = globalState.activeMonth || (now.getMonth() + 1);
      document.querySelectorAll("#mowoonList li").forEach(function (li) {
        const liMonth = parseInt(li.getAttribute("data-index3"), 10);
        li.classList.toggle("active", liMonth === activeMonth);
      });
    }
    updateMonthlyFortuneCalendar(currentTerm.name, currentSolarYear);

    document.querySelectorAll("[id^='daewoon_']").forEach(function (daewoonLi) {
      daewoonLi.addEventListener("click", function (event) {
        event.stopPropagation();
        document.getElementById('iljuCalender').style.display = 'none';
        const sewoonBox = document.querySelector(".lucky.sewoon");
        if (sewoonBox) { sewoonBox.style.display = "none"; }
        document.querySelectorAll("#sewoonList li").forEach(li => li.classList.remove("active"));
        const monthlyContainer = document.getElementById("walwoonArea");
        if (monthlyContainer) { monthlyContainer.style.display = "none"; }
        const daewoonIndex = parseInt(this.getAttribute("data-index"), 10);
        if (!globalState.birthYear || !globalState.daewoonData) {
          alert("먼저 계산 버튼을 눌러 출생 정보를 입력하세요.");
          return;
        }
        const selectedDaewoon = globalState.daewoonData.list[daewoonIndex - 1];
        if (!selectedDaewoon) return;
        const daewoonNum = selectedDaewoon.age;
        const sewoonStartYear = globalState.birthYear + (daewoonNum - 1);
        globalState.sewoonStartYear = sewoonStartYear;
        const displayedDayPillar = document.getElementById("DtHanguel").innerText;
        const baseDayStemS = displayedDayPillar ? displayedDayPillar.charAt(0) : "-";
        const sewoonList = [];
        for (let j = 0; j < 10; j++) {
          let sewoonYear = globalState.sewoonStartYear + j;
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
          setText("SC_" + idx, stemMapping[item.gan]?.hanja || "-");
          setText("SJ_" + idx, branchMapping[item.ji]?.hanja || "-");
          setText("st10sin" + idx, item.tenGod);
          setText("sb10sin" + idx, item.tenGodJiji);
          setText("SwW" + idx, getTwelveUnseong(globalState.baseDayStem, item.ji) || "-");
          setText("Ss" + idx, getTwelveShinsal(globalState.baseYearBranch, item.ji) || "-");
          setText("Dy" + idx, item.year);
        });
        function updateDaewoonHTML(selectedDaewoon, baseDayStem) {
          setText("DwtHanja", stemMapping[selectedDaewoon.stem]?.hanja || "-");
          setText("DwtHanguel", stemMapping[selectedDaewoon.stem]?.hanguel || "-");
          setText("DwtEumyang", stemMapping[selectedDaewoon.stem]?.eumYang || "-");
          setText("Dwt10sin", getTenGodForStem(selectedDaewoon.stem, baseDayStem));
          setText("DwbHanja", branchMapping[selectedDaewoon.branch]?.hanja || "-");
          setText("DwbHanguel", branchMapping[selectedDaewoon.branch]?.hanguel || "-");
          setText("DwbEumyang", branchMapping[selectedDaewoon.branch]?.eumYang || "-");
          setText("Dwb10sin", getTenGodForBranch(selectedDaewoon.branch, baseDayStem));
          const daewoonHidden = hiddenStemMapping[selectedDaewoon.branch] || ["-", "-", "-"];
          setText("DwJj1", daewoonHidden[0]);
          setText("DwJj2", daewoonHidden[1]);
          setText("DwJj3", daewoonHidden[2]);
        }
        updateDaewoonHTML(selectedDaewoon, baseDayStemS);
        updateColorClasses();
        const computedYear = globalState.sewoonStartYear;
        const boundariesForSewoon = getSolarTermBoundaries(computedYear);
        const targetSolarTerm = boundariesForSewoon[0].name;
        updateMonthlyFortuneCalendar(targetSolarTerm, computedYear);
        document.querySelectorAll("#mowoonList li").forEach(li => li.classList.remove("active"));
      });
    });

    document.querySelectorAll("[id^='Sewoon_']").forEach(function (sewoonLi) {
      sewoonLi.addEventListener("click", function (event) {
        event.stopPropagation();
        document.getElementById('iljuCalender').style.display = 'none';
        const sewoonBox = document.querySelector(".lucky.sewoon");
        if (sewoonBox) { sewoonBox.style.display = "grid"; }
        const monthlyContainer = document.getElementById("walwoonArea");
        if (monthlyContainer) { monthlyContainer.style.display = "grid"; }
        const sewoonIndex = parseInt(this.getAttribute("data-index2"), 10);
        if (!globalState.sewoonStartYear) {
          alert("먼저 대운을 선택하여 세운 시작연도를 계산하세요.");
          return;
        }
        const computedYear = globalState.sewoonStartYear + (sewoonIndex - 1);
        updateMonthlyData(computedYear);
        const displayedDayPillar = document.getElementById("DtHanguel").innerText;
        const baseDayStemS = displayedDayPillar ? displayedDayPillar.charAt(0) : "-";
        let yearGanZhi = getYearGanZhiForSewoon(computedYear);
        const splitYear = splitSet(yearGanZhi);
        const tenGod = getTenGodForStem(splitYear.gan, baseDayStemS);
        const tenGodJiji = getTenGodForBranch(splitYear.ji, baseDayStemS);
        const selectedSewoon = {
          year: computedYear,
          gan: splitYear.gan,
          ji: splitYear.ji,
          tenGod: tenGod,
          tenGodJiji: tenGodJiji
        };
        function updateSewoonHTML(selectedSewoon, baseDayStem) {
          setText("SwtHanja", stemMapping[selectedSewoon.gan]?.hanja || "-");
          setText("SwtHanguel", stemMapping[selectedSewoon.gan]?.hanguel || "-");
          setText("SwtEumyang", stemMapping[selectedSewoon.gan]?.eumYang || "-");
          setText("Swt10sin", getTenGodForStem(selectedSewoon.gan, baseDayStem));
          setText("SwbHanja", branchMapping[selectedSewoon.ji]?.hanja || "-");
          setText("SwbHanguel", branchMapping[selectedSewoon.ji]?.hanguel || "-");
          setText("SwbEumyang", branchMapping[selectedSewoon.ji]?.eumYang || "-");
          setText("Swb10sin", getTenGodForBranch(selectedSewoon.ji, baseDayStem));
          const sewoonHidden = hiddenStemMapping[selectedSewoon.ji] || ["-", "-", "-"];
          setText("SwJj1", sewoonHidden[0]);
          setText("SwJj2", sewoonHidden[1]);
          setText("SwJj3", sewoonHidden[2]);
          setText("SWb12ws", getTwelveUnseong(globalState.baseDayStem, selectedSewoon.ji));
          setText("SWb12ss", getTwelveShinsal(globalState.baseYearBranch, selectedSewoon.ji));
          setText("WSwtHanja", stemMapping[selectedSewoon.gan]?.hanja || "-");
          setText("WSwtHanguel", stemMapping[selectedSewoon.gan]?.hanguel || "-");
          setText("WSwtEumyang", stemMapping[selectedSewoon.gan]?.eumYang || "-");
          setText("WSwt10sin", getTenGodForStem(selectedSewoon.gan, globalState.baseDayStem));
          setText("WSwbHanja", branchMapping[selectedSewoon.ji]?.hanja || "-");
          setText("WSwbHanguel", branchMapping[selectedSewoon.ji]?.hanguel || "-");
          setText("WSwbEumyang", branchMapping[selectedSewoon.ji]?.eumYang || "-");
          setText("WSwb10sin", getTenGodForBranch(selectedSewoon.ji, globalState.baseDayStem));
          setText("WSwJj1", sewoonHidden[0]);
          setText("WSwJj2", sewoonHidden[1]);
          setText("WSwJj3", sewoonHidden[2]);
          setText("WSWb12ws", getTwelveUnseong(globalState.baseDayStem, selectedSewoon.ji));
          setText("WSWb12ss", getTwelveShinsal(globalState.baseYearBranch, selectedSewoon.ji));
          updateColorClasses();
        }
        updateSewoonHTML(selectedSewoon, baseDayStemS);
        const sewoonLis = document.querySelectorAll("#sewoonList li");
        sewoonLis.forEach(li => li.classList.remove("active"));
      });

    globalState.computedYear = currentSolarYear;
    if (!currentTerm) { currentTerm = boundariesArr[0]; }
    updateMonthlyFortuneCalendar(currentTerm.name, currentSolarYear);
    (function setupMowoonListActive() {
      const displayedMonth = currentTerm.date.getMonth() + 1;
      document.querySelectorAll("#mowoonList li").forEach(function (li) {
        const liMonth = parseInt(li.getAttribute("data-index3"), 10);
        li.classList.toggle("active", liMonth === displayedMonth);
      });
    })();

    document.querySelectorAll("#mowoonList li").forEach(function(li) {
      li.addEventListener("click", function(event) {
        event.stopPropagation();
        document.querySelectorAll("#mowoonList li").forEach(function(item) {
          item.classList.remove("active");
        });
        li.classList.add("active");
        document.getElementById('iljuCalender').style.display = 'grid';
        const termName = li.getAttribute("data-solar-term") || "";
        const computedYear = globalState.computedYear || (function(){
          const today = new Date();
          const ipChun = findSolarTermDate(today.getFullYear(), 315);
          return (today < ipChun) ? today.getFullYear() - 1 : today.getFullYear();
        })();
        globalState.activeMonth = parseInt(li.getAttribute("data-index3"), 10);
        updateMonthlyFortuneCalendar(termName, computedYear);
      });
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
});
