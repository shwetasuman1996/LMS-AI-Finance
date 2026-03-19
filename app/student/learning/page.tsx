'use client';

import { useState, useEffect } from 'react';
import StudentLayout from '@/components/Layout/StudentLayout';
import { useAuth } from '@/contexts/AuthContext';
import { getLearningModules, getStudentProgress, updateProgress, type LearningModule, type StudentProgress } from '@/lib/mock-data';

export default function StudentLearning() {
  const { currentUser } = useAuth();
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [progress, setProgress] = useState<StudentProgress[]>([]);

  useEffect(() => {
    setModules(getLearningModules());
    if (currentUser) setProgress(getStudentProgress(currentUser.id));
  }, [currentUser]);

  function getCompleted(moduleId: string): number {
    return progress.find(p => p.moduleId === moduleId)?.completedLessons ?? 0;
  }

  function handleMarkLesson(moduleId: string, totalLessons: number) {
    if (!currentUser) return;
    const current = getCompleted(moduleId);
    if (current >= totalLessons) return;
    updateProgress(currentUser.id, moduleId, current + 1);
    setProgress(getStudentProgress(currentUser.id));
  }

  const totalLessons = modules.reduce((s, m) => s + m.totalLessons, 0);
  const completedTotal = modules.reduce((s, m) => s + getCompleted(m.id), 0);
  const overallPct = totalLessons > 0 ? Math.round((completedTotal / totalLessons) * 100) : 0;

  return (
    <StudentLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Learning Modules</h1>

        {/* Overall Progress */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-xl p-6 text-white">
          <div className="flex justify-between items-center mb-3">
            <span className="text-indigo-100 font-medium">Overall Progress</span>
            <span className="text-2xl font-bold">{overallPct}%</span>
          </div>
          <div className="bg-indigo-900 bg-opacity-50 rounded-full h-3">
            <div className="bg-white rounded-full h-3 transition-all duration-500" style={{ width: `${overallPct}%` }} />
          </div>
          <p className="text-indigo-200 text-sm mt-2">{completedTotal} of {totalLessons} lessons completed</p>
        </div>

        {/* Modules */}
        <div className="grid md:grid-cols-2 gap-4">
          {modules.map(mod => {
            const completed = getCompleted(mod.id);
            const pct = Math.round((completed / mod.totalLessons) * 100);
            const isDone = completed >= mod.totalLessons;
            return (
              <div key={mod.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-start gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${isDone ? 'bg-green-100' : 'bg-indigo-100'}`}>
                    <span className="text-xl">{isDone ? '✅' : '📖'}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{mod.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{mod.subject}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">{mod.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{completed}/{mod.totalLessons} lessons</span>
                    <span className={`font-semibold ${isDone ? 'text-green-600' : 'text-indigo-600'}`}>{pct}%</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${isDone ? 'bg-green-500' : 'bg-indigo-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                {!isDone && (
                  <button
                    onClick={() => handleMarkLesson(mod.id, mod.totalLessons)}
                    className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Mark Next Lesson Complete
                  </button>
                )}
                {isDone && (
                  <div className="mt-4 text-center text-green-600 text-sm font-medium">🎉 Module Completed!</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </StudentLayout>
  );
}
