
import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { BookOpen, Video, Mic, Award, Calendar, Plus, Clock, Users } from 'lucide-react';
import { User, Language, View, UserRole } from '../types';
import { TRANSLATIONS, MOCK_LIVE_CLASSES } from '../constants';

interface DashboardProps {
  user: User;
  language: Language;
  setView: (view: View) => void;
}

const data = [
  { name: 'Tajweed', progress: 85 },
  { name: 'Hifz', progress: 60 },
  { name: 'Tafsir', progress: 40 },
  { name: 'Arabic', progress: 70 },
];

const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#8b5cf6'];

const Dashboard: React.FC<DashboardProps> = ({ user, language, setView }) => {
  const t = TRANSLATIONS[language];
  const isTeacher = user.role === UserRole.TEACHER || user.role === UserRole.ADMIN;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">{t.welcome}, {user.name}</h2>
          <p className="text-emerald-100 text-lg opacity-90">{t.subtitle}</p>
          {isTeacher && (
             <div className="mt-6">
                <button 
                  onClick={() => setView(View.LIVE_CLASS)}
                  className="bg-white text-emerald-800 px-6 py-2 rounded-full font-bold shadow-lg hover:bg-emerald-50 transition flex items-center"
                >
                  <Plus size={20} className="mr-2"/> {t.startClass}
                </button>
             </div>
          )}
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-y-1/4 translate-x-1/4">
          <Award size={200} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Quick Actions */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button 
            onClick={() => setView(View.LIVE_CLASS)}
            className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md hover:bg-emerald-50 transition border border-gray-100"
          >
            <div className="bg-red-100 p-3 rounded-full mb-3 text-red-600">
              <Video size={24} />
            </div>
            <span className="font-semibold text-gray-700">{t.liveClasses}</span>
          </button>

          <button 
            onClick={() => setView(View.AI_TUTOR)}
            className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md hover:bg-emerald-50 transition border border-gray-100"
          >
            <div className="bg-blue-100 p-3 rounded-full mb-3 text-blue-600">
              <Award size={24} />
            </div>
            <span className="font-semibold text-gray-700">{t.aiTutor}</span>
          </button>

          <button 
            onClick={() => setView(View.QURAN_READER)}
            className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md hover:bg-emerald-50 transition border border-gray-100"
          >
            <div className="bg-emerald-100 p-3 rounded-full mb-3 text-emerald-600">
              <BookOpen size={24} />
            </div>
            <span className="font-semibold text-gray-700">{t.quranLibrary}</span>
          </button>

          <button 
            onClick={() => setView(View.VOICE_CLUB)}
            className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md hover:bg-emerald-50 transition border border-gray-100"
          >
            <div className="bg-purple-100 p-3 rounded-full mb-3 text-purple-600">
              <Mic size={24} />
            </div>
            <span className="font-semibold text-gray-700">{t.voiceClub}</span>
          </button>
        </div>

        {/* Progress Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">{t.courseCompletion}</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 12}} />
                <YAxis hide />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="progress" radius={[4, 4, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Live Classes List */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Calendar className="mr-2 text-emerald-600" />
          {t.upcomingClasses}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_LIVE_CLASSES.map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-lg transition">
              <div className="h-32 bg-gray-200 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                <img src={`https://picsum.photos/seed/${course.id}/400/250`} alt={course.title} className="w-full h-full object-cover" />
                {course.status === 'LIVE' && (
                   <div className="absolute top-2 right-2 z-20 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded animate-pulse">
                     LIVE NOW
                   </div>
                )}
                {course.status === 'SCHEDULED' && (
                   <div className="absolute top-2 right-2 z-20 bg-black/60 backdrop-blur text-white text-xs font-bold px-2 py-1 rounded">
                     UPCOMING
                   </div>
                )}
                <div className="absolute bottom-2 left-3 z-20 text-white">
                   <h4 className="font-bold text-sm leading-tight">{course.title}</h4>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center text-xs text-gray-500 mb-2">
                   <Video size={12} className="mr-1"/> {course.topic}
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1"/>
                    <span>{course.status === 'LIVE' ? 'Started ' + course.startTime.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : course.startTime.toLocaleString([], {weekday: 'short', hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                  <div className="flex items-center">
                    <Users size={14} className="mr-1"/>
                    <span>{course.participants}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-2">
                     <img src={`https://picsum.photos/seed/${course.instructorId}/100`} className="w-6 h-6 rounded-full"/>
                     <span className="text-xs font-medium text-gray-700">{course.instructorName}</span>
                  </div>
                  <button 
                    onClick={() => setView(View.LIVE_CLASS)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-bold transition ${course.status === 'LIVE' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}
                  >
                    {course.status === 'LIVE' ? 'Join Live' : 'Register'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
