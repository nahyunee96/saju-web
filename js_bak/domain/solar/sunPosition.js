// sunPosition.js = 자바스크립트 Date 객체 → JD 값 교체하는 창고

// 자바스크립트 Date 객체 → JD 값 교체
export function 데이트_객체에서_JD값으로(dateObj, calendarToJD) {
  const y = dateObj.getFullYear(), m = dateObj.getMonth() + 1;
  const d = dateObj.getDate() + dateObj.getHours() / 24 + dateObj.getMinutes() / (24 * 60);
  return calendarToJD(y, m, d);
}