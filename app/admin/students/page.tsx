'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/Layout/AdminLayout';
import { getAllStudents, updateUser, deleteUser, type User } from '@/lib/mock-data';

export default function AdminStudents() {
  const [students, setStudents] = useState<User[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    refresh();
  }, []);

  function refresh() {
    setStudents(getAllStudents());
  }

  function handleUnlock(id: string) {
    const all = getAllStudents();
    const user = all.find(u => u.id === id);
    if (!user) return;
    updateUser({ ...user, isLocked: false, failedLoginAttempts: 0 });
    refresh();
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this student account?')) return;
    deleteUser(id);
    refresh();
  }

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Students</h1>

        <div className="flex gap-3">
          <div className="relative flex-1 max-w-sm">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="Search by name or email..."
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Enrollment</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Batch</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-400">No students found.</td></tr>
                ) : (
                  filtered.map(s => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 text-xs font-bold flex-shrink-0">
                            {s.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">{s.email}</td>
                      <td className="px-5 py-4 text-sm text-gray-600">{s.enrollmentNumber ?? '-'}</td>
                      <td className="px-5 py-4 text-sm">
                        <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs">{s.batch ?? '-'}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${s.isLocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                          {s.isLocked ? '🔒 Locked' : '✅ Active'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {s.isLocked && (
                            <button onClick={() => handleUnlock(s.id)} className="text-xs bg-amber-100 text-amber-700 hover:bg-amber-200 px-3 py-1 rounded-lg transition-colors font-medium">
                              Unlock
                            </button>
                          )}
                          <button onClick={() => handleDelete(s.id)} className="text-xs bg-red-100 text-red-600 hover:bg-red-200 px-3 py-1 rounded-lg transition-colors font-medium">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
