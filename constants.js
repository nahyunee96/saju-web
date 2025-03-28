// constants.js

export const Cheongan = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"];

export const Jiji = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"];

export const MONTH_ZHI = ["인", "묘", "진", "사", "오", "미", "신", "유", "술", "해", "자", "축"];

export const tenGodMappingForStems = {
  "갑": { "갑": "비견", "을": "겁재", "병": "식신", "정": "상관", "무": "편재", "기": "정재", "경": "편관", "신": "정관", "임": "편인", "계": "정인" },
  "을": { "갑": "겁재", "을": "비견", "병": "상관", "정": "식신", "무": "정재", "기": "편재", "경": "정관", "신": "편관", "임": "정인", "계": "편인" },
  "병": { "갑": "편인", "을": "정인", "병": "비견", "정": "겁재", "무": "식신", "기": "상관", "경": "편재", "신": "정재", "임": "편관", "계": "정관" },
  "정": { "갑": "정인", "을": "편인", "병": "겁재", "정": "비견", "무": "상관", "기": "식상", "경": "정재", "신": "편재", "임": "정관", "계": "편관" },
  "무": { "갑": "편관", "을": "정관", "병": "편인", "정": "정인", "무": "비견", "기": "겁재", "경": "식신", "신": "상관", "임": "편재", "계": "정재" },
  "기": { "갑": "정관", "을": "편관", "병": "정인", "정": "편인", "무": "겁재", "기": "비견", "경": "상관", "신": "식신", "임": "정재", "계": "편재" },
  "경": { "갑": "편재", "을": "정재", "병": "편관", "정": "정관", "무": "편인", "기": "정인", "경": "비견", "신": "겁재", "임": "식신", "계": "상관" },
  "신": { "갑": "정재", "을": "편재", "병": "정관", "정": "편관", "무": "정인", "기": "편인", "경": "겁재", "신": "비견", "임": "상관", "계": "식신" },
  "임": { "갑": "식신", "을": "상관", "병": "편재", "정": "정재", "무": "편관", "기": "정관", "경": "편인", "신": "정인", "임": "비견", "계": "겁재" },
  "계": { "갑": "식신", "을": "상관", "병": "편재", "정": "정재", "무": "편관", "기": "정관", "경": "편인", "신": "정인", "임": "비견", "계": "겁재" }
};

export const tenGodMappingForBranches = {
  "갑": { "자": "정인", "축": "정재", "인": "비견", "묘": "겁재", "진": "편재", "사": "상관", "오": "식신", "미": "정재", "신": "편관", "유": "정관", "술": "편재", "해": "편인" },
  "을": { "자": "편인", "축": "편재", "인": "겁재", "묘": "비견", "진": "정재", "사": "식신", "오": "상관", "미": "편재", "신": "정관", "유": "편관", "술": "정재", "해": "정인" },
  "병": { "자": "정관", "축": "상관", "인": "편인", "묘": "정인", "진": "식신", "사": "비견", "오": "겁살", "미": "상관", "신": "편재", "유": "정재", "술": "식신", "해": "편인" },
  "정": { "자": "편관", "축": "식신", "인": "정인", "묘": "편인", "진": "상관", "사": "겁재", "오": "비견", "미": "식신", "신": "정재", "유": "편재", "술": "상관", "해": "정인" },
  "무": { "자": "정재", "축": "겁재", "인": "편관", "묘": "정관", "진": "비견", "사": "편인", "오": "정인", "미": "겁재", "신": "식신", "유": "상관", "술": "비견", "해": "편재" },
  "기": { "자": "편재", "축": "비견", "인": "정관", "묘": "편관", "진": "겁재", "사": "정인", "오": "편인", "미": "비견", "신": "상관", "유": "식신", "술": "겁재", "해": "정재" },
  "경": { "자": "상관", "축": "정인", "인": "편재", "묘": "정재", "진": "편인", "사": "편관", "오": "정관", "미": "정인", "신": "비견", "유": "겁재", "술": "편인", "해": "식신" },
  "신": { "자": "식신", "축": "편인", "인": "정재", "묘": "편재", "진": "정인", "사": "정관", "오": "편관", "미": "편인", "신": "겁재", "유": "비견", "술": "정인", "해": "상관" },
  "임": { "자": "겁재", "축": "정관", "인": "식상", "묘": "상관", "진": "편관", "사": "편재", "오": "정재", "미": "정관", "신": "편인", "유": "정인", "술": "편인", "해": "비견" },
  "계": { "자": "비견", "축": "편관", "인": "상관", "묘": "식신", "진": "정관", "사": "정재", "오": "편재", "미": "편관", "신": "정인", "유": "편인", "술": "정인", "해": "겁재" }
};

export const colorMapping = {
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

export const hiddenStemMapping = {
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

export const sexagenaryCycle = [
  "갑자", "을축", "병인", "정묘", "무진", "기사", "경오", "신미", "임신", "계유",
  "갑술", "을해", "병자", "정축", "무인", "기묘", "경진", "신사", "임오", "계미",
  "갑신", "을유", "병술", "정해", "무자", "기축", "경인", "신묘", "임진", "계사",
  "갑오", "을미", "병신", "정유", "무술", "기해", "경자", "신축", "임인", "계묘",
  "갑진", "을사", "병오", "정미", "무신", "기유", "경술", "신해", "임자", "계축",
  "갑인", "을묘", "병진", "정사", "무오", "기미", "경신", "신유", "임술", "계해"
];

export const cityLongitudes = {
  "서울특별시": 126.9780, "부산광역시": 129.1, "대구광역시": 128.6,
  "인천광역시": 126.7052, "광주광역시": 126.8530, "대전광역시": 127.3845,
  "울산광역시": 129.3114, "세종특별자치시": 127.2890,
  "수원시": 127.0014, "고양시": 126.83, "용인시": 127.1731,
  "성남시": 127.137, "부천시": 126.766, "안산시": 126.851,
  "안양시": 126.9566, "남양주시": 127.2623, "화성시": 126.831,
  "평택시": 127.1116, "시흥시": 126.79, "김포시": 126.715,
  "파주시": 126.783, "의정부시": 127.0469, "광명시": 126.8826,
  "광주시": 126.666, "군포시": 126.935, "이천시": 127.443,
  "양주시": 127.03, "오산시": 127.079, "구리시": 127.13,
  "안성시": 127.279, "포천시": 127.2, "의왕시": 126.931,
  "하남시": 127.214, "여주시": 127.652, "동두천시": 127.05,
  "과천시": 126.984, "가평군": 127.51, "양평군": 127.5, "연천군": 127.1,
  "춘천시": 127.729, "원주시": 127.93, "강릉시": 128.896, "동해시": 129.113,
  "태백시": 128.986, "속초시": 128.591, "삼척시": 129.168, "홍천군": 127.88,
  "횡성군": 128.425, "영월군": 128.613, "평창군": 128.424, "정선군": 128.7,
  "철원군": 127.415, "화천군": 127.753, "양구군": 128.47, "인제군": 128.116,
  "고성군": 128.467, "양양군": 128.692,
  "청주시": 127.4914, "충주시": 127.9323, "제천시": 128.1926, "보은군": 127.728,
  "옥천군": 127.609, "영동군": 128.382, "진천군": 127.439, "괴산군": 127.731,
  "음성군": 127.674, "단양군": 128.377, "증평군": 127.48,
  "천안시": 127.146, "공주시": 127.098, "보령시": 126.611, "아산시": 127.001,
  "서산시": 126.449, "논산시": 127.074, "계룡시": 127.264, "당진시": 126.621,
  "금산군": 127.386, "부여군": 126.802, "서천군": 126.781, "청양군": 126.856,
  "홍성군": 126.726, "예산군": 126.678, "태안군": 126.325,
  "전주시": 127.108, "군산시": 126.711, "익산시": 126.957, "정읍시": 126.846,
  "남원시": 127.392, "김제시": 126.871, "완주군": 127.062, "진안군": 127.229,
  "무주군": 127.69, "장수군": 127.891, "임실군": 127.409, "순창군": 127.13,
  "고창군": 126.785, "부안군": 126.73,
  "목포시": 126.411, "여수시": 127.643, "순천시": 127.496, "나주시": 126.717,
  "광양시": 127.695, "담양군": 126.984, "곡성군": 127.262, "구례군": 127.392,
  "고흥군": 127.384, "보성군": 127.122, "화순군": 127.04, "장흥군": 126.725,
  "강진군": 126.645, "해남군": 126.531, "영암군": 126.682, "무안군": 126.731,
  "함평군": 126.625, "영광군": 126.509, "장성군": 126.751, "완도군": 126.653,
  "진도군": 126.359, "신안군": 126.361,
  "포항시": 129.366, "경주시": 129.224, "김천시": 128.198, "안동시": 128.723,
  "구미시": 128.344, "영주시": 128.637, "영천시": 128.733, "상주시": 128.159,
  "문경시": 128.185, "경산시": 128.734, "군위군": 128.454, "의성군": 128.181,
  "청송군": 128.218, "영양군": 128.276, "영덕군": 128.703, "청도군": 128.626,
  "고령군": 128.347, "성주군": 128.177, "칠곡군": 128.54, "예천군": 128.245,
  "봉화군": 128.363, "울진군": 129.341, "울릉군": 130.904,
  "창원시": 128.681, "김해시": 128.881, "진주시": 128.092, "양산시": 129.045,
  "거제시": 128.678, "사천시": 128.189, "밀양시": 128.747, "통영시": 128.425,
  "거창군": 128.184, "고성군": 128.373, "남해군": 127.902, "산청군": 127.779,
  "창녕군": 128.415, "하동군": 127.997, "함안군": 128.389, "함양군": 127.81,
  "합천군": 128.175,
  "의령군": 128.29,
  "제주시": 126.5312, "서귀포시": 126.715
};

export const timeRanges = [
  { branch: '자', hanja: '子', start: 23 * 60, end: 1 * 60 },
  { branch: '축', hanja: '丑', start: 1 * 60,  end: 3 * 60 },
  { branch: '인', hanja: '寅', start: 3 * 60,  end: 5 * 60 },
  { branch: '묘', hanja: '卯', start: 5 * 60,  end: 7 * 60 },
  { branch: '진', hanja: '辰', start: 7 * 60,  end: 9 * 60 },
  { branch: '사', hanja: '巳', start: 9 * 60,  end: 11 * 60 },
  { branch: '오', hanja: '午', start: 11 * 60, end: 13 * 60 },
  { branch: '미', hanja: '未', start: 13 * 60, end: 15 * 60 },
  { branch: '신', hanja: '申', start: 15 * 60, end: 17 * 60 },
  { branch: '유', hanja: '酉', start: 17 * 60, end: 19 * 60 },
  { branch: '술', hanja: '戌', start: 19 * 60, end: 21 * 60 },
  { branch: '해', hanja: '亥', start: 21 * 60, end: 23 * 60 }
];

export const stemMapping = {
  "갑": { hanja: "甲", hanguel: "갑목", eumYang: "양" },
  "을": { hanja: "乙", hanguel: "을목", eumYang: "음" },
  "병": { hanja: "丙", hanguel: "병화", eumYang: "양" },
  "정": { hanja: "丁", hanguel: "정화", eumYang: "음" },
  "무": { hanja: "戊", hanguel: "무토", eumYang: "양" },
  "기": { hanja: "己", hanguel: "기토", eumYang: "음" },
  "경": { hanja: "庚", hanguel: "경금", eumYang: "양" },
  "신": { hanja: "辛", hanguel: "신금", eumYang: "음" },
  "임": { hanja: "壬", hanguel: "임수", eumYang: "양" },
  "계": { hanja: "癸", hanguel: "계수", eumYang: "음" }
};

export const branchMapping = {
  "자": { hanja: "子", hanguel: "자수", eumYang: "양(음)" },
  "축": { hanja: "丑", hanguel: "축토", eumYang: "음" },
  "인": { hanja: "寅", hanguel: "인목", eumYang: "양" },
  "묘": { hanja: "卯", hanguel: "묘목", eumYang: "음" },
  "진": { hanja: "辰", hanguel: "진토", eumYang: "양" },
  "사": { hanja: "巳", hanguel: "사화", eumYang: "음(양)" },
  "오": { hanja: "午", hanguel: "오화", eumYang: "양(음)" },
  "미": { hanja: "未", hanguel: "미토", eumYang: "음" },
  "신": { hanja: "申", hanguel: "신금", eumYang: "양" },
  "유": { hanja: "酉", hanguel: "유금", eumYang: "음" },
  "술": { hanja: "戌", hanguel: "술토", eumYang: "양" },
  "해": { hanja: "亥", hanguel: "해수", eumYang: "음(양)" }
};

export function updateHiddenStems(SetBranch, prefix) {
  const mapping = hiddenStemMapping[SetBranch] || ["-", "-", "-"];
  document.getElementById(prefix + "Jj1").innerText = mapping[0];
  document.getElementById(prefix + "Jj2").innerText = mapping[1];
  document.getElementById(prefix + "Jj3").innerText = mapping[2];
}

