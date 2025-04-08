// main.js
import { 생년월일_소숫점_환산 } from "./js/core/numberCalc.js";
import { 
  도시_보정시, 
  천간_매핑, 
  지지_매핑, 
  천간_정보_매핑, 
  지지_정보_매핑, 
  지장간_매핑, 
  육십갑자_순서_매핑, 
  천간_십신_매핑, 
  지지_십신_매핑, 
  십이운성_매핑, 
  십이신살_매핑 
} from "./js/domain/constants.js";
import { 아이디_유무_검사, 문자열_두글자화, 문자열_분리 } from "./js/utils/helper.js";
import { ipChun, 절기_기준_범위, 균시차_계산 } from "./js/domain/solar/solarTerm.js";
import { 썸머타임_계산 } from "./js/domain/solar/timeUtil.js"
import { 정보_보정 } from "./js/domain/correction/correction.js";
import { 
  일간만_추출함,
  연간_인덱스_구함, 
  연의_간지를_구함, 
  연의_간지를_출력함, 
  월의_간지를_출력함, 
  월_간지_출력_상수, 
  일_간지를_구함, 
  간지_인덱스_구함 
} from "./js/domain/ganzhi/ganzhiUtil.js";
import { 일간에_따른_천간_십신_출력, 일간에_따른_지지_십신_출력 } from "./js/domain/ganzhi/sipsin.js";
import { 대운_데이터 } from "./js/domain/service/daewoon.js";
import { 대운_데이터_문자열 } from "./js/domain/service/daewoonString.js";
import { 대운_고수준_서비스 } from "./js/domain/service/fourPillars.js";
import { ui_색상_업데이트 } from "./js/domain/ui/uiUpdate.js";
import { mjInfo, 수집된_입력값_저장, 남녀_음양으로_구분 } from "./js/domain/info.js";

document.addEventListener("DOMContentLoaded", function () {
  let today = new Date();
  let dateInfo;
  let correctedDate;
  let correctedTime;
  let 연주;
  let 월주;
  let 일주;
  let 시주;
  let 시간;
  let 시지;
  let 일간;
  let 일지;
  let 월간;
  let 월지;
  let 연간;
  let 연지;
  let 세운_시작_보정;
  let 일간_한글;
  let 현재기준연주;
  let isNavigating;
  let solarYear;
  let boundaries;
  let currentIndex;
  let activeMonth;
  const direction = 남녀_음양으로_구분.isForward;

  // 산출하기 이벤트
  document.getElementById("calcBtn").addEventListener("click", function () {
    수집된_입력값_저장();
    
    // calcBtn 안에서 쓸 변수 저장
    let birthDate = new Date(mjInfo.year, mjInfo.month - 1, mjInfo.day, mjInfo.hour, mjInfo.minute);

    // 유효성 검사

    // 생년월일
    if (mjInfo.birthday.length < 8) {
      alert("생년월일을 YYYYMMDD 형식으로 입력하세요.");
      return;
    }

    if (mjInfo.year < 1900 || mjInfo.year > 2099) {
      alert("연도는 1900년부터 2099년 사이로 입력하세요.");
      return;
    }

    if (mjInfo.month < 1 || mjInfo.month > 12) {
      alert("월은 1부터 12 사이의 숫자로 입력하세요.");
      return;
    }

    if (mjInfo.day < 1 || mjInfo.day > 31) {
      alert("일은 1부터 31 사이의 숫자로 입력하세요.");
      return;
    }

    const testDate = new Date(mjInfo.year, mjInfo.month - 1, mjInfo.day);
    if (testDate.getFullYear() !== mjInfo.year || (testDate.getMonth() + 1) !== mjInfo.month || testDate.getDate() !== mjInfo.day) {
      alert("유효한 날짜를 입력하세요.");
      return;
    }

    // 성별
    if (mjInfo.gender === "-") {
      alert("성별을 선택하세요.");
      return;
    }

    // 시간
    if (!mjInfo.unknownTime) {
      if (mjInfo.birthtime.length !== 4 || isNaN(mjInfo.birthtime)) {
        alert("태어난 시간을 4자리 숫자 (HHMM) 형식으로 입력하세요.");
        return;
      }
      if (mjInfo.hour < 0 || mjInfo.hour > 23 || mjInfo.minute < 0 || mjInfo.minute > 59) {
        alert("시간은 00부터 23 사이, 분은 00부터 59 사이로 입력하세요.");
        return;
      }
    }

    // 출생지
    if (!mjInfo.unknownPlace) {
      if (mjInfo.birthPlace === "" || mjInfo.birthPlace === "출생지 선택") {
        alert("출생지를 선택하세요.");
        return;
      }
    }

    // 양력, 음력(+윤달) 구분
    const koreanCalendar = new KoreanLunarCalendar();
    let lunarDate = null;
    if (mjInfo.monthType === "음력" || mjInfo.monthType === "음력(윤달)") {
      const isLunar = (monthType === "음력(윤달)");
      if (!koreanCalendar.setLunarDate(mjInfo.year, mjInfo.month, mjInfo.day, isLunar)) {
        console.error(`${mjInfo.monthType} 날짜 설정에 실패했습니다.`);
      } else {
        lunarDate = {
          yearInfo: mjInfo.year,
          monthInfo: mjInfo.month,
          dayInfo: mjInfo.day,
          isLunar
        };
        const solarCalendar = koreanCalendar.getSolarCalendar();
        yearInfo = solarCalendar.year; 
        monthInfo = solarCalendar.month; 
        dayInfo = solarCalendar.day;
      }
    } else {
      if (!koreanCalendar.setSolarDate(mjInfo.year, mjInfo.month, mjInfo.day)) {
        console.error("양력 날짜 설정에 실패했습니다.");
      } else {
        lunarDate = koreanCalendar.getLunarCalendar();
      }
    }

    dateInfo = new Date(mjInfo.year, mjInfo.month - 1, mjInfo.day, mjInfo.hour, mjInfo.minute);
    correctedDate = 정보_보정({
      dateObj: dateInfo,
      birthPlace: mjInfo.usedBirthPlace,
      isPlaceUnknown: mjInfo.isPlaceUnknown,
      도시_보정시,
      균시차_계산,
      썸머타임_계산
    });
    일간만_추출함();

    correctedTime = 정보_보정({
      dateObj: dateInfo,
      birthPlace: mjInfo.usedBirthPlace,
      isPlaceUnknown: mjInfo.isPlaceUnknown,
      도시_보정시,
      균시차_계산,
      썸머타임_계산
    });

    // 생년월일 텍스트화 보정
    const formattedBirth = `${mjInfo.year}-${문자열_두글자화(mjInfo.month)}-${문자열_두글자화(mjInfo.day)}`;
    const formattedTime = `${문자열_두글자화(mjInfo.hour)}:${문자열_두글자화(mjInfo.minute)}`;

    아이디_유무_검사("resBirth", formattedBirth);
    if (lunarDate) {
      const formattedLunar = `${lunarDate.year}-${문자열_두글자화(lunarDate.month)}-${문자열_두글자화(lunarDate.day)}${lunarDate.isLunar ? " (윤달)" : ""}`;
      아이디_유무_검사("resBirth2", formattedLunar);
    } 

    // 받아온 데이터로 결과값 담는 상수
    const fullResult = 대운_고수준_서비스(
      correctedDate.getFullYear(),
      correctedDate.getMonth() + 1,
      correctedDate.getDate(),
      mjInfo.usedBirthPlace, 
      mjInfo.gender,
      시지,
      일_간지를_구함,
      대운_데이터_문자열,
      지지_매핑,
      연주,
      월주,
      일주,
      시주
    );

    // 받아온 결과물 글자 쪼개기
    const resultParts = fullResult.split(", ");
    const pillarsPart = resultParts[0] || "-";
    const pillars = pillarsPart.split(" ");
    연주  = pillars[0] || "-";
    월주 = pillars[1] || "-";
    일주   = pillars[2] || "-";
    시주  = pillars[3] || "-";

    // 천간 지지로 한번 더 쪼개기
    const 연주_분리  = 문자열_분리(연주);
    const 월주_분리 = 문자열_분리(월주);
    const 일주_분리   = 문자열_분리(일주);
    const 시주_분리  = 문자열_분리(시주);
    
    시간 = 시주_분리.gan;
    시지 = 시주_분리.ji;
    일간 = 일주_분리.gan;
    일지 = 일주_분리.ji;
    월간 = 월주_분리.gan;
    월지 = 월주_분리.ji;
    연간 = 연주_분리.gan;
    연지 = 연주_분리.ji;
    console.log('시지', 시지);

    // 명주 정보 텍스트 추출
    아이디_유무_검사("resName", mjInfo.name);
    아이디_유무_검사("resGender", mjInfo.gender);
    아이디_유무_검사("resBirth", formattedBirth);
    아이디_유무_검사("resTime", mjInfo.unknownTime ? "시간모름" : formattedTime);
    아이디_유무_검사("resAddr", mjInfo.unknownPlace ? "출생지모름" : mjInfo.savedBirthPlace);
    
    // 보정시 글자 업데이트
    const bjTimeTextEl = document.getElementById("bjTimeText");
    if (mjInfo.unknownPlace) {
      bjTimeTextEl.innerHTML = "기본보정 - 30분";
    } else {
      const prefix = mjInfo.unknownPlace ? "기본보정 - 30분" : "보정시 : ";
      bjTimeTextEl.innerHTML = `${prefix}<b id="resbjTime">${formattedTime}</b>`;
    }

    // 원국 업데이트
    function 원국_지지관련_업데이트(아이디_유무_검사, 십이운성_매핑, 십이신살_매핑) {
      아이디_유무_검사("Hb12ws", mjInfo.unknownTime ? "-" : 십이운성_매핑(일간, 시지));
      아이디_유무_검사("Hb12ss", mjInfo.unknownTime ? "-" : 십이신살_매핑(연지, 시지));
      아이디_유무_검사("Db12ws", 십이운성_매핑(일간, 일지));
      아이디_유무_검사("Db12ss", 십이신살_매핑(연지, 일지));
      아이디_유무_검사("Mb12ws", 십이운성_매핑(일간, 월지));
      아이디_유무_검사("Mb12ss", 십이신살_매핑(연지, 월지));
      아이디_유무_검사("Yb12ws", 십이운성_매핑(일간, 연지));
      아이디_유무_검사("Yb12ss", 십이신살_매핑(연지, 연지));
    }

    천간관련_정보_업데이트("Yt", 연주_분리, 일간);
    천간관련_정보_업데이트("Mt", 월주_분리, 일간);
    천간관련_정보_업데이트("Dt", 일주_분리, 일간);
    천간관련_정보_업데이트("Ht", mjInfo.unknownTime ? "-" : 시주_분리, 일간);
    지지관련_정보_업데이트("Yb", 연지, 일간);
    지지관련_정보_업데이트("Mb", 월지, 일간);
    지지관련_정보_업데이트("Db", 일지, 일간);
    지지관련_정보_업데이트("Hb", isTimeUnknown ? "-" : 시지, 일간);
    원국_지지관련_업데이트();
    ui_색상_업데이트();


    let currentAge = today.getFullYear() - dateInfo.getFullYear();

    // 현재대운 업데이트
    function 현재대운_업데이트(일간, currentAge) {
      // 나이 계산식
      if (today.getMonth() < dateInfo.getMonth() ||
         (today.getMonth() === dateInfo.getMonth() && today.getDate() < dateInfo.getDate())) {
        currentAge--;
      }

      const 대운_데이터_상수 = 대운_데이터(mjInfo.usedBirthPlace, mjInfo.gender);
      let currentDaewoon = null;
      for (let i = 0; i < 대운_데이터_상수.list.length; i++) {
        if (대운_데이터_상수.list[i].age <= currentAge) {
          currentDaewoon = 대운_데이터_상수.list[i];
        }
      }
      if (!currentDaewoon) {
        currentDaewoon = 대운_데이터_상수.list[0] || { 천간: "-", 지지: "-" };
      }

      아이디_유무_검사("DwtHanja", 천간_정보_매핑[currentDaewoon.천간]?.hanja || "-");
      아이디_유무_검사("DwtHanguel", 천간_정보_매핑[currentDaewoon.천간]?.hanguel || "-");
      아이디_유무_검사("DwtEumyang", 천간_정보_매핑[currentDaewoon.천간]?.eumYang || "-");
      아이디_유무_검사("Dwt10sin", 천간_십신_매핑(currentDaewoon.천간, 일간));
      아이디_유무_검사("DwbHanja", 지지_정보_매핑[currentDaewoon.지지]?.hanja || "-");
      아이디_유무_검사("DwbHanguel", 지지_정보_매핑[currentDaewoon.지지]?.hanguel || "-");
      아이디_유무_검사("DwbEumyang", 지지_정보_매핑[currentDaewoon.지지]?.eumYang || "-");
      아이디_유무_검사("Dwb10sin", 지지_십신_매핑(currentDaewoon.지지, 일간));
      const 대운_지장간_매핑 = 지장간_매핑[currentDaewoon.지지] || ["(-)", "(-)", "(-)"];
      아이디_유무_검사("DwJj1", 대운_지장간_매핑[0]);
      아이디_유무_검사("DwJj2", 대운_지장간_매핑[1]);
      아이디_유무_검사("DwJj3", 대운_지장간_매핑[2]);
      아이디_유무_검사("DWb12ws", 십이운성_매핑(일간, currentDaewoon.지지));
      아이디_유무_검사("DWb12ss", 십이신살_매핑(연지, currentDaewoon.지지));
    }

    현재대운_업데이트(일간, currentAge);

    // ? 나중에 보고 지워도 될듯
    현재날짜로_월운_업데이트(today);

    function 대운_모든아이템_업데이트(대운리스트, 일간, 연지) {
      for (let i = 0; i < 대운리스트.length; i++) {
        const item = 대운리스트[i];
        const 대운_아이템_간지 = item.천간 + item.지지;
        const 최종_천간 = 대운_아이템_간지.charAt(0);
        const 최종_지지 = 대운_아이템_간지.charAt(1);
        const idx = i + 1;

        아이디_유무_검사("DC_" + idx, 천간_정보_매핑[최종_천간]?.hanja || "-");
        아이디_유무_검사("DJ_" + idx, 지지_정보_매핑[최종_지지]?.hanja || "-");
        아이디_유무_검사("dt10sin" + idx, 일간에_따른_천간_십신_출력(최종_천간, 일간) || "-");
        아이디_유무_검사("db10sin" + idx, 일간에_따른_지지_십신_출력(최종_지지, 일간) || "-");
        아이디_유무_검사("DwW" + idx, 십이운성_매핑(일간, 최종_지지) || "-");
        아이디_유무_검사("Ds" + idx, 십이신살_매핑(연지, 최종_지지) || "-");
        const 대운수_반내림 = Math.floor(item.age);
        아이디_유무_검사("Da" + idx, 대운수_반내림);
      }
    }

    대운_모든아이템_업데이트(대운리스트, 일간, 연지);

    // 현재 해당대운 찾기
    let 현재_대운_인덱스 = 0;
    if (대운리스트?.list) {
      for (let i = 0; i < 대운리스트.list.length; i++) {
        if (대운리스트.list[i].age <= currentAge) {
          현재_대운_인덱스 = i;
        }
      }
    }

    // 현재 해당대운 찾아서 add .active
    const 대운리스트_li = document.querySelectorAll("#daewoonList li");
    대운리스트_li.forEach(li => li.classList.remove("active"));
    if (대운리스트_li[현재_대운_인덱스]) {
      대운리스트_li[현재_대운_인덱스].classList.add("active");
    }


    function 대운_디테일_업데이트(index) {
      if (대운_데이터 && 대운_데이터.list[index - 1]) {
        const data = 대운_데이터.list[index - 1];
        아이디_유무_검사("daewoonDetail", `${data.age}세 (${data.천간}${data.지지})`);
      }
    }

    // 대운 li 클릭 이벤트
    대운리스트_li.forEach(function (li) {
      li.addEventListener("click", function (event) {
        event.stopPropagation();
        대운리스트_li.forEach(item => item.classList.remove("active"));
        this.classList.add("active");
        const index = this.getAttribute("data-index");
        대운_디테일_업데이트(index);
      });
    });

    // 현재 세운 업데이트
    function 현재세운_업데이트(
      today, 
      일간,
      연지, 
      ipChun,
      아이디_유무_검사,
      지장간_매핑
    ) {
      현재기준연주 = (today >= ipChun) ? today.getFullYear() : today.getFullYear() - 1;
      const 세운_인덱스 = ((현재기준연주 - 4) % 60 + 60) % 60;
      const 세운_간지 = 육십갑자_순서_매핑[세운_인덱스];
      const 세운_간지_분리 = 문자열_분리(세운_간지);

      아이디_유무_검사("SwtHanja", 천간_정보_매핑[세운_간지_분리.gan]?.hanja || "-");
      아이디_유무_검사("SwtHanguel", 천간_정보_매핑[세운_간지_분리.gan]?.hanguel || "-");
      아이디_유무_검사("SwtEumyang", 천간_정보_매핑[세운_간지_분리.gan]?.eumYang || "-");
      아이디_유무_검사("Swt10sin", 천간_십신_매핑(세운_간지_분리.gan, 일간));
      아이디_유무_검사("SwbHanja", 지지_정보_매핑[세운_간지_분리.ji]?.hanja || "-");
      아이디_유무_검사("SwbHanguel", 지지_정보_매핑[세운_간지_분리.ji]?.hanguel || "-");
      아이디_유무_검사("SwbEumyang", 지지_정보_매핑[세운_간지_분리.ji]?.eumYang || "-");
      아이디_유무_검사("Swb10sin", 지지_십신_매핑(세운_간지_분리.ji, 일간));
      const 세운_지장간_매핑 = 지장간_매핑[세운_간지_분리.ji] || ["(-)", "(-)", "(-)"];
      아이디_유무_검사("SwJj1", 세운_지장간_매핑[0]);
      아이디_유무_검사("SwJj2", 세운_지장간_매핑[1]);
      아이디_유무_검사("SwJj3", 세운_지장간_매핑[2]);
      아이디_유무_검사("SWb12ws", 십이운성_매핑(일간, 세운_간지_분리.ji));
      아이디_유무_검사("SWb12ss", 십이신살_매핑(연지, 세운_간지_분리.ji));
      
      아이디_유무_검사("WSwtHanja", 천간_정보_매핑[세운_간지_분리.gan]?.hanja || "-");
      아이디_유무_검사("WSwtHanguel", 천간_정보_매핑[세운_간지_분리.gan]?.hanguel || "-");
      아이디_유무_검사("WSwtEumyang", 천간_정보_매핑[세운_간지_분리.gan]?.eumYang || "-");
      아이디_유무_검사("WSwt10sin", 천간_십신_매핑(세운_간지_분리.gan, 일간));
      아이디_유무_검사("WSwbHanja", 지지_정보_매핑[세운_간지_분리.ji]?.hanja || "-");
      아이디_유무_검사("WSwbHanguel", 지지_정보_매핑[세운_간지_분리.ji]?.hanguel || "-");
      아이디_유무_검사("WSwbEumyang", 지지_정보_매핑[세운_간지_분리.ji]?.eumYang || "-");
      아이디_유무_검사("WSwb10sin", 지지_십신_매핑(세운_간지_분리.ji, 일간));
      아이디_유무_검사("WSwJj1", 세운_지장간_매핑[0]);
      아이디_유무_검사("WSwJj2", 세운_지장간_매핑[1]);
      아이디_유무_검사("WSwJj3", 세운_지장간_매핑[2]);
      아이디_유무_검사("WSWb12ws", 십이운성_매핑(일간, 세운_간지_분리.ji));
      아이디_유무_검사("WSWb12ss", 십이신살_매핑(연지, 세운_간지_분리.ji));
    }

    현재세운_업데이트(
      today, 
      일간,
      연지, 
      ipChun,
      아이디_유무_검사,
      지장간_매핑
    );

    // 세운 li 클릭 이벤트
    let 세운_처음_년도 = null;

    function 세운_디테일_업데이트(index, 연간_인덱스_구함, 문자열_분리, 아이디_유무_검사) {
      if (세운_처음_년도) {
        const 세운_첫년도_계산 = 세운_처음_년도 + (index - 1);
        const 세운_첫년도_인덱스 = 연간_인덱스_구함(세운_첫년도_계산);
        const 세운_첫년도_문자열분리 = 문자열_분리(세운_첫년도_인덱스);
        아이디_유무_검사("sewoonDetail", `${세운_첫년도_계산}년 (${세운_첫년도_문자열분리.gan}${세운_첫년도_문자열분리.ji})`);
      }
    }

    const 세운_리스트_li = document.querySelectorAll("#sewoonList li");
    세운_리스트_li.forEach(function (li) {
      li.addEventListener("click", function (event) {
        event.stopPropagation();
        세운_리스트_li.forEach(item => item.classList.remove("active"));
        this.classList.add("active");
        const index = this.getAttribute("data-index2");
        세운_디테일_업데이트(index, 연간_인덱스_구함, 문자열_분리, 아이디_유무_검사);
        const mowoonListElem = document.getElementById("walwoonArea");
        if (mowoonListElem) { mowoonListElem.style.display = "grid"; }
      });
    });

    // 세운 아이템 업데이트
    function 세운_아이템_업데이트(
      일간,
      연지,
      생년월일_소숫점_환산,
      대운_데이터,
      연간_인덱스_구함,
      문자열_분리,
      천간_십신_매핑,
      지지_십신_매핑,
      아이디_유무_검사,
      십이운성_매핑,
      십이신살_매핑
    ) {
      const 보정_생년월일_소숫점_환산 = 생년월일_소숫점_환산(correctedDate);
      const 선택된_대운 = 대운_데이터.list[daewoonIndex - 1];
      if (!선택된_대운) return;
      const 대운수 = 선택된_대운.age; 
      세운_시작_보정 = 보정_생년월일_소숫점_환산 + 대운수;
      let 세운_시작_년도 = Math.floor(세운_시작_보정);
      일간_한글 = document.getElementById("DtHanguel").innerText;
      const 일간_한글_상수 = 일간_한글 ? 일간_한글.charAt(0) : "-";

      const 세운_리스트 = [];
      for (let j = 0; j < 10; j++) {
        let 세운_j = 세운_시작_년도 + j;
        let 연간_인덱스_구함_상수 = 연간_인덱스_구함(세운_j);
        const 세운_문자열_분리 = 문자열_분리(연간_인덱스_구함_상수);
        const 십신_천간 = 천간_십신_매핑(세운_문자열_분리.gan, 일간_한글_상수);
        const 십신_지지 = 지지_십신_매핑(세운_문자열_분리.ji, 일간_한글_상수);
        세운_리스트.push({
          year: 세운_j,
          gan: 세운_문자열_분리.gan,
          ji: 세운_문자열_분리.ji,
          십신_천간: 십신_천간,
          십신_지지: 십신_지지
        });
      }
      세운_리스트.forEach(function (item, index) {
        const idx = index + 1;
        아이디_유무_검사("SC_" + idx, 천간_정보_매핑[item.gan]?.hanja || "-");
        아이디_유무_검사("SJ_" + idx, 지지_정보_매핑[item.ji]?.hanja || "-");
        아이디_유무_검사("st10sin" + idx, item.십신_천간);
        아이디_유무_검사("sb10sin" + idx, item.십신_지지);
        아이디_유무_검사("SwW" + idx, 십이운성_매핑(일간, item.ji) || "-");
        아이디_유무_검사("Ss" + idx, 십이신살_매핑(연지, item.ji) || "-");
        아이디_유무_검사("Dy" + idx, item.year);
      });
      ui_색상_업데이트();
    }

    세운_아이템_업데이트(
      일간,
      연지,
      생년월일_소숫점_환산,
      대운_데이터,
      연간_인덱스_구함,
      문자열_분리,
      천간_십신_매핑,
      지지_십신_매핑,
      아이디_유무_검사,
      십이운성_매핑,
      십이신살_매핑
    );

    const 현재날짜_년도 = today.getFullYear();
    const UI_년도 = (today < ipChun) ? 현재날짜_년도 - 1 : 현재날짜_년도;
    세운_리스트_li.forEach(li => {
      const dyearElem = li.querySelector(".dyear");
      const 현재_년도_글자 = Number(dyearElem.innerText);
      li.classList.toggle("active", 현재_년도_글자 === UI_년도);
      document.getElementById('resultWrapper').style.display = 'block';
      window.scrollTo(0, 0);
      document.getElementById('inputWrap').style.display = 'none';
      document.getElementById("backBtn").style.display = "inline-block";
      document.getElementById("saveBtn").style.display = "inline-block";
    });

    function 리스트_업데이트_매핑(list, prefixUnseong, prefixShinsal, 일간, 연지) {
      if (!list || !list.length) {
        console.warn("업데이트할 리스트가 없습니다.");
        return;
      }
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        document.getElementById(prefixUnseong + (i + 1)).innerText = 십이운성_매핑(일간, item.지지);
        document.getElementById(prefixShinsal + (i + 1)).innerText = 십이신살_매핑(연지, item.지지);
      }
    }

    let 현재_세운_인덱스 = UI_년도 - 세운_시작_보정;
    if (현재_세운_인덱스 < 0) 현재_세운_인덱스 = 0;
    if (현재_세운_인덱스 > 9) 현재_세운_인덱스 = 9;
    const 세운_계산식 = 세운_시작_보정 + 현재_세운_인덱스;
    월운_데이터_업데이트(세운_계산식);
    
    const 월운_구역 = document.getElementById("walwoonArea");
    if (월운_구역) { 월운_구역.style.display = "grid"; }
    ui_색상_업데이트();
    원국_지지관련_업데이트(연주_분리, 월주_분리, 일주_분리, 시주_분리);
    리스트_업데이트_매핑(대운_데이터.list, "DwW", "Ds", 일간, 연간);
    if (세운_리스트 && 세운_리스트.length > 0) {
      리스트_업데이트_매핑(세운_리스트, "SwW", "Ss", 일간, 연간);
    }
    if (월운_리스트 && 월운_리스트.length > 0) {
      리스트_업데이트_매핑(월운_리스트, "MwW", "Ms", 일간, 연간);
    }

    const birthDayInfo = new Date(birthDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());

    // 월운리스트 업데이트 
    function 월운_데이터_업데이트(
      일간, 
      연지,
      연의_간지를_출력함,
      천간_매핑,
      천간_정보_매핑,
      지지_정보_매핑,
      천간_십신_매핑,
      지지_십신_매핑,
      십이운성_매핑,
      십이신살_매핑,
      아이디_유무_검사
    ) {
      일간 = 일간_한글 ? 일간_한글.charAt(0) : "-";
      const 연도를_구함 = 연의_간지를_출력함(birthDayInfo, 현재기준연주);
      const 연도구한것의_천간 = 연도를_구함.charAt(0);
      const 천간의_인덱스 = 천간_매핑.indexOf(연도구한것의_천간);
      for (let i = 0; i < 12; i++) {
        const 월넘버 = i + 1;
        const 월천간_인덱스 = (((천간의_인덱스 * 2) + 월넘버 - 1) + 4) % 10;
        const 월천간 = 천간_정보_매핑[월천간_인덱스];
        const 월지지 = 월_간지_출력_상수[월넘버 - 1];
        const 천간_십신 = 천간_십신_매핑(월천간, 일간);
        const 지지_십신 = 지지_십신_매핑(월지지, 일간);
        const UI_월운 = (월넘버 < 12) ? (월넘버 + 1) + "월" : "1월";
        const 월운성 = 십이운성_매핑(일간, 월지지);
        const 월신살 = 십이신살_매핑(연지, 월지지);
        아이디_유무_검사("MC_" + (i + 1), 천간_정보_매핑[월천간]?.hanja || "-");
        아이디_유무_검사("MJ_" + (i + 1), 지지_정보_매핑[월지지]?.hanja || "-");
        아이디_유무_검사("Mot10sin" + (i + 1), 천간_십신 || "-");
        아이디_유무_검사("Mob10sin" + (i + 1), 지지_십신 || "-");
        아이디_유무_검사("MwW" + (i + 1), 월운성 || "-");
        아이디_유무_검사("Ms" + (i + 1), 월신살 || "-");
        아이디_유무_검사("Dm" + (i + 1), UI_월운 || "-");
      }
    }

    월운_데이터_업데이트(
      일간, 
      연지,
      연의_간지를_출력함,
      천간_매핑,
      천간_정보_매핑,
      지지_정보_매핑,
      천간_십신_매핑,
      지지_십신_매핑,
      십이운성_매핑,
      십이신살_매핑,
      아이디_유무_검사
    );

    function 월운_업데이트(
      computedYear, 
      현재_월_인덱스, 
      일간,
      천간_정보_매핑,
      월_간지_출력_상수,
      천간_십신_매핑,
      지지_십신_매핑,
      십이운성_매핑,
      십이신살_매핑,
      아이디_유무_검사,
      지장간_매핑
    ) {
      const boundaries = 절기_기준_범위(computedYear);
      if (!boundaries || boundaries.length === 0) return;
      const cycleStartDate = boundaries[0].date;
      일간 = 일간_한글 ? 일간_한글.charAt(0) : "-";
      const 연도를_구함 = 연의_간지를_출력함(cycleStartDate, computedYear);
      const 연천간 = 연도를_구함.charAt(0);
      const 연천간_인덱스 = 천간_매핑.indexOf(연천간);
      const 월넘버 = 현재_월_인덱스 + 1;
      const 월천간_넘버 = (((연천간_인덱스 * 2) + 월넘버 - 1) + 4) % 10;
      const 월천간 = 천간_정보_매핑[월천간_넘버];
      const 월지지 = 월_간지_출력_상수[월넘버 - 1];
      const 월_천간_십신 = 천간_십신_매핑(월천간, 일간);
      const 월_지지_십신 = 지지_십신_매핑(월지지, 일간);
      const 월운성 = 십이운성_매핑(일간, 월지지);
      const 월신살 = 십이신살_매핑(연지, 월지지);
      아이디_유무_검사("WMtHanja", 천간_정보_매핑[월천간]?.hanja || "-");
      아이디_유무_검사("WMtHanguel", 천간_정보_매핑[월천간]?.hanguel || "-");
      아이디_유무_검사("WMtEumyang", 천간_정보_매핑[월천간]?.eumYang || "-");
      아이디_유무_검사("WMt10sin", 월_천간_십신 || "-");
      아이디_유무_검사("WMbHanja", 지지_정보_매핑[월지지]?.hanja || "-");
      아이디_유무_검사("WMbHanguel", 지지_정보_매핑[월지지]?.hanguel || "-");
      아이디_유무_검사("WMbEumyang", 지지_정보_매핑[월지지]?.eumYang || "-");
      아이디_유무_검사("WMb10sin", 월_지지_십신 || "-");
      지장간_매핑(월지지, "WMb");
      아이디_유무_검사("WMb12ws", 월운성 || "-");
      아이디_유무_검사("WMb12ss", 월신살 || "-");
      ui_색상_업데이트();
    }

    function 현재날짜로_월운_업데이트(today) {
      const boundaries = 절기_기준_범위(UI_년도);
      if (!boundaries || boundaries.length === 0) return;
      let 현재_월_인덱스 = 0;
      for (let i = 0; i < boundaries.length - 1; i++) {
        if (today >= boundaries[i].date && today < boundaries[i + 1].date) {
          현재_월_인덱스 = i;
          break;
        }
      }
      if (today >= boundaries[boundaries.length - 1].date) {
        현재_월_인덱스 = boundaries.length - 1;
      }
      월운_업데이트(
        computedYear, 
        현재_월_인덱스, 
        일간,
        천간_정보_매핑,
        월_간지_출력_상수,
        천간_십신_매핑,
        지지_십신_매핑,
        십이운성_매핑,
        십이신살_매핑,
        아이디_유무_검사,
        지장간_매핑
      );
    }
    현재날짜로_월운_업데이트(today);
    
    // 일운 달력 업데이트
    const 월운_리스트 = Array.from(월운_리스트);
    document.addEventListener("click", function (event) {
      // 중복 실행 방지를 위한 플래그 검사
      if (isNavigating) return;
      
      const btn = event.target.closest("#calPrevBtn, #calNextBtn");
      if (!btn) return;
      
      if (solarYear === undefined || !boundaries || currentIndex === undefined) return;
      
      // 이벤트 실행 시작: 플래그 true로 설정
      isNavigating = true;
      
      let newIndex;
      if (btn.id === "calPrevBtn") {
        newIndex = (currentIndex - 1 + boundaries.length) % boundaries.length;
      } else if (btn.id === "calNextBtn") {
        newIndex = (currentIndex + 1) % boundaries.length;
      }
      
      currentIndex = newIndex;
      
      const newTermName = boundaries[newIndex].name;
      월운_캘린더_업데이트(newTermName, solarYear, newIndex);
      
      setTimeout(function () {
        if (월운_리스트.length) {
          월운_리스트.forEach(li => li.classList.remove("active"));
          const targetIndex = newIndex % 월운_리스트.length;
          월운_리스트[targetIndex].classList.add("active");
        }
        // 모든 처리가 끝난 후 플래그 초기화
        isNavigating = false;
      }, 0);
    });

    function normalizeDate(dateObj) {
      return new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
    }

    let boundariesArr = 절기_기준_범위(UI_년도);
    let currentTerm = boundariesArr.find((term, idx) => {
      let next = boundariesArr[idx + 1] || { date: new Date(term.date.getTime() + 30 * oneDayMs) };
      return today >= term.date && today < next.date;
    });
    if (!currentTerm) { currentTerm = boundariesArr[0]; }
    function 월운_캘린더_업데이트(solarTermName, startDate, endDate, dateObj, currentIndex, boundaries, solarYear) {
      let prevTermName, nextTermName;
      if (currentIndex > 0) {
        prevTermName = boundaries[currentIndex - 1].name;
      } else {
        let prevBoundaries = 절기_기준_범위(solarYear - 1);
        if (!Array.isArray(prevBoundaries)) prevBoundaries = Array.from(prevBoundaries);
        prevTermName = prevBoundaries[prevBoundaries.length - 1].name;
      }
      if (currentIndex < boundaries.length - 1) {
        nextTermName = boundaries[currentIndex + 1].name;
      } else {
        let nextBoundaries = 절기_기준_범위(solarYear + 1);
        if (!Array.isArray(nextBoundaries)) nextBoundaries = Array.from(nextBoundaries);
        nextTermName = nextBoundaries[0].name;
      }
      normalizeDate(dateObj);
      const normStart = normalizeDate(startDate);
      const normEndNext = normalizeDate(endDate);
      const finalEndDate = normEndNext;
      function formatDate(dateObj) {
        const m = dateObj.getMonth() + 1;
        const d = dateObj.getDate();
        return m + "월 " + d + "일";
      }
      const startDateStr = formatDate(normStart);
      const endDateStr = formatDate(finalEndDate);
      const headerMonth = normStart.getMonth() + 1;
      let html = `<ul class="calender_title" id="calenderTitle">
        <li>
          <button class="cal_btn" id="calPrevBtn">
            <span class="btn_icon">◀</span>
            <span class="jeolgi_prev">${prevTermName}</span>
          </button>
        </li>
        <li>
          <div class="curr_title">
            <span>${solarTermName} ${headerMonth}월 (${startDateStr} ~ ${endDateStr})</span>
          </div>
        </li>
        <li>
          <button class="cal_btn" id="calNextBtn">
            <span class="jeolgi_next">${nextTermName}</span>
            <span class="btn_icon">▶</span>
          </button>
        </li>
      </ul>`;
      html += `<table class="calander_table">
        <tr>
          <th>일</th>
          <th>월</th>
          <th>화</th>
          <th>수</th>
          <th>목</th>
          <th>금</th>
          <th>토</th>
        </tr>`;
      let days = [];
      for (let d = new Date(normStart); d <= normEndNext; d.setDate(d.getDate() + 1)) {
        days.push(new Date(d.getTime()));
      }
      let currentRow = "<tr>";
      const firstDayWeekday = normStart.getDay();
      for (let i = 0; i < firstDayWeekday; i++) {
        currentRow += "<td></td>";
      }
      days.forEach(function (date, idx) {
        const originalGanji = 일_간지를_구함(date);
        const originalIndex = 간지_인덱스_구함(originalGanji);
        const adjustedIndex = originalIndex % 60;
        const 간지 = 간지_인덱스_상세히_구함(adjustedIndex);
        const 천간 = 간지.charAt(0);
        const 지지 = 간지.charAt(1);
        const 십신_천간 = 천간_십신_매핑(천간, 일간);
        const 십신_지지 = 지지_십신_매핑(지지, 일간);
        const 운성 = 십이운성_매핑(일간, 지지);
        const 신살 = 십이신살_매핑(연지, 지지);
        let dailyHtml = `<ul class="ilwoon">
          <li class="ilwoonday"><span>${date.getDate()}일</span></li>
          <li class="ilwoon_ganji_cheongan_10sin"><span>${십신_천간}</span></li>
          <li class="ilwoon_ganji_cheongan"><span>${천간}</span></li>
          <li class="ilwoon_ganji_jiji"><span>${지지}</span></li>
          <li class="ilwoon_ganji_jiji_10sin"><span>${십신_지지}</span></li>
          <li class="ilwoon_10woonseong"><span>${운성}</span></li>
          <li class="ilwoon_10sinsal"><span>${신살}</span></li>
        </ul>`;
        let tdClass = "";
        if (
          date.getFullYear() === today.getFullYear() &&
          date.getMonth() === today.getMonth() &&
          date.getDate() === today.getDate()
        ) {
          tdClass = ' class="active"';
        }
        currentRow += `<td${tdClass}>${dailyHtml}</td>`;
        if ((firstDayWeekday + idx + 1) % 7 === 0) {
          currentRow += "</tr>";
          html += currentRow;
          currentRow = "<tr>";
        }
      });
      const totalCells = firstDayWeekday + days.length;
      const remainder = totalCells % 7;
      if (remainder !== 0) {
        for (let i = remainder; i < 7; i++) {
          currentRow += "<td></td>";
        }
        currentRow += "</tr>";
        html += currentRow;
      }
      html += "</table>";
      return html;
    }

    function 월운_캘린더_업데이트(
      solarTermName, 
      computedYear, 
      newIndexOpt,

    ) {
      const solarYear = computedYear || (function () {
        return (today < ipChun) ? today.getFullYear() - 1 : today.getFullYear();
      })();
      let boundaries = 절기_기준_범위(solarYear);
      if (!Array.isArray(boundaries)) {
        boundaries = Array.from(boundaries);
      }
      let currentIndex = boundaries.findIndex(term => term.name === solarTermName);
      if (currentIndex === -1) {
        currentIndex = 0;
        solarTermName = boundaries[0].name;
      }
      if (newIndexOpt !== undefined) {
        currentIndex = newIndexOpt;
        solarTermName = boundaries[currentIndex].name;
      }
      const currentTerm = boundaries[currentIndex];
      let nextTerm;
      if (currentIndex + 1 < boundaries.length) {
        nextTerm = boundaries[currentIndex + 1];
      } else {
        let nextBoundaries = 절기_기준_범위(solarYear + 1);
        if (!Array.isArray(nextBoundaries)) {
          nextBoundaries = Array.from(nextBoundaries);
        }
        nextTerm = nextBoundaries[0];
      }

      const normStart = normalizeDate(currentTerm.date);
      const normNext = normalizeDate(nextTerm.date);
      const finalEndDate = new Date(normNext.getTime() - oneDayMs);
      const calendarHTML = generateDailyFortuneCalendar(
        solarTermName,
        normStart,
        finalEndDate,
        baseDayStem,
        currentIndex,
        boundaries,
        solarYear
      );
      const container = document.getElementById("iljuCalender");
      if (container) {
        container.innerHTML = calendarHTML;
      }
      solarYear = solarYear;
      boundaries = boundaries;
      currentIndex = currentIndex;
      const now = new Date();
      let activeMonth = activeMonth || (now.getMonth() + 1);
      월운_리스트.forEach(function (li) {
        const liMonth = parseInt(li.getAttribute("data-index3"), 10);
        li.classList.toggle("active", liMonth === activeMonth);
      });
    }

    월운_캘린더_업데이트(currentTerm.name, currentSolarYear);

    // li 클릭 이벤트 처리
    function 대운_클릭_이벤트(
      일간,
      생년월일_소숫점_환산,
      절기_기준_범위
    ) {
      const 대운_아이디 = document.querySelectorAll("[id^='daewoon_']");
      대운_아이디.forEach(function (daewoonLi) {
        daewoonLi.addEventListener("click", function (event) {
          event.stopPropagation();
          
          // UI 숨김/보임 처리
          document.getElementById('iljuCalender').style.display = 'none';
          const sewoonBox = document.querySelector(".lucky.sewoon");
          if (sewoonBox) { sewoonBox.style.display = "none"; }
          세운_리스트.forEach(li => li.classList.remove("active"));
          if (월운_구역) { 월운_구역.style.display = "none"; }
          
          // 출생년도(decimal) 계산
          const 보정_생년월일_소숫점_환산 = 생년월일_소숫점_환산(correctedDate);
          const 선택된_대운 = 대운_데이터.list[daewoonIndex - 1];
          if (!선택된_대운) return;
          const 대운수 = 선택된_대운.age; 
          세운_시작_보정 = 보정_생년월일_소숫점_환산 + 대운수;
          let 세운_시작_년도 = Math.floor(세운_시작_보정);
          
          // 세운(운) 리스트 생성
          const sewoonList = [];
          for (let j = 0; j < 10; j++) {
            let sewoonYear = 세운_시작_보정 + j;
            let yearGanZhi = getYearGanZhiForSewoon(sewoonYear);
            const splitYear = splitPillar(yearGanZhi);
            const 천간_십신 = 천간_십신_매핑(splitYear.gan, 일간);
            const 지지_십신 = 지지_십신_매핑(splitYear.ji, 일간);
            sewoonList.push({
              year: sewoonYear,
              gan: splitYear.gan,
              ji: splitYear.ji,
              tenGod: 천간_십신,
              tenGodJiji: 지지_십신
            });
          }
          
          // 세운 데이터 업데이트 함수
          function 세운_데이터_업데이트(일간, 연지) {
            sewoonList.forEach(function (item, index) {
              const idx = index + 1;
              setText("SC_" + idx, 천간_정보_매핑[item.gan]?.hanja || "-");
              setText("SJ_" + idx, 지지_정보_매핑[item.ji]?.hanja || "-");
              setText("st10sin" + idx, item.tenGod);
              setText("sb10sin" + idx, item.tenGodJiji);
              setText("SwW" + idx, 십이운성_매핑(일간, item.ji) || "-");
              setText("Ss" + idx, 십이신살_매핑(연지, item.ji) || "-");
              setText("Dy" + idx, item.year);
            });
          }
          세운_데이터_업데이트(일간, 연지, 천간_십신, 지지_십신);
          
          // 원국 대운 HTML 업데이트 함수
          function 대운_HTML_업데이트(선택된_대운, 일간) {
            setText("DwtHanja", 천간_정보_매핑[선택된_대운.stem]?.hanja || "-");
            setText("DwtHanguel", 천간_정보_매핑[선택된_대운.stem]?.hanguel || "-");
            setText("DwtEumyang", 천간_정보_매핑[선택된_대운.stem]?.eumYang || "-");
            setText("Dwt10sin", getTenGodForStem(선택된_대운.stem, 일간));
            setText("DwbHanja", 지지_정보_매핑[선택된_대운.branch]?.hanja || "-");
            setText("DwbHanguel", 지지_정보_매핑[선택된_대운.branch]?.hanguel || "-");
            setText("DwbEumyang", 지지_정보_매핑[선택된_대운.branch]?.eumYang || "-");
            setText("Dwb10sin", getTenGodForBranch(선택된_대운.branch, 일간));
            const 대운_지장간_매핑 = 지장간_매핑[선택된_대운.branch] || ["(-)", "(-)", "(-)"];
            setText("DwJj1", 대운_지장간_매핑[0]);
            setText("DwJj2", 대운_지장간_매핑[1]);
            setText("DwJj3", 대운_지장간_매핑[2]);
          }
          대운_HTML_업데이트(선택된_대운, 일간);
          
          ui_색상_업데이트();
          
          const 세운_구분 = 절기_기준_범위(세운_시작_보정);
          const targetSolarTerm = 세운_구분[0].name;
          updateMonthlyFortuneCalendar(targetSolarTerm, 세운_시작_보정);
          월운_리스트.forEach(li => li.classList.remove("active"));
        });
      });
    }
    대운_클릭_이벤트(
      일간,
      생년월일_소숫점_환산,
      절기_기준_범위
    ); 
    

    if (!currentTerm) { currentTerm = boundariesArr[0]; }
    월운_캘린더_업데이트(currentTerm.name, mjInfo.year);
    (function 리스트_액티브_업데이트(currentTerm) {
      const displayedMonth = currentTerm.date.getMonth() + 1;
      월운_리스트.forEach(function (li) {
        const liMonth = parseInt(li.getAttribute("data-index3"), 10);
        li.classList.toggle("active", liMonth === displayedMonth);
      });
    })();

    월운_리스트.forEach(function(li) {
      li.addEventListener("click", function(event) {
        event.stopPropagation();
        월운_리스트.forEach(function(item) {
          item.classList.remove("active");
        });
        li.classList.add("active");
        document.getElementById('iljuCalender').style.display = 'grid';
        const termName = li.getAttribute("data-solar-term") || "";
        mjInfo.year || (function(){
          return (today < ipChun) ? today.getFullYear() - 1 : today.getFullYear();
        })();
        activeMonth = parseInt(li.getAttribute("data-index3"), 10);
        updateMonthlyFortuneCalendar(termName, mjInfo.year);
      });
    });

    function getSolarYearSpanInDays(birthDate, years) {
      const endDate = new Date(birthDate);
      endDate.setFullYear(endDate.getFullYear() + years);
      return (endDate - birthDate) / oneDayMs;
    }

    function getSolarMonthSpanInDays(birthDate, months) {
      const endDate = new Date(birthDate);
      endDate.setMonth(endDate.getMonth() + months);
      return (endDate - birthDate) / oneDayMs;
    }

    function getSolarDaySpanInDays(birthDate, days) {
      const endDate = new Date(birthDate);
      endDate.setDate(endDate.getDate() + days);
      return (endDate - birthDate) / oneDayMs;
    }

    function getDynamicCycles(birthDate) {
      const yeonjuCycle = getSolarYearSpanInDays(birthDate, 60);
      const woljuCycle  = getSolarYearSpanInDays(birthDate, 10);
      const iljuCycle   = getSolarMonthSpanInDays(birthDate, 4);
      const sijuCycle   = getSolarDaySpanInDays(birthDate, 10);
      return { yeonjuCycle, woljuCycle, iljuCycle, sijuCycle };
    }

    const { yeonjuCycle, woljuCycle, iljuCycle, sijuCycle } = getDynamicCycles(mjInfo.birthDate);

    const yeonjuMode = direction === 1 ? "순행" : "역행";
    const woljuMode  = direction === 1 ? "순행" : "역행";
    const iljuMode   = direction === 1 ? "순행" : "역행";
    const sijuMode   = direction === 1 ? "순행" : "역행";

    function adjustInitial(candidate, cycleDays, baseDate) {
      while (candidate < baseDate) {
        candidate = new Date(candidate.getTime() + cycleDays * oneDayMs);
      }
      return candidate;
    }

    function getDynamicStep(candidateTime, cycleDays, refDate) {
      const now = refDate || new Date();
      const diff = now - candidateTime; // 밀리초 차이
      return diff < 0 ? 0 : Math.floor(diff / (cycleDays * oneDayMs)) + 1;
    }

    function applyFirstUpdateDynamicWithStep(date, originalIndex, cycleDays, mode) {
      const steps = getDynamicStep(date, cycleDays, today, 간지_인덱스_구함);
      const updatedIndex = mode === "순행"
        ? ((originalIndex + steps) % 60 + 60) % 60
        : ((originalIndex - steps) % 60 + 60) % 60;
      return { date: date, index: updatedIndex, ganji: 간지_인덱스_구함(updatedIndex) };
    }

    // 묘운
    function getMyounPillars(gender, refDate, birthDate, 절기_기준_범위) {
      let baseTime = new Date(mjInfo.birthDate);

      const jasiElem = document.getElementById("jasi");
      const yajojasiElem = document.getElementById("yajojasi");
      const insiElem = document.getElementById("insi");

      if (jasiElem && jasiElem.checked) {
        baseTime.setHours(23, 0, 0, 0);
      } else if (yajojasiElem && yajojasiElem.checked) {
        baseTime.setHours(0, 0, 0, 0);
      } else if (insiElem && insiElem.checked) {
        baseTime.setHours(3, 0, 0, 0);
      }

      const jeolgi = 절기_기준_범위(mjInfo.year);
      let targetSolarTerm;
      if (woljuMode === "역행") {
        const pastTerms = jeolgi.filter(term => term.date <= staticBirth);
        targetSolarTerm = pastTerms.length ? pastTerms[pastTerms.length - 1] : jeolgi[0];
      } else {
        targetSolarTerm = jeolgi.find(term => term.date > staticBirth);
        if (!targetSolarTerm) {
          targetSolarTerm = 절기_기준_범위(mjInfo.year + 1)[0];
        }
      }

      function round4(num) {
        return Math.round((num * 10000)) / 10000;
      }

      function 묘운_시주_계산식(round4, birthDate, mode, hour, minute) {
        const sijuCycle = 10;
        const totalMinutes = 1440;
        const blockLength = 120;
        const birthMinutes = mjInfo.hour * 60 + mjInfo.minute;

        const blocks = [
          { start: 1380, end: 60 }, { start: 60, end: 180 },
          { start: 180, end: 300 }, { start: 300, end: 420 },
          { start: 420, end: 540 }, { start: 540, end: 660 },
          { start: 660, end: 780 }, { start: 780, end: 900 },
          { start: 900, end: 1020 }, { start: 1020, end: 1140 },
          { start: 1140, end: 1260 }, { start: 1260, end: 1380 }
        ];

        let block = blocks.find(b => (b.start < b.end && birthMinutes >= b.start && birthMinutes < b.end) ||
                                      (b.start > b.end && (birthMinutes >= b.start || birthMinutes < b.end)));
        if (!block) block = blocks[0];
    
        let diff = mode === "순행" ? block.end - birthMinutes : birthMinutes - block.start;
        if (diff < 0) diff += totalMinutes;
        let ratio = round4(diff / blockLength);
        return Number((ratio * sijuCycle).toFixed(4));
      }

      function 묘운_일주_계산식_보조(birthDate, year, oneDayMs) {
        const endDate = new Date(birthDate);
        endDate.setFullYear(mjInfo.year + 120);
        const totalDays = (endDate - birthDate) / oneDayMs;
        return (totalDays / (120 * 12)) * 4;
      }

      function 묘운_일주_계산식(birthDate, mode, oneDayMs) {
        const dynamicIljuCycle = 묘운_일주_계산식_보조(birthDate, mjInfo.year);
        const diffMinutes = (mode === "순행" ? baseTime - birthDate : birthDate - baseTime) / oneDayMs;
        return diffMinutes * dynamicIljuCycle / (24 * 60);
      }

      function 묘운_월주_계산식(birthDate, mode, 절기_기준_범위, oneDayMs) {
        let boundaries = 절기_기준_범위(mjInfo.year);
        if (!boundaries.length) return 0;
        let target = mode === "순행" ? boundaries.find(b => b.date > birthDate) : boundaries.filter(b => b.date <= birthDate).slice(-1)[0];
        if (!target) target = getSolarTermBoundaries(solarYear + (mode === "순행" ? 1 : -1))[0];
        const avg = get120YearAverages(target.date);
        const ratio = Math.abs(target.date - birthDate) / oneDayMs / avg.averageMonth;
        return Number((ratio * avg.averageDecade).toFixed(4));
      }

      function 묘운_연주_계산식_보조(date, oneDayMs, year) {
        const end = new Date(date);
        end.setFullYear(year + 120);
        return ((end - date) / oneDayMs) / 120;
      }

      function 묘운_연주_계산식(birthDate, mode, ipChun, 절기_기준_범위, oneDayMs, yeonjuCycle) {
        if (mode === "순행" && birthDate >= ipChun) {
          ipChun = 절기_기준_범위(birthDate.getFullYear() + 1).find(b => b.name === "입춘")?.date;
        } else if (mode === "역행" && birthDate < ipChun) {
          ipChun = 절기_기준_범위(birthDate.getFullYear() - 1).find(b => b.name === "입춘")?.date;
        }
        const ratio = Math.abs(ipChun - birthDate) / oneDayMs / 묘운_연주_계산식_보조(mjInfo.birthDate, oneDayMs, mjInfo.year);
        return Math.round(ratio * yeonjuCycle * 1000) / 1000;
      }

      let newSijuFirst  = adjustInitial(new Date(mjInfo.birthDate + 묘운_시주_계산식(round4, mjInfo.birthDate, mode, mjInfo.hour, mjInfo.minute) * oneDayMs), sijuCycle, mjInfo.birthDate);
      let newIljuFirst  = adjustInitial(new Date(mjInfo.birthDate + 묘운_일주_계산식(staticBirth, iljuMode) * oneDayMs), iljuCycle, staticBirth);
      let newWoljuFirst = adjustInitial(new Date(mjInfo.birthDate + 묘운_월주_계산식(staticBirth, woljuMode) * oneDayMs), woljuCycle, staticBirth);
      let newYeonjuFirst= adjustInitial(new Date(mjInfo.birthDate + 묘운_연주_계산식(staticBirth, yeonjuMode) * oneDayMs), yeonjuCycle, staticBirth);
    
    }

    //===========================================================================================================//
  });
});