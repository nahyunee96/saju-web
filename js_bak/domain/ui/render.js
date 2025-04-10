// render.js = 화면에 그려내는 함수

// 저장명식 렌더링 함수
export function 저장_명식_렌더링(
  item,
  index,
  시간_모름_처리,
  시간_기준_모름_처리,
  출생지_모름_처리
) {
  const birthtimeDisplay = 시간_모름_처리(item);
  const birthPlaceDisplay = 시간_기준_모름_처리(item);
  const displayTimeLabel = 출생지_모름_처리(item);

  const li = document.createElement("li");
  li.setAttribute("data-index", index);

  li.innerHTML = `
    <div class="info_btn_zone">
      <button class="drag_btn_zone" id="dragBtn_${index + 1}">
        <div class="line"></div><div class="line"></div><div class="line"></div>
      </button>
      <ul class="info">
        <li class="name_age" id="nameAge">
          <span><b id="nameSV_${index + 1}">${item.name}</b></span>
          <span>(만 <b id="ageSV_${index + 1}">${item.age}</b>세, <b id="genderSV_${index + 1}">${item.gender}</b>)</span>
        </li>
        <li class="ganzi" id="ganZi">
          <span><b id="yearGZ_${index + 1}">${item.yearPillar}</b>년</span>
          <span><b id="monthGZ_${index + 1}">${item.monthPillar}</b>월</span>
          <span><b id="dayGZ_${index + 1}">${item.dayPillar}</b>일</span>
          <span><b id="timeGZ_${index + 1}">${item.hourPillar}</b>시</span>
        </li>
        <li class="birth_day_time" id="birthDayTime">
          <span id="birthdaySV_${index + 1}">
            ${item.birthday.slice(0, 4)}년 
            ${item.birthday.slice(4, 6)}월 
            ${item.birthday.slice(6, 8)}일
          </span>
          <span id="birthtimeSV_${index + 1}">
            ${birthtimeDisplay}
          </span>
        </li>
        <li>
          <span><b id="birthPlaceSV_${index + 1}">${birthPlaceDisplay}</b></span>
          <span><b id="selectTime2__${index + 1}">${displayTimeLabel}</b>기준 명식</span>
        </li>
      </ul>
    </div>
    <div class="btn_zone">
      <button class="black_btn detailViewBtn" id="detailViewBtn_${index + 1}" data-index="${index}">명식 보기</button>
      <button class="black_btn modify_btn" id="modifyBtn_${index + 1}" data-index="${index}">수정</button>
      <button class="black_btn delete_btn" data-index="delete_${index + 1}"><span>&times;</span></button>
    </div>
  `;

  // 하이라이트 복원용 데이터 저장
  li.querySelector(".name_age").dataset.original = li.querySelector(".name_age").innerHTML;
  li.querySelector(".ganzi").dataset.original = li.querySelector(".ganzi").innerHTML;
  li.querySelector(".birth_day_time").dataset.original = li.querySelector(".birth_day_time").innerHTML;

  return li;
}

// 저장된 명식 리스트 로드하는 함수
export function 명식_리스트_로드(listUl, 저장_명식_렌더링, storageKey = "myeongsikList") {
  const savedList = JSON.parse(localStorage.getItem(storageKey)) || [];
  savedMyeongsikList = savedList;

  if (!listUl) return;
  listUl.innerHTML = "";

  savedList.forEach((item, index) => {
    const li = 저장_명식_렌더링(item, index);
    listUl.appendChild(li);
  });
}

// 삭제 처리 함수
export function 삭제진행_인덱스_처리(idx, storageKey = "myeongsikList") {
  const list = JSON.parse(localStorage.getItem(storageKey)) || [];
  if (idx >= 0 && idx < list.length) {
    list.splice(idx, 1);
    localStorage.setItem(storageKey, JSON.stringify(list));
    return true; // 삭제 성공
  }
  return false; // 삭제 실패
}


