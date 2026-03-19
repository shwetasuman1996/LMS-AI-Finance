'use client';

import { useState } from 'react';
import StudentLayout from '@/components/Layout/StudentLayout';
import { getResources, type Resource } from '@/lib/mock-data';

type FilterType = 'all' | 'pdf' | 'link' | 'video';

const typeConfig = {
  pdf: { label: 'PDF', color: 'bg-red-100 text-red-700', icon: '📄' },
  link: { label: 'Link', color: 'bg-blue-100 text-blue-700', icon: '🔗' },
  video: { label: 'Video', color: 'bg-purple-100 text-purple-700', icon: '🎬' },
};

export default function StudentResources() {
  const allResources = getResources();
  const [filter, setFilter] = useState<FilterType>('all');

  const filtered: Resource[] = filter === 'all' ? allResources : allResources.filter(r => r.type === filter);

  return (
    <StudentLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Resources</h1>

        {/* Filter Buttons */}
        <div className="flex gap-2 flex-wrap">
          {(['all', 'pdf', 'link', 'video'] as FilterType[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300'}`}
            >
              {f === 'all' ? 'All' : `${typeConfig[f].icon} ${typeConfig[f].label}`}
            </button>
          ))}
        </div>

        {/* Resources Grid */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <p className="text-4xl mb-4">📚</p>
            <p className="text-gray-500">No resources found.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map(resource => {
              const tc = typeConfig[resource.type];
              return (
                <div key={resource.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 text-xl">
                      {tc.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 text-sm truncate">{resource.title}</h3>
                        <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${tc.color}`}>
                          {tc.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2">{resource.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-400">
                      <span className="font-medium text-gray-500">{resource.tutorName}</span> · {resource.subject}
                    </div>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Open →
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
