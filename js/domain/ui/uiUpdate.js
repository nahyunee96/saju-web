// uiUpdate.js = UI쪽 업데이트 함수 창고
import { 수정_저장_여부_확인, 저장_명식_입력폼_반영 } from "../ui/inputControl.js"

// UI 색상 업데이트 함수
export function ui_색상_업데이트(색상_맵핑, rootElement = document) {
  const bgColorClasses = ["b_green", "b_red", "b_yellow", "b_white", "b_black"];
  const textColorClasses = ["green", "red", "yellow", "white", "black"];

  rootElement.querySelectorAll(".ganji_w").forEach(elem => {
    const val = elem.innerHTML.trim();
    bgColorClasses.forEach(cls => elem.classList.remove(cls));
    if (색상_맵핑[val]) elem.classList.add(색상_맵핑[val].bgColor);
  });

  rootElement.querySelectorAll(".grid_box_1 li b, .ganji b").forEach(bElem => {
    const val = bElem.innerHTML.trim();
    textColorClasses.forEach(cls => bElem.classList.remove(cls));
    if (색상_맵핑[val]) bElem.classList.add(색상_맵핑[val].textColor);
  });
}

// 지장간 업데이트 함수
export function 지장간_업데이트(setBranch, prefix, 지장간_매핑, root = document) {
  const mapping = 지장간_매핑[setBranch] || ["-", "-", "-"];
  root.getElementById(prefix + "Jj1").innerText = mapping[0];
  root.getElementById(prefix + "Jj2").innerText = mapping[1];
  root.getElementById(prefix + "Jj3").innerText = mapping[2];
}

export function 천간관련_정보_업데이트(prefix, setGanzhi, baseDayStem, stemMapping, 아이디_유무_검사, 일간에_따른_천간_십신_출력) {
  아이디_유무_검사(prefix + "Hanja", (stemMapping[setGanzhi.gan]?.hanja) || "-");
  아이디_유무_검사(prefix + "Hanguel", (stemMapping[setGanzhi.gan]?.hanguel) || "-");
  아이디_유무_검사(prefix + "Eumyang", (stemMapping[setGanzhi.gan]?.eumYang) || "-");
  아이디_유무_검사(prefix + "10sin", (prefix === "Dt") ? "본원" : 일간에_따른_천간_십신_출력(Set.gan, baseDayStem));
}

export function 지지관련_정보_업데이트(prefix, branch, baseDayStem, branchMapping, 아이디_유무_검사, 일간에_따른_지지_십신_출력, updateHiddenStems) {
  아이디_유무_검사(prefix + "Hanja", (branchMapping[branch]?.hanja) || "-");
  아이디_유무_검사(prefix + "Hanguel", (branchMapping[branch]?.hanguel) || "-");
  아이디_유무_검사(prefix + "Eumyang", (branchMapping[branch]?.eumYang) || "-");
  아이디_유무_검사(prefix + "10sin", 일간에_따른_지지_십신_출력(branch, baseDayStem));
  updateHiddenStems(branch, prefix);
}

export function 드래그관련_UI_업데이트(showDrag, dragNoticeEl, dragBtnElements) {
  dragNoticeEl.style.display = showDrag ? "block" : "none";
  dragBtnElements.forEach(btn => {
    btn.style.display = showDrag ? "block" : "none";
  });
}

// showDetailViewUI
export function 상세보기_UI_전환함수() {
  document.getElementById("wongookLM").classList.remove("w100");
  document.getElementById("luckyWrap").style.display = "block";
  document.getElementById("woonArea").style.display = "block";
  document.getElementById("woonContainer").style.display = "none";
  document.getElementById("calArea").style.display = "none";

  const myowoonBtn = document.getElementById("myowoonMore");
  myowoonBtn.classList.remove("active");
  myowoonBtn.innerText = "묘운력(운 전체) 상세보기";

  document.getElementById("aside").style.display = "none";
  document.getElementById("inputWrap").style.display = "none";
  document.getElementById("resultWrapper").style.display = "block";

  window.scrollTo(0, 0);
}

//setupDetailViewButtons
export function 버튼_클릭시_상세보기(savedList) {
  document.querySelectorAll(".detailViewBtn").forEach(button => {
    button.addEventListener("click", function (e) {
      e.stopPropagation();

      const proceed = 수정_저장_여부_확인(isModifyMode, () => {
        isModifyMode = false;
        originalDataSnapshot = "";
        currentModifyIndex = null;
      });

      if (!proceed) return;

      const idx = parseInt(button.getAttribute("data-index"), 10);
      const item = savedList[idx];
      if (!item) return;

      저장_명식_입력폼_반영(item);
      document.getElementById("calcBtn").click();
      상세보기_UI_전환함수();
    });
  });
}

// 출생시간 모름 버튼 클릭시 UI UPDATE
export function 출생시간_모름_토글(isChecked) {
  const timeType = document.getElementById("timeType");
  const birthPlaceTxt = document.getElementById("birthPlaceTxt");

  if (!timeType || !birthPlaceTxt) return;

  if (isChecked) {
    timeType.style.display = "none";
    birthPlaceTxt.style.display = "block";  // 시 모르면 문구 표시
  } else {
    timeType.style.display = "block";
    birthPlaceTxt.style.display = "none";   // 시 입력 가능하면 문구 숨김
  }
}
