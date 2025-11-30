
import React, { useState } from 'react';
import { User, Lock, Mail, ArrowRight, Loader2, CheckCircle, Shield, Mic, Headphones, GraduationCap, School } from 'lucide-react';
import { backend } from '../services/backend';
import { UserRole } from '../types';

interface AuthPageProps {
  onSuccess: (user: any) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.STUDENT);

  // Role Descriptions for Signup UI
  const ROLES = [
    { 
      id: UserRole.STUDENT, 
      label: 'Student / Listener', 
      icon: <Headphones size={20}/>, 
      desc: 'Join classes, listen in voice rooms, and learn Quran.' 
    },
    { 
      id: UserRole.TEACHER, 
      label: 'Teacher / Moderator', 
      icon: <School size={20}/>, 
      desc: 'Host classes, moderate rooms, and manage students.' 
    },
    { 
      id: UserRole.ADMIN, 
      label: 'Academy Owner / Admin', 
      icon: <Shield size={20}/>, 
      desc: 'Full system access, manage users and courses.' 
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        const user = await backend.auth.login(email, password);
        onSuccess(user);
      } else {
        if (!username) throw new Error("Username is required");
        const user = await backend.auth.signup({
          email,
          password,
          username,
          role: selectedRole
        });
        onSuccess(user);
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="bg-emerald-900 p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-gold-500 shadow-lg">
               <span className="text-emerald-800 font-bold text-3xl font-arabic">ن</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-emerald-200 text-sm">
              {isLogin ? 'Login to continue your journey' : 'Join Nurul Yaqin Academy Today'}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="p-8">
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm mb-6 flex items-start">
              <span className="font-bold mr-2">Error:</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition outline-none"
                    placeholder="Choose a username"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition outline-none"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Role Selection (Signup Only) */}
            {!isLogin && (
              <div className="mt-4">
                <label className="block text-sm font-bold text-gray-700 mb-3">Select Your Role</label>
                <div className="space-y-2">
                  {ROLES.map((role) => (
                    <div 
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      className={`p-3 rounded-xl border-2 cursor-pointer flex items-center transition ${selectedRole === role.id ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 hover:border-gray-200'}`}
                    >
                      <div className={`p-2 rounded-full mr-3 ${selectedRole === role.id ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                        {role.icon}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-bold ${selectedRole === role.id ? 'text-emerald-900' : 'text-gray-700'}`}>{role.label}</p>
                        <p className="text-xs text-gray-500">{role.desc}</p>
                      </div>
                      {selectedRole === role.id && <CheckCircle size={18} className="text-emerald-500"/>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gold-500 hover:bg-gold-600 text-white font-bold py-4 rounded-xl shadow-lg transition transform active:scale-95 flex items-center justify-center mt-6"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : (
                <>
                  {isLogin ? 'Login to Account' : 'Create Account'} <ArrowRight size={18} className="ml-2"/>
                </>
              )}
            </button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button 
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                className="ml-2 font-bold text-emerald-600 hover:underline"
              >
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
             <p className="text-xs text-gray-400">
                Demo Accounts: <br/>
                admin@academy.com / password<br/>
                student@academy.com / password
             </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AuthPage;
