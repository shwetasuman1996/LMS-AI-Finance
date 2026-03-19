'use client';

import StudentLayout from '@/components/Layout/StudentLayout';
import { getClassSessions } from '@/lib/mock-data';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function StudentSchedule() {
  const sessions = getClassSessions();
  const todayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()];

  return (
    <StudentLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Weekly Schedule</h1>

        <div className="space-y-4">
          {DAYS.map(day => {
            const daySessions = sessions.filter(s => s.day === day).sort((a, b) => a.startTime.localeCompare(b.startTime));
            const isToday = day === todayName;
            return (
              <div key={day} className={`bg-white rounded-xl shadow-sm border overflow-hidden ${isToday ? 'border-indigo-300' : 'border-gray-100'}`}>
                <div className={`px-5 py-3 flex items-center gap-3 ${isToday ? 'bg-indigo-600' : 'bg-gray-50 border-b border-gray-100'}`}>
                  <h2 className={`font-semibold ${isToday ? 'text-white' : 'text-gray-700'}`}>{day}</h2>
                  {isToday && <span className="text-xs bg-white text-indigo-600 px-2 py-0.5 rounded-full font-medium">Today</span>}
                  {daySessions.length === 0 && (
                    <span className={`text-xs ml-auto ${isToday ? 'text-indigo-200' : 'text-gray-400'}`}>No classes</span>
                  )}
                </div>
                {daySessions.length > 0 && (
                  <div className="divide-y divide-gray-50">
                    {daySessions.map(s => (
                      <div key={s.id} className="flex items-center gap-4 px-5 py-4">
                        <div className="flex-shrink-0 text-center w-20">
                          <p className="text-sm font-bold text-indigo-600">{s.startTime}</p>
                          <p className="text-xs text-gray-400">to {s.endTime}</p>
                        </div>
                        <div className="w-px h-10 bg-gray-200 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{s.subject}</p>
                          <p className="text-sm text-gray-500">{s.tutor}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="inline-block bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-medium">
                            🏫 {s.room}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </StudentLayout>
  );
}
