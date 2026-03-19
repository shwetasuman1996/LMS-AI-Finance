'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import StudentLayout from '@/components/Layout/StudentLayout';
import { getQuizAttempts, getQuizById, type QuizAttempt, type Quiz } from '@/lib/mock-data';

export default function TestResultsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);

  useEffect(() => {
    const attempts = getQuizAttempts();
    const found = attempts.find(a => a.id === params.id);
    if (!found) { router.replace('/student/tests'); return; }
    setAttempt(found);
    const q = getQuizById(found.quizId);
    if (q) setQuiz(q);
  }, [params.id, router]);

  if (!attempt || !quiz) {
    return (
      <StudentLayout>
        <div className="min-h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
        </div>
      </StudentLayout>
    );
  }

  const pct = Math.round((attempt.score / attempt.totalMarks) * 100);
  const passed = pct >= 60;

  return (
    <StudentLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Result Header */}
        <div className={`rounded-2xl p-8 text-center ${passed ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-rose-600'} text-white`}>
          <p className="text-5xl mb-3">{passed ? '🏆' : '😔'}</p>
          <h1 className="text-2xl font-bold mb-1">{quiz.title}</h1>
          <p className="text-3xl font-black mt-3">{attempt.score}/{attempt.totalMarks}</p>
          <p className="text-xl font-semibold opacity-90">{pct}%</p>
          <span className={`inline-block mt-3 px-4 py-1.5 rounded-full text-sm font-bold ${passed ? 'bg-white text-green-700' : 'bg-white text-red-700'}`}>
            {passed ? '✅ PASSED' : '❌ FAILED'}
          </span>
          <p className="text-sm opacity-75 mt-2">Submitted on {new Date(attempt.submittedAt).toLocaleString()}</p>
        </div>

        {/* Answer Review */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Answer Review</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {quiz.questions.map((q, qi) => {
              const studentAnswer = attempt.answers[qi];
              const isCorrect = studentAnswer === q.correctAnswer;
              return (
                <div key={q.id} className="p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {isCorrect ? '✓' : '✗'}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">Q{qi + 1}. {q.text}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{q.marks} mark{q.marks !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <div className="ml-10 space-y-1.5">
                    {q.options.map((opt, oi) => {
                      const isStudentPick = studentAnswer === oi;
                      const isCorrectOpt = q.correctAnswer === oi;
                      return (
                        <div
                          key={oi}
                          className={`flex items-center gap-2 p-2 rounded-lg text-sm ${isCorrectOpt ? 'bg-green-50 text-green-800 font-medium' : isStudentPick && !isCorrectOpt ? 'bg-red-50 text-red-800' : 'text-gray-600'}`}
                        >
                          <span className="font-medium">{String.fromCharCode(65 + oi)}.</span>
                          <span>{opt}</span>
                          {isCorrectOpt && <span className="ml-auto text-green-600 text-xs">✓ Correct</span>}
                          {isStudentPick && !isCorrectOpt && <span className="ml-auto text-red-600 text-xs">Your answer</span>}
                        </div>
                      );
                    })}
                    {studentAnswer === -1 && (
                      <p className="text-xs text-gray-400 italic">Not answered</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-center">
          <Link href="/student/tests" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            ← Back to Tests
          </Link>
        </div>
      </div>
    </StudentLayout>
  );
}
