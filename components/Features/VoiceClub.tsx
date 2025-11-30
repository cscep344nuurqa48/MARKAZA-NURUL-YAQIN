
import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Hand, MessageCircle, Users, X, 
  Calendar, Plus, ShieldCheck, 
  Send, Gift, Info,  
  Armchair, UserX, Sparkles, Loader2, Flag, Radio, Bell, CalendarCheck,
  Signal, Sliders, Activity, Disc
} from 'lucide-react';
import { User, VoiceRoom, VoiceUser, VoiceEvent, Notification, AudioSettings, NetworkQuality, VoiceRole } from '../../types';
import { backend } from '../../services/backend';
import { agoraService } from '../../services/agoraMock';

interface VoiceClubProps {
  user: User | null;
}

const GIFTS = [
  { id: '1', name: 'Date', icon: '🤲', cost: 10 },
  { id: '2', name: 'Rose', icon: '🌹', cost: 20 },
  { id: '3', name: 'Coffee', icon: '☕', cost: 50 },
  { id: '4', name: 'Quran', icon: '📖', cost: 100 },
  { id: '5', name: 'Mosque', icon: '🕌', cost: 500 },
  { id: '6', name: 'Camel', icon: '🐪', cost: 1000 },
];

const COIN_PACKAGES = [
  { id: 'p1', coins: 100, price: '$0.99' },
  { id: 'p2', coins: 550, price: '$4.99', popular: true },
  { id: 'p3', coins: 1200, price: '$9.99' },
  { id: 'p4', coins: 3000, price: '$24.99' },
];

const CATEGORIES = ['All', 'Quran', 'Tajweed', 'Tafsir', 'Youth', 'Sisters', 'General'];

const VoiceClub: React.FC<VoiceClubProps> = ({ user }) => {
  // Data State
  const [rooms, setRooms] = useState<VoiceRoom[]>([]);
  const [events, setEvents] = useState<VoiceEvent[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [userCoins, setUserCoins] = useState(0);

  const [activeRoom, setActiveRoom] = useState<VoiceRoom | null>(null);
  const [participants, setParticipants] = useState<VoiceUser[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Room State
  const [isMuted, setIsMuted] = useState(true);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [showChat, setShowChat] = useState(false);
  
  // Agora State
  const [connectionState, setConnectionState] = useState('DISCONNECTED');
  const [audioSettings, setAudioSettings] = useState<AudioSettings>({
    noiseSuppression: true,
    echoCancellation: true,
    highQuality: true,
    spatialAudio: false
  });
  const [isRecording, setIsRecording] = useState(false);
  
  // Modals / Overlays
  const [selectedUser, setSelectedUser] = useState<VoiceUser | null>(null);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [showAudioSettings, setShowAudioSettings] = useState(false);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Chat
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, user: 'System', text: 'Welcome to the room! Please adhere to Islamic etiquette.', isSystem: true, avatar: '' },
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- INITIAL DATA LOAD ---
  useEffect(() => {
    const initData = async () => {
      const [fetchedRooms, fetchedEvents, fetchedNotes] = await Promise.all([
        backend.voice.getRooms(),
        backend.voice.getEvents(),
        backend.notifications.getAll()
      ]);
      setRooms(fetchedRooms);
      setEvents(fetchedEvents);
      setNotifications(fetchedNotes);
      setLoadingRooms(false);

      if (user) {
        const balance = await backend.wallet.getBalance(user.id);
        setUserCoins(balance);
      }
    };
    initData();
  }, [user]);

  // --- AGORA EVENT LISTENERS ---
  useEffect(() => {
    if (!activeRoom) return;

    // Listen for Volume Updates
    agoraService.on('volume-indicator', (volumes: {uid: string, level: number}[]) => {
      setParticipants(prev => prev.map(p => {
        const vol = volumes.find(v => v.uid === p.id);
        if (vol) {
          return { ...p, volumeLevel: vol.level, isSpeaking: vol.level > 10 };
        }
        return p;
      }));
    });

    // Listen for Network Quality
    agoraService.on('network-quality', (qualities: Record<string, NetworkQuality>) => {
        setParticipants(prev => prev.map(p => {
            if (qualities[p.id]) {
                return { ...p, networkQuality: qualities[p.id] };
            }
            return p;
        }));
    });

    // Listen for Connection State
    agoraService.on('connection-state-change', (data: any) => {
        setConnectionState(data.curState);
    });

    return () => {
        // Cleanup listeners
    };
  }, [activeRoom]);

  // Scroll chat
  useEffect(() => {
    if (showChat) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, showChat]);

  // --- ACTIONS ---

  const handleCreateRoom = async (roomData: any) => {
    if (!user) return;
    setLoadingRooms(true);
    
    // New backend createRoom automatically joins the user as HOST
    const newRoom = await backend.voice.createRoom({
      title: roomData.title,
      category: roomData.category,
      description: roomData.description,
      tags: [roomData.category]
    });

    // Refresh lists
    const fetchedRooms = await backend.voice.getRooms();
    setRooms(fetchedRooms);
    setLoadingRooms(false);
    setShowCreateRoom(false);

    // Enter room UI
    await enterRoomSequence(newRoom);
  };

  const handleJoinRoom = async (room: VoiceRoom) => {
    if (!user) return;
    // Call backend join
    await backend.voice.joinRoom(room.id, user.id, VoiceRole.LISTENER);
    await enterRoomSequence(room);
  };

  const enterRoomSequence = async (room: VoiceRoom) => {
    setActiveRoom(room);
    setMessages([{ id: 1, user: 'System', text: 'Welcome to the room! Please adhere to Islamic etiquette.', isSystem: true, avatar: '' }]);
    
    // Fetch real participants from backend
    const roomParticipants = await backend.voice.getParticipants(room.id);
    setParticipants(roomParticipants);

    // Connect Agora
    if (user) {
        try {
            await agoraService.join('APP_ID', room.id, null, user.id);
            const me = roomParticipants.find(p => p.id === user.id);
            if (me?.roomRole === VoiceRole.HOST || me?.roomRole === VoiceRole.SPEAKER) {
                 await agoraService.setClientRole('host');
            } else {
                 await agoraService.setClientRole('audience');
            }
        } catch (err) {
            console.error("Agora Join Failed", err);
        }
    }
  };

  const handleLeaveRoom = async () => {
    if (!activeRoom || !user) return;
    await agoraService.leave();
    await backend.voice.leaveRoom(activeRoom.id, user.id);
    
    setActiveRoom(null);
    setShowChat(false);
    setIsHandRaised(false);
    setIsRecording(false);
    
    // Refresh rooms list to see updated counts
    const fetchedRooms = await backend.voice.getRooms();
    setRooms(fetchedRooms);
  };

  const handleBuyCoins = async (amount: number, pkgId: string) => {
    if (!user) return;
    const newBalance = await backend.wallet.topUp(user.id, amount, pkgId);
    setUserCoins(newBalance);
    setShowTopUpModal(false);
    setMessages(prev => [...prev, { id: Date.now(), user: 'System', text: `You purchased ${amount} coins.`, isSystem: true, avatar: '' }]);
  };

  const handleSendGift = async (gift: any) => {
    if (!user || !selectedUser) return;
    try {
        const newBalance = await backend.wallet.sendGift(user.id, selectedUser.id, gift.id, gift.cost);
        setUserCoins(newBalance);
        
        setMessages(prev => [...prev, { id: Date.now(), user: 'System', text: `${user.name} sent a ${gift.name} ${gift.icon} to ${selectedUser.name}`, isSystem: true, avatar: '' }]);
        setShowGiftModal(false);
        setSelectedUser(null);
    } catch (e) {
        // Insufficient funds
        setShowGiftModal(false);
        setShowTopUpModal(true);
    }
  };

  const handleSendMessage = () => {
    if(!chatMessage.trim()) return;
    const currentUser = participants.find(p => p.id === user?.id);
    if (currentUser?.isChatBanned) {
        setMessages(prev => [...prev, { id: Date.now(), user: 'System', text: 'You are restricted from chatting.', isSystem: true, avatar: '' }]);
        setChatMessage('');
        return;
    }
    setMessages(prev => [...prev, {
      id: Date.now(), user: user?.name || 'Guest', text: chatMessage, avatar: user?.avatar || '', isSystem: false
    }]);
    setChatMessage('');
  };

  const handleReportUser = () => {
    setShowReportModal(false);
    setSelectedUser(null);
    setMessages(prev => [...prev, { id: Date.now(), user: 'System', text: 'Report submitted.', isSystem: true, avatar: '' }]);
  };

  const handleRSVP = async (eventId: string) => {
    if (!user) return;
    await backend.voice.rsvpEvent(eventId, user.id);
    const [updatedEvents, updatedNotes] = await Promise.all([backend.voice.getEvents(), backend.notifications.getAll()]);
    setEvents(updatedEvents);
    setNotifications(updatedNotes);
    setShowNotifications(true);
  };

  const handleMuteUser = (id: string) => setParticipants(prev => prev.map(p => p.id === id ? { ...p, isMuted: true } : p));
  const handleKickUser = (id: string) => { setParticipants(prev => prev.filter(p => p.id !== id)); setSelectedUser(null); };

  // --- RENDER HELPERS ---

  const getSignalIcon = (quality?: NetworkQuality) => {
      // 0=Unknown, 1=Excellent... 5=Bad
      if (quality === undefined || quality === 0) return <Signal size={12} className="text-gray-400"/>;
      if (quality <= 2) return <Signal size={12} className="text-emerald-500"/>;
      if (quality === 3) return <Signal size={12} className="text-yellow-500"/>;
      return <Signal size={12} className="text-red-500"/>;
  };

  // --- MODALS ---
  const NotificationsDropdown = () => (
    <div className="absolute top-12 right-0 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-[60] animate-in fade-in zoom-in-95">
      <div className="p-4 bg-emerald-50 border-b border-emerald-100 flex justify-between items-center">
        <h3 className="font-bold text-emerald-900">Notifications</h3>
        <button onClick={() => setShowNotifications(false)}><X size={16} className="text-emerald-700"/></button>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? <div className="p-8 text-center text-gray-400 text-sm">No new notifications</div> : notifications.map(note => (
            <div key={note.id} className={`p-4 border-b border-gray-50 hover:bg-gray-50 flex items-start space-x-3 ${!note.isRead ? 'bg-blue-50/50' : ''}`}>
              <div className={`mt-1 p-1.5 rounded-full flex-shrink-0 ${note.type === 'EVENT' ? 'bg-gold-100 text-gold-600' : 'bg-emerald-100 text-emerald-600'}`}>
                {note.type === 'EVENT' ? <Calendar size={14}/> : <Info size={14}/>}
              </div>
              <div><p className="text-sm text-gray-800 leading-snug">{note.text}</p><p className="text-xs text-gray-400 mt-1">{note.timestamp}</p></div>
            </div>
          ))}
      </div>
    </div>
  );

  const ReportModal = ({ onClose }: { onClose: () => void }) => (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
        <div className="bg-white w-full max-w-sm rounded-2xl p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-lg mb-4 text-red-600 flex items-center"><Flag size={20} className="mr-2"/> Report User</h3>
            <p className="text-sm text-gray-600 mb-4">Why are you reporting {selectedUser?.name}?</p>
            <div className="space-y-3 mb-6">
                {['Inappropriate Language', 'Disrespectful Behavior', 'Spamming', 'Other'].map(reason => (
                    <label key={reason} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <Radio size={16} className="text-emerald-600"/> <span className="text-sm font-medium">{reason}</span>
                    </label>
                ))}
            </div>
            <div className="flex space-x-3"><button onClick={onClose} className="flex-1 py-2 border rounded-lg font-bold text-gray-600">Cancel</button><button onClick={handleReportUser} className="flex-1 py-2 bg-red-600 text-white rounded-lg font-bold">Submit</button></div>
        </div>
    </div>
  );

  const CreateRoomModal = ({ onClose }: { onClose: () => void }) => {
    const [formData, setFormData] = useState({ title: '', category: 'General', description: '' });
    return (
        <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-6 animate-in slide-in-from-bottom" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold flex items-center"><Mic size={24} className="mr-2 text-emerald-600"/> Start a Room</h3><button onClick={onClose}><X size={24} className="text-gray-400"/></button></div>
                <div className="space-y-4">
                    <div><label className="block text-sm font-bold text-gray-700 mb-1">Room Title</label><input type="text" className="w-full border rounded-xl px-4 py-3" placeholder="e.g. Morning Tafsir Circle" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}/></div>
                    <div><label className="block text-sm font-bold text-gray-700 mb-1">Category</label><div className="flex flex-wrap gap-2">{CATEGORIES.filter(c => c !== 'All').map(cat => (<button key={cat} onClick={() => setFormData({...formData, category: cat})} className={`px-4 py-2 rounded-full text-sm font-medium transition ${formData.category === cat ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'}`}>{cat}</button>))}</div></div>
                    <div><label className="block text-sm font-bold text-gray-700 mb-1">Description</label><textarea className="w-full border rounded-xl px-4 py-3 h-24 resize-none" placeholder="Details..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}/></div>
                    <button onClick={() => handleCreateRoom(formData)} disabled={!formData.title} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 disabled:opacity-50 transition shadow-lg mt-4">Go Live Now</button>
                </div>
            </div>
        </div>
    );
  };

  const AudioSettingsModal = ({ onClose }: { onClose: () => void }) => (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
        <div className="bg-white w-full max-w-sm rounded-2xl p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-lg mb-6 flex items-center"><Sliders size={20} className="mr-2 text-emerald-600"/> Audio Settings</h3>
            
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-bold text-gray-800">AI Noise Suppression</p>
                        <p className="text-xs text-gray-500">Reduce background noise</p>
                    </div>
                    <button 
                        onClick={() => setAudioSettings(s => ({...s, noiseSuppression: !s.noiseSuppression}))}
                        className={`w-12 h-6 rounded-full transition-colors relative ${audioSettings.noiseSuppression ? 'bg-emerald-500' : 'bg-gray-300'}`}
                    >
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${audioSettings.noiseSuppression ? 'left-7' : 'left-1'}`}></div>
                    </button>
                </div>
            </div>

            <button onClick={onClose} className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-bold mt-8 hover:bg-gray-200">Close</button>
        </div>
    </div>
  );

  const UserProfileCard = ({ targetUser, onClose }: { targetUser: VoiceUser, onClose: () => void }) => {
    const currentUser = participants.find(p => p.id === user?.id);
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
        <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
            <div className="h-28 bg-gradient-to-r from-emerald-600 to-teal-500 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 rounded-full p-1"><X size={20}/></button>
            </div>
            <div className="px-6 pb-6 relative -mt-14">
                <div className="flex justify-between items-end">
                    <div className="w-28 h-28 rounded-full border-4 border-white shadow-lg bg-gray-200 overflow-hidden relative group">
                        <img src={targetUser.avatar} alt={targetUser.name} className="w-full h-full object-cover"/>
                        <div className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow-sm border border-gray-100">
                           {getSignalIcon(targetUser.networkQuality)}
                        </div>
                    </div>
                    {currentUser?.roomRole === VoiceRole.HOST && currentUser.id !== targetUser.id && (
                        <div className="mb-2 flex space-x-2">
                             <button onClick={() => handleMuteUser(targetUser.id)} className="bg-gray-100 p-2 rounded-full text-gray-600"><MicOff size={16}/></button>
                             <button onClick={() => handleKickUser(targetUser.id)} className="bg-red-100 p-2 rounded-full text-red-600"><UserX size={16}/></button>
                        </div>
                    )}
                </div>
                <div className="mt-4">
                    <h3 className="text-2xl font-bold text-gray-900 flex items-center">{targetUser.name} {['HOST', 'MODERATOR'].includes(targetUser.roomRole) && <ShieldCheck size={20} className="text-emerald-500 ml-1" />}</h3>
                    <p className="text-emerald-600 text-xs font-bold uppercase tracking-wider mb-2">{targetUser.roomRole}</p>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">{targetUser.bio || "No bio available."}</p>
                </div>
                <div className="flex justify-around mb-6 border-t border-b border-gray-100 py-4">
                    <div className="text-center w-1/2"><span className="block font-bold text-gray-900 text-xl">{targetUser.followers}</span><span className="text-xs text-gray-500 uppercase font-medium">Followers</span></div>
                    <div className="w-px bg-gray-200"></div>
                    <div className="text-center w-1/2"><span className="block font-bold text-gray-900 text-xl">{targetUser.following}</span><span className="text-xs text-gray-500 uppercase font-medium">Following</span></div>
                </div>
                {currentUser?.id !== targetUser.id && (
                    <button onClick={() => setShowGiftModal(true)} className="w-full bg-gold-100 text-gold-700 border border-gold-200 py-3 rounded-xl font-bold hover:bg-gold-200 transition flex items-center justify-center shadow-sm"><Gift size={18} className="mr-2"/> Send Gift</button>
                )}
            </div>
        </div>
        </div>
    );
  };

  const TopUpModal = ({ onClose }: { onClose: () => void }) => {
    const [processingId, setProcessingId] = useState<string | null>(null);
    const onBuy = (pkgId: string, amount: number) => { setProcessingId(pkgId); handleBuyCoins(amount, pkgId); };
    return (
        <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 animate-in slide-in-from-bottom duration-300" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold text-gray-900 flex items-center"><Sparkles className="text-gold-500 mr-2" size={20}/> Top Up Coins</h3><button onClick={onClose}><X size={18}/></button></div>
                <div className="space-y-3 mb-6">
                    {COIN_PACKAGES.map(pkg => (
                        <button key={pkg.id} disabled={!!processingId} onClick={() => onBuy(pkg.id, pkg.coins)} className={`w-full flex justify-between items-center p-4 rounded-xl border-2 transition ${pkg.popular ? 'border-gold-400 bg-gold-50/50' : 'border-gray-200 hover:border-emerald-400'}`}>
                           <div className="flex items-center"><div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${pkg.popular ? 'bg-gold-200 text-gold-700' : 'bg-gray-100 text-gray-600'}`}><span className="font-bold">C</span></div><div className="text-left font-bold text-gray-900">{pkg.coins} Coins</div></div>
                           <div className="font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg">{processingId === pkg.id ? <Loader2 size={16} className="animate-spin"/> : pkg.price}</div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
  };

  const GiftModal = ({ onClose }: { onClose: () => void }) => (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 animate-in slide-in-from-bottom duration-300" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6"><h3 className="text-lg font-bold text-gray-900">Send a Gift to {selectedUser?.name}</h3><button onClick={onClose}><X size={18}/></button></div>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {GIFTS.map(gift => (
            <button key={gift.id} onClick={() => handleSendGift(gift)} disabled={userCoins < gift.cost} className={`flex flex-col items-center p-4 rounded-xl border transition ${userCoins >= gift.cost ? 'border-gray-200 hover:border-gold-400 hover:bg-gold-50' : 'opacity-50 cursor-not-allowed'}`}>
                <span className="text-4xl mb-2">{gift.icon}</span><span className="font-medium text-sm text-gray-800">{gift.name}</span><span className="text-xs font-bold text-gray-600 mt-1">{gift.cost} Coins</span>
            </button>
          ))}
        </div>
        <div className="bg-gray-100 p-4 rounded-xl flex justify-between items-center"><span className="text-sm font-bold text-emerald-600">Balance: {userCoins} Coins</span><button onClick={() => { onClose(); setShowTopUpModal(true); }} className="text-sm font-bold bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700">Top Up</button></div>
      </div>
    </div>
  );

  // --- ACTIVE ROOM VIEW ---
  if (activeRoom) {
    if (connectionState === 'CONNECTING') {
        return (
            <div className="h-[calc(100vh-5rem)] bg-gray-900 flex flex-col items-center justify-center text-white">
                <Loader2 size={48} className="animate-spin text-emerald-500 mb-4"/>
                <h3 className="text-xl font-bold">Connecting to Gateway...</h3>
                <p className="text-gray-400 mt-2">Securing connection</p>
            </div>
        );
    }

    return (
      <div className="h-[calc(100vh-5rem)] bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white flex flex-col relative overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 flex justify-between items-center bg-black/20 backdrop-blur-sm z-10 border-b border-white/5">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold truncate">{activeRoom.title}</h2>
            <div className="flex items-center space-x-3 mt-1">
               <span className="text-xs text-emerald-300 bg-emerald-900/50 px-2 py-0.5 rounded">{activeRoom.category}</span>
               <div className="flex items-center text-xs text-green-400">
                  <Activity size={10} className="mr-1"/> Excellent Connection
               </div>
               {isRecording && <div className="flex items-center text-xs text-red-500 animate-pulse"><Disc size={10} className="mr-1"/> REC</div>}
            </div>
          </div>
          <button onClick={handleLeaveRoom} className="px-4 py-2 bg-red-500/20 text-red-400 rounded-full text-sm font-bold">Leave</button>
        </div>

        {/* Stage */}
        <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
          <div className="grid grid-cols-5 gap-y-6 gap-x-2 sm:gap-x-4 justify-items-center mb-8">
            {Array.from({ length: 10 }).map((_, i) => {
                 const seatNum = i + 1;
                 const hostUser = participants.find(p => p.roomRole === VoiceRole.HOST);
                 const otherSpeakers = participants.filter(p => [VoiceRole.MODERATOR, VoiceRole.SPEAKER].includes(p.roomRole));
                 let occupant = seatNum === 1 ? hostUser : otherSpeakers[seatNum - 2];

                 return (
                    <div key={seatNum} className="flex flex-col items-center w-full">
                       {occupant ? (
                          <button onClick={() => setSelectedUser(occupant!)} className="flex flex-col items-center group relative">
                             {/* Speaking Ring (Volume Indicator) */}
                             <div className={`relative p-0.5 rounded-full transition-all duration-100 ${occupant.volumeLevel && occupant.volumeLevel > 5 ? 'bg-emerald-500 ring-2 ring-emerald-500/30' : 'bg-transparent'}`} style={{ transform: `scale(${1 + (occupant.volumeLevel || 0)/200})` }}>
                                <div className={`w-14 h-14 rounded-full overflow-hidden border-2 ${seatNum === 1 ? 'border-emerald-500' : 'border-gray-600'} bg-gray-800`}>
                                   <img src={occupant.avatar} alt={occupant.name} className="w-full h-full object-cover"/>
                                </div>
                                {occupant.isMuted && <div className="absolute top-0 right-0 bg-black/60 p-1 rounded-full"><MicOff size={10}/></div>}
                                
                                {/* Network Quality Badge */}
                                <div className="absolute bottom-0 right-0 bg-black/80 rounded-full p-1 border border-gray-700">
                                   {getSignalIcon(occupant.networkQuality)}
                                </div>
                             </div>
                             <span className="mt-2 text-xs text-white font-medium truncate max-w-[4rem] text-center">{occupant.name}</span>
                          </button>
                       ) : (
                          <div className="flex flex-col items-center opacity-30">
                             <div className="w-14 h-14 rounded-full border-2 border-dashed border-white/30 flex items-center justify-center">
                                <Armchair size={24}/>
                             </div>
                             <span className="mt-2 text-xs">{seatNum}</span>
                          </div>
                       )}
                    </div>
                 );
            })}
          </div>
          
          {/* Audience */}
          <div className="bg-white/5 rounded-3xl p-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-4">Audience</h3>
            <div className="grid grid-cols-5 gap-4">
               {participants.filter(p => p.roomRole === VoiceRole.LISTENER).map(user => (
                 <button key={user.id} onClick={() => setSelectedUser(user)} className="flex flex-col items-center relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-700 bg-gray-800">
                      <img src={user.avatar} className="w-full h-full object-cover"/>
                    </div>
                    <div className="absolute top-0 right-0 bg-black/50 rounded-full p-0.5">{getSignalIcon(user.networkQuality)}</div>
                    <span className="mt-2 text-xs text-gray-400 truncate w-full text-center">{user.name}</span>
                 </button>
               ))}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gray-900/90 backdrop-blur border-t border-white/5 p-4 flex justify-between items-center">
            <div className="flex space-x-4 mx-auto">
                <button onClick={() => setIsMuted(!isMuted)} className={`p-4 rounded-full shadow-lg ${isMuted ? 'bg-white/10' : 'bg-emerald-500'}`}>{isMuted ? <MicOff/> : <Mic/>}</button>
                <button onClick={() => setShowAudioSettings(true)} className={`p-4 rounded-full shadow-lg bg-white/10`} title="Audio Settings"><Sliders/></button>
                <button onClick={() => setIsHandRaised(!isHandRaised)} className={`p-4 rounded-full shadow-lg ${isHandRaised ? 'bg-blue-500' : 'bg-white/10'}`}><Hand/></button>
                <button onClick={() => setShowChat(!showChat)} className="p-4 rounded-full bg-white/10 shadow-lg"><MessageCircle/></button>
                
                {/* Host Only Controls */}
                {participants.find(p => p.id === user?.id)?.roomRole === VoiceRole.HOST && (
                    <button onClick={() => setIsRecording(!isRecording)} className={`p-4 rounded-full shadow-lg ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-white/10'}`} title="Record Session"><Disc/></button>
                )}
            </div>
            <button onClick={() => setShowGiftModal(true)} className="absolute right-4 bottom-24 bg-gold-500 p-3 rounded-full shadow-lg text-white"><Gift/></button>
        </div>

        {/* Chat Drawer */}
        {showChat && (
          <div className="absolute inset-y-0 right-0 w-full sm:w-96 bg-gray-900 shadow-2xl border-l border-white/10 flex flex-col z-40 animate-in slide-in-from-right duration-300">
             <div className="p-4 border-b border-white/10 flex justify-between bg-gray-800"><h3 className="font-bold">Chat</h3><button onClick={() => setShowChat(false)}><X/></button></div>
             <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/20">
                {messages.map((msg) => (
                   <div key={msg.id} className={`flex ${msg.isSystem ? 'justify-center' : 'justify-start space-x-3'}`}>
                      {msg.isSystem ? <span className="bg-white/10 text-gray-400 text-xs py-1 px-3 rounded-full">{msg.text}</span> : (
                        <div className="bg-gray-800 p-3 rounded-2xl rounded-tl-none">
                             <p className="text-xs text-emerald-400 font-bold mb-1">{msg.user}</p>
                             <p className="text-sm text-gray-200">{msg.text}</p>
                        </div>
                      )}
                   </div>
                ))}
                <div ref={chatEndRef} />
             </div>
             <div className="p-4 bg-gray-800 border-t border-white/10 flex space-x-2">
                <input value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} className="flex-1 bg-gray-900 border border-gray-700 rounded-full px-4 text-sm focus:outline-none focus:border-emerald-500" placeholder="Type..." />
                <button onClick={handleSendMessage} className="p-2 bg-emerald-600 rounded-full"><Send size={18}/></button>
             </div>
          </div>
        )}

        {selectedUser && <UserProfileCard targetUser={selectedUser} onClose={() => setSelectedUser(null)} />}
        {showGiftModal && <GiftModal onClose={() => setShowGiftModal(false)} />}
        {showTopUpModal && <TopUpModal onClose={() => setShowTopUpModal(false)} />}
        {showReportModal && <ReportModal onClose={() => setShowReportModal(false)} />}
        {showAudioSettings && <AudioSettingsModal onClose={() => setShowAudioSettings(false)} />}
      </div>
    );
  }

  // --- LOBBY VIEW ---
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-8 pb-20">
      <div className="flex justify-between items-center">
         <div>
            <h2 className="text-3xl font-bold text-gray-900 font-arabic">Voice Halqa Club</h2>
            <p className="text-gray-500">Join live discussions & recitation circles.</p>
         </div>
         <div className="flex items-center space-x-4 relative">
             <div className="hidden md:flex items-center bg-gold-100 text-gold-700 px-3 py-1 rounded-full text-sm font-bold">
                 <img src="https://cdn-icons-png.flaticon.com/512/272/272525.png" className="w-4 h-4 mr-1" alt="coin"/>
                 {userCoins}
             </div>
             <div className="relative">
                <button onClick={() => setShowNotifications(!showNotifications)} className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 relative">
                  <Bell size={20} className="text-gray-600"/>
                  {notifications.some(n => !n.isRead) && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>}
                </button>
                {showNotifications && <NotificationsDropdown />}
             </div>
             <button onClick={() => setShowCreateRoom(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full font-bold shadow-lg flex items-center">
                <Plus size={20} className="mr-2"/> Start Room
             </button>
         </div>
      </div>

      {events.length > 0 && (
         <div className="w-full overflow-x-auto scrollbar-hide">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 flex items-center"><Calendar size={14} className="mr-1"/> Upcoming Events</h3>
            <div className="flex space-x-4 pb-4">
               {events.map(event => (
                  <div key={event.id} className="min-w-[280px] bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
                     <p className="text-emerald-600 font-bold text-xs mb-1">{event.date} • {event.time}</p>
                     <h4 className="font-bold text-gray-900 mb-1">{event.title}</h4>
                     <p className="text-sm text-gray-500 mb-4">Hosted by {event.host}</p>
                     <button onClick={() => handleRSVP(event.id)} disabled={event.isRegistered} className={`w-full py-2 rounded-lg text-sm font-bold flex items-center justify-center ${event.isRegistered ? 'bg-gray-100 text-green-600' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}>
                        {event.isRegistered ? <><CalendarCheck size={16} className="mr-2"/> Registered</> : 'Remind Me'}
                     </button>
                  </div>
               ))}
            </div>
         </div>
      )}

      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
         {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-5 py-2 rounded-full text-sm font-medium transition ${selectedCategory === cat ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>{cat}</button>
         ))}
      </div>

      {loadingRooms ? (
         <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-600" size={48}/></div>
      ) : (
         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.filter(r => selectedCategory === 'All' || r.category === selectedCategory).map(room => (
               <div key={room.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition cursor-pointer group" onClick={() => handleJoinRoom(room)}>
                  <div className="flex justify-between items-start mb-4">
                     <h3 className="font-bold text-lg text-gray-900 leading-snug group-hover:text-emerald-700 transition">{room.title}</h3>
                     <span className="bg-emerald-50 text-emerald-700 text-xs px-2 py-1 rounded font-bold uppercase">{room.category}</span>
                  </div>
                  <p className="text-gray-500 text-sm mb-6 line-clamp-2">{room.description || 'No description provided.'}</p>
                  <div className="flex items-center justify-between">
                     <div className="flex -space-x-2">
                        {[1,2,3].map(i => (<img key={i} src={`https://picsum.photos/seed/${room.id + i}/50`} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200"/>))}
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">+{room.participantCount}</div>
                     </div>
                     <button className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-bold group-hover:bg-emerald-600 group-hover:text-white transition">Join</button>
                  </div>
               </div>
            ))}
         </div>
      )}

      {showCreateRoom && <CreateRoomModal onClose={() => setShowCreateRoom(false)} />}
      {showTopUpModal && <TopUpModal onClose={() => setShowTopUpModal(false)} />}
    </div>
  );
};

export default VoiceClub;
