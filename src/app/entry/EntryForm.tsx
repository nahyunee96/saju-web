'use client';
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Check } from 'lucide-react';

type CalendarType = 'solar' | 'lunar';
type Gender = 'male' | 'female';
type TimeType = 'zashi' | 'yazashi' | 'insi';
type Category = 'family' | 'friend' | 'work' | string;

interface EntryFormProps {
  onSubmit: (data: {
    name: string;
    calendarType: CalendarType;
    birthDate: string;
    birthTime: string;
    birthPlace: string;
    gender: Gender;
    timeType: TimeType;
    category: Category;
  }) => void;
}

export default function EntryForm({ onSubmit }: EntryFormProps) {
  const [calendarType, setCalendarType] = React.useState<CalendarType>('solar');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get('name') as string,
      calendarType,
      birthDate: form.get('birthDate') as string,
      birthTime: form.get('birthTime') as string,
      birthPlace: form.get('birthPlace') as string,
      gender: form.get('gender') as Gender,
      timeType: form.get('timeType') as TimeType,
      category: form.get('category') as Category,
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 이름 & 카테고리 */}
      <div className="flex">
        <div className="basis-[50%]">
          <label htmlFor="mjname" className="block text-sm font-medium">이름</label>
          <input
            id="mjname"
            name="mjname"
            type="text"
            required
            className="mt-1 w-full border-b outline-none focus:outline-none focus:ring-0 px-2 py-1 h-8 text-sm"
            placeholder="이름"
          />
        </div>
        
        <div className="basis-[50%]">
          <label htmlFor="category" className="block text-sm font-medium">카테고리</label>
          <select
            id="category"
            name="category"
            required
            className="mt-1 w-full border-b outline-none px-2 py-1 h-8 text-sm"
          >
            <option value="family">가족</option>
            <option value="partner">연인/배우자</option>
            <option value="friend">친구</option>
            <option value="work">직장</option>
            <option value="ect">기타</option>
            <option value="직접입력">직접입력</option>
          </select>
          <div className="flex items-end hidden">
            <input 
              type="text" 
              name="직접입력란"
              required
              placeholder="직접입력"
              className="mt-1 border-b outline-none px-2 py-1 h-8 w-[calc(100%-30px)] text-sm"
            />
            <button 
              className="flex items-center justify-center w-[30px] bg-[#EED36C] text-white text-sm h-8 rounded font-medium" 
              id="resetSelectBtn"
            >
              <RefreshCw size="20" />
            </button>
          </div>
        </div>
      </div>

      {/* 생년월실 & 태어난시간 & 양음력 선택 */}
      <div>
        <span className="block text-sm font-medium">생년월일시</span>
        <div className="flex mt-1">
          <div className="basis-[30%]">
            <input
              id="birthDate"
              name="birthDate"
              type="text"
              required
              className="mt-1 w-full border-b outline-none px-2 py-1 text-sm"
              placeholder="생년월일"
            />
          </div>
          <div className="basis-[25%]">
            <input
              id="birthTime"
              name="birthTime"
              type="text"
              required
              className="mt-1 w-full border-b outline-none px-2 py-1 text-sm"
              placeholder="생시"
            />
          </div>
          <div className="flex gap-2 basis-[35%] md:w-auto justify-start items-end ml-3 text-sm">
            {/* 양력 옵션 */}
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="calendarType"
                value="solar"
                checked={calendarType === 'solar'}
                onChange={() => setCalendarType('solar')}
                className="sr-only"
              />
              {calendarType === 'solar' && <Check className="text-[#EED36C]" size={16} />}
              <span className={`ml-1 ${calendarType === 'solar' ? 'text-[#EED36C]' : ''}`}>양력</span>
            </label>
            </div>
            {/* 음력 옵션 */}
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="calendarType"
                  value="lunar"
                  checked={calendarType === 'lunar'}
                  onChange={() => setCalendarType('lunar')}
                  className="sr-only"
                />
                {calendarType === 'lunar' && <Check className="text-[#EED36C]" size={16} />}
                <span className={`ml-1 ${calendarType === 'lunar' ? 'text-[#EED36C]' : ''}`}>음력</span>
              </label>
            </div>
          </div>
        </div>
      </div>


      {/* 시간타입 & 성별 */}
      <div className="flex">
        <div className="basis-[50%]">
          <label htmlFor="timeType" className="block text-sm font-medium">시간 타입</label>
          <div className="flex items-end gap-2 h-8 md:gap-4 mt- text-sm">
            <label className="flex items-center">
              <input type="radio" name="timeType" value="zashi" id="zashi" className="hidden"/>
              <label htmlFor="zashi" className="flex items-center">
                <b><Check size="16" className="hidden"/></b>자시
              </label>
            </label>
            <label className="flex items-center">
              <input type="radio" name="timeType" value="yazashi" id="yazashi" className="hidden"/> 
              <label htmlFor="yazashi" className="flex items-center">
                <b><Check size="16" className="hidden"/></b>야자시
              </label>
            </label>
            <label className="flex items-center">
              <input type="radio" name="timeType" value="insi" id="insi" className="hidden"/> 
              <label htmlFor="insi" className="flex items-center">
                <b><Check size="16"/></b>인시
              </label>
            </label>
          </div>
        </div>

        <div className="basis-[50%]">
          <span className="block text-sm font-medium">성별</span>
          <div className="flex items-end gap-2 h-8 md:gap-4 text-sm">
            <label className="flex items-center">
              <input type="radio" name="gender" value="male" id="male" className="hidden"/>
              <label htmlFor="male" className="flex items-center"><b><Check size="16"/></b>남성</label>
            </label>
            <label className="flex items-center">
              <input type="radio" name="gender" value="female" id="female" className="hidden"/> 
              <label htmlFor="female" className="flex items-center"><b><Check size="16" className="hidden"/></b>여성</label>
            </label>
          </div>
        </div>
      </div>

      {/* 지역 & 메모 */}
      <div className="flex">
        <div className="basis-[50%]">
          <label htmlFor="birthPlace" className="block text-sm font-medium">출생지 입력</label>
          <input
            id="birthPlace"
            name="birthPlace"
            type="text"
            placeholder="지역입력"
            required
            className="mt-1 w-full border-b outline-none px-2 py-1 text-sm h-8"
          /> 
        </div>
        <div className="basis-[50%]">
          <span className="block text-sm font-medium">기타명식메모</span>
          <input 
            type="text" 
            name="memo"
            placeholder="메모입력"
            required
            className="mt-1 w-full border-b outline-none px-2 py-1 text-sm h-8"
          />
        </div>
      </div>

      {/* 저장 버튼 */}
      <button type="submit" className="w-full bg-[#EED36C] text-black py-2 rounded font-medium">
        저장
      </button>
    </form>
  );
}
