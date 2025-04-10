// 보정 함수
import { 도시_보정시_상수 } from "./constans.js";
import { 썸머타임_함수 } from "../designate/main.js";
import { 균시차_함수 } from "../calculation/main.js";

export function 보정시_출력_함수(dateObj, isPlaceUnknown, birthPlace) {
  if (isPlaceUnknown) {
    return new Date(dateObj.getTime() - 30 * 60000); 
  }
  const 도시_지정_상수 = 도시_보정시_상수[birthPlace] || 도시_보정시_상수["서울특별시"];
  const 경도_보정 = (도시_지정_상수 - 135.1) * 4; 
  const eqTime = 균시차_함수(dateObj); 
  let correctedTime = new Date(dateObj.getTime() + (경도_보정 + eqTime) * 60000);
  const 썸마타임_상수 = 썸머타임_함수(correctedTime.getFullYear());
  if (썸마타임_상수 && correctedTime >= 썸마타임_상수.start && correctedTime < 썸마타임_상수.end) {
    correctedTime = new Date(correctedTime.getTime() - 60 * 60000); 
  }
  return correctedTime;
}