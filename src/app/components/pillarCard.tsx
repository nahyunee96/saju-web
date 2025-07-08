import React from 'react';
import { isYangEntity, getHiddenStems, getBackgroundClass } from '../lib/ganziUtils';
import type { Pillar } from '../lib/types/typeGanzi';
import type { Jijanggan } from '../lib/types/typeGanzi';

interface Props {
  label: string;            // '시주', '일주' 등
  data: Pillar;             // { stem, branch, jijanggan? }
  index: number;            // 1~4, id 치환용
}

export default function PillarCard({ label, data, index }: Props) {
  const { stem, branch } = data;
  // 지장간 배열
  const hidden: Jijanggan[] = getHiddenStems(branch);

  return (
    <li id={`todayGanzi${label}`}>      
      <div id="todayGanziLine" className="mb-1 text-[#EED36C] text-[3.2vw] md:text-xl">
        {label}
      </div>

      {/* 상단: 천간 */}
      <div id={`todayGanziWrapTop_${index}`} className="mb-2">
        <div
          id={`todayGanziBox_${index}`}
          className={`py-3 leading-none ${getBackgroundClass(stem)} text-[#f0f0f0]`}
        >
          <p
            id={`todayGanziHanja_${index}`}
            className={`text-[10.2vw] md:text-7xl ${isYangEntity(stem) ? 'font-medium' : 'font-thin'}`}
          >
            {stem.hanja}
          </p>
          <p id={`todayGanziHanguel_${index}`} className="text-[3.2vw] md:text-xl">
            {stem.hanguel}
          </p>
        </div>
      </div>

      {/* 하단: 지지 & 지장간 */}
      <div id={`todayGanziWrapBt_${index}`}>
        <div
          id={`todayGanziBox_${index}`}
          className={`py-3 mb-1 leading-none ${getBackgroundClass(branch)} text-[#f0f0f0]`}
        >
          <p
            id={`todayGanziHanja_${index}`}
            className={`text-[10.2vw] md:text-7xl ${isYangEntity(branch) ? 'font-medium' : 'font-thin'}`}
          >
            {branch.hanja}
          </p>
          <p id={`todayGanziHanguel_${index}`} className="text-[3.2vw] md:text-xl">
            {branch.hanguel}
          </p>
        </div>
        <ul id={`todayGanziJijanggan_${index}`} className="mb-2 bg-white">
          {hidden.map((hs, i) => (
            <li key={i}>
              <ul className="flex justify-center items-center gap-1 md:gap-2 py-1 text-[2.8vw] md:text-base">
                <li>{hs.chogi}</li>
                <li>{hs.joonggi}</li>
                <li>{hs.jeonggi}</li>
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}
