
import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, Users, Hand, 
  Share, Monitor, BookOpen, Settings, MoreVertical, X, Check, Search,
  Download, FileText, LayoutGrid, Maximize, Send
} from 'lucide-react';
import { MOCK_LIVE_CLASSES, SURAHS } from '../../constants';
import { LiveClass, ClassParticipant, UserRole } from '../../types';

// --- MOCK DATA ---
const MOCK_PARTICIPANTS: ClassParticipant[] = [
  { id: '1', name: 'Student 1', role: 'STUDENT', isMuted: true, isVideoOn: true, isHandRaised: false, avatar: 'https://picsum.photos/seed/s1/100' },
  { id: '2', name: 'Student 2', role: 'STUDENT', isMuted: true, isVideoOn: false, isHandRaised: true, avatar: 'https://picsum.photos/seed/s2/100' },
  { id: '3', name: 'Student 3', role: 'STUDENT', isMuted: false, isVideoOn: true, isHandRaised: false, avatar: 'https://picsum.photos/seed/s3/100' },
  { id: '4', name: 'Student 4', role: 'STUDENT', isMuted: true, isVideoOn: true, isHandRaised: false, avatar: 'https://picsum.photos/seed/s4/100' },
];

const CHAT_MESSAGES = [
  { id: 1, sender: 'Student 1', text: 'Assalamu Alaikum Sheikh', time: '10:00' },
  { id: 2, sender: 'Sheikh Ahmed', text: 'Wa Alaikum Assalam, we will start shortly.', time: '10:01' },
];

// --- COMPONENT ---
const LiveClassroom: React.FC = () => {
  // State: Lobby vs Active
  const [activeClass, setActiveClass] = useState<LiveClass | null>(null);
  const [isLobby, setIsLobby] = useState(true);
  
  // State: User Settings (Simulated)
  const [myMicOn, setMyMicOn] = useState(false);
  const [myCamOn, setMyCamOn] = useState(true);
  const [userRole, setUserRole] = useState<'TEACHER' | 'STUDENT'>('TEACHER'); // Toggle for demo

  // State: Room
  const [participants, setParticipants] = useState<ClassParticipant[]>(MOCK_PARTICIPANTS);
  const [messages, setMessages] = useState(CHAT_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const [mainView, setMainView] = useState<'VIDEO' | 'SCREEN' | 'QURAN'>('VIDEO');
  const [sharedSurah, setSharedSurah] = useState(SURAHS[0]);
  
  // State: UI Toggles
  const [showChat, setShowChat] = useState(true);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showQuranSelector, setShowQuranSelector] = useState(false);

  // --- ACTIONS ---

  const handleJoinClass = (cls: LiveClass, role: 'TEACHER' | 'STUDENT') => {
    setActiveClass(cls);
    setUserRole(role);
    setIsLobby(false);
    // Add self to participants
    setParticipants(prev => [
      { id: 'me', name: role === 'TEACHER' ? cls.instructorName : 'Me', role: role === 'TEACHER' ? 'HOST' : 'STUDENT', isMuted: !myMicOn, isVideoOn: myCamOn, isHandRaised: false, avatar: 'https://picsum.photos/seed/me/100' },
      ...prev
    ]);
  };

  const handleLeaveClass = () => {
    setActiveClass(null);
    setIsLobby(true);
    setMainView('VIDEO');
  };

  const toggleHand = () => {
    setParticipants(prev => prev.map(p => p.id === 'me' ? { ...p, isHandRaised: !p.isHandRaised } : p));
  };

  // Teacher Actions
  const handleMuteAll = () => {
    setParticipants(prev => prev.map(p => p.role === 'STUDENT' ? { ...p, isMuted: true } : p));
  };

  const handleRemoveParticipant = (id: string) => {
    setParticipants(prev => prev.filter(p => p.id !== id));
  };

  const handleApproveHand = (id: string) => {
    setParticipants(prev => prev.map(p => p.id === id ? { ...p, isHandRaised: false, isMuted: false } : p));
  };

  const handleShareQuran = (surah: any) => {
    setSharedSurah(surah);
    setMainView('QURAN');
    setShowQuranSelector(false);
  };

  const sendMessage = () => {
    if(!newMessage.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), sender: 'Me', text: newMessage, time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) }]);
    setNewMessage('');
  };

  // --- RENDERERS ---

  if (isLobby) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Class List */}
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 font-arabic mb-6">Live Classroom Lobby</h2>
            
            {/* Create Class (Teacher Only Simulation) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
              <h3 className="font-bold text-lg mb-4 flex items-center text-emerald-800">
                <Video className="mr-2"/> Teacher Dashboard
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <input type="text" placeholder="Class Title" className="border rounded-lg px-4 py-2 text-sm w-full"/>
                 <select className="border rounded-lg px-4 py-2 text-sm w-full">
                    <option>Select Topic...</option>
                    <option>Tajweed</option>
                    <option>Tafsir</option>
                    <option>Hifz</option>
                 </select>
                 <button className="col-span-full bg-emerald-600 text-white py-2 rounded-lg font-bold hover:bg-emerald-700 transition">
                    Create & Go Live
                 </button>
              </div>
            </div>

            {/* Available Classes */}
            <h3 className="font-bold text-xl mt-8 mb-4">Ongoing & Scheduled Classes</h3>
            <div className="space-y-4">
              {MOCK_LIVE_CLASSES.map(cls => (
                <div key={cls.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between items-center hover:border-emerald-300 transition">
                   <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${cls.status === 'LIVE' ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}>
                         {cls.status === 'LIVE' ? 'LIVE' : 'UP'}
                      </div>
                      <div>
                         <h4 className="font-bold text-lg">{cls.title}</h4>
                         <p className="text-sm text-gray-500">with {cls.instructorName} • {cls.topic}</p>
                      </div>
                   </div>
                   <div className="flex space-x-2">
                      <button 
                        onClick={() => handleJoinClass(cls, 'STUDENT')}
                        className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg font-bold hover:bg-emerald-200 transition"
                      >
                        Join as Student
                      </button>
                      <button 
                        onClick={() => handleJoinClass(cls, 'TEACHER')}
                        className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg font-bold hover:bg-gray-50 transition text-sm"
                      >
                        Host (Demo)
                      </button>
                   </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pre-Join Check */}
          <div className="w-full md:w-96 bg-gray-900 rounded-2xl p-6 text-white flex flex-col items-center">
            <h3 className="font-bold mb-4">Preview</h3>
            <div className="w-full aspect-video bg-black rounded-xl mb-6 relative overflow-hidden flex items-center justify-center">
               {myCamOn ? (
                 <img src="https://picsum.photos/seed/me/400/300" alt="Me" className="w-full h-full object-cover transform scale-x-[-1]"/>
               ) : (
                 <div className="flex flex-col items-center text-gray-500">
                    <VideoOff size={48} className="mb-2"/>
                    <span>Camera Off</span>
                 </div>
               )}
               <div className="absolute bottom-4 left-4 bg-black/60 px-2 py-1 rounded-lg text-xs flex items-center">
                  {myMicOn ? <Mic size={12} className="text-green-400 mr-1"/> : <MicOff size={12} className="text-red-400 mr-1"/>}
                  {myMicOn ? 'Mic On' : 'Mic Off'}
               </div>
            </div>
            
            <div className="flex space-x-4 mb-8">
               <button onClick={() => setMyMicOn(!myMicOn)} className={`p-4 rounded-full ${myMicOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'}`}>
                  {myMicOn ? <Mic/> : <MicOff/>}
               </button>
               <button onClick={() => setMyCamOn(!myCamOn)} className={`p-4 rounded-full ${myCamOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'}`}>
                  {myCamOn ? <Video/> : <VideoOff/>}
               </button>
            </div>

            <div className="w-full space-y-2">
              <div className="flex justify-between text-sm text-gray-400">
                 <span>Microphone</span>
                 <span>Default - MacBook Pro Mic</span>
              </div>
              <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                 <div className="h-full bg-green-500 w-[60%] animate-pulse"></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // --- ACTIVE CLASSROOM ---
  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] bg-gray-900 text-white overflow-hidden">
      
      {/* Top Bar */}
      <div className="h-14 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
        <div className="flex items-center space-x-2">
           <div className="bg-red-600 px-2 py-0.5 rounded text-xs font-bold animate-pulse">LIVE</div>
           <h1 className="font-bold text-sm md:text-base">{activeClass?.title}</h1>
           <span className="text-gray-400 text-xs hidden md:inline">| {activeClass?.durationMinutes} min session</span>
        </div>
        <div className="flex items-center space-x-4">
           {userRole === 'TEACHER' && (
              <button 
                onClick={() => setMainView(prev => prev === 'SCREEN' ? 'VIDEO' : 'SCREEN')}
                className={`flex items-center space-x-1 text-sm px-3 py-1.5 rounded hover:bg-gray-700 ${mainView === 'SCREEN' ? 'bg-emerald-600' : ''}`}
              >
                 <Monitor size={16}/> <span className="hidden sm:inline">Share Screen</span>
              </button>
           )}
           {userRole === 'TEACHER' && (
              <button 
                onClick={() => setShowQuranSelector(true)}
                className={`flex items-center space-x-1 text-sm px-3 py-1.5 rounded hover:bg-gray-700 ${mainView === 'QURAN' ? 'bg-emerald-600' : ''}`}
              >
                 <BookOpen size={16}/> <span className="hidden sm:inline">Share Quran</span>
              </button>
           )}
           <div className="h-6 w-px bg-gray-600 mx-2"></div>
           <button className="text-gray-400 hover:text-white"><Settings size={20}/></button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Stage */}
        <div className="flex-1 bg-black relative flex flex-col">
           {/* Dynamic Content based on View */}
           <div className="flex-1 flex items-center justify-center p-4">
              {mainView === 'VIDEO' && (
                 <div className="relative w-full h-full max-w-5xl aspect-video bg-gray-800 rounded-lg overflow-hidden">
                    <img src={`https://picsum.photos/seed/${activeClass?.instructorId}/1200/800`} className="w-full h-full object-cover"/>
                    <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1 rounded text-white text-sm">
                       {activeClass?.instructorName} (Host)
                    </div>
                 </div>
              )}
              {mainView === 'SCREEN' && (
                 <div className="w-full h-full bg-gray-800 flex items-center justify-center border-2 border-emerald-500 rounded-lg">
                    <div className="text-center">
                       <Monitor size={64} className="mx-auto text-emerald-500 mb-4"/>
                       <h3 className="text-2xl font-bold">Screen Sharing Active</h3>
                       <p className="text-gray-400">Students are viewing your screen content</p>
                    </div>
                 </div>
              )}
              {mainView === 'QURAN' && (
                 <div className="w-full h-full bg-[#fdf6e3] text-black rounded-lg p-8 overflow-y-auto text-center border-4 border-gold-500 relative">
                     <div className="absolute top-4 right-4 bg-black/80 text-white px-3 py-1 rounded-full text-xs">
                        Shared View
                     </div>
                     <h2 className="font-arabic text-3xl font-bold mb-8 text-emerald-800">{sharedSurah.name}</h2>
                     <div className="font-arabic text-4xl leading-[2.5] dir-rtl max-w-3xl mx-auto" dir="rtl">
                        بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ <br/>
                        ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ <br/>
                        ٱلرَّحْمَٰنِ ٱلرَّحِيمِ <br/>
                        مَٰلِكِ يَوْمِ ٱلدِّينِ
                     </div>
                 </div>
              )}
           </div>

           {/* Participant Strip (if video view) */}
           {mainView !== 'VIDEO' && (
             <div className="h-32 bg-gray-900 border-t border-gray-800 flex items-center p-4 space-x-4 overflow-x-auto">
                <div className="w-40 h-24 bg-gray-800 rounded-lg flex-shrink-0 relative overflow-hidden border-2 border-emerald-500">
                    <img src={`https://picsum.photos/seed/${activeClass?.instructorId}/200`} className="w-full h-full object-cover"/>
                    <div className="absolute bottom-1 left-1 text-[10px] bg-black/60 px-1 rounded text-white">Teacher</div>
                </div>
                {participants.slice(0, 5).map(p => (
                   <div key={p.id} className="w-40 h-24 bg-gray-800 rounded-lg flex-shrink-0 relative overflow-hidden">
                      <img src={p.avatar} className="w-full h-full object-cover opacity-80"/>
                      <div className="absolute bottom-1 left-1 text-[10px] bg-black/60 px-1 rounded text-white truncate max-w-[80%]">{p.name}</div>
                   </div>
                ))}
             </div>
           )}
        </div>

        {/* Sidebar (Chat & People) */}
        {(showChat || showParticipants) && (
           <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
              {/* Tabs */}
              <div className="flex border-b border-gray-700">
                 <button 
                   onClick={() => {setShowParticipants(false); setShowChat(true)}}
                   className={`flex-1 py-3 text-sm font-bold ${showChat && !showParticipants ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-gray-400'}`}
                 >
                    Chat
                 </button>
                 <button 
                   onClick={() => {setShowChat(false); setShowParticipants(true)}}
                   className={`flex-1 py-3 text-sm font-bold ${showParticipants ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-gray-400'}`}
                 >
                    People ({participants.length})
                 </button>
              </div>

              {/* Participants List */}
              {showParticipants && (
                 <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {userRole === 'TEACHER' && (
                       <button onClick={handleMuteAll} className="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded text-xs font-bold mb-2">
                          Mute All
                       </button>
                    )}
                    {participants.map(p => (
                       <div key={p.id} className="flex items-center justify-between p-2 rounded hover:bg-gray-700">
                          <div className="flex items-center space-x-2 overflow-hidden">
                             <img src={p.avatar} className="w-8 h-8 rounded-full bg-gray-600"/>
                             <div className="truncate">
                                <p className="text-sm font-medium">{p.name} {p.id === 'me' && '(You)'}</p>
                                <p className="text-[10px] text-gray-400">{p.role}</p>
                             </div>
                          </div>
                          <div className="flex items-center space-x-1">
                             {p.isHandRaised && (
                                <button 
                                  onClick={() => userRole === 'TEACHER' && handleApproveHand(p.id)}
                                  className="text-blue-400 p-1 hover:bg-gray-600 rounded" 
                                  title="Hand Raised"
                                >
                                   <Hand size={16}/>
                                </button>
                             )}
                             {p.isMuted ? <MicOff size={16} className="text-red-400"/> : <Mic size={16} className="text-green-400"/>}
                             {userRole === 'TEACHER' && p.role !== 'HOST' && (
                                <button onClick={() => handleRemoveParticipant(p.id)} className="text-gray-500 hover:text-red-400 p-1">
                                   <X size={16}/>
                                </button>
                             )}
                          </div>
                       </div>
                    ))}
                 </div>
              )}

              {/* Chat Area */}
              {showChat && (
                 <>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/20">
                       {messages.map(m => (
                          <div key={m.id} className="bg-gray-700/50 p-3 rounded-lg">
                             <div className="flex justify-between items-baseline mb-1">
                                <span className={`text-xs font-bold ${m.sender.includes('Sheikh') ? 'text-emerald-400' : 'text-blue-400'}`}>{m.sender}</span>
                                <span className="text-[10px] text-gray-500">{m.time}</span>
                             </div>
                             <p className="text-sm">{m.text}</p>
                          </div>
                       ))}
                    </div>
                    <div className="p-3 border-t border-gray-700">
                       <div className="flex items-center space-x-2">
                          <input 
                             type="text" 
                             value={newMessage}
                             onChange={e => setNewMessage(e.target.value)}
                             onKeyDown={e => e.key === 'Enter' && sendMessage()}
                             className="flex-1 bg-gray-900 border border-gray-700 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-emerald-500"
                             placeholder="Type here..."
                          />
                          <button onClick={sendMessage} className="p-2 bg-emerald-600 rounded-full hover:bg-emerald-700"><Send size={16}/></button>
                       </div>
                    </div>
                 </>
              )}
           </div>
        )}

      </div>

      {/* Bottom Controls */}
      <div className="h-20 bg-gray-900 border-t border-gray-800 flex items-center justify-center space-x-4 px-4 relative z-10">
         <button onClick={() => setMyMicOn(!myMicOn)} className={`flex flex-col items-center space-y-1 p-2 w-16 rounded-lg ${myMicOn ? 'text-white hover:bg-gray-800' : 'text-red-500 hover:bg-gray-800'}`}>
            <div className={`p-2 rounded-full ${myMicOn ? 'bg-gray-700' : 'bg-white'}`}>
               {myMicOn ? <Mic size={20}/> : <MicOff size={20} className="text-red-500"/>}
            </div>
            <span className="text-[10px]">Mic</span>
         </button>

         <button onClick={() => setMyCamOn(!myCamOn)} className={`flex flex-col items-center space-y-1 p-2 w-16 rounded-lg ${myCamOn ? 'text-white hover:bg-gray-800' : 'text-red-500 hover:bg-gray-800'}`}>
            <div className={`p-2 rounded-full ${myCamOn ? 'bg-gray-700' : 'bg-white'}`}>
               {myCamOn ? <Video size={20}/> : <VideoOff size={20} className="text-red-500"/>}
            </div>
            <span className="text-[10px]">Cam</span>
         </button>

         {userRole === 'STUDENT' && (
            <button onClick={toggleHand} className={`flex flex-col items-center space-y-1 p-2 w-16 rounded-lg hover:bg-gray-800 ${participants.find(p => p.id === 'me')?.isHandRaised ? 'text-blue-400' : 'text-white'}`}>
               <div className={`p-2 rounded-full ${participants.find(p => p.id === 'me')?.isHandRaised ? 'bg-blue-500 text-white' : 'bg-gray-700'}`}>
                  <Hand size={20}/>
               </div>
               <span className="text-[10px]">Raise Hand</span>
            </button>
         )}

         <div className="w-px h-8 bg-gray-700 mx-2"></div>

         <button onClick={() => setShowParticipants(!showParticipants)} className="flex flex-col items-center space-y-1 p-2 w-16 rounded-lg text-white hover:bg-gray-800">
            <div className="p-2 rounded-full bg-gray-700 relative">
               <Users size={20}/>
               <span className="absolute -top-1 -right-1 bg-emerald-600 text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{participants.length}</span>
            </div>
            <span className="text-[10px]">People</span>
         </button>

         <button onClick={() => setShowChat(!showChat)} className="flex flex-col items-center space-y-1 p-2 w-16 rounded-lg text-white hover:bg-gray-800">
            <div className="p-2 rounded-full bg-gray-700 relative">
               <MessageSquare size={20}/>
               <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] w-4 h-4 rounded-full flex items-center justify-center">2</span>
            </div>
            <span className="text-[10px]">Chat</span>
         </button>

         <button 
           onClick={handleLeaveClass}
           className="ml-8 px-6 py-2 bg-red-600 hover:bg-red-700 rounded-full font-bold text-sm shadow-lg flex items-center"
         >
            <PhoneOff size={18} className="mr-2"/> End
         </button>
      </div>

      {/* Modals */}
      {showQuranSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
           <div className="bg-white text-black rounded-xl p-6 w-full max-w-md">
              <h3 className="text-lg font-bold mb-4">Select Surah to Share</h3>
              <div className="max-h-96 overflow-y-auto space-y-2">
                 {SURAHS.map(s => (
                    <button 
                      key={s.number} 
                      onClick={() => handleShareQuran(s)}
                      className="w-full text-left px-4 py-3 rounded-lg hover:bg-emerald-50 flex justify-between items-center border border-gray-100"
                    >
                       <span className="font-bold">{s.number}. {s.name}</span>
                       <span className="text-xs text-gray-500">{s.ayahs} Ayahs</span>
                    </button>
                 ))}
              </div>
              <button onClick={() => setShowQuranSelector(false)} className="mt-4 w-full py-2 bg-gray-200 rounded-lg font-bold">Cancel</button>
           </div>
        </div>
      )}

    </div>
  );
};

export default LiveClassroom;
