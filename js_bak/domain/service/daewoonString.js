// daewoonString.js = 대운 문자열에 대한 창고
import { mjInfo } from "../info.js";
import { 대운_데이터 } from "./daewoon.js";

// 대운 리스트를 문자열로 변환하는 함수
export function 대운_리스트_포맷(daewoonList) {
  return daewoonList.map(item => `${item.age}(${item.stem}${item.branch})`).join(", ");
}

// 최종 문자열 구성하는 함수
export function 대운_데이터_문자열() {
  const data = 대운_데이터(mjInfo.usedBirthPlace, mjInfo.gender);
  const listStr = data.list.map(item => `${item.age}(${item.stem}${item.branch})`).join(", ");
  return `대운수 ${data.base}, 대운 나이 목록: ${listStr}`;
}
