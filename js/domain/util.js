// domain/util.js = 도메인 관련 유틸 함수

// export let 전역_상태 = {
//   birthYear: null,
//   month: null,
//   day: null,
//   birthPlace: null,
//   gender: null,
//   daewoonData: null,
//   sewoonStartYear: null
// };

// 지지를 인덱스로 분류해주는 함수
export function 지지를_인덱스로_분류(dateObj) {
  let totalMinutes = dateObj.getHours() * 60 + dateObj.getMinutes();
  const ZASI_START = 23 * 60; // 자시 시작: 23:00 (1380분)
  let adjustedMinutes = totalMinutes;
  if (adjustedMinutes < ZASI_START) {
    adjustedMinutes += 1440; // 하루(1440분) 보정
  }
  const diff = adjustedMinutes - ZASI_START;
  const index = Math.floor(diff / 120) % 12;
  return index;
}

// 지지에서 시간을 문자열로 변환하는 함수
export function 지지관련_시간에서_문자열로_변환(dateObj) {
  const totalMinutes = dateObj.getHours() * 60 + dateObj.getMinutes();
  for (const [branch, info] of Object.entries(jijiInfo)) {
    const { start, end } = info.time;
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