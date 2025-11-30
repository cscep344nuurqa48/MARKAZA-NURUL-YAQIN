import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Book } from 'lucide-react';
import { SURAHS } from '../../constants';

const QuranReader: React.FC = () => {
  const [currentSurah, setCurrentSurah] = useState(SURAHS[0]);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold font-arabic text-emerald-900">{currentSurah.name}</h2>
        <div className="flex space-x-2">
          <select 
            className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={currentSurah.number}
            onChange={(e) => {
              const surah = SURAHS.find(s => s.number === parseInt(e.target.value));
              if (surah) setCurrentSurah(surah);
            }}
          >
            {SURAHS.map(s => (
              <option key={s.number} value={s.number}>{s.number}. {s.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-amber-50 rounded-lg shadow-inner border border-amber-100 p-8 flex-1 overflow-y-auto text-center space-y-8 relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" style={{
          backgroundImage: 'url("https://www.transparenttextures.com/patterns/arabesque.png")'
        }}></div>
        
        <div className="font-arabic text-3xl mb-12 text-emerald-900">
          بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </div>

        {Array.from({ length: Math.min(5, currentSurah.ayahs) }).map((_, i) => (
          <div key={i} className="relative z-10 border-b border-amber-200 pb-8 last:border-0">
            <p className="font-arabic text-4xl leading-[2.5] text-gray-800 mb-4 dir-rtl" dir="rtl">
              {i === 0 ? "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ" : "ٱلرَّحْمَٰنِ ٱلرَّحِيمِ"} 
              <span className="inline-flex items-center justify-center w-10 h-10 border-2 border-emerald-600 rounded-full text-lg mx-2 text-emerald-700 font-sans number-icon">
                {i + 1}
              </span>
            </p>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto italic">
              {i === 0 ? "[All] praise is [due] to Allah, Lord of the worlds" : "The Entirely Merciful, the Especially Merciful"}
            </p>
          </div>
        ))}

        <button className="px-6 py-2 bg-emerald-100 text-emerald-700 rounded-full hover:bg-emerald-200 transition font-medium">
          Load More Ayahs
        </button>
      </div>

      <div className="flex justify-between mt-6">
        <button className="flex items-center text-gray-600 hover:text-emerald-700">
          <ChevronLeft className="mr-2" /> Previous Surah
        </button>
        <button className="flex items-center text-gray-600 hover:text-emerald-700">
          Next Surah <ChevronRight className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default QuranReader;