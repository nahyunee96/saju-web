// info.js = 정보 관련 모음 창고

export function 남녀_음양으로_구분(gender, yearPillar) {
  const isYang = ["갑", "병", "무", "경", "임"].includes(yearPillar.charAt(0));
  const isForward = (gender === "남" && isYang) || (gender === "여" && !isYang);
  return isForward;
}

// 명주 정보모음 상수 저장
export const mjInfo = {
  name: "",
  birthday: "",       // 예: "20250408"
  birthtime: "",      // 예: "0930"
  gender: "",
  birthPlace: "",
  timeType: "",
  monthType: "",
  birthDate: "",

  // 아래는 숫자 파싱한 결과 저장용
  year: null,
  month: null,   // 1월 → 1, 12월 → 12
  day: null,
  hour: null,

  isTimeUnknown: false,
  isPlaceUnknown: false
};

export function 수집된_입력값_저장() {
  const unknownTime = document.getElementById("bitthTimeX").checked;
  const unknownPlace = document.getElementById("bitthPlaceX").checked;

  const name = document.getElementById("inputName").value.trim() || "-";
  const birthday = document.getElementById("inputBirthday").value.trim();
  const birthtime = unknownTime
    ? "0330"
    : document.getElementById("inputBirthtime").value.trim();

  const gender = document.getElementById("genderMan").checked ? "남" : "여";
  const birthPlace = document.getElementById("inputBirthPlace").value || "-";
  const usedBirthPlace = (unknownPlace || birthPlace === "" || birthPlace === "출생지 선택")
                            ? "서울특별시" : birthPlace;
  const savedBirthPlace = unknownPlace ? "" : birthPlace;
  const monthType = document.querySelector('input[name="monthType"]:checked')?.value || "";
  const timeType = document.querySelector('input[name="time2"]:checked')?.value || "";

  // 전역 저장소에 저장
  mjInfo.name = name;
  mjInfo.birthday = birthday;
  mjInfo.birthtime = birthtime;
  mjInfo.gender = gender;
  mjInfo.usedBirthPlace = usedBirthPlace;
  mjInfo.savedBirthPlace = savedBirthPlace;
  mjInfo.birthPlace = birthPlace;
  mjInfo.monthType = monthType;
  mjInfo.timeType = timeType;
  mjInfo.year = parseInt(birthday.slice(0, 4), 10);
  mjInfo.month = parseInt(birthday.slice(4, 6), 10);
  mjInfo.day = parseInt(birthday.slice(6, 8), 10);
  mjInfo.hour = mjInfo.isTimeUnknown ? 0 : parseInt(birthtime.slice(0, 2), 10);
  mjInfo.minute = mjInfo.isTimeUnknown ? 0 : parseInt(birthtime.slice(2, 4), 10);

  mjInfo.unknownTime = unknownTime;
  mjInfo.unknownPlace = unknownPlace;
}
