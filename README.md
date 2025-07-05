/app
 ├─ page.tsx                    ← 앱 진입점: 전체 레이아웃·네비게이션
 ├─ todayGanzi/
 │   ├─ page.tsx                ← “오늘의 간지” 라우트
 │   ├─ TodayGanziList.tsx      ← 렌더링 전용 컴포넌트
 │   └─ useTodayGanzi.ts        ← 시간·타임존 보정 훅
 ├─ entry/                      ← “새로운 명식 입력” 섹션
 │   ├─ page.tsx                ← 입력폼 + 결과 탭 전체 레이아웃
 │   ├─ components/
 │   │   ├─ EntryForm.tsx       ← 이름·생일·시간·지역 등 폼
 │   │   ├─ PillarResults.tsx   ← 원국·대운·월운·일운 결과 UI
 │   │   └─ FortuneTabs.tsx      ← 묘운력·세운·월운·일운 탭
 │   └─ useEntryData.ts         ← 계산용 훅 (입력 → Pillar[])
 ├─ compatibility/
 │   └─ page.tsx                ← 궁합모드: 두 명식 비교 뷰
 ├─ myoun/                      ← 묘운력 전용 라우트
 │   └─ page.tsx
 ├─ settings/
 │   └─ page.tsx                ← 십이신살·운성 토글·표시 설정
 └─ sidebar/                    
     ├─ SavedList.tsx           ← 저장 목록 + 정렬·필터 UI
     └─ useSavedList.ts         ← 로컬스토리지 CRUD + 정렬 훅

/components                       ← 프로젝트 전체에서 쓰는 공통 UI
 ├─ PillarCard.tsx                ← 간지 카드
 ├─ Tab.tsx                       ← 탭 네비게이션
 ├─ Input.tsx                     ← 공통 인풋 컴포넌트
 └─ Sidebar.tsx                   ← 사이드바 레이아웃

/hooks                            ← 비즈니스 로직 훅
 ├─ useTodayGanzi.ts
 ├─ useEntryData.ts
 ├─ useMyoun.ts
 ├─ useCompatibility.ts
 ├─ useSettings.ts
 └─ useSavedList.ts

/lib                              ← 순수 계산 함수
 ├─ ganzi.ts                      ← 원국·대운·세운·월운·일운 계산 로직
 ├─ myoun.ts                      ← 묘운력 계산 로직
 ├─ compatibility.ts              ← 두 명식 비교 로직
 └─ time.ts                       ← 썸머타임·경도·타임존 보정 함수

/services                         ← 외부 API 혹은 storage 추상화
 ├─ storage.ts                    ← localStorage 래퍼
 └─ api.ts                        ← (향후) 서버 연동용 fetcher

/types  
 ├─ ganzi.d.ts                    ← Pillar, Stem, Branch, Category 등
 ├─ entry.d.ts                    ← BirthRecord, Gender, CalendarType…
 └─ settings.d.ts                 ← Settings 옵션 타입

/utils                            ← 공통 유틸 함수
 ├─ formatDate.ts
 └─ sortFilter.ts