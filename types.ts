
export type Language = 'en' | 'ar' | 'om';

export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN',
  GUEST = 'GUEST'
}

export enum VoiceRole {
  HOST = 'HOST',
  MODERATOR = 'MODERATOR',
  SPEAKER = 'SPEAKER',
  LISTENER = 'LISTENER'
}

export enum View {
  LANDING = 'LANDING',
  DASHBOARD = 'DASHBOARD',
  LIVE_CLASS = 'LIVE_CLASS',
  QURAN_READER = 'QURAN_READER',
  AI_TUTOR = 'AI_TUTOR',
  VOICE_CLUB = 'VOICE_CLUB',
  STUDENT_SYSTEM = 'STUDENT_SYSTEM',
  LOGIN = 'LOGIN'
}

// --- DATABASE MODELS ---

export interface User {
  id: string;
  email?: string;
  password?: string; // For mock auth
  username: string;
  name: string; // displayName
  avatar: string; // avatarUrl
  role: UserRole;
  bio?: string;
  wallet: {
    coins: number;
    currency: string;
  };
  roles: string[]; // ['user', 'moderator', etc]
  badges: Achievement[];
  isBanned: boolean;
  createdAt: string;
  lastSeenAt: string;
}

export interface Achievement {
  id: string;
  name: string;
  icon: string;
  description: string;
  awardedAt?: string;
  color?: string;
}

// Room Models
export type RoomType = 'public' | 'private' | 'social';
export type RoomStatus = 'scheduled' | 'live' | 'ended' | 'closed';

export interface VoiceRoom {
  id: string;
  ownerId: string;
  title: string;
  topic: string;
  category: string;
  description: string;
  type: RoomType;
  status: RoomStatus;
  
  // Counters (Denormalized)
  participantCount: number;
  speakerCount: number;
  
  hostName: string; // Cached for display
  tags: string[];
  
  createdAt: string;
  startedAt?: string;
  endedAt?: string;
}

export interface VoiceUser extends User {
  // Runtime state for UI (Joined User)
  roomRole: VoiceRole;
  isMuted: boolean;
  isHandRaised: boolean;
  isSpeaking?: boolean;
  volumeLevel?: number;
  networkQuality?: NetworkQuality;
  joinedAt?: string;
  
  // Moderation
  isChatBanned?: boolean;
  
  // Social
  followers: number;
  following: number;
  isFollowing?: boolean;
}

// Participant Record (DB Table)
export interface Participant {
  id: string; // usually same as userId or composite
  roomId: string;
  userId: string;
  role: VoiceRole;
  isMuted: boolean;
  isHandRaised: boolean;
  joinedAt: string;
  leftAt?: string;
  deviceId?: string;
}

// Chat & Messaging
export type MessageType = 'text' | 'system' | 'gift' | 'alert';

export interface ChatMessage {
  id: string;
  roomId?: string;
  senderId?: string; // null for system
  senderName?: string;
  senderAvatar?: string;
  type: MessageType;
  text: string; // content
  timestamp: Date;
  metadata?: any; // for gifts or replyTo
}

// Economy
export interface Gift {
  id: string;
  name: string;
  icon: string;
  cost: number;
}

export type TransactionType = 'gift' | 'purchase' | 'topup';

export interface Transaction {
  id: string;
  fromUserId: string;
  toUserId?: string;
  amount: number; // Coins
  type: TransactionType;
  itemId?: string; // Gift ID or Package ID
  createdAt: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface VoiceEvent {
  id: string;
  title: string;
  time: string;
  date: string; // Display string like "Tomorrow" or ISO
  host: string; // Host Name
  hostId?: string;
  description?: string;
  isRegistered?: boolean;
  roomId?: string; // Linked room if live
}

export interface Notification {
  id: string;
  userId: string;
  type: 'FOLLOW' | 'EVENT' | 'SYSTEM' | 'GIFT' | 'MODERATION';
  text: string;
  timestamp: string;
  isRead: boolean;
  payload?: any;
}

// Misc
export type NetworkQuality = 0 | 1 | 2 | 3 | 4 | 5;

export interface AudioSettings {
  noiseSuppression: boolean;
  echoCancellation: boolean;
  highQuality: boolean;
  spatialAudio: boolean;
}

export interface Translation {
  title: string;
  subtitle: string;
  cta: string;
  features: string;
  liveClasses: string;
  aiTutor: string;
  quranLibrary: string;
  voiceClub: string;
  studentSystem: string;
  login: string;
  logout: string;
  dashboard: string;
  studentPortal: string;
  teacherPortal: string;
  upcomingClasses: string;
  progress: string;
  courseCompletion: string;
  attendance: string;
  startClass: string;
  joinClass: string;
  askAI: string;
  typeMessage: string;
  welcome: string;
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  time: string;
  students: number;
  image: string;
}

export interface LiveClass {
  id: string;
  title: string;
  instructorId: string;
  instructorName: string;
  topic: string;
  startTime: Date;
  durationMinutes: number;
  status: 'SCHEDULED' | 'LIVE' | 'ENDED';
  participants: number;
}

export interface ClassParticipant {
  id: string;
  name: string;
  role: 'HOST' | 'STUDENT';
  isMuted: boolean;
  isVideoOn: boolean;
  isHandRaised: boolean;
  avatar: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  age: number;
  country: string;
  program: string; 
  level: string; 
  joinDate: string;
  guardianName: string;
  guardianContact: string;
  avatar: string;
  qrCodeData: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  className: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
  notes?: string;
}

export interface ProgressReport {
  month: string;
  surahsMemorized: number;
  tajweedScore: number; // 0-100
  attendanceRate: number; // 0-100
  teacherComments: string;
}

export interface Certificate {
  id: string;
  title: string;
  courseName: string;
  issueDate: string;
  instructor: string;
  verificationCode: string;
}
