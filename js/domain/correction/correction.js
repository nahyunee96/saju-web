// correction.js = 보정함수 창고

export function 정보_보정({
  dateObj,
  birthPlace,
  unknownPlace = false,
  도시_보정시,
  균시차_계산,
  썸머타임_계산
}) {
  if (unknownPlace) {
    return new Date(dateObj.getTime() - 30 * 60000); // 30분 보정
  }
  const cityLongitude = 도시_보정시[birthPlace] || 도시_보정시["서울특별시"];
  const longitudeCorrection = (cityLongitude - 135.1) * 4; // 분 단위
  const eqTime = 균시차_계산(dateObj); // 분 단위
  let correctedTime = new Date(dateObj.getTime() + (longitudeCorrection + eqTime) * 60000);
  const summerInterval = 썸머타임_계산(correctedTime.getFullYear());

  if (summerInterval && correctedTime >= summerInterval.start && correctedTime < summerInterval.end) {
    correctedTime = new Date(correctedTime.getTime() - 60 * 60000); // 서머타임 보정
  }

  return correctedTime;
}