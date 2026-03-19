'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import StudentLayout from '@/components/Layout/StudentLayout';
import { useAuth } from '@/contexts/AuthContext';
import { getQuizzes, getAttemptsByStudent, type Quiz, type QuizAttempt } from '@/lib/mock-data';

export default function StudentTests() {
  const { currentUser } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);

  useEffect(() => {
    setQuizzes(getQuizzes());
    if (currentUser) setAttempts(getAttemptsByStudent(currentUser.id));
  }, [currentUser]);

  function getAttempt(quizId: string): QuizAttempt | undefined {
    return attempts.find(a => a.quizId === quizId);
  }

  const totalMarksForQuiz = (q: Quiz) => q.questions.reduce((s, qn) => s + qn.marks, 0);

  return (
    <StudentLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Tests &amp; Quizzes</h1>

        {quizzes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <p className="text-4xl mb-4">📝</p>
            <p className="text-gray-500">No tests available yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {quizzes.map(quiz => {
              const attempt = getAttempt(quiz.id);
              const totalMarks = totalMarksForQuiz(quiz);
              const scorePct = attempt ? Math.round((attempt.score / attempt.totalMarks) * 100) : null;
              const passed = scorePct !== null && scorePct >= 60;

              return (
                <div key={quiz.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{quiz.title}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${quiz.type === 'exam' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                          {quiz.type === 'exam' ? '📋 Exam' : '📝 Quiz'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{quiz.subject}</p>
                    </div>
                    {attempt && scorePct !== null && (
                      <span className={`flex-shrink-0 text-sm font-bold px-3 py-1 rounded-lg ${passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {scorePct}%
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Duration</p>
                      <p className="font-semibold text-gray-800 text-sm">{quiz.duration}m</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Questions</p>
                      <p className="font-semibold text-gray-800 text-sm">{quiz.questions.length}</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Marks</p>
                      <p className="font-semibold text-gray-800 text-sm">{totalMarks}</p>
                    </div>
                  </div>

                  {attempt ? (
                    <div className="flex gap-2">
                      <div className={`flex-1 text-center py-2 rounded-lg text-sm font-medium ${passed ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {passed ? '✅ Passed' : '❌ Failed'} — {attempt.score}/{attempt.totalMarks}
                      </div>
                      <Link
                        href={`/student/tests/results/${attempt.id}`}
                        className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-200 transition-colors"
                      >
                        View
                      </Link>
                    </div>
                  ) : (
                    <Link
                      href={`/student/tests/${quiz.id}`}
                      className="block text-center w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Take Test →
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
