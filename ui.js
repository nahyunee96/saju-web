// ui.js
// ====================================================
// [UI Update Functions for Pillars, Colors, etc.]

// ====================================================
// [Additional Utility Functions for Color Updates]
export function updateColorClasses() {
  const bgColorClasses = ['b_green', 'b_red', 'b_yellow', 'b_white', 'b_black'];
  const textColorClasses = ['green', 'red', 'yellow', 'white', 'black'];
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

export function updateHiddenStems(SetBranch, prefix) {
  const mapping = hiddenStemMapping[SetBranch] || ["-", "-", "-"];
  document.getElementById(prefix + "Jj1").innerText = mapping[0];
  document.getElementById(prefix + "Jj2").innerText = mapping[1];
  document.getElementById(prefix + "Jj3").innerText = mapping[2];
}

export function updateStemInfo(prefix, Set, baseDayStem) {
  setText(prefix + "Hanja", (stemMapping[Set.gan]?.hanja) || "-");
  setText(prefix + "Hanguel", (stemMapping[Set.gan]?.hanguel) || "-");
  setText(prefix + "Eumyang", (stemMapping[Set.gan]?.eumYang) || "-");
  setText(prefix + "10sin", (prefix === "Dt") ? "본원" : getTenGodForStem(Set.gan, baseDayStem));
}

export function updatePillarInfo(prefix, pillar, baseDayStem) {
  setText(prefix + "Hanja", stemMapping[pillar.gan]?.hanja || "-");
  setText(prefix + "Hanguel", stemMapping[pillar.gan]?.hanguel || "-");
  setText(prefix + "Eumyang", stemMapping[pillar.gan]?.eumYang || "-");
  // "Dt"는 특별히 "본원"으로 표기
  setText(prefix + "10sin", (prefix === "Dt") ? "본원" : getTenGodForStem(pillar.gan, baseDayStem));
}

export function updateBranchInfo(prefix, branch, baseDayStem) {
  setText(prefix + "Hanja", branchMapping[branch]?.hanja || "-");
  setText(prefix + "Hanguel", branchMapping[branch]?.hanguel || "-");
  setText(prefix + "Eumyang", branchMapping[branch]?.eumYang || "-");
  setText(prefix + "10sin", getTenGodForBranch(branch, baseDayStem));
  updateHiddenStems(branch, prefix);
}

export function updateOriginalSetMapping() {
  // 이 함수는 원국 기둥 매핑(십이운성, 신살 등)을 업데이트합니다.
  setText("Hb12ws", getTwelveUnseong(globalState.baseDayStem, globalState.hourSplit.ji));
  setText("Hb12ss", getTwelveShinsal(globalState.baseYearBranch, globalState.hourSplit.ji));
  setText("Db12ws", getTwelveUnseong(globalState.baseDayStem, globalState.daySplit.ji));
  setText("Db12ss", getTwelveShinsal(globalState.baseYearBranch, globalState.daySplit.ji));
  setText("Mb12ws", getTwelveUnseong(globalState.baseDayStem, globalState.monthSplit.ji));
  setText("Mb12ss", getTwelveShinsal(globalState.baseYearBranch, globalState.monthSplit.ji));
  setText("Yb12ws", getTwelveUnseong(globalState.baseDayStem, globalState.baseYearBranch));
  setText("Yb12ss", getTwelveShinsal(globalState.baseYearBranch, globalState.baseYearBranch));
}

export function updateMyowoonSection(myounResult, daySplit, yearSplit) {
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
  // [1] 연주 업데이트 (묘운 결과)
  const yearPillar = myounResult.yearPillar;
  const yearStem = yearPillar.charAt(0);
  const yearBranch = yearPillar.charAt(1);
  setText("MyoYtHanja", stemMapping[yearStem]?.hanja || "-");
  applyColor("MyoYtHanja", stemMapping[yearStem]?.hanja || "-");
  setText("MyoYtHanguel", stemMapping[yearStem]?.hanguel || "-");
  setText("MyoYtEumyang", stemMapping[yearStem]?.eumYang || "-");
  setText("MyoYt10sin", getTenGodForStem(yearStem, daySplit.gan));
  
  // [2] 연지 업데이트
  setText("MyoYbHanja", branchMapping[yearBranch]?.hanja || "-");
  applyColor("MyoYbHanja", branchMapping[yearBranch]?.hanja || "-");
  setText("MyoYbHanguel", branchMapping[yearBranch]?.hanguel || "-");
  setText("MyoYbEumyang", branchMapping[yearBranch]?.eumYang || "-");
  setText("MyoYb10sin", getTenGodForBranch(yearBranch, daySplit.gan));
  updateHiddenStems(yearBranch, "MyoYb");
  setText("MyoYb12ws", getTwelveUnseong(globalState.baseDayStem, yearBranch));
  setText("MyoYb12ss", getTwelveShinsal(globalState.baseYearBranch, yearBranch));
  
  // [3] 월주 업데이트
  const monthPillar = myounResult.monthPillar;
  const monthStem = monthPillar.charAt(0);
  const monthBranch = monthPillar.charAt(1);
  setText("MyoMtHanja", stemMapping[monthStem]?.hanja || "-");
  applyColor("MyoMtHanja", stemMapping[monthStem]?.hanja || "-");
  setText("MyoMtHanguel", stemMapping[monthStem]?.hanguel || "-");
  setText("MyoMtEumyang", stemMapping[monthStem]?.eumYang || "-");
  setText("MyoMt10sin", getTenGodForStem(monthStem, daySplit.gan));
  setText("MyoMbHanja", branchMapping[monthBranch]?.hanja || "-");
  applyColor("MyoMbHanja", branchMapping[monthBranch]?.hanja || "-");
  setText("MyoMbHanguel", branchMapping[monthBranch]?.hanguel || "-");
  setText("MyoMbEumyang", branchMapping[monthBranch]?.eumYang || "-");
  setText("MyoMb10sin", getTenGodForBranch(monthBranch, daySplit.gan));
  updateHiddenStems(monthBranch, "MyoMb");
  setText("MyoMb12ws", getTwelveUnseong(globalState.baseDayStem, monthBranch));
  setText("MyoMb12ss", getTwelveShinsal(globalState.baseYearBranch, monthBranch));
  
  // [4] 일주 업데이트 (묘운 결과 사용)
  const dayPillar = myounResult.dayPillar;
  const dayStem = dayPillar.charAt(0);
  const dayBranch = dayPillar.slice(1);
  setText("MyoDtHanja", stemMapping[dayStem]?.hanja || "-");
  applyColor("MyoDtHanja", stemMapping[dayStem]?.hanja || "-");
  setText("MyoDtHanguel", stemMapping[dayStem]?.hanguel || "-");
  setText("MyoDtEumyang", stemMapping[dayStem]?.eumYang || "-");
  setText("MyoDt10sin", getTenGodForStem(dayStem, globalState.baseDayStem));
  setText("MyoDbHanja", branchMapping[dayBranch]?.hanja || "-");
  applyColor("MyoDbHanja", branchMapping[dayBranch]?.hanja || "-");
  setText("MyoDbHanguel", branchMapping[dayBranch]?.hanguel || "-");
  setText("MyoDbEumyang", branchMapping[dayBranch]?.eumYang || "-");
  setText("MyoDb10sin", getTenGodForBranch(dayBranch, globalState.baseDayStem));
  updateHiddenStems(dayBranch, "MyoDb");
  setText("MyoDb12ws", getTwelveUnseong(globalState.baseDayStem, dayBranch));
  setText("MyoDb12ss", getTwelveShinsal(globalState.baseYearBranch, dayBranch));
  
  // [5] 시주 업데이트 (묘운 결과 사용)
  const hourPillar = myounResult.hourPillar;
  const hourStem = hourPillar.charAt(0);
  const hourBranch = hourPillar.slice(1);
  setText("MyoHtHanja", stemMapping[hourStem]?.hanja || "-");
  applyColor("MyoHtHanja", stemMapping[hourStem]?.hanja || "-");
  setText("MyoHtHanguel", stemMapping[hourStem]?.hanguel || "-");
  setText("MyoHtEumyang", stemMapping[hourStem]?.eumYang || "-");
  setText("MyoHt10sin", getTenGodForStem(hourStem, globalState.baseDayStem));
  setText("MyoHbHanja", branchMapping[hourBranch]?.hanja || "-");
  applyColor("MyoHbHanja", branchMapping[hourBranch]?.hanja || "-");
  setText("MyoHbHanguel", branchMapping[hourBranch]?.hanguel || "-");
  setText("MyoHbEumyang", branchMapping[hourBranch]?.eumYang || "-");
  setText("MyoHb10sin", getTenGodForBranch(hourBranch, globalState.baseDayStem));
  updateHiddenStems(hourBranch, "MyoHb");
  setText("MyoHb12ws", getTwelveUnseong(globalState.baseDayStem, hourBranch));
  setText("MyoHb12ss", getTwelveShinsal(globalState.baseYearBranch, hourBranch));
  updateColorClasses();
}
