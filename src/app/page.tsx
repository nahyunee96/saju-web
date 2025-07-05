//import Image from "next/image";

type PillarType = 'Siju' | 'Ilju' | 'Wolju' | 'Yeonju';

interface Pillar {
  type: PillarType;
  label: string;
}

const pillars: Pillar[] = [
  { type: 'Siju', label: '시주' },
  { type: 'Ilju', label: '일주' },
  { type: 'Wolju', label: '월주' },
  { type: 'Yeonju', label: '연주' },
];

export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen text-center text-[#0a0a0a]">
      <main className="max-w-3xl w-full mx-auto py-16">
        <div id="todayGanziTitle" className="mb-12 text-4xl text-[#EED36C]">오늘의 간지</div>
        <ul className="grid grid-cols-4 gap-2 w-full text-xl">
          {pillars.map((pillar, idx) => {
            const index = idx + 1; // 시주→1, 일주→2, 월주→3, 연주→4
            return (
              <li id={`todayGanzi${pillar.type}`} key={pillar.type}>
                <div id="todayGanziLine" className="mb-1 text-[#EED36C]">{pillar.label}</div>

                <div id={`todayGanziWrapTop_${index}`} className="mb-2">
                  <div id={`todayGanziTop10sin_${index}`} className="mb-1 text-[#fafafa]">비견</div>
                  <div id={`todayGanziBox_${index}`} className="py-3 bg-white leading-none">
                    <p id={`todayGanziHanja_${index}`} className="text-7xl font-thin">甲</p>
                    <p id={`todayGanziHanguel_${index}`}>갑목</p>
                  </div>
                </div>

                <div id={`todayGanziWrapBt_${index}`}>
                  <div id={`todayGanziBox_${index}`} className="py-3 mb-1 bg-white leading-none">
                    <p id={`todayGanziHanja_${index}`} className="text-7xl font-medium">寅</p>
                    <p id={`todayGanziHanguel_${index}`}>인목</p>
                  </div>
                  <ul id={`todayGanziJijanggan_${index}`} className="mb-2 bg-white">
                    <li>
                      <b id={`todayGanziJijanggan_${index}_Ganzi`} className="mr-1">無</b>
                      <span id={`todayGanziJijanggan_${index}_10sin`}>(없음)</span>
                    </li>
                    <li>
                      <b id={`todayGanziJijanggan_${index}_Ganzi`} className="mr-1">병</b>
                      <span id={`todayGanziJijanggan_${index}_10sin`}>(식신)</span>
                    </li>
                    <li>
                      <b id={`todayGanziJijanggan_${index}_Ganzi`} className="mr-1">갑</b>
                      <span id={`todayGanziJijanggan_${index}_10sin`}>(비견)</span>
                    </li>
                  </ul>
                  <p id={`todayGanzi12WS_${index}`} className="text-[#fafafa]">건록</p>
                  <p id={`todayGanzi12SS_${index}`} className="text-[#fafafa]">월살</p>
                </div>
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}
