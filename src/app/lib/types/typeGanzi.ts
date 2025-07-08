export type PillarType = 'Siju' | 'Ilju' | 'Wolju' | 'Yeonju';

export interface Stem {
  hanja: string;
  hanguel: string;
}

export interface Branch {
  hanja: string;
  hanguel: string;
}

export interface Jijanggan {
  chogi: string;
  joonggi: string;
  jeonggi: string;
}

export interface Pillar {
  stem: Stem;
  branch: Branch;
  jijanggan?: Jijanggan[];
}