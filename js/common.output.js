let globalState = { birthYear: null, month: null, day: null, birthPlace: null, gender: null, daewoonData: null, sewoonStartYear: null, originalDayStem: null };

const tenGodMappingForStems = {
  "갑": { "갑": "비견", "을": "겁재", "병": "식신", "정": "상관", "무": "편재", "기": "정재", "경": "편관", "신": "정관", "임": "편인", "계": "정인" },
  "을": { "갑": "겁재", "을": "비견", "병": "상관", "정": "식신", "무": "정재", "기": "편재", "경": "정관", "신": "편관", "임": "정인", "계": "편인" },
  "병": { "갑": "편인", "을": "정인", "병": "비견", "정": "겁재", "무": "식신", "기": "상관", "경": "편재", "신": "정재", "임": "편관", "계": "정관" },
  "정": { "갑": "정인", "을": "편인", "병": "겁재", "정": "비견", "무": "상관", "기": "식신", "경": "정재", "신": "편재", "임": "정관", "계": "편관" },
  "무": { "갑": "편관", "을": "정관", "병": "편인", "정": "정인", "무": "비견", "기": "겁재", "경": "식신", "신": "상관", "임": "편재", "계": "정재" },
  "기": { "갑": "정관", "을": "편관", "병": "정인", "정": "편인", "무": "겁재", "기": "비견", "경": "상관", "신": "식신", "임": "정재", "계": "편재" },
  "경": { "갑": "편재", "을": "정재", "병": "편관", "정": "정관", "무": "편인", "기": "정인", "경": "비견", "신": "겁재", "임": "식신", "계": "상관" },
  "신": { "갑": "정재", "을": "편재", "병": "정관", "정": "편관", "무": "정인", "기": "편인", "경": "겁재", "신": "비견", "임": "상관", "계": "식신" },
  "임": { "갑": "식신", "을": "상관", "병": "편재", "정": "정재", "무": "편관", "기": "정관", "경": "편인", "신": "정인", "임": "비견", "계": "겁재" },
  "계": { "갑": "상관", "을": "식신", "병": "정재", "정": "편재", "무": "정관", "기": "편관", "경": "정인", "신": "편인", "임": "계수", "계": "비견" }
};

const tenGodMappingForBranches = {
  "갑": { "자": "정인", "축": "정재", "인": "비견", "묘": "겁재", "진": "편재", "사": "식신", "오": "상관", "미": "정재", "신": "편관", "유": "정관", "술": "편재", "해": "편인" },
  "을": { "자": "편인", "축": "편재", "인": "겁재", "묘": "비견", "진": "정재", "사": "상관", "오": "식신", "미": "편재", "신": "정관", "유": "편관", "술": "정재", "해": "정인" },
  "병": { "자": "정관", "축": "상관", "인": "편인", "묘": "정인", "진": "식신", "사": "비견", "오": "겁재", "미": "상관", "신": "편재", "유": "정재", "술": "식신", "해": "편관" },
  "정": { "자": "편관", "축": "식신", "인": "정인", "묘": "편인", "진": "상관", "사": "겁재", "오": "비견", "미": "식신", "신": "정재", "유": "편재", "술": "상관", "해": "정관" },
  "무": { "자": "정재", "축": "겁재", "인": "편관", "묘": "정관", "진": "비견", "사": "편인", "오": "정인", "미": "겁재", "신": "식신", "유": "상관", "술": "비견", "해": "편재" },
  "기": { "자": "편재", "축": "비견", "인": "정관", "묘": "편관", "진": "겁재", "사": "정인", "오": "편인", "미": "비견", "신": "상관", "유": "식신", "술": "겁재", "해": "정재" },
  "경": { "자": "상관", "축": "정인", "인": "편재", "묘": "정재", "진": "편인", "사": "편관", "오": "정관", "미": "정인", "신": "비견", "유": "겁재", "술": "편인", "해": "식신" },
  "신": { "자": "식신", "축": "편인", "인": "정재", "묘": "편재", "진": "정인", "사": "정관", "오": "편관", "미": "편인", "신": "겁재", "유": "비견", "술": "정인", "해": "상관" },
  "임": { "자": "겁재", "축": "정관", "인": "식신", "묘": "상관", "진": "편관", "사": "편재", "오": "정재", "미": "정관", "신": "편인", "유": "정인", "술": "편관", "해": "비견" },
  "계": { "자": "비견", "축": "편관", "인": "상관", "묘": "식신", "진": "정관", "사": "정재", "오": "편재", "미": "편관", "신": "정인", "유": "편인", "술": "정관", "해": "겁재" }
};

const colorMapping = {
  "甲": { textColor: 'green', bgColor: 'b_green' },
  "乙": { textColor: 'green', bgColor: 'b_green' },
  "丙": { textColor: 'red', bgColor: 'b_red' },
  "丁": { textColor: 'red', bgColor: 'b_red' },
  "戊": { textColor: 'yellow', bgColor: 'b_yellow' },
  "己": { textColor: 'yellow', bgColor: 'b_yellow' },
  "庚": { textColor: 'white', bgColor: 'b_white' },
  "辛": { textColor: 'white', bgColor: 'b_white' },
  "壬": { textColor: 'black', bgColor: 'b_black' },
  "癸": { textColor: 'black', bgColor: 'b_black' },
  "子": { textColor: 'black', bgColor: 'b_black' },
  "丑": { textColor: 'yellow', bgColor: 'b_yellow' },
  "寅": { textColor: 'green', bgColor: 'b_green' },
  "卯": { textColor: 'green', bgColor: 'b_green' },
  "辰": { textColor: 'yellow', bgColor: 'b_yellow' },
  "巳": { textColor: 'red', bgColor: 'b_red' },
  "午": { textColor: 'red', bgColor: 'b_red' },
  "未": { textColor: 'yellow', bgColor: 'b_yellow' },
  "申": { textColor: 'white', bgColor: 'b_white' },
  "酉": { textColor: 'white', bgColor: 'b_white' },
  "戌": { textColor: 'yellow', bgColor: 'b_yellow' },
  "亥": { textColor: 'black', bgColor: 'b_black' }
};

const colorMapping2 = {
  "갑": { textColor: 'green', bgColor: 'b_green' },
  "을": { textColor: 'green', bgColor: 'b_green' },
  "병": { textColor: 'red', bgColor: 'b_red' },
  "정": { textColor: 'red', bgColor: 'b_red' },
  "무": { textColor: 'yellow', bgColor: 'b_yellow' },
  "기": { textColor: 'yellow', bgColor: 'b_yellow' },
  "경": { textColor: 'white', bgColor: 'b_white' },
  "신": { textColor: 'white', bgColor: 'b_white' },
  "임": { textColor: 'black', bgColor: 'b_black' },
  "계": { textColor: 'black', bgColor: 'b_black' },
  "자": { textColor: 'black', bgColor: 'b_black' },
  "축": { textColor: 'yellow', bgColor: 'b_yellow' },
  "인": { textColor: 'green', bgColor: 'b_green' },
  "묘": { textColor: 'green', bgColor: 'b_green' },
  "진": { textColor: 'yellow', bgColor: 'b_yellow' },
  "사": { textColor: 'red', bgColor: 'b_red' },
  "오": { textColor: 'red', bgColor: 'b_red' },
  "미": { textColor: 'yellow', bgColor: 'b_yellow' },
  "신": { textColor: 'white', bgColor: 'b_white' },
  "유": { textColor: 'white', bgColor: 'b_white' },
  "술": { textColor: 'yellow', bgColor: 'b_yellow' },
  "해": { textColor: 'black', bgColor: 'b_black' }
};

const hiddenStemMapping = {
  "자": ["(-)", "(-)", "계"],
  "축": ["계", "신", "기"],
  "인": ["(-)", "병", "갑"],
  "묘": ["(-)", "(-)", "을"],
  "진": ["을", "계", "무"],
  "사": ["(-)", "경", "병"],
  "오": ["(-)", "(-)", "정"],
  "미": ["정", "을", "기"],
  "신": ["(-)", "임", "경"],
  "유": ["(-)", "(-)", "신"],
  "술": ["신", "정", "무"],
  "해": ["(-)", "갑", "임"]
};

function getTwelveUnseong(baseDayStem, branch) {
  const mapping = {
    "갑": { "자": "목욕", "축": "관대", "인": "건록", "묘": "제왕", "진": "쇠", "사": "병", "오": "사", "미": "묘", "신": "절", "유": "태", "술": "양", "해": "장생" },
    "을": { "자": "병", "축": "쇠", "인": "제왕", "묘": "건록", "진": "관대", "사": "목욕", "오": "장생", "미": "양", "신": "태", "유": "절", "술": "묘", "해": "사" },
    "병": { "자": "태", "축": "양", "인": "장생", "묘": "목욕", "진": "관대", "사": "건록", "오": "제왕", "미": "쇠", "신": "병", "유": "사", "술": "묘", "해": "절" },
    "정": { "자": "절", "축": "묘", "인": "사", "묘": "병", "진": "쇠", "사": "제왕", "오": "건록", "미": "관대", "신": "목욕", "유": "장생", "술": "양", "해": "태" },
    "무": { "자": "태", "축": "양", "인": "장생", "묘": "목욕", "진": "관대", "사": "건록", "오": "제왕", "미": "쇠", "신": "병", "유": "사", "술": "묘", "해": "절" },
    "기": { "자": "절", "축": "묘", "인": "사", "묘": "병", "진": "쇠", "사": "제왕", "오": "건록", "미": "관대", "신": "목욕", "유": "장생", "술": "양", "해": "태" },
    "경": { "자": "사", "축": "묘", "인": "절", "묘": "태", "진": "양", "사": "장생", "오": "목욕", "미": "관대", "신": "건록", "유": "제왕", "술": "쇠", "해": "병" },
    "신": { "자": "장생", "축": "양", "인": "태", "묘": "절", "진": "묘", "사": "사", "오": "병", "미": "쇠", "신": "제왕", "유": "건록", "술": "관대", "해": "목욕" },
    "임": { "자": "제왕", "축": "쇠", "인": "병", "묘": "사", "진": "묘", "사": "절", "오": "태", "미": "양", "신": "장생", "유": "목욕", "술": "관대", "해": "건록" },
    "계": { "자": "건록", "축": "관대", "인": "목욕", "묘": "장생", "진": "양", "사": "태", "오": "절", "미": "묘", "신": "사", "유": "병", "술": "쇠", "해": "제왕" }
  };
  return mapping[baseDayStem] ? mapping[baseDayStem][branch] || "" : "";
}

function getTwelveShinsal(yearBranch, branch) {
  const mapping = {
    "자": { "자": "장성", "축": "반안", "인": "역마", "묘": "육해", "진": "화개", "사": "겁살", "오": "재살", "미": "천살", "신": "지살", "유": "년살", "술": "월살", "해": "망신" },
    "축": { "자": "망신", "축": "장성", "인": "반안", "묘": "역마", "진": "육해", "사": "화개", "오": "겁살", "미": "재살", "신": "천살", "유": "지살", "술": "년살", "해": "월살" },
    "인": { "자": "월살", "축": "망신", "인": "장성", "묘": "반안", "진": "역마", "사": "육해", "오": "화개", "미": "겁살", "신": "재살", "유": "천살", "술": "지살", "해": "년살" },
    "묘": { "자": "년살", "축": "월살", "인": "망신", "묘": "장성", "진": "반안", "사": "역마", "오": "육해", "미": "화개", "신": "겁살", "유": "재살", "술": "천살", "해": "지살" },
    "진": { "자": "지살", "축": "년살", "인": "월살", "묘": "망신", "진": "장성", "사": "반안", "오": "역마", "미": "육해", "신": "화개", "유": "겁살", "술": "재살", "해": "천살" },
    "사": { "자": "천살", "축": "지살", "인": "년살", "묘": "월살", "진": "망신", "사": "장성", "오": "반안", "미": "역마", "신": "육해", "유": "화개", "술": "겁살", "해": "재살" },
    "오": { "자": "재살", "축": "천살", "인": "지살", "묘": "년살", "진": "월살", "사": "망신", "오": "장성", "미": "반안", "신": "역마", "유": "육해", "술": "화개", "해": "겁살" },
    "미": { "자": "겁살", "축": "재살", "인": "천살", "묘": "지살", "진": "년살", "사": "월살", "오": "망신", "미": "장성", "신": "반안", "유": "역마", "술": "육해", "해": "화개" },
    "신": { "자": "화개", "축": "겁살", "인": "재살", "묘": "천살", "진": "지살", "사": "년살", "오": "월살", "미": "망신", "신": "장성", "유": "반안", "술": "역마", "해": "육해" },
    "유": { "자": "육해", "축": "화개", "인": "겁살", "묘": "재살", "진": "천살", "사": "지살", "오": "년살", "미": "월살", "신": "망신", "유": "장성", "술": "반안", "해": "역마" },
    "술": { "자": "역마", "축": "육해", "인": "화개", "묘": "겁살", "진": "재살", "사": "천살", "오": "지살", "미": "년살", "신": "월살", "유": "망신", "술": "장성", "해": "반안" },
    "해": { "자": "반안", "축": "역마", "인": "육해", "묘": "화개", "진": "겁살", "사": "재살", "오": "천살", "미": "지살", "신": "년살", "유": "월살", "술": "망신", "해": "장성" }
  };
  return mapping[yearBranch] ? mapping[yearBranch][branch] || "" : "";
}

function getTwelveShinsal2(yearBranch, branch) {
  const groupMapping = {
    "해": "묘", "묘": "묘", "미": "묘",
    "인": "오", "오": "오", "술": "오",
    "사": "유", "유": "유", "축": "유",
    "신": "자", "자": "자", "진": "자",
  };

  const mapping = {
    "묘": { "자": "년살", "축": "월살", "인": "망신", "묘": "장성", "진": "반안", "사": "역마", "오": "육해", "미": "화개", "신": "겁살", "유": "재살", "술": "천살", "해": "지살" },
    "오": { "자": "재살", "축": "천살", "인": "지살", "묘": "년살", "진": "월살", "사": "망신", "오": "장성", "미": "반안", "신": "역마", "유": "육해", "술": "화개", "해": "겁살" },
    "유": { "자": "육해", "축": "화개", "인": "겁살", "묘": "재살", "진": "천살", "사": "지살", "오": "년살", "미": "월살", "신": "망신", "유": "장성", "술": "반안", "해": "역마" },
    "자": { "자": "장성", "축": "반안", "인": "역마", "묘": "육해", "진": "화개", "사": "겁살", "오": "재살", "미": "천살", "신": "지살", "유": "년살", "술": "월살", "해": "망신" },
  };

  const key = groupMapping[yearBranch];
  return key && mapping[key] ? mapping[key][branch] || "" : "";
}

function getTwelveShinsal8(yearBranch, branch) {
  const mapping = {
    "자": { "자": "장성", "축": "반안", "인": "역마", "묘": "육액", "진": "화개", "사": "겁살", "오": "재살", "미": "천살", "신": "지살", "유": "도화", "술": "월살", "해": "망신" },
    "축": { "자": "망신", "축": "장성", "인": "반안", "묘": "역마", "진": "육액", "사": "화개", "오": "겁살", "미": "재살", "신": "천살", "유": "지살", "술": "도화", "해": "월살" },
    "인": { "자": "월살", "축": "망신", "인": "장성", "묘": "반안", "진": "역마", "사": "육액", "오": "화개", "미": "겁살", "신": "재살", "유": "천살", "술": "지살", "해": "도화" },
    "묘": { "자": "도화", "축": "월살", "인": "망신", "묘": "장성", "진": "반안", "사": "역마", "오": "육액", "미": "화개", "신": "겁살", "유": "재살", "술": "천살", "해": "지살" },
    "진": { "자": "지살", "축": "도화", "인": "월살", "묘": "망신", "진": "장성", "사": "반안", "오": "역마", "미": "육액", "신": "화개", "유": "겁살", "술": "재살", "해": "천살" },
    "사": { "자": "천살", "축": "지살", "인": "도화", "묘": "월살", "진": "망신", "사": "장성", "오": "반안", "미": "역마", "신": "육액", "유": "화개", "술": "겁살", "해": "재살" },
    "오": { "자": "재살", "축": "천살", "인": "지살", "묘": "도화", "진": "월살", "사": "망신", "오": "장성", "미": "반안", "신": "역마", "유": "육액", "술": "화개", "해": "겁살" },
    "미": { "자": "겁살", "축": "재살", "인": "천살", "묘": "지살", "진": "도화", "사": "월살", "오": "망신", "미": "장성", "신": "반안", "유": "역마", "술": "육액", "해": "화개" },
    "신": { "자": "화개", "축": "겁살", "인": "재살", "묘": "천살", "진": "지살", "사": "도화", "오": "월살", "미": "망신", "신": "장성", "유": "반안", "술": "역마", "해": "육액" },
    "유": { "자": "육액", "축": "화개", "인": "겁살", "묘": "재살", "진": "천살", "사": "지살", "오": "도화", "미": "월살", "신": "망신", "유": "장성", "술": "반안", "해": "역마" },
    "술": { "자": "역마", "축": "육액", "인": "화개", "묘": "겁살", "진": "재살", "사": "천살", "오": "지살", "미": "도화", "신": "월살", "유": "망신", "술": "장성", "해": "반안" },
    "해": { "자": "반안", "축": "역마", "인": "육액", "묘": "화개", "진": "겁살", "사": "재살", "오": "천살", "미": "지살", "신": "도화", "유": "월살", "술": "망신", "해": "장성" }
  };
  return mapping[yearBranch] ? mapping[yearBranch][branch] || "" : "";
}

function getTwelveShinsal82(yearBranch, branch) {
  // 각 삼합 그룹을 하나의 기준 지지에 매핑
  const groupMapping = {
    "해": "묘", "묘": "묘", "미": "묘",
    "인": "오", "오": "오", "술": "오",
    "사": "유", "유": "유", "축": "유",
    "신": "자", "자": "자", "진": "자",
  };

  const mapping = {
    "묘": { "자": "도화", "축": "월살", "인": "망신", "묘": "장성", "진": "반안", "사": "역마", "오": "육액", "미": "화개", "신": "겁살", "유": "재살", "술": "천살", "해": "지살" },
    "오": { "자": "재살", "축": "천살", "인": "지살", "묘": "도화", "진": "월살", "사": "망신", "오": "장성", "미": "반안", "신": "역마", "유": "육액", "술": "화개", "해": "겁살" },
    "유": { "자": "육액", "축": "화개", "인": "겁살", "묘": "재살", "진": "천살", "사": "지살", "오": "도화", "미": "월살", "신": "망신", "유": "장성", "술": "반안", "해": "역마" },
    "자": { "자": "장성", "축": "반안", "인": "역마", "묘": "육액", "진": "화개", "사": "겁살", "오": "재살", "미": "천살", "신": "지살", "유": "도화", "술": "월살", "해": "망신" },
  };

  const key = groupMapping[yearBranch];
  return key && mapping[key] ? mapping[key][branch] || "" : "";
}

function getTwelveShinsalDynamic(dayPillar, yearPillar, targetBranch) {
  const isDayBasis  = document.getElementById("s12CtrlType04").checked;
  const referenceBranch = isDayBasis
    ? dayPillar.charAt(1)
    : yearPillar.charAt(1);

  const isModern = document.getElementById("s12CtrlType01").checked;
  const isGaehwa = document.getElementById("s12CtrlType03").checked;

  if (isModern) {
    return isGaehwa
      ? getTwelveShinsal8(referenceBranch, targetBranch)
      : getTwelveShinsal82(referenceBranch, targetBranch);
  } else {
    return isGaehwa
      ? getTwelveShinsal(referenceBranch, targetBranch)
      : getTwelveShinsal2(referenceBranch, targetBranch);
  }
}

function pad(num) { return num.toString().padStart(2, '0'); }
function getTenGodForStem(receivingStem, baseDayStem) {
  return (tenGodMappingForStems[baseDayStem] && tenGodMappingForStems[baseDayStem][receivingStem]) || "-";
}
function getTenGodForBranch(receivingBranch, baseStem) {
  return (tenGodMappingForBranches[baseStem] && tenGodMappingForBranches[baseStem][receivingBranch]) || "-";
}
function getGanZhiIndex(gz) { return sexagenaryCycle.indexOf(gz); }
function getGanZhiFromIndex(i) { const mod = ((i % 60) + 60) % 60; return sexagenaryCycle[mod]; }

function getYearGanZhiForSewoon(year) {
  let refDate = new Date(year, 3, 1);
  let ipChun = findSolarTermDate(year, 315, selectedLon);
  let effectiveYear = (refDate >= ipChun) ? year : (year - 1);
  let index = ((effectiveYear - 4) % 60 + 60) % 60;
  return sexagenaryCycle[index];
}

// month: 1~12, 여기서 1=寅, 12=丑 (월운 기준 순서: 寅→卯→…→丑)
function getMonthGanZhiForWolwoon(year, month) {
  const yearGanZhi = getYearGanZhiForSewoon(year);
  const yearStem   = yearGanZhi.charAt(0);
  const yIdx       = Cheongan.indexOf(yearStem); // 0~9: 갑을병정무기경신임계
  if (yIdx < 0) throw new Error('Invalid year stem');

  // 寅월의 천간 인덱스(출발점)
  // 갑/기→병(2), 을/경→무(4), 병/신→경(6), 정/임→임(8), 무/계→갑(0)
  // Align tiger month stem with standard mapping (갑/기->병, 을/경->무, ...).
  const tigerStemIdx  = ((yIdx % 5) * 2 + 2) % 10;

  // 월운 m(1=寅)만큼 진행
  const monthStemIdx  = (tigerStemIdx + ((month + 10) % 12)) % 10;

  // 지지: Jiji가 [자,축,인,묘,진,사,오,미,신,유,술,해] 순이라면
  // 寅을 1로 두기 위해 +1 오프셋
  const monthBranchIdx = (month) % 12; // 1→2(寅), 12→1(丑)

  return Cheongan[monthStemIdx] + Jiji[monthBranchIdx];
}


function updateColorClasses() {
  const bgColorClasses = ['b_green','b_red','b_yellow','b_white','b_black'];

  document.querySelectorAll(".ganji_w").forEach(elem => {
    const val = elem.innerHTML.trim();
    bgColorClasses.forEach(cls => elem.classList.remove(cls));
    if (colorMapping[val]) elem.classList.add(colorMapping[val].bgColor);
  });

  // 공통 셀렉터
  const selector = [
    ".grid_box_1 li b",
    ".ganji b",
    ".ilwoon_ganji_cheongan span",
    ".ilwoon_ganji_jiji span"
  ].join(", ");

  document.querySelectorAll(selector).forEach(elem => {
    const val = elem.textContent.trim();

    const isSpan = elem.matches(".ilwoon_ganji_cheongan span, .ilwoon_ganji_jiji span");
    if (isSpan) {
      const cls = colorMapping2[val]?.bgColor;
      if (!cls) return;
      bgColorClasses.forEach(c => elem.classList.remove(c));
      elem.classList.add(cls);
    } else {
      const cls = colorMapping[val]?.bgColor;
      if (!cls) return;

      const container = elem.closest('.hanja_con');
      if (!container) return;
      bgColorClasses.forEach(c => container.classList.remove(c));
      container.classList.add(cls);
      const next = container.nextElementSibling;
      if (next?.tagName.toLowerCase() === 'p') {
        bgColorClasses.forEach(c => next.classList.remove(c));
        next.classList.add(cls);
      }
    }
  });
}

function appendTenGod(id, value, isStem = true) {
  const el = document.getElementById(id);
  if (!el) return;

  let tenGod;
  if (value === '-' || value === '(-)') {
    tenGod = '없음';
  } else {
    tenGod = isStem
      ? getTenGodForStem(value, baseDayStem)
      : getTenGodForBranch(value, baseDayStem);
  }

  el.innerHTML = '';
  el.append(document.createTextNode(value));

  const span = document.createElement('span');
  span.className = 'ten-god';
  span.textContent = `(${tenGod})`;
  el.append(document.createTextNode(' '), span);
}      

function updateHiddenStems(SetBranch, prefix) {
  const mapping = hiddenStemMapping[SetBranch] || ["-", "-", "-"];
  mapping.forEach((value, i) => {
    const id = prefix + "Jj" + (i + 1);
    appendTenGod(id, value, true);
  });
}

function setText(id, text) {
  const elem = document.getElementById(id);
  if (elem) elem.innerText = text;
}

function updateStemInfo(prefix, splitData, baseDayStem, suffix = "") {
  const gan = splitData.gan;
  const hanja    = stemMapping[gan]?.hanja    ?? "-";
  const hanguel  = stemMapping[gan]?.hanguel  ?? "-";
  const eumYang  = stemMapping[gan]?.eumYang  ?? "-";
  const tenSin   = (prefix === "Dt")
    ? "본원"
    : (getTenGodForStem(gan, baseDayStem)  ?? "-");

  setText(prefix + "Hanja"  + suffix, hanja);
  setText(prefix + "Hanguel"+ suffix, hanguel);
  setText(prefix + "Eumyang"+ suffix, eumYang);
  setText(prefix + "10sin"  + suffix, tenSin);
}

function updateBranchInfo(prefix, branch, baseDayStem, suffix = "") {
  const hanja   = branchMapping[branch]?.hanja    || "-";
  const hanguel = branchMapping[branch]?.hanguel  || "-";
  const eumYang = branchMapping[branch]?.eumYang  || "-";
  const tenSin  = getTenGodForBranch(branch, baseDayStem) || "-";

  setText(prefix + "Hanja"   + suffix, hanja);
  setText(prefix + "Hanguel" + suffix, hanguel);
  setText(prefix + "Eumyang" + suffix, eumYang);
  setText(prefix + "10sin"   + suffix, tenSin);

  updateHiddenStems(branch, prefix + suffix);
}

