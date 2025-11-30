
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { Language } from '../../types';
import { generateAIResponse } from '../../services/geminiService';
import { TRANSLATIONS } from '../../constants';

interface AITutorProps {
  language: Language;
}

interface AIChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

const AITutor: React.FC<AITutorProps> = ({ language }) => {
  const t = TRANSLATIONS[language];
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      role: 'model',
      text: language === 'en' 
        ? "Assalamu Alaikum! I am your AI Tajweed Assistant. How can I help you understand the Quran today?" 
        : language === 'ar' 
          ? "السلام عليكم! أنا مساعد التجويد الذكي. كيف يمكنني مساعدتك في فهم القرآن اليوم؟" 
          : "Assalaamu Aleykum! Ani gargaaraa Tajwiidaa AI keessani. Har'a akkamitti isin gargaaruu danda'a?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: AIChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const aiText = await generateAIResponse(input, language);
    
    setMessages(prev => [...prev, {
      role: 'model',
      text: aiText,
      timestamp: new Date()
    }]);
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 h-[calc(100vh-6rem)] flex flex-col">
      <div className="bg-white rounded-t-2xl shadow-sm border-b p-4 flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center text-white">
          <Bot size={24} />
        </div>
        <div>
          <h2 className="font-bold text-gray-800">{t.aiTutor}</h2>
          <p className="text-xs text-emerald-600">Powered by Gemini 2.5</p>
        </div>
      </div>

      <div className="flex-1 bg-gray-50 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'} space-x-3`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-emerald-600 text-white' : 'bg-white border text-emerald-600'}`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-4 rounded-2xl shadow-sm ${msg.role === 'user' ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none'}`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                <span className={`text-[10px] block mt-2 opacity-70 ${msg.role === 'user' ? 'text-emerald-100' : 'text-gray-400'}`}>
                  {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center space-x-2">
              <Loader2 className="animate-spin text-emerald-600" size={16} />
              <span className="text-sm text-gray-500">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white p-4 rounded-b-2xl shadow-lg border-t">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t.typeMessage}
            className="flex-1 bg-gray-100 border-0 rounded-full px-6 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            disabled={isLoading}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-emerald-600 text-white p-3 rounded-full hover:bg-emerald-700 disabled:opacity-50 transition shadow-md"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AITutor;
