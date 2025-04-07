
import { 출생시간_모름_토글 } from "./uiUpdate.js";
import { 명식_리스트_로드 } from "./render.js";

// inputName 10글자 제한
export function 인풋네임_10글자_제한(inputElement, maxLength = 10) {
  if (!inputElement || typeof inputElement.addEventListener !== "function") return;

  inputElement.addEventListener("input", function () {
    if (this.value.length > maxLength) {
      this.value = this.value.slice(0, maxLength);
    }
  });
}

// 출생시간 모름일 떄 출생지 input disabled
export function 출생시간_모름_클릭시_disabled_처리(isChecked, birthPlaceSelect) {
  if (isChecked) {
    birthPlaceSelect.value = "";
    birthPlaceSelect.disabled = true;
  } else {
    birthPlaceSelect.disabled = false;
  }
}

// 출생시간 모름일 떄 출생지 select disabled
export function 출생지_모름_클릭시_disabled_처리(isChecked, birthTimeSelect) {
  if (isChecked) {
    birthTimeSelect.value = "";
    birthTimeSelect.disabled = true;
  } else {
    birthTimeSelect.disabled = false;
  }
}

// 입력값 데이터 모음 함수
// export function 폼_데이터_모음({
//   birthdayInput,
//   birthtimeInput,
//   birthPlaceInput,
//   nameInput,
//   genderInput,
//   timeUnknownCheckbox,
//   placeUnknownCheckbox,
//   time2Radios
// }) {
//   const mjBirthday = birthdayInput.value.trim();
//   const mjBirthtime = birthtimeInput.value.trim();
//   const isTimeUnknown = timeUnknownCheckbox.checked;
//   const isPlaceUnknown = placeUnknownCheckbox.checked;
//   const mjGender = genderInput.checked ? "남" : "여";
//   const mjBirthPlace = birthPlaceInput.value;
//   const mjName = nameInput.value.trim() || "이름없음";
//   const selectedTime2 = [...time2Radios].find(r => r.checked)?.value || "";

//   return {
//     mjBirthday,
//     mjBirthtime,
//     isTimeUnknown,
//     isPlaceUnknown,
//     mjGender,
//     mjBirthPlace,
//     mjName,
//     selectedTime2
//   };
// }

// 명식 및 보정 계산 함수
export function 명식_데이터_보정({
  mjBirthday,
  mjBirthtime,
  isTimeUnknown,
  isPlaceUnknown,
  mjGender,
  mjBirthPlace,
  mjName,
  selectedTime2
}, 대운_고수준_서비스, 정보_보정, calculateAge, 날짜_포맷) {

  const mjYear = parseInt(mjBirthday.slice(0, 4), 10);
  const mjMonth = parseInt(mjBirthday.slice(4, 6), 10);
  const mjDay = parseInt(mjBirthday.slice(6, 8), 10);
  const mjHour = isTimeUnknown ? 0 : parseInt(mjBirthtime.slice(0, 2), 10);
  const mjMinute = isTimeUnknown ? 0 : parseInt(mjBirthtime.slice(2, 4), 10);

  const mjBirthPlaceValue = isPlaceUnknown ? "" : mjBirthPlace;

  const displayHour = isTimeUnknown ? "-" : mjBirthtime.slice(0, 2);
  const displayMinute = isTimeUnknown ? "-" : mjBirthtime.slice(2, 4);
  const displayBirthtime = `${displayHour}${displayMinute}`;

  const result = 대운_고수준_서비스(mjYear, mjMonth, mjDay, mjHour, mjMinute, mjBirthPlaceValue, mjGender);
  const [연_간지_출력_상수, 월_간지_출력_상수, 일_간지_출력_상수, 시_간지_출력_상수] = result.split(", ")[0]?.split(" ") || [];
  const 시_간지_출력_상수_예외 = isTimeUnknown ? "-" : (시_간지_출력_상수 || "");

  const dateObj = new Date(mjYear, mjMonth - 1, mjDay, mjHour, mjMinute);
  const 시간_보정_함수 = isTimeUnknown
    ? null
    : isPlaceUnknown
    ? new Date(dateObj.getTime() - 30 * 60000)
    : 정보_보정(dateObj, mjBirthPlaceValue);

  const age = 시간_보정_함수 ? calculateAge(시간_보정_함수) : "-";
  const birthdayTime = 시간_보정_함수 ? 날짜_포맷(시간_보정_함수) : "?";

  return {
    mjBirthday,
    mjBirthtime: displayBirthtime,
    mjGender,
    birthPlace: savedBirthPlace,
    mjName,
    result,
    연_간지_출력_상수: 연_간지_출력_상수 || "",
    월_간지_출력_상수: 월_간지_출력_상수 || "",
    일_간지_출력_상수: 일_간지_출력_상수 || "",
    시_간지_출력_상수_예외,
    age,
    birthdayTime,
    isTimeUnknown,
    isPlaceUnknown,
    selectedTime2
  };
}

// 명식 데이터 저장 함수
export function 명식_데이터_저장(newData, storageKey = "myeongsikList") {
  const list = JSON.parse(localStorage.getItem(storageKey)) || [];

  const alreadySaved = list.some(item =>
    item.mjBirthday === newData.mjBirthday &&
    item.mjBirthtime === newData.mjBirthtime &&
    item.mjGender === newData.mjGender &&
    item.mjBirthPlace === newData.mjBirthPlace &&
    item.selectedTime2 === newData.selectedTime2
  );

  if (alreadySaved) {
    const confirmSave = confirm("이미 같은 정보의 명식이 존재합니다. 한 번 더 저장하시겠습니까?");
    if (!confirmSave) return false;
  }

  list.push(newData);
  localStorage.setItem(storageKey, JSON.stringify(list));
  return true;
}

export function 시간_모름_처리(item) {
  return item.isTimeUnknown ? "시간모름" : formatBirthtime(item.birthtime);
}

export function 출생지_모름_처리(item) {
  if (item.isPlaceUnknown === true) return "출생지모름";
  const trimmed = item.birthPlace?.trim();
  return trimmed && trimmed !== "출생지 선택" ? trimmed : "-";
}

export function 시간_기준_모름_처리(item) {
  if (item.isTimeUnknown) return "시간기준모름";
  switch (item.selectedTime2) {
    case "jasi": return "자시";
    case "yajojasi": return "야 · 조자시";
    case "insi": return "인시";
    default: return "-";
  }
}

// 수정 내용이 바뀌었는가 확인
export function 수정_내용이_바뀌었나요() {
  isModifyMode = false;
  originalDataSnapshot = "";
  currentModifyIndex = null;
}

// 수정내용 저장 확인 함수
export function 수정_저장_여부_확인(
  isModifyMode,
  confirmFn = confirm
) {
  if (isModifyMode) {
    const confirmLeave = confirmFn("수정된 내용을 저장하지 않았습니다. 정말 이동하시겠습니까?");
    if (!confirmLeave) return false;
  }
  resetStateCallback();
  return true;
}

// populateFormFromSavedItem
export function 저장_명식_입력폼_반영(item) {
  document.getElementById("inputName").value = item.name;
  document.getElementById("inputBirthday").value = item.birthday;

  if (item.isTimeUnknown) {
    document.getElementById("bitthTimeX").checked = true;
    document.getElementById("inputBirthtime").value = "0330";
  } else {
    document.getElementById("bitthTimeX").checked = false;
    document.getElementById("inputBirthtime").value = item.birthtime.replace(/\s/g, "").trim();
  }

  if (item.isPlaceUnknown) {
    document.getElementById("bitthPlaceX").checked = true;
    document.getElementById("inputBirthPlace").value = "출생지 선택";
  } else {
    document.getElementById("bitthPlaceX").checked = false;
    document.getElementById("inputBirthPlace").value = item.birthPlace;
  }

  document.getElementById("genderMan").checked = item.gender === "남";
  document.getElementById("genderWoman").checked = item.gender === "여";

  if (item.selectedTime2 === "jasi") {
    document.getElementById("jasi").checked = true;
    document.getElementById("timeChk02_01").checked = true;
  } else if (item.selectedTime2 === "yajojasi") {
    document.getElementById("yajojasi").checked = true;
    document.getElementById("timeChk02_02").checked = true;
  } else if (item.selectedTime2 === "insi") {
    document.getElementById("insi").checked = true;
    document.getElementById("timeChk02_03").checked = true;
  }
}

export function 삭제진행_인덱스_처리(idx, storageKey = "myeongsikList") {
  const list = JSON.parse(localStorage.getItem(storageKey)) || [];

  if (idx >= 0 && idx < list.length) {
    list.splice(idx, 1);
    localStorage.setItem(storageKey, JSON.stringify(list));
    return true; // 삭제 성공
  }

  return false; // 삭제 실패
}

// 명식 삭제 바인딩 함수
export function 삭제_바인딩_함수(loadFn, storageKey = "myeongsikList") {
  document.querySelectorAll(".delete_btn").forEach(button => {
    button.addEventListener("click", function (e) {
      e.stopPropagation(); // li 클릭 이벤트 방지

      const confirmDelete = confirm("정말로 해당 명식을 삭제하시겠습니까?");
      if (!confirmDelete) return;

      const dataIndex = button.getAttribute("data-index");         // delete_3
      const idxStr = dataIndex.replace("delete_", "");             // 3
      const idx = parseInt(idxStr, 10) - 1;                        // 실제 인덱스 2

      const success = 삭제진행_인덱스_처리(idx, storageKey);
      if (success) {
        loadFn(); // 예: loadSavedMyeongsikList()
        alert("해당 명식이 삭제되었습니다.");
      }
    });
  });
}

export function 사이드바_토글_이벤트(loadListFn) {
  document.getElementById("listViewBtn").addEventListener("click", () => {
    명식_리스트_로드(); // 예: loadSavedMyeongsikList()
    document.getElementById("aside").style.display = "block";
  });

  document.getElementById("closeBtn").addEventListener("click", () => {
    document.getElementById("aside").style.display = "none";
  });

  document.getElementById("backBtnAS").addEventListener("click", () => {
    window.location.reload();
  });
}

// 출생시강 모름 토글 상태 제어
export function 출생시간_모름_토글_상태제어() {
  const checkbox = document.getElementById("bitthTimeX");
  if (!checkbox) return;

  checkbox.addEventListener("change", function () {
    출생시간_모름_토글(this.checked);
  });
}