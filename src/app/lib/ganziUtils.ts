// lib/ganziUtils.ts
import type { Branch, Jijanggan } from './types/ganzi';

/**
 * 음양 구분 (간지의 음양에 따라 폰트 가중치 결정)
 * 양: 甲, 丙, 戊, 庚, 壬, 子, 寅, 辰, 午, 申, 戌
 */
export function isYangEntity(entity: { hanja: string }): boolean {
  const yangHanja = ['甲', '丙', '戊', '庚', '壬', '子', '寅', '辰', '午', '申', '戌'];
  return yangHanja.includes(entity.hanja);
}

/**
 * 지장간(藏干) 계산
 * 각 지지별 천간을 반환하는 뼈대 로직
 */
export function getHiddenStems(branch: Branch): Jijanggan[] {
  switch (branch.hanja) {
    case '子': return [{ chogi: '(-)', joonggi: '(-)', jeonggi: '계' }];
    case '丑': return [{ chogi: '계', joonggi: '신', jeonggi: '기' }];
    case '寅': return [{ chogi: '(-)', joonggi: '병', jeonggi: '갑' }];
    case '卯': return [{ chogi: '(-)', joonggi: '(-)', jeonggi: '을' }];
    case '辰': return [{ chogi: '을', joonggi: '계', jeonggi: '무' }];
    case '巳': return [{ chogi: '(-)', joonggi: '경', jeonggi: '병' }];
    case '午': return [{ chogi: '(-)', joonggi: '(-)', jeonggi: '정' }];
    case '未': return [{ chogi: '정', joonggi: '을', jeonggi: '기' }];
    case '申': return [{ chogi: '(-)', joonggi: '임', jeonggi: '경' }];
    case '酉': return [{ chogi: '(-)', joonggi: '(-)', jeonggi: '신' }];
    case '戌': return [{ chogi: '신', joonggi: '정', jeonggi: '무' }];
    case '亥': return [{ chogi: '(-)', joonggi: '갑', jeonggi: '임' }];
    default:    return [];
  }
}

/**
 * 배경색 클래스 결정
 * 각 천간/지지별 Tailwind color 매핑
 */
export function getBackgroundClass(entity: { hanja: string }): string {
  const green  = ['甲', '乙', '寅', '卯'];
  const red    = ['丙', '丁', '巳', '午'];
  const yellow = ['戊', '己', '丑', '辰', '未', '戌'];
  const gray   = ['庚', '辛', '申', '酉'];
  const black  = ['壬', '癸', '子', '亥'];

  if (green.includes(entity.hanja))  return 'bg-[#097711]';
  if (red.includes(entity.hanja))    return 'bg-[#DC2323]';
  if (yellow.includes(entity.hanja)) return 'bg-[#E4D01B]';
  if (gray.includes(entity.hanja))   return 'bg-[#b0b0b0]';
  if (black.includes(entity.hanja))  return 'bg-[#353535]';
  return '';
}