document.addEventListener("DOMContentLoaded", function () {
  const inputName = document.getElementById("inputName");
  if (inputName) {
    inputName.addEventListener("input", function () {
      if (this.value.length > 10) {
        this.value = this.value.slice(0, 10);
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
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

    // correctedDate (경도, 서머타임 보정 적용)
    const originalDate = new Date(year, month - 1, day, hour, minute);
    const correctedDate = adjustBirthDate(originalDate, birthPlace);
    globalState.correctedBirthDate = correctedDate;

    const formattedBirth = `${year}-${pad(month)}-${pad(day)}`;
    setText("resBirth", formattedBirth);
    if (lunarDate) {
      const formattedLunar = `${lunarDate.year}-${pad(lunarDate.month)}-${pad(lunarDate.day)}${lunarDate.isLeap ? " (윤달)" : ""}`;
      setText("resBirth2", formattedLunar);
    } else {
      setText("resBirth2", "-");
    }

    // 원국 사주 계산
    const solarDate = globalState.correctedBirthDate;
    const fullResult = getFourPillarsWithDaewoon(
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
    const yearSplit  = splitPillar(yearPillar);
    const monthSplit = splitPillar(monthPillar);
    const daySplit   = splitPillar(dayPillar);
    const hourSplit  = splitPillar(hourPillar);

    const natalChartData = {
      birthDate: birthDate,
      dayPillar: dayPillar,   
      hourPillar: hourPillar,  
      yearPillar: yearPillar   
    };

    const BirthDateObj = new Date(
      birthDate.getFullYear() + 1,
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

    globalState.originalDayStem = daySplit.gan;
    const baseDayStem = globalState.originalDayStem;

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

    const formattedTime = `${pad(hour)}:${pad(minute)}`;
    setText("resName", name);
    setText("resGender", gender);
    setText("resBirth", formattedBirth);
    setText("resTime", formattedTime);
    setText("resAddr", birthPlace);
    const correctedTime = adjustBirthDate(originalDate, birthPlace);
    document.getElementById("resbjTime").innerHTML =
      correctedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    updatePillarInfo("Yt", yearSplit, baseDayStem);
    updatePillarInfo("Mt", monthSplit, baseDayStem);
    updatePillarInfo("Dt", daySplit, baseDayStem);
    updatePillarInfo("Ht", hourSplit, baseDayStem);
    updateBranchInfo("Yb", yearSplit.ji, baseDayStem);
    updateBranchInfo("Mb", monthSplit.ji, baseDayStem);
    updateBranchInfo("Db", daySplit.ji, baseDayStem);
    updateBranchInfo("Hb", hourSplit.ji, baseDayStem);
    updateOriginalPillarMapping(yearSplit, monthSplit, daySplit, hourSplit);
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
      setText("DWb12ws", getTwelveUnseong(daySplit.gan, currentDaewoon.branch));
      setText("DWb12ss", getTwelveShinsal(yearSplit.ji, currentDaewoon.branch));
    }
    updateCurrentDaewoon();
    updateMonthlyWoonByToday(new Date());
    globalState.daewoonData = getDaewoonData(birthPlace, gender);

    const _basedaytem = globalState.originalDayStem;
    function updateDaewoonItem(i, item) {
      const forwardGanji = item.stem + item.branch;
      const finalStem = forwardGanji.charAt(0);
      const finalBranch = forwardGanji.charAt(1);
      const idx = i + 1;
      setText("DC_" + idx, stemMapping[finalStem]?.hanja || "-");
      setText("DJ_" + idx, branchMapping[finalBranch]?.hanja || "-");
      setText("dt10sin" + idx, getTenGodForStem(finalStem, _basedaytem) || "-");
      setText("db10sin" + idx, getTenGodForBranch(finalBranch, _basedaytem) || "-");
      setText("DwW" + idx, "-");
      setText("Ds" + idx, "-");
      setText("Da" + idx, item.age);
    }
    for (let i = 0; i < 10; i++) {
      updateDaewoonItem(i, globalState.daewoonData.list[i]);
    }

    const birthDateObj = new Date(year, month - 1, day);
    const todayObj = new Date();
    let currentAge = todayObj.getFullYear() - birthDateObj.getFullYear();
    if (todayObj.getMonth() < birthDateObj.getMonth() ||
       (todayObj.getMonth() === birthDateObj.getMonth() && todayObj.getDate() < birthDateObj.getDate())) {
      currentAge--;
    }
    let currentDaewoonIndex = 0;
    if (globalState.daewoonData?.list) {
      for (let i = 0; i < globalState.daewoonData.list.length; i++) {
        if (globalState.daewoonData.list[i].age <= currentAge) {
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
      const sewoonSplit = splitPillar(sewoonGanZhi);
      let baseDayStem = globalState.originalDayStem;
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
      setText("SWb12ws", getTwelveUnseong(sewoonSplit.gan, sewoonSplit.ji));
      setText("SWb12ss", getTwelveShinsal(sewoonSplit.ji, sewoonSplit.ji));
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
      setText("WSWb12ws", getTwelveUnseong(sewoonSplit.gan, sewoonSplit.ji));
      setText("WSWb12ss", getTwelveShinsal(sewoonSplit.ji, sewoonSplit.ji));
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
        const splitYear = splitPillar(yearGanZhi);
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
      const splitYear = splitPillar(yearGanZhi);
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
      setText("SwW" + idx, getTwelveUnseong(daySplit.gan, item.ji) || "-");
      setText("Ss" + idx, getTwelveShinsal(yearSplit.ji, item.ji) || "-");
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
    updateOriginalPillarMapping(yearSplit, monthSplit, daySplit, hourSplit);
    updateListMapping(globalState.daewoonData.list, "DwW", "Ds", daySplit.gan, yearSplit.ji);
    if (globalState.sewoonList && globalState.sewoonList.length > 0) {
      updateListMapping(globalState.sewoonList, "SwW", "Ss", daySplit.gan, yearSplit.ji);
    }
    if (globalState.monthWoonList && globalState.monthWoonList.length > 0) {
      updateListMapping(globalState.monthWoonList, "MwW", "Ms", daySplit.gan, yearSplit.ji);
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
        const unseong = getTwelveUnseong(daySplit.gan, monthBranch);
        const shinsal = getTwelveShinsal(yearSplit.ji, monthBranch);
        setText("MC_" + (i + 1), stemMapping[monthStem]?.hanja || "-");
        setText("MJ_" + (i + 1), branchMapping[monthBranch]?.hanja || "-");
        setText("Mot10sin" + (i + 1), tenGodStem || "-");
        setText("Mob10sin" + (i + 1), tenGodBranch || "-");
        setText("MwW" + (i + 1), unseong || "-");
        setText("Ms" + (i + 1), shinsal || "-");
        setText("Dm" + (i + 1), displayMonth || "-");
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
      const unseong = getTwelveUnseong(daySplit.gan, monthBranch);
      const shinsal = getTwelveShinsal(yearSplit.ji, monthBranch);
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
        const tenGodCheongan = getTenGodForStem(stem, baseDayStem);
        const tenGodJiji = getTenGodForBranch(branch, baseDayStem);
        const twelveUnseong = getTwelveUnseong(baseDayStem, branch);
        const twelveShinsal = getTwelveShinsal(branch, baseDayStem);
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
        baseDayStem,
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
          const splitYear = splitPillar(yearGanZhi);
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
          setText("SwW" + idx, getTwelveUnseong(daySplit.gan, item.ji) || "-");
          setText("Ss" + idx, getTwelveShinsal(yearSplit.ji, item.ji) || "-");
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
        const splitYear = splitPillar(yearGanZhi);
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
          setText("SWb12ws", getTwelveUnseong(daySplit.gan, selectedSewoon.ji));
          setText("SWb12ss", getTwelveShinsal(yearSplit.ji, selectedSewoon.ji));
          setText("WSwtHanja", stemMapping[selectedSewoon.gan]?.hanja || "-");
          setText("WSwtHanguel", stemMapping[selectedSewoon.gan]?.hanguel || "-");
          setText("WSwtEumyang", stemMapping[selectedSewoon.gan]?.eumYang || "-");
          setText("WSwt10sin", getTenGodForStem(selectedSewoon.gan, baseDayStem));
          setText("WSwbHanja", branchMapping[selectedSewoon.ji]?.hanja || "-");
          setText("WSwbHanguel", branchMapping[selectedSewoon.ji]?.hanguel || "-");
          setText("WSwbEumyang", branchMapping[selectedSewoon.ji]?.eumYang || "-");
          setText("WSwb10sin", getTenGodForBranch(selectedSewoon.ji, baseDayStem));
          setText("WSwJj1", sewoonHidden[0]);
          setText("WSwJj2", sewoonHidden[1]);
          setText("WSwJj3", sewoonHidden[2]);
          setText("WSWb12ws", getTwelveUnseong(daySplit.gan, selectedSewoon.ji));
          setText("WSWb12ss", getTwelveShinsal(yearSplit.ji, selectedSewoon.ji));
          updateColorClasses();
        }
        updateSewoonHTML(selectedSewoon, baseDayStemS);
        const sewoonLis = document.querySelectorAll("#sewoonList li");
        sewoonLis.forEach(li => li.classList.remove("active"));
        if (sewoonLis[sewoonIndex - 1]) { sewoonLis[sewoonIndex - 1].classList.add("active"); }
        updateColorClasses();
        const boundariesForSewoon = getSolarTermBoundaries(computedYear);
        const targetSolarTerm = boundariesForSewoon[0].name;
        updateMonthlyFortuneCalendar(targetSolarTerm, computedYear);
        document.querySelectorAll("#mowoonList li").forEach(li => li.classList.remove("active"));
      });
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

    const birthYearPillar = yearPillar;
    const birthMonthPillar = monthPillar;

    function getMyounPillars(birthYearPillar, birthMonthPillar, birthDateObj, refDate, gender) {
      // [A] 연주 계산
      let finalYearPillar = birthYearPillar;
      function getAgeByDate(birthDate) {
        let age = refDate.getFullYear() - birthDate.getFullYear();
        const m = refDate.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && refDate.getDate() < birthDate.getDate())) {
          age--;
        }
        return age;
      }
      const ageOnRef = getAgeByDate(birthDateObj, refDate);
      const firstBirthday = new Date(birthDateObj);
      firstBirthday.setFullYear(firstBirthday.getFullYear() + 1);
      if (refDate < firstBirthday || ageOnRef < 61) {
        finalYearPillar = birthYearPillar;
      } else {
        const originalIndex = getGanZhiIndex(birthYearPillar);
        const correctedDate = adjustBirthDate(birthDateObj, birthPlace);
        const originalYearPillarData = getYearGanZhi(correctedDate, adjustedBirthDateObj.getFullYear());
        if (originalIndex >= 0) {
          const isYangStem = ["갑", "병", "무", "경", "임"].includes(originalYearPillarData.charAt(0));
          const direction = ((gender === "남" && isYangStem) || (gender === "여" && !isYangStem)) ? 1 : -1;
          finalYearPillar = getGanZhiFromIndex(originalIndex - direction);
        }
      }
    
      // [B] 월주 계산
      function getCurrentDaewoonMonthPillar(birthPlace, gender, referenceDate) {
        const currAge = getAgeByDate(birthDate, referenceDate);
        const daewoonData = getDaewoonData(birthPlace, gender); 
        let currentItem = daewoonData.list[0];
        for (let i = 1; i < daewoonData.list.length; i++) {
          if (daewoonData.list[i].age <= currAge) {
            currentItem = daewoonData.list[i]; 
          }
        }
        return currentItem.stem + currentItem.branch;
      }
      
      let finalMonthPillar = birthMonthPillar;
      finalMonthPillar = getCurrentDaewoonMonthPillar(
        BirthDateObj.getFullYear(),
        BirthDateObj.getMonth() + 1,
        BirthDateObj.getDate(),
        birthPlace,
        gender,
        refDate
      );

      let iljuDate = new Date(
        adjustedBirthDateObj.getFullYear(),
        adjustedBirthDateObj.getMonth(),
        adjustedBirthDateObj.getDate(),
        0, 0
      );

      // 시주의 경우, 원국 입력 시간을 그대로 유지하되 1년 보정된 날짜 사용
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

      // [일주] 
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
          lastIljuChangeDate = new Date(iljuDate.getTime());
        } else {
          sijuDate = nextEvent.date;
          sijuIndex = nextEvent.index;
          lastSijuChangeDate = new Date(sijuDate.getTime());
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

    let myounResult = getMyounPillars(birthYearPillar, birthMonthPillar, birthDateObj, refDate, gender);

    // 화면 업데이트: 연/월은 원국값, 일/시는 묘운 계산 결과 사용
    function updateMyowoonSection(myounResult, daySplit, yearSplit) {
      function setText(id, text) {
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
      // 연주 업데이트 
      const yearStem = myounResult.yearPillar.charAt(0), yearBranch = myounResult.yearPillar.charAt(1);
      setText("MyoYtHanja", stemMapping[yearStem] ? stemMapping[yearStem].hanja : yearStem); applyColor("MyoYtHanja", stemMapping[yearStem] ? stemMapping[yearStem].hanja : yearStem);
      setText("MyoYtHanguel", stemMapping[yearStem] ? stemMapping[yearStem].hanguel : yearStem);
      setText("MyoYtEumyang", stemMapping[yearStem] ? stemMapping[yearStem].eumYang : "-");
      setText("MyoYt10sin", getTenGodForStem(yearStem, daySplit.gan));
      setText("MyoYbHanja", branchMapping[yearBranch] ? branchMapping[yearBranch].hanja : yearBranch); applyColor("MyoYbHanja", branchMapping[yearBranch] ? branchMapping[yearBranch].hanja : yearBranch);
      setText("MyoYbHanguel", branchMapping[yearBranch] ? branchMapping[yearBranch].hanguel : yearBranch);
      setText("MyoYbEumyang", branchMapping[yearBranch] ? branchMapping[yearBranch].eumYang : "-");
      setText("MyoYb10sin", getTenGodForBranch(yearBranch, daySplit.gan));
      const hiddenYear = hiddenStemMapping[yearBranch] || ["-", "-", "-"];
      setText("MyoYbJj1", hiddenYear[0]); setText("MyoYbJj2", hiddenYear[1]); setText("MyoYbJj3", hiddenYear[2]);
      setText("MyoYb12ws", getTwelveUnseong(daySplit.gan, yearBranch));
      setText("MyoYb12ss", getTwelveShinsal(yearSplit.ji, yearBranch));

      // 월주 업데이트
      const monthStem = myounResult.monthPillar.charAt(0), monthBranch = myounResult.monthPillar.charAt(1);
      setText("MyoMtHanja", stemMapping[monthStem] ? stemMapping[monthStem].hanja : monthStem); applyColor("MyoMtHanja", stemMapping[monthStem] ? stemMapping[monthStem].hanja : monthStem);
      setText("MyoMtHanguel", stemMapping[monthStem] ? stemMapping[monthStem].hanguel : monthStem);
      setText("MyoMtEumyang", stemMapping[monthStem] ? stemMapping[monthStem].eumYang : "-");
      setText("MyoMt10sin", getTenGodForStem(monthStem, daySplit.gan));
      setText("MyoMbHanja", branchMapping[monthBranch] ? branchMapping[monthBranch].hanja : monthBranch); applyColor("MyoMbHanja", branchMapping[monthBranch] ? branchMapping[monthBranch].hanja : monthBranch);
      setText("MyoMbHanguel", branchMapping[monthBranch] ? branchMapping[monthBranch].hanguel : monthBranch);
      setText("MyoMbEumyang", branchMapping[monthBranch] ? branchMapping[monthBranch].eumYang : "-");
      setText("MyoMb10sin", getTenGodForBranch(monthBranch, daySplit.gan));
      const hiddenMonth = hiddenStemMapping[monthBranch] || ["-", "-", "-"];
      setText("MyoMbJj1", hiddenMonth[0]); setText("MyoMbJj2", hiddenMonth[1]); setText("MyoMbJj3", hiddenMonth[2]);
      setText("MyoMb12ws", getTwelveUnseong(daySplit.gan, monthBranch));
      setText("MyoMb12ss", getTwelveShinsal(yearSplit.ji, monthBranch));

      // 일주 업데이트 (묘운 결과 사용)
      const dayP = myounResult.dayPillar;
      const dayStem_new = dayP.charAt(0);
      const dayBranch_new = dayP.slice(1);
      setText("MyoDtHanja", stemMapping[dayStem_new] ? stemMapping[dayStem_new].hanja : dayStem_new);
      applyColor("MyoDtHanja", stemMapping[dayStem_new] ? stemMapping[dayStem_new].hanja : dayStem_new);
      setText("MyoDtHanguel", stemMapping[dayStem_new] ? stemMapping[dayStem_new].hanguel : dayStem_new);
      setText("MyoDtEumyang", stemMapping[dayStem_new] ? stemMapping[dayStem_new].eumYang : "-");
      setText("MyoDt10sin", getTenGodForStem(dayStem_new, daySplit.gan));
      setText("MyoDbHanja", branchMapping[dayBranch_new] ? branchMapping[dayBranch_new].hanja : dayBranch_new);
      applyColor("MyoDbHanja", branchMapping[dayBranch_new] ? branchMapping[dayBranch_new].hanja : dayBranch_new);
      setText("MyoDbHanguel", branchMapping[dayBranch_new] ? branchMapping[dayBranch_new].hanguel : dayBranch_new);
      setText("MyoDbEumyang", branchMapping[dayBranch_new] ? branchMapping[dayBranch_new].eumYang : "-");
      setText("MyoDb10sin", getTenGodForBranch(dayBranch_new, daySplit.gan));
      const hiddenDay_new = hiddenStemMapping[dayBranch_new] || ["-", "-", "-"];
      setText("MyoDbJj1", hiddenDay_new[0]);
      setText("MyoDbJj2", hiddenDay_new[1]);
      setText("MyoDbJj3", hiddenDay_new[2]);
      setText("MyoDb12ws", getTwelveUnseong(daySplit.gan, dayBranch_new));
      setText("MyoDb12ss", getTwelveShinsal(yearSplit.ji, dayBranch_new));

      // 시주 업데이트 (묘운 결과 사용)
      const hourP = myounResult.hourPillar;
      const hourStem_new = hourP.charAt(0);
      const hourBranch_new = hourP.slice(1);
      setText("MyoHtHanja", stemMapping[hourStem_new] ? stemMapping[hourStem_new].hanja : hourStem_new);
      applyColor("MyoHtHanja", stemMapping[hourStem_new] ? stemMapping[hourStem_new].hanja : hourStem_new);
      setText("MyoHtHanguel", stemMapping[hourStem_new] ? stemMapping[hourStem_new].hanguel : hourStem_new);
      setText("MyoHtEumyang", stemMapping[hourStem_new] ? stemMapping[hourStem_new].eumYang : "-");
      setText("MyoHt10sin", getTenGodForStem(hourStem_new, daySplit.gan));
      setText("MyoHbHanja", branchMapping[hourBranch_new] ? branchMapping[hourBranch_new].hanja : hourBranch_new);
      applyColor("MyoHbHanja", branchMapping[hourBranch_new] ? branchMapping[hourBranch_new].hanja : hourBranch_new);
      setText("MyoHbHanguel", branchMapping[hourBranch_new] ? branchMapping[hourBranch_new].hanguel : hourBranch_new);
      setText("MyoHbEumyang", branchMapping[hourBranch_new] ? branchMapping[hourBranch_new].eumYang : "-");
      setText("MyoHb10sin", getTenGodForBranch(hourBranch_new, daySplit.gan));
      const hiddenHour_new = hiddenStemMapping[hourBranch_new] || ["-", "-", "-"];
      setText("MyoHbJj1", hiddenHour_new[0]);
      setText("MyoHbJj2", hiddenHour_new[1]);
      setText("MyoHbJj3", hiddenHour_new[2]);
      setText("MyoHb12ws", getTwelveUnseong(daySplit.gan, hourBranch_new));
      setText("MyoHb12ss", getTwelveShinsal(yearSplit.ji, hourBranch_new));
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
        let daySplit = splitPillar(dayPillar), yearSplit = splitPillar(yearPillar);
        updateMyowoonSection(myounResult, daySplit, yearSplit);
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
      const daySplit = splitPillar(dayGanZhi);
      const baseDayStem = globalState.originalDayStem;
      setText("WDtHanja", stemMapping[daySplit.gan]?.hanja || "-");
      setText("WDtHanguel", stemMapping[daySplit.gan]?.hanguel || "-");
      setText("WDtEumyang", stemMapping[daySplit.gan]?.eumYang || "-");
      setText("WDt10sin", getTenGodForStem(daySplit.gan, baseDayStem) || "-");
      setText("WDbHanja", branchMapping[daySplit.ji]?.hanja || "-");
      setText("WDbHanguel", branchMapping[daySplit.ji]?.hanguel || "-");
      setText("WDbEumyang", branchMapping[daySplit.ji]?.eumYang || "-");
      setText("WDb10sin", getTenGodForBranch(daySplit.ji, baseDayStem) || "-");
      updateHiddenStems(daySplit.ji, "WDb");
      setText("WDb12ws", getTwelveUnseong(daySplit.gan, daySplit.ji) || "-");
      setText("WDb12ss", getTwelveShinsal(yearSplit.ji, daySplit.ji) || "-");
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
      let hourBranch = getHourBranchUsingArray(refDate);
      let hourBranchIndex = Jiji.indexOf(hourBranch);
      let daySplit = window.daySplit || splitPillar(getDayGanZhi(refDate));
      let baseHourStem = getHourStem(daySplit.gan, hourBranchIndex);
      let fortuneHourStem = Cheongan[(Cheongan.indexOf(baseHourStem)) % 10];
      let idx = Cheongan.indexOf(fortuneHourStem);
      if (idx === -1) { idx = 0; }
      let correctedFortuneHourStem = Cheongan[(idx - 2 + Cheongan.length) % Cheongan.length];
      setText("WTtHanja", stemMapping[correctedFortuneHourStem]?.hanja || "-");
      setText("WTtHanguel", stemMapping[correctedFortuneHourStem]?.hanguel || "-");
      setText("WTtEumyang", stemMapping[correctedFortuneHourStem]?.eumYang || "-");
      setText("WTt10sin", getTenGodForStem(correctedFortuneHourStem, globalState.originalDayStem) || "-");
      setText("WTbHanja", branchMapping[hourBranch]?.hanja || "-");
      setText("WTbHanguel", branchMapping[hourBranch]?.hanguel || "-");
      setText("WTbEumyang", branchMapping[hourBranch]?.eumYang || "-");
      setText("WTb10sin", getTenGodForBranch(hourBranch, daySplit.gan) || "-");
      updateHiddenStems(hourBranch, "WTb");
      setText("WTb12ws", getTwelveUnseong(daySplit.gan, hourBranch) || "-");
      setText("WTb12ss", (yearSplit ? getTwelveShinsal(yearSplit.ji, hourBranch) : "-"));
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

    document.getElementById("woonChangeBtn").addEventListener("click", function () {
      let refDate = (picker && picker.value) ? new Date(picker.value) : new Date();
      updateMyowoonSection(myounResult, daySplit, yearSplit);
      updateCurrentSewoon(refDate);
      updateMonthlyWoonByToday(refDate);
      updateDayWoon(refDate);
      updateHourWoon(refDate);
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
    
    function updateFortune(inputData) {
      const { year, month, day, hour, minute, gender, birthPlace, time2 } = inputData;
      const originalDate = new Date(year, month - 1, day, hour, minute);
      const correctedDate = adjustBirthDate(originalDate, birthPlace);
      const fullResult = getFourPillarsWithDaewoon(
        correctedDate.getFullYear(),
        correctedDate.getMonth() + 1,
        correctedDate.getDate(),
        hour, minute,
        birthPlace,
        gender
      );
      const parts = fullResult.split(", ");
      const pillarsPart = parts[0] || "-";
      const pillars = pillarsPart.split(" ");
      const yearPillar_new  = pillars[0] || "-";
      const monthPillar_new = pillars[1] || "-";
      const dayPillar_new   = pillars[2] || "-";
      const hourPillar_new  = pillars[3] || "-";
      const yearSplit_new  = splitPillar(yearPillar_new);
      const monthSplit_new = splitPillar(monthPillar_new);
      const daySplit_new   = splitPillar(dayPillar_new);
      const hourSplit_new  = splitPillar(hourPillar_new);
      const baseDayStem_new = globalState.originalDayStem;
      updatePillarInfo("Yt", yearSplit_new, baseDayStem_new);
      updatePillarInfo("Mt", monthSplit_new, baseDayStem_new);
      updatePillarInfo("Dt", daySplit_new, baseDayStem_new);
      updatePillarInfo("Ht", hourSplit_new, baseDayStem_new);
      updateBranchInfo("Yb", yearSplit_new.ji, baseDayStem_new);
      updateBranchInfo("Mb", monthSplit_new.ji, baseDayStem_new);
      updateBranchInfo("Db", daySplit_new.ji, baseDayStem_new);
      updateBranchInfo("Hb", hourSplit_new.ji, baseDayStem_new);
      updateOriginalPillarMapping(yearSplit_new, monthSplit_new, daySplit_new, hourSplit_new);
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