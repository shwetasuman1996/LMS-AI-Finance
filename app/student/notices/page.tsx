'use client';

import StudentLayout from '@/components/Layout/StudentLayout';
import { getNotices } from '@/lib/mock-data';

export default function StudentNotices() {
  const notices = getNotices();

  return (
    <StudentLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Notices</h1>

        {notices.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <p className="text-4xl mb-4">📢</p>
            <p className="text-gray-500">No notices posted yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notices.map(notice => (
              <div key={notice.id} className={`bg-white rounded-xl shadow-sm border overflow-hidden ${notice.important ? 'border-l-4 border-l-red-500 border-gray-100' : 'border-gray-100'}`}>
                <div className="p-5">
                  <div className="flex items-start gap-3 mb-2">
                    <h2 className="font-semibold text-gray-900 flex-1">{notice.title}</h2>
                    {notice.important && (
                      <span className="flex-shrink-0 text-xs bg-red-100 text-red-600 px-2.5 py-1 rounded-full font-semibold uppercase tracking-wide">
                        ⚠️ Important
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{notice.content}</p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                    <span className="font-medium text-gray-500">{notice.tutorName}</span>
                    <span>·</span>
                    <span>{new Date(notice.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
