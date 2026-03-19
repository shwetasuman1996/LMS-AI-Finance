'use client';

import Link from 'next/link';
import AdminLayout from '@/components/Layout/AdminLayout';
import { getAllStudents, getAllTutors, getQuizzes, getResources } from '@/lib/mock-data';

export default function AdminDashboard() {
  const stats = {
    students: getAllStudents().length,
    tutors: getAllTutors().length,
    quizzes: getQuizzes().length,
    resources: getResources().length,
  };

  const statCards = [
    { label: 'Total Students', value: stats.students, icon: '👥', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Tutors', value: stats.tutors, icon: '👩‍🏫', color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Total Quizzes', value: stats.quizzes, icon: '��', color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Total Resources', value: stats.resources, icon: '📚', color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  const quickLinks = [
    { href: '/admin/upload', label: 'Upload Student Data', desc: 'Import students via CSV', icon: '📤', color: 'border-blue-200 hover:bg-blue-50' },
    { href: '/admin/students', label: 'Manage Students', desc: 'View, search, and manage students', icon: '👥', color: 'border-purple-200 hover:bg-purple-50' },
    { href: '/admin/tutors', label: 'Manage Tutors', desc: 'Add and manage tutors', icon: '👩‍🏫', color: 'border-green-200 hover:bg-green-50' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">System overview and management tools.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map(c => (
            <div key={c.label} className={`${c.bg} rounded-xl p-5 border border-opacity-20`}>
              <p className="text-sm text-gray-600">{c.label}</p>
              <p className={`text-3xl font-bold mt-1 ${c.color}`}>{c.value}</p>
              <p className="text-2xl mt-1">{c.icon}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-800 mb-4">🔗 Quick Links</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {quickLinks.map(l => (
              <Link key={l.href} href={l.href} className={`flex items-start gap-4 p-4 rounded-xl border transition-colors ${l.color}`}>
                <span className="text-2xl flex-shrink-0">{l.icon}</span>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{l.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{l.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
