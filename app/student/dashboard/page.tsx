'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import StudentLayout from '@/components/Layout/StudentLayout';
import { useAuth } from '@/contexts/AuthContext';
import {
  getAttendanceStats,
  getStudentProgress,
  getLearningModules,
  getAttemptsByStudent,
  getClassSessions,
  getNotices,
} from '@/lib/mock-data';

export default function StudentDashboard() {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({ percentage: 0, present: 0, absent: 0, late: 0 });
  const [completedModules, setCompletedModules] = useState(0);
  const [avgScore, setAvgScore] = useState(0);
  const [todayClasses, setTodayClasses] = useState(0);
  const [recentNotices, setRecentNotices] = useState<ReturnType<typeof getNotices>>([]);
  const [todaySessions, setTodaySessions] = useState<ReturnType<typeof getClassSessions>>([]);

  useEffect(() => {
    if (!currentUser) return;
    const attStats = getAttendanceStats(currentUser.id);
    setStats(attStats);

    const modules = getLearningModules();
    const progress = getStudentProgress(currentUser.id);
    const completed = progress.filter(p => {
      const mod = modules.find(m => m.id === p.moduleId);
      return mod && p.completedLessons >= mod.totalLessons;
    }).length;
    setCompletedModules(completed);

    const attempts = getAttemptsByStudent(currentUser.id);
    if (attempts.length > 0) {
      const avg = Math.round(attempts.reduce((sum, a) => sum + Math.round((a.score / a.totalMarks) * 100), 0) / attempts.length);
      setAvgScore(avg);
    }

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];
    const sessions = getClassSessions();
    const todayList = sessions.filter(s => s.day === today);
    setTodayClasses(todayList.length);
    setTodaySessions(todayList);

    setRecentNotices(getNotices().slice(0, 3));
  }, [currentUser]);

  const quickActions = [
    { href: '/student/schedule', label: 'View Schedule', icon: '📅', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { href: '/student/attendance', label: 'Check Attendance', icon: '✅', color: 'bg-green-50 text-green-700 border-green-200' },
    { href: '/student/tests', label: 'Take a Test', icon: '📝', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { href: '/student/learning', label: 'Continue Learning', icon: '🎓', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { href: '/student/resources', label: 'Browse Resources', icon: '📚', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    { href: '/student/notices', label: 'Read Notices', icon: '📢', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  ];

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {currentUser?.name?.split(' ')[0]}! 👋</h1>
          <p className="text-gray-500 mt-1">Here&apos;s your learning overview for today.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Attendance</p>
            <p className="text-2xl font-bold text-indigo-600 mt-1">{stats.percentage}%</p>
            <p className="text-xs text-gray-400 mt-1">{stats.present} present</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Completed Modules</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{completedModules}</p>
            <p className="text-xs text-gray-400 mt-1">of {getLearningModules().length} total</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Avg Test Score</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">{avgScore}%</p>
            <p className="text-xs text-gray-400 mt-1">overall average</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Today&apos;s Classes</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{todayClasses}</p>
            <p className="text-xs text-gray-400 mt-1">scheduled today</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Today's Schedule */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-800 mb-4">📅 Today&apos;s Schedule</h2>
            {todaySessions.length === 0 ? (
              <p className="text-gray-400 text-sm">No classes scheduled today.</p>
            ) : (
              <div className="space-y-3">
                {todaySessions.map(s => (
                  <div key={s.id} className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg">
                    <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 text-sm font-bold">
                      {s.startTime}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{s.subject}</p>
                      <p className="text-xs text-gray-500">{s.tutor} · {s.room}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Notices */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-800 mb-4">📢 Recent Notices</h2>
            {recentNotices.length === 0 ? (
              <p className="text-gray-400 text-sm">No notices yet.</p>
            ) : (
              <div className="space-y-3">
                {recentNotices.map(n => (
                  <div key={n.id} className="p-3 border border-gray-100 rounded-lg">
                    <div className="flex items-start gap-2">
                      <p className="font-medium text-gray-800 text-sm flex-1">{n.title}</p>
                      {n.important && <span className="flex-shrink-0 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Important</span>}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{n.tutorName} · {new Date(n.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-800 mb-4">⚡ Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickActions.map(action => (
              <Link
                key={action.href}
                href={action.href}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-center hover:opacity-80 transition-opacity ${action.color}`}
              >
                <span className="text-2xl">{action.icon}</span>
                <span className="text-xs font-medium">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
