// main.js
import { pad, setText } from "./js/format/main.js";
import { splitPillar, get120YearAverages } from "./js/calculation/main.js";
import { 보정시_출력_함수 } from "./js/correction/function.js";
import { 대운_함수, 대운_문자열_get, 대운_get } from "./js/get/daewoon.js";
import { 십신_천간_get, 십신_지지_get } from "./js/get/info.js";
import {
  천간_매핑, 지지_매핑, 천간_데이터_매핑, 지지_데이터_매핑, 지지_정보_매핑, 
  monthZhi, 육십갑자_매핑, 십이운성_매핑, 십이신살_매핑, 십신_천간_매핑, 십신_지지_매핑, 지장간_매핑, colorMapping } from "./js/mapping/main.js";
import { 년도_세팅_get, 일_간지_get, 일간_get, 사용할_시간_get, 시간_get, 연_간지_get, 월_넘버_get, 월_간지_get } from "./js/get/time.js";
import { 그래고리력_to_율리우스일, 율리우스일_to_그래고리력, getSunLongitude, getJDFromDate } from "./js/solar/main.js";
import { 절기_찾는_함수, 태양의_절기_get } from "./js/solar/term.js";
import { 천간_업데이트, 지지_업데이트, 색상_UI_업데이트, 지장간_업데이트 } from "./js/ui/update.js";


document.addEventListener("DOMContentLoaded", function () {

  let 명주이름,
      생년월일_값,
      나이,
      생시_값,
      생시_값_뷰,
      생시_값_사용,
      생시_모름,
      성별_구분,
      출생지_값,
      출생지_지정_뷰,
      출생지_지정_사용,
      출생지_모름,
      생년월일_보정,
      생년월일시_보정;
      

  let 태어난_년도,
      태어난_달,
      태어난_일,
      태어난_시간,
      태어난_분;

  
  let 시주, 일주, 월주, 연주, 시간, 시지, 일간, 일지, 월간, 월지, 연간, 연지;


  document.getElementById("calcBtn").addEventListener("click", function () {

    // calcBtn 지역한정 전역 변수
    const todayDate = new Date();

    // 정보 입력
    생시_모름 = document.getElementById("bitthTimeX").checked;
    출생지_모름 = document.getElementById("bitthPlaceX").checked;
    명주이름 = document.getElementById("inputName")?.value?.replace(/\s/g, "")?.trim() || "이름없음";
    생년월일_값 = document.getElementById("inputBirthday")?.value.replace(/\s/g, "")?.trim();
    생시_값 = document.getElementById("inputBirthtime")?.value.replace(/\s/g, "")?.trim();
    출생지_값 = document.getElementById("inputBirthPlace")?.value.replace(/\s/g, "")?.trim();
    생시_값_뷰 = 생시_모름 
                          ? "시간모름" 
                          : 생시_값;
    생시_값_사용 = 생시_모름 
                          ? "0330" 
                          : 생시_값;
    
    성별_구분 = document.getElementById("genderMan").checked ? "남" 
    : (document.getElementById("genderWoman").checked ? "여" : "-");

    출생지_지정_뷰 = (출생지_모름 || 출생지_값 === "" || 출생지_값 === "출생지 선택") 
                          ? "출생지모름" 
                          : document.getElementById("inputBirthtime")?.value.replace(/\s/g, "")?.trim();
    출생지_지정_사용 = (출생지_모름 || 출생지_값 === "" || 출생지_값 === "출생지 선택") 
                          ? "서울특별시" 
                          : document.getElementById("inputBirthtime")?.value.replace(/\s/g, "")?.trim();
    
    // 정보 파싱
    태어난_년도   = parseInt(생년월일_값.substring(0, 4), 10);
    태어난_달  = parseInt(생년월일_값.substring(4, 6), 10);
    태어난_일    = parseInt(생년월일_값.substring(6, 8), 10);
    태어난_시간 = 생시_모름 ? 0 : parseInt(생시_값_사용.substring(0, 2), 10);
    태어난_분 = 생시_모름 ? 0 : parseInt(생시_값_사용.substring(2, 4), 10);
    생년월일시_보정 = new Date(태어난_년도, 태어난_달 - 1, 태어난_일, 태어난_시간, 태어난_분);

    // 유효성 검사
    if (태어난_년도 < 1900 || 태어난_년도 > 2099) {
      alert("연도는 1900년부터 2099년 사이로 입력하세요.");
      return;
    }
    if (태어난_달 < 1 || 태어난_달 > 12) {
      alert("월은 1부터 12 사이의 숫자로 입력하세요.");
      return;
    }
    if (태어난_일 < 1 || 태어난_일 > 31) {
      alert("일은 1부터 31 사이의 숫자로 입력하세요.");
      return;
    }
    생년월일_보정 = new Date(태어난_년도, 태어난_달 - 1, 태어난_일);

    if (생년월일_보정.getFullYear() !== 태어난_년도 || (생년월일_보정.getMonth() + 1) !== 태어난_달 || 생년월일_보정.getDate() !== 태어난_일) {
      alert("유효한 날짜를 입력하세요.");
      return;
    }

    if (!생시_모름) {
      if (생시_값_뷰.length !== 4 || isNaN(생시_값_뷰)) {
        alert("태어난 시간을 4자리 숫자 (HHMM) 형식으로 입력하세요.");
        return;
      }
      if (태어난_시간 < 0 || 태어난_시간 > 23 || 태어난_분 < 0 || 태어난_분 > 59) {
        alert("시각은 00부터 23 사이, 분은 00부터 59 사이로 입력하세요.");
        return;
      }
    }

    setText("resName", 명주이름);
    setText("resGender", 성별_구분);
    나이 = todayDate.getFullYear() - 생년월일_보정.getFullYear();
    if (todayDate.getMonth() < 생년월일_보정.getMonth() ||
        (todayDate.getMonth() === 생년월일_보정.getMonth() && todayDate.getDate() < 생년월일_보정.getDate())) {
          나이--;
    }
    setText("resAge", 나이);
    
    const 생년월일_포맷 = `${태어난_년도}-${pad(태어난_달)}-${pad(태어난_일)}`;
    setText("resBirth", 생년월일_포맷);
    const 시간_포맷 = `${태어난_시간}:${pad(태어난_분)}`;
    setText("resTime", 생시_모름 ? "시간모름" : 시간_포맷);
    setText("resbjTime", 출생지_모름 ? "보정시없음" : 출생지_값);
    setText("resAddr", 출생지_모름 ? "출생지모름" : 출생지_값);
    const correctedTime = 보정시_출력_함수(생년월일시_보정, 출생지_모름, 출생지_값);
    const resbjTimeElem = document.getElementById("resbjTime");
    if (resbjTimeElem) {
      resbjTimeElem.innerHTML = correctedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    }
    const bjTimeTextElem = document.getElementById("bjTimeText");
    if (출생지_모름) {
      bjTimeTextElem.innerHTML = `기본보정 - 30분 : <b id="resbjTime">${correctedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</b>`;
    } else {
      bjTimeTextElem.innerHTML = `보정시 : <b id="resbjTime">${correctedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</b>`;
    }

    // 양 음력 구분
    const monthType = document.getElementById("monthType").value;
    const calendar = new KoreanLunarCalendar();
    let lunarDate = null;
    if (monthType === "음력" || monthType === "음력(윤달)") {
      const isLeap = (monthType === "음력(윤달)");
      if (!calendar.setLunarDate(태어난_년도, month, day, isLeap)) {
        console.error(`${monthType} 날짜 설정에 실패했습니다.`);
      } else {
        lunarDate = { year, month, day, isLeap };
        const solar = calendar.getSolarCalendar();
        year = solar.year; 
        month = solar.month; 
        day = solar.day;
      }
    } else {
      if (!calendar.setSolarDate(태어난_년도, 태어난_달, 태어난_일)) {
        console.error("양력 날짜 설정에 실패했습니다.");
      } else {
        lunarDate = calendar.getLunarCalendar();
      }
    }

    const 보정된_날짜 = 보정시_출력_함수(생년월일_보정, 출생지_지정_사용);
    if (lunarDate) {
      const formattedLunar = `${lunarDate.year}-${pad(lunarDate.month)}-${pad(lunarDate.day)}${lunarDate.isLeap ? " (윤달)" : ""}`;
      setText("resBirth2", formattedLunar);
    }

    // ==================인풋 입력후 지역한정 상수================================= //

    
    const ipChun = 절기_찾는_함수(
      태어난_년도, 315,
      그래고리력_to_율리우스일, 율리우스일_to_그래고리력, getSunLongitude
    );

    const yajojasiElem = document.getElementById('yajojasi');
    const yajojasi = yajojasiElem && yajojasiElem.checked;
    const jasiElem = document.getElementById('jasi');
    const isJasi = jasiElem && jasiElem.checked;
    const insiElem = document.getElementById('insi');
    const isInsi = insiElem && insiElem.checked;

    // ======================================================================== //
    

    const fullResult = 대운_함수(
      태어난_년도, 
      태어난_달, 
      태어난_일, 
      출생지_지정_사용, 
      성별_구분, 
      yajojasi, 
      isJasi, 
      isInsi,
      생년월일_보정,
      지지_매핑, 
      지지_정보_매핑,
      ipChun,
      todayDate,
      사용할_시간_get,
      일_간지_get,
      시간_get,
      연_간지_get,
      월_간지_get,
      육십갑자_매핑,
      그래고리력_to_율리우스일,
      일간_get,
      육십갑자_매핑,
      천간_매핑,
      지지_매핑,
      태양의_절기_get,
      월_넘버_get,
      절기_찾는_함수,
      율리우스일_to_그래고리력,
      getSunLongitude,
      monthZhi,
      대운_get,
      대운_문자열_get,
      일주,
      보정시_출력_함수,
      get120YearAverages
    );

    console.log(그래고리력_to_율리우스일);

    const parts = fullResult.split(", ");
    const pillarsPart = parts[0] || "-";
    console.log(pillarsPart);
    const pillars = pillarsPart.split(" ");
    const yearPillar  = pillars[0] || "-";
    const monthPillar = pillars[1] || "-";
    const dayPillar   = pillars[2] || "-";
    const hourPillar  = pillars[3] || "-";

    연주 = splitPillar(yearPillar); // ★
    월주 = splitPillar(monthPillar); // ★
    일주 = splitPillar(dayPillar); // ★
    시주 = splitPillar(hourPillar); // ★

    일간 = 일주.gan; // ★
    연지 = 연주.ji; // ★

    시간 = 시주.gan;
    시지 = 시주.ji;
    일지 = 일주.ji;
    월간 = 월주.gan;
    월지 = 월주.ji;
    연간 = 연주.ji;
    

    function 지지_관련_매핑(십이운성_매핑, 십이신살_매핑, 일간, 연지, 월지, 일지, 시지) {
      setText("Hb12ws", 생시_모름 ? "-" : 십이운성_매핑(일간, 시지));
      setText("Hb12ss", 생시_모름 ? "-" : 십이신살_매핑(연지, 시지));
      setText("Db12ws", 십이운성_매핑(일간, 일지));
      setText("Db12ss", 십이신살_매핑(연지, 일지));
      setText("Mb12ws", 십이운성_매핑(일간, 월지));
      setText("Mb12ss", 십이신살_매핑(연지, 월지));
      setText("Yb12ws", 십이운성_매핑(일간, 연지));
      setText("Yb12ss", 십이신살_매핑(연지, 연지));
    }

    // 원국 업데이트 
    천간_업데이트("Yt", 연주, 일간, 천간_데이터_매핑, 십신_천간_get, setText, 십신_천간_매핑);
    천간_업데이트("Mt", 월주, 일간, 천간_데이터_매핑, 십신_천간_get, setText, 십신_천간_매핑);
    천간_업데이트("Dt", 일주, 일간, 천간_데이터_매핑, 십신_천간_get, setText, 십신_천간_매핑);
    천간_업데이트("Ht", 생시_값_사용 ? "-" : 시주, 일간, 천간_데이터_매핑, 십신_천간_get, setText, 십신_천간_매핑);
    지지_업데이트("Yb", 연지, 일간, 지지_데이터_매핑, 십신_지지_get, setText, 십신_지지_매핑, 지장간_업데이트, 지장간_매핑);
    지지_업데이트("Mb", 월지, 일간, 지지_데이터_매핑, 십신_지지_get, setText, 십신_지지_매핑, 지장간_업데이트, 지장간_매핑);
    지지_업데이트("Db", 일지, 일간, 지지_데이터_매핑, 십신_지지_get, setText, 십신_지지_매핑, 지장간_업데이트, 지장간_매핑);
    지지_업데이트("Hb", 생시_값_사용 ? "-" : 시지, 일간, 지지_데이터_매핑, 십신_지지_get, setText, 십신_지지_매핑, 지장간_업데이트, 지장간_매핑);
    지지_관련_매핑(십이운성_매핑, 십이신살_매핑, 일간, 연지, 월지, 일지, 시지);
    색상_UI_업데이트(colorMapping);

    // 대운 업데이트
    function 현재대운_업뎃(
      baseDayStem, 
      baseYearBranch,
      currentAge,
      gender, 
      ipchun, 
      monthZhi, 
      Cheongan,
      correctedDate, 
      year,
      태양의_절기_get, 
      일_간지_get,
      월_넘버_get, 
      연_간지_get,
      월_간지_get, 
      절기_찾는_함수, 
      calendarGregorianToJD, 
      jdToCalendarGregorian, 
      getSunLongitude, 
      육십갑자_매핑,
      stemMapping,
      branchMapping,
      getTenGodForStem,
      getTenGodForBranch,
      getTwelveUnseong,
      getTwelveShinsal,
      hiddenStemMapping
    ) {
      const daewoonData = 대운_get(
        gender, 
        ipchun, 
        monthZhi, 
        Cheongan,
        correctedDate, 
        year, 
        태양의_절기_get, 
        일_간지_get,
        월_넘버_get, 
        연_간지_get,
        월_간지_get, 
        절기_찾는_함수, 
        calendarGregorianToJD, 
        jdToCalendarGregorian, 
        getSunLongitude, 
        육십갑자_매핑,
      );
      let currentDaewoon = null;
      for (let i = 0; i < daewoonData.list.length; i++) {
        if (daewoonData.list[i].age <= currentAge) {
          currentDaewoon = daewoonData.list[i];
        }
      }
      if (!currentDaewoon) {
        currentDaewoon = daewoonData.list[0] || { stem: "-", branch: "-" };
      }
    
      setText("DwtHanja", stemMapping[currentDaewoon.stem]?.hanja || "-");
      setText("DwtHanguel", stemMapping[currentDaewoon.stem]?.hanguel || "-");
      setText("DwtEumyang", stemMapping[currentDaewoon.stem]?.eumYang || "-");
      setText("Dwt10sin", getTenGodForStem(currentDaewoon.stem, baseDayStem));
      setText("DwbHanja", branchMapping[currentDaewoon.branch]?.hanja || "-");
      setText("DwbHanguel", branchMapping[currentDaewoon.branch]?.hanguel || "-");
      setText("DwbEumyang", branchMapping[currentDaewoon.branch]?.eumYang || "-");
      setText("Dwb10sin", getTenGodForBranch(currentDaewoon.branch, baseDayStem));
      const hiddenArr = hiddenStemMapping[currentDaewoon.branch] || ["-", "-", "-"];
      setText("DwJj1", hiddenArr[0]);
      setText("DwJj2", hiddenArr[1]);
      setText("DwJj3", hiddenArr[2]);
      setText("DWb12ws", getTwelveUnseong(baseDayStem, currentDaewoon.branch));
      setText("DWb12ss", getTwelveShinsal(baseYearBranch, currentDaewoon.branch));
    }
    현재대운_업뎃(
      일간, 
      연지,
      나이,
      성별_구분, 
      ipChun, 
      monthZhi, 
      천간_매핑,
      생년월일_보정,
      태어난_년도, 
      태양의_절기_get, 
      일_간지_get,
      월_넘버_get, 
      연_간지_get,
      월_간지_get, 
      절기_찾는_함수, 
      그래고리력_to_율리우스일, 
      율리우스일_to_그래고리력, 
      getSunLongitude, 
      육십갑자_매핑,
      천간_데이터_매핑,
      지지_데이터_매핑,
      십신_천간_get,
      십신_지지_get,
      십이운성_매핑,
      십이신살_매핑,
      지장간_업데이트
    );

    // 결과창 노출 (인풋창 숨김)
    document.getElementById("inputWrap").style.display = "none";
    document.getElementById("resultWrapper").style.display = "block";
  });
});