
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import LiveClassroom from './components/Features/LiveClassroom';
import AITutor from './components/Features/AITutor';
import QuranReader from './components/Features/QuranReader';
import VoiceClub from './components/Features/VoiceClub';
import StudentSystem from './components/Features/StudentSystem';
import AuthPage from './components/AuthPage';
import { Language, User, UserRole, View } from './types';
import { TRANSLATIONS } from './constants';
import { backend } from './services/backend';
import { ArrowRight, Star, Shield, Smartphone, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('en');
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>(View.LANDING);
  const [isLoading, setIsLoading] = useState(true);

  const t = TRANSLATIONS[language];

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      const currentUser = await backend.auth.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setCurrentView(View.DASHBOARD);
      }
      setIsLoading(false);
    };
    checkSession();
  }, []);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentView(View.DASHBOARD);
  };

  const handleLogout = async () => {
    setIsLoading(true);
    await backend.auth.logout();
    setUser(null);
    setCurrentView(View.LANDING);
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-900">
        <div className="text-center text-white">
          <Loader2 size={48} className="animate-spin mb-4 mx-auto text-gold-500" />
          <p className="text-xl font-arabic">Loading Nurul Yaqin Academy...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (currentView) {
      case View.LOGIN:
        return <AuthPage onSuccess={handleLoginSuccess} />;
      case View.DASHBOARD:
        return user ? <Dashboard user={user} language={language} setView={setCurrentView} /> : <LandingPage />;
      case View.LIVE_CLASS:
        return <LiveClassroom />;
      case View.AI_TUTOR:
        return <AITutor language={language} />;
      case View.QURAN_READER:
        return <QuranReader />;
      case View.VOICE_CLUB:
        return <VoiceClub user={user} />;
      case View.STUDENT_SYSTEM:
        return <StudentSystem user={user} />;
      default:
        return <LandingPage />;
    }
  };

  const LandingPage = () => (
    <div className="bg-white">
      {/* Hero */}
      <div className="relative overflow-hidden bg-emerald-900 text-white">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 relative z-10">
          <div className="md:w-2/3">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 font-arabic leading-tight">
              {t.title}
            </h1>
            <p className="text-xl md:text-2xl text-emerald-100 mb-10 font-light">
              {t.subtitle}
            </p>
            <button 
              onClick={() => setCurrentView(View.LOGIN)}
              className="bg-gold-500 hover:bg-gold-600 text-white text-lg font-semibold px-8 py-4 rounded-full transition shadow-lg flex items-center"
            >
              {t.cta} <ArrowRight className="ml-2" />
            </button>
            <p className="mt-4 text-sm text-emerald-200 opacity-80">* Join our global community today</p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">{t.features}</h2>
          <div className="w-20 h-1 bg-emerald-500 mx-auto mt-4 rounded-full"></div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-10">
          {[
            { icon: <Star className="text-gold-500" size={32} />, title: t.liveClasses, desc: "Interactive HD video sessions with certified scholars." },
            { icon: <Smartphone className="text-blue-500" size={32} />, title: t.aiTutor, desc: "Instant feedback on Tajweed rules powered by AI." },
            { icon: <Shield className="text-emerald-500" size={32} />, title: t.quranLibrary, desc: "Comprehensive digital library with audio and tafsir." }
          ].map((feature, i) => (
            <div key={i} className="bg-slate-50 p-8 rounded-2xl hover:shadow-xl transition duration-300 border border-slate-100">
              <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen flex flex-col ${language === 'ar' ? 'font-arabic' : 'font-sans'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar 
        language={language} 
        setLanguage={setLanguage} 
        user={user}
        onLogin={() => setCurrentView(View.LOGIN)}
        onLogout={handleLogout}
        setView={setCurrentView}
      />
      <main className="flex-grow bg-slate-50">
        {renderContent()}
      </main>
      <footer className="bg-gray-900 text-gray-400 py-8 text-center border-t border-gray-800">
        <p>&copy; 2024 Nurul Yaqin Online Quran Academy. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
