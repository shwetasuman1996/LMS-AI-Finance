'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/Layout/AdminLayout';
import { getAllTutors, addUser, deleteUser, getUsers, type User } from '@/lib/mock-data';

export default function AdminTutors() {
  const [tutors, setTutors] = useState<User[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    refresh();
  }, []);

  function refresh() {
    setTutors(getAllTutors());
  }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!name.trim() || !email.trim() || !password.trim()) { setError('Name, email, and password are required.'); return; }
    const existing = getUsers().find(u => u.email === email.trim());
    if (existing) { setError('A user with this email already exists.'); return; }
    setSaving(true);
    addUser({
      id: `u${Date.now()}`,
      email: email.trim(),
      password: password.trim(),
      name: name.trim(),
      role: 'tutor',
      phone: phone.trim() || undefined,
      failedLoginAttempts: 0,
      isLocked: false,
    });
    setName(''); setEmail(''); setPassword(''); setPhone('');
    setSaving(false);
    refresh();
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this tutor?')) return;
    deleteUser(id);
    refresh();
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Tutors</h1>

        {/* Add Tutor Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Add New Tutor</h2>
          {error && <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none" placeholder="Prof. John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none" placeholder="tutor@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none" placeholder="Set password" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone (optional)</label>
                <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none" placeholder="+91 9876543210" />
              </div>
            </div>
            <div className="flex justify-end">
              <button type="submit" disabled={saving} className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors">
                {saving ? 'Adding...' : 'Add Tutor'}
              </button>
            </div>
          </form>
        </div>

        {/* Tutors Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">All Tutors ({tutors.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Phone</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {tutors.length === 0 ? (
                  <tr><td colSpan={4} className="px-5 py-12 text-center text-gray-400">No tutors found.</td></tr>
                ) : (
                  tutors.map(t => (
                    <tr key={t.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 text-xs font-bold flex-shrink-0">
                            {t.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{t.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">{t.email}</td>
                      <td className="px-5 py-4 text-sm text-gray-600">{t.phone ?? '-'}</td>
                      <td className="px-5 py-4 text-right">
                        <button onClick={() => handleDelete(t.id)} className="text-xs bg-red-100 text-red-600 hover:bg-red-200 px-3 py-1 rounded-lg transition-colors font-medium">
                          Delete
                        </button>
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
