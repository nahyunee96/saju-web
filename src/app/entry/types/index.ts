// app/entry/types/index.ts
import type {
  CalendarType,
  Gender,
  TimeType,
} from './form';

/**
 * API로 보낼 최종 데이터 타입
 */
export interface EntryData {
  name: string;
  calendarType: CalendarType;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  gender: Gender;
  timeType: TimeType;
  category: string;
  isTimeUnknown: boolean;
  isPlaceUnknown: boolean;
}
