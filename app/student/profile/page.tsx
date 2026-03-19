'use client';

import StudentLayout from '@/components/Layout/StudentLayout';
import { useAuth } from '@/contexts/AuthContext';

export default function StudentProfile() {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  const initials = currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const fields = [
    { label: 'Full Name', value: currentUser.name, icon: '👤' },
    { label: 'Email Address', value: currentUser.email, icon: '📧' },
    { label: 'Enrollment Number', value: currentUser.enrollmentNumber ?? 'N/A', icon: '��' },
    { label: 'Batch', value: currentUser.batch ?? 'N/A', icon: '🎓' },
    { label: 'Phone', value: currentUser.phone ?? 'N/A', icon: '📱' },
    { label: 'Role', value: 'Student', icon: '👨‍🎓' },
  ];

  return (
    <StudentLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-8 text-center">
            <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-4xl font-bold">{initials}</span>
            </div>
            <h2 className="text-white text-2xl font-bold">{currentUser.name}</h2>
            <p className="text-indigo-200 mt-1">{currentUser.batch} · {currentUser.enrollmentNumber}</p>
          </div>

          {/* Details */}
          <div className="p-6 space-y-4">
            {fields.map(f => (
              <div key={f.label} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">{f.icon}</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{f.label}</p>
                  <p className="text-gray-900 font-semibold mt-0.5">{f.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
