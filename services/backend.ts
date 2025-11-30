
import { 
  MOCK_STUDENT_PROFILE, MOCK_ATTENDANCE, MOCK_LIVE_CLASSES, 
  VOICE_ROOMS, VOICE_EVENTS, MOCK_TEACHER_CLASSES
} from '../constants';
import { 
  User, UserRole, StudentProfile, VoiceRoom, VoiceEvent, Notification, 
  Transaction, Participant, ChatMessage, VoiceUser, VoiceRole 
} from '../types';

// --- DATABASE COLLECTIONS (LocalStorage Keys) ---
const DB = {
  USERS: 'db_users',
  ROOMS: 'db_rooms',
  PARTICIPANTS: 'db_participants', // Stores all participants flatly: { roomId, userId, role... }
  MESSAGES: 'db_messages',
  TRANSACTIONS: 'db_transactions',
  EVENTS: 'db_events',
  NOTIFICATIONS: 'db_notifications',
  STUDENTS: 'db_students',
  CLASSES: 'db_classes',
  ATTENDANCE: 'db_attendance',
  SESSION: 'db_session_auth',
};

// --- HELPER: NETWORK SIMULATION ---
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- HELPER: SEED DATA ---
const seedDatabase = () => {
  // 1. Users
  if (!localStorage.getItem(DB.USERS)) {
    const initialUsers: User[] = [
      {
        id: 'ADMIN-001',
        username: 'admin',
        email: 'admin@academy.com',
        password: 'password',
        name: 'Admin User',
        role: UserRole.ADMIN,
        avatar: 'https://picsum.photos/seed/admin/200/200',
        wallet: { coins: 1000, currency: 'USD' },
        roles: ['admin', 'teacher'],
        badges: [],
        isBanned: false,
        createdAt: new Date().toISOString(),
        lastSeenAt: new Date().toISOString()
      },
      {
        id: 'TEACHER-001',
        username: 'sheikh_ahmed',
        email: 'teacher@academy.com',
        password: 'password',
        name: 'Sheikh Ahmed',
        role: UserRole.TEACHER,
        bio: 'Senior Quran Instructor',
        avatar: 'https://picsum.photos/seed/sheikh/200/200',
        wallet: { coins: 500, currency: 'USD' },
        roles: ['teacher', 'moderator'],
        badges: [],
        isBanned: false,
        createdAt: new Date().toISOString(),
        lastSeenAt: new Date().toISOString()
      },
      {
        id: 'ST-001',
        username: 'yusuf_student',
        email: 'student@academy.com',
        password: 'password',
        name: 'Yusuf Ahmed',
        role: UserRole.STUDENT,
        bio: 'Seeking knowledge',
        avatar: 'https://picsum.photos/seed/user1/200/200',
        wallet: { coins: 250, currency: 'USD' },
        roles: ['student'],
        badges: [],
        isBanned: false,
        createdAt: new Date().toISOString(),
        lastSeenAt: new Date().toISOString()
      }
    ];
    localStorage.setItem(DB.USERS, JSON.stringify(initialUsers));
  }

  // 2. Rooms
  if (!localStorage.getItem(DB.ROOMS)) {
    // Use the fully compatible VOICE_ROOMS from constants
    localStorage.setItem(DB.ROOMS, JSON.stringify(VOICE_ROOMS));
  }

  // 3. Events
  if (!localStorage.getItem(DB.EVENTS)) {
    localStorage.setItem(DB.EVENTS, JSON.stringify(VOICE_EVENTS));
  }

  // 4. Notifications
  if (!localStorage.getItem(DB.NOTIFICATIONS)) {
    const notes: Notification[] = [
      { id: '1', userId: 'ST-001', type: 'SYSTEM', text: 'Welcome to Nurul Yaqin Voice Club!', timestamp: 'Just now', isRead: false },
    ];
    localStorage.setItem(DB.NOTIFICATIONS, JSON.stringify(notes));
  }

  // 5. Student System Data (Legacy Mocks)
  if (!localStorage.getItem(DB.STUDENTS)) {
    // We can just store a basic list for the admin panel
    localStorage.setItem(DB.STUDENTS, JSON.stringify([{ ...MOCK_STUDENT_PROFILE, status: 'Active' }]));
  }
  if (!localStorage.getItem(DB.CLASSES)) localStorage.setItem(DB.CLASSES, JSON.stringify(MOCK_LIVE_CLASSES));
  if (!localStorage.getItem(DB.ATTENDANCE)) localStorage.setItem(DB.ATTENDANCE, JSON.stringify(MOCK_ATTENDANCE));
};

// Initialize
seedDatabase();

// --- GENERIC DB HELPERS ---
const getCollection = <T>(key: string): T[] => JSON.parse(localStorage.getItem(key) || '[]');
const saveCollection = <T>(key: string, data: T[]) => localStorage.setItem(key, JSON.stringify(data));

// --- BACKEND SERVICE ---

export const backend = {
  
  // --- AUTHENTICATION ---
  auth: {
    login: async (email: string, password?: string): Promise<User> => {
      await delay(600);
      const users = getCollection<User>(DB.USERS);
      
      // Simple Login Logic
      const user = users.find(u => 
        (u.email === email || u.username === email) && 
        (!password || u.password === password)
      );
      
      if (!user) {
        throw new Error("Invalid email or password");
      }
      
      // Update last seen
      user.lastSeenAt = new Date().toISOString();
      const userIndex = users.findIndex(u => u.id === user.id);
      users[userIndex] = user;
      saveCollection(DB.USERS, users);
      
      localStorage.setItem(DB.SESSION, JSON.stringify(user));
      return user;
    },

    signup: async (userData: Partial<User> & { password?: string }): Promise<User> => {
      await delay(800);
      const users = getCollection<User>(DB.USERS);
      
      // Check duplicate
      if (users.find(u => u.email === userData.email)) {
        throw new Error("User with this email already exists");
      }

      const newUser: User = {
        id: `USER-${Date.now()}`,
        username: userData.username || `user_${Date.now()}`,
        email: userData.email,
        password: userData.password,
        name: userData.name || userData.username || 'New User',
        role: userData.role || UserRole.STUDENT,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`,
        wallet: { coins: 50, currency: 'USD' }, // Start bonus
        roles: [userData.role === UserRole.TEACHER ? 'teacher' : 'student'],
        badges: [],
        isBanned: false,
        createdAt: new Date().toISOString(),
        lastSeenAt: new Date().toISOString()
      };

      users.push(newUser);
      saveCollection(DB.USERS, users);
      localStorage.setItem(DB.SESSION, JSON.stringify(newUser));
      return newUser;
    },

    logout: async () => {
      await delay(300);
      localStorage.removeItem(DB.SESSION);
    },

    getCurrentUser: async (): Promise<User | null> => {
      await delay(100);
      const session = localStorage.getItem(DB.SESSION);
      if (!session) return null;
      // Refresh user data from DB to get latest wallet balance
      const sessionUser = JSON.parse(session);
      const users = getCollection<User>(DB.USERS);
      const freshUser = users.find(u => u.id === sessionUser.id);
      return freshUser || sessionUser;
    }
  },

  // --- VOICE CLUB ---
  voice: {
    getRooms: async (): Promise<VoiceRoom[]> => {
      await delay(400);
      return getCollection<VoiceRoom>(DB.ROOMS);
    },

    createRoom: async (data: Partial<VoiceRoom>): Promise<VoiceRoom> => {
      await delay(800);
      const rooms = getCollection<VoiceRoom>(DB.ROOMS);
      const currentUser = JSON.parse(localStorage.getItem(DB.SESSION) || '{}');
      
      const newRoom: VoiceRoom = {
        id: `RM-${Date.now()}`,
        ownerId: currentUser.id || 'unknown',
        title: data.title || 'Untitled Room',
        topic: data.topic || 'General',
        category: data.category || 'General',
        description: data.description || '',
        type: 'public',
        status: 'live',
        participantCount: 1,
        speakerCount: 1,
        hostName: currentUser.name || 'Host',
        tags: data.tags || [],
        createdAt: new Date().toISOString()
      };
      
      rooms.unshift(newRoom);
      saveCollection(DB.ROOMS, rooms);
      
      // Auto-join creator
      await backend.voice.joinRoom(newRoom.id, currentUser.id, VoiceRole.HOST);
      
      return newRoom;
    },

    joinRoom: async (roomId: string, userId: string, role: VoiceRole = VoiceRole.LISTENER): Promise<Participant> => {
        const participants = getCollection<Participant>(DB.PARTICIPANTS);
        
        // Check if already joined
        const existing = participants.find(p => p.roomId === roomId && p.userId === userId && !p.leftAt);
        if (existing) return existing;

        const newParticipant: Participant = {
            id: `P-${Date.now()}`,
            roomId,
            userId,
            role,
            isMuted: true,
            isHandRaised: false,
            joinedAt: new Date().toISOString()
        };
        participants.push(newParticipant);
        saveCollection(DB.PARTICIPANTS, participants);

        // Update Room Counters
        const rooms = getCollection<VoiceRoom>(DB.ROOMS);
        const roomIdx = rooms.findIndex(r => r.id === roomId);
        if (roomIdx !== -1) {
            rooms[roomIdx].participantCount += 1;
            if (role !== VoiceRole.LISTENER) rooms[roomIdx].speakerCount += 1;
            saveCollection(DB.ROOMS, rooms);
        }

        return newParticipant;
    },

    leaveRoom: async (roomId: string, userId: string) => {
        const participants = getCollection<Participant>(DB.PARTICIPANTS);
        const idx = participants.findIndex(p => p.roomId === roomId && p.userId === userId && !p.leftAt);
        if (idx !== -1) {
            participants[idx].leftAt = new Date().toISOString();
            saveCollection(DB.PARTICIPANTS, participants);
            
            // Update counts
            const rooms = getCollection<VoiceRoom>(DB.ROOMS);
            const rIdx = rooms.findIndex(r => r.id === roomId);
            if (rIdx !== -1) {
                rooms[rIdx].participantCount = Math.max(0, rooms[rIdx].participantCount - 1);
                saveCollection(DB.ROOMS, rooms);
            }
        }
    },

    getParticipants: async (roomId: string): Promise<VoiceUser[]> => {
        await delay(300);
        // Join Participants Table with Users Table
        const allParticipants = getCollection<Participant>(DB.PARTICIPANTS);
        const roomParticipants = allParticipants.filter(p => p.roomId === roomId && !p.leftAt);
        const allUsers = getCollection<User>(DB.USERS);

        // Map to VoiceUser (UI Model)
        return roomParticipants.map(p => {
            const user = allUsers.find(u => u.id === p.userId);
            if (!user) return null;
            
            // Mock social stats for demo if missing
            const voiceUser: VoiceUser = {
                ...user,
                roomRole: p.role,
                isMuted: p.isMuted,
                isHandRaised: p.isHandRaised,
                joinedAt: p.joinedAt,
                followers: 100 + Math.floor(Math.random() * 500),
                following: 50,
                isFollowing: false,
                networkQuality: 1, // Default, will be updated by Agora mock
                volumeLevel: 0
            };
            return voiceUser;
        }).filter(Boolean) as VoiceUser[];
    },

    getEvents: async (): Promise<VoiceEvent[]> => {
      await delay(300);
      return getCollection<VoiceEvent>(DB.EVENTS);
    },

    rsvpEvent: async (eventId: string, userId: string) => {
      await delay(400);
      const events = getCollection<VoiceEvent>(DB.EVENTS);
      const updatedEvents = events.map(e => {
        if (e.id === eventId) return { ...e, isRegistered: true };
        return e;
      });
      saveCollection(DB.EVENTS, updatedEvents);
      
      // Notify
      const notes = getCollection<Notification>(DB.NOTIFICATIONS);
      notes.unshift({
        id: `nt-${Date.now()}`,
        userId,
        type: 'EVENT',
        text: 'Reminder set for event!',
        timestamp: 'Just now',
        isRead: false
      });
      saveCollection(DB.NOTIFICATIONS, notes);
    }
  },

  // --- WALLET & TRANSACTIONS ---
  wallet: {
    getBalance: async (userId: string): Promise<number> => {
      await delay(200);
      const users = getCollection<User>(DB.USERS);
      const user = users.find(u => u.id === userId);
      return user ? user.wallet.coins : 0;
    },

    topUp: async (userId: string, amount: number, packageId: string) => {
        await delay(800);
        // 1. Create Transaction
        const transactions = getCollection<Transaction>(DB.TRANSACTIONS);
        transactions.push({
            id: `TX-${Date.now()}`,
            fromUserId: 'SYSTEM',
            toUserId: userId,
            amount: amount,
            type: 'topup',
            itemId: packageId,
            createdAt: new Date().toISOString(),
            status: 'completed'
        });
        saveCollection(DB.TRANSACTIONS, transactions);

        // 2. Update User Balance
        const users = getCollection<User>(DB.USERS);
        const uIdx = users.findIndex(u => u.id === userId);
        if (uIdx !== -1) {
            users[uIdx].wallet.coins += amount;
            saveCollection(DB.USERS, users);
            return users[uIdx].wallet.coins;
        }
        return 0;
    },

    sendGift: async (fromId: string, toId: string, giftId: string, cost: number) => {
        await delay(500);
        const users = getCollection<User>(DB.USERS);
        const senderIdx = users.findIndex(u => u.id === fromId);
        const receiverIdx = users.findIndex(u => u.id === toId);

        if (senderIdx === -1 || users[senderIdx].wallet.coins < cost) {
            throw new Error("Insufficient funds");
        }

        // Deduct
        users[senderIdx].wallet.coins -= cost;
        // Add (maybe sender gets points, receiver gets value? For now simple transfer or burn)
        // Let's assume receiver gets nothing in this model (burn) or simulated value
        // users[receiverIdx].wallet.coins += cost; // Optional
        
        saveCollection(DB.USERS, users);

        // Transaction Log
        const transactions = getCollection<Transaction>(DB.TRANSACTIONS);
        transactions.push({
            id: `TX-${Date.now()}`,
            fromUserId: fromId,
            toUserId: toId,
            amount: cost,
            type: 'gift',
            itemId: giftId,
            createdAt: new Date().toISOString(),
            status: 'completed'
        });
        saveCollection(DB.TRANSACTIONS, transactions);
        
        return users[senderIdx].wallet.coins;
    }
  },

  // --- STUDENT SYSTEM (LEGACY WRAPPERS) ---
  students: {
    getAll: async () => { await delay(500); return getCollection(DB.STUDENTS); },
    delete: async (id: string) => { 
        const list = getCollection<any>(DB.STUDENTS).filter(s => s.id !== id);
        saveCollection(DB.STUDENTS, list);
    }
  },
  admin: {
    getStats: async () => {
        await delay(400);
        const students = getCollection<any>(DB.STUDENTS);
        return {
            totalStudents: students.length,
            activeStudents: students.filter(s => s.status === 'Active').length,
            attendanceRate: 94,
            completionRate: 88,
            totalTeachers: 12,
            pendingCertificates: 5
        };
    }
  },
  teacher: {
      getClasses: async () => MOCK_TEACHER_CLASSES // Mock for now
  },

  // --- NOTIFICATIONS ---
  notifications: {
    getAll: async (): Promise<Notification[]> => {
      await delay(200);
      return getCollection<Notification>(DB.NOTIFICATIONS);
    }
  }
};
