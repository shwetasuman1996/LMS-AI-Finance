'use client';

import { useEffect, useState } from 'react';
import StudentLayout from '@/components/Layout/StudentLayout';
import { useAuth } from '@/contexts/AuthContext';
import { getAttendanceForStudent, getAttendanceStats, type AttendanceRecord } from '@/lib/mock-data';

export default function StudentAttendance() {
  const { currentUser } = useAuth();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [stats, setStats] = useState({ percentage: 0, present: 0, absent: 0, late: 0 });

  useEffect(() => {
    if (!currentUser) return;
    setRecords(getAttendanceForStudent(currentUser.id).sort((a, b) => b.date.localeCompare(a.date)));
    setStats(getAttendanceStats(currentUser.id));
  }, [currentUser]);

  const statusConfig = {
    present: { label: 'Present', color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
    absent: { label: 'Absent', color: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
    late: { label: 'Late', color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
  };

  return (
    <StudentLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Overall Attendance</p>
            <p className="text-3xl font-bold text-indigo-600 mt-1">{stats.percentage}%</p>
            <div className="mt-3 bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${stats.percentage >= 75 ? 'bg-green-500' : stats.percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${stats.percentage}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">{stats.percentage >= 75 ? 'Good standing' : stats.percentage >= 60 ? 'Needs improvement' : 'Critical'}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Present</p>
            <p className="text-3xl font-bold text-green-600 mt-1">{stats.present}</p>
            <p className="text-xs text-gray-400 mt-2">days present</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Absent</p>
            <p className="text-3xl font-bold text-red-600 mt-1">{stats.absent}</p>
            <p className="text-xs text-gray-400 mt-2">days absent</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Late</p>
            <p className="text-3xl font-bold text-yellow-600 mt-1">{stats.late}</p>
            <p className="text-xs text-gray-400 mt-2">days late</p>
          </div>
        </div>

        {/* Records */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Attendance History</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {records.length === 0 ? (
              <p className="text-center text-gray-400 py-8">No attendance records found.</p>
            ) : (
              records.map((r, i) => {
                const cfg = statusConfig[r.status];
                return (
                  <div key={i} className="flex items-center justify-between px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {new Date(r.date + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${cfg.color}`}>
                      {cfg.label}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
