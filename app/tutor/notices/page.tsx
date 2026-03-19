'use client';

import { useEffect, useState, useCallback } from 'react';
import TutorLayout from '@/components/Layout/TutorLayout';
import { useAuth } from '@/contexts/AuthContext';
import { getNotices, addNotice, deleteNotice, type Notice } from '@/lib/mock-data';

export default function TutorNotices() {
  const { currentUser } = useAuth();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [important, setImportant] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const refresh = useCallback(() => {
    if (!currentUser) return;
    setNotices(getNotices().filter(n => n.tutorId === currentUser.id));
  }, [currentUser]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  function handlePost(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!title.trim() || !content.trim()) { setError('Title and content are required.'); return; }
    setSaving(true);
    addNotice({
      id: `n${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      tutorId: currentUser!.id,
      tutorName: currentUser!.name,
      createdAt: new Date().toISOString(),
      important,
    });
    setTitle('');
    setContent('');
    setImportant(false);
    setSaving(false);
    refresh();
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this notice?')) return;
    deleteNotice(id);
    refresh();
  }

  return (
    <TutorLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Notices</h1>

        {/* Create Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Post a Notice</h2>
          {error && <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
          <form onSubmit={handlePost} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Notice title..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <textarea value={content} onChange={e => setContent(e.target.value)} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-none" placeholder="Write the notice content..." />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={important} onChange={e => setImportant(e.target.checked)} className="w-4 h-4 text-red-600 rounded" />
                <span className="text-sm text-gray-700">Mark as Important</span>
              </label>
              <button type="submit" disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white px-6 py-2 rounded-lg text-sm font-semibold">
                {saving ? 'Posting...' : 'Post Notice'}
              </button>
            </div>
          </form>
        </div>

        {/* Notices List */}
        {notices.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <p className="text-4xl mb-4">📢</p>
            <p className="text-gray-500">No notices posted yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notices.map(n => (
              <div key={n.id} className={`bg-white rounded-xl shadow-sm border overflow-hidden ${n.important ? 'border-l-4 border-l-red-500 border-gray-100' : 'border-gray-100'}`}>
                <div className="p-5">
                  <div className="flex items-start gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900 flex-1">{n.title}</h3>
                    {n.important && <span className="flex-shrink-0 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">⚠️ Important</span>}
                    <button onClick={() => handleDelete(n.id)} className="flex-shrink-0 text-red-400 hover:text-red-600" title="Delete">🗑️</button>
                  </div>
                  <p className="text-sm text-gray-600">{n.content}</p>
                  <p className="text-xs text-gray-400 mt-3">{new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </TutorLayout>
  );
}
