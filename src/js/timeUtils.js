// js/timeUtils.js

/**
 * 현재 시각을 한국 표준시(KST)로 변환
 * @param {Date} date - 기준 Date (기본: 현재)
 * @returns {Date} KST Date
 */
export function toKoreanTime(date = new Date()) {
  const utcMs     = date.getTime() + date.getTimezoneOffset() * 60_000;
  const kstOffset = 9 * 60 * 60_000;
  return new Date(utcMs + kstOffset);
}

/**
 * 생년월일로 만 나이 계산 (한국 기준)
 * @param {Date} birthDate
 * @returns {number} 만 나이
 */
export function calculateAge(birthDate) {
  const today = toKoreanTime(new Date());
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

/**
 * Date 객체를 "YYYY.MM.DD" 형식 문자열로 반환
 * @param {Date} dateObj
 * @returns {string} formatted date
 */
export function formatDate(dateObj) {
  const yyyy = dateObj.getFullYear();
  const mm   = String(dateObj.getMonth() + 1).padStart(2, "0");
  const dd   = String(dateObj.getDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}`;
}
