import { userInfo } from "./common.js";
import { validateUserInputs } from "./유효성검사.js";
import { 육십갑자, 월_간지, 천간, 지지, 천간_매핑, 지지_매핑, 지지_타임랩스, 월_시두법_인시,
  십신_천간, 십신_지지, 칼라_매핑, 지장간_매핑, 십이운성, 십이신살 } from "./mapping.js";
import { oneDayMs, splitPillar, 평균_120, 년_월_일_시 } from "./calculration.js";
import { 연주_구함, 월주_구함, 일주_구함, 시지_인덱스_구함, 일간_구함, 시주_구함 } from "./ganzhi.js";
import { 원국_계산, 원국_HTML_반영 } from './원국구함.js';
import { 도시경도, 썸머타임, 균시차, 최종보정, 율리우스, 율리우스_역변환, 태양의_황경, JD_날짜_get } from "./solar.js";
import { 절기_날짜_찾음, 절기_경계, 월_넘버 } from "./term.js";
import { updateColorClasses } from "./ui.js";

document.addEventListener('DOMContentLoaded', () => {
  const calcBtn = document.getElementById('calcBtn');

  const isTimeUnknownInput = document.getElementById('bitthTimeX');
  const isPlaceUnknownInput = document.getElementById('bitthPlaceX');
  const birthTimeInput = document.getElementById('inputBirthtime');
  const birthPlaceSelect = document.getElementById('inputBirthPlace');

  isTimeUnknownInput.addEventListener('change', () => {
    if (isTimeUnknownInput.checked) {
      birthTimeInput.value = '';
    }
  });

  isPlaceUnknownInput.addEventListener('change', () => {
    if (isPlaceUnknownInput.checked) {
      birthPlaceSelect.selectedIndex = 0;
      birthPlaceSelect.dispatchEvent(new Event('change')); // 선택지 반영 보장
    }
  });

  calcBtn.addEventListener('click', () => {
    const name = document.getElementById('inputName').value.trim();
    const birth = document.getElementById('inputBirthday').value.trim();
    const monthType = document.getElementById('monthType').value;

    // 출생시간 관련 처리
    const birthTime = document.getElementById('inputBirthtime').value.trim();
    const isTimeUnknown = document.getElementById('bitthTimeX').checked;

    const birthTimeForUI = isTimeUnknown ? '시간모름' : birthTime;     

    // 출생지 관련 처리
    const birthPlace = document.getElementById('inputBirthPlace').value;
    const isPlaceUnknown = document.getElementById('bitthPlaceX').checked;

    const birthPlaceForUI = isPlaceUnknown ? '출생지모름' : birthPlace; 

    // 성별
    const gender = document.querySelector('input[name="gender"]:checked')?.id === 'genderMan' ? '남' : '여';

    // 시간 기준
    const timeStandard = document.querySelector('input[name="time2"]:checked')?.value || 'insi';


    

    // 유효성 검사
    const isValid = validateUserInputs({
      name,
      birth,
      monthType,
      birthTime,
      isTimeUnknown,
      gender,
      birthPlace,
      isPlaceUnknown,
      timeStandard,
    });
  
    if (!isValid || !isValid.valid) return;

    const {
      birthTimeValue,
      birthPlaceValue,
      birthStr,
      birthTimeStr,
      birthPlaceStr,
      timeStandardStr,
    } = isValid;

    // 전역 정보 저장 (계산용 기준으로 저장)
    userInfo.name = name;
    userInfo.birth = birth;
    userInfo.monthType = monthType;
    userInfo.birthTime = birthTimeValue;
    userInfo.isTimeUnknown = isTimeUnknown;
    userInfo.gender = gender;
    userInfo.birthPlace = birthPlaceValue;
    userInfo.isPlaceUnknown = isPlaceUnknown;
    userInfo.timeStandard = timeStandard;

    document.getElementById('resName').textContent = name || '지정되지 않음';
    document.getElementById('resGender').textContent = gender;
    document.getElementById('resBirth').textContent = birthStr;
    document.getElementById('resBirth2').textContent = ''; // 음력 변환은 아직 처리 안함
    document.getElementById('resTime').textContent = birthTimeStr;
    document.getElementById('resAddr').textContent = birthPlaceStr;
    document.getElementById('resbjTime').textContent = ''; // 보정시는 나중에

    // 시간 기준 체크된 라디오버튼 설정
    const standardId = {
      jasi: 'timeChk02_01',
      yajojasi: 'timeChk02_02',
      insi: 'timeChk02_03',
    }[timeStandard];

    if (standardId) {
      const radio = document.getElementById(standardId);
      if (radio) {
        radio.checked = true;
      }
    }

    // 출생일 파싱
    // 생년월일에서 연, 월, 일을 정수형으로 추출합니다.
    const [year, month, day, hour, minute] = [
      parseInt(birth.substring(0, 4), 10),
      parseInt(birth.substring(4, 6), 10),
      parseInt(birth.substring(6, 8), 10),
      parseInt(birthTime.slice(0, 2), 10),
      parseInt(birthTime.slice(2, 4), 10)
    ];

    const ipChun = 절기_날짜_찾음(year, 315);

    const calendar = new KoreanLunarCalendar();
    let lunar = null;  // UI 표시용 음력 날짜 변수
    let solar = null;  // 변환된 양력 날짜 변수
    let birthForCalc = ''; // 계산용 생일(양력 문자열)

    // 입력된 달력 타입에 따라 처리합니다.
    if (monthType === "음력" || monthType === "음력(윤달)") {
      // 입력이 음력일 경우
      const isLeap = (monthType === "음력(윤달)");
      // 음력 날짜 설정에 실패하면 오류 메시지 출력
      if (!calendar.setLunarDate(year, month, day, isLeap)) {
        console.error(`${monthType} 날짜 설정에 실패했습니다.`);
      } else {
        // 음력 날짜 설정에 성공하면, 양력 변환을 진행
        solar = calendar.getSolarCalendar();
        // UI나 후속 처리를 위해 양력 날짜로 변수 업데이트
        year = solar.year;
        month = solar.month;
        day = solar.day;

        // 음력 날짜는 이미 calendar 내부에 저장되어 있으므로 가져옵니다.
        // (입력 음력 정보에는 윤달 여부를 그대로 유지)
        lunar = calendar.lunarCalendar;
        // 계산용 생일은 양력 문자열로 생성합니다.
        birthForCalc = `${solar.year}${String(solar.month).padStart(2, '0')}${String(solar.day).padStart(2, '0')}`;
      }
    } else {
      // 입력이 양력일 경우
      if (!calendar.setSolarDate(year, month, day)) {
        console.error("양력 날짜 설정에 실패했습니다.");
      } else {
        // 양력 입력이면, 음력으로 변환하여 UI에 표시하고 계산용 생일은 원본을 그대로 사용
        lunar = calendar.getLunarCalendar();
        solar = { year, month, day };
        birthForCalc = birth;
      }
    }

    // 음력 결과를 UI에 표시합니다.
    if (lunar) {
      // 날짜 형식: YYYY-MM-DD (윤달이면 "(윤달)" 추가)
      const lunarStr = `${lunar.year}-${String(lunar.month).padStart(2, '0')}-${String(lunar.day).padStart(2, '0')}`;
      const lunarStrWithLeap = lunar.intercalation ? `${lunarStr} (윤달)` : lunarStr;
      document.getElementById('resBirth2').textContent = lunarStrWithLeap;
    }

    const dateObj = new Date(year, month - 1, day, hour, minute);
    const corrected = 최종보정(dateObj, birthPlace, isPlaceUnknown, 도시경도, 썸머타임, 균시차);

    // 보정시 구하기
    function updateCorrectedTime(userInfo) {
      const { isTimeUnknown, birthPlace, isPlaceUnknown } = userInfo;
    
      if (isTimeUnknown) {
        document.getElementById('bjTimeText').style.display = 'none';
        return;
      } 
    
      if (hour === 24) hour = 0;
      if (minute === 60) minute = 0;
    
      // 보정시 HH:MM 형식으로 출력
      const h = String(corrected.getHours()).padStart(2, '0');
      const m = String(corrected.getMinutes()).padStart(2, '0');
      document.getElementById('resbjTime').textContent = `${h}:${m}`;
      document.getElementById('bjTimeText').style.display = 'inline-block';
    }
    
    updateCorrectedTime(userInfo);

    console.log(dateObj);
  
    // ✅ 원국 계산
    const pillars = 원국_계산(
      dateObj,
      year,
      율리우스,
      율리우스_역변환,
      태양의_황경,
      {
        절기_날짜_찾음,
        절기_경계,
        월_넘버,
        연주_구함,
        월주_구함,
        일주_구함,
        시지_인덱스_구함,
        시주_구함,
        일간_구함,
        육십갑자,
        천간,
        지지,
        월_간지,
        ipChun,
        월_시두법_인시,
        천간_매핑
      }
    );

    // ✅ HTML 반영
    원국_HTML_반영(pillars, {
      천간_매핑,
      지지_매핑,
      지장간_매핑,
      십신_천간,
      십신_지지,
      십이운성,
      십이신살
    });

    console.log('[저장된 계산용 정보]', JSON.stringify(userInfo, null, 2));

    updateColorClasses(칼라_매핑);

    document.getElementById("aside").style.display = "none";
    document.getElementById("inputWrap").style.display = "none";
    document.getElementById("resultWrapper").style.display = "block";
    window.scrollTo(0, 0);
    
  });
});
