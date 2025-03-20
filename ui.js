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
    const timeParts = birthtimeStr.split(":");
    const gender = document.getElementById("genderMan").checked ? "남" : (document.getElementById("genderWoman").checked ? "여" : "-");
    const birthPlace = document.getElementById("inputBirthPlace").value || "-";


    if (birthdayStr.length < 8) {
      alert("생년월일을 YYYYMMDD 형식으로 입력하세요.");
      return;
    }

    if (birthtimeStr.length !== 4 || isNaN(birthtimeStr)) {
      alert("태어난 시간을 4자리 숫자 (HHMM) 형식으로 입력하세요.");
      return;
    }

    // 추가 유효성 검사: 성별 선택 여부
    if (gender === "-") {
      alert("성별을 선택하세요.");
      return;
    }

    if (birthPlace === "" || birthPlace === "출생지 선택") {
      alert("출생지를 선택하세요.");
      return;
    }

    let year = parseInt(birthdayStr.substring(0, 4));
    let month = parseInt(birthdayStr.substring(4, 6));
    let day = parseInt(birthdayStr.substring(6, 8));
    let hour = parseInt(birthtimeStr.substring(0, 2), 10);
    let minute = parseInt(birthtimeStr.substring(2, 4), 10);

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
        year = solar.year; month = solar.month; day = solar.day;
      }
    } else {
      if (!calendar.setSolarDate(year, month, day)) {
        console.error("양력 날짜 설정에 실패했습니다.");
      } else {
        lunarDate = calendar.getLunarCalendar();
      }
    }

    // 전역 변수에 양력 생일 저장
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

    const solarDate = globalState.correctedBirthDate;
    const fullResult = getFourPillarsWithDaewoon(
      solarDate.getFullYear(),
      solarDate.getMonth() + 1,
      solarDate.getDate(),
      hour, minute, birthPlace, gender
    );

    const parts = fullResult.split(", ");
    const pillarsPart = parts[0] || "-";
    const pillars = pillarsPart.split(" ");
    const yearPillar = pillars[0] || "-";
    const monthPillar = pillars[1] || "-";
    const dayPillar = pillars[2] || "-";
    const hourPillar = pillars[3] || "-";

    const yearSplit = splitPillar(yearPillar);
    const monthSplit = splitPillar(monthPillar);
    const daySplit = splitPillar(dayPillar);
    const hourSplit = splitPillar(hourPillar);
    const baseDayStem = daySplit.gan;
    

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

    // 대운 업데이트
    function updateCurrentDaewoon() {
      const birthYear = year, birthMonth = month, birthDay = day;
      const _birthPlace = birthPlace, _gender = gender;
      const today = new Date();
      const birthDate = new Date(birthYear, birthMonth - 1, birthDay);
      let currentAge = today.getFullYear() - birthDate.getFullYear();
      if (today.getMonth() < birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
        currentAge--;
      }
      const daewoonData = getDaewoonData(_birthPlace, _gender);

      let currentDaewoon = null;
      for (let i = 0; i < daewoonData.list.length; i++) {
        if (daewoonData.list[i].age <= currentAge) {
          currentDaewoon = daewoonData.list[i];
        }
      }
      if (!currentDaewoon) {
        currentDaewoon = daewoonData.list[0] || { stem: "-", branch: "-" };
      }

      let displayDaewoon = currentDaewoon;
      
      setText("DwtHanja", stemMapping[displayDaewoon.stem]?.hanja || "-");
      setText("DwtHanguel", stemMapping[displayDaewoon.stem]?.hanguel || "-");
      setText("DwtEumyang", stemMapping[displayDaewoon.stem]?.eumYang || "-");
      setText("Dwt10sin", getTenGodForStem(displayDaewoon.stem, baseDayStem));

      setText("DwbHanja", branchMapping[displayDaewoon.branch]?.hanja || "-");
      setText("DwbHanguel", branchMapping[displayDaewoon.branch]?.hanguel || "-");
      setText("DwbEumyang", branchMapping[displayDaewoon.branch]?.eumYang || "-");
      setText("Dwb10sin", getTenGodForBranch(displayDaewoon.branch, baseDayStem));

      const daewoonHidden = hiddenStemMapping[displayDaewoon.branch] || ["-", "-", "-"];
      setText("DwJj1", daewoonHidden[0]);
      setText("DwJj2", daewoonHidden[1]);
      setText("DwJj3", daewoonHidden[2]);

      setText("DWb12ws", getTwelveUnseong(daySplit.gan, displayDaewoon.branch));
      setText("DWb12ss", getTwelveShinsal(yearSplit.ji, displayDaewoon.branch));
    }
    updateCurrentDaewoon();
    updateMonthlyWoonByToday(new Date());
    globalState.daewoonData = getDaewoonData(birthPlace, gender);

    let _yearSplit = splitPillar(yearPillar);
    const _baseYearStem = _yearSplit.gan;
    const _basedaytem = daySplit.gan;
    const isForward = ((gender === "남" && ["갑", "병", "무", "경", "임"].includes(_baseYearStem)) ||
      (gender === "여" && !["갑", "병", "무", "경", "임"].includes(_baseYearStem)));

    function updateDaewoonItem(i, item, baseDayStem, isForward) {
      const forwardGanji = item.stem + item.branch;
      let finalGanji = forwardGanji;
      
      const finalStem = finalGanji.charAt(0);
      const finalBranch = finalGanji.charAt(1);
      const idx = i + 1;
      setText("DC_" + idx, stemMapping[finalStem]?.hanja || "-");
      setText("DJ_" + idx, branchMapping[finalBranch]?.hanja || "-");
      setText("dt10sin" + idx, getTenGodForStem(finalStem, baseDayStem) || "-");
      setText("db10sin" + idx, getTenGodForBranch(finalBranch, baseDayStem) || "-");
      setText("DwW" + idx, "-");
      setText("Ds" + idx, "-");
      setText("Da" + idx, item.age);
    }
    for (let i = 0; i < 10; i++) {
      updateDaewoonItem(i, globalState.daewoonData.list[i], _basedaytem, isForward);
    }

    const birthDateObj = new Date(year, month - 1, day);
    const today = new Date();
    let currentAge = today.getFullYear() - birthDateObj.getFullYear();
    if (today.getMonth() < birthDateObj.getMonth() ||
        (today.getMonth() === birthDateObj.getMonth() && today.getDate() < birthDateObj.getDate())) {
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
      let baseDayStem = daySplit.gan;
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

    const todayYear = today.getFullYear();
    const ipChun = findSolarTermDate(today.getFullYear(), 315);
    const displayYear = (today < ipChun) ? todayYear - 1 : todayYear;
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

    function updateMonthlyData(computedYear) {
      const boundaries = getSolarTermBoundaries(computedYear);
      const dayPillarText = document.getElementById("DtHanguel").innerText;
      const baseDayStem = dayPillarText ? dayPillarText.charAt(0) : "-";
      const cycleStartDate = boundaries[0].date;
      const birthDate = globalState.correctedBirthDate;
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
      const displayMonth = (monthNumber < 12) ? (monthNumber + 1) + "월" : "1월";
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

    const currentSolarYear = (today < ipChun) ? today.getFullYear() - 1 : today.getFullYear();
    let boundariesArr = getSolarTermBoundaries(currentSolarYear);
    let currentTerm = boundariesArr.find((term, idx) => {
      let next = boundariesArr[idx + 1] || { date: new Date(term.date.getTime() + 30 * 24 * 60 * 60 * 1000) };
      return today >= term.date && today < next.date;
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
      // 마지막 날짜를 그대로 사용하여 마지막 날도 포함시킴
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
        const adjustedIndex = (originalIndex) % 60;
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

    function updateMyowoonSection(myounResult, daySplit, yearSplit) {
      // 헬퍼 함수: 지정된 id의 요소의 innerText 설정
      function setText(id, text) {
        const elem = document.getElementById(id);
        if (elem) elem.innerText = text;
      }
    
        // 헬퍼 함수: 요소에 색상 클래스 적용 (colorMapping 사용)
      function applyColor(id, key) {
        const elem = document.getElementById(id);
        if (elem && colorMapping && colorMapping[key]) {
          elem.classList.remove("b_green", "b_red", "b_yellow", "b_white", "b_black",
                                "green", "red", "yellow", "white", "black");
          elem.classList.add(colorMapping[key].textColor);
        }
      }
      // [1] 연간 업데이트 (MyoYt*, MyoYb*)
      const yearStem = myounResult.yearPillar.charAt(0); // 예: "병"
      const yearBranch = myounResult.yearPillar.charAt(1); // 예: "자"
      setText("MyoYtHanja", stemMapping[yearStem] ? stemMapping[yearStem].hanja : yearStem);
      applyColor("MyoYtHanja", stemMapping[yearStem] ? stemMapping[yearStem].hanja : yearStem);
      setText("MyoYtHanguel", stemMapping[yearStem] ? stemMapping[yearStem].hanguel : yearStem);
      setText("MyoYtEumyang", stemMapping[yearStem] ? stemMapping[yearStem].eumYang : "-");
      setText("MyoYt10sin", getTenGodForStem(yearStem, daySplit.gan));

      setText("MyoYbHanja", branchMapping[yearBranch] ? branchMapping[yearBranch].hanja : yearBranch);
      applyColor("MyoYbHanja", branchMapping[yearBranch] ? branchMapping[yearBranch].hanja : yearBranch);
      setText("MyoYbHanguel", branchMapping[yearBranch] ? branchMapping[yearBranch].hanguel : yearBranch);
      setText("MyoYbEumyang", branchMapping[yearBranch] ? branchMapping[yearBranch].eumYang : "-");
      setText("MyoYb10sin", getTenGodForBranch(yearBranch, daySplit.gan));
      const hiddenYear = hiddenStemMapping[yearBranch] || ["-", "-", "-"];
      setText("MyoYbJj1", hiddenYear[0]);
      setText("MyoYbJj2", hiddenYear[1]);
      setText("MyoYbJj3", hiddenYear[2]);
      setText("MyoYb12ws", getTwelveUnseong(daySplit.gan, yearBranch));
      setText("MyoYb12ss", getTwelveShinsal(yearSplit.ji, yearBranch));

      // [2] 월간 업데이트 (MyoMt*, MyoMb*)
      const monthStem = myounResult.monthPillar.charAt(0);
      const monthBranch = myounResult.monthPillar.charAt(1);
      setText("MyoMtHanja", stemMapping[monthStem] ? stemMapping[monthStem].hanja : monthStem);
      applyColor("MyoMtHanja", stemMapping[monthStem] ? stemMapping[monthStem].hanja : monthStem);
      setText("MyoMtHanguel", stemMapping[monthStem] ? stemMapping[monthStem].hanguel : monthStem);
      setText("MyoMtEumyang", stemMapping[monthStem] ? stemMapping[monthStem].eumYang : "-");
      setText("MyoMt10sin", getTenGodForStem(monthStem, daySplit.gan));

      setText("MyoMbHanja", branchMapping[monthBranch] ? branchMapping[monthBranch].hanja : monthBranch);
      applyColor("MyoMbHanja", branchMapping[monthBranch] ? branchMapping[monthBranch].hanja : monthBranch);
      setText("MyoMbHanguel", branchMapping[monthBranch] ? branchMapping[monthBranch].hanguel : monthBranch);
      setText("MyoMbEumyang", branchMapping[monthBranch] ? branchMapping[monthBranch].eumYang : "-");
      setText("MyoMb10sin", getTenGodForBranch(monthBranch, daySplit.gan));
      const hiddenMonth = hiddenStemMapping[monthBranch] || ["-", "-", "-"];
      setText("MyoMbJj1", hiddenMonth[0]);
      setText("MyoMbJj2", hiddenMonth[1]);
      setText("MyoMbJj3", hiddenMonth[2]);
      setText("MyoMb12ws", getTwelveUnseong(daySplit.gan, monthBranch));
      setText("MyoMb12ss", getTwelveShinsal(yearSplit.ji, monthBranch));

      // [3] 일간 업데이트 (MyoDt*, MyoDb*)
      const dayStem = myounResult.dayPillar.charAt(0);
      const dayBranch = myounResult.dayPillar.charAt(1);
      setText("MyoDtHanja", stemMapping[dayStem] ? stemMapping[dayStem].hanja : dayStem);
      applyColor("MyoDtHanja", stemMapping[dayStem] ? stemMapping[dayStem].hanja : dayStem);
      setText("MyoDtHanguel", stemMapping[dayStem] ? stemMapping[dayStem].hanguel : dayStem);
      setText("MyoDtEumyang", stemMapping[dayStem] ? stemMapping[dayStem].eumYang : "-");
      setText("MyoDt10sin", getTenGodForStem(dayStem, daySplit.gan));

      setText("MyoDbHanja", branchMapping[dayBranch] ? branchMapping[dayBranch].hanja : dayBranch);
      applyColor("MyoDbHanja", branchMapping[dayBranch] ? branchMapping[dayBranch].hanja : dayBranch);
      setText("MyoDbHanguel", branchMapping[dayBranch] ? branchMapping[dayBranch].hanguel : dayBranch);
      setText("MyoDbEumyang", branchMapping[dayBranch] ? branchMapping[dayBranch].eumYang : "-");
      setText("MyoDb10sin", getTenGodForBranch(dayBranch, daySplit.gan));
      const hiddenDay = hiddenStemMapping[dayBranch] || ["-", "-", "-"];
      setText("MyoDbJj1", hiddenDay[0]);
      setText("MyoDbJj2", hiddenDay[1]);
      setText("MyoDbJj3", hiddenDay[2]);
      setText("MyoDb12ws", getTwelveUnseong(daySplit.gan, dayBranch));
      setText("MyoDb12ss", getTwelveShinsal(yearSplit.ji, dayBranch));

      // [4] 시주 업데이트 (MyoHt*, MyoHb*)
      const hourStem = myounResult.hourPillar.charAt(0);
      const hourBranch = myounResult.hourPillar.charAt(1);
      setText("MyoHtHanja", stemMapping[hourStem] ? stemMapping[hourStem].hanja : hourStem);
      applyColor("MyoHtHanja", stemMapping[hourStem] ? stemMapping[hourStem].hanja : hourStem);
      setText("MyoHtHanguel", stemMapping[hourStem] ? stemMapping[hourStem].hanguel : hourStem);
      setText("MyoHtEumyang", stemMapping[hourStem] ? stemMapping[hourStem].eumYang : "-");
      setText("MyoHt10sin", getTenGodForStem(hourStem, daySplit.gan));

      setText("MyoHbHanja", branchMapping[hourBranch] ? branchMapping[hourBranch].hanja : hourBranch);
      applyColor("MyoHbHanja", branchMapping[hourBranch] ? branchMapping[hourBranch].hanja : hourBranch);
      setText("MyoHbHanguel", branchMapping[hourBranch] ? branchMapping[hourBranch].hanguel : hourBranch);
      setText("MyoHbEumyang", branchMapping[hourBranch] ? branchMapping[hourBranch].eumYang : "-");
      setText("MyoHb10sin", getTenGodForBranch(hourBranch, daySplit.gan));
      const hiddenHour = hiddenStemMapping[hourBranch] || ["-", "-", "-"];
      setText("MyoHbJj1", hiddenHour[0]);
      setText("MyoHbJj2", hiddenHour[1]);
      setText("MyoHbJj3", hiddenHour[2]);
      setText("MyoHb12ws", getTwelveUnseong(daySplit.gan, hourBranch));
      setText("MyoHb12ss", getTwelveShinsal(yearSplit.ji, hourBranch));
    }


    document.getElementById('myowoonMore').addEventListener('click', function () {
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
        document.getElementById('woonContainer').style.display = 'block';
        document.getElementById('calArea').style.display = 'block';
      const birthDate = new Date(year, month - 1, day);
        let myounResult = getMyounPillars(birthYearP, birthMonthP, birthDayP, birthHourP, birthDate, refDate, gender);
        let daySplit = splitPillar(dayPillar);
        let yearSplit = splitPillar(yearPillar);
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
    let myowoonToggle = false;

    function updateDayWoon(refDate) {
      if (!(refDate instanceof Date) || isNaN(refDate.getTime())) { refDate = new Date(); }
      const jasiElem = document.getElementById("jasi");
      const yajojasiElem = document.getElementById("yajojasi");
      const insiElem = document.getElementById("insi");
      let adjustedDate = new Date(refDate.getTime());
      if (jasiElem && jasiElem.checked) {
        adjustedDate = new Date(adjustedDate.getFullYear(), adjustedDate.getMonth(), adjustedDate.getDate(), - 1, 23, 30);
      } else if (yajojasiElem && yajojasiElem.checked) {
        adjustedDate = new Date(adjustedDate.getFullYear(), adjustedDate.getMonth(), adjustedDate.getDate() - 1, 23, 30);
      } else if (insiElem && insiElem.checked) {
        adjustedDate = new Date(adjustedDate.getFullYear(), adjustedDate.getMonth(), adjustedDate.getDate(), 3, 30);
      } 
      const dayGanZhi = getDayGanZhi(adjustedDate);
      const daySplit = splitPillar(dayGanZhi);
      const baseDayStem = daySplit.gan;
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
      const timeRanges = [
        { branch: '자', hanja: '子', start: 23 * 60, end: 1 * 60 },
        { branch: '축', hanja: '丑', start: 1 * 60, end: 3 * 60 },
        { branch: '인', hanja: '寅', start: 3 * 60, end: 5 * 60 },
        { branch: '묘', hanja: '卯', start: 5 * 60, end: 7 * 60 },
        { branch: '진', hanja: '辰', start: 7 * 60, end: 9 * 60 },
        { branch: '사', hanja: '巳', start: 9 * 60, end: 11 * 60 },
        { branch: '오', hanja: '午', start: 11 * 60, end: 13 * 60 },
        { branch: '미', hanja: '未', start: 13 * 60, end: 15 * 60 },
        { branch: '신', hanja: '申', start: 15 * 60, end: 17 * 60 },
        { branch: '유', hanja: '酉', start: 17 * 60, end: 19 * 60 },
        { branch: '술', hanja: '戌', start: 19 * 60, end: 21 * 60 },
        { branch: '해', hanja: '亥', start: 21 * 60, end: 23 * 60 }
      ];
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
      // 시운 업데이트: 시간 관련 데이터 계산
      let hourBranch = getHourBranchUsingArray(refDate);
      let hourBranchIndex = Jiji.indexOf(hourBranch);
      let daySplit = window.daySplit || splitPillar(getDayGanZhi(refDate));
      // 원래 시주 천간 계산 (원국용)
      let baseHourStem = getHourStem(daySplit.gan, hourBranchIndex);
      // 시운에서는 천간만 한 칸 앞당기기 (즉, -1 인덱스; 모듈로 10 적용)
      let fortuneHourStem = Cheongan[(Cheongan.indexOf(baseHourStem)) % 10];

      let idx = Cheongan.indexOf(fortuneHourStem);
      if (idx === -1) { idx = 0; }
      let correctedFortuneHourStem = Cheongan[(idx - 2 + Cheongan.length) % Cheongan.length];
      
      // 시운 천간 관련 업데이트: WTt* 요소에 fortuneHourStem 사용
      setText("WTtHanja", stemMapping[correctedFortuneHourStem]?.hanja || "-");
      setText("WTtHanguel", stemMapping[correctedFortuneHourStem]?.hanguel || "-");
      setText("WTtEumyang", stemMapping[correctedFortuneHourStem]?.eumYang || "-");
      setText("WTt10sin", getTenGodForStem(correctedFortuneHourStem, daySplit.gan) || "-");
      
      // 시운 지지 관련은 그대로 사용 (WTb* 요소)
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

    // 추가 기능 함수들
    function addDays(dateObj, n) { const d = new Date(dateObj.getTime()); d.setDate(d.getDate() + n); return d; }
    function addYears(dateObj, n) { const d = new Date(dateObj.getTime()); d.setFullYear(d.getFullYear() + n); return d; }
    function diffInDays(d1, d2) { return Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)); }
    function isLeapYear(year) { return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0); }
    function convertToTwoLetter(pillar) { return (pillar && pillar.length >= 3) ? pillar.charAt(0) + pillar.charAt(2) : pillar; }

    // --- 묘운력 계산 ---
    function getMyounPillars(birthYearPillar, birthMonthPillar, birthDayPillar, birthHourPillar, birthDateObj, referenceDateObj, gender) {
      // [A] 연주 계산
      let finalYearPillar = birthYearPillar;
      function getAgeByDate(birthDate, refDate) {
        let age = refDate.getFullYear() - birthDate.getFullYear();
        const m = refDate.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && refDate.getDate() < birthDate.getDate())) {
          age--;
        }
        return age;
      }
      const ageOnRef = getAgeByDate(birthDateObj, referenceDateObj);
      const firstBirthday = new Date(birthDateObj); firstBirthday.setFullYear(firstBirthday.getFullYear() + 1);
      if (referenceDateObj < firstBirthday || ageOnRef < 61) {
        finalYearPillar = birthYearPillar;
      } else {
        const originalIndex = getGanZhiIndex(birthYearPillar);
        const correctedDate = adjustBirthDate(birthDate, birthPlace);
        const originalYearPillar = getYearGanZhi(correctedDate, year);
        if (originalIndex >= 0) {
          const isYangStem = ["갑", "병", "무", "경", "임"].includes(originalYearPillar[0]);
          const direction = ((gender === "남" && isYangStem) || (gender === "여" && !isYangStem)) ? 1 : -1;
          finalYearPillar = getGanZhiFromIndex(originalIndex - direction);
        }
      }
      function getCurrentDaewoonMonthPillar(birthY, birthM, birthD, birthPlace, gender, referenceDate) {
        const birthDate = new Date(birthYear, birthMonth - 1, birthDay);
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
      // [B] 월주 계산
      let finalMonthPillar = birthMonthPillar;
      finalMonthPillar = getCurrentDaewoonMonthPillar(birthDateObj.getFullYear(), birthDateObj.getMonth() + 1, birthDateObj.getDate(), birthPlace, gender, referenceDateObj);
      // [C] 일주 계산
      let originalDayPillar = convertToTwoLetter(birthDayPillar);
      let finalDayPillar = originalDayPillar;
      const diffMs_day = referenceDateObj.getTime() - birthDateObj.getTime();
      const diffDays = Math.floor(diffMs_day / (1000 * 60 * 60 * 24)) + 1;
      const rawSteps = Math.floor(diffDays / 120);
      const steps_day = rawSteps - 60;
      const originalYearPillar = "병자"; // (예시)
      const isYangStem = ["갑", "병", "무", "경", "임"].includes(originalYearPillar.charAt(0));
      const direction_day = ((gender === "남" && isYangStem) || (gender === "여" && !isYangStem)) ? 1 : -1;
      finalDayPillar = getGanZhiFromIndex(getGanZhiIndex(originalDayPillar) + direction_day * steps_day);
      // [D] 시주 계산
      const firstYearDays = isLeapYear(birthDateObj.getFullYear()) ? 366 : 365;
      const remainingDays = diffDays - firstYearDays;
      const subtracted = Math.floor(remainingDays / 600) * 600;
      const rem = remainingDays - subtracted;
      const steps_hour = Math.floor(rem / 10);
      const _firstBirthday = addYears(birthDateObj, 1);
      const lastChangeDate = addDays(_firstBirthday, subtracted + steps_hour * 10);
      const baseIndex_hour = getGanZhiIndex(birthHourPillar);
      const isYangStem_hour = ["갑", "병", "무", "경", "임"].includes(originalYearPillar.charAt(0));
      const direction_hour = ((gender === "남" && isYangStem_hour) || (gender === "여" && !isYangStem_hour)) ? 1 : -1;
      const finalHourPillar = getGanZhiFromIndex(baseIndex_hour + direction_hour * steps_hour + 1);
      return { yearPillar: finalYearPillar, monthPillar: finalMonthPillar, dayPillar: finalDayPillar, hourPillar: finalHourPillar };
    }
    const yearStemElem = document.getElementById("YtHanguel"), yearBranchElem = document.getElementById("YbHanguel"), birthYearP = yearStemElem.innerText.trim().charAt(0) + yearBranchElem.innerText.trim().charAt(0);
    const monthStemElem = document.getElementById("MtHanguel"), monthBranchElem = document.getElementById("MbHanguel"), birthMonthP = monthStemElem.innerText.trim().charAt(0) + monthBranchElem.innerText.trim().charAt(0);
    const dayStemElem = document.getElementById("DtHanguel"), dayBranchElem = document.getElementById("DbHanguel"), birthDayP = dayStemElem.innerText.trim().charAt(0) + dayBranchElem.innerText.trim().charAt(0);
    const hourStemElem = document.getElementById("HtHanguel"), hourBranchElem = document.getElementById("HbHanguel"), birthHourP = hourStemElem.innerText.trim().charAt(0) + hourBranchElem.innerText.trim().charAt(0);
    const birthYear = year, birthMonth = month, birthDay = day, _birthPlace = birthPlace, _gender = gender;
    const birthDate = new Date(birthYear, birthMonth - 1, birthDay);

    if (today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) { currentAge--; }
    function updateMyowoonSection(myounResult, daySplit, yearSplit) {
      function setText(id, text) { const elem = document.getElementById(id); if (elem) elem.innerText = text; }
      function applyColor(id, key) { const elem = document.getElementById(id); if (elem && colorMapping && colorMapping[key]) { elem.classList.remove("b_green", "b_red", "b_yellow", "b_white", "b_black", "green", "red", "yellow", "white", "black"); elem.classList.add(colorMapping[key].textColor); } }
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
      // 일주 업데이트
      const dayStem = myounResult.dayPillar.charAt(0), dayBranch = myounResult.dayPillar.charAt(1);
      setText("MyoDtHanja", stemMapping[dayStem] ? stemMapping[dayStem].hanja : dayStem); applyColor("MyoDtHanja", stemMapping[dayStem] ? stemMapping[dayStem].hanja : dayStem);
      setText("MyoDtHanguel", stemMapping[dayStem] ? stemMapping[dayStem].hanguel : dayStem);
      setText("MyoDtEumyang", stemMapping[dayStem] ? stemMapping[dayStem].eumYang : "-");
      setText("MyoDt10sin", getTenGodForStem(dayStem, daySplit.gan));
      setText("MyoDbHanja", branchMapping[dayBranch] ? branchMapping[dayBranch].hanja : dayBranch); applyColor("MyoDbHanja", branchMapping[dayBranch] ? branchMapping[dayBranch].hanja : dayBranch);
      setText("MyoDbHanguel", branchMapping[dayBranch] ? branchMapping[dayBranch].hanguel : dayBranch);
      setText("MyoDbEumyang", branchMapping[dayBranch] ? branchMapping[dayBranch].eumYang : "-");
      setText("MyoDb10sin", getTenGodForBranch(dayBranch, daySplit.gan));
      const hiddenDay = hiddenStemMapping[dayBranch] || ["-", "-", "-"];
      setText("MyoDbJj1", hiddenDay[0]); setText("MyoDbJj2", hiddenDay[1]); setText("MyoDbJj3", hiddenDay[2]);
      setText("MyoDb12ws", getTwelveUnseong(daySplit.gan, dayBranch));
      setText("MyoDb12ss", getTwelveShinsal(yearSplit.ji, dayBranch));
      // 시주 업데이트
      const hourStem = myounResult.hourPillar.charAt(0), hourBranch = myounResult.hourPillar.charAt(1);
      setText("MyoHtHanja", stemMapping[hourStem] ? stemMapping[hourStem].hanja : hourStem); applyColor("MyoHtHanja", stemMapping[hourStem] ? stemMapping[hourStem].hanja : hourStem);
      setText("MyoHtHanguel", stemMapping[hourStem] ? stemMapping[hourStem].hanguel : hourStem);
      setText("MyoHtEumyang", stemMapping[hourStem] ? stemMapping[hourStem].eumYang : "-");
      setText("MyoHt10sin", getTenGodForStem(hourStem, daySplit.gan));
      setText("MyoHbHanja", branchMapping[hourBranch] ? branchMapping[hourBranch].hanja : hourBranch); applyColor("MyoHbHanja", branchMapping[hourBranch] ? branchMapping[hourBranch].hanja : hourBranch);
      setText("MyoHbHanguel", branchMapping[hourBranch] ? branchMapping[hourBranch].hanguel : hourBranch);
      setText("MyoHbEumyang", branchMapping[hourBranch] ? branchMapping[hourBranch].eumYang : "-");
      setText("MyoHb10sin", getTenGodForBranch(hourBranch, daySplit.gan));
      const hiddenHour = hiddenStemMapping[hourBranch] || ["-", "-", "-"];
      setText("MyoHbJj1", hiddenHour[0]); setText("MyoHbJj2", hiddenHour[1]); setText("MyoHbJj3", hiddenHour[2]);
      setText("MyoHb12ws", getTwelveUnseong(daySplit.gan, hourBranch));
      setText("MyoHb12ss", getTwelveShinsal(yearSplit.ji, hourBranch));
    }
    let myounResult = getMyounPillars(birthYearP, birthMonthP, birthDayP, birthHourP, birthDate, refDate, gender);
    updateMyowoonSection(myounResult, daySplit, yearSplit);
    document.getElementById('myowoonMore').addEventListener('click', function(){
      myowoonToggle = !myowoonToggle;
      if(myowoonToggle) {
        document.getElementById('wongookLM').classList.add("w100");
        document.getElementById('luckyWrap').style.display = 'none';
        document.getElementById('woonArea').style.display = 'none';
        document.getElementById('woonContainer').style.display = 'flex';
        document.getElementById('calArea').style.display = 'block';
        let myounResult = getMyounPillars(birthYearP, birthMonthP, birthDayP, birthHourP, birthDate, refDate, gender);
        let daySplit = splitPillar(dayPillar), yearSplit = splitPillar(yearPillar);
        updateMyowoonSection(myounResult, daySplit, yearSplit);
        this.innerText = "원래 화면으로 돌아가기";
      } else {
        document.getElementById('wongookLM').classList.remove("w100");
        document.getElementById('luckyWrap').style.display = 'block';
        document.getElementById('woonArea').style.display = 'block';
        document.getElementById('woonContainer').style.display = 'none';
        document.getElementById('calArea').style.display = 'none';
        this.innerText = "묘운력(운 전체) 상세보기";
      }
    });

    const picker = document.getElementById("woonTimeSetPicker");
    if (picker) {
      // 기본값: 현재 시간
      const now = new Date();
      const year = now.getFullYear();
      const month = pad(now.getMonth() + 1);
      const day = pad(now.getDate());
      const hours = pad(now.getHours());
      const minutes = pad(now.getMinutes());
      picker.value = `${year}-${month}-${day}T${hours}:${minutes}`;

      // inputBirthday 값을 읽어 출생일 계산 (YYYYMMDD 형식)
      const birthInput = document.getElementById("inputBirthday");
      if (birthInput && birthInput.value.length === 8) {
        const birthYear = parseInt(birthInput.value.substring(0, 4), 10);
        const birthMonth = parseInt(birthInput.value.substring(4, 6), 10) - 1; // JavaScript에서는 0부터 시작
        const birthDay = parseInt(birthInput.value.substring(6, 8), 10);
        const birthDate = new Date(birthYear, birthMonth, birthDay);
        // 출생일 + 1년 계산
        const minSelectable = new Date(birthDate.getFullYear() + 1, birthDate.getMonth(), birthDate.getDate());
        const minYear = minSelectable.getFullYear();
        const minMonth = pad(minSelectable.getMonth() + 1);
        const minDay = pad(minSelectable.getDate());
        // 시간은 00:00으로 설정
        picker.min = `${minYear}-${minMonth}-${minDay}T00:00`;
      }
    }

    document.getElementById("woonChangeBtn").addEventListener("click", function () {
      let refDate = (picker && picker.value) ? new Date(picker.value) : new Date();
      let myounResult = getMyounPillars(birthYearP, birthMonthP, birthDayP, birthHourP, birthDate, refDate, gender);
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
      const timeParts = birthtimeStr.split(":");
    
      // 숫자 변환 및 검증 (예: 생년월일 8자리, 시간 파싱 등)
      const year = parseInt(birthdayStr.substring(0, 4), 10);
      const month = parseInt(birthdayStr.substring(4, 6), 10);
      const day = parseInt(birthdayStr.substring(6, 8), 10);
      const hour = parseInt(birthtimeStr.substring(0, 2), 10);
      const minute = parseInt(birthtimeStr.substring(2, 4), 10);
    
      const gender = document.getElementById("genderMan").checked ? "남" :
                     document.getElementById("genderWoman").checked ? "여" : "-";
      const birthPlace = document.getElementById("inputBirthPlace").value || "-";
    
      // 시간 기준(표준시/태양시)와 시 기준(자시/야·조자시/인시)도 값으로 읽어오기
      const time1 = document.querySelector('input[name="time1"]:checked').value; // "standard" or "sun"
      const time2 = document.querySelector('input[name="time2"]:checked').value; // "jasi", "yajojasi", "insi"
    
      return { year, month, day, hour, minute, gender, birthPlace, time1, time2 };
    }
    
    // 2025-03-20 추가
    function updateFortune(inputData) {
      // inputData의 값들은 모두 올바른 숫자/문자열이라고 가정
      const { year, month, day, hour, minute, gender, birthPlace, time1, time2 } = inputData;
      
      // 생성한 로컬 변수 사용 – 예를 들어, year는 NaN이 아님을 보장
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
      const baseDayStem = daySplit.gan;
      
      // UI 업데이트 (원국, 각 운 계산 결과 반영)
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
    }

    const inputData = collectInputData();

    const selectedTime1 = document.querySelector('input[name="time1"]:checked').value;
    const selectedTime2 = document.querySelector('input[name="time2"]:checked').value;
  
    // 결과창의 체크 옵션 업데이트
    if (selectedTime1 === "standard") {
      document.getElementById("timeChk01_01").checked = true;
    } else if (selectedTime1 === "sun") {
      document.getElementById("timeChk01_02").checked = true;
    }
    if (selectedTime2 === "jasi") {
      document.getElementById("timeChk02_01").checked = true;
    } else if (selectedTime2 === "yajojasi") {
      document.getElementById("timeChk02_02").checked = true;
    } else if (selectedTime2 === "insi") {
      document.getElementById("timeChk02_03").checked = true;
    }
  
    
    // 결과창 내 체크 옵션 라디오 버튼에 change 이벤트 등록
    const resultRadios = document.querySelectorAll('#checkOption input[type="radio"]');
    resultRadios.forEach(function(radio) {
      radio.addEventListener("change", function () {
        // 결과창에서 선택된 값을 읽어 입력 화면의 라디오 버튼 상태 동기화
        const selectedTime1 = document.querySelector('input[name="timeChk01"]:checked').value;
        const selectedTime2 = document.querySelector('input[name="timeChk02"]:checked').value;
    
        // 입력 화면의 "time1" 그룹 업데이트
        document.querySelectorAll('input[name="time1"]').forEach(el => el.checked = false);
        if (selectedTime1 === "standard") {
          document.getElementById("defaultTime").checked = true;
        } else if (selectedTime1 === "sun") {
          document.getElementById("sunTime").checked = true;
        }
    
        // 입력 화면의 "time2" 그룹 업데이트
        document.querySelectorAll('input[name="time2"]').forEach(el => el.checked = false);
        if (selectedTime2 === "jasi") {
          document.getElementById("jasi").checked = true;
        } else if (selectedTime2 === "yajojasi") {
          document.getElementById("yajojasi").checked = true;
        } else if (selectedTime2 === "insi") {
          document.getElementById("insi").checked = true;
        }
    
        // 전체 재계산 및 UI 업데이트
        updateFortune(inputData);
      });
    });
    
    // 결과창 표시, 입력 화면 숨기기
    document.getElementById('resultWrapper').style.display = 'block';
    document.getElementById('inputWrap').style.display = 'none';
  });

});