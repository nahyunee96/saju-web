// app/entry/EntryForm.tsx
'use client';
import React, { useState } from 'react';
import { RefreshCw, Check } from 'lucide-react';
//import MapPicker from '../components/MapPicker';
import dynamic from 'next/dynamic';

// ssr: false → 서버에는 로드되지 않고, 클라이언트에서만 import
const MapPicker = dynamic(
  () => import('../components/MapPicker'),
  { ssr: false }
);
import type {
  EntryFormValues,
  CalendarType,
  Gender,
  TimeType,
  CategoryOption,
} from './types/form';

export interface EntryFormProps {
  onSubmit: (data: EntryFormValues) => void;
}

export default function EntryForm({ onSubmit }: EntryFormProps) {
  const [name, setName] = useState('');
  const [calendarType] =
    useState<CalendarType>('solar');

  // 날짜를 숫자로만 입력하도록 분리
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');

  const [birthTime, setBirthTime] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [gender, setGender] = useState<Gender>('male');
  const [timeType, setTimeType] =
    useState<TimeType>('zashi');
  const [category, setCategory] =
    useState<CategoryOption>('family');
  const [customCategory, setCustomCategory] = useState('');

  const formatDate = () => {
    const mm = month.padStart(2, '0');
    const dd = day.padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      calendarType,
      birthDate: formatDate(),
      birthTime,
      birthPlace,
      gender,
      timeType,
      category:
        category === 'custom'
          ? customCategory.trim()
          : category,
    });
  };

  const resetCategory = () => {
    setCategory('family');
    setCustomCategory('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2">
        {/* 이름 */}
        <div>
          <label className="block text-sm font-medium">
            이름
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 w-full border-b px-2 py-1 text-sm outline-none"
            placeholder="이름"
          />
        </div>

        {/* 카테고리 */}
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <label className="block text-sm font-medium">
              카테고리
            </label>
            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as CategoryOption)
              }
              required
              className="w-full border-b px-2 py-1 text-sm outline-none h-8"
            >
              <option value="family">가족</option>
              <option value="partner">연인/배우자</option>
              <option value="friend">친구</option>
              <option value="work">직장</option>
              <option value="ect">기타</option>
              <option value="custom">직접입력</option>
            </select>
          </div>
          {category === 'custom' && (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customCategory}
                onChange={(e) =>
                  setCustomCategory(e.target.value)
                }
                required
                placeholder="직접입력"
                className="mt-1 border-b px-2 py-1 text-sm outline-none h-8"
              />
              <button
                type="button"
                onClick={resetCategory}
                className="w-8 h-8 bg-[#DDC480] flex items-center justify-center rounded"
              >
                <RefreshCw size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 생년월일 (숫자 입력) */}
      <div>
        <label className="block text-sm font-medium">
          생년월일 + 시간
        </label>
        <div className="flex gap-2 mt-1">
          <input
            type="tel"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="YYYY"
            required
            className="w-1/4 border-b px-2 py-1 text-sm outline-none"
          />
          <input
            type="tel"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            placeholder="MM"
            required
            className="w-1/4 border-b px-2 py-1 text-sm outline-none"
          />
          <input
            type="tel"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            placeholder="DD"
            required
            className="w-1/4 border-b px-2 py-1 text-sm outline-none"
          />
          <input
            type="tel"
            value={birthTime}
            onChange={(e) => setBirthTime(e.target.value)}
            placeholder="HHMM"
            required
            className="w-1/4 border-b px-2 py-1 text-sm outline-none"
          />
        </div>
      </div>

      {/* 출생지 (지도 선택) */}
      <div>
        <label className="block text-sm font-medium mb-1">
          출생지 선택
        </label>
        <MapPicker
          onSelectPosition={(lat, lng) =>
            setBirthPlace(`${lat},${lng}`)
          }
          className="w-full h-[160px] md:h-[200px]"
        />
        <p className="mt-1 text-xs text-gray-500">
          선택된 좌표: {birthPlace}
        </p>
      </div>

      {/* 시간 타입 & 성별 */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium">
            시간 타입
          </label>
          <div className="flex gap-3 mt-1 text-sm">
            {(['zashi', 'yazashi', 'insi'] as TimeType[]).map((t) => {
              const isChecked = timeType === t;
              const labelText = t === 'zashi' ? '자시' : t === 'yazashi' ? '야자시' : '인시';
              return (
                <label key={t} className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="timeType"
                    value={t}
                    checked={isChecked}
                    onChange={() => setTimeType(t)}
                    className="hidden"
                  />
                  {isChecked && <Check className="text-[#DDC480]" size={16} />}
                  <span className={isChecked ? 'text-[#DDC480]' : ''}>
                    {labelText}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium">
            성별
          </label>
          <div className="flex gap-3 mt-1 text-sm">
            {(['male', 'female'] as Gender[]).map((g) => {
              const isChecked = gender === g;
              const labelText = g === 'male' ? '남성' : '여성';
              return (
                <label key={g} className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={isChecked}
                    onChange={() => setGender(g)}
                    className="hidden"
                  />
                  {isChecked && <Check className="text-[#DDC480]" size={16} />}
                  <span className={isChecked ? 'text-[#DDC480]' : ''}>
                    {labelText}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-[#DDC480] text-black py-2 rounded font-medium"
      >
        저장
      </button>
    </form>
  );
}
