'use client';

import { useEffect, useState } from 'react';
import TutorLayout from '@/components/Layout/TutorLayout';
import { getAllStudents, getAttemptsByStudent } from '@/lib/mock-data';

interface StudentRank {
  id: string;
  name: string;
  enrollmentNumber: string;
  batch: string;
  totalScore: number;
  testsTaken: number;
}

export default function TutorRankings() {
  const [rankings, setRankings] = useState<StudentRank[]>([]);

  useEffect(() => {
    const students = getAllStudents();
    const ranked = students.map(s => {
      const attempts = getAttemptsByStudent(s.id);
      const totalScore = attempts.reduce((sum, a) => sum + Math.round((a.score / a.totalMarks) * 100), 0);
      return {
        id: s.id,
        name: s.name,
        enrollmentNumber: s.enrollmentNumber ?? '-',
        batch: s.batch ?? '-',
        totalScore,
        testsTaken: attempts.length,
      };
    }).sort((a, b) => b.totalScore - a.totalScore);
    setRankings(ranked);
  }, []);

  const medalColors = ['🥇', '🥈', '🥉'];

  return (
    <TutorLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Student Rankings</h1>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="text-sm text-gray-500">Ranked by total cumulative test score percentage</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Rank</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Enrollment</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Batch</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Score</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Tests Taken</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rankings.map((s, i) => (
                  <tr key={s.id} className={`hover:bg-gray-50 transition-colors ${i < 3 ? 'font-medium' : ''}`}>
                    <td className="px-5 py-4 text-sm">
                      <span className="flex items-center gap-2">
                        {i < 3 ? <span className="text-xl">{medalColors[i]}</span> : <span className="text-gray-500 w-7 text-center">{i + 1}</span>}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-900">{s.name}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{s.enrollmentNumber}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">
                      <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs">{s.batch}</span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className={`font-bold text-sm ${i === 0 ? 'text-yellow-600' : i === 1 ? 'text-gray-500' : i === 2 ? 'text-amber-600' : 'text-gray-700'}`}>
                        {s.totalScore}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right text-sm text-gray-600">{s.testsTaken}</td>
                  </tr>
                ))}
                {rankings.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-gray-400">No students found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </TutorLayout>
  );
}
