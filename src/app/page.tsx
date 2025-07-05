//import Image from "next/image";
import TodayGanziWidget from './components/TodayGanziWidget';

export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen text-center text-[#0a0a0a]">
      <main className="max-w-3xl w-full mx-auto py-16 px-2 md:px-4">
        <div id="todayGanziTitle" className="mb-8 md:mb-12 text-[4.8vw] md:text-4xl text-[#EED36C]">
          오늘의 간지
        </div>
        {/* data prop 없이 그냥 렌더링 */}
        <TodayGanziWidget />
      </main>
    </div>
  );
}
