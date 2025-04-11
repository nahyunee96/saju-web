export function validateUserInputs({
  name,
  birth,
  monthType,
  birthTime,
  isTimeUnknown,
  gender,
  birthPlace,
  isPlaceUnknown,
  timeStandard,
}) {
  // 이름 유효성
  if (name.length > 10) {
    alert('이름은 10글자 이내로 입력해주세요.');
    return false;
  }

  // 출생일 유효성
  if (!birth) {
    alert('출생일을 입력해주세요.');
    return false;
  }
  if (birth.length !== 8 || !/^\d{8}$/.test(birth)) {
    alert('출생일은 8자리 숫자(예: 19900101)로 입력해주세요.');
    return false;
  }
  const year = parseInt(birth.substring(0, 4), 10);
  const month = parseInt(birth.substring(4, 6), 10);
  const day = parseInt(birth.substring(6, 8), 10);
  const dateObj = new Date(year, month - 1, day);
  if (
    year < 1900 || year > 2100 ||
    month < 1 || month > 12 ||
    day < 1 || day > 31 ||
    dateObj.getFullYear() !== year ||
    dateObj.getMonth() + 1 !== month ||
    dateObj.getDate() !== day
  ) {
    alert('유효한 날짜를 입력해주세요.');
    return false;
  }

  // 출생시간 유효성
  if (!isTimeUnknown) {
    if (birthTime.length !== 4 || !/^\d{4}$/.test(birthTime)) {
      alert('출생시간은 4자리 숫자(예: 0930)로 입력해주세요.');
      return false;
    }
    const hour = parseInt(birthTime.substring(0, 2), 10);
    const minute = parseInt(birthTime.substring(2, 4), 10);
    if (hour < 0 || hour > 24 || minute < 0 || minute > 60) {
      alert('출생시간은 "00:00 ~ 23:59" 범위 내로 입력해주세요. (24:00, 60분은 00으로 처리됩니다)');
      return false;
    }
  }


  // 성별 유효성
  if (!gender) {
    alert('성별을 선택해주세요.');
    return false;
  }

  // 출생지 유효성
  if (!isPlaceUnknown && (!birthPlace || birthPlace === '출생지 선택')) {
    alert('출생지를 선택해주세요.');
    return false;
  }

  // 시간 기준 유효성
  if (!timeStandard) {
    alert('시간 기준을 지정해주세요.');
    return false;
  }

  // UI 표시용 문자열 생성
  const nameStr = name || '지정되지 않음';

  // 계산용 값
  const birthTimeValue = isTimeUnknown ? '0330' : birthTime;     
  const birthPlaceValue = isPlaceUnknown ? '서울특별시' : birthPlace;   
  
  const birthStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  // UI 표시용 문자열
  const birthTimeStr = isTimeUnknown
    ? '출생시간모름'
    : `${birthTime.slice(0, 2)}:${birthTime.slice(2, 4) === '60' ? '00' : birthTime.slice(2, 4)}`;

  const birthPlaceStr = isPlaceUnknown ? '출생지모름' : birthPlace;

  // 시간 기준 선택 한글 출력
  const timeStandardStr = {
    jasi: '자시',
    yajojasi: '야 · 조자시',
    insi: '인시',
  }[timeStandard] || '시간 기준 없음';

  const confirmText =
    `이름: ${nameStr}\n` +
    `출생일: ${birthStr} (${monthType})\n` +
    `출생시간: ${birthTimeStr}\n` +
    `성별: ${gender}\n` +
    `출생지선택: ${birthPlaceStr}\n` +
    `시간 기준 선택: ${timeStandardStr}\n\n` +
    `선택하신 명식 정보를 확인해주세요.\n이 정보대로 만세력을 출력하시겠습니까?`;


  if (!confirm(confirmText)) return { valid: false };

  return {
    valid: true,
    birthTimeValue,
    birthPlaceValue,
    birthStr,
    birthTimeStr,
    birthPlaceStr,
    timeStandardStr,
  };
}
