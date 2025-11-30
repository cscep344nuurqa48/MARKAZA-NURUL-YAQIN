
import React from 'react';
import { Menu, Globe, User as UserIcon, LogOut, IdCard } from 'lucide-react';
import { Language, User, UserRole, View } from '../types';
import { TRANSLATIONS } from '../constants';

interface NavbarProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
  setView: (view: View) => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  language, 
  setLanguage, 
  user, 
  onLogin, 
  onLogout,
  setView
}) => {
  const t = TRANSLATIONS[language];

  return (
    <nav className="bg-emerald-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo Section */}
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => setView(user ? View.DASHBOARD : View.LANDING)}
          >
            <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center mr-3 border-2 border-gold-500">
              <span className="text-emerald-800 font-bold text-2xl font-arabic">ن</span>
            </div>
            <div className="hidden md:block">
              <h1 className="font-bold text-lg leading-tight">Nurul Yaqin</h1>
              <p className="text-xs text-emerald-200">Online Quran Academy</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            
            {/* Language Switcher */}
            <div className="relative group">
              <button className="flex items-center space-x-1 hover:text-gold-400 transition">
                <Globe size={18} />
                <span className="uppercase font-medium">{language}</span>
              </button>
              <div className="absolute right-0 mt-2 w-32 bg-white text-gray-800 rounded-md shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                <button onClick={() => setLanguage('en')} className="block w-full text-left px-4 py-2 hover:bg-emerald-50 text-sm">English</button>
                <button onClick={() => setLanguage('ar')} className="block w-full text-left px-4 py-2 hover:bg-emerald-50 text-sm font-arabic">العربية</button>
                <button onClick={() => setLanguage('om')} className="block w-full text-left px-4 py-2 hover:bg-emerald-50 text-sm">Afaan Oromo</button>
              </div>
            </div>

            {/* User Auth */}
            {user ? (
              <div className="flex items-center space-x-4">
                 <button 
                  onClick={() => setView(View.STUDENT_SYSTEM)}
                  className="hidden md:flex items-center space-x-2 text-emerald-100 hover:text-white transition"
                  title={t.studentSystem}
                >
                  <IdCard size={20} />
                  <span className="text-sm font-medium hidden lg:inline">{t.studentSystem}</span>
                </button>
                <button 
                  onClick={() => setView(View.DASHBOARD)}
                  className="hidden md:flex items-center space-x-2 bg-emerald-800 hover:bg-emerald-700 px-4 py-2 rounded-full transition"
                >
                  <img src={user.avatar} alt="User" className="h-6 w-6 rounded-full" />
                  <span className="text-sm font-medium">{user.name}</span>
                </button>
                <button onClick={onLogout} className="text-emerald-200 hover:text-white">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setView(View.LOGIN)}
                className="bg-gold-500 hover:bg-gold-600 text-white px-6 py-2 rounded-full font-medium transition shadow-md"
              >
                {t.login}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
