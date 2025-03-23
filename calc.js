(function main() {
  // 60간지
  const GANZI_60 = [
    "갑자","을축","병인","정묘","무진","기사","경오","신미","임신","계유",
    "갑술","을해","병자","정축","무인","기묘","경진","신사","임오","계미",
    "갑신","을유","병술","정해","무자","기축","경인","신묘","임진","계사",
    "갑오","을미","병신","정유","무술","기해","경자","신축","임인","계묘",
    "갑진","을사","병오","정미","무신","기유","경술","신해","임자","계축",
    "갑인","을묘","병진","정사","무오","기미","경신","신유","임술","계해"
  ];

  // 날짜 포맷
  function formatDateTime(dateObj) {
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dd = String(dateObj.getDate()).padStart(2, '0');
    const hh = String(dateObj.getHours()).padStart(2, '0');
    const mi = String(dateObj.getMinutes()).padStart(2, '0');
    return `${yyyy}.${mm}.${dd} ${hh}:${mi}`;
  }

  // -----------------------------
  // A. 일주 타이머 (120일 주기)
  // -----------------------------
  // 시작: 1997-12-29 00:00
  let iljuDate = new Date(2001, 10, 11, 12, 30);
  // 초기 간지: "기해"(index=35)라고 가정
  let iljuIndex = GANZI_60.indexOf("갑술"); // 35
  // 다음 일주 변경 시점
  function nextIlju() {
    // 120일 후
    const nextDate = new Date(iljuDate.getTime());
    nextDate.setDate(nextDate.getDate() + 120);

    // 순행 예: iljuIndex+1, 역행이면 -1
    const nextIndex = (iljuIndex + 1 + 60) % 60;
    return { date: nextDate, index: nextIndex };
  }
  // -----------------------------
  // B. 시주 타이머 (10일 주기, 역행)
  // -----------------------------
  // 시작: 1997-12-29 16:30, "계미"(index=19)
  let sijuDate = new Date(2001, 10, 11, 12, 30);
  let sijuIndex = GANZI_60.indexOf("기미"); // 19
  function nextSiju() {
    const nextDate = new Date(sijuDate.getTime());
    nextDate.setDate(nextDate.getDate() + 10);

    // 역행
    const nextIndex = (sijuIndex + 1 + 60) % 60;
    return { date: nextDate, index: nextIndex };
  }

  // -----------------------------
  // 종료 시점
  // -----------------------------
  const endDate = new Date(2025, 02, 23, 20, 40); // 2025-03-23 00:00

  // -----------------------------
  // 반복: 일주/시주 중 가까운 쪽 날짜가 오면 log 찍고 갱신
  // -----------------------------
  while (true) {
    // 다음 일주 변경 후보
    const ni = nextIlju();
    // 다음 시주 변경 후보
    const ns = nextSiju();

    // 둘 중 더 빠른(작은) 날짜가 우선
    let nextEvent;
    let eventType; // "ilju" or "siju"
    if (ni.date < ns.date) {
      nextEvent = ni;
      eventType = "ilju";
    } else {
      nextEvent = ns;
      eventType = "siju";
    }

    // 만약 nextEvent.date 가 endDate(2025-03-23)를 넘어가면 종료
    if (nextEvent.date > endDate) {
      break; // while 끝
    }

    // 1) 시간 진행
    if (eventType === "ilju") {
      // 일주가 바뀌는 순간에, 그 시점 일주/시주 출력을 찍고 일주 타이머 갱신
      iljuDate = nextEvent.date;
      iljuIndex = nextEvent.index;
    } else {
      // 시주가 바뀌는 순간에, 그 시점 일주/시주 출력, 시주 타이머 갱신
      sijuDate = nextEvent.date;
      sijuIndex = nextEvent.index;
    }

    // 2) 콘솔 출력: "YYYY.MM.DD hh:mm → 일주: XX, 시주: XX"
    //   현재 시점은 nextEvent.date
    //   실제로는 iljuDate/sijuDate 중 더 최근 갱신된 것을 반영
    const cur = (eventType === "ilju") ? iljuDate : sijuDate;
    const stamp = formatDateTime(cur);
    const currentIljuName = GANZI_60[iljuIndex];
    const currentSijuName = GANZI_60[sijuIndex];
    //console.log(`${stamp} → 일주: ${currentIljuName}, 시주: ${currentSijuName}`);
  }
})();
