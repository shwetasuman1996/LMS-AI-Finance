const MS_PER_DAY = 86_400_000;

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'student' | 'tutor' | 'admin';
  enrollmentNumber?: string;
  batch?: string;
  phone?: string;
  avatar?: string;
  failedLoginAttempts: number;
  isLocked: boolean;
}

export interface ClassSession {
  id: string;
  subject: string;
  tutor: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
}

export interface AttendanceRecord {
  studentId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  classId: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  tutorId: string;
  tutorName: string;
  createdAt: string;
  important: boolean;
}

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'link' | 'video';
  url: string;
  description: string;
  tutorId: string;
  tutorName: string;
  subject: string;
  createdAt: string;
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  subject: string;
  totalLessons: number;
}

export interface StudentProgress {
  studentId: string;
  moduleId: string;
  completedLessons: number;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  marks: number;
}

export interface Quiz {
  id: string;
  title: string;
  type: 'quiz' | 'exam';
  tutorId: string;
  duration: number;
  questions: Question[];
  createdAt: string;
  subject: string;
}

export interface QuizAttempt {
  id: string;
  studentId: string;
  quizId: string;
  answers: number[];
  score: number;
  totalMarks: number;
  submittedAt: string;
}

// ---- In-memory stores ----

let users: User[] = [
  {
    id: 'u1', email: 'student1@test.com', password: 'password123',
    name: 'Rahul Sharma', role: 'student',
    enrollmentNumber: 'CA001', batch: 'CA-2024',
    phone: '+91 9876543210', failedLoginAttempts: 0, isLocked: false,
  },
  {
    id: 'u2', email: 'student2@test.com', password: 'password123',
    name: 'Priya Patel', role: 'student',
    enrollmentNumber: 'CA002', batch: 'CA-2024',
    phone: '+91 9876543211', failedLoginAttempts: 0, isLocked: false,
  },
  {
    id: 'u3', email: 'student3@test.com', password: 'password123',
    name: 'Amit Kumar', role: 'student',
    enrollmentNumber: 'CA003', batch: 'CA-2023',
    phone: '+91 9876543212', failedLoginAttempts: 0, isLocked: false,
  },
  {
    id: 'u4', email: 'tutor1@test.com', password: 'password123',
    name: 'Prof. Anjali Singh', role: 'tutor',
    failedLoginAttempts: 0, isLocked: false,
  },
  {
    id: 'u5', email: 'tutor2@test.com', password: 'password123',
    name: 'Prof. Vikram Mehta', role: 'tutor',
    failedLoginAttempts: 0, isLocked: false,
  },
  {
    id: 'u6', email: 'admin@test.com', password: 'admin123',
    name: 'Admin User', role: 'admin',
    failedLoginAttempts: 0, isLocked: false,
  },
];

const classSessions: ClassSession[] = [
  { id: 'cs1', subject: 'Financial Accounting', tutor: 'Prof. Anjali Singh', day: 'Monday', startTime: '09:00', endTime: '10:30', room: 'Room 101' },
  { id: 'cs2', subject: 'Cost Accounting', tutor: 'Prof. Vikram Mehta', day: 'Monday', startTime: '11:00', endTime: '12:30', room: 'Room 102' },
  { id: 'cs3', subject: 'Taxation', tutor: 'Prof. Anjali Singh', day: 'Tuesday', startTime: '09:00', endTime: '10:30', room: 'Room 103' },
  { id: 'cs4', subject: 'Audit', tutor: 'Prof. Vikram Mehta', day: 'Tuesday', startTime: '11:00', endTime: '12:30', room: 'Room 104' },
  { id: 'cs5', subject: 'Corporate Law', tutor: 'Prof. Anjali Singh', day: 'Wednesday', startTime: '09:00', endTime: '10:30', room: 'Room 101' },
  { id: 'cs6', subject: 'Financial Management', tutor: 'Prof. Vikram Mehta', day: 'Wednesday', startTime: '11:00', endTime: '12:30', room: 'Room 102' },
  { id: 'cs7', subject: 'Financial Accounting', tutor: 'Prof. Anjali Singh', day: 'Thursday', startTime: '09:00', endTime: '10:30', room: 'Room 101' },
  { id: 'cs8', subject: 'Cost Accounting', tutor: 'Prof. Vikram Mehta', day: 'Thursday', startTime: '11:00', endTime: '12:30', room: 'Room 102' },
  { id: 'cs9', subject: 'Taxation', tutor: 'Prof. Anjali Singh', day: 'Friday', startTime: '09:00', endTime: '10:30', room: 'Room 103' },
  { id: 'cs10', subject: 'Audit', tutor: 'Prof. Vikram Mehta', day: 'Friday', startTime: '11:00', endTime: '12:30', room: 'Room 104' },
];

function generateAttendance(): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const statuses: Array<'present' | 'absent' | 'late'> = ['present', 'present', 'present', 'present', 'absent', 'late', 'present', 'present', 'present', 'absent'];
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;
    records.push({
      studentId: 'u1',
      date: date.toISOString().split('T')[0],
      status: statuses[i % statuses.length],
      classId: `cs${(i % 10) + 1}`,
    });
  }
  return records;
}

const attendanceRecords: AttendanceRecord[] = generateAttendance();

let notices: Notice[] = [
  {
    id: 'n1', title: 'CA Foundation Exam Schedule Released',
    content: 'The ICAI has released the CA Foundation exam schedule for November 2024. Students are requested to check the official website and start preparation accordingly. Mock tests will be conducted starting next week.',
    tutorId: 'u4', tutorName: 'Prof. Anjali Singh',
    createdAt: new Date(Date.now() - MS_PER_DAY).toISOString(), important: true,
  },
  {
    id: 'n2', title: 'Financial Accounting Class Rescheduled',
    content: 'The Financial Accounting class on Monday has been rescheduled to 10:00 AM - 11:30 AM due to a faculty meeting. Please make a note of this change.',
    tutorId: 'u4', tutorName: 'Prof. Anjali Singh',
    createdAt: new Date(Date.now() - 2 * MS_PER_DAY).toISOString(), important: false,
  },
  {
    id: 'n3', title: 'Important: Tax Assignment Due Date',
    content: 'The Taxation assignment on GST filing is due by this Friday. Students who have not yet submitted their practice returns should do so immediately. No extensions will be granted.',
    tutorId: 'u5', tutorName: 'Prof. Vikram Mehta',
    createdAt: new Date(Date.now() - 3 * MS_PER_DAY).toISOString(), important: true,
  },
  {
    id: 'n4', title: 'Study Material for Cost Accounting',
    content: 'New study material for the upcoming Cost Accounting chapter on Standard Costing has been uploaded to the Resources section. Please download and review before the next class.',
    tutorId: 'u5', tutorName: 'Prof. Vikram Mehta',
    createdAt: new Date(Date.now() - 5 * MS_PER_DAY).toISOString(), important: false,
  },
];

let resources: Resource[] = [
  {
    id: 'r1', title: 'Financial Accounting - Chapter 5 Notes',
    type: 'pdf', url: 'https://example.com/fa-chapter5.pdf',
    description: 'Comprehensive notes for Financial Accounting Chapter 5 covering depreciation methods and inventory valuation.',
    tutorId: 'u4', tutorName: 'Prof. Anjali Singh', subject: 'Financial Accounting',
    createdAt: new Date(Date.now() - MS_PER_DAY).toISOString(),
  },
  {
    id: 'r2', title: 'ICAI Study Portal',
    type: 'link', url: 'https://icai.org',
    description: 'Official ICAI study portal with past papers, study material, and practice questions for all CA levels.',
    tutorId: 'u4', tutorName: 'Prof. Anjali Singh', subject: 'General',
    createdAt: new Date(Date.now() - 2 * MS_PER_DAY).toISOString(),
  },
  {
    id: 'r3', title: 'GST Filing Tutorial',
    type: 'video', url: 'https://www.youtube.com/watch?v=example',
    description: 'Step-by-step video tutorial on how to file GST returns on the official portal. Covers GSTR-1 and GSTR-3B.',
    tutorId: 'u5', tutorName: 'Prof. Vikram Mehta', subject: 'Taxation',
    createdAt: new Date(Date.now() - 3 * MS_PER_DAY).toISOString(),
  },
  {
    id: 'r4', title: 'Audit Standards Quick Reference',
    type: 'pdf', url: 'https://example.com/audit-standards.pdf',
    description: 'Quick reference guide for all SA (Standards on Auditing) issued by ICAI, with key points and examples.',
    tutorId: 'u5', tutorName: 'Prof. Vikram Mehta', subject: 'Audit',
    createdAt: new Date(Date.now() - 4 * MS_PER_DAY).toISOString(),
  },
  {
    id: 'r5', title: 'Corporate Law Case Studies',
    type: 'pdf', url: 'https://example.com/corp-law-cases.pdf',
    description: 'Collection of important case studies on Corporate Law relevant to the CA Foundation examination.',
    tutorId: 'u4', tutorName: 'Prof. Anjali Singh', subject: 'Corporate Law',
    createdAt: new Date(Date.now() - 6 * MS_PER_DAY).toISOString(),
  },
  {
    id: 'r6', title: 'Financial Management Formulas',
    type: 'pdf', url: 'https://example.com/fm-formulas.pdf',
    description: 'Comprehensive formula sheet for Financial Management including capital budgeting, ratio analysis, and working capital management.',
    tutorId: 'u5', tutorName: 'Prof. Vikram Mehta', subject: 'Financial Management',
    createdAt: new Date(Date.now() - 7 * MS_PER_DAY).toISOString(),
  },
];

const learningModules: LearningModule[] = [
  { id: 'lm1', title: 'Financial Accounting Fundamentals', description: 'Core concepts of financial accounting including journal entries, ledger, and trial balance.', subject: 'Financial Accounting', totalLessons: 12 },
  { id: 'lm2', title: 'Cost Accounting Methods', description: 'Different methods of costing including process costing, job costing, and standard costing.', subject: 'Cost Accounting', totalLessons: 10 },
  { id: 'lm3', title: 'Taxation Basics', description: 'Introduction to direct and indirect taxes, GST framework, and income tax provisions.', subject: 'Taxation', totalLessons: 15 },
  { id: 'lm4', title: 'Audit Principles', description: 'Fundamental principles of auditing, audit standards, and audit procedures.', subject: 'Audit', totalLessons: 8 },
];

let studentProgress: StudentProgress[] = [
  { studentId: 'u1', moduleId: 'lm1', completedLessons: 8 },
  { studentId: 'u1', moduleId: 'lm2', completedLessons: 5 },
  { studentId: 'u1', moduleId: 'lm3', completedLessons: 3 },
  { studentId: 'u1', moduleId: 'lm4', completedLessons: 0 },
  { studentId: 'u2', moduleId: 'lm1', completedLessons: 10 },
  { studentId: 'u2', moduleId: 'lm2', completedLessons: 7 },
  { studentId: 'u3', moduleId: 'lm1', completedLessons: 6 },
];

let quizzes: Quiz[] = [
  {
    id: 'q1', title: 'Financial Accounting Quiz 1', type: 'quiz',
    tutorId: 'u4', duration: 30, subject: 'Financial Accounting',
    createdAt: new Date(Date.now() - 3 * MS_PER_DAY).toISOString(),
    questions: [
      { id: 'qq1', text: 'Which accounting concept requires that revenue should be recognized when it is earned?', options: ['Matching Concept', 'Accrual Concept', 'Going Concern', 'Consistency'], correctAnswer: 1, marks: 2 },
      { id: 'qq2', text: 'What is the accounting equation?', options: ['Assets = Liabilities + Equity', 'Assets = Liabilities - Equity', 'Equity = Assets + Liabilities', 'Liabilities = Assets + Equity'], correctAnswer: 0, marks: 2 },
      { id: 'qq3', text: 'Depreciation is charged on which type of assets?', options: ['Current Assets', 'Fixed Assets', 'Fictitious Assets', 'Liquid Assets'], correctAnswer: 1, marks: 2 },
      { id: 'qq4', text: 'Which method of depreciation considers the residual value of the asset?', options: ['WDV Method', 'SLM Method', 'Both', 'Neither'], correctAnswer: 2, marks: 2 },
      { id: 'qq5', text: 'A trial balance is prepared from:', options: ['Journal Entries', 'Ledger Balances', 'Financial Statements', 'Source Documents'], correctAnswer: 1, marks: 2 },
    ],
  },
  {
    id: 'q2', title: 'Taxation Mid-Term Exam', type: 'exam',
    tutorId: 'u5', duration: 60, subject: 'Taxation',
    createdAt: new Date(Date.now() - 5 * MS_PER_DAY).toISOString(),
    questions: [
      { id: 'qq6', text: 'What is the full form of GST?', options: ['General Sales Tax', 'Goods and Services Tax', 'Government Service Tax', 'Global Supply Tax'], correctAnswer: 1, marks: 5 },
      { id: 'qq7', text: 'Under GST, CGST stands for?', options: ['Central Goods and Services Tax', 'Collective GST', 'Comprehensive GST', 'Combined GST'], correctAnswer: 0, marks: 5 },
      { id: 'qq8', text: 'What is the GST rate on essential food items?', options: ['5%', '12%', '0%', '18%'], correctAnswer: 2, marks: 5 },
      { id: 'qq9', text: 'Income Tax in India is governed by which act?', options: ['Income Tax Act 1956', 'Income Tax Act 1961', 'Income Tax Act 1972', 'Income Tax Act 1980'], correctAnswer: 1, marks: 5 },
    ],
  },
  {
    id: 'q3', title: 'Audit Standards Quiz', type: 'quiz',
    tutorId: 'u4', duration: 20, subject: 'Audit',
    createdAt: new Date(Date.now() - 7 * MS_PER_DAY).toISOString(),
    questions: [
      { id: 'qq10', text: 'SA 200 deals with?', options: ['Overall Objectives of Auditor', 'Audit Evidence', 'Audit Documentation', 'Risk Assessment'], correctAnswer: 0, marks: 3 },
      { id: 'qq11', text: 'Audit risk is composed of?', options: ['Inherent Risk only', 'Control Risk only', 'Inherent, Control, and Detection Risk', 'Business Risk only'], correctAnswer: 2, marks: 3 },
      { id: 'qq12', text: 'An unqualified audit report is also known as?', options: ['Qualified Report', 'Clean Report', 'Adverse Report', 'Disclaimer Report'], correctAnswer: 1, marks: 3 },
    ],
  },
];

const quizAttempts: QuizAttempt[] = [
  {
    id: 'qa1', studentId: 'u2', quizId: 'q1',
    answers: [1, 0, 1, 2, 1], score: 8, totalMarks: 10,
    submittedAt: new Date(Date.now() - 2 * MS_PER_DAY).toISOString(),
  },
  {
    id: 'qa2', studentId: 'u3', quizId: 'q1',
    answers: [1, 0, 1, 0, 1], score: 6, totalMarks: 10,
    submittedAt: new Date(Date.now() - 1 * MS_PER_DAY).toISOString(),
  },
  {
    id: 'qa3', studentId: 'u2', quizId: 'q2',
    answers: [1, 0, 2, 1], score: 10, totalMarks: 20,
    submittedAt: new Date(Date.now() - 4 * MS_PER_DAY).toISOString(),
  },
];

// ---- Exported CRUD functions ----

export function getUsers(): User[] { return [...users]; }
export function getUserByEmail(email: string): User | undefined {
  return users.find(u => u.email === email);
}
export function updateUser(updatedUser: User): void {
  users = users.map(u => u.id === updatedUser.id ? updatedUser : u);
}
export function addUser(user: User): void { users.push(user); }

export function getClassSessions(): ClassSession[] { return [...classSessions]; }

export function getAttendanceForStudent(studentId: string): AttendanceRecord[] {
  return attendanceRecords.filter(r => r.studentId === studentId);
}
export function getAttendanceStats(studentId: string): { present: number; absent: number; late: number; percentage: number } {
  const records = getAttendanceForStudent(studentId);
  const present = records.filter(r => r.status === 'present').length;
  const absent = records.filter(r => r.status === 'absent').length;
  const late = records.filter(r => r.status === 'late').length;
  const total = records.length;
  const percentage = total > 0 ? Math.round(((present + late) / total) * 100) : 0;
  return { present, absent, late, percentage };
}

export function getNotices(): Notice[] { return [...notices].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); }
export function addNotice(notice: Notice): void { notices.push(notice); }
export function deleteNotice(id: string): void { notices = notices.filter(n => n.id !== id); }

export function getResources(): Resource[] { return [...resources].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); }
export function addResource(resource: Resource): void { resources.push(resource); }
export function deleteResource(id: string): void { resources = resources.filter(r => r.id !== id); }

export function getLearningModules(): LearningModule[] { return [...learningModules]; }
export function getStudentProgress(studentId: string): StudentProgress[] {
  return studentProgress.filter(p => p.studentId === studentId);
}
export function updateProgress(studentId: string, moduleId: string, completedLessons: number): void {
  const existing = studentProgress.find(p => p.studentId === studentId && p.moduleId === moduleId);
  if (existing) {
    studentProgress = studentProgress.map(p =>
      p.studentId === studentId && p.moduleId === moduleId ? { ...p, completedLessons } : p
    );
  } else {
    studentProgress.push({ studentId, moduleId, completedLessons });
  }
}

export function getQuizzes(): Quiz[] { return [...quizzes]; }
export function getQuizById(id: string): Quiz | undefined { return quizzes.find(q => q.id === id); }
export function addQuiz(quiz: Quiz): void { quizzes.push(quiz); }
export function deleteQuiz(id: string): void { quizzes = quizzes.filter(q => q.id !== id); }

export function getQuizAttempts(): QuizAttempt[] { return [...quizAttempts]; }
export function getAttemptsByStudent(studentId: string): QuizAttempt[] {
  return quizAttempts.filter(a => a.studentId === studentId);
}
export function addQuizAttempt(attempt: QuizAttempt): void { quizAttempts.push(attempt); }

export function getAllStudents(): User[] { return users.filter(u => u.role === 'student'); }
export function getAllTutors(): User[] { return users.filter(u => u.role === 'tutor'); }
export function deleteUser(id: string): void { users = users.filter(u => u.id !== id); }
