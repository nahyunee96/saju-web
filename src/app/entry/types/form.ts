// app/entry/types/form.ts

/** 양력 또는 음력 */
export type CalendarType = 'solar' | 'lunar';

/** 성별 */
export type Gender = 'male' | 'female';

/** 시간 기준 타입 */
export type TimeType = 'zashi' | 'yazashi' | 'insi';

/** 카테고리 옵션 (직접입력(custom) 포함) */
export type CategoryOption =
  | 'family'
  | 'partner'
  | 'friend'
  | 'work'
  | 'ect'
  | 'custom';

/**
 * EntryForm 컴포넌트가 넘겨주는 폼 값의 타입
 */
export interface EntryFormValues {
  name: string;
  calendarType: CalendarType;
  birthDate: string;       // "YYYY-MM-DD"
  birthTime: string;       // "HH:mm"
  birthPlace: string;      // 지도 클릭 결과 또는 텍스트
  gender: Gender;
  timeType: TimeType;
  category: string;        // 직접입력 시 custom 값
}
