

import { Language, Translation, Course, VoiceRoom, VoiceEvent, LiveClass, Achievement, StudentProfile, AttendanceRecord, ProgressReport, Certificate } from './types';

export const TRANSLATIONS: Record<Language, Translation> = {
  en: {
    title: "Nurul Yaqin Online Quran Academy",
    subtitle: "Illuminating Hearts with the Light of the Quran",
    cta: "Start Your Journey",
    features: "Our Features",
    liveClasses: "Live Video Classes",
    aiTutor: "AI Tajweed Tutor",
    quranLibrary: "Quran & Tafsir",
    voiceClub: "Voice Halqa Club",
    studentSystem: "Student Portal",
    login: "Login",
    logout: "Logout",
    dashboard: "Dashboard",
    studentPortal: "Student Portal",
    teacherPortal: "Teacher Portal",
    upcomingClasses: "Upcoming Classes",
    progress: "My Progress",
    courseCompletion: "Course Completion",
    attendance: "Attendance",
    startClass: "Start Live Session",
    joinClass: "Join Class",
    askAI: "Ask AI Tutor about Tajweed...",
    typeMessage: "Type your question...",
    welcome: "Welcome back",
  },
  ar: {
    title: "أكاديمية نور اليقين لتحفيظ القرآن الكريم",
    subtitle: "نور القلوب بنور القرآن",
    cta: "ابدأ رحلتك",
    features: "ميزاتنا",
    liveClasses: "دروس مباشرة",
    aiTutor: "المعلم الذكي",
    quranLibrary: "المصحف والتفسير",
    voiceClub: "حلقة صوتية",
    studentSystem: "بوابة الطالب",
    login: "تسجيل الدخول",
    logout: "تسجيل الخروج",
    dashboard: "لوحة التحكم",
    studentPortal: "بوابة الطالب",
    teacherPortal: "بوابة المعلم",
    upcomingClasses: "الدروس القادمة",
    progress: "تقدمي",
    courseCompletion: "إكمال الدورة",
    attendance: "الحضور",
    startClass: "بدء الجلسة",
    joinClass: "انضم للدرس",
    askAI: "اسأل المعلم الذكي عن التجويد...",
    typeMessage: "اكتب سؤالك...",
    welcome: "مرحباً بك",
  },
  om: {
    title: "Akkaadaamii Qur'aana Onlaayinii Nuurul Yaqiin",
    subtitle: "Qalbii Ifa Qur'aanaan Ibsuu",
    cta: "Imala Keessan Eegalaa",
    features: "Amaloota Keenya",
    liveClasses: "Daree Kallattii",
    aiTutor: "Barsiisaa AI",
    quranLibrary: "Qur'aana & Tafsiira",
    voiceClub: "Waliin Dubbisuu",
    studentSystem: "Portaala Barataa",
    login: "Seuni",
    logout: "Ba'i",
    dashboard: "Daashboordii",
    studentPortal: "Portaala Barataa",
    teacherPortal: "Portaala Barsiisaa",
    upcomingClasses: "Dareewwan Dhufan",
    progress: "Guddina Koo",
    courseCompletion: "Xumura Koorsii",
    attendance: "Hirmaannaa",
    startClass: "Daree Eegali",
    joinClass: "Daree Seeni",
    askAI: "Waa'ee Tajwiidaa AI Gaafadhu...",
    typeMessage: "Gaaffii kee barreessi...",
    welcome: "Baga Nagaan Dhuftan",
  }
};

export const MOCK_COURSES: Course[] = [
  {
    id: '1',
    title: 'Tajweed Fundamentals',
    instructor: 'Sheikh Ahmed Al-Misri',
    time: '10:00 AM - 11:30 AM',
    students: 15,
    image: 'https://picsum.photos/seed/quran1/400/250'
  },
  {
    id: '2',
    title: 'Hifz Program (Juz 30)',
    instructor: 'Ustaaz Mohammed Ali',
    time: '2:00 PM - 4:00 PM',
    students: 8,
    image: 'https://picsum.photos/seed/quran2/400/250'
  },
  {
    id: '3',
    title: 'Tafsir Surah Al-Kahf',
    instructor: 'Dr. Fatima Hassan',
    time: '6:00 PM - 7:30 PM',
    students: 45,
    image: 'https://picsum.photos/seed/quran3/400/250'
  }
];

export const MOCK_LIVE_CLASSES: LiveClass[] = [
  {
    id: '101',
    title: 'Advanced Tajweed: Nun Sakinah',
    instructorId: 'teacher1',
    instructorName: 'Sheikh Ahmed',
    topic: 'Tajweed',
    startTime: new Date(Date.now() - 1000 * 60 * 15), // Started 15 mins ago
    durationMinutes: 60,
    status: 'LIVE',
    participants: 24
  },
  {
    id: '102',
    title: 'Tafsir: Surah Al-Mulk',
    instructorId: 'teacher2',
    instructorName: 'Dr. Fatima',
    topic: 'Tafsir',
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 2), // In 2 hours
    durationMinutes: 90,
    status: 'SCHEDULED',
    participants: 0
  },
  {
    id: '103',
    title: 'Hifz Revision Circle',
    instructorId: 'teacher3',
    instructorName: 'Ust. Bilal',
    topic: 'Hifz',
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 24), // Tomorrow
    durationMinutes: 120,
    status: 'SCHEDULED',
    participants: 0
  }
];

export const SURAHS = [
  { number: 1, name: "Al-Fatiha", ayahs: 7 },
  { number: 18, name: "Al-Kahf", ayahs: 110 },
  { number: 36, name: "Ya-Sin", ayahs: 83 },
  { number: 67, name: "Al-Mulk", ayahs: 30 },
  { number: 112, name: "Al-Ikhlas", ayahs: 4 },
];

export const VOICE_ROOMS: VoiceRoom[] = [
  {
    id: '1',
    ownerId: 'TEACHER-001',
    title: 'Surah Al-Kahf Recitation Circle',
    topic: 'Weekly Recitation',
    category: 'Quran',
    description: 'Join us for our weekly recitation of Surah Al-Kahf. All levels welcome to listen or recite.',
    type: 'public',
    status: 'live',
    participantCount: 42,
    speakerCount: 5,
    hostName: 'Sheikh Ahmed',
    tags: ['Recitation', 'Jumuah', 'Open Mic'],
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    ownerId: 'TEACHER-002',
    title: 'Tajweed Correction Clinic',
    topic: 'Education',
    category: 'Tajweed',
    description: 'Bring your questions about Nun Sakinah rules. Expert teachers available.',
    type: 'public',
    status: 'live',
    participantCount: 156,
    speakerCount: 3,
    hostName: 'Ustadha Maryam',
    tags: ['Learning', 'Q&A', 'Tajweed'],
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    ownerId: 'USER-001',
    title: 'Morning Adhkar & Reflection',
    topic: 'Spirituality',
    category: 'General',
    description: 'Start your day with remembrance of Allah. Silent listening mode available.',
    type: 'public',
    status: 'live',
    participantCount: 89,
    speakerCount: 1,
    hostName: 'Brother Yusuf',
    tags: ['Adhkar', 'Morning', 'Meditation'],
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    ownerId: 'TEACHER-003',
    title: 'Sisters Tafsir Circle',
    topic: 'Women in Quran',
    category: 'Sisters',
    description: 'Discussing the stories of women mentioned in the Quran.',
    type: 'public',
    status: 'live',
    participantCount: 65,
    speakerCount: 4,
    hostName: 'Sister Aisha',
    tags: ['Tafsir', 'Sisters Only'],
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    ownerId: 'TEACHER-004',
    title: 'Youth Quran Challenge',
    topic: 'Competition',
    category: 'Youth',
    description: 'Who can recite Surah An-Naba the best? Prizes for winners!',
    type: 'public',
    status: 'live',
    participantCount: 210,
    speakerCount: 8,
    hostName: 'Ust. Bilal',
    tags: ['Competition', 'Youth', 'Hifz'],
    createdAt: new Date().toISOString()
  }
];

export const VOICE_EVENTS: VoiceEvent[] = [
  {
    id: '1',
    title: 'Ramadan Preparation Talk',
    time: '8:00 PM',
    date: 'Tomorrow',
    host: 'Dr. Bilal Philips'
  },
  {
    id: '2',
    title: 'Youth Quran Competition Info',
    time: '5:00 PM',
    date: 'Saturday',
    host: 'Ust. Nouman'
  },
  {
    id: '3',
    title: 'Live Q&A: Fiqh of Salah',
    time: '2:00 PM',
    date: 'Sunday',
    host: 'Sheikh Omar'
  }
];

export const ACHIEVEMENTS_LIST: Achievement[] = [
  { id: '1', name: 'Hafiz', icon: '📖', description: 'Memorized the Holy Quran', color: 'bg-emerald-100 text-emerald-700' },
  { id: '2', name: 'Top Speaker', icon: '🎙️', description: 'Active contributor in discussions', color: 'bg-blue-100 text-blue-700' },
  { id: '3', name: 'Early Bird', icon: '🌅', description: 'Joins Morning Adhkar regularly', color: 'bg-orange-100 text-orange-700' },
  { id: '4', name: 'Supporter', icon: '💎', description: 'Generous gifter', color: 'bg-purple-100 text-purple-700' },
  { id: '5', name: 'Teacher', icon: '🎓', description: 'Certified Instructor', color: 'bg-gold-100 text-gold-700' },
];

// --- Student System Mock Data ---
export const MOCK_STUDENT_PROFILE: StudentProfile = {
  id: 'NY-2024-042',
  name: 'Yusuf Ahmed',
  age: 19,
  country: 'Ethiopia',
  program: 'Hifz & Tajweed Advanced',
  level: 'Level 4',
  joinDate: '12 Sept 2023',
  guardianName: 'Ahmed Mohammed',
  guardianContact: '+251 91 123 4567',
  avatar: 'https://picsum.photos/seed/user1/200/200',
  qrCodeData: 'https://nurulyaqin.com/verify/NY-2024-042'
};

export const MOCK_ATTENDANCE: AttendanceRecord[] = [
  { id: '1', date: 'Oct 25, 2024', className: 'Tajweed Level 4', status: 'PRESENT' },
  { id: '2', date: 'Oct 24, 2024', className: 'Hifz Circle', status: 'PRESENT' },
  { id: '3', date: 'Oct 23, 2024', className: 'Tafsir Session', status: 'LATE', notes: 'Joined 15 mins late' },
  { id: '4', date: 'Oct 22, 2024', className: 'Tajweed Level 4', status: 'ABSENT', notes: 'Sick leave approved' },
  { id: '5', date: 'Oct 21, 2024', className: 'Hifz Circle', status: 'PRESENT' },
];

export const MOCK_PROGRESS: ProgressReport[] = [
  { month: 'Aug', surahsMemorized: 2, tajweedScore: 78, attendanceRate: 90, teacherComments: 'Good start.' },
  { month: 'Sep', surahsMemorized: 3, tajweedScore: 82, attendanceRate: 95, teacherComments: 'Improving makharij.' },
  { month: 'Oct', surahsMemorized: 4, tajweedScore: 88, attendanceRate: 100, teacherComments: 'Excellent progress in Juz Amma.' },
];

export const MOCK_CERTIFICATES: Certificate[] = [
  { 
    id: 'C-101', 
    title: 'Tajweed Level 3 Completion', 
    courseName: 'Intermediate Tajweed Rules', 
    issueDate: 'August 15, 2024', 
    instructor: 'Sheikh Ahmed Al-Misri', 
    verificationCode: 'NY-CRT-8821' 
  },
  { 
    id: 'C-102', 
    title: 'Juz Amma Memorization', 
    courseName: 'Hifz Beginner Program', 
    issueDate: 'June 30, 2024', 
    instructor: 'Ustaaz Mohammed Ali', 
    verificationCode: 'NY-CRT-1102' 
  }
];

// --- Admin & Teacher Portal Mocks ---

export const MOCK_ADMIN_STATS = {
  totalStudents: 1250,
  activeStudents: 980,
  attendanceRate: 92,
  completionRate: 85,
  totalTeachers: 45,
  pendingCertificates: 12
};

export const MOCK_ALL_STUDENTS = [
  { id: 'ST-001', name: 'Yusuf Ahmed', level: 'Level 4', country: 'Ethiopia', status: 'Active' },
  { id: 'ST-002', name: 'Fatima Ali', level: 'Level 2', country: 'UAE', status: 'Active' },
  { id: 'ST-003', name: 'Omar Ibrahim', level: 'Level 1', country: 'UK', status: 'Inactive' },
  { id: 'ST-004', name: 'Zainab Hassan', level: 'Hifz', country: 'USA', status: 'Active' },
  { id: 'ST-005', name: 'Bilal Oromo', level: 'Tajweed', country: 'Ethiopia', status: 'Active' },
];

export const MOCK_TEACHER_CLASSES = [
  { id: 'CL-01', title: 'Tajweed Level 4 - Mon/Thu', time: '10:00 AM', students: 24 },
  { id: 'CL-02', title: 'Hifz Circle - Daily', time: '05:00 AM', students: 12 },
  { id: 'CL-03', title: 'Tafsir Basics - Fri', time: '08:00 PM', students: 45 },
];

export const MOCK_CLASS_STUDENTS = [
  { id: 'ST-001', name: 'Yusuf Ahmed', status: 'PRESENT' },
  { id: 'ST-004', name: 'Zainab Hassan', status: 'ABSENT' },
  { id: 'ST-005', name: 'Bilal Oromo', status: 'LATE' },
];
