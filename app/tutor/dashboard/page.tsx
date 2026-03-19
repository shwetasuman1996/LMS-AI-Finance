'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import TutorLayout from '@/components/Layout/TutorLayout';
import { useAuth } from '@/contexts/AuthContext';
import { getAllStudents, getQuizzes, getNotices, getResources, getQuizAttempts } from '@/lib/mock-data';

export default function TutorDashboard() {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({ students: 0, quizzes: 0, notices: 0, resources: 0 });
  const [recentAttempts, setRecentAttempts] = useState<{ name: string; quiz: string; score: string }[]>([]);

  useEffect(() => {
    if (!currentUser) return;
    const myQuizzes = getQuizzes().filter(q => q.tutorId === currentUser.id);
    const myNotices = getNotices().filter(n => n.tutorId === currentUser.id);
    const myResources = getResources().filter(r => r.tutorId === currentUser.id);
    const students = getAllStudents();
    setStats({ students: students.length, quizzes: myQuizzes.length, notices: myNotices.length, resources: myResources.length });

    const allAttempts = getQuizAttempts();
    const myQuizIds = new Set(myQuizzes.map(q => q.id));
    const relevant = allAttempts
      .filter(a => myQuizIds.has(a.quizId))
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
      .slice(0, 5);
    const mapped = relevant.map(a => {
      const student = students.find(s => s.id === a.studentId);
      const quiz = myQuizzes.find(q => q.id === a.quizId);
      return {
        name: student?.name ?? 'Unknown',
        quiz: quiz?.title ?? 'Unknown Quiz',
        score: `${a.score}/${a.totalMarks} (${Math.round((a.score / a.totalMarks) * 100)}%)`,
      };
    });
    setRecentAttempts(mapped);
  }, [currentUser]);

  const statCards = [
    { label: 'Total Students', value: stats.students, icon: '👥', color: 'text-blue-600' },
    { label: 'My Quizzes', value: stats.quizzes, icon: '📝', color: 'text-purple-600' },
    { label: 'My Notices', value: stats.notices, icon: '📢', color: 'text-amber-600' },
    { label: 'My Resources', value: stats.resources, icon: '📚', color: 'text-green-600' },
  ];

  return (
    <TutorLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {currentUser?.name?.split(' ').slice(-1)[0]}! 👋</h1>
          <p className="text-gray-500 mt-1">Here&apos;s your teaching overview.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map(c => (
            <div key={c.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500">{c.label}</p>
              <p className={`text-3xl font-bold mt-1 ${c.color}`}>{c.value}</p>
              <p className="text-2xl mt-1">{c.icon}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Attempts */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-800 mb-4">📊 Recent Quiz Attempts</h2>
            {recentAttempts.length === 0 ? (
              <p className="text-gray-400 text-sm">No attempts yet for your quizzes.</p>
            ) : (
              <div className="space-y-3">
                {recentAttempts.map((a, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{a.name}</p>
                      <p className="text-xs text-gray-500">{a.quiz}</p>
                    </div>
                    <span className="text-sm font-semibold text-indigo-600">{a.score}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-800 mb-4">⚡ Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { href: '/tutor/quizzes/create', label: 'Create Quiz', icon: '➕', color: 'bg-purple-50 text-purple-700 border-purple-200' },
                { href: '/tutor/notices', label: 'Post Notice', icon: '📢', color: 'bg-amber-50 text-amber-700 border-amber-200' },
                { href: '/tutor/resources', label: 'Add Resource', icon: '📚', color: 'bg-green-50 text-green-700 border-green-200' },
                { href: '/tutor/rankings', label: 'View Rankings', icon: '🏆', color: 'bg-blue-50 text-blue-700 border-blue-200' },
              ].map(a => (
                <Link key={a.href} href={a.href} className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-center hover:opacity-80 transition-opacity ${a.color}`}>
                  <span className="text-2xl">{a.icon}</span>
                  <span className="text-xs font-medium">{a.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </TutorLayout>
  );
}
