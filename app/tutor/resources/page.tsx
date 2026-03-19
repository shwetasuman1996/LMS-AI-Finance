'use client';

import { useEffect, useState, useCallback } from 'react';
import TutorLayout from '@/components/Layout/TutorLayout';
import { useAuth } from '@/contexts/AuthContext';
import { getResources, addResource, deleteResource, type Resource } from '@/lib/mock-data';

export default function TutorResources() {
  const { currentUser } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'pdf' | 'link' | 'video'>('pdf');
  const [url, setUrl] = useState('');
  const [subject, setSubject] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(() => {
    if (!currentUser) return;
    setResources(getResources().filter(r => r.tutorId === currentUser.id));
  }, [currentUser]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!title.trim() || !url.trim() || !subject.trim()) { setError('Title, URL, and subject are required.'); return; }
    setSaving(true);
    addResource({
      id: `r${Date.now()}`,
      title: title.trim(),
      type,
      url: url.trim(),
      description: description.trim(),
      tutorId: currentUser!.id,
      tutorName: currentUser!.name,
      subject: subject.trim(),
      createdAt: new Date().toISOString(),
    });
    setTitle(''); setDescription(''); setUrl(''); setSubject(''); setType('pdf');
    setSaving(false);
    refresh();
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this resource?')) return;
    deleteResource(id);
    refresh();
  }

  const typeConfig = {
    pdf: { color: 'bg-red-100 text-red-700', icon: '📄' },
    link: { color: 'bg-blue-100 text-blue-700', icon: '🔗' },
    video: { color: 'bg-purple-100 text-purple-700', icon: '🎬' },
  };

  return (
    <TutorLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Resources</h1>

        {/* Add Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Add Resource</h2>
          {error && <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Resource title" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input value={subject} onChange={e => setSubject(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="e.g. Taxation" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-none" placeholder="Brief description..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select value={type} onChange={e => setType(e.target.value as 'pdf' | 'link' | 'video')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none">
                  <option value="pdf">PDF</option>
                  <option value="link">Link</option>
                  <option value="video">Video</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                <input value={url} onChange={e => setUrl(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="https://..." />
              </div>
            </div>
            <div className="flex justify-end">
              <button type="submit" disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white px-6 py-2 rounded-lg text-sm font-semibold">
                {saving ? 'Adding...' : 'Add Resource'}
              </button>
            </div>
          </form>
        </div>

        {/* List */}
        {resources.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <p className="text-4xl mb-4">📚</p>
            <p className="text-gray-500">No resources added yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {resources.map(r => {
              const tc = typeConfig[r.type];
              return (
                <div key={r.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 text-xl">{tc.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 text-sm truncate">{r.title}</span>
                      <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full ${tc.color}`}>{r.type.toUpperCase()}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{r.subject} · {new Date(r.createdAt).toLocaleDateString()}</p>
                  </div>
                  <button onClick={() => handleDelete(r.id)} className="text-red-400 hover:text-red-600 flex-shrink-0" title="Delete">🗑️</button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </TutorLayout>
  );
}
