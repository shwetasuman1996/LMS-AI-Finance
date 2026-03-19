'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import TutorLayout from '@/components/Layout/TutorLayout';
import { useAuth } from '@/contexts/AuthContext';
import { getQuizzes, deleteQuiz, type Quiz } from '@/lib/mock-data';

export default function TutorQuizzes() {
  const { currentUser } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    if (currentUser) setQuizzes(getQuizzes().filter(q => q.tutorId === currentUser.id));
  }, [currentUser]);

  function handleDelete(id: string) {
    if (!confirm('Delete this quiz?')) return;
    deleteQuiz(id);
    setQuizzes(prev => prev.filter(q => q.id !== id));
  }

  return (
    <TutorLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">My Quizzes</h1>
          <Link href="/tutor/quizzes/create" className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
            ➕ Create Quiz
          </Link>
        </div>

        {quizzes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <p className="text-4xl mb-4">📝</p>
            <p className="text-gray-500 mb-4">No quizzes created yet.</p>
            <Link href="/tutor/quizzes/create" className="bg-emerald-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700">
              Create your first quiz
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {quizzes.map(quiz => (
              <div key={quiz.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{quiz.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${quiz.type === 'exam' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                        {quiz.type === 'exam' ? 'Exam' : 'Quiz'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{quiz.subject}</p>
                  </div>
                  <button onClick={() => handleDelete(quiz.id)} className="text-red-400 hover:text-red-600 text-sm p-1" title="Delete">🗑️</button>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Questions</p>
                    <p className="font-semibold text-gray-800 text-sm">{quiz.questions.length}</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="font-semibold text-gray-800 text-sm">{quiz.duration}m</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Marks</p>
                    <p className="font-semibold text-gray-800 text-sm">{quiz.questions.reduce((s, q) => s + q.marks, 0)}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400">Created {new Date(quiz.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </TutorLayout>
  );
}
