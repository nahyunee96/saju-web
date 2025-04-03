(function main() {
  // 60간지 배열
  const GANZI_60 = [
    "갑자", "을축", "병인", "정묘", "무진", "기사", "경오", "신미", "임신", "계유",
    "갑술", "을해", "병자", "정축", "무인", "기묘", "경진", "신사", "임오", "계미",
    "갑신", "을유", "병술", "정해", "무자", "기축", "경인", "신묘", "임진", "계사",
    "갑오", "을미", "병신", "정유", "무술", "기해", "경자", "신축", "임인", "계묘",
    "갑진", "을사", "병오", "정미", "무신", "기유", "경술", "신해", "임자", "계축",
    "갑인", "을묘", "병진", "정사", "무오", "기미", "경신", "신유", "임술", "계해"
  ];

  // 날짜 포맷 함수 (YYYY.MM.DD hh:mm)
  function formatDateTime(dateObj) {
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
    const dd = String(dateObj.getDate()).padStart(2, "0");
    const hh = String(dateObj.getHours()).padStart(2, "0");
    const mi = String(dateObj.getMinutes()).padStart(2, "0");
    return `${yyyy}.${mm}.${dd} ${hh}:${mi}`;
  }

  // 1일(24시간)의 밀리초
  const oneDayMs = 24 * 60 * 60 * 1000;

  // ----------------------------------
  // 입력: 생년월일/생시
  // 예: 1996년 12월 29일 16:30 (여자)
  const birthDate = new Date(1996, 11, 29, 16, 3);

  // ----------------------------------
  // 입력: 절기 기준 날짜 (직접 입력)
  // 연주 기준 (입춘): 1996년 2월 4일 22:08
  const ipchun = new Date(1996, 1, 4, 22, 8);
  // 월주 기준 (대설): 1996년 12월 7일 23:22
  const daeseol = new Date(1996, 11, 7, 23, 22);

  // ----------------------------------
  // 각 운세의 모드 설정 ("순행" 또는 "역행")
  // 여기서는 예시로 모두 "역행"으로 설정
  const yeonjuMode = "역행";
  const woljuMode = "역행";
  const iljuMode  = "역행";
  const sijuMode  = "역행";

  // ----------------------------------
  // 고정 주기 (일 단위)
  const sijuCycle  = 10;       // 시주: 10일
  const iljuCycle  = 121.6;    // 일주: 121.6일
  const woljuCycle = 3652.4;   // 월주: 3652.4일 (10년)
  const yeonjuCycle = 21914.4; // 연주: 21914.4일 (60년)

  // ========================================
  // 1. 운세별 첫번째 간지 변경 오프셋 계산 함수들
  // ========================================

  // [시주] – 시간 기준  
  // mode==="순행": 기준 = 다음 시의 30분; mode==="역행": 기준 = 이전 시의 30분  
  // 120분 → 10일 환산
  function calculateSijuOffset(birth, mode) {
    let ref = new Date(birth);
    if (mode === "순행") {
      ref.setHours(birth.getHours() + 1);
      ref.setMinutes(30);
      let diffMinutes = (ref - birth) / (60 * 1000);
      return (diffMinutes / 120) * 10;
    } else { // 역행
      ref.setHours(birth.getHours() - 1);
      ref.setMinutes(30);
      let diffMinutes = (birth - ref) / (60 * 1000);
      return (diffMinutes / 120) * 10;
    }
  }

  // [일주] – 인시 기준 (여기서는 03:30 사용)
  // mode==="순행": 기준 = 다음 날 03:30; mode==="역행": 기준 = 같은 날(또는 전날) 03:30
  // 24시간 → 121.6일 환산
  function calculateIljuOffset(birth, mode) {
    let ref = new Date(birth);
    if (mode === "순행") {
      // 다음 날 03:30
      let todayRef = new Date(birth);
      todayRef.setHours(3, 30, 0, 0);
      if (birth < todayRef) {
        ref = todayRef;
      } else {
        ref = new Date(birth.getTime() + oneDayMs);
        ref.setHours(3, 30, 0, 0);
      }
      let diffHours = (ref - birth) / (60 * 60 * 1000);
      return (diffHours / 24) * 121.6;
    } else { // 역행
      let todayRef = new Date(birth);
      todayRef.setHours(3, 30, 0, 0);
      if (birth >= todayRef) {
        ref = todayRef;
      } else {
        ref = new Date(birth.getTime() - oneDayMs);
        ref.setHours(3, 30, 0, 0);
      }
      let diffHours = (birth - ref) / (60 * 60 * 1000);
      return (diffHours / 24) * 121.6;
    }
  }

  // [월주] – 절기 기준 (대설)
  // mode==="순행": 기준 = 현재년 또는 다음년의 대설 (출생 후의 가장 가까운 대설)
  // mode==="역행": 기준 = 현재년 또는 전년의 대설 (출생 전의 가장 가까운 대설)
  function calculateWoljuOffset(birth, daeseol, mode) {
    let currentYearDaeseol = new Date(birth.getFullYear(), daeseol.getMonth(), daeseol.getDate(), daeseol.getHours(), daeseol.getMinutes());
    let ref;
    if (mode === "순행") {
      if (birth < currentYearDaeseol) {
        ref = currentYearDaeseol;
      } else {
        ref = new Date(birth.getFullYear() + 1, daeseol.getMonth(), daeseol.getDate(), daeseol.getHours(), daeseol.getMinutes());
      }
    } else { // 역행
      if (birth >= currentYearDaeseol) {
        ref = currentYearDaeseol;
      } else {
        ref = new Date(birth.getFullYear() - 1, daeseol.getMonth(), daeseol.getDate(), daeseol.getHours(), daeseol.getMinutes());
      }
    }
    let diffDays = Math.abs((birth - ref) / oneDayMs);
    return (diffDays / 30.4) * 3652.4;
  }

  // [연주] – 절기 기준 (입춘)
  // mode==="순행": 기준 = 다음해의 입춘; mode==="역행": 기준 = 현재년(또는 전년)의 입춘 (출생일에 가장 가까운 입춘)
  function calculateYeonjuOffset(birth, ipchun, mode) {
    let currentYearIpchun = new Date(birth.getFullYear(), ipchun.getMonth(), ipchun.getDate(), ipchun.getHours(), ipchun.getMinutes());
    let ref;
    if (mode === "순행") {
      ref = new Date(birth.getFullYear() + 1, ipchun.getMonth(), ipchun.getDate(), ipchun.getHours(), ipchun.getMinutes());
    } else {
      if (birth >= currentYearIpchun) {
        ref = currentYearIpchun;
      } else {
        ref = new Date(birth.getFullYear() - 1, ipchun.getMonth(), ipchun.getDate(), ipchun.getHours(), ipchun.getMinutes());
      }
    }
    let diffDays;
    if (mode === "순행") {
      diffDays = (ref - birth) / oneDayMs;
    } else {
      diffDays = (birth - ref) / oneDayMs;
    }
    return (diffDays / 365.24) * 21914.4;
  }

  // ----------------------------------
  // 보정: 계산된 후보가 생일보다 이전이면, full cycle만큼 더해
  function adjustInitial(candidate, cycle) {
    while (candidate < birthDate) {
      candidate = new Date(candidate.getTime() + cycle * oneDayMs);
    }
    return candidate;
  }

  // ========================================
  // 2. 각 운세별 첫번째 간지 변경 시각 계산
  let sijuOffset = calculateSijuOffset(birthDate, sijuMode);
  let iljuOffset = calculateIljuOffset(birthDate, iljuMode);
  let woljuOffset = calculateWoljuOffset(birthDate, daeseol, woljuMode);
  let yeonjuOffset = calculateYeonjuOffset(birthDate, ipchun, yeonjuMode);

  let sijuCandidate = new Date(birthDate.getTime() + sijuOffset * oneDayMs);
  sijuCandidate = adjustInitial(sijuCandidate, sijuCycle);
  let iljuCandidate = new Date(birthDate.getTime() + iljuOffset * oneDayMs);
  iljuCandidate = adjustInitial(iljuCandidate, iljuCycle);
  let woljuCandidate = new Date(birthDate.getTime() + woljuOffset * oneDayMs);
  woljuCandidate = adjustInitial(woljuCandidate, woljuCycle);
  let yeonjuCandidate = new Date(birthDate.getTime() + yeonjuOffset * oneDayMs);
  yeonjuCandidate = adjustInitial(yeonjuCandidate, yeonjuCycle);

  // ----------------------------------
  // 첫번째 간지 변경 시각에서 바로 "업데이트"를 적용하여,
  // 출생 간지가 아닌 첫 변경 간지가 반영되도록 함.
  // 업데이트 시, 모드에 따라 간지 인덱스를 업데이트:
  // 순행: index + 1, 역행: index - 1
  function applyFirstUpdate(date, index, mode) {
    if (mode === "순행") {
      return { date: date, index: (index + 1) % 60 };
    } else {
      return { date: date, index: (index - 1 + 60) % 60 };
    }
  }

  // 예시 초기 간지 (사용자 지정 – 실제 해석법에 따라 달라질 수 있음)
  // 여기서는 예시로 다음과 같이 설정:
  // 시주: 기본 간지 "갑신", 일주/월주: "경자", 연주: "병자"
  let sijuFirstEvent = applyFirstUpdate(sijuCandidate, GANZI_60.indexOf("갑신"), sijuMode);
  let iljuFirstEvent = applyFirstUpdate(iljuCandidate, GANZI_60.indexOf("경자"), iljuMode);
  let woljuFirstEvent = applyFirstUpdate(woljuCandidate, GANZI_60.indexOf("경자"), woljuMode);
  let yeonjuFirstEvent = applyFirstUpdate(yeonjuCandidate, GANZI_60.indexOf("병자"), yeonjuMode);

  // ----------------------------------
  // ========================================
  // 3. 고정 주기마다 업데이트하는 함수 (모드에 따라 간지 인덱스 업데이트)
  function nextEvent(date, index, cycle, mode) {
    const nextDate = new Date(date.getTime() + cycle * oneDayMs);
    let nextIndex;
    if (mode === "순행") {
      nextIndex = (index + 1) % 60;
    } else {
      nextIndex = (index - 1 + 60) % 60;
    }
    return { date: nextDate, index: nextIndex };
  }
  function nextSiju(date, index) { return nextEvent(date, index, sijuCycle, sijuMode); }
  function nextIlju(date, index) { return nextEvent(date, index, iljuCycle, iljuMode); }
  function nextWolju(date, index) { return nextEvent(date, index, woljuCycle, woljuMode); }
  function nextYeonju(date, index) { return nextEvent(date, index, yeonjuCycle, yeonjuMode); }

  // ----------------------------------
  // 종료 시점 (예시: 2025년 3월 29일 22:15)
  const endDate = new Date();

  // ----------------------------------
  // 결과 출력: 첫번째 간지 변경 시각과 타임라인 생성
  console.log("==== 첫번째 간지 변경 시각 ====");
  console.log(`시주: ${formatDateTime(sijuFirstEvent.date)} → ${GANZI_60[sijuFirstEvent.index]} (이후 매 ${sijuCycle}일 ${sijuMode})`);
  console.log(`일주: ${formatDateTime(iljuFirstEvent.date)} → ${GANZI_60[iljuFirstEvent.index]} (이후 매 ${iljuCycle}일 ${iljuMode})`);
  console.log(`월주: ${formatDateTime(woljuFirstEvent.date)} → ${GANZI_60[woljuFirstEvent.index]} (이후 매 ${woljuCycle}일 ${woljuMode})`);
  console.log(`연주: ${formatDateTime(yeonjuFirstEvent.date)} → ${GANZI_60[yeonjuFirstEvent.index]} (이후 매 ${yeonjuCycle}일 ${yeonjuMode})`);
  console.log("\n==== 절기 기준 날짜 ====");
  console.log(`입춘 (연주 기준): ${formatDateTime(ipchun)}`);
  console.log(`대설 (월주 기준): ${formatDateTime(daeseol)}`);

  // ----------------------------------
  // 타임라인 생성 함수: 각 운세별 타임라인을 생성하여 출력
  function generateTimeline(firstEvent, cycle, nextFunc, label, mode) {
    let timeline = [];
    let currentDate = firstEvent.date;
    let currentIndex = firstEvent.index;
    while (currentDate <= endDate) {
      let nextEvt = nextFunc(currentDate, currentIndex);
      timeline.push({
        date: new Date(currentDate),
        ganji: GANZI_60[currentIndex],
        nextDate: nextEvt.date
      });
      currentDate = nextEvt.date;
      currentIndex = nextEvt.index;
    }
    console.log(`\n=== ${label} 타임라인 (${mode}) ===`);
    timeline.forEach(evt => {
      console.log(`${formatDateTime(evt.date)} → ${label}: ${evt.ganji} (다음: ${formatDateTime(evt.nextDate)})`);
    });
  }

  generateTimeline(sijuFirstEvent, sijuCycle, nextSiju, "시주", sijuMode);
  generateTimeline(iljuFirstEvent, iljuCycle, nextIlju, "일주", iljuMode);
  generateTimeline(woljuFirstEvent, woljuCycle, nextWolju, "월주", woljuMode);
  generateTimeline(yeonjuFirstEvent, yeonjuCycle, nextYeonju, "연주", yeonjuMode);

  /*
    [요약 예시 (입력: 1996.12.29 16:30 여자)]
    - 연주: 모드에 따라 (역행이면) 올해(또는 전해)의 입춘을 기준으로, 
         첫 변경은 출생 후 약 (계산된 오프셋)일 후에 간지가 역행하여 바뀜.
    - 월주: (역행이면) 출생 전의 가장 가까운 대설을 기준으로 오프셋 계산.
    - 일주: 인시 기준, (역행이면) 이전 인시(03:30)를 기준으로 13시간 차 → 약 65.87일 후.
    - 시주: (역행이면) 이전 시의 30분(예: 15:30)을 기준 → 5일 후.
      
    이후 각 운세는 지정된 고정 주기마다 모드(순행/역행)에 따라 간지가 업데이트되며,
    타임라인으로 출력됩니다.
  */
})();
