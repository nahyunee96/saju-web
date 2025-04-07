// helper.js = 유틸 헬퍼 함수 모음 창고

export function 아이디_유무_검사(id, text) {
  const elem = document.getElementById(id);
  if (elem) elem.innerText = text;
}

// 문자열 관리
export function 문자열_두글자화(num) { 
  return num.toString().padStart(2, '0'); 
}

export function 문자열_분리(set) {
  if (typeof set === 'string' && set.length >= 2) {
    return { gan: set[0], ji: set[1] };
  }
  return { gan: "-", ji: "-" };
}