
import React, { useState, useEffect } from 'react';
import { 
  User, QrCode, Download, Calendar, CheckCircle, XCircle, Clock, 
  Award, TrendingUp, ChevronRight, BookOpen, UserCheck, 
  MapPin, Phone, Users, Edit, Trash, CheckSquare, Search,
  Filter, Upload, Book, FileCheck, LogOut, Briefcase, FileText, BarChart2,
  Loader2, RefreshCw
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line
} from 'recharts';
import { 
  MOCK_STUDENT_PROFILE, MOCK_ATTENDANCE, MOCK_PROGRESS, MOCK_CERTIFICATES,
  MOCK_TEACHER_CLASSES, MOCK_CLASS_STUDENTS
} from '../../constants';
import { UserRole, User as AppUser, StudentProfile } from '../../types';
import { backend } from '../../services/backend';

type StudentTab = 'PROFILE' | 'ATTENDANCE' | 'PROGRESS' | 'CERTIFICATES';
type AdminTab = 'DASHBOARD' | 'STUDENTS' | 'TEACHERS' | 'CERTIFICATES';
type TeacherTab = 'CLASSES' | 'ATTENDANCE' | 'PROGRESS' | 'ASSIGNMENTS';

interface StudentSystemProps {
  user: AppUser | null;
}

const StudentSystem: React.FC<StudentSystemProps> = ({ user }) => {
  
  if (!user) return <div className="p-8 text-center text-red-500">Please login to access the portal.</div>;

  if (user.role === UserRole.ADMIN) {
    return <AdminPortalView />;
  } else if (user.role === UserRole.TEACHER) {
    return <TeacherPortalView />;
  } else {
    return <StudentPortalView />;
  }
};

// --- STUDENT VIEW ---
const StudentPortalView = () => {
  const [activeTab, setActiveTab] = useState<StudentTab>('PROFILE');
  const [profile, setProfile] = useState(MOCK_STUDENT_PROFILE);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching *my* profile. 
    // In a real app, backend.students.getMyProfile()
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  if (isLoading) return <LoadingSpinner />;

  const renderProfile = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <User className="mr-2 text-emerald-600"/> Personal Information
        </h3>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
             <img src={profile.avatar} alt="Student" className="w-24 h-24 rounded-full border-4 border-emerald-50 object-cover"/>
             <div>
                <h2 className="text-2xl font-bold">{profile.name}</h2>
                <p className="text-gray-500 font-medium">{profile.id}</p>
             </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-xs text-gray-500 uppercase font-bold">Age</p>
                <p className="font-semibold text-gray-800">{profile.age} Years Old</p>
             </div>
             <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-xs text-gray-500 uppercase font-bold">Country</p>
                <p className="font-semibold text-gray-800 flex items-center"><MapPin size={14} className="mr-1 text-emerald-500"/> {profile.country}</p>
             </div>
             <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-xs text-gray-500 uppercase font-bold">Program</p>
                <p className="font-semibold text-gray-800">{profile.program}</p>
             </div>
             <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-xs text-gray-500 uppercase font-bold">Level</p>
                <p className="font-semibold text-gray-800">{profile.level}</p>
             </div>
             <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-xs text-gray-500 uppercase font-bold">Joined</p>
                <p className="font-semibold text-gray-800">{profile.joinDate}</p>
             </div>
             <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-xs text-gray-500 uppercase font-bold">Guardian</p>
                <p className="font-semibold text-gray-800">{profile.guardianName}</p>
                <p className="text-xs text-gray-500 flex items-center mt-1"><Phone size={10} className="mr-1"/> {profile.guardianContact}</p>
             </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center w-full">
           <QrCode className="mr-2 text-emerald-600"/> Digital Student ID
        </h3>
        <div className="w-full max-w-sm bg-gradient-to-br from-emerald-900 to-emerald-700 rounded-3xl overflow-hidden shadow-2xl relative text-white h-[500px] flex flex-col">
           <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
           <div className="p-6 text-center relative z-10 border-b border-white/10">
              <div className="inline-block p-2 bg-white rounded-full mb-2">
                 <div className="w-8 h-8 rounded-full border-2 border-gold-500 bg-white flex items-center justify-center text-emerald-800 font-bold font-arabic text-xl">ن</div>
              </div>
              <h2 className="font-bold text-lg leading-none">Nurul Yaqin Academy</h2>
              <p className="text-emerald-200 text-xs tracking-wider uppercase mt-1">Student Identity Card</p>
           </div>
           <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
              <div className="w-32 h-32 rounded-full border-4 border-gold-500 shadow-lg overflow-hidden mb-4 bg-gray-200">
                 <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover"/>
              </div>
              <h1 className="text-2xl font-bold mb-1">{profile.name}</h1>
              <p className="bg-white/20 px-3 py-1 rounded-full text-sm font-mono tracking-wide mb-6">{profile.id}</p>
              <div className="w-full grid grid-cols-2 gap-4 text-center text-sm">
                 <div>
                    <p className="text-emerald-300 text-xs uppercase">Program</p>
                    <p className="font-semibold">{profile.program}</p>
                 </div>
                 <div>
                    <p className="text-emerald-300 text-xs uppercase">Valid Thru</p>
                    <p className="font-semibold">Dec 2024</p>
                 </div>
              </div>
           </div>
           <div className="bg-white p-4 flex items-center justify-between relative z-10 text-gray-900">
               <div className="text-left">
                  <p className="text-[10px] text-gray-400">Scan to verify student status</p>
                  <p className="font-bold text-xs text-emerald-800">nurulyaqin.com/verify</p>
               </div>
               <div className="bg-white p-1">
                  <QrCode size={48} className="text-gray-900"/>
               </div>
           </div>
        </div>
        <button className="mt-8 flex items-center bg-gray-900 text-white px-6 py-3 rounded-full hover:bg-black transition shadow-lg">
           <Download size={18} className="mr-2"/> Download ID Card
        </button>
      </div>
    </div>
  );

  const renderAttendance = () => {
    const total = MOCK_ATTENDANCE.length;
    const present = MOCK_ATTENDANCE.filter(r => r.status === 'PRESENT').length;
    const late = MOCK_ATTENDANCE.filter(r => r.status === 'LATE').length;
    const absent = total - present - late;
    const rate = Math.round(((present + late * 0.5) / total) * 100);

    return (
       <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-gray-500 text-sm font-medium">Attendance Rate</p>
                <p className={`text-3xl font-bold ${rate >= 90 ? 'text-green-600' : 'text-orange-500'}`}>{rate}%</p>
             </div>
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-gray-500 text-sm font-medium">Classes Attended</p>
                <p className="text-3xl font-bold text-gray-900">{present}</p>
             </div>
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-gray-500 text-sm font-medium">Late Arrivals</p>
                <p className="text-3xl font-bold text-orange-500">{late}</p>
             </div>
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-gray-500 text-sm font-medium">Absences</p>
                <p className="text-3xl font-bold text-red-500">{absent}</p>
             </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-gray-900">Recent Attendance History</h3>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                      <tr>
                         <th className="px-6 py-4">Date</th>
                         <th className="px-6 py-4">Class</th>
                         <th className="px-6 py-4">Status</th>
                         <th className="px-6 py-4">Teacher Notes</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                      {MOCK_ATTENDANCE.map(record => (
                         <tr key={record.id} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{record.date}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{record.className}</td>
                            <td className="px-6 py-4">
                               <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                  record.status === 'PRESENT' ? 'bg-green-100 text-green-800' :
                                  record.status === 'LATE' ? 'bg-orange-100 text-orange-800' :
                                  'bg-red-100 text-red-800'
                               }`}>
                                  {record.status === 'PRESENT' && <CheckCircle size={12} className="mr-1"/>}
                                  {record.status === 'LATE' && <Clock size={12} className="mr-1"/>}
                                  {record.status === 'ABSENT' && <XCircle size={12} className="mr-1"/>}
                                  {record.status}
                               </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 italic">{record.notes || '-'}</td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
       </div>
    );
  };

  const renderProgress = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <h3 className="font-bold text-gray-900 mb-6 flex items-center">
                <TrendingUp className="mr-2 text-blue-500"/> Tajweed Performance Score
             </h3>
             <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={MOCK_PROGRESS}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb"/>
                      <XAxis dataKey="month" axisLine={false} tickLine={false}/>
                      <YAxis axisLine={false} tickLine={false} domain={[0, 100]}/>
                      <Tooltip />
                      <Line type="monotone" dataKey="tajweedScore" stroke="#10b981" strokeWidth={3} activeDot={{ r: 8 }} />
                   </LineChart>
                </ResponsiveContainer>
             </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <h3 className="font-bold text-gray-900 mb-6 flex items-center">
                <BookOpen className="mr-2 text-gold-500"/> Surahs Memorized
             </h3>
             <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={MOCK_PROGRESS}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb"/>
                      <XAxis dataKey="month" axisLine={false} tickLine={false}/>
                      <YAxis axisLine={false} tickLine={false}/>
                      <Tooltip />
                      <Bar dataKey="surahsMemorized" fill="#fbbf24" radius={[6, 6, 0, 0]} />
                   </BarChart>
                </ResponsiveContainer>
             </div>
          </div>
       </div>
       <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Teacher Progress Notes</h3>
          <div className="grid gap-4">
             {MOCK_PROGRESS.map((p, i) => (
                <div key={i} className="flex items-start bg-gray-50 p-4 rounded-xl">
                   <div className="bg-white p-2 rounded-lg text-center min-w-[3rem] mr-4 shadow-sm">
                      <span className="block font-bold text-emerald-600 text-sm uppercase">{p.month}</span>
                      <span className="block text-xs text-gray-400">2024</span>
                   </div>
                   <div>
                      <p className="text-gray-800 font-medium">{p.teacherComments}</p>
                      <div className="flex space-x-4 mt-2 text-xs text-gray-500">
                         <span>Tajweed: <span className="text-emerald-600 font-bold">{p.tajweedScore}/100</span></span>
                         <span>Attendance: <span className="text-blue-600 font-bold">{p.attendanceRate}%</span></span>
                      </div>
                   </div>
                </div>
             ))}
          </div>
       </div>
    </div>
  );

  const renderCertificates = () => (
    <div className="animate-in zoom-in-95 duration-300">
       <h3 className="font-bold text-xl text-gray-900 mb-6">Earned Certificates</h3>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOCK_CERTIFICATES.map(cert => (
             <div key={cert.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition group cursor-pointer relative">
                <div className="h-48 bg-emerald-900 relative p-8 flex flex-col items-center justify-center text-center text-white bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]">
                   <Award size={48} className="text-gold-400 mb-4"/>
                   <h4 className="font-arabic text-2xl font-bold mb-1">Certificate of Completion</h4>
                   <p className="text-emerald-200 text-sm">{cert.courseName}</p>
                </div>
                <div className="p-6">
                   <h5 className="font-bold text-lg text-gray-900 mb-1">{cert.title}</h5>
                   <p className="text-sm text-gray-500 mb-4">Issued on {cert.issueDate} • by {cert.instructor}</p>
                   <div className="flex justify-between items-center">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-mono">{cert.verificationCode}</span>
                      <button className="text-emerald-600 font-bold text-sm flex items-center hover:underline">
                         <Download size={16} className="mr-1"/> Download PDF
                      </button>
                   </div>
                </div>
             </div>
          ))}
       </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Student Portal</h1>
        <p className="text-gray-500 mt-2">Manage your academic journey, view progress, and access official documents.</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1 mb-8 inline-flex overflow-x-auto max-w-full">
         {[
            { id: 'PROFILE', label: 'Profile & ID', icon: <UserCheck size={18} className="mr-2"/> },
            { id: 'ATTENDANCE', label: 'Attendance', icon: <Calendar size={18} className="mr-2"/> },
            { id: 'PROGRESS', label: 'Progress & Grades', icon: <TrendingUp size={18} className="mr-2"/> },
            { id: 'CERTIFICATES', label: 'Certificates', icon: <Award size={18} className="mr-2"/> },
         ].map(tab => (
            <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id as StudentTab)}
               className={`flex items-center px-6 py-3 rounded-lg text-sm font-bold transition whitespace-nowrap ${
                  activeTab === tab.id 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-50'
               }`}
            >
               {tab.icon} {tab.label}
            </button>
         ))}
      </div>
      <div className="min-h-[500px]">
         {activeTab === 'PROFILE' && renderProfile()}
         {activeTab === 'ATTENDANCE' && renderAttendance()}
         {activeTab === 'PROGRESS' && renderProgress()}
         {activeTab === 'CERTIFICATES' && renderCertificates()}
      </div>
    </div>
  );
};

// --- ADMIN VIEW ---
const AdminPortalView = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('DASHBOARD');
  const [filterText, setFilterText] = useState('');
  
  // Data State
  const [students, setStudents] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch Data from Backend Service
  const refreshData = async () => {
    setLoading(true);
    try {
      const [allStudents, allStats] = await Promise.all([
        backend.students.getAll(),
        backend.admin.getStats()
      ]);
      setStudents(allStudents);
      setStats(allStats);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleDelete = async (id: string) => {
    if(confirm('Are you sure you want to remove this student?')) {
      await backend.students.delete(id);
      refreshData();
    }
  };

  if (loading && !stats) return <LoadingSpinner />;

  const renderDashboard = () => (
     <div className="space-y-6">
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
         {[
            { label: 'Total Students', value: stats.totalStudents, icon: <Users className="text-blue-500"/> },
            { label: 'Active Students', value: stats.activeStudents, icon: <UserCheck className="text-emerald-500"/> },
            { label: 'Avg Attendance', value: `${stats.attendanceRate}%`, icon: <Clock className="text-orange-500"/> },
            { label: 'Completion Rate', value: `${stats.completionRate}%`, icon: <Award className="text-purple-500"/> },
         ].map((stat, i) => (
           <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                 <p className="text-gray-500 text-xs font-bold uppercase tracking-wide">{stat.label}</p>
                 <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-full">{stat.icon}</div>
           </div>
         ))}
       </div>
       
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Enrollment Growth</h3>
            <div className="h-64 flex items-center justify-center text-gray-400 bg-gray-50 rounded-lg">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                     {name: 'Jan', val: 120}, {name: 'Feb', val: 132}, {name: 'Mar', val: 145},
                     {name: 'Apr', val: 160}, {name: 'May', val: 180}, {name: 'Jun', val: 210}
                  ]}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} />
                     <YAxis axisLine={false} tickLine={false} />
                     <Tooltip />
                     <Bar dataKey="val" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Pending Approvals</h3>
            <div className="space-y-3">
               {[1,2,3].map(i => (
                  <div key={i} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-100 transition">
                     <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gold-100 rounded-full flex items-center justify-center text-gold-700 font-bold">
                           <Award size={18}/>
                        </div>
                        <div>
                           <p className="text-sm font-bold">Certificate Request</p>
                           <p className="text-xs text-gray-500">Yusuf Ahmed • Hifz Level 1</p>
                        </div>
                     </div>
                     <button className="text-xs bg-emerald-600 text-white px-3 py-1 rounded-full font-bold hover:bg-emerald-700">Review</button>
                  </div>
               ))}
            </div>
         </div>
       </div>
     </div>
  );

  const renderStudentList = () => {
    const filtered = students.filter(s => 
      s.name.toLowerCase().includes(filterText.toLowerCase()) || 
      (s.country && s.country.toLowerCase().includes(filterText.toLowerCase()))
    );

    return (
       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center space-y-4 sm:space-y-0">
             <h3 className="font-bold text-gray-900 flex items-center">
               Student Directory 
               {loading && <Loader2 className="ml-2 animate-spin text-emerald-600" size={16}/>}
             </h3>
             <div className="flex space-x-2">
                <div className="relative">
                   <Search size={16} className="absolute left-3 top-3 text-gray-400"/>
                   <input 
                     type="text" 
                     placeholder="Search..." 
                     className="pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                     value={filterText}
                     onChange={e => setFilterText(e.target.value)}
                   />
                </div>
                <button 
                  className="flex items-center px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-bold hover:bg-emerald-100" 
                  onClick={refreshData}
                >
                   <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`}/> Refresh
                </button>
             </div>
          </div>
          <table className="w-full text-left">
             <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                   <th className="px-6 py-4">ID</th>
                   <th className="px-6 py-4">Name</th>
                   <th className="px-6 py-4">Level</th>
                   <th className="px-6 py-4">Country</th>
                   <th className="px-6 py-4">Status</th>
                   <th className="px-6 py-4">Actions</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-gray-100">
                {filtered.map(s => (
                   <tr key={s.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-xs font-mono text-gray-500">{s.id}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{s.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{s.level}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{s.country || '-'}</td>
                      <td className="px-6 py-4">
                         <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${s.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            {s.status}
                         </span>
                      </td>
                      <td className="px-6 py-4 flex space-x-2">
                         <button className="text-gray-400 hover:text-emerald-600"><Edit size={16}/></button>
                         <button onClick={() => handleDelete(s.id)} className="text-gray-400 hover:text-red-500"><Trash size={16}/></button>
                      </td>
                   </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">No students found matching your search.</td>
                  </tr>
                )}
             </tbody>
          </table>
       </div>
    );
  };

  const renderApprovals = () => (
     <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <Award size={48} className="mx-auto text-gray-300 mb-4"/>
        <h3 className="text-xl font-bold text-gray-900">Certificate Requests</h3>
        <p className="text-gray-500 mb-6">Review and approve certificate requests from teachers.</p>
        <button className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold">View All 12 Requests</button>
     </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
       <div className="mb-8 flex justify-between items-center">
         <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Portal</h1>
            <p className="text-gray-500 mt-1">System Overview & Management</p>
         </div>
       </div>

       <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-64 space-y-2">
             {[
                {id: 'DASHBOARD', icon: <BarChart2 size={18}/>, label: 'Dashboard'},
                {id: 'STUDENTS', icon: <Users size={18}/>, label: 'Students'},
                {id: 'TEACHERS', icon: <Briefcase size={18}/>, label: 'Teachers'},
                {id: 'CERTIFICATES', icon: <Award size={18}/>, label: 'Approvals'},
             ].map(item => (
                <button 
                  key={item.id}
                  onClick={() => setActiveTab(item.id as AdminTab)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg font-medium transition ${activeTab === item.id ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                   <span className="mr-3">{item.icon}</span> {item.label}
                </button>
             ))}
          </div>

          <div className="flex-1">
             {activeTab === 'DASHBOARD' && renderDashboard()}
             {activeTab === 'STUDENTS' && renderStudentList()}
             {activeTab === 'CERTIFICATES' && renderApprovals()}
             {activeTab === 'TEACHERS' && <div className="p-12 text-center text-gray-400">Teacher Management Module Placeholder</div>}
          </div>
       </div>
    </div>
  );
};

// --- TEACHER VIEW ---
const TeacherPortalView = () => {
   const [activeTab, setActiveTab] = useState<TeacherTab>('CLASSES');
   const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

   const renderClasses = () => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {MOCK_TEACHER_CLASSES.map(cls => (
            <div key={cls.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer" onClick={() => setSelectedClassId(cls.id)}>
               <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                     <Book size={24}/>
                  </div>
                  <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-500">{cls.time}</span>
               </div>
               <h3 className="font-bold text-lg text-gray-900 mb-1">{cls.title}</h3>
               <p className="text-sm text-gray-500 mb-4">{cls.students} Students Enrolled</p>
               <div className="flex space-x-2">
                  <button className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-emerald-700">Start Class</button>
                  <button className="px-3 py-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50"><MoreHorizontalIcon/></button>
               </div>
            </div>
         ))}
         <button className="border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-emerald-400 hover:text-emerald-500 transition">
            <PlusIcon size={32} className="mb-2"/>
            <span className="font-bold">Schedule New Class</span>
         </button>
      </div>
   );

   const renderAttendance = () => (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
         <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-900">Mark Attendance: Tajweed Level 4</h3>
            <span className="text-sm text-gray-500">{new Date().toLocaleDateString()}</span>
         </div>
         <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
               <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Notes</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
               {MOCK_CLASS_STUDENTS.map(s => (
                  <tr key={s.id}>
                     <td className="px-6 py-4 font-medium">{s.name}</td>
                     <td className="px-6 py-4">
                        <div className="flex space-x-2">
                           <button className={`px-3 py-1 rounded text-xs font-bold ${s.status === 'PRESENT' ? 'bg-green-100 text-green-700 ring-2 ring-green-500' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>Present</button>
                           <button className={`px-3 py-1 rounded text-xs font-bold ${s.status === 'LATE' ? 'bg-orange-100 text-orange-700 ring-2 ring-orange-500' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>Late</button>
                           <button className={`px-3 py-1 rounded text-xs font-bold ${s.status === 'ABSENT' ? 'bg-red-100 text-red-700 ring-2 ring-red-500' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>Absent</button>
                        </div>
                     </td>
                     <td className="px-6 py-4">
                        <input type="text" placeholder="Add note..." className="border-b border-gray-200 focus:border-emerald-500 focus:outline-none text-sm w-full py-1"/>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
         <div className="p-4 border-t border-gray-100 flex justify-end">
            <button className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold">Save Attendance</button>
         </div>
      </div>
   );

   const renderAssignments = () => (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center"><Upload className="mr-2"/> Upload Material</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition cursor-pointer">
               <FileText size={48} className="mx-auto text-gray-300 mb-4"/>
               <p className="font-bold text-gray-700">Click to upload PDF, Audio, or Video</p>
               <p className="text-xs text-gray-400 mt-2">Max file size 50MB</p>
            </div>
            <div className="mt-4">
               <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
               <input type="text" className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="e.g. Surah Al-Kahf Notes"/>
            </div>
            <button className="mt-4 w-full bg-emerald-600 text-white py-2 rounded-lg font-bold">Upload Resource</button>
         </div>

         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center"><FileCheck className="mr-2"/> Create Quiz / Exam</h3>
            <div className="space-y-4">
               <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Exam Title</label>
                  <input type="text" className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Mid-Term Tajweed Exam"/>
               </div>
               <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Date</label>
                  <input type="date" className="w-full border rounded-lg px-3 py-2 text-sm"/>
               </div>
               <button className="w-full border border-emerald-600 text-emerald-700 py-2 rounded-lg font-bold hover:bg-emerald-50">Launch Quiz Builder</button>
            </div>
         </div>
      </div>
   );

   return (
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
         <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Teacher Portal</h1>
            <p className="text-gray-500 mt-1">Manage classes, attendance, and student progress.</p>
         </div>
         
         <div className="flex flex-col md:flex-row gap-8">
             <div className="w-full md:w-64 space-y-2">
                {[
                   {id: 'CLASSES', icon: <Calendar size={18}/>, label: 'My Classes'},
                   {id: 'ATTENDANCE', icon: <CheckSquare size={18}/>, label: 'Mark Attendance'},
                   {id: 'PROGRESS', icon: <TrendingUp size={18}/>, label: 'Student Progress'},
                   {id: 'ASSIGNMENTS', icon: <Book size={18}/>, label: 'Assignments'},
                ].map(item => (
                   <button 
                     key={item.id}
                     onClick={() => setActiveTab(item.id as TeacherTab)}
                     className={`w-full flex items-center px-4 py-3 rounded-lg font-medium transition ${activeTab === item.id ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                   >
                      <span className="mr-3">{item.icon}</span> {item.label}
                   </button>
                ))}
             </div>
   
             <div className="flex-1">
                {activeTab === 'CLASSES' && renderClasses()}
                {activeTab === 'ATTENDANCE' && renderAttendance()}
                {activeTab === 'ASSIGNMENTS' && renderAssignments()}
                {activeTab === 'PROGRESS' && <div className="bg-white p-12 text-center rounded-2xl border border-gray-100 text-gray-400">Select a student from a class to add progress notes.</div>}
             </div>
          </div>
      </div>
   );
};

// Helper Components
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-96">
    <Loader2 size={32} className="animate-spin text-emerald-600" />
  </div>
);

const PlusIcon = ({size, className}:{size?:number, className?:string}) => (
   <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);
const MoreHorizontalIcon = () => (
   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
);

export default StudentSystem;
